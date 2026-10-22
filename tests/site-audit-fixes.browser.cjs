const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert=require('node:assert/strict');
const base=process.argv[2]||'http://127.0.0.1:8770';
(async()=>{
 const browser=await chromium.launch({headless:true,channel:process.env.PW_CHANNEL||'msedge'});
 const results=[];
 async function scenario(name,fn,init){
  const context=await browser.newContext({viewport:{width:1440,height:1000},timezoneId:'Asia/Seoul'});
  if(init)await context.addInitScript(init);
  const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  try{await fn(page);assert.deepEqual(errors,[],name+' page errors');results.push(name);console.log('PASS',name);}finally{await context.close();}
 }
 try{
  await scenario('attendance legacy migration, names, dates and reload',async p=>{
   await p.goto(base+'/attendance/');
   assert.match(await p.locator('#attendanceRecords').innerText(),/Audit_Student: 출석/);
   for(const name of ["O'Neil",'<b>TEST_BOLD</b>','"Quoted"']){
    await p.locator('#studentName').fill(name);await p.locator('#studentForm button').click();await p.getByRole('button',{name:name+', 출석',exact:true}).click();
   }
   assert.equal(await p.locator('#attendanceTableBody b').count(),0);
   await p.locator('#languageToggle').click();await p.locator('#attendanceDateEn').fill('2026-10-01');await p.getByRole('button',{name:'Audit_Student, Absent',exact:true}).click();
   await p.locator('#languageToggle').click();assert.equal(await p.locator('#attendanceDate').inputValue(),'2026-10-01');
   const saved=await p.evaluate(()=>JSON.parse(localStorage.getItem('attendanceDataV2')));
   assert(saved.records.some(r=>r.date==='2026-10-01'&&r.status==='Absent'));
   assert.equal(await p.evaluate(()=>localStorage.getItem('attendanceRecords')),'{"2026-09-30_Audit_Student":"Present"}');
   await p.reload();assert.match(await p.locator('#attendanceRecords').innerText(),/Audit_Student: 결석/);
   const download=p.waitForEvent('download');await p.locator('#exportAttendance').click();assert.match((await download).suggestedFilename(),/attendanceDataV2-backup.json/);
  },()=>{if(!localStorage.getItem('attendanceDataV2')){localStorage.setItem('students','["Audit_Student"]');localStorage.setItem('attendanceRecords','{"2026-09-30_Audit_Student":"Present"}');}});
  for(const iso of ['2026-10-21T15:30:00Z','2026-10-22T14:30:00Z'])await scenario('local date '+iso,async p=>{
   await p.clock.setFixedTime(new Date(iso));await p.goto(base+'/attendance/');assert.equal(await p.locator('#attendanceDate').inputValue(),'2026-10-22');
  });
  await scenario('programming comments, strings, all five sample answers',async p=>{
   await p.goto(base+'/programming-language/');
   for(const bad of ['/* struct Fake int char boolean [] fake; */','"struct Fake { int char boolean [] fake; }"']){
    await p.locator('#codeAnswer').fill(bad);await p.locator('#checkCode').click();assert(!await p.locator('#feedbackBox').evaluate(el=>el.classList.contains('success')));
   }
   for(let i=0;i<5;i++){
    await p.locator('#fillSample').click();await p.locator('#checkCode').click();assert(await p.locator('#feedbackBox').evaluate(el=>el.classList.contains('success')),'sample '+i+': '+await p.locator('#feedbackBox').innerText());
    if(i<4)await p.locator('#nextModule').click();
   }
   await p.reload();assert.equal(await p.evaluate(()=>JSON.parse(localStorage.getItem('programmingLanguageLabProgressV1')).completedModules.length),5);
  });
  const labs=[['attendance','students'],['programming-language','programmingLanguageLabProgressV1'],['database-lab','databaseLabProgressV1']];
  async function exercise(p,slug){
   await p.goto(base+'/'+slug+'/');
   if(slug==='attendance'){
    await p.locator('#studentName').fill('Storage_Test');await p.locator('#studentForm button').click();await p.getByRole('button',{name:'Storage_Test, 출석',exact:true}).click();assert.match(await p.locator('#attendanceRecords').innerText(),/Storage_Test: 출석/);
   }else{
    if(slug==='programming-language')await p.locator('#fillSample').click();
    await p.locator(slug==='database-lab'?'#checkAnswer':'#checkCode').click();assert(await p.locator('#feedbackBox').isVisible());
   }
  }
  for(const [slug,key] of labs){
   for(const fault of ['corrupt','schema','read','write','remove']){
    if(slug==='attendance' && fault==='remove')continue; // Attendance has no deletion action.
    const ctx=await browser.newContext({viewport:{width:1280,height:900}});
    await ctx.addInitScript(({key,fault})=>{
     if(fault==='corrupt')localStorage.setItem(key,'{broken');
     if(fault==='schema')localStorage.setItem(key,'{"unexpected":true}');
     if(['read','write','remove'].includes(fault))Storage.prototype[{read:'getItem',write:'setItem',remove:'removeItem'}[fault]]=()=>{throw new DOMException('Storage test','QuotaExceededError');};
    },{key,fault});
    const p=await ctx.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));
    try{
     await exercise(p,slug);
     if(fault==='remove'&&slug!=='attendance'){p.on('dialog',d=>d.accept());await p.locator('#resetProgress').click();}
     if(fault!=='remove'||slug!=='attendance')assert(await p.locator('.local-storage-notice').isVisible(),slug+' '+fault);
     if(['corrupt','schema'].includes(fault))assert.equal(await p.evaluate(k=>localStorage.getItem(k),key),fault==='corrupt'?'{broken':'{"unexpected":true}');
     assert.deepEqual(errors,[]);console.log('PASS storage',slug,fault);results.push('storage '+slug+' '+fault);
    }finally{await ctx.close();}
   }
  }
  await scenario('Q-learning single timer, pause/resume and episode reset',async p=>{
   await p.goto(base+'/dqn-demo/');
   const result=await p.evaluate(()=>{
    const demo=new QLearningDemo();let id=0;const timers=new Map();const nativeSet=window.setTimeout,nativeClear=window.clearTimeout;
    window.setTimeout=fn=>{timers.set(++id,fn);return id;};window.clearTimeout=n=>timers.delete(n);
    try{
     demo.start();demo.start();if(timers.size!==1)throw Error('duplicate start');const steps=demo.currentEpisode.steps;
     demo.pause();if(timers.size!==0||demo.episode!==0)throw Error('pause counted episode');demo.start();if(demo.currentEpisode.steps!==steps+1)throw Error('resume lost state');
     demo.pause();demo.currentEpisode.steps=299;demo.start();if(demo.episode!==1||timers.size!==1)throw Error('episode boundary');
     demo.pause();demo.start();if(timers.size!==1)throw Error('duplicate episode timer');demo.reset();
     return {timers:timers.size,episode:demo.episode,average:document.querySelector('#avgReward').textContent,running:demo.isRunning};
    }finally{window.setTimeout=nativeSet;window.clearTimeout=nativeClear;}
   });assert.deepEqual(result,{timers:0,episode:0,average:'0',running:false});
  });
  for(const slug of ['contour-simulator','lectures/stitch-ai-poc/ai_6'])await scenario('responsive initial loads and resize '+slug,async p=>{
   for(const width of [320,390,768,1440]){
    await p.setViewportSize({width,height:1000});await p.goto(base+'/'+slug+'/');await p.evaluate(()=>document.fonts.ready);
    if(slug.includes('ai_6'))await p.waitForFunction(()=>getComputedStyle(document.querySelector('main')).paddingTop!=='0px');
    const size=await p.evaluate(()=>({viewport:innerWidth,document:document.documentElement.scrollWidth}));assert(size.document<=width+1,JSON.stringify({slug,...size}));
   }
   await p.setViewportSize({width:320,height:1000});assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
   if(slug==='contour-simulator'){
    assert.equal(await p.locator('#view3d canvas').count(),1);
    const box=await p.locator('#drawCanvas').boundingBox();
    await p.mouse.move(box.x+box.width*.25,box.y+box.height*.25);await p.mouse.down();
    for(const [x,y] of [[.75,.25],[.75,.75],[.25,.75],[.25,.25]])await p.mouse.move(box.x+box.width*x,box.y+box.height*y,{steps:15});
    await p.mouse.up();await p.locator('#btnPlay').click();
    await p.waitForFunction(()=>document.querySelector('#statusBar3d').textContent.includes('완성'));
    assert(await p.locator('#btnVolcano').isEnabled());
    await p.locator('#btnVolcano').click();await p.locator('#btnReset3d').click();
    await p.locator('#darkModeToggle').click();assert.equal(await p.locator('html').getAttribute('data-theme'),'dark');
   }
  });
  await scenario('PoC notice, avatar fallback, named controls and dialog focus',async p=>{
   for(const slug of ['ai_1','ai_2','ai_3','ai_4','ai_5','ai_6','ai_7','ai_8','ai_live']){
    await p.goto(base+'/lectures/stitch-ai-poc/'+slug+'/');assert(await p.locator('.poc-demo-notice').isVisible());
    const notice=await p.locator('.poc-demo-notice').boundingBox();assert(notice.height<300&&notice.x+notice.width<=1441,slug+' notice layout');
    assert.equal(await p.locator('button').evaluateAll(buttons=>buttons.filter(b=>!b.getAttribute('aria-label')&&!b.title&&!b.textContent.trim()).length),0,slug+' unnamed button');
    assert.equal(await p.locator('script[src*="getunicorn"]').count(),0);
    await p.locator('img').evaluateAll(imgs=>Promise.all(imgs.map(img=>img.complete?null:new Promise(r=>{img.addEventListener('load',r,{once:true});img.addEventListener('error',r,{once:true});}))));
    assert.equal(await p.locator('img').evaluateAll(imgs=>imgs.filter(i=>i.naturalWidth===0).length),0,slug+' broken image');
   }
   await p.goto(base+'/lectures/stitch-ai-poc/ai_6/');const button=p.getByRole('button',{name:'PDF 내보내기',exact:true});await button.click();assert(await p.locator('#demo-modal').isVisible());
   assert.match(await p.locator('#demo-modal-result').innerText(),/실제 분석, 서버 저장, 공유, 동의 수집은 수행되지 않습니다/);
   await p.keyboard.press('Tab');assert(await p.locator('[data-demo-close]').evaluate(el=>el===document.activeElement));await p.keyboard.press('Escape');assert(await button.evaluate(el=>el===document.activeElement));
  });
  console.log(JSON.stringify({passed:results.length,scenarios:results},null,2));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1);});
