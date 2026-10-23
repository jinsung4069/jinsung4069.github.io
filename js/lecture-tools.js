/* Optional reader controls. Slide renderers and game state remain owned by the viewer. */
window.LectureTools={init({viewer,data,render,current}){
 if(window.LecturePrint.mode)return;
 const bar=document.createElement('div');bar.className='lecture-tools';bar.setAttribute('aria-label','읽기와 기록 도구');
 const button=(text,handler)=>{const b=document.createElement('button');b.type='button';b.textContent=text;b.addEventListener('click',handler);bar.append(b);return b};
 const reader=document.createElement('section');reader.className='lecture-reader';reader.hidden=true;reader.setAttribute('aria-label','현재 슬라이드 텍스트');
 const reading=button('읽기 모드',()=>{const active=reading.getAttribute('aria-pressed')!=='true';reading.setAttribute('aria-pressed',String(active));reader.hidden=!active;viewer.classList.toggle('reading-mode',active);dockToolbar()});reading.setAttribute('aria-pressed','false');
 const mark=button('북마크',()=>{window.siteLearning.toggle(title());update(false)});mark.setAttribute('aria-pressed','false');
 const share=button('현재 쪽 공유',async()=>{
  const url=new URL(location.href);url.searchParams.delete('lecture-print');url.searchParams.delete('print-slides');
  try{await navigator.clipboard.writeText(url.href);status.textContent='현재 쪽 링크를 복사했습니다.'}catch{shareDialog.querySelector('input').value=url.href;shareDialog.showModal();shareDialog.querySelector('input').select()}
 });
 const print=button('선택 인쇄',()=>{printDialog.querySelector('#lecture-from').value=current()+1;printDialog.querySelector('#lecture-to').value=current()+1;printDialog.showModal()});
 const status=document.createElement('span');status.setAttribute('role','status');bar.append(status);
 viewer.querySelector('.ce-heading').after(bar);viewer.querySelector('.ce-stage').after(reader);
 const toolbar=viewer.querySelector('.ce-toolbar'),stage=viewer.querySelector('.ce-stage'),small=matchMedia('(max-width:760px)');
 function dockToolbar(){const dock=!document.fullscreenElement&&(small.matches||viewer.classList.contains('reading-mode'));toolbar.classList.toggle('lecture-docked',dock);if(dock)stage.after(toolbar);else stage.append(toolbar)}
 small.addEventListener('change',dockToolbar);document.addEventListener('fullscreenchange',dockToolbar);dockToolbar();
 function dialog(title,content){const d=document.createElement('dialog');d.className='ce-dialog lecture-options';d.setAttribute('aria-label',title);d.innerHTML=`<form method="dialog"><button class="lecture-close" aria-label="닫기">닫기</button></form><h2>${title}</h2>${content}`;viewer.append(d);return d}
 const shareDialog=dialog('현재 쪽 링크','<label>주소를 복사하세요<input readonly aria-label="현재 쪽 주소"></label>');
 const printDialog=dialog('인쇄할 쪽 선택',`<form id="lecture-print-options"><label>선택 방식<select id="lecture-print-kind"><option value="current">현재 쪽</option><option value="range">쪽 범위</option><option value="labs">실습 활동</option><option value="all">전체</option></select></label><div id="lecture-print-range" hidden><label>시작 쪽<input id="lecture-from" type="number" min="1" max="${data.slides.length}" value="1"></label><label>마지막 쪽<input id="lecture-to" type="number" min="1" max="${data.slides.length}" value="1"></label></div><p role="status" id="lecture-print-error"></p><button type="submit">인쇄 준비</button></form>`);
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
 const title=()=>`${data.title}, ${current()+1}쪽, ${data.slides[current()].title}`;
 function update(save=true){const s=data.slides[current()];reader.replaceChildren();const h=document.createElement('h2');h.textContent=`${current()+1}. ${s.title}`;reader.append(h);for(const line of s.text||[]){const p=document.createElement('p');p.textContent=line;reader.append(p)}if(['lab','native'].includes(s.kind)){const p=document.createElement('p');p.textContent='위 실습 화면에서 활동을 실행하세요. 입력 내용은 모드를 바꾸어도 유지됩니다.';reader.append(p)}if(save)window.siteLearning.remember(title());mark.setAttribute('aria-pressed',String(window.siteLearning.bookmarked()));mark.textContent=window.siteLearning.bookmarked()?'북마크 해제':'북마크';}
 window.addEventListener('local-progress-import',e=>{if(e.detail.key==='lectureLibraryV1')update(false)});
 return update;
}};
