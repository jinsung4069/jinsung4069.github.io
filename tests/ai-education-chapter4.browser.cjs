const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
(async()=>{
 const base=process.argv[2]||'http://127.0.0.1:8765',out=process.argv[3]||'tmp/chapter4-html/qa';fs.mkdirSync(out,{recursive:true});
 const browser=await chromium.launch({headless:true,channel:'msedge'}),page=await browser.newPage({viewport:{width:1440,height:1050}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base+'/ai-education-chapter4/');await page.waitForSelector('[data-ready=true]');
 const data=await page.evaluate(()=>fetch('/data/lectures/ai-education/4.json').then(r=>r.json()));assert.equal(data.slides.length,61);assert.equal(data.slides.filter(s=>s.sourceSlide).length,55);
 const go=async n=>{await page.evaluate(n=>location.hash='slide-'+n,n);await page.waitForFunction(n=>Number(document.querySelector('#ce-page').value)===n,n)};
 for(let n=1;n<=61;n++){
  await go(n);await page.waitForFunction(()=>[...document.querySelectorAll('#ae-slide img')].every(im=>im.complete&&im.naturalWidth>0));
  assert(await page.locator('#ce-loading').isHidden());
  if(data.slides[n-1].kind!=='lab'){
   const bad=await page.locator('#ae-slide').evaluate(el=>[...el.querySelectorAll('.ae-run')].filter(r=>parseFloat(r.style.top)<-1||parseFloat(r.style.top)+parseFloat(r.style.lineHeight)>parseFloat(el.style.height)+3).map(r=>r.textContent));assert.deepEqual(bad,[],`text outside slide ${n}`);
   for(const im of await page.locator('.ch4-picture').all()){await im.click();assert(await page.locator('#ch4-image-dialog').isVisible());await page.keyboard.press('d');assert.equal(new URL(page.url()).hash,'#slide-'+n);await page.keyboard.press('Escape');assert(await page.locator('#ch4-image-dialog').isHidden())}
  }
  await page.screenshot({path:path.join(out,`${String(n).padStart(2,'0')}.png`)});
 }
 await go(28);await page.locator('[data-field=goal]').fill('학생이 근거를 설명한다');await page.keyboard.press('a');assert.equal(new URL(page.url()).hash,'#slide-28');await page.locator('[data-field=goal]').fill('학생이 근거를 설명한다');await page.locator('[data-case=a]').selectOption('3');assert((await page.locator('[data-case-info=a]').innerText()).includes('사진의 특징'));
 await go(36);assert((await page.locator('[data-design-result]').innerText()).includes('모델 A 96장'));await page.locator('[data-count="0"]').fill('47');assert((await page.locator('[data-design-result]').innerText()).includes('같게 맞추고'));await page.locator('[data-count="0"]').fill('48');await page.locator('[data-overlap]').check();assert((await page.locator('[data-design-result]').innerText()).includes('중복'));
 await go(42);await page.locator('[data-row="0"][data-key=a]').selectOption('컵');await page.locator('[data-row="0"][data-key=b]').selectOption('보류');assert((await page.locator('[data-log-result]').innerText()).includes('부분 기록'));await page.locator('[data-stage]').selectOption('final');assert.equal(await page.locator('.ch4-log tbody tr').count(),48);await page.locator('[data-changed]').check();assert((await page.locator('[data-validity]').innerText()).includes('새로운 최종 평가 사진'));await page.locator('[data-stage]').selectOption('development');assert.equal(await page.locator('[data-row="0"][data-key=a]').inputValue(),'컵');
 await go(45);assert((await page.locator('[data-metrics]').innerText()).includes('79.2%'));await page.locator('[data-matrix="2"]').fill('12');assert((await page.locator('[data-metrics]').innerText()).includes('33.3%'));await page.locator('[data-matrix="0"]').fill('-1');assert((await page.locator('[data-metrics]').innerText()).includes('정수'));await page.locator('[data-reset-example]').click();for(const i of await page.locator('[data-matrix]').all())await i.fill('0');assert.equal(await page.locator('[data-metrics] strong').filter({hasText:'계산 불가'}).count(),6);await page.locator('[data-reset-example]').click();
 await go(51);await page.locator('[data-threshold]').fill('100');assert((await page.locator('[data-threshold-metrics]').innerText()).includes('100.0%'));assert((await page.locator('[data-threshold-metrics]').innerText()).includes('계산 불가'));await page.locator('[data-threshold]').fill('70');
 await go(57);await page.locator('[data-field=observation]').fill('미실행, 실험 계획 단계');const download=page.waitForEvent('download');await page.locator('[data-download]').click();const file=await download;await file.saveAs(path.join(out,'activity.json'));const saved=JSON.parse(fs.readFileSync(path.join(out,'activity.json'),'utf8'));assert.equal(saved.comparison.goal,'학생이 근거를 설명한다');assert.equal(saved.evaluation.development[0].a,'컵');assert(saved.matrixExample.kind.includes('실제 실험 결과 아님'));
 await page.reload();await page.waitForSelector('[data-ready=true]');assert.equal(await page.locator('[data-field=observation]').inputValue(),'미실행, 실험 계획 단계');await go(28);assert.equal(await page.locator('[data-field=goal]').inputValue(),'학생이 근거를 설명한다');
 await page.locator('#ce-next').focus();await page.keyboard.press('d');assert.equal(new URL(page.url()).hash,'#slide-29');await page.keyboard.press('a');assert.equal(new URL(page.url()).hash,'#slide-28');await page.keyboard.press('f');await page.waitForFunction(()=>!!document.fullscreenElement);await page.keyboard.press('f');await page.waitForFunction(()=>!document.fullscreenElement);
 await page.locator('#ce-open-toc').focus();await page.locator('#ce-open-toc').click();await page.locator('#ce-search').fill('混同');assert.equal(await page.locator('#ce-toc button:visible').count(),0);await page.locator('#ce-search').fill('혼동행렬');assert((await page.locator('#ce-toc button:visible').count())>=2);await page.keyboard.press('Escape');
 await page.setViewportSize({width:390,height:844});
 for(const n of [5,14,19,28,36,42,45,51,57]){await go(n);assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`mobile overflow ${n}`);await page.screenshot({path:path.join(out,`mobile-${n}.png`)});}
 await page.setViewportSize({width:1440,height:1050});
 const printPage=await browser.newPage({viewport:{width:1440,height:1000}});printPage.on('pageerror',e=>errors.push(e.message));
 await printPage.goto(base+'/ai-education-chapter4/?lecture-print=1');await printPage.evaluate(()=>LecturePrint.prepare());await printPage.waitForFunction(()=>document.documentElement.dataset.printReady==='true',{},{timeout:120000});assert.equal(await printPage.locator('.lecture-print-sheet').count(),61);await printPage.pdf({path:path.join(out,'chapter4.pdf'),preferCSSPageSize:true,printBackground:true});
 // Shared renderer still loads the existing graduate decks.
 for(const chapter of [1,3]){await page.goto(base+`/ai-education-chapter${chapter}/`);await page.waitForSelector('[data-ready=true]');assert(await page.locator('#ce-loading').isHidden())}
 assert.deepEqual(errors,[]);console.log('PASS: 55 original slides, 6 activities, 18 image zooms, calculations, record persistence and export, keyboard, mobile, 61 print sheets and existing decks.');await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
