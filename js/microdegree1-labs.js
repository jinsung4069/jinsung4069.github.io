/* Activity slides for the 마이크로디그리 과정1 decks: shared game types and the registry the viewer calls. */
(()=>{
 'use strict';
 const panel=document.getElementById('ce-lab');if(!panel)return;
 const labs=new Map(),saved=new Map(),types={};
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 // Choices made on one slide are shown again on a later slide of the same visit.
 const memory={get(key){try{return JSON.parse(sessionStorage.getItem('md1:'+key))}catch{return null}},set(key,value){try{sessionStorage.setItem('md1:'+key,JSON.stringify(value))}catch{}}};
 // The same order on every visit, so a printed sheet matches the screen.
 function shuffled(list,seed=7){
  const a=[...list];let s=seed;
  for(let i=a.length-1;i>0;i--){s=(s*1103515245+12345)&0x7fffffff;const j=s%(i+1);[a[i],a[j]]=[a[j],a[i]]}
  if(a.length>1&&a.every((v,i)=>v===list[i]))a.push(a.shift());
  return a;
 }
 function frame(def,body){
  panel.innerHTML=`<div class="md-head"><h2>${esc(def.title)}</h2><span class="md-badge">체험</span></div>${def.hint?`<p class="md-hint">${def.hint}</p>`:''}<div class="md-body">${body}</div><div class="md-foot"><p class="md-msg" role="status" aria-live="polite"></p><div class="md-actions"></div></div>`;
  const q=s=>panel.querySelector(s),msg=q('.md-msg'),actions=q('.md-actions');
  return {q,all:s=>[...panel.querySelectorAll(s)],body:q('.md-body'),
   say(text,tone=''){msg.textContent=text;msg.dataset.tone=tone},
   action(label,run,primary){const b=document.createElement('button');b.type='button';b.textContent=label;b.className='md-btn'+(primary?' primary':'');b.onclick=run;actions.append(b);return b}};
 }
 const state=(id,initial)=>{if(!saved.has(id))saved.set(id,initial());return saved.get(id)};

 // Cards are moved into bins by selecting a card and then a bin, or by dragging.
 types.sort=(def,id)=>{
  const st=state(id,()=>({place:{},checked:false,pick:null}));
  const ui=frame(def,`<div class="md-pool" data-bin="" aria-label="아직 놓지 않은 카드"></div><div class="md-bins" style="--n:${def.columns||def.bins.length}">${def.bins.map(b=>`<section class="md-bin" data-bin="${b.id}"><h3>${esc(b.label)}</h3>${b.sub?`<p>${esc(b.sub)}</p>`:''}<div class="md-drop"></div></section>`).join('')}</div>`);
  const right=c=>[].concat(c.answer).includes(st.place[c.id]),card=id=>def.cards.find(c=>c.id===id);
  const check=ui.action('확인',()=>{
   if(def.cards.some(c=>!st.place[c.id])){ui.say('카드를 모두 놓은 뒤 확인하세요.','bad');return}
   st.checked=true;st.pick=null;draw();
  },true);
  ui.action('다시 하기',()=>{saved.delete(id);types.sort(def,id)});
  function move(cardId,bin){if(st.checked||!cardId)return;if(bin)st.place[cardId]=bin;else delete st.place[cardId];st.pick=null;draw()}
  function draw(){
   ui.all('.md-pool,.md-drop').forEach(n=>n.replaceChildren());
   for(const c of def.cards){
    const b=document.createElement('button');b.type='button';b.className='md-card';b.dataset.id=c.id;b.draggable=!st.checked;
    b.innerHTML=`<b>${esc(c.label)}</b>${c.sub?`<small>${esc(c.sub)}</small>`:''}`;
    if(st.checked)b.dataset.result=right(c)?'right':'wrong';else b.setAttribute('aria-pressed',String(st.pick===c.id));
    (st.place[c.id]?ui.q(`.md-bin[data-bin="${st.place[c.id]}"] .md-drop`):ui.q('.md-pool')).append(b);
   }
   check.disabled=st.checked;
   if(st.checked){const n=def.cards.filter(right).length;ui.say(`${def.cards.length}장 중 ${n}장이 ${def.soft?'함께 확인할 판단과 같습니다':'맞았습니다'}. 카드를 누르면 이유가 나옵니다.`,n===def.cards.length?'good':'')}
   else ui.say(st.pick?`'${card(st.pick).label}' 카드를 놓을 칸을 누르세요.`:'카드를 누른 다음 칸을 누르거나, 카드를 끌어다 놓으세요.');
  }
  ui.body.addEventListener('click',e=>{
   const c=e.target.closest('.md-card'),bin=e.target.closest('[data-bin]');
   if(c&&st.checked){const item=card(c.dataset.id);ui.say(`${item.label}: ${item.why}`,right(item)?'good':'bad');return}
   if(c){st.pick=st.pick===c.dataset.id?null:c.dataset.id;draw();return}
   if(bin&&st.pick)move(st.pick,bin.dataset.bin);
  });
  ui.body.addEventListener('dragstart',e=>{const c=e.target.closest('.md-card');if(c)e.dataTransfer.setData('text/plain',c.dataset.id)});
  ui.body.addEventListener('dragover',e=>{if(e.target.closest('[data-bin]'))e.preventDefault()});
  ui.body.addEventListener('drop',e=>{const bin=e.target.closest('[data-bin]');if(bin){e.preventDefault();move(e.dataTransfer.getData('text/plain'),bin.dataset.bin)}});
  draw();
 };

 // Two cards are swapped by selecting one and then the other.
 types.order=(def,id)=>{
  const st=state(id,()=>({order:shuffled(def.items.map((_,i)=>i),def.seed),checked:false,pick:null}));
  const ui=frame(def,`<div class="md-axis"><span>${esc(def.from||'먼저')}</span><i></i><span>${esc(def.to||'나중')}</span></div><ol class="md-order" style="--n:${def.columns||Math.ceil(def.items.length/2)}"></ol>`);
  const list=ui.q('.md-order');
  const check=ui.action('확인',()=>{st.checked=true;st.pick=null;draw()},true);
  ui.action('다시 섞기',()=>{saved.delete(id);types.order(def,id)});
  function draw(){
   list.innerHTML=st.order.map((item,pos)=>{const it=def.items[item];
    return `<li><button type="button" class="md-step" data-pos="${pos}" ${st.checked?`data-result="${item===pos?'right':'wrong'}"`:`aria-pressed="${st.pick===pos}"`}><span>${st.checked?esc(it.key):pos+1}</span><b>${esc(it.label)}</b>${it.sub?`<small>${esc(it.sub)}</small>`:''}</button></li>`}).join('');
   check.disabled=st.checked;
   if(st.checked){const n=st.order.filter((item,pos)=>item===pos).length;ui.say(n===def.items.length?'모두 제자리에 놓았습니다.':`${def.items.length}장 중 ${n}장이 제자리입니다. 카드를 바꾸면 다시 확인할 수 있습니다.`,n===def.items.length?'good':'')}
   else ui.say(st.pick===null?'자리를 바꿀 카드 두 장을 차례로 누르세요.':'바꿀 자리의 카드를 누르세요.');
  }
  list.addEventListener('click',e=>{
   const b=e.target.closest('.md-step');if(!b)return;const pos=Number(b.dataset.pos);
   if(st.pick===null){st.pick=pos;st.checked=false}
   else{[st.order[st.pick],st.order[pos]]=[st.order[pos],st.order[st.pick]];st.pick=null}
   draw();
  });
  draw();
 };

 // One question at a time with an explanation after each answer.
 types.quiz=(def,id)=>{
  const st=state(id,()=>({i:0,answers:[]}));
  const ui=frame(def,'<div class="md-quiz"></div>'),box=ui.q('.md-quiz');
  const next=ui.action('다음',()=>{st.i++;draw()},true);
  ui.action('처음부터',()=>{saved.delete(id);types.quiz(def,id)});
  function draw(){
   const total=def.questions.length;
   if(st.i>=total){
    const n=st.answers.filter((a,i)=>a===def.questions[i].answer).length;
    box.innerHTML=`<p class="md-score"><b>${n}</b> / ${total}</p><ul class="md-review">${def.questions.map((q,i)=>`<li data-result="${st.answers[i]===q.answer?'right':'wrong'}">${esc(q.short||q.q)}</li>`).join('')}</ul>`;
    next.hidden=true;ui.say(def.closing||'틀린 문항은 앞 슬라이드에서 다시 확인해 보세요.',n===total?'good':'');return;
   }
   const q=def.questions[st.i],done=st.answers[st.i]!==undefined;
   box.innerHTML=`<p class="md-count">${st.i+1} / ${total}</p><div class="md-q">${q.html||esc(q.q)}</div><div class="md-choices" style="--n:${q.columns||q.choices.length}">${q.choices.map((c,j)=>`<button type="button" class="md-choice" data-j="${j}" ${done?`disabled ${j===q.answer?'data-result="right"':j===st.answers[st.i]?'data-result="wrong"':''}`:''}>${esc(c)}</button>`).join('')}</div>${done?`<p class="md-why">${esc(q.why)}</p>`:''}`;
   next.hidden=!done;next.textContent=st.i===total-1?'결과 보기':'다음';
   ui.say(done?(st.answers[st.i]===q.answer?'맞았습니다.':'다시 생각해 볼 문항입니다.'):'답을 하나 고르세요.',done?(st.answers[st.i]===q.answer?'good':'bad'):'');
  }
  box.addEventListener('click',e=>{const b=e.target.closest('.md-choice');if(b&&st.answers[st.i]===undefined){st.answers[st.i]=Number(b.dataset.j);draw()}});
  draw();
 };

 // A left item and a right item are joined by selecting one of each.
 types.match=(def,id)=>{
  const st=state(id,()=>({done:[],left:null,tries:0,right:shuffled(def.pairs.map((_,i)=>i),def.seed)}));
  const ui=frame(def,`<div class="md-match"><div class="md-col" data-side="left"></div><div class="md-col" data-side="right"></div></div>`);
  ui.action('다시 하기',()=>{saved.delete(id);types.match(def,id)});
  function draw(wrong){
   ui.q('[data-side=left]').innerHTML=(def.leftTitle?`<h3>${esc(def.leftTitle)}</h3>`:'')+def.pairs.map((p,i)=>`<button type="button" class="md-pair" data-i="${i}" ${st.done.includes(i)?`disabled data-result="right"`:`aria-pressed="${st.left===i}"`}><span>${st.done.includes(i)?st.done.indexOf(i)+1:''}</span>${esc(p.left)}</button>`).join('');
   ui.q('[data-side=right]').innerHTML=(def.rightTitle?`<h3>${esc(def.rightTitle)}</h3>`:'')+st.right.map(i=>`<button type="button" class="md-pair" data-i="${i}" ${st.done.includes(i)?`disabled data-result="right"`:wrong===i?'data-result="wrong"':''}><span>${st.done.includes(i)?st.done.indexOf(i)+1:''}</span>${esc(def.pairs[i].right)}</button>`).join('');
   if(st.done.length===def.pairs.length)ui.say(`모두 연결했습니다. 잘못 고른 횟수는 ${st.tries}번입니다.`,'good');
   else if(wrong!==undefined)ui.say('짝이 맞지 않습니다. 다른 항목을 골라 보세요.','bad');
   else ui.say(st.left===null?'왼쪽 항목을 누른 다음 짝이 되는 오른쪽 항목을 누르세요.':'짝이 되는 오른쪽 항목을 누르세요.');
  }
  ui.body.addEventListener('click',e=>{
   const b=e.target.closest('.md-pair');if(!b||b.disabled)return;const i=Number(b.dataset.i);
   if(b.parentElement.dataset.side==='left'){st.left=st.left===i?null:i;draw();return}
   if(st.left===null){draw();return}
   if(st.left===i){st.done.push(i);st.left=null;draw()}else{st.tries++;draw(i)}
  });
  draw();
 };

 // One option and a short reason, kept for a later slide that asks the same question again.
 types.pick=(def,id)=>{
  const st=state(id,()=>memory.get(id)||{choice:null,reason:''}),before=def.review?memory.get(def.review):null;
  const label=choice=>def.options.find(o=>o.id===choice)?.label;
  const ui=frame(def,`${def.review?`<p class="md-before">${before?.choice?`처음 고른 것은 <b>${esc(label(before.choice))}</b>${before.reason?`, 이유는 "${esc(before.reason)}"`:''}입니다.`:'앞의 예측 활동에서 고른 기록이 없습니다. 지금 생각을 골라 보세요.'}</p>`:''}<div class="md-options" style="--n:${def.columns||3}">${def.options.map(o=>`<button type="button" class="md-option" data-id="${o.id}"><b>${esc(o.label)}</b>${o.sub?`<small>${esc(o.sub)}</small>`:''}</button>`).join('')}</div><label class="md-reason">${esc(def.reasonLabel||'이유를 한 문장으로 적어 봅니다.')}<input type="text" maxlength="80" autocomplete="off"></label>`);
  const input=ui.q('.md-reason input');input.value=st.reason;
  function draw(){
   ui.all('.md-option').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.id===st.choice)));memory.set(id,st);
   if(!st.choice)ui.say('하나를 골라 보세요.');
   else if(def.review&&before?.choice)ui.say(before.choice===st.choice?'처음과 같은 선택입니다. 이유도 그대로인지 확인해 보세요.':`처음 선택은 '${label(before.choice)}', 지금 선택은 '${label(st.choice)}'입니다. 무엇이 생각을 바꾸었나요?`,'good');
   else ui.say(def.after||`지금 선택은 '${label(st.choice)}'입니다.`,'good');
  }
  ui.body.addEventListener('click',e=>{const b=e.target.closest('.md-option');if(b){st.choice=b.dataset.id;draw()}});
  input.addEventListener('input',()=>{st.reason=input.value;memory.set(id,st)});
  draw();
 };

 // Each row is rated on the same scale and the lowest rows are named as the first things to address.
 types.checklist=(def,id)=>{
  const st=state(id,()=>({values:{}}));
  const ui=frame(def,`<table class="md-check"><thead><tr><th>${esc(def.head[0])}</th><th>${esc(def.head[1])}</th>${def.scale.map(s=>`<th>${esc(s)}</th>`).join('')}</tr></thead><tbody>${def.items.map((it,i)=>`<tr><th scope="row">${esc(it.label)}</th><td>${esc(it.question)}</td>${def.scale.map((s,j)=>`<td><input type="radio" name="md-check-${i}" value="${j}" aria-label="${esc(it.label)}, ${esc(s)}"></td>`).join('')}</tr>`).join('')}</tbody></table>`);
  ui.action('다시 하기',()=>{saved.delete(id);types.checklist(def,id)});
  function draw(){
   ui.all('input[type=radio]').forEach(r=>{r.checked=st.values[r.name.slice(9)]===Number(r.value)});
   const answered=Object.keys(st.values).length;
   if(answered<def.items.length){ui.say(`${def.items.length}개 중 ${answered}개에 답했습니다.`);return}
   const worst=Math.max(...Object.values(st.values)),names=def.items.filter((_,i)=>st.values[i]===worst).map(it=>it.label);
   ui.say(worst===0?def.allGood:`${def.lowest} ${names.join(', ')}`,worst===0?'good':'');
  }
  ui.body.addEventListener('change',e=>{if(e.target.matches('input[type=radio]')){st.values[e.target.name.slice(9)]=Number(e.target.value);draw()}});
  draw();
 };

 // Session files draw their own body inside the shared frame.
 types.custom=(def,id)=>def.render(frame(def,def.body||''),state(id,def.state||(()=>({}))),()=>{saved.delete(id);types.custom(def,id)});

 window.ceLabs={
  esc,shuffled,memory,
  // Styles that only one session's simulations need. Selectors start with .md-lab.
  style(css){const node=document.createElement('style');node.textContent=css;document.head.append(node)},
  add(id,type,def){labs.set(id,{type,def})},
  show(id,slide){
   const lab=id&&labs.get(id);
   if(!lab){panel.replaceChildren();if(id)panel.innerHTML=`<div class="md-head"><h2>${esc(slide.title)}</h2></div><div class="md-body"><p>이 체험을 불러오지 못했습니다. 새로고침해 주세요.</p></div>`;return}
   types[lab.type]({title:slide.title,...lab.def},id);
  }
 };
})();
