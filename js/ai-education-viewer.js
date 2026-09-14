/* Original PowerPoint line layout with selectable HTML text and source images. */
(async()=>{
 'use strict';
 const $=s=>document.querySelector(s),viewer=$('.ce-viewer');if(!viewer)return;
 const stage=$('#ce-stage'),canvas=$('#ae-slide'),viewport=$('.ce-viewport'),toc=$('#ce-toc'),page=$('#ce-page');
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const icon=name=>`<svg class="ce-icon" viewBox="0 0 24 24" aria-hidden="true"><use href="#ce-icon-${name}"></use></svg>`;
 const setIcon=(b,name,label)=>{b.innerHTML=icon(name);b.setAttribute('aria-label',label);b.dataset.tip=label};
 let data,index=0,zoom=false,touch=null,timer;
 function reveal(){stage.classList.add('controls-visible');clearTimeout(timer);timer=setTimeout(()=>stage.classList.remove('controls-visible'),3500)}
 function resize(){if(!data)return;const scale=stage.clientWidth/data.width*(zoom?2:1);canvas.style.transform=`scale(${scale})`;$('#ae-size').style.width=`${data.width*scale}px`;$('#ae-size').style.height=`${data.height*scale}px`}
 function fitText(){canvas.querySelectorAll('.ae-run').forEach(el=>{el.style.transform='';const width=el.offsetWidth;if(width)el.style.transform=`scaleX(${Number(el.dataset.width)/width})`})}
 function weight(run){const n=run.font.match(/([1-9])\s/);return n?Number(n[1])*100:(run.bold?700:400)}
 function render(i,write=true){
  index=Math.max(0,Math.min(data.slides.length-1,i));const s=data.slides[index];zoom=false;stage.classList.remove('zoom');viewport.scrollTo(0,0);setIcon($('#ce-zoom'),'zoom-in','확대');$('#ce-zoom').setAttribute('aria-pressed','false');
  canvas.innerHTML=`<img class="ae-background" src="${esc(s.background)}" alt="" draggable="false">`+s.pictures.map(p=>{const c=p.crop,dx=1-c.l-c.r,dy=1-c.t-c.b;return `<div class="ae-picture" style="left:${p.x}px;top:${p.y}px;width:${p.w}px;height:${p.h}px"><img src="${esc(p.src)}" alt="${esc(s.title)} 원본 그림" draggable="false" style="left:${-c.l/dx*100}%;top:${-c.t/dy*100}%;width:${100/dx}%;height:${100/dy}%"></div>`}).join('')+s.runs.map(r=>`<span class="ae-run" aria-hidden="true" data-width="${r.w}" style="left:${r.x}px;top:${r.y}px;font-size:${r.size}px;font-weight:${weight(r)};font-style:${r.italic?'italic':'normal'};color:${r.color};line-height:${r.h}px">${esc(r.text)}</span>`).join('');
  canvas.setAttribute('aria-label',`${index+1}쪽, ${s.title}`);canvas.style.width=data.width+'px';canvas.style.height=data.height+'px';fitText();resize();
  $('#ce-slide-text').textContent=s.text.join('\n');page.value=index+1;$('#ce-total').textContent=data.slides.length;$('#ce-page-label').textContent=`${index+1} / ${data.slides.length}`;$('#ce-status').textContent=`${index+1} / ${data.slides.length}, ${s.title}`;
  $('#ce-prev').disabled=index===0;$('#ce-next').disabled=index===data.slides.length-1;
  $('#ae-notes-title').textContent=`${index+1}쪽, ${s.title}`;$('#ae-notes-body').replaceChildren(...s.notes.map(t=>{const p=document.createElement('p');p.textContent=t;return p}));$('#ae-notes').hidden=!s.notes.length;
  $('#ce-links').innerHTML=s.links.map(u=>`<a href="${esc(u)}" target="_blank" rel="noopener noreferrer">${esc(u)}</a>`).join('');$('#ce-open-links').hidden=!s.links.length;
  toc.querySelectorAll('button').forEach((b,j)=>b.setAttribute('aria-current',String(j===index)));
  if(write)history.replaceState(null,'',`#slide-${index+1}`);
  $('#ce-loading').hidden=true;canvas.querySelectorAll('img').forEach(im=>im.onerror=()=>{$('#ce-loading').textContent='그림을 불러오지 못했습니다. 새로고침해 주세요.';$('#ce-loading').hidden=false});
  if(data.slides[index+1]){const im=new Image();im.src=data.slides[index+1].background}
 }
 function hashIndex(){const m=location.hash.match(/^#slide-(\d+)$/);return m?Number(m[1])-1:0}
 try{
  const res=await fetch(`/data/lectures/ai-education/${viewer.dataset.chapter}.json?v=20260915a`);if(!res.ok)throw Error('자료를 불러오지 못했습니다.');data=await res.json();
  await Promise.all([200,400,500,600,700,800].map(w=>document.fonts.load(`${w} 32px Freesentation`)));await document.fonts.ready;
  page.max=data.slides.length;toc.innerHTML=data.slides.map((s,i)=>`<button type="button" data-index="${i}"><span>${i+1}</span><b>${esc(s.title)}</b></button>`).join('');
  toc.onclick=e=>{const b=e.target.closest('[data-index]');if(b){render(Number(b.dataset.index));$('#ce-dialog').close()}};
  $('#ce-search').oninput=e=>{const query=e.target.value.toLocaleLowerCase();toc.querySelectorAll('button').forEach((b,i)=>b.hidden=!`${data.slides[i].title} ${data.slides[i].text.join(' ')}`.toLocaleLowerCase().includes(query))};
  $('#ce-open-toc').onclick=()=>{$('#ce-dialog').showModal();$('#ce-search').focus()};$('#ce-open-page').onclick=()=>{$('#ce-page-dialog').showModal();page.focus();page.select()};
  $('#ce-go-page').onsubmit=e=>{e.preventDefault();render(Number(page.value||1)-1);$('#ce-page-dialog').close()};
  $('#ce-open-links').onclick=()=>$('#ce-links-dialog').showModal();$('#ae-notes').onclick=()=>$('#ae-notes-dialog').showModal();
  document.querySelectorAll('.ce-dialog').forEach(d=>{d.querySelector('[data-close]').onclick=()=>d.close();d.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();e.stopPropagation();d.close()}})});
  $('#ce-prev').onclick=()=>render(index-1);$('#ce-next').onclick=()=>render(index+1);
  $('#ce-zoom').onclick=()=>{zoom=!zoom;stage.classList.toggle('zoom',zoom);setIcon($('#ce-zoom'),zoom?'zoom-out':'zoom-in',zoom?'화면에 맞춤':'확대');$('#ce-zoom').setAttribute('aria-pressed',String(zoom));resize()};
  $('#ce-fullscreen').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await viewer.requestFullscreen()}catch{$('#ce-status').textContent='이 브라우저에서는 전체 화면을 사용할 수 없습니다.'}};
  document.addEventListener('fullscreenchange',()=>{setIcon($('#ce-fullscreen'),document.fullscreenElement?'minimize':'maximize',document.fullscreenElement?'전체 화면 종료':'전체 화면');resize()});
  $('#ce-print').onclick=()=>window.print();
  document.addEventListener('keydown',e=>{if(document.querySelector('.ce-dialog[open]')||e.ctrlKey||e.metaKey||e.altKey||e.isComposing||e.target.closest('input,select,textarea,[contenteditable=true]'))return;const letter=e.code==='KeyF'?'f':e.code==='KeyA'?'a':e.code==='KeyD'?'d':e.key.toLowerCase();if(letter==='f'){if(!e.repeat){e.preventDefault();$('#ce-fullscreen').click()}return}const actions={ArrowRight:()=>render(index+1),PageDown:()=>render(index+1),ArrowLeft:()=>render(index-1),PageUp:()=>render(index-1),Home:()=>render(0),End:()=>render(data.slides.length-1),a:()=>render(index-1),d:()=>render(index+1)};const action=actions[e.key]||actions[letter];if(action){e.preventDefault();action()}});
  stage.addEventListener('touchstart',e=>{touch=e.touches.length===1&&!e.target.closest('button,input,select,textarea,a')?[e.touches[0].clientX,e.touches[0].clientY]:null},{passive:true});
  stage.addEventListener('touchend',e=>{if(!touch||zoom)return;const dx=e.changedTouches[0].clientX-touch[0],dy=e.changedTouches[0].clientY-touch[1];if(Math.abs(dx)>60&&Math.abs(dx)>Math.abs(dy)*1.5)render(index+(dx<0?1:-1));else if(Math.abs(dx)<15&&Math.abs(dy)<15)reveal();touch=null},{passive:true});
  stage.addEventListener('pointerdown',e=>{if(e.pointerType==='touch')reveal()});new ResizeObserver(resize).observe(stage);window.addEventListener('hashchange',()=>render(hashIndex(),false));window.addEventListener('beforeprint',resize);window.addEventListener('afterprint',resize);render(hashIndex(),false);viewer.dataset.ready='true';
 }catch(e){$('#ce-loading').hidden=false;$('#ce-loading').textContent='자료를 불러오지 못했습니다. 새로고침해 주세요.';$('#ce-status').textContent=e.message}
})();
