/* Recent lectures and bookmarks stay on this device, with the same backup tools as labs. */
(()=>{
 'use strict';
 const validEntry=e=>e&&typeof e.title==='string'&&e.title.length<500&&typeof e.url==='string'&&/^\/lectures\/[a-z0-9/-]+\/#slide-\d+$/.test(e.url)&&Number.isFinite(e.time);
 const store=localProgress.create('lectureLibraryV1',()=>({recent:[],bookmarks:[]}),v=>v&&['recent','bookmarks'].every(k=>Array.isArray(v[k])&&v[k].length<=100&&v[k].every(validEntry)));
 const currentURL=()=>location.pathname+(/^#slide-\d+$/.test(location.hash)?location.hash:'#slide-1');
 const entry=title=>({title,url:currentURL(),time:Date.now()});
 function remember(title){const value=store.value,item=entry(title);value.recent=[item,...value.recent.filter(e=>e.url.split('#')[0]!==location.pathname)].slice(0,12);store.save(value)}
 function bookmarked(){return store.value.bookmarks.some(e=>e.url===currentURL())}
 function toggle(title){const value=store.value;if(bookmarked())value.bookmarks=value.bookmarks.filter(e=>e.url!==currentURL());else value.bookmarks=[entry(title),...value.bookmarks].slice(0,100);store.save(value);return bookmarked()}
 function renderLibrary(){
  const host=document.getElementById('learning-library');if(!host)return;host.replaceChildren();
  for(const [key,title] of [['recent','최근 읽은 강의'],['bookmarks','저장한 쪽']]){
   const section=document.createElement('section'),heading=document.createElement('h2');heading.textContent=title;section.append(heading);
   const list=document.createElement('ul');for(const item of store.value[key]){const li=document.createElement('li'),a=document.createElement('a');a.href=item.url;a.textContent=item.title;li.append(a);list.append(li)}
   if(list.children.length)section.append(list);else{const p=document.createElement('p');p.textContent=key==='recent'?'강의를 열면 마지막으로 읽은 쪽이 여기에 표시됩니다.':'강의에서 북마크를 누르면 이곳에서 다시 열 수 있습니다.';section.append(p)}host.append(section);
  }
 }
 window.siteLearning={remember,bookmarked,toggle};
 document.addEventListener('DOMContentLoaded',renderLibrary);
 window.addEventListener('local-progress-import',event=>{if(event.detail.key==='lectureLibraryV1')renderLibrary()});
})();
