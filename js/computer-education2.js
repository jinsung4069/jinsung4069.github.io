/* Lucide SVG icons, source-positioned videos and concept-linked interactive slides. */
(async()=>{
 'use strict';
 const $=s=>document.querySelector(s),viewer=$('.ce-viewer');if(!viewer)return;
 const stage=$('#ce-stage'),img=$('#ce-image'),lab=$('#ce-lab'),media=$('#ce-media'),toc=$('#ce-toc'),dialog=$('#ce-dialog'),page=$('#ce-page');
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const icon=name=>`<svg class="ce-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><use href="#ce-icon-${name}"></use></svg>`;
 const setIcon=(button,name,label)=>{button.innerHTML=icon(name);button.setAttribute('aria-label',label);button.dataset.tip=label};
 let index=0,data,zoom=false,touchTimer;
 function reveal(){stage.classList.add('controls-visible');clearTimeout(touchTimer);touchTimer=setTimeout(()=>stage.classList.remove('controls-visible'),3500)}
 function resetZoom(){zoom=false;stage.classList.remove('zoom');setIcon($('#ce-zoom'),'zoom-in','확대');$('#ce-zoom').setAttribute('aria-pressed','false')}
 function hashIndex(){const match=location.hash.match(/^#slide-(\d+)$/);return match?Math.max(0,Math.min(data.slides.length-1,Number(match[1])-1)):0}
 function render(i,write=true){
  index=Math.max(0,Math.min(data.slides.length-1,i));const s=data.slides[index],isLab=s.kind==='lab'||s.kind==='native';
  media.querySelectorAll('video').forEach(v=>{v.pause();v.removeAttribute('src');v.load()});media.replaceChildren();resetZoom();
  if(window.ceDataLabs)window.ceDataLabs.show(isLab?(s.labId||'legacy'):'hidden');
  stage.classList.toggle('lab-mode',isLab);img.hidden=isLab;lab.hidden=!isLab;$('#ce-zoom').disabled=isLab;
  $('#ce-loading').hidden=isLab;$('#ce-slide-text').textContent=isLab?'':s.text.join('\n');
  if(!isLab){img.alt=`${index+1}쪽, ${s.title}`;img.src=s.image;if(img.complete&&img.naturalWidth)$('#ce-loading').hidden=true}
  page.value=index+1;$('#ce-total').textContent=data.slides.length;$('#ce-page-label').textContent=`${index+1} / ${data.slides.length}`;
  $('#ce-prev').disabled=index===0;$('#ce-next').disabled=index===data.slides.length-1;
  $('#ce-status').textContent=`${index+1} / ${data.slides.length}, ${s.title}`;
  for(const [j,f] of (s.videoFrames||[]).entries()){
   const frame=document.createElement('div');frame.className='ce-video-frame';Object.assign(frame.style,{left:`${f.x*100}%`,top:`${f.y*100}%`,width:`${f.width*100}%`,height:`${f.height*100}%`});
   const v=document.createElement('video');v.controls=true;v.preload='metadata';v.playsInline=true;v.src=f.src;v.setAttribute('aria-label',`${s.title}, 동영상 ${j+1}`);
   const play=document.createElement('button');play.className='ce-play';play.innerHTML=icon('play');play.setAttribute('aria-label','동영상 재생');
   play.addEventListener('click',()=>v.play().catch(()=>{$('#ce-status').textContent='동영상을 재생할 수 없습니다. 다시 시도하세요.'}));
   v.addEventListener('play',()=>{play.hidden=true});v.addEventListener('pause',()=>{play.hidden=false});v.addEventListener('ended',()=>{play.hidden=false});
   v.addEventListener('error',()=>{play.hidden=true;const a=document.createElement('a');a.className='ce-video-error';a.href=f.src;a.textContent='동영상 다시 열기';frame.append(a)});
   frame.append(v,play);media.append(frame);
  }
  $('#ce-links').innerHTML=s.links.map(u=>`<a href="${esc(u)}" target="_blank" rel="noopener noreferrer">${esc(new URL(u).hostname)} ↗</a>`).join('');$('#ce-open-links').hidden=!s.links.length;
  if(write)history.replaceState(null,'',`#slide-${index+1}`);
  toc.querySelectorAll('button').forEach((b,j)=>b.setAttribute('aria-current',String(j===index)));
  const next=data.slides.slice(index+1).find(slide=>slide.image);if(next){const pre=new Image();pre.src=next.image}
 }
 try{
  const response=await fetch(`../data/lectures/computer-education2/${viewer.dataset.chapter}.json?v=restore4`);if(!response.ok)throw Error('자료를 불러오지 못했습니다.');data=await response.json();page.max=data.slides.length;
  toc.innerHTML=data.slides.map((s,i)=>`<button type="button" data-index="${i}"><span>${i+1}</span><b>${esc(s.kind==='lab'?'체험 | '+s.title:s.title)}</b></button>`).join('');
  toc.addEventListener('click',e=>{const b=e.target.closest('button');if(b){render(Number(b.dataset.index));dialog.close()}});
  $('#ce-search').addEventListener('input',e=>{const q=e.target.value.toLocaleLowerCase();toc.querySelectorAll('button').forEach((b,i)=>b.hidden=!`${data.slides[i].kind==='lab'?'체험 ':''}${data.slides[i].title} ${data.slides[i].text.join(' ')}`.toLocaleLowerCase().includes(q))});
  $('#ce-open-toc').addEventListener('click',()=>{dialog.showModal();$('#ce-search').focus()});
  $('#ce-open-page').addEventListener('click',()=>{$('#ce-page-dialog').showModal();page.focus();page.select()});
  $('#ce-go-page').addEventListener('submit',e=>{e.preventDefault();render(Number(page.value||1)-1);$('#ce-page-dialog').close()});
  $('#ce-open-links').addEventListener('click',()=>$('#ce-links-dialog').showModal());
  document.querySelectorAll('.ce-dialog').forEach(d=>{d.querySelector('[data-close]').onclick=()=>d.close();d.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();e.stopPropagation();d.close()}})});
  $('#ce-prev').addEventListener('click',()=>render(index-1));$('#ce-next').addEventListener('click',()=>render(index+1));
  $('#ce-zoom').addEventListener('click',()=>{zoom=!zoom;stage.classList.toggle('zoom',zoom);setIcon($('#ce-zoom'),zoom?'zoom-out':'zoom-in',zoom?'화면에 맞춤':'확대');$('#ce-zoom').setAttribute('aria-pressed',String(zoom))});
  $('#ce-fullscreen').addEventListener('click',async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await viewer.requestFullscreen()}catch{$('#ce-status').textContent='이 브라우저에서는 전체 화면을 사용할 수 없습니다.'}});
  document.addEventListener('fullscreenchange',()=>setIcon($('#ce-fullscreen'),document.fullscreenElement?'minimize':'maximize',document.fullscreenElement?'전체 화면 종료':'전체 화면'));
  $('#ce-print').addEventListener('click',()=>window.print());
  img.addEventListener('load',()=>{$('#ce-loading').hidden=true});img.addEventListener('error',()=>{if(data.slides[index].kind!=='lab'){$('#ce-loading').hidden=false;$('#ce-loading').textContent='이미지를 불러오지 못했습니다. 새로고침해 주세요.'}});
  document.addEventListener('keydown',e=>{
   if(document.querySelector('.ce-dialog[open]')||e.ctrlKey||e.metaKey||e.altKey||e.isComposing||e.target.closest('input,select,textarea,video,[contenteditable=true],[role=textbox]'))return;
   const letter=e.code==='KeyF'?'f':e.code==='KeyA'?'a':e.code==='KeyD'?'d':e.key.toLowerCase();
   if(letter==='f'){if(!e.repeat){e.preventDefault();$('#ce-fullscreen').click()}return}
   if(e.target.closest('.ce-lab')&&!['a','d'].includes(letter))return;
   const actions={ArrowRight:()=>render(index+1),PageDown:()=>render(index+1),ArrowLeft:()=>render(index-1),PageUp:()=>render(index-1),Home:()=>render(0),End:()=>render(data.slides.length-1),a:()=>render(index-1),d:()=>render(index+1)};
   const action=actions[e.key]||actions[letter];if(action){e.preventDefault();action()}
  });
  let touch=null;stage.addEventListener('touchstart',e=>{if(e.touches.length===1&&!e.target.closest('button,input,select,textarea,video,.ce-lab'))touch=[e.touches[0].clientX,e.touches[0].clientY];else touch=null},{passive:true});
  stage.addEventListener('touchend',e=>{if(!touch||zoom)return;const dx=e.changedTouches[0].clientX-touch[0],dy=e.changedTouches[0].clientY-touch[1];if(Math.abs(dx)>60&&Math.abs(dx)>Math.abs(dy)*1.5)render(index+(dx<0?1:-1));else if(Math.abs(dx)<15&&Math.abs(dy)<15)reveal();touch=null},{passive:true});
  stage.addEventListener('pointerdown',e=>{if(e.pointerType==='touch')reveal()});
  window.addEventListener('hashchange',()=>render(hashIndex(),false));render(hashIndex(),false);viewer.dataset.ready='true';
 }catch(error){$('#ce-status').textContent=error.message;$('#ce-loading').hidden=false;$('#ce-loading').textContent='자료를 불러오지 못했습니다. 잠시 후 새로고침하세요.'}
})();
