/* Build an isolated, complete deck before opening the browser print preview. */
(()=>{
 'use strict';
 const mode=new URLSearchParams(location.search).get('lecture-print')==='1';
 let adapter,frame,busy=false,prepared;
 let resolveRegistration;
 const registered=new Promise(resolve=>{resolveRegistration=resolve});
 const properties=('display position top right bottom left z-index width height min-width min-height max-width max-height box-sizing margin-top margin-right margin-bottom margin-left padding-top padding-right padding-bottom padding-left border-top-width border-right-width border-bottom-width border-left-width border-top-style border-right-style border-bottom-style border-left-style border-top-color border-right-color border-bottom-color border-left-color border-radius border-collapse border-spacing background-color background-image background-size background-position background-repeat color opacity font-family font-size font-weight font-style font-synthesis line-height letter-spacing text-align text-decoration white-space overflow-wrap word-break vertical-align list-style-type list-style-position flex-direction flex-wrap flex-grow flex-shrink flex-basis justify-content align-items align-content align-self order gap row-gap column-gap grid-template-columns grid-template-rows grid-auto-flow grid-column grid-row place-items object-fit object-position transform transform-origin clip-path overflow overflow-x overflow-y appearance accent-color box-shadow').split(' ');
 const assetCache=new Map();
 function loadImage(url){
  if(!assetCache.has(url))assetCache.set(url,new Promise((resolve,reject)=>{
   const image=new Image(),timer=setTimeout(()=>reject(Error('그림을 불러오는 시간이 초과되었습니다.')),60000);
   image.onload=()=>{clearTimeout(timer);resolve()};image.onerror=()=>{clearTimeout(timer);reject(Error('일부 그림을 불러오지 못했습니다.'))};image.src=url;
  }));return assetCache.get(url);
 }
 async function imagesIn(root){
  const urls=new Set([...root.querySelectorAll('img')].map(im=>im.currentSrc||im.src));
  for(const el of [root,...root.querySelectorAll('*')])for(const match of getComputedStyle(el).backgroundImage.matchAll(/url\(["']?([^"')]+)["']?\)/g))urls.add(match[1]);
  await Promise.all([...urls].filter(Boolean).map(loadImage));
 }
 function snapshot(source){
  const copy=source.cloneNode(true),originals=[source,...source.querySelectorAll('*')],copies=[copy,...copy.querySelectorAll('*')];
  originals.forEach((original,i)=>{
   const clone=copies[i],style=getComputedStyle(original);
   for(const property of properties)clone.style.setProperty(property,style.getPropertyValue(property),'important');
   clone.style.setProperty('animation','none','important');clone.style.setProperty('transition','none','important');
   clone.style.setProperty('break-inside','avoid','important');if(original.tagName==='BUTTON')clone.style.setProperty('white-space','nowrap','important');clone.style.setProperty('break-after','auto','important');clone.style.setProperty('break-before','auto','important');
   if(original instanceof HTMLInputElement){clone.value=original.value;clone.setAttribute('value',original.value);clone.checked=original.checked;clone.toggleAttribute('checked',original.checked)}
   if(original instanceof HTMLTextAreaElement){clone.value=original.value;clone.textContent=original.value}
   if(original instanceof HTMLSelectElement)[...clone.options].forEach((option,j)=>{option.selected=original.options[j].selected;option.toggleAttribute('selected',option.selected)});
   if(original instanceof HTMLCanvasElement){const im=document.createElement('img');im.src=original.toDataURL();im.style.cssText=clone.style.cssText;clone.replaceWith(im)}
   clone.removeAttribute('autofocus');clone.removeAttribute('aria-live');
  });
  // The root fits a sheet; inner source transforms (native text fitting) stay intact.
  for(const [property,value] of Object.entries({position:'relative',inset:'auto',transform:'none',margin:'0',overflow:'visible'}))copy.style.setProperty(property,value,'important');
  copy.hidden=false;copy.removeAttribute('id');return copy;
 }
 async function prepare(progress=()=>{}){
  if(!mode)throw Error('인쇄 전용 문서가 필요합니다.');
  if(prepared)return prepared;
  prepared=(async()=>{
   await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(Error('강의 데이터를 불러오지 못했습니다.')),60000);registered.then(()=>{clearTimeout(timer);resolve()})});document.documentElement.dataset.theme='light';document.body.classList.add('lecture-print-building');
   await document.fonts.ready;
   await Promise.all([400,600,800].map(w=>document.fonts.load(`${w} 24px Freesentation`)));
   const slides=adapter.slides,assets=[...new Set(adapter.assets?.()||[])];let next=0,loaded=0;
   await Promise.all(Array.from({length:Math.min(6,assets.length)},async()=>{while(next<assets.length){await loadImage(assets[next++]);progress(`그림 준비 ${++loaded} / ${assets.length}`)}}));
   const deck=document.createElement('main');deck.id='lecture-print-deck';deck.setAttribute('aria-label','전체 슬라이드 인쇄');document.body.append(deck);
   for(let i=0;i<slides.length;i++){
    const {node,width,height}=await adapter.render(i);await imagesIn(node);
    const sheet=document.createElement('section');sheet.className='lecture-print-sheet';sheet.dataset.slide=String(i+1);
    const area=document.createElement('div');area.className='lecture-print-area';
    const content=document.createElement('div');content.className='lecture-print-content';content.append(snapshot(node));area.append(content);
    const footer=document.createElement('footer');footer.className='lecture-print-footer';footer.textContent=`${adapter.title}   ${i+1} / ${slides.length}`;
    sheet.append(area,footer);deck.append(sheet);
    const scale=Math.min(area.clientWidth/width,area.clientHeight/height);
    Object.assign(content.style,{width:width+'px',height:height+'px',zoom:String(scale),left:(area.clientWidth-width*scale)/(2*scale)+'px',top:(area.clientHeight-height*scale)/(2*scale)+'px'});
    sheet.dataset.sourceWidth=width;sheet.dataset.sourceHeight=height;sheet.dataset.scale=scale;
    progress(`슬라이드 준비 ${i+1} / ${slides.length}`);
    if(i%5===0)await new Promise(resolve=>setTimeout(resolve,0));
   }
   document.body.classList.remove('lecture-print-building');document.body.classList.add('lecture-print-document');
   document.documentElement.dataset.printReady='true';return slides.length;
  })();return prepared;
 }
 async function printAll(){
  if(busy||mode)return;busy=true;adapter.button.disabled=true;
  const status=document.createElement('div');status.className='lecture-print-progress';status.setAttribute('role','status');status.textContent='전체 슬라이드 인쇄를 준비하고 있습니다.';document.body.append(status);
  try{
   if(document.fullscreenElement)await document.exitFullscreen();
   frame?.remove();frame=document.createElement('iframe');frame.className='lecture-print-frame';frame.title='전체 강의 인쇄 문서';frame.setAttribute('aria-hidden','true');frame.tabIndex=-1;
   const url=new URL(location.href);url.searchParams.set('lecture-print','1');url.hash='';
   await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(Error('인쇄 문서를 불러오지 못했습니다.')),60000);frame.onload=()=>{clearTimeout(timer);resolve()};frame.onerror=()=>{clearTimeout(timer);reject(Error('인쇄 문서를 불러오지 못했습니다.'))};frame.src=url.href;document.body.append(frame)});
   const printWindow=frame.contentWindow;if(!printWindow.LecturePrint)throw Error('인쇄 기능을 불러오지 못했습니다.');
   const count=await printWindow.LecturePrint.prepare(message=>{status.textContent=message});
   const printedFrame=frame;printWindow.addEventListener('afterprint',()=>setTimeout(()=>printedFrame.remove(),0),{once:true});
   status.textContent=`전체 ${count}장, A4 가로 인쇄 미리보기를 엽니다.`;
   printWindow.focus();printWindow.print();status.remove();
  }catch(error){frame?.remove();status.textContent=`${error.message} 인쇄 버튼을 다시 눌러 주세요.`;const close=document.createElement('button');close.type='button';close.textContent='닫기';close.onclick=()=>status.remove();status.append(close)}
  finally{busy=false;adapter.button.disabled=false;adapter.button.focus({preventScroll:true})}
 }
 window.LecturePrint={mode,prepare,snapshot,register(config){adapter=config;resolveRegistration();if(!mode){adapter.button.addEventListener('click',printAll);document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='p'){e.preventDefault();printAll()}})}},printAll};
})();
