/* Image enlargement is scoped to Chapter 5; shared slide navigation is unchanged. */
(()=>{
 const canvas=document.querySelector('#ae-slide'),dialog=document.querySelector('#ch5-image-dialog');if(!canvas||!dialog)return;
 const img=dialog.querySelector('img'),title=dialog.querySelector('h2');
 new MutationObserver(()=>canvas.querySelectorAll('.ae-picture:not(.ch5-picture)').forEach((p,i)=>{p.classList.add('ch5-picture');p.setAttribute('role','button');p.tabIndex=0;p.setAttribute('aria-label',`${p.querySelector('img').alt} ${i+1} 크게 보기`);p.setAttribute('aria-haspopup','dialog')})).observe(canvas,{childList:true});
 function open(p){img.src=p.querySelector('img').src;img.alt=p.querySelector('img').alt;title.textContent=img.alt;dialog.showModal()}
 canvas.addEventListener('click',e=>{const p=e.target.closest('.ch5-picture');if(p)open(p)});
 canvas.addEventListener('keydown',e=>{const p=e.target.closest('.ch5-picture');if(p&&['Enter',' '].includes(e.key)){e.preventDefault();e.stopPropagation();open(p)}});
 dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});
})();
