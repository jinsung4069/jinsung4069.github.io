/* Search within each course list without changing its source order or links. */
(()=>{
 const main=document.querySelector('main.courses,main.ce-course');if(!main)return;
 const cards=[...main.querySelectorAll('a.course-entry,a.ce-card')];if(!cards.length)return;
 const form=document.createElement('form');form.className='lecture-catalog-search';form.setAttribute('role','search');form.setAttribute('aria-label','강의 목록 검색');
 const label=document.createElement('label');label.textContent='강의 찾기';const input=document.createElement('input');input.type='search';input.placeholder='강의 제목이나 내용으로 검색';label.append(input);
 const count=document.createElement('p');count.setAttribute('role','status');form.append(label,count);
 const grid=main.querySelector('.ce-grid');(grid||cards[0].previousElementSibling||cards[0]).before(form);
 const headings=cards.map(card=>card.previousElementSibling?.matches('h2')?card.previousElementSibling:null);
 function update(){const query=input.value.trim().toLocaleLowerCase();cards.forEach((card,i)=>{card.hidden=!`${headings[i]?.textContent||''} ${card.textContent}`.toLocaleLowerCase().includes(query);if(headings[i])headings[i].hidden=card.hidden});const n=cards.filter(card=>!card.hidden).length;count.textContent=n?`${n}개 ${main.classList.contains('courses')?'과목':'강의'}`:'검색 결과가 없습니다. 다른 검색어를 입력하세요.'}
 input.addEventListener('input',update);form.addEventListener('submit',e=>e.preventDefault());update();
})();
