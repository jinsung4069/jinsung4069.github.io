/* One set of navigation and reading tools, outside the slide and its activity state. */
window.LectureTools={init({viewer,data,current,selectors={},getText}){
 if(window.LecturePrint.mode)return;
 viewer.classList.add('lecture-ui');
 const find=(name,fallback)=>viewer.querySelector(selectors[name]||fallback||'#'+name);
 const stage=find('stage','.ce-stage'),toolbar=find('toolbar','.ce-toolbar');
 const bar=document.createElement('div');bar.className='lecture-tools ce-toolbar lecture-docked';bar.setAttribute('role','group');bar.setAttribute('aria-label','강의 도구');
 const nav=document.createElement('div');nav.className='lecture-navigation';nav.setAttribute('role','group');nav.setAttribute('aria-label','슬라이드 이동');
 const controls=document.createElement('div');controls.className='lecture-controls';
 const more=document.createElement('details');more.className='lecture-more';
 const summary=document.createElement('summary');summary.textContent='더보기';
 const options=document.createElement('div');options.className='lecture-more-options';more.append(summary,options);
 const label=(button,text)=>{button.querySelector('.lecture-button-label')?.remove();const span=document.createElement('span');span.className='lecture-button-label';span.textContent=text;button.append(span)};
 const move=(id,host,text)=>{const button=find(id);if(!button)return;button.classList.add('ce-glass');button.querySelector('svg')?.classList.add('ce-icon');label(button,text);host.append(button);return button};
 move('ce-prev',nav,'이전');
 const jump=move('ce-open-page',nav,'');jump.querySelector('.ce-icon')?.remove();
 const counter=viewer.querySelector('#ce-page-label')||document.createElement('span');counter.id='ce-page-label';counter.classList.remove('sr-only');jump.replaceChildren(counter);jump.classList.add('lecture-page-jump');
 move('ce-next',nav,'다음');move('ce-open-toc',controls,'목차');
 const button=(text,host,handler)=>{const b=document.createElement('button');b.type='button';b.textContent=text;b.addEventListener('click',handler);host.append(b);return b};
 const reader=document.createElement('section');reader.className='lecture-reader';reader.hidden=true;reader.setAttribute('aria-label','현재 슬라이드 텍스트');reader.id='lecture-reader';
 const reading=button('읽기 모드',controls,()=>{const active=reading.getAttribute('aria-pressed')!=='true';reading.setAttribute('aria-pressed',String(active));reader.hidden=!active;viewer.classList.toggle('reading-mode',active)});reading.setAttribute('aria-pressed','false');reading.setAttribute('aria-controls',reader.id);
 move('ce-fullscreen',controls,'전체 화면');
 const zoom=move('ce-zoom',options,'확대');move('ce-open-links',options,'관련 링크');
 const title=()=>`${data.title}, ${current()+1}쪽, ${data.slides[current()].title}`;
 const mark=button('북마크',options,()=>{window.siteLearning?.toggle(title());update(false)});mark.setAttribute('aria-pressed','false');
 button('현재 쪽 공유',options,async()=>{
  const url=new URL(location.href);url.searchParams.delete('lecture-print');url.searchParams.delete('print-slides');
  try{await navigator.clipboard.writeText(url.href);status.textContent='현재 쪽 링크를 복사했습니다.'}catch{shareDialog.querySelector('input').value=url.href;shareDialog.showModal();shareDialog.querySelector('input').select()}
 });
 move('ce-print',options,'선택 인쇄').setAttribute('aria-label','선택 인쇄');
 const status=document.createElement('span');status.className='lecture-tool-status';status.setAttribute('role','status');
 controls.append(more);bar.append(nav,controls,status);find('heading','.ce-heading').after(bar);stage.after(reader);toolbar.remove();
 function dialog(title,content){const d=document.createElement('dialog');d.className='ce-dialog lecture-options';d.setAttribute('aria-label',title);d.innerHTML=`<form method="dialog"><button class="lecture-close" aria-label="닫기">닫기</button></form><h2>${title}</h2>${content}`;d.addEventListener('keydown',e=>e.stopPropagation());d.addEventListener('close',()=>summary.focus({preventScroll:true}));viewer.append(d);return d}
 const shareDialog=dialog('현재 쪽 링크','<label>주소를 복사하세요<input readonly aria-label="현재 쪽 주소"></label>');
 const printDialog=dialog('인쇄할 쪽 선택',`<form id="lecture-print-options"><label>선택 방식<select id="lecture-print-kind"><option value="current">현재 쪽</option><option value="range">쪽 범위</option><option value="labs">실습 활동</option><option value="all">전체</option></select></label><div id="lecture-print-range" hidden><label>시작 쪽<input id="lecture-from" type="number" min="1" max="${data.slides.length}" value="1"></label><label>마지막 쪽<input id="lecture-to" type="number" min="1" max="${data.slides.length}" value="1"></label></div><p role="status" id="lecture-print-error"></p><button type="submit">인쇄 준비</button></form>`);
 window.LectureTools.openPrintOptions=()=>{printDialog.querySelector('#lecture-from').value=current()+1;printDialog.querySelector('#lecture-to').value=current()+1;printDialog.querySelector('#lecture-print-error').textContent='';printDialog.showModal()};
 function setPrintKind(){const range=printDialog.querySelector('select').value==='range';printDialog.querySelector('#lecture-print-range').hidden=!range;printDialog.querySelectorAll('input').forEach(input=>input.disabled=!range)}
 printDialog.querySelector('select').onchange=setPrintKind;setPrintKind();
 printDialog.querySelector('#lecture-print-options').onsubmit=e=>{
  e.preventDefault();const kind=printDialog.querySelector('select').value;let indices;
  if(kind==='current')indices=[current()];
  if(kind==='labs')indices=data.slides.flatMap((s,i)=>['lab','native'].includes(s.kind)?[i]:[]);
  if(kind==='range'){const first=Number(printDialog.querySelector('#lecture-from').value),last=Number(printDialog.querySelector('#lecture-to').value);if(!Number.isInteger(first)||!Number.isInteger(last)||first<1||last>data.slides.length||last<first){printDialog.querySelector('#lecture-print-error').textContent='올바른 시작 쪽과 마지막 쪽을 입력하세요.';return}indices=Array.from({length:last-first+1},(_,i)=>first-1+i)}
  if(indices?.length===0){printDialog.querySelector('#lecture-print-error').textContent='이 강의에는 별도 실습 슬라이드가 없습니다.';return}
  printDialog.close();window.LecturePrint.printAll({indices});
 };
 options.addEventListener('click',e=>{if(e.target.closest('button')){more.open=false;if(!document.querySelector('dialog[open]'))summary.focus({preventScroll:true})}});
 document.addEventListener('click',e=>{if(!more.contains(e.target))more.open=false});
 more.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();e.stopPropagation();more.open=false;summary.focus()}});
 const lab=viewer.querySelector('#ce-lab,#ae-lab');
 if(lab){
  const enhance=()=>{
   lab.querySelectorAll('button').forEach(b=>{if(['처음부터','다시 하기'].includes(b.textContent.trim()))b.textContent='활동 초기화'});
   lab.querySelectorAll('table').forEach(table=>{if(table.parentElement.classList.contains('lecture-table-scroll'))return;const wrap=document.createElement('div');wrap.className='lecture-table-scroll';wrap.tabIndex=0;wrap.setAttribute('role','region');wrap.setAttribute('aria-label','활동 표, 필요한 경우 가로로 스크롤');table.before(wrap);wrap.append(table)});
  };
  new MutationObserver(enhance).observe(lab,{childList:true,subtree:true});
 }
 function update(save=true){
  const s=data.slides[current()];counter.textContent=`${current()+1} / ${data.slides.length}`;jump.setAttribute('aria-label',`현재 ${current()+1}쪽, 전체 ${data.slides.length}쪽, 페이지 이동`);
  if(zoom)zoom.hidden=['lab','native'].includes(s.kind);
  reader.replaceChildren();const h=document.createElement('h2');h.textContent=`${current()+1}. ${s.title}`;reader.append(h);
  for(const line of getText?.()||s.text||[]){const p=document.createElement('p');p.textContent=line;reader.append(p)}
  if(['lab','native'].includes(s.kind)){const p=document.createElement('p');p.textContent='실습 화면에서 활동을 실행하세요. 읽기 모드를 바꾸어도 입력 내용은 유지됩니다.';reader.append(p)}
  if(save)window.siteLearning?.remember(title());const marked=window.siteLearning?.bookmarked()||false;mark.setAttribute('aria-pressed',String(marked));mark.textContent=marked?'북마크 해제':'북마크';status.textContent='';
 }
 window.addEventListener('local-progress-import',e=>{if(e.detail.key==='lectureLibraryV1')update(false)});
 return update;
}};
