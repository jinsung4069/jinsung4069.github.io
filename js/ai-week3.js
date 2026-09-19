(() => {
  'use strict';
  const {slides,chapters}=window.WEEK3;
  const $=(s,root=document)=>root.querySelector(s);
  const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const table=t=>`<table><thead><tr>${t.heads.map(h=>`<th scope="col">${esc(h)}</th>`).join('')}</tr></thead><tbody>${t.rows.map(row=>`<tr>${row.map(v=>`<td>${esc(v)}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
  $('#stage').innerHTML=slides.map((s,i)=>{
    let inner='';
    if(s.type==='cover') inner=`<div class="cover-copy"><p>${esc(s.sub)}</p><h1>${esc(s.title)}</h1></div><div class="presenter">전인성<br>광주교육대학교 컴퓨터교육과</div>`;
    else if(s.type==='section') inner=`<div class="section-copy"><h2>${esc(s.title)}</h2><p>${esc(s.sub)}</p></div>`;
    else inner=`<h2 class="slide-title">${esc(s.title)}</h2><span class="slide-chapter">${esc(chapters[s.ch])}</span><div class="slide-body">${s.lead?`<p class="lead">${esc(s.lead)}</p>`:''}${s.figure?`<figure class="source-figure"><img src="${esc(s.figure.src)}" alt="${esc(s.figure.alt)}"><figcaption>${esc(s.credit)}</figcaption></figure>`:''}${s.compare?`<div class="comparison">${s.compare.map(c=>`<section><h3>${c[0]}</h3><p>${c[1]}</p></section>`).join('')}</div>`:''}${s.html||''}${(s.paragraphs||[]).map(p=>`<p>${p}</p>`).join('')}${s.steps?`<ol class="process">${s.steps.map((x,j)=>`<li><b>${j+1}</b>${esc(x)}</li>`).join('')}</ol>`:''}${s.table?table(s.table):''}${s.note?`<p class="foundation-note">${esc(s.note)}</p>`:''}${s.lab?`<div class="lab" data-kind="${s.lab}">${Week3Labs.render(s.lab)}</div>`:''}</div>`;
    const footer=`<div class="slide-footer"><span>${s.source?`<a href="${esc(s.source.url)}" target="_blank" rel="noopener">${esc(s.source.label)}</a>`:'AI알고리즘, 인공지능의 이해와 원리'}</span><span>${i+1}</span></div>`;
    return `<article class="slide ${s.type||'foundation'}${s.figure?' has-figure':''}" id="slide-${i+1}" data-lab="${s.lab||''}" aria-roledescription="슬라이드" aria-label="${i+1} / ${slides.length}, ${esc(s.title.replace('\n',' '))}" ${i?'hidden':''}>${inner}${footer}</article>`;
  }).join('');
  document.querySelectorAll('.lab').forEach(Week3Labs.bind);
  const viewer = $('#deckViewer');
  const dialog = $('#tocDialog');
  const pageDialog = $('#pageDialog');
  const pageNumber = $('#pageNumber');
  const articles = [...document.querySelectorAll('.slide')];
  const searchText = articles.map(article => article.textContent.toLocaleLowerCase());
  $('#tocContents').innerHTML = chapters.map((ch,j) => `<section><h3>${esc(ch)}</h3>${slides.map((s,i) => s.ch===j ? `<button type="button" data-slide="${i}"><span>${i+1}</span><b>${esc(s.title.replace('\n',' '))}</b></button>` : '').join('')}</section>`).join('');
  const tocButtons = [...$('#tocContents').querySelectorAll('button')];
  pageNumber.max = slides.length;
  $('#totalSlides').textContent = slides.length;
  let current = -1;
  let revealTimer;
  function revealControls() {
    viewer.classList.add('controls-visible');
    clearTimeout(revealTimer);
    revealTimer = setTimeout(() => viewer.classList.remove('controls-visible'), 3500);
  }
  viewer.addEventListener('pointerdown', revealControls);
  const fromHash = () => {
    const match = location.hash.match(/^#slide-(\d+)$/);
    return match ? Math.min(slides.length-1, Math.max(0, Number(match[1])-1)) : 0;
  };
  function go(index, hash=true) {
    index = Math.max(0, Math.min(slides.length-1, index));
    articles.forEach((article,j) => article.hidden = index !== j);
    current = index;
    viewer.classList.toggle('lab-mode', !!slides[index].lab);
    pageNumber.value = index+1;
    $('#previous').disabled = index === 0;
    $('#next').disabled = index === slides.length-1;
    $('#slideStatus').textContent = `${index+1} / ${slides.length}, ${slides[index].title.replace('\n',' ')}`;
    tocButtons.forEach((button,j) => button.setAttribute('aria-current', String(index === j)));
    if (hash && location.hash !== `#slide-${index+1}`) history.pushState(null, '', `#slide-${index+1}`);
  }
  $('#previous').addEventListener('click', () => go(current-1));
  $('#next').addEventListener('click', () => go(current+1));
  window.addEventListener('hashchange', () => go(fromHash(), false));
  $('#tocButton').addEventListener('click', () => dialog.showModal());
  $('#closeToc').addEventListener('click', () => dialog.close());
  $('#tocSearch').addEventListener('input', event => {
    const query = event.target.value.trim().toLocaleLowerCase();
    tocButtons.forEach(button => button.hidden = !searchText[Number(button.dataset.slide)].includes(query));
    $('#tocContents').querySelectorAll('section').forEach(section => section.hidden = !section.querySelector('button:not([hidden])'));
    $('#tocEmpty').hidden = tocButtons.some(button => !button.hidden);
  });
  dialog.addEventListener('click', event => {
    const button = event.target.closest('button[data-slide]');
    if (button) { go(Number(button.dataset.slide)); dialog.close(); }
  });
  $('#pageButton').addEventListener('click', () => { pageNumber.value = current+1; pageDialog.showModal(); pageNumber.focus(); pageNumber.select(); });
  $('#closePage').addEventListener('click', () => pageDialog.close());
  $('#pageForm').addEventListener('submit', event => { event.preventDefault(); go(Number(pageNumber.value)-1); pageDialog.close(); });
  [dialog, pageDialog].forEach(modal => {
    modal.addEventListener('close', revealControls);
    modal.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        modal.close();
      }
    });
  });
  function setFullscreenButton() {
    const active = !!document.fullscreenElement;
    const button = $('#fullscreenButton');
    const label = active ? '전체 화면 종료' : '전체 화면';
    button.setAttribute('aria-label', label);
    button.dataset.tip = label;
    button.querySelector('use').setAttribute('href', `#deck-icon-${active ? 'minimize' : 'maximize'}`);
  }
  $('#fullscreenButton').addEventListener('click', async () => {
    try { if (document.fullscreenElement) await document.exitFullscreen(); else await $('#presentation').requestFullscreen(); }
    catch { $('#slideStatus').textContent = '이 브라우저에서는 전체 화면을 사용할 수 없습니다.'; }
  });
  document.addEventListener('fullscreenchange', setFullscreenButton);
  window.LecturePrint.register({button:$('#printButton'),title:'AI알고리즘, 인공지능의 이해와 원리',slides,assets:()=>slides.filter(s=>s.figure).map(s=>s.figure.src),
    render(i){go(i,false);const node=document.querySelectorAll('#stage > .slide')[i];return {node,width:1280,height:Math.max(node.scrollHeight,node.offsetHeight)}}
  });
  document.addEventListener('keydown', event => {
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.isComposing || dialog.open || pageDialog.open || event.target.closest('input,textarea,select,video,[contenteditable=true],[role=textbox]')) return;
    if (event.code === 'KeyF' || event.key.toLowerCase() === 'f') {
      if (!event.repeat) { event.preventDefault(); $('#fullscreenButton').click(); }
      return;
    }
    if (event.target.closest('summary,.lab,header') || (event.key===' ' && event.target.closest('button,a'))) return;
    const key = event.key.toLowerCase();
    if (['ArrowRight','PageDown',' ','ArrowLeft','PageUp','Home','End'].includes(event.key) || ['a','d'].includes(key)) {
      event.preventDefault();
      go(event.key==='Home' ? 0 : event.key==='End' ? slides.length-1 : current+((['ArrowLeft','PageUp'].includes(event.key)||key==='a') ? -1 : 1));
    }
  });
  let touch = null;
  viewer.addEventListener('touchstart', e => {
    if (e.target.closest('input,select,textarea,button,a,.lab')) { touch=null; return; }
    touch = {x:e.changedTouches[0].clientX,y:e.changedTouches[0].clientY};
  },{passive:true});
  viewer.addEventListener('touchend', e => {
    if(!touch)return;
    const dx=e.changedTouches[0].clientX-touch.x,dy=e.changedTouches[0].clientY-touch.y;
    if(Math.abs(dx)>60 && Math.abs(dx)>Math.abs(dy)*1.5)go(current+(dx<0?1:-1));
    touch=null;
  },{passive:true});
  go(fromHash(), false);
  revealControls();
})();
