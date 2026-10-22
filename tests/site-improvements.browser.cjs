const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const {default:AxeBuilder}=require('@axe-core/playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const base=process.argv[2]||'http://127.0.0.1:8772';
(async()=>{
 const browser=await chromium.launch({headless:true,...(process.env.PW_CHANNEL==='none'?{}:{channel:process.env.PW_CHANNEL||'msedge'})});
 let passed=0;
 async function scenario(name,fn){const context=await browser.newContext({viewport:{width:1440,height:1000}});const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));try{await fn(page,context);assert.deepEqual(errors,[]);console.log('PASS',name);passed++}finally{await context.close()}}
 async function audit(page,selector){let builder=new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']);if(selector)builder=builder.include(selector);const result=await builder.analyze();assert.deepEqual(result.violations.filter(v=>['serious','critical'].includes(v.impact)).map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),[])}
 try{
  await scenario('home search, category, empty state, bilingual and mobile menu',async p=>{
   await p.goto(base+'/');await p.locator('#project-search').fill('데이터베이스');assert.equal(await p.locator('.project-card-link:visible').count(),1);
   await p.locator('#project-category').selectOption('game');assert.equal(await p.locator('.project-card-link:visible').count(),0);assert.match(await p.locator('#project-result').innerText(),/검색 결과가 없습니다/);
   await p.locator('#project-search').fill('');assert.equal(await p.locator('.project-card-link:visible').count(),3);
   await p.locator('#languageToggle').click();assert.equal(await p.locator('#project-result').innerText(),'3 projects');await audit(p,'.project-filter');
   await p.setViewportSize({width:390,height:844});await p.locator('#mobileMenuToggle').click();await p.locator('#mobileNav').getByRole('link',{name:'Lectures',exact:true}).click();assert.match(p.url(),/\/lectures\/$/);
  });
  await scenario('SQLite lazy download, real queries, independent attempts, failure recovery',async(p,context)=>{
   let csv=0;context.on('request',r=>{if(r.url().includes('kci_articles.csv'))csv++});
   await p.goto(base+'/database-lab/');assert.equal(csv,0);assert.match(await p.locator('#datasetStatus').innerText(),/실습할 때/);
   await p.locator('.module-tab').nth(1).click();await p.waitForFunction(()=>document.querySelector('.dataset-status-pill.ready'),{},{timeout:60000});assert.equal(csv,1);
   await p.locator('#runSearchExperience').click();await p.waitForFunction(()=>document.querySelector('.search-form .result-meta').textContent.includes(': 1'));assert(await p.locator('.sql-preview-panel table tbody tr').count()>0);
   await p.locator('#runSearchExperience').click();await p.waitForFunction(()=>document.querySelector('.search-form .result-meta').textContent.includes(': 2'));await p.locator('#checkAnswer').click();assert.match(await p.locator('#feedbackBox').innerText(),/완료/);
   for(const index of [2,3]){await p.locator('.module-tab').nth(index).click();const sample=await p.locator('.sample-code').innerText();for(let repeat=0;repeat<2;repeat++){const before=await p.evaluate(()=>{const v=JSON.parse(localStorage.getItem('databaseLabProgressV1'));return v.attempts[v.currentModule]||0});await p.locator('#sqlAnswer').fill(sample);await p.locator('#checkAnswer').click();await p.waitForFunction(before=>{const v=JSON.parse(localStorage.getItem('databaseLabProgressV1'));return v.attempts[v.currentModule]>before},before);assert(await p.locator('#feedbackBox').evaluate(e=>e.classList.contains('success')));}}
   assert.equal(csv,1,'dataset built once');
   await p.locator('#sqlAnswer').fill('WITH RECURSIVE count(x) AS (VALUES(1) UNION ALL SELECT x+1 FROM count) SELECT sum(x) FROM count;');await p.locator('#checkAnswer').click();
   await p.locator('#languageToggle').click();assert.equal(await p.locator('html').getAttribute('lang'),'en','UI remains responsive during query');
   await p.waitForFunction(()=>document.querySelector('.dataset-status-pill.error'),{},{timeout:20000});await p.locator('#loadDataset').click();await p.waitForFunction(()=>document.querySelector('.dataset-status-pill.ready'),{},{timeout:60000});assert.equal(csv,2);
  });
  await scenario('reader, share fallback, bookmark, resume, selection print, mobile tools',async(p,context)=>{
   await context.addInitScript(()=>{Object.defineProperty(navigator,'clipboard',{value:{writeText:()=>Promise.reject(Error('test denied'))}});window.print=()=>{window.printed=[...document.querySelectorAll('.lecture-print-sheet')].map(s=>s.dataset.slide)}});
   await p.goto(base+'/lectures/computer-education2/8/#slide-2');await p.waitForSelector('[data-ready=true]');
   await p.getByRole('button',{name:'읽기 모드',exact:true}).click();assert(await p.locator('.lecture-reader').isVisible());
   await p.getByRole('button',{name:'북마크',exact:true}).click();assert.equal(await p.getByRole('button',{name:'북마크 해제'}).getAttribute('aria-pressed'),'true');
   await p.getByRole('button',{name:'현재 쪽 공유'}).click();assert.match(await p.getByRole('textbox',{name:'현재 쪽 주소'}).inputValue(),/#slide-2$/);await p.locator('dialog[open]').getByRole('button',{name:'닫기'}).click();
   await p.getByRole('button',{name:'선택 인쇄'}).click();await p.locator('#lecture-print-kind').selectOption('range');await p.locator('#lecture-from').fill('999');await p.locator('#lecture-print-kind').selectOption('current');assert(await p.locator('#lecture-from').isDisabled());await p.locator('#lecture-print-kind').selectOption('range');await p.locator('#lecture-from').fill('2');await p.locator('#lecture-to').fill('3');await audit(p,'dialog[open]');await p.getByRole('button',{name:'인쇄 준비'}).click();
   await p.waitForFunction(()=>document.querySelector('.lecture-print-frame')?.contentWindow.printed,{},{timeout:60000});assert.deepEqual(await p.evaluate(()=>document.querySelector('.lecture-print-frame').contentWindow.printed),['2','3']);assert.match(p.url(),/#slide-2$/);
   await p.goto(base+'/lectures/');assert.equal(await p.locator('#learning-library a[href$="#slide-2"]').count(),2);await p.locator('#learning-library a').first().click();await p.waitForSelector('[data-ready=true]');assert.equal(await p.locator('#ce-page').inputValue(),'2');
   await p.setViewportSize({width:390,height:844});assert(await p.locator('.lecture-docked').isVisible());await p.locator('#ce-next').click();assert.equal(await p.locator('#ce-page').inputValue(),'3');assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));await audit(p,'.lecture-tools');
  });
  await scenario('valid backup import, cancellation and wrong backup rejection',async(p,context)=>{
   await p.goto(base+'/programming-language/');await p.locator('.record-tools summary').click();
   const backup={key:'programmingLanguageLabProgressV1',current:{currentModule:'types',completedModules:[],scores:{},attempts:{},code:{}}};
   // Use the exported schema, so this test follows actual module IDs rather than copying them.
   await p.locator('#fillSample').click();await p.locator('#checkCode').click();const value=await p.evaluate(()=>JSON.parse(localStorage.getItem('programmingLanguageLabProgressV1')));backup.current=value;
   await p.locator('.record-tools input').setInputFiles({name:'wrong.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify({...backup,key:'other'}))});await p.waitForFunction(()=>document.querySelector('.record-tools [role=status]').textContent.includes('올바르지'));assert.deepEqual(await p.evaluate(()=>JSON.parse(localStorage.getItem('programmingLanguageLabProgressV1'))),value);
   const restored=structuredClone(value);restored.scores[restored.currentModule]=50;restored.completedModules=[];
   p.once('dialog',d=>d.dismiss());await p.locator('.record-tools input').setInputFiles({name:'cancel.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify({...backup,current:restored}))});assert.deepEqual(await p.evaluate(()=>JSON.parse(localStorage.getItem('programmingLanguageLabProgressV1'))),value);
   p.once('dialog',d=>d.accept());await p.locator('.record-tools input').setInputFiles({name:'restore.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify({...backup,current:restored}))});await p.waitForFunction(()=>document.querySelector('.record-tools [role=status]').textContent.includes('복원'));assert.deepEqual(await p.evaluate(()=>JSON.parse(localStorage.getItem('programmingLanguageLabProgressV1'))),restored);await audit(p,'.record-tools');
  });
  const manifest=JSON.parse(fs.readFileSync('apps/site-build.json','utf8'));
  for(const [name,file]of Object.entries(manifest))await scenario('production assets and layout '+name,async p=>{
   const requests=[];p.on('request',r=>requests.push(r.url()));await p.goto(base+'/'+file.replace(/index.html$/,''));
   if(['microrobot','stackburger'].includes(name)){await p.waitForSelector('#root button');assert(await p.locator('#root').innerText());await p.getByRole('link',{name:'강의자료',exact:true}).isVisible();}
   if(name==='microrobot'){await p.getByRole('button',{name:'정답 보기',exact:true}).click();assert(await p.getByRole('button',{name:'다음 라운드',exact:true}).isVisible());}
   if(name==='stackburger'){await p.getByRole('button',{name:'게임 시작하기',exact:true}).click();await p.getByRole('button',{name:'게임 시작',exact:true}).click();await p.getByRole('button',{name:'카드 뽑기',exact:true}).click();assert(await p.getByRole('button',{name:'다음 차례',exact:true}).isEnabled());}
   assert(!requests.some(u=>/babel|cdn.tailwindcss|react.development/.test(u)));
   for(const width of [390,820,1440]){await p.setViewportSize({width,height:900});assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2),name+' horizontal overflow '+width);}
  });
  for(const name of ['microrobot','stackburger']){const size=fs.statSync(`assets/site/${name}.js`).size;assert(size<210000,`${name}: JS budget 210 KB`)}
  console.log(JSON.stringify({passed,productionBundleBudget:'210 KB per game'}));
 }finally{await browser.close()}
})().catch(error=>{console.error(error);process.exit(1)});
