/* Adapt the three HTML algorithm decks to the same tools as image and native decks. */
(()=>{
 if(window.LecturePrint.mode)return;
 const source=window.WEEK2||window.WEEK3||window.WEEK4,viewer=document.getElementById('presentation');if(!source||!viewer)return;
 viewer.classList.add('ce-viewer','algorithm-ui');
 const heading=viewer.querySelector('.lecture-toolbar');heading.classList.add('ce-heading');
 const title=document.createElement('h1');title.textContent=document.title.split('|')[0].trim();heading.append(title);
 const stage=viewer.querySelector('.deck-viewer');stage.classList.add('ce-stage');
 const current=()=>Number(viewer.querySelector('#pageNumber').value)-1;
 const update=window.LectureTools.init({viewer,current,data:{title:title.textContent,slides:source.slides.map(s=>({title:s.title,kind:s.lab?'lab':undefined}))},
  selectors:{stage:'.deck-viewer',toolbar:'.deck-tools',heading:'.lecture-toolbar','ce-prev':'#previous','ce-next':'#next','ce-open-page':'#pageButton','ce-open-toc':'#tocButton','ce-fullscreen':'#fullscreenButton','ce-print':'#printButton'},
  getText:()=>viewer.querySelector('#stage>.slide:not([hidden])').innerText.split('\n').filter(Boolean)
 });
 new MutationObserver(update).observe(viewer.querySelector('#slideStatus'),{childList:true});
 const fullscreen=viewer.querySelector('#fullscreenButton');document.addEventListener('fullscreenchange',()=>{fullscreen.querySelector('.lecture-button-label').textContent=fullscreen.getAttribute('aria-label')});
 update();viewer.dataset.ready='true';
})();
