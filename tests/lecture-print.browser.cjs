const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert=require('assert');
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'msedge'});const base=process.argv[2]||'http://127.0.0.1:8765';
 for(const [route,expected,slide,kind] of [['ai-algorithm-week2',59,1,'algorithm'],...Array.from({length:10},(_,i)=>[`computer-education2-${i+2}`,[42,40,39,65,39,31,78,29,59,43][i],i===1?22:2,'computer']),['ai-education-chapter1',41,8,'education'],['ai-education-chapter3',49,15,'education']]){
  const context=await browser.newContext({viewport:{width:390,height:844}}),page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));await context.addInitScript(()=>{window.print=()=>{window.__printCall={count:document.querySelectorAll('.lecture-print-sheet').length,ready:document.documentElement.dataset.printReady,paper:[...document.styleSheets].flatMap(s=>{try{return [...s.cssRules].filter(r=>r.type===6).map(r=>r.cssText)}catch{return[]}}).join('\n')}}});
  await page.goto(`${base}/${route}/?v=20260915print1#slide-${slide}`);
  if(kind==='algorithm'){await page.waitForSelector('.slide:not([hidden])');const id=await page.locator('.slide[data-lab=prediction]').getAttribute('id');await page.evaluate(id=>location.hash=id,id);await page.locator('#prediction').fill('인쇄 후에도 기록 유지');}
  else{await page.waitForSelector('[data-ready=true]');if(route==='computer-education2-3'){await page.locator('#float-input').fill('17.5');await page.locator('#float-encode').click()}if(kind==='education')await page.locator('#ae-lab [data-question="0"]').first().click();}
  const total=kind==='algorithm'?await page.evaluate(()=>WEEK2.slides.length):Number(await page.locator('#ce-page').getAttribute('max'));const hash=new URL(page.url()).hash,before=await page.locator(kind==='algorithm'?'.slide:not([hidden])':kind==='education'?'#ae-lab':'#ce-lab').innerText();
  const button=page.locator(kind==='algorithm'?'#printButton':'#ce-print');await button.focus();await button.click();
  await page.waitForFunction(()=>document.querySelector('.lecture-print-frame')?.contentWindow.__printCall,{},{timeout:180000});
  const report=await page.evaluate(()=>document.querySelector('.lecture-print-frame').contentWindow.__printCall);assert.equal(report.count,total);assert.equal(report.ready,'true');assert(report.paper.includes('a4 landscape'));
  assert.equal(new URL(page.url()).hash,hash);assert.equal(await page.locator(kind==='algorithm'?'.slide:not([hidden])':kind==='education'?'#ae-lab':'#ce-lab').innerText(),before);
  if(kind==='algorithm')assert.equal(await page.locator('#prediction').inputValue(),'인쇄 후에도 기록 유지');if(route==='computer-education2-3')assert.equal(await page.locator('#float-input').inputValue(),'17.5');
  await page.evaluate(()=>document.querySelector('.lecture-print-frame').contentWindow.dispatchEvent(new Event('afterprint')));await page.waitForSelector('.lecture-print-frame',{state:'detached'});assert.equal(await button.isDisabled(),false);assert.deepStrictEqual(errors,[]);
  console.log(`${route}: button opens ${total} prepared A4 sheets; mobile slide/state and cancel cleanup preserved`);await context.close();
 }
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
