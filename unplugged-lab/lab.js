/* Shared helpers: theme toggle and embed mode for the solo unplugged AI games. */
(()=>{
 'use strict';
 const root=document.documentElement;
 if(new URLSearchParams(location.search).get('embed')==='1')root.classList.add('embed');
 const read=k=>{try{return localStorage.getItem(k)}catch{return null}};
 const write=(k,v)=>{try{localStorage.setItem(k,v)}catch{}};
 const saved=read('theme');
 if(saved==='light'||saved==='dark')root.dataset.theme=saved;
 const current=()=>root.dataset.theme||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');
 document.addEventListener('DOMContentLoaded',()=>{
  const b=document.querySelector('.lab-theme');if(!b)return;
  const label=()=>{b.textContent=current()==='dark'?'밝은 화면':'어두운 화면'};label();
  b.onclick=()=>{root.dataset.theme=current()==='dark'?'light':'dark';write('theme',root.dataset.theme);label()};
 });
 window.labUtil={
  esc:s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])),
  load(key,fallback){try{return JSON.parse(sessionStorage.getItem(key))??fallback}catch{return fallback}},
  save(key,value){try{sessionStorage.setItem(key,JSON.stringify(value))}catch{}}
 };
})();
