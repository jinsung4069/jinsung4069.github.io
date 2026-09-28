(()=>{
 'use strict';
 const panel=document.getElementById('ce-lab');
 if(!panel||document.querySelector('.ce-viewer')?.dataset.chapter!=='4')return;
 const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
 const safe=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
 const $=s=>panel.querySelector(s);
 let generation=0,timer=null;
 function stop(){generation++;if(timer){clearInterval(timer);timer=null}}
 function animate(node,frames){if(!node||reduced()||!node.animate)return Promise.resolve();return node.animate(frames,{duration:430,easing:'cubic-bezier(.2,.8,.2,1)'}).finished.catch(()=>{})}
 function nextValue(value,index){return /^[A-Z]$/.test(value)?String.fromCharCode(value.charCodeAt(0)===90?65:value.charCodeAt(0)+1):String.fromCharCode(65+(index%26))}

 function stackQueue(){
  panel.innerHTML=`<div class="c4-eyebrow">직접 체험 · 12</div><h2>스택과 큐 비교하기</h2><p>같은 값을 양쪽에 넣고 꺼내 보세요. 스택은 마지막 값, 큐는 첫 번째 값이 먼저 나옵니다.</p>
   <div class="c4-controls"><label>넣을 값 <input id="c4-value" maxlength="8" value="A" autocomplete="off"></label><button id="c4-add" type="button">두 구조에 넣기</button><button id="c4-remove" type="button">두 구조에서 꺼내기</button><button id="c4-reset" type="button">처음부터</button></div>
   <div class="c4-pair"><section class="c4-card"><h3>스택 <small>후입선출</small></h3><p>위쪽 TOP에서 넣고 꺼냅니다.</p><div class="c4-stack" id="c4-stack" aria-label="스택, 아래에서 위 순서"></div></section>
   <section class="c4-card"><h3>큐 <small>선입선출</small></h3><p>오른쪽에서 넣고 왼쪽 FRONT에서 꺼냅니다.</p><div class="c4-queue" id="c4-queue" aria-label="큐, 앞에서 뒤 순서"></div><div class="c4-directions"><span>← FRONT, 꺼내는 곳</span><span>REAR, 넣는 곳 →</span></div></section></div>
   <div class="c4-feedback" id="c4-feedback" role="status" aria-live="polite">A를 넣어 보세요.</div>`;
  let stack=[],queue=[],busy=false;
  const buttons=()=>[$('#c4-add'),$('#c4-remove'),$('#c4-reset')];
  function draw(){
   $('#c4-stack').innerHTML=stack.length?stack.map((v,i)=>`<span class="c4-chip" data-index="${i}">${safe(v)}</span>`).join(''):'<span class="c4-empty">비어 있음</span>';
   $('#c4-queue').innerHTML=queue.length?queue.map((v,i)=>`<span class="c4-chip" data-index="${i}">${safe(v)}</span>`).join(''):'<span class="c4-empty">비어 있음</span>';
  }
  function lock(on){busy=on;buttons().forEach(b=>b.disabled=on)}
  $('#c4-add').onclick=async()=>{
   if(busy)return;
   const value=$('#c4-value').value.trim();if(!value){$('#c4-feedback').textContent='넣을 값을 입력하세요.';$('#c4-value').focus();return}
   if(stack.length>=6){$('#c4-feedback').textContent='최대 6개까지 넣을 수 있습니다. 먼저 값을 꺼내 보세요.';return}
   lock(true);const ticket=generation;stack.push(value);queue.push(value);draw();
   $('#c4-value').value=nextValue(value,stack.length);
   await Promise.all([animate($('#c4-stack .c4-chip:last-child'),[{opacity:0,transform:'translateY(-55px) scale(.7)'},{opacity:1,transform:'translateY(0) scale(1)'}]),animate($('#c4-queue .c4-chip:last-child'),[{opacity:0,transform:'translateX(75px) scale(.7)'},{opacity:1,transform:'translateX(0) scale(1)'}])]);
   if(ticket!==generation)return;$('#c4-feedback').textContent=`${value} 넣기 완료. 스택 TOP과 큐 REAR에 들어갔습니다.`;lock(false);
  };
  $('#c4-remove').onclick=async()=>{
   if(busy)return;if(!stack.length){$('#c4-feedback').textContent='두 구조가 비어 있습니다.';return}
   lock(true);const ticket=generation,top=stack.at(-1),front=queue[0];
   await Promise.all([animate($('#c4-stack .c4-chip:last-child'),[{opacity:1,transform:'translateY(0)'},{opacity:0,transform:'translateY(-65px)'}]),animate($('#c4-queue .c4-chip:first-child'),[{opacity:1,transform:'translateX(0)'},{opacity:0,transform:'translateX(-75px)'}])]);
   if(ticket!==generation)return;stack.pop();queue.shift();draw();$('#c4-feedback').textContent=`스택에서 ${top}, 큐에서 ${front}을 꺼냈습니다.`;lock(false);
  };
  $('#c4-reset').onclick=()=>{if(busy)return;stack=[];queue=[];$('#c4-value').value='A';draw();$('#c4-feedback').textContent='처음 상태로 돌아왔습니다.'};
  $('#c4-value').onkeydown=e=>{if(e.key==='Enter')$('#c4-add').click()};draw();
 }

 const postfix=[
  {token:'8',stack:['8'],description:'8을 스택에 넣습니다.'},
  {token:'4',stack:['8','4'],description:'4를 스택에 넣습니다.'},
  {token:'2',stack:['8','4','2'],description:'2를 스택에 넣습니다.'},
  {token:'−',stack:['8','2'],description:'4와 2를 꺼내 4 − 2 = 2를 넣습니다.'},
  {token:'2',stack:['8','2','2'],description:'다음 2를 스택에 넣습니다.'},
  {token:'×',stack:['8','4'],description:'2와 2를 꺼내 2 × 2 = 4를 넣습니다.'},
  {token:'÷',stack:['2'],description:'8과 4를 꺼내 8 ÷ 4 = 2를 넣습니다.'}
 ];
 function postfixSlide(){
  panel.innerHTML=`<div class="c4-eyebrow">과정 살펴보기 · 15</div><h2>스택에 값이 저장되는 과정</h2><p>후위 표기식 <strong>842-2*/</strong>를 왼쪽부터 한 기호씩 읽습니다. 연산자를 만나면 두 값을 꺼내 계산한 결과를 다시 넣습니다.</p>
   <div class="c4-controls"><button id="c4-step" type="button">다음 단계</button><button id="c4-play" type="button">자동 재생</button><button id="c4-restart" type="button">처음으로</button><span id="c4-count">0 / 7단계</span></div>
   <div class="c4-postfix" id="c4-postfix" aria-label="왼쪽부터 순서대로 나타나는 스택 상태"></div><div class="c4-feedback" id="c4-feedback" role="status" aria-live="polite">다음 단계를 눌러 시작하세요.</div>`;
  let step=window.LecturePrint?.mode?postfix.length:0;
  function draw(){
   $('#c4-postfix').innerHTML=postfix.map((item,i)=>`<div class="c4-post-step ${i<step?'is-visible':''} ${i===step-1?'is-current':''}"><div class="c4-token">${i+1}. ${item.token}</div><div class="c4-mini-stack">${i<step?item.stack.map(v=>`<span>${v}</span>`).reverse().join(''):'<span class="c4-placeholder">?</span>'}</div></div>`).join('');
   $('#c4-count').textContent=`${step} / 7단계`;$('#c4-step').disabled=step===postfix.length;
   $('#c4-feedback').textContent=step?`${step}단계: ${postfix[step-1].description}${step===postfix.length?' 계산 완료.':''}`:'다음 단계를 눌러 시작하세요.';
  }
  function next(){if(step<postfix.length){step++;draw();$('#c4-postfix .is-current')?.scrollIntoView({block:'nearest',inline:'nearest',behavior:reduced()?'instant':'smooth'})}if(step===postfix.length&&timer){clearInterval(timer);timer=null;$('#c4-play').textContent='자동 재생'}}
  $('#c4-step').onclick=next;
  $('#c4-play').onclick=()=>{if(timer){clearInterval(timer);timer=null;$('#c4-play').textContent='자동 재생';return}if(step===postfix.length)step=0;draw();next();if(step<postfix.length){timer=setInterval(next,1000);$('#c4-play').textContent='일시정지'}};
  $('#c4-restart').onclick=()=>{if(timer){clearInterval(timer);timer=null}step=0;$('#c4-play').textContent='자동 재생';draw()};draw();
 }

 const games={
  array:{label:'배열',initial:['A','B','C'],goal:['A','X','B','C'],mission:'고정된 칸에서 B와 C를 오른쪽으로 밀고, 인덱스 1에 X를 넣으세요.',hint:'배열의 인덱스는 0부터 시작합니다.',defaultValue:'X',defaultIndex:1},
  list:{label:'리스트',initial:['A','B','C'],goal:['A','C'],mission:'가운데 노드 B를 지우고 A가 C를 가리키게 하세요.',hint:'리스트에서는 앞뒤 노드의 연결을 바꿉니다.',defaultValue:'X',defaultIndex:1},
  stack:{label:'스택',initial:['A','B','C'],goal:['A','B','D'],mission:'TOP의 C를 꺼낸 뒤 D를 넣으세요.',hint:'스택은 맨 위에서만 꺼낼 수 있습니다.',defaultValue:'D'},
  queue:{label:'큐',initial:['A','B'],goal:['B','C'],mission:'FRONT의 A를 꺼낸 뒤 REAR에 C를 넣으세요.',hint:'큐는 먼저 들어온 값이 먼저 나갑니다.',defaultValue:'C'}
 };
 function structuresGame(){
  panel.innerHTML=`<div class="c4-eyebrow">자료구조 게임 · 25</div><h2>배열, 리스트, 스택, 큐 체험하기</h2><p>각 자료구조의 규칙에 맞게 목표 상태를 만드세요. 네 문제를 모두 해결하면 완료입니다.</p>
   <div class="c4-tabs" role="tablist" aria-label="자료구조 선택">${Object.entries(games).map(([key,g],i)=>`<button type="button" role="tab" data-kind="${key}" aria-selected="${i===0}" tabindex="${i===0?'0':'-1'}">${g.label}<span class="c4-done" aria-label="완료" hidden> ✓</span></button>`).join('')}</div>
   <div class="c4-score" id="c4-score">완료 0 / 4</div><section class="c4-game"><h3 id="c4-game-title"></h3><p id="c4-mission"></p><div class="c4-goal" id="c4-goal"></div>
   <div class="c4-game-board" id="c4-game-board" aria-label="현재 자료구조"></div><div class="c4-controls"><label>값 <input id="c4-game-value" maxlength="8" autocomplete="off"></label>
   <label id="c4-index-wrap">인덱스 <input id="c4-game-index" type="number" min="0" max="5"></label><button id="c4-game-add" type="button">넣기</button><button id="c4-game-remove" type="button">꺼내기</button><button id="c4-game-reset" type="button">이 문제 다시 하기</button></div>
   <div class="c4-feedback" id="c4-feedback" role="status" aria-live="polite"></div></section>`;
  const state=Object.fromEntries(Object.entries(games).map(([key,g])=>[key,[...g.initial]])),completed=new Set();let kind='array';
  function board(values){
   if(kind==='array')return `<div class="c4-array">${Array.from({length:6},(_,i)=>`<div class="c4-array-cell"><span>${values[i]?safe(values[i]):'·'}</span><small>${i}</small></div>`).join('')}</div>`;
   if(kind==='list')return `<div class="c4-list">${values.map((v,i)=>`<span class="c4-list-node">${safe(v)}</span>${i<values.length-1?'<span aria-hidden="true">→</span>':''}`).join('')||'<span class="c4-empty">빈 리스트</span>'}<span aria-hidden="true">→ ∅</span></div>`;
   return `<div class="c4-game-row">${values.map(v=>`<span class="c4-chip">${safe(v)}</span>`).join('')||'<span class="c4-empty">비어 있음</span>'}</div><div class="c4-directions"><span>${kind==='stack'?'바닥':'FRONT, 꺼내는 곳'}</span><span>${kind==='stack'?'TOP, 넣고 꺼내는 곳':'REAR, 넣는 곳'}</span></div>`;
  }
  function render(message){
   const g=games[kind],values=state[kind];$('#c4-game-title').textContent=g.label;$('#c4-mission').textContent=g.mission;
   $('#c4-goal').textContent=`목표: ${g.goal.join(' → ')}`;$('#c4-game-board').innerHTML=board(values);
   $('#c4-index-wrap').hidden=kind==='stack'||kind==='queue';$('#c4-game-add').textContent=kind==='stack'?'Push':kind==='queue'?'Enqueue':'삽입';$('#c4-game-remove').textContent=kind==='stack'?'Pop':kind==='queue'?'Dequeue':'삭제';
   $('#c4-score').textContent=`완료 ${completed.size} / 4`;
   panel.querySelectorAll('.c4-tabs [role=tab]').forEach(tab=>{const selected=tab.dataset.kind===kind;tab.setAttribute('aria-selected',String(selected));tab.tabIndex=selected?0:-1;tab.querySelector('.c4-done').hidden=!completed.has(tab.dataset.kind)});
   $('#c4-feedback').textContent=message||g.hint;
  }
  function check(message){const g=games[kind],values=state[kind];if(values.join('|')===g.goal.join('|')){completed.add(kind);message=`정답! ${g.label}의 목표 상태를 만들었습니다. ${completed.size} / 4 완료.${completed.size===4?' 네 자료구조를 모두 해결했습니다!':''}`}render(message)}
  function select(key){kind=key;const g=games[kind];$('#c4-game-value').value=g.defaultValue;$('#c4-game-index').value=g.defaultIndex??0;render()}
  $('.c4-tabs').onclick=e=>{const tab=e.target.closest('[data-kind]');if(tab)select(tab.dataset.kind)};
  $('.c4-tabs').onkeydown=e=>{if(!['ArrowLeft','ArrowRight'].includes(e.key))return;e.preventDefault();const keys=Object.keys(games),i=keys.indexOf(kind);select(keys[(i+(e.key==='ArrowRight'?1:-1)+keys.length)%keys.length]);panel.querySelector('.c4-tabs [aria-selected=true]').focus()};
  $('#c4-game-add').onclick=()=>{const values=state[kind],value=$('#c4-game-value').value.trim(),index=Number($('#c4-game-index').value);if(!value){render('넣을 값을 입력하세요.');return}if(values.length>=6){render('최대 6개까지 넣을 수 있습니다.');return}if(kind==='array'||kind==='list'){if(!Number.isInteger(index)||index<0||index>values.length){render(`삽입 위치는 0부터 ${values.length}까지입니다.`);return}values.splice(index,0,value);check(`${index}번 위치에 ${value} 삽입. ${kind==='array'?'뒤의 값이 한 칸씩 이동했습니다.':'앞뒤 노드를 다시 연결했습니다.'}`)}else{values.push(value);check(`${kind==='stack'?'TOP':'REAR'}에 ${value}를 넣었습니다.`)}};
  $('#c4-game-remove').onclick=()=>{const values=state[kind],index=Number($('#c4-game-index').value);if(!values.length){render('더 꺼낼 값이 없습니다.');return}if(kind==='array'||kind==='list'){if(!Number.isInteger(index)||index<0||index>=values.length){render(`삭제 위치는 0부터 ${values.length-1}까지입니다.`);return}const removed=values.splice(index,1)[0];check(`${index}번 위치의 ${removed} 삭제. ${kind==='array'?'뒤의 값이 한 칸씩 당겨졌습니다.':'앞뒤 노드를 다시 연결했습니다.'}`)}else{const removed=kind==='stack'?values.pop():values.shift();check(`${kind==='stack'?'TOP':'FRONT'}에서 ${removed}를 꺼냈습니다.`)}};
  $('#c4-game-reset').onclick=()=>{state[kind]=[...games[kind].initial];render('처음 상태로 돌아왔습니다. 다시 도전하세요.')};
  $('#c4-game-value').onkeydown=e=>{if(e.key==='Enter')$('#c4-game-add').click()};select('array');
 }

 function prediction(){
  panel.innerHTML=`<div class="c4-eyebrow">생각해 보기 · 36</div><h2>언제 사용할까?</h2><div class="c4-prediction">
   <p><strong>1.</strong> 대기 중 이산화탄소(CO₂) 농도는 계속해서 (증가, 유지, 감소) 할 것이다.</p>
   <p><strong>2.</strong> 이산화탄소 농도가 증가하면 연평균 기온이 (내려간다, 올라간다).</p>
   <p><strong>3.</strong> 그래프를 분석하여 2020년 이후 이산화탄소 농도와 연평균 기온을 예측해 봅시다.</p>
   <label for="c4-prediction">나의 예측</label><textarea id="c4-prediction" rows="3" placeholder="그래프의 변화 방향을 근거와 함께 적어 보세요."></textarea>
   <div class="c4-feedback" role="status">예측을 마쳤다면 다음 장에서 답을 확인하세요.</div></div>`;
 }
 function candyAnswer(){
  panel.innerHTML=`<div class="c4-eyebrow">퀴즈 해설 · 40</div><h2>최종 상태의 사탕은?</h2><p>앞 장의 방향과 같은 기준으로 답을 읽어 보세요.</p>
   <div class="c4-answer-grid"><section class="c4-card"><h3>스택[0]</h3><div class="c4-answer">G</div><p>처음 바닥에 있던 G</p></section>
   <section class="c4-card"><h3>스택 통, 아래에서부터</h3><div class="c4-answer">G → A → K → Q → C → P</div><p>위에서부터 읽으면 P → C → Q → K → A → G</p></section>
   <section class="c4-card"><h3>큐 통, 오른쪽 입구, 왼쪽 출구</h3><div class="c4-answer">T → F → S → Q → C → P</div><p>왼쪽 FRONT에서 오른쪽 REAR 순서</p></section></div>
   <div class="c4-feedback">세 개를 꺼낸 뒤, Q, C, P를 차례로 넣은 결과입니다.</div>`;
 }
 window.ceChapter4={show(id){stop();panel.dataset.lab=id||'hidden';if(id==='stackQueue')stackQueue();else if(id==='postfix')postfixSlide();else if(id==='structures')structuresGame();else if(id==='prediction')prediction();else if(id==='candyAnswer')candyAnswer();else panel.replaceChildren()}};
})();
