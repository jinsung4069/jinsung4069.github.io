/* Shows a lecture picture at full size. Viewers mark pictures with data-zoom or call LectureZoom.open. */
(()=>{
 'use strict';
 let dialog,img,opener;
 // The picture fills the screen, enlarged up to four times, and one larger than the screen can also be seen at its own size.
 function fit(){
  if(!dialog?.open||!img.naturalWidth)return;const frame=img.parentNode,pad=getComputedStyle(frame);
  const scale=Math.min((frame.clientWidth-parseFloat(pad.paddingLeft)-parseFloat(pad.paddingRight))/img.naturalWidth,(frame.clientHeight-parseFloat(pad.paddingTop)-parseFloat(pad.paddingBottom))/img.naturalHeight,4);
  const large=scale<.87;dialog.classList.toggle('lz-large',large);if(!large)dialog.classList.remove('lz-actual');
  const actual=dialog.classList.contains('lz-actual');img.style.width=`${Math.round(img.naturalWidth*(actual?1:scale))}px`;
  // A large picture becomes a toggle button, so the keyboard can switch it between fitted and actual size too.
  if(large){img.tabIndex=0;img.setAttribute('role','button');img.setAttribute('aria-pressed',String(actual));img.setAttribute('aria-label',`${img.alt||'그림'}, 원본 크기로 보기`)}else plain();
 }
 function plain(){['tabindex','role','aria-pressed','aria-label'].forEach(name=>img.removeAttribute(name))}
 function toggle(){if(dialog.classList.contains('lz-large')){dialog.classList.toggle('lz-actual');fit()}}
 function build(){
  dialog=document.createElement('dialog');dialog.className='lz-dialog';dialog.setAttribute('aria-label','원본 그림 크게 보기');
  dialog.innerHTML='<button type="button" class="lz-close" aria-label="그림 닫기"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></button><div class="lz-frame"><img alt=""></div>';
  img=dialog.querySelector('img');
  dialog.querySelector('.lz-close').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',e=>{if(e.target===dialog||e.target.classList.contains('lz-frame'))dialog.close()});
  img.addEventListener('click',toggle);
  img.addEventListener('load',fit);window.addEventListener('resize',fit);
  // Slide viewers listen for arrow keys and letters on the document.
  dialog.addEventListener('keydown',e=>{e.stopPropagation();if(e.key==='Escape'){e.preventDefault();dialog.close()}else if(e.target===img&&(e.key==='Enter'||e.key===' ')){e.preventDefault();toggle()}});
  dialog.addEventListener('close',()=>{img.removeAttribute('src');plain();if(opener&&opener.isConnected)opener.focus();opener=null});
 }
 function open(src,alt,from){
  if(!src)return;if(!dialog)build();
  // A dialog outside the full-screen element would open behind it in some browsers.
  (document.fullscreenElement||document.body).append(dialog);
  opener=from||document.activeElement;dialog.classList.remove('lz-large','lz-actual');img.style.width='';img.alt=alt||'';img.src=src;dialog.showModal();fit();
 }
 const source=el=>el.dataset.zoom||el.querySelector('img')?.currentSrc||el.querySelector('img')?.src;
 const label=el=>el.dataset.zoomAlt||el.querySelector('img')?.alt||'';
 document.addEventListener('click',e=>{const el=e.target.closest?.('[data-zoom]');if(el&&!e.defaultPrevented)open(source(el),label(el),el)});
 document.addEventListener('keydown',e=>{const el=e.target.closest?.('[data-zoom][role=button]');if(el&&(e.key==='Enter'||e.key===' ')){e.preventDefault();e.stopPropagation();open(source(el),label(el),el)}},true);
 // The AI education viewer redraws its pictures on every slide, so they are marked as they appear.
 const canvas=document.querySelector('#ae-slide');
 if(canvas)new MutationObserver(()=>canvas.querySelectorAll('.ae-picture:not([data-zoom])').forEach((p,i)=>{p.dataset.zoom='';p.setAttribute('role','button');p.tabIndex=0;p.setAttribute('aria-haspopup','dialog');p.setAttribute('aria-label',`${p.querySelector('img').alt} ${i+1} 크게 보기`)})).observe(canvas,{childList:true});
 window.LectureZoom={open};
})();
