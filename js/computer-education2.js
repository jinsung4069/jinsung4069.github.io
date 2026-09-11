/* Source slides, accessible text, and embedded media share a single page index. */
(async()=>{
 'use strict';
 const $=s=>document.querySelector(s), viewer=$('.ce-viewer');
 if(!viewer)return;
 const n=Number(viewer.dataset.chapter),esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 try{
 const response=await fetch(`../data/lectures/computer-education2/${n}.json`);if(!response.ok)throw Error('자료를 불러오지 못했습니다.');
 const data=await response.json();let index=0;
 const img=$('#ce-image'),toc=$('#ce-toc'),dialog=$('#ce-dialog'),page=$('#ce-page'),textPanel=$('#ce-text'),media=$('#ce-media');
 page.max=data.slides.length;$('#ce-total').textContent=data.slides.length;
 function hashIndex(){const match=location.hash.match(/^#slide-(\d+)$/);return match?Math.max(0,Math.min(data.slides.length-1,Number(match[1])-1)):0}
 function render(i,write=true){
  index=Math.max(0,Math.min(data.slides.length-1,i));const s=data.slides[index];
  media.querySelectorAll('video').forEach(v=>v.pause());
  img.alt=`${index+1}쪽, ${s.title}`;$('#ce-loading').hidden=false;img.src=s.image;
  page.value=index+1;$('#ce-prev').disabled=index===0;$('#ce-next').disabled=index===data.slides.length-1;
  $('#ce-progress').style.width=`${(index+1)/data.slides.length*100}%`;
  $('#ce-status').textContent=`${index+1} / ${data.slides.length}, ${s.title}`;
  textPanel.innerHTML=`<h2>${esc(s.title)}</h2>`+(s.text.length?s.text.map(p=>`<p>${esc(p)}</p>`).join(''):'<p>이 페이지는 그림 자료입니다. 슬라이드를 확대해 확인하세요.</p>');
  media.hidden=!s.videos.length&&!s.links.length;
  $('#ce-media-jump').hidden=!s.videos.length;
  media.innerHTML=(s.videos.length?'<h2>동영상</h2>'+s.videos.map((v,j)=>`<video controls preload="none" playsinline aria-label="${esc(s.title)} 동영상 ${j+1}"><source src="${esc(v)}" type="video/mp4">브라우저에서 동영상을 재생할 수 없습니다. <a href="${esc(v)}">동영상 열기</a></video>`).join(''):'')+(s.links.length?'<h2>관련 링크</h2><div class="ce-related">'+s.links.map((u,j)=>`<a href="${esc(u)}" target="_blank" rel="noopener noreferrer">${s.links.length>1?j+1+'. ':''}${esc(new URL(u).hostname)}에서 열기 ↗</a>`).join('')+'</div>':'');
  if(write)history.replaceState(null,'',`#slide-${index+1}`);
  toc.querySelectorAll('button').forEach((b,j)=>b.setAttribute('aria-current',String(j===index)));
  if(index+1<data.slides.length){const next=new Image();next.src=data.slides[index+1].image}
 }
 img.addEventListener('load',()=>{$('#ce-loading').hidden=true});
 img.addEventListener('error',()=>{$('#ce-loading').hidden=false;$('#ce-loading').textContent='이미지를 불러오지 못했습니다. 새로고침하거나 본문 보기를 이용하세요.'});
 toc.innerHTML=data.slides.map((s,i)=>`<button type="button" data-index="${i}"><span>${i+1}</span>${esc(s.title)}</button>`).join('');
 toc.addEventListener('click',e=>{const b=e.target.closest('button');if(b){render(Number(b.dataset.index));dialog.close()}});
 $('#ce-search').addEventListener('input',e=>{const q=e.target.value.toLocaleLowerCase();toc.querySelectorAll('button').forEach((b,i)=>b.hidden=!`${data.slides[i].title} ${data.slides[i].text.join(' ')}`.toLocaleLowerCase().includes(q))});
 $('#ce-open-toc').addEventListener('click',()=>{dialog.showModal();$('#ce-search').focus()});$('#ce-close-toc').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();e.stopPropagation();dialog.close()}});
 $('#ce-prev').addEventListener('click',()=>render(index-1));$('#ce-next').addEventListener('click',()=>render(index+1));
 page.addEventListener('change',()=>render(Number(page.value||1)-1));
 $('#ce-text-toggle').addEventListener('click',e=>{textPanel.hidden=!textPanel.hidden;e.currentTarget.setAttribute('aria-pressed',String(!textPanel.hidden))});
 $('#ce-zoom').addEventListener('click',e=>{const active=$('#ce-stage').classList.toggle('zoom');e.currentTarget.setAttribute('aria-pressed',String(active));e.currentTarget.textContent=active?'화면에 맞춤':'확대'});
 $('#ce-fullscreen').addEventListener('click',async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await viewer.requestFullscreen()}catch{$('#ce-status').textContent='이 브라우저에서는 전체 화면을 사용할 수 없습니다.'}});
 document.addEventListener('fullscreenchange',()=>{$('#ce-fullscreen').textContent=document.fullscreenElement?'전체 화면 종료':'전체 화면'});
 $('#ce-print').addEventListener('click',()=>window.print());
 $('#ce-media-jump').addEventListener('click',()=>media.scrollIntoView({behavior:'smooth',block:'start'}));
 document.addEventListener('keydown',e=>{if(dialog.open||e.ctrlKey||e.metaKey||e.altKey||e.target.closest('input,select,textarea,video,.ce-lab'))return;const actions={ArrowRight:()=>render(index+1),PageDown:()=>render(index+1),ArrowLeft:()=>render(index-1),PageUp:()=>render(index-1),Home:()=>render(0),End:()=>render(data.slides.length-1)};if(actions[e.key]){e.preventDefault();actions[e.key]()}});
 let touch=null;img.addEventListener('touchstart',e=>{if(e.touches.length===1)touch=[e.touches[0].clientX,e.touches[0].clientY]},{passive:true});img.addEventListener('touchend',e=>{if(!touch||$('#ce-stage').classList.contains('zoom'))return;const dx=e.changedTouches[0].clientX-touch[0],dy=e.changedTouches[0].clientY-touch[1];if(Math.abs(dx)>60&&Math.abs(dx)>Math.abs(dy)*1.5)render(index+(dx<0?1:-1));touch=null},{passive:true});
 window.addEventListener('hashchange',()=>render(hashIndex(),false));render(hashIndex(),false);
 }catch(error){$('#ce-status').textContent=error.message;$('#ce-loading').textContent='자료를 불러오지 못했습니다. 잠시 후 새로고침하세요.'}
})();
