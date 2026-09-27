const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'msedge'});
 const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 const base=process.argv[2]||'http://127.0.0.1:8765',captures=process.argv[3];
 if(captures)fs.mkdirSync(captures,{recursive:true});
 await page.goto(base+'/ai-algorithm-week4/');await page.waitForSelector('.slide:not([hidden])');await page.evaluate(()=>document.fonts.ready);
 const slides=await page.evaluate(()=>WEEK4.slides);assert.equal(slides.length,45);assert.equal(slides.filter(s=>s.lab).length,10);
 const go=async kind=>{const i=slides.findIndex(s=>s.lab===kind);assert(i>=0);await page.evaluate(n=>location.hash='slide-'+n,i+1);await page.locator(`#slide-${i+1}`).waitFor({state:'visible'});return page.locator(`.lab[data-kind=${kind}]`);};
 await page.keyboard.press('d');assert.equal(new URL(page.url()).hash,'#slide-2');await page.keyboard.press('a');assert.equal(new URL(page.url()).hash,'#slide-1');await page.keyboard.press('ArrowRight');assert.equal(new URL(page.url()).hash,'#slide-2');
 await page.keyboard.press('f');await page.waitForFunction(()=>!!document.fullscreenElement);await page.keyboard.press('f');await page.waitForFunction(()=>!document.fullscreenElement);
 let lab=await go('tasks');for(let i=0;i<3;i++){await lab.locator(`[data-answer="${i}"]`).click();assert.match(await lab.locator('.result').innerText(),/맞습니다/);await lab.locator('[data-next-question]').click();}
 const reveal=async(lab,choice)=>{assert(await lab.locator('.result').isHidden());assert(await lab.locator('[data-reveal]').isDisabled());await lab.locator('[data-prediction]').selectOption(choice);await lab.locator('[data-reveal]').click();assert(await lab.locator('.result').isVisible());};
 lab=await go('threshold');await reveal(lab,'모두 구분할 수 있다');assert.match(await lab.locator('.result').innerText(),/150 \/ 150/);await lab.locator('input').fill('7');await reveal(lab,'일부를 잘못 구분할 것이다');assert.match(await lab.locator('.result').innerText(),/50 \/ 150/);
 lab=await go('neighbors');await reveal(lab,'B');assert.match(await lab.locator('.result').innerText(),/예측 B/);await lab.locator('[data-k]').selectOption('1');await reveal(lab,'A');assert.match(await lab.locator('.result').innerText(),/예측 A/);
 lab=await go('setup');for(const el of await lab.locator('input').all())await el.check();assert.match(await lab.locator('.result').innerText(),/4 \/ 4/);
 lab=await go('wiring');const answers=['Data Table','Tree','Tree Viewer','Test & Score','Confusion Matrix'];for(let i=0;i<answers.length;i++)await lab.locator(`[data-wire="${i}"]`).selectOption(answers[i]);await lab.locator('button').click();assert.match(await lab.locator('.result').innerText(),/모두 맞습니다/);
 lab=await go('iris');assert.equal(await lab.locator('circle').count(),150);await lab.locator('[data-axis-x]').selectOption('0');await lab.locator('[data-axis-y]').selectOption('0');assert.match(await lab.locator('.result').innerText(),/대각선/);await lab.locator('[data-axis-y]').selectOption('1');await lab.locator('[data-point="0"]').focus();assert.match(await lab.locator('.result').innerText(),/Setosa/);await lab.locator('[data-labels]').uncheck();assert(await lab.locator('.iris-legend').isHidden());
 lab=await go('folds');await lab.locator('[data-fold="3"]').click();assert.match(await lab.locator('.result').innerText(),/묶음 3의 30개/);assert.equal(await lab.locator('.held-out').count(),1);
 lab=await go('matrix');await lab.locator('[data-cell="1,2"]').click();assert.match(await lab.locator('.result').innerText(),/실제 Versicolor를 Virginica로 예측한 꽃 6개/);await lab.locator('input').fill('92');await lab.locator('[data-check-accuracy]').click();assert.match(await lab.locator('[data-score-answer]').innerText(),/맞습니다/);
 lab=await go('reflection');await lab.locator('textarea').first().fill('Tree 관찰 기록');const url=page.url();await page.keyboard.press('d');assert.equal(page.url(),url);const [download]=await Promise.all([page.waitForEvent('download'),lab.locator('[data-download]').click()]);assert.equal(download.suggestedFilename(),'AI알고리즘_4주차_활동기록.txt');
 await page.reload();lab=await go('reflection');assert.equal(await lab.locator('textarea').first().inputValue(),'Tree 관찰 기록d');lab=await go('setup');assert.equal(await lab.locator('input:checked').count(),4);
 lab=await go('review');for(const i of [0,1,2]){await lab.locator(`[data-answer="${i}"]`).click();assert.match(await lab.locator('.result').innerText(),/맞습니다/);await lab.locator('[data-next-question]').click();}
 await page.locator('#tocButton').focus();await page.locator('#tocButton').click();await page.locator('#tocSearch').fill('붓꽃');assert(await page.locator('#tocContents button:visible').count()>0);await page.locator('#tocSearch').fill('아무것도없음xyz');assert(await page.locator('#tocEmpty').isVisible());await page.keyboard.press('Escape');
 await page.locator('#pageButton').click();await page.locator('#pageNumber').fill('26');await page.locator('#pageForm button').click();assert.equal(new URL(page.url()).hash,'#slide-26');
 const layout=[];
 const pageText=await page.locator('#stage').textContent();
 for(const sentence of ['수업이 끝나면 데이터, 알고리즘, 평가 결과가 연결된 워크플로를 직접 만들 수 있습니다.','3주차에서 배운 학습과 추론을 실제 도구로 연결합니다.','무엇을 예측하는지에 따라 방법이 달라집니다','강화학습은 행동의 보상을 통해 전략을 학습합니다. 이번 실습은 정답이 있는 분류를 다룹니다.','별도 테스트 성능이 아닙니다.','이번 실습에는 추가 Add-on이 필요하지 않습니다.','연결선은 데이터나 학습 방법이 이동하는 통로입니다.'])assert(!pageText.includes(sentence),`deleted sentence remains: ${sentence}`);
 assert.equal(await page.locator('.foundation-note').count(),0);assert.equal(await page.locator('.section-copy p').count(),0);
 for(let i=0;i<slides.length;i++){
  await page.evaluate(n=>location.hash='slide-'+n,i+1);const slide=page.locator(`#slide-${i+1}`);await slide.waitFor({state:'visible'});
  for(const image of await slide.locator('img').all())assert(await image.evaluate(im=>im.complete&&im.naturalWidth>0),`image slide ${i+1}`);
  if(await slide.locator('.visual-open').count()){await slide.locator('.visual-open').first().click();assert(await page.locator('.image-dialog').isVisible());await page.keyboard.press('Escape');}
  const issue=await slide.evaluate(el=>{const b=el.querySelector('.slide-body');return {slide:el.id,overflow:b?b.scrollHeight-b.clientHeight:0,width:el.scrollWidth-el.clientWidth};});layout.push(issue);
  if(captures)await page.locator('#stage').screenshot({path:`${captures}/${String(i+1).padStart(2,'0')}.png`});
 }
 console.log('layout',JSON.stringify(layout.filter(x=>x.overflow>3||x.width>3)));assert.deepEqual(layout.filter(x=>x.overflow>3||x.width>3),[]);
 for(const width of [390,320]){await page.setViewportSize({width,height:844});for(let i=0;i<slides.length;i++){await page.evaluate(n=>location.hash='slide-'+n,i+1);await page.locator(`#slide-${i+1}`).waitFor({state:'visible'});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`mobile overflow ${width}, slide ${i+1}`);}}
 await page.evaluate(()=>location.hash='slide-2');await page.locator('#slide-2').waitFor({state:'visible'});await page.evaluate(()=>{const el=document.querySelector('#stage');for(const [type,x,y] of [['touchstart',280,300],['touchend',70,310]])el.dispatchEvent(new TouchEvent(type,{bubbles:true,changedTouches:[new Touch({identifier:1,target:el,clientX:x,clientY:y})]}));});assert.equal(new URL(page.url()).hash,'#slide-3');
 await page.goto(base+'/lectures/');assert.equal(await page.locator('a[href="/ai-algorithm-week4/"]').count(),1);
 const resp=await page.request.get(base+'/data/lectures/week4-iris.tab');assert.equal(resp.status(),200);assert.equal((await resp.text()).trim().split('\n').length,153);
 await page.close();
 const printPage=await browser.newPage({viewport:{width:1440,height:1000}});printPage.on('pageerror',e=>errors.push(e.message));await printPage.goto(base+'/ai-algorithm-week4/?lecture-print=1');await printPage.waitForFunction(()=>window.WEEK4&&window.LecturePrint);await printPage.evaluate(()=>LecturePrint.prepare());await printPage.waitForSelector('html[data-print-ready=true]');assert.equal(await printPage.locator('.lecture-print-sheet').count(),45);
 if(captures)await printPage.pdf({path:`${captures}/week4.pdf`,preferCSSPageSize:true,printBackground:true});
 assert.deepEqual(errors,[]);await browser.close();console.log('PASS: 45 slides, 10 activities, data download, persistence, keyboard, fullscreen, search, mobile, touch, images and print.');
})().catch(e=>{console.error(e);process.exit(1)});
