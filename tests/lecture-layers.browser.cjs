// Selectable text lines and enlargeable pictures of the image-based decks, and picture enlargement in AI education chapters 1 and 3.
// Usage: node tests/lecture-layers.browser.cjs http://127.0.0.1:8765 [deck,deck]   e.g. computer-education2/2,microdegree1/1-1
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict');
(async()=>{
 const base=process.argv[2]||'http://127.0.0.1:8765',only=process.argv[3]?.split(',');
 const browser=await chromium.launch({headless:true,...(process.env.PW_CHANNEL==='none'?{}:{channel:process.env.PW_CHANNEL||'msedge'})}),page=await browser.newPage({viewport:{width:1440,height:1050}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 const go=async n=>{await page.evaluate(n=>location.hash='slide-'+n,n);await page.waitForFunction(n=>Number(document.querySelector('#ce-page').value)===n,n)};
 const dialogImage=async()=>{await page.waitForSelector('.lz-dialog[open]');await page.waitForFunction(()=>{const im=document.querySelector('.lz-dialog img');return im.complete&&im.naturalWidth>0})};
 const totals={};
 for(const course of ['computer-education2','microdegree1']){
  const catalog=await (await page.request.get(`${base}/data/lectures/${course}/catalog.json`)).json();
  for(const deck of catalog.map(c=>String(c.id??c.number))){
   if(only&&!only.includes(`${course}/${deck}`))continue;
   await page.goto(`${base}/lectures/${course}/${deck}/`);await page.waitForSelector('[data-ready=true]');
   const version=await page.locator('.ce-viewer').evaluate(el=>el.dataset.version||'20261013layers');
   const data=await (await page.request.get(`${base}/data/lectures/${course}/${deck}.json?v=${version}`)).json();
   let lines=0,pictures=0,opened=false,selected=false;
   for(const [i,s] of data.slides.entries()){
    if(!s.lines&&!s.pictures)continue;
    assert(s.image&&!s.kind,`${course}/${deck} slide ${i+1}: layers belong to image slides`);
    await go(i+1);
    await page.evaluate(async()=>{document.querySelector('.ce-text')?.getBoundingClientRect();await document.fonts.ready});
    const shown=await page.evaluate(()=>{const layer=document.querySelector('.ce-text'),stage=document.querySelector('.ce-canvas').getBoundingClientRect();
     return {lines:[...document.querySelectorAll('.ce-text span')].map(l=>{const r=l.getBoundingClientRect();return {text:l.textContent.replace(/\n$/,''),error:Math.abs(r.width-Number(l.dataset.width)*layer.clientWidth),inside:r.left>=stage.left-2&&r.right<=stage.right+2&&r.top>=stage.top-2&&r.bottom<=stage.bottom+2}}),
      pictures:[...document.querySelectorAll('.ce-picture')].map(p=>p.dataset.zoom)}});
    assert.deepEqual(shown.lines.map(l=>l.text),(s.lines||[]).map(l=>l[4]),`${course}/${deck} slide ${i+1}: lines`);
    assert.deepEqual(shown.lines.filter(l=>l.error>1.5||!l.inside),[],`${course}/${deck} slide ${i+1}: line placement`);
    assert.deepEqual(shown.pictures,(s.pictures||[]).map(p=>p.src),`${course}/${deck} slide ${i+1}: pictures`);
    for(const src of shown.pictures)assert.equal((await page.request.head(base+src)).status(),200,`${course}/${deck} slide ${i+1}: ${src}`);
    lines+=shown.lines.length;pictures+=shown.pictures.length;
    if(!selected&&shown.lines.length>1){
     // Dragging across the first line selects its text, and the slide stays where it is.
     const box=await page.locator('.ce-text span').first().boundingBox();
     await page.mouse.move(box.x+1,box.y+box.height/2);await page.mouse.down();await page.mouse.move(box.x+box.width-1,box.y+box.height/2,{steps:8});await page.mouse.up();
     const text=await page.evaluate(()=>String(getSelection()));
     assert(text.replace(/\s/g,'').length>0&&shown.lines[0].text.replace(/\s/g,'').includes(text.replace(/\s/g,'')),`${course}/${deck} slide ${i+1}: selected "${text}"`);
     await page.evaluate(()=>getSelection().removeAllRanges());selected=true;
    }
    if(!opened&&shown.pictures.length){
     const button=page.locator('.ce-picture').first(),box=await button.boundingBox();
     // A text line or a link may lie on the middle of a picture, so the click goes to a point the picture owns.
     const point=await button.evaluate(el=>{const r=el.getBoundingClientRect();for(let y=.1;y<1;y+=.1)for(let x=.1;x<1;x+=.1){const px=r.left+r.width*x,py=r.top+r.height*y;if(document.elementFromPoint(px,py)===el)return [px,py]}return null});
     if(point){
      await page.mouse.click(...point);await dialogImage();
      assert.equal(await page.locator('.lz-dialog img').getAttribute('src'),shown.pictures[0]);
      await page.keyboard.press('ArrowRight');assert.equal(Number(await page.locator('#ce-page').inputValue()),i+1,'arrow keys stay in the picture dialog');
      await page.keyboard.press('Escape');assert.equal(await page.locator('.lz-dialog[open]').count(),0);
      assert.equal(Number(await page.locator('#ce-page').inputValue()),i+1);opened=true;
     }
    }
   }
   // Activity slides carry no layers of the image slide before them.
   const lab=data.slides.findIndex(s=>s.kind);
   if(lab>=0){await go(lab+1);assert.equal(await page.locator('.ce-text,.ce-picture').count(),0,`${course}/${deck}: activity slide ${lab+1}`)}
   totals[`${course}/${deck}`]={lines,pictures,selected,opened};
  }
 }
 if(!only)for(const chapter of ['chapter1','chapter3']){
  await page.goto(`${base}/lectures/ai-education/${chapter}/`);await page.waitForSelector('[data-ready=true]');
  const count=Number(await page.locator('#ce-total').textContent());let opened=0;
  for(let n=1;n<=count&&opened<3;n++){
   await go(n);const picture=page.locator('.ae-picture[data-zoom]').first();if(!await picture.count()||!await picture.isVisible())continue;
   await picture.focus();await page.keyboard.press('Enter');await dialogImage();
   await page.locator('.lz-close').click();assert.equal(await page.locator('.lz-dialog[open]').count(),0);
   assert.equal(Number(await page.locator('#ce-page').inputValue()),n);opened++;
  }
  assert.equal(opened,3,`${chapter}: pictures open`);totals[`ai-education/${chapter}`]={opened};
 }
 assert.deepEqual(errors,[]);
 console.log(JSON.stringify(totals,null,1));
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
