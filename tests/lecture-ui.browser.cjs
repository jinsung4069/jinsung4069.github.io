// Exercise every slide in the four course catalogs, using their actual renderers.
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict');
const {default:AxeBuilder}=require('@axe-core/playwright');
const fs=require('node:fs'),path=require('node:path');
const base=process.argv[2]||'http://127.0.0.1:8772';
const only=process.argv[3]?.split(',');
function htmlFiles(folder){return fs.readdirSync(folder,{withFileTypes:true}).flatMap(e=>e.isDirectory()?htmlFiles(path.join(folder,e.name)):e.name==='index.html'?[path.join(folder,e.name)]:[])}
(async()=>{
 const browser=await chromium.launch({headless:true,...(process.env.PW_CHANNEL==='none'?{}:{channel:process.env.PW_CHANNEL||'msedge'})});
 const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'}),page=await context.newPage(),errors=[],failures=[];
 page.on('pageerror',e=>errors.push(e.message));
 const counts={decks:0,slides:0,activities:0,catalogs:0};
 function fail(message){if(failures.length<100)failures.push(message)}
 async function geometry(label){
  const issues=await page.evaluate(()=>{
   const bar=document.querySelector('.lecture-tools'),stage=document.querySelector('.ce-stage'),r=bar.getBoundingClientRect(),s=stage.getBoundingClientRect(),issues=[];
   if(r.bottom>s.top+2)issues.push('toolbar overlaps content');
   if(document.documentElement.scrollWidth>innerWidth+2)issues.push(`page overflow ${document.documentElement.scrollWidth}/${innerWidth}`);
   for(const b of bar.querySelectorAll('button,summary')){const r=b.getBoundingClientRect();if(!r.width||!r.height)continue;if(r.width<43||r.height<43)issues.push(`small target ${b.textContent.trim()}`);if(r.left<0||r.right>innerWidth+2)issues.push(`control outside viewport ${b.textContent.trim()}`)}
   return issues;
  });issues.forEach(issue=>fail(label+': '+issue));
 }
 try{
  const pages=htmlFiles('lectures');
  for(const file of pages){
   const html=fs.readFileSync(file,'utf8');assert(html.includes('/css/lecture-ui.css'),file+' shared layout');
   if(!/class="ce-viewer|id="presentation"/.test(html))continue;
   const deck=path.dirname(file).replaceAll(path.sep,'/').replace(/^lectures\//,'');if(only&&!only.includes(deck))continue;
   const algorithm=deck.startsWith('ai-algorithm/'),input=algorithm?'#pageNumber':'#ce-page';
   await page.setViewportSize({width:1440,height:1000});await page.goto(base+'/'+path.dirname(file).replaceAll(path.sep,'/')+'/',{waitUntil:'domcontentloaded'});await page.waitForSelector('[data-ready=true]');
   assert.equal(await page.locator('.lecture-tools').count(),1,deck+' one toolbar');assert.equal(await page.locator('.ce-stage .ce-toolbar').count(),0,deck+' no overlay');
   const n=Number(await page.locator(input).getAttribute('max'));assert(n>0,deck+' total');
   let activities=0;
   for(const width of [1440,390]){
    await page.setViewportSize({width,height:width===1440?1000:844});
    for(let i=1;i<=n;i++){
     await page.evaluate(i=>{location.hash='slide-'+i},i);await page.waitForFunction(({input,i})=>Number(document.querySelector(input).value)===i,{input,i});
     assert.equal((await page.locator('#ce-page-label').textContent()).trim(),`${i} / ${n}`,deck+' counter '+i);
     await geometry(`${deck} ${i} at ${width}`);
     const lab=await page.evaluate(()=>document.querySelector('.ce-stage').classList.contains('lab-mode'));
     if(lab&&width===1440)activities++;
     if(lab&&deck.startsWith('microdegree1/')){
      const size=await page.locator('#ce-lab').evaluate(el=>parseFloat(getComputedStyle(el).fontSize));assert(size>=16,deck+' readable activity text '+i);
      const empty=await page.locator('#ce-lab').innerText();assert(!empty.includes('이 체험을 불러오지 못했습니다'),deck+' missing activity '+i);
     }
    }
   }
   counts.decks++;counts.slides+=n;counts.activities+=activities;console.log('PASS',deck,n,'slides',activities,'activities');
  }
  if(!only){
   for(const course of ['', 'ai-algorithm/','ai-education/','computer-education2/','microdegree1/']){
    await page.goto(base+'/lectures/'+course,{waitUntil:'domcontentloaded'});await page.getByRole('searchbox',{name:'강의 찾기'}).fill('없는검색어_UI_TEST');assert.match(await page.locator('.lecture-catalog-search [role=status]').innerText(),/검색 결과가 없습니다/);
    await page.getByRole('searchbox',{name:'강의 찾기'}).fill('');assert(await page.locator('a.course-entry:visible,a.ce-card:visible').count()>0);assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2));counts.catalogs++;
   }
   await page.goto(base+'/lectures/microdegree1/3-1/',{waitUntil:'domcontentloaded'});await page.waitForSelector('[data-ready=true]');
   const data=await (await page.request.get(base+'/data/lectures/microdegree1/3-1.json')).json(),fit=data.slides.findIndex(s=>s.labId==='s31Fit')+1;
   await page.evaluate(i=>location.hash='slide-'+i,fit);await page.waitForSelector('.s31-fit-choices');
   const states=[['직선',[70,70]],['완만한 곡선',[90,90]],['구불구불한 곡선',[100,70]]];
   for(const [name,scores]of states){await page.getByRole('button',{name,exact:true}).click();assert.equal(await page.getByRole('button',{name,exact:true}).getAttribute('aria-pressed'),'true');assert.deepEqual(await page.locator('.s31-fit-score strong').allTextContents(),scores.map(n=>`정확도 ${n}%`));}
   await page.getByRole('button',{name:'읽기 모드',exact:true}).click();assert(await page.locator('.lecture-reader').isVisible());assert.equal(await page.getByRole('button',{name:'구불구불한 곡선',exact:true}).getAttribute('aria-pressed'),'true');
   await page.getByRole('button',{name:'활동 초기화',exact:true}).click();assert.equal(await page.getByRole('button',{name:'직선',exact:true}).getAttribute('aria-pressed'),'true');
   for(const deck of ['computer-education2/8','ai-education/chapter1','ai-algorithm/week2']){
    await page.goto(base+'/lectures/'+deck+'/#slide-2',{waitUntil:'domcontentloaded'});await page.waitForSelector('[data-ready=true]');
    await page.locator('.lecture-more summary').click();await page.getByRole('button',{name:'북마크',exact:true}).click();await page.locator('.lecture-more summary').click();assert(await page.getByRole('button',{name:'북마크 해제',exact:true}).isVisible());await page.keyboard.press('Escape');
    await page.locator('.lecture-more summary').click();await page.getByRole('button',{name:'선택 인쇄',exact:true}).click();assert(await page.locator('#lecture-print-options').isVisible());await page.getByRole('button',{name:'닫기',exact:true}).last().click();
    await page.locator('#ce-fullscreen,#fullscreenButton').click();await page.waitForFunction(()=>!!document.fullscreenElement);await geometry(deck+' fullscreen');await page.locator('#ce-next,#next').click();assert.equal(await page.locator('#ce-page-label').innerText(),`3 / ${await page.locator('#ce-page,#pageNumber').getAttribute('max')}`);await page.evaluate(()=>document.exitFullscreen());
    for(const theme of ['light','dark']){
     await page.evaluate(theme=>document.documentElement.dataset.theme=theme,theme);await page.locator('.lecture-more summary').click();
     const audit=await new AxeBuilder({page}).include('.lecture-tools').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
     assert.deepEqual(audit.violations.filter(v=>['serious','critical'].includes(v.impact)).map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),[],deck+' '+theme+' tools accessibility');
     await page.keyboard.press('Escape');
    }
    await page.setViewportSize({width:320,height:740});await geometry(deck+' at 320');await page.evaluate(()=>document.documentElement.dataset.theme='light');
   }
  }
  assert.deepEqual(errors,[],'page errors');assert.deepEqual(failures,[],'layout regressions');console.log(JSON.stringify(counts));
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});
