const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'msedge'});
 const page=await browser.newPage({viewport:{width:1440,height:1000}}), errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 const base=process.argv[2]||'http://127.0.0.1:8765';
 await page.goto(base+'/ai-algorithm-week3/');await page.waitForSelector('.slide:not([hidden])');await page.evaluate(()=>document.fonts.ready);
 const slides=await page.evaluate(()=>WEEK3.slides);assert.equal(slides.length,55);
 const go=async kind=>{const i=slides.findIndex(s=>s.lab===kind);assert(i>=0);await page.evaluate(n=>location.hash='slide-'+n,i+1);await page.locator(`.slide[data-lab=${kind}]`).waitFor({state:'visible'});return page.locator(`.lab[data-kind=${kind}]`)};
 await page.keyboard.press('d');assert.equal(new URL(page.url()).hash,'#slide-2');await page.keyboard.press('a');assert.equal(new URL(page.url()).hash,'#slide-1');await page.keyboard.press('ArrowRight');assert.equal(new URL(page.url()).hash,'#slide-2');
 await page.keyboard.press('f');await page.waitForFunction(()=>!!document.fullscreenElement);await page.keyboard.press('f');await page.waitForFunction(()=>!document.fullscreenElement);
 let lab=await go('concept');await lab.locator('[data-answer="0"]').click();assert.match(await lab.locator('.result').innerText(),/맞습니다/);
 lab=await go('history');await lab.locator('[data-q="2"]').click();await lab.locator('[data-answer="2"]').click();assert.match(await lab.locator('.result').innerText(),/맞습니다/);
 lab=await go('rules');assert.match(await lab.locator('.result').innerText(),/대출 가능/);await lab.locator('#rule-overdue').check();assert.match(await lab.locator('.result').innerText(),/대출 불가/);
 lab=await go('threshold');await lab.locator('[data-test]').click();assert.match(await lab.locator('.result').innerText(),/테스트: 3 \/ 4/);assert(await lab.locator('input').isDisabled());await lab.locator('[data-reset]').click();assert.match(await lab.locator('.result').innerText(),/독립적인 최종 성능/);
 lab=await go('neighbors');assert.match(await lab.locator('.result').innerText(),/예측 B/);await lab.locator('select').selectOption('1');assert.match(await lab.locator('.result').innerText(),/예측 A/);
 lab=await go('cluster');for(let i=0;i<6;i++)await lab.locator('[data-step]').click();assert.match(await lab.locator('.result').innerText(),/중심 2, 8/);
 lab=await go('reward');await lab.locator('input').fill('5');assert.match(await lab.locator('.result').innerText(),/우회 경로의 보상이 더 큽니다/);
 lab=await go('neuron');await lab.locator('#nx2').selectOption('0');assert.match(await lab.locator('.result').innerText(),/출력 0/);await lab.locator('[data-or]').click();assert.match(await lab.locator('.result').innerText(),/출력 1/);
 lab=await go('gradient');await lab.locator('[data-ten]').click();assert.match(await lab.locator('.result').innerText(),/w = 1.996/);await lab.locator('[data-reset]').click();await lab.locator('select').selectOption('.3');await lab.locator('[data-step]').click();assert.match(await lab.locator('.result').innerText(),/손실이 증가/);
 lab=await go('tokens');await lab.locator('[data-token="1"]').click();await lab.locator('[data-token="0"]').click();assert.equal(await lab.locator('.token-sentence').innerText(),'오늘은 비 오는 날입니다.');
 lab=await go('evaluation');assert.match(await lab.locator('.result').innerText(),/정확도 62.5%/);await lab.locator('input').fill('0.8');assert.match(await lab.locator('.result').innerText(),/정확도 75%/);
 lab=await go('process');await lab.locator('[data-answer="1"]').click();assert.match(await lab.locator('.result').innerText(),/맞습니다/);
 lab=await go('reflection');await lab.locator('textarea').first().fill('새 데이터에도 적용할 수 있는가?');const before=page.url();await page.keyboard.press('d');assert.equal(page.url(),before);assert.match(await lab.locator('textarea').first().inputValue(),/d$/);
 const [download]=await Promise.all([page.waitForEvent('download'),lab.locator('[data-download]').click()]);assert.equal(download.suggestedFilename(),'AI알고리즘_3주차_활동기록.txt');
 await page.locator('#tocButton').focus();await page.locator('#tocButton').click();await page.locator('#tocSearch').fill('기계학습');assert(await page.locator('#tocContents button:visible').count()>0);await page.locator('#tocSearch').fill('검색어없음xyz');assert(await page.locator('#tocEmpty').isVisible());await page.keyboard.press('Escape');
 const layout=[];const captures=process.argv[3];if(captures)fs.mkdirSync(captures,{recursive:true});
 for(let i=0;i<slides.length;i++){
  await page.evaluate(n=>location.hash='slide-'+n,i+1);await page.locator(`#slide-${i+1}`).waitFor({state:'visible'});
  const issue=await page.locator(`#slide-${i+1}`).evaluate(el=>{const body=el.querySelector('.slide-body');return {slide:el.id,bodyOverflow:body?body.scrollHeight-body.clientHeight:0,width:el.scrollWidth-el.clientWidth,fonts:getComputedStyle(el).fontFamily}});layout.push(issue);
  if(captures)await page.locator('#stage').screenshot({path:`${captures}/${String(i+1).padStart(2,'0')}.png`});
 }
 assert.deepEqual(layout.filter(x=>x.bodyOverflow>3||x.width>3),[]);
 await page.setViewportSize({width:390,height:844});
 for(let i=0;i<slides.length;i++){await page.evaluate(n=>location.hash='slide-'+n,i+1);await page.locator(`#slide-${i+1}`).waitFor({state:'visible'});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`mobile overflow ${i+1}`)}
 await page.setViewportSize({width:320,height:700});lab=await go('neuron');assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'320px overflow');
 await page.evaluate(()=>location.hash='slide-2');await page.locator('#slide-2').waitFor({state:'visible'});await page.evaluate(()=>{const el=document.querySelector('#stage');for(const [type,x,y] of [['touchstart',280,300],['touchend',70,310]])el.dispatchEvent(new TouchEvent(type,{bubbles:true,changedTouches:[new Touch({identifier:1,target:el,clientX:x,clientY:y})]}))});assert.equal(new URL(page.url()).hash,'#slide-3');
 await page.close();
 const printPage=await browser.newPage({viewport:{width:1440,height:1000}});printPage.on('pageerror',e=>errors.push(e.message));await printPage.goto(base+'/ai-algorithm-week3/?lecture-print=1');await printPage.waitForFunction(()=>window.WEEK3&&window.LecturePrint);await printPage.evaluate(()=>LecturePrint.prepare());await printPage.waitForSelector('html[data-print-ready=true]');assert.equal(await printPage.locator('.lecture-print-sheet').count(),55);
 if(captures)await printPage.pdf({path:`${captures}/week3.pdf`,preferCSSPageSize:true,printBackground:true});
 assert.deepEqual(errors,[]);await browser.close();console.log('PASS: 55 desktop/mobile slides, 13 interactive activities, navigation, fullscreen, download, search, touch and 55 A4 print sheets');
})().catch(e=>{console.error(e);process.exit(1)});
