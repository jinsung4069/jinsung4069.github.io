(()=>{
 'use strict';
 const panel=document.getElementById('ce-lab');
 if(!panel||document.querySelector('.ce-viewer')?.dataset.chapter!=='4')return;
 const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
 const safe=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
 const $=s=>panel.querySelector(s);
 let generation=0,timer=null;
 function stop(){generation++;if(timer){clearInterval(timer);timer=null}window.ceChapter4Survivor?.stop()}
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

 function structuresGame(){window.ceChapter4Survivor.mount(panel)}

 function prediction(){
  panel.innerHTML=`<div class="c4-eyebrow">생각해 보기 · 36</div><h2>언제 사용할까?</h2><div class="c4-prediction">
   <p><strong>1.</strong> 대기 중 이산화탄소(CO₂) 농도는 계속해서 (증가, 유지, 감소) 할 것이다.</p>
   <p><strong>2.</strong> 이산화탄소 농도가 증가하면 연평균 기온이 (내려간다, 올라간다).</p>
   <p><strong>3.</strong> 그래프를 분석하여 2020년 이후 이산화탄소 농도와 연평균 기온을 예측해 봅시다.</p>
   <label for="c4-prediction">나의 예측</label><textarea id="c4-prediction" rows="3" placeholder="그래프의 변화 방향을 근거와 함께 적어 보세요."></textarea>
   <div class="c4-feedback" role="status">예측을 마쳤다면 다음 장에서 답을 확인하세요.</div></div>`;
 }
 function candyAnswer(){
  panel.innerHTML=`<div class="c4-eyebrow">퀴즈 해설 · 40</div><h2>최종 상태의 사탕은?</h2><p>꺼내고 넣는 순서를 따라간 뒤, 정답을 하나씩 확인하세요.</p>
   <div class="c4-controls"><button id="c4-candy-next" type="button">다음 단계</button><button id="c4-candy-play" type="button">자동 재생</button><button id="c4-candy-reset" type="button">처음으로</button><span id="c4-candy-count">0 / 8단계</span></div>
   <div class="c4-candy-grid"><section class="c4-card"><h3>스택</h3><p>아래 바닥 → 위 TOP</p><div class="c4-candy-stack-wrap"><span class="c4-candy-end">↑ TOP, 꺼내는 곳</span><div class="c4-candy-track c4-candy-stack" id="c4-candy-stack" aria-label="스택, 아래에서 위 순서"></div><span class="c4-candy-end">바닥, 스택[0]</span></div></section>
   <section class="c4-card"><h3>큐</h3><p>왼쪽 FRONT → 오른쪽 REAR</p><div class="c4-candy-track c4-candy-queue" id="c4-candy-queue" aria-label="큐, 왼쪽에서 오른쪽 순서"></div></section></div>
   <div class="c4-candy-results" aria-label="차례로 공개되는 정답"><div class="c4-candy-result" id="c4-candy-index" hidden>스택[0] <strong>G</strong></div>
   <div class="c4-candy-result" id="c4-candy-bottom" hidden>스택, 아래에서부터 <strong>G → A → K → Q → C → P</strong></div>
   <div class="c4-candy-result" id="c4-candy-front" hidden>큐, 왼쪽 출구부터 <strong>T → F → S → Q → C → P</strong></div></div>
   <div class="c4-feedback" id="c4-candy-feedback" role="status" aria-live="polite">초기 사탕을 확인하고 다음 단계를 누르세요.</div>`;
  const initial=['G','A','K','T','F','S'],printing=window.LecturePrint?.mode;
  let stack=printing?['G','A','K','Q','C','P']:[...initial],queue=printing?['T','F','S','Q','C','P']:[...initial],step=printing?8:0,auto=false,busy=false;
  const captions=['스택에서 S, 큐에서 G를 꺼냈습니다.','스택에서 F, 큐에서 A를 꺼냈습니다.','스택에서 T, 큐에서 K를 꺼낸 뒤 Q를 넣었습니다.','C를 스택 TOP과 큐 REAR에 넣었습니다.','P를 스택 TOP과 큐 REAR에 넣었습니다.','스택[0]은 바닥의 G입니다.','스택을 아래에서부터 읽으면 G, A, K, Q, C, P입니다.','큐를 왼쪽 출구부터 읽으면 T, F, S, Q, C, P입니다.'];
  function draw(newToken=false){
   $('#c4-candy-stack').innerHTML=stack.map((v,i)=>`<span class="c4-candy-token ${newToken&&i===stack.length-1?'is-new':''}">${v}</span>`).join('');
   $('#c4-candy-queue').innerHTML=queue.map((v,i)=>`<span class="c4-candy-token ${newToken&&i===queue.length-1?'is-new':''}">${v}</span>`).join('');
   $('#c4-candy-index').hidden=step<6;$('#c4-candy-bottom').hidden=step<7;$('#c4-candy-front').hidden=step<8;
   $('#c4-candy-count').textContent=`${step} / 8단계`;$('#c4-candy-next').disabled=step===8||busy;
   $('#c4-candy-feedback').textContent=step?`${step}단계: ${captions[step-1]}`:'초기 사탕을 확인하고 다음 단계를 누르세요.';
  }
  async function advance(){
   if(busy||step===8)return;busy=true;$('#c4-candy-next').disabled=true;const ticket=generation;
   if(step<3){
    await Promise.all([animate($('#c4-candy-stack .c4-candy-token:last-child'),[{opacity:1,transform:'translateY(0)'},{opacity:0,transform:'translateY(-35px)'}]),animate($('#c4-candy-queue .c4-candy-token:first-child'),[{opacity:1,transform:'translateX(0)'},{opacity:0,transform:'translateX(-35px)'}])]);
    if(ticket!==generation)return;stack.pop();queue.shift();
   }
   if(step>=2&&step<5){const value=['Q','C','P'][step-2];stack.push(value);queue.push(value);draw(true);await Promise.all([animate($('#c4-candy-stack .c4-candy-token:last-child'),[{opacity:0,transform:'translateY(-35px)'},{opacity:1,transform:'translateY(0)'}]),animate($('#c4-candy-queue .c4-candy-token:last-child'),[{opacity:0,transform:'translateX(35px)'},{opacity:1,transform:'translateX(0)'}])]);if(ticket!==generation)return}
   step++;busy=false;draw();if(step===8){auto=false;$('#c4-candy-play').textContent='자동 재생'}
  }
  function schedule(){if(auto&&step<8){const ticket=generation;timer=setTimeout(async()=>{timer=null;await advance();if(ticket===generation)schedule()},700)}}
  function reset(){generation++;if(timer){clearTimeout(timer);timer=null}auto=false;busy=false;stack=[...initial];queue=[...initial];step=0;$('#c4-candy-play').textContent='자동 재생';draw()}
  $('#c4-candy-next').onclick=advance;
  $('#c4-candy-play').onclick=()=>{if(auto){auto=false;if(timer){clearTimeout(timer);timer=null}$('#c4-candy-play').textContent='자동 재생';return}if(busy)return;if(step===8)reset();auto=true;$('#c4-candy-play').textContent='일시정지';advance().then(schedule)};
  $('#c4-candy-reset').onclick=reset;draw();
 }
 window.ceChapter4={show(id){stop();panel.dataset.lab=id||'hidden';if(id==='stackQueue')stackQueue();else if(id==='postfix')postfixSlide();else if(id==='structures')structuresGame();else if(id==='prediction')prediction();else if(id==='candyAnswer')candyAnswer();else panel.replaceChildren()}};
})();
