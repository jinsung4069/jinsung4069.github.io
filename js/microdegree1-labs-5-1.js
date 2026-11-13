/* 5주차 오전, 지식 기반 인공지능 도구 활용 Part 1, 규칙 기반 전문가 시스템: activity slides. The animal rules are those of the slides; school situations are examples written for these activities. */
(()=>{
 'use strict';
 const L=window.ceLabs;if(!L)return;const esc=L.esc;
 L.style(`.md-lab .s51-river{display:grid;grid-template-columns:1fr 1.15fr 1fr;gap:.5em;min-height:8.5em}
.md-lab .s51-bank{display:flex;flex-direction:column;gap:.35em;padding:.5em .6em;border:1px solid #9fd4b8;border-radius:.5em;background:#e3f5ec}
.md-lab .s51-bank h3{font-size:.8em!important;color:#16794c!important}
.md-lab .s51-water{display:flex;align-items:center;justify-content:flex-start;padding:.5em;border:1px solid #a9c4ef;border-radius:.5em;background:#dbe8fb}
.md-lab .s51-water[data-side="1"]{justify-content:flex-end}
.md-lab .s51-boat{display:flex;flex-direction:column;gap:.25em;min-width:6.2em;padding:.4em .6em .7em;border-radius:.4em .4em 1.6em 1.6em;background:#8a5a00;color:#fff;font-size:.9em;font-weight:800;text-align:center}
.md-lab .s51-boat span{padding:.1em .4em;border-radius:.3em;background:#fff7df;color:#8a5a00}
.md-lab .s51-who{padding:.3em .7em;border:1px solid #9fb0dc;border-radius:.5em;background:#fff;color:#1c2c4c;font-size:.95em;line-height:1.3;text-align:left;cursor:pointer}
.md-lab .s51-who:disabled{cursor:default;opacity:.85}.md-lab .s51-who[aria-pressed=true]{border-color:#f0a202;background:#fff7df;font-weight:800}
.md-lab .s51-who[data-danger=true]{border-color:#c2413b;background:#fdeceb;color:#b5372f}
.md-lab .s51-log{display:grid;gap:.3em;margin:0;padding:0 0 0 1.4em;font-size:.88em;line-height:1.35}
.md-lab .s51-log li[data-bad=true]{color:#b5372f;font-weight:800}
.md-lab p.s51-note{font-size:.78em;line-height:1.4;color:#52607f}
.ce-lab.md-lab .s51-big{font-size:2.1em;font-weight:800;line-height:1.2;color:#2c478f;text-align:center}.md-lab .s51-big sup{font-size:.55em}
.md-lab .s51-facts{display:flex;flex-wrap:wrap;gap:.35em}
.md-lab .s51-fact{padding:.22em .65em;border:1px solid #9fb0dc;border-radius:99em;background:#fff;color:#2c478f;font-size:.82em;cursor:pointer}
.md-lab .s51-fact[aria-pressed=true]{border-color:#3f5dae;background:#3f5dae;color:#fff}
.md-lab .s51-wm{display:flex;flex-wrap:wrap;gap:.3em;min-height:1.8em}
.md-lab .s51-wm span{padding:.15em .6em;border-radius:.4em;background:#ebf0fc;color:#2c478f;font-size:.85em}.md-lab .s51-wm span[data-new=true]{background:#f0a202;color:#fff;font-weight:800}
.md-lab .s51-rules{display:grid;gap:.25em;margin:0;padding:0;list-style:none;font-size:.8em;line-height:1.3}
.md-lab .s51-rules li{display:grid;grid-template-columns:3.4em 1fr auto;gap:.4em;padding:.2em .5em;border:1px solid #d5ddf1;border-radius:.35em;background:#fff}
.md-lab .s51-rules b{color:#3f5dae}.md-lab .s51-rules em{font-style:normal;color:#2c478f;font-weight:800}
.md-lab .s51-rules li[data-st=match]{border-color:#f0a202;background:#fff7df}.md-lab .s51-rules li[data-st=fired]{border-color:#1f8a5b;background:#e3f5ec}
.md-lab .s51-table{width:100%;border-collapse:collapse;font-size:.8em;line-height:1.3;background:#fff}
.md-lab .s51-table th{padding:.3em .4em;background:#3f5dae;color:#fff;font-weight:800}
.md-lab .s51-table td{padding:.28em .4em;border-bottom:1px solid #d5ddf1;text-align:center}
.md-lab .s51-trace{display:grid;gap:.22em;margin:0;padding:0;list-style:none;font-size:.82em;line-height:1.35;overflow:auto}
.md-lab .s51-trace li{padding:.18em .5em;border-left:.25em solid #9fb0dc;background:#fff;border-radius:.25em}
.md-lab .s51-trace li[data-kind=ask]{border-left-color:#f0a202}.md-lab .s51-trace li[data-kind=ok]{border-left-color:#1f8a5b;color:#16794c}
.md-lab .s51-trace li[data-kind=no]{border-left-color:#c2413b;color:#b5372f}
.md-lab .s51-ask{display:grid;gap:.45em;padding:.6em .8em;border:1px solid #f0d58a;border-radius:.5em;background:#fff7df}
.md-lab .s51-ask p{font-size:1.15em!important;font-weight:800;color:#8a5a00}
.md-lab .s51-why{padding:.5em .7em;border:1px solid #d5ddf1;border-radius:.5em;background:#fff;font-size:.85em;line-height:1.45}
.md-lab .s51-rq{display:grid;gap:.2em;margin:.3em 0 0;padding:.5em .7em;border:1px solid #d5ddf1;border-radius:.5em;background:#fff;font-size:.9em;line-height:1.4;list-style:none}
.md-lab .s51-rq b{color:#3f5dae}.md-lab .s51-rq em{display:block;margin-top:.2em;font-style:normal;color:#8a5a00}`);

 L.add('symbolicSort','sort',{hint:'여덟 가지 설명과 예가 <b>기호주의</b>와 <b>연결주의</b> 가운데 어디에 속하는지 놓아 봅니다.',
  bins:[{id:'sym',label:'기호주의',sub:'기호와 규칙으로 지식 표현'},{id:'con',label:'연결주의',sub:'신경망의 연결 강도로 표현'}],cards:[
  {id:'a',label:'만약 체온이 37.5도 이상이면 보건실 안내',sub:'학교 업무 규칙',answer:'sym',why:'사람이 직접 쓴 규칙으로 판단하는 기호주의 방식입니다.'},
  {id:'b',label:'사진 수천 장을 보고 고양이를 구별하도록 학습',answer:'con',why:'데이터에서 판단 기준을 학습하는 연결주의 방식입니다.'},
  {id:'c',label:'결론까지 쓴 규칙을 차례로 보여 줄 수 있음',answer:'sym',why:'기호와 규칙으로 추론하므로 추론 과정을 추적하기 쉽습니다.'},
  {id:'d',label:'왜 그렇게 판단했는지 설명하기 어려움',answer:'con',why:'지식이 연결 강도의 수치로 퍼져 있어 판단 근거를 설명하기 어렵습니다.'},
  {id:'e',label:'전문가 시스템, 논리 프로그래밍',answer:'sym',why:'기호주의의 대표 사례입니다.'},
  {id:'f',label:'딥러닝, 생성형 AI',answer:'con',why:'연결주의의 대표 사례입니다.'},
  {id:'g',label:'사람이 지식을 직접 작성',answer:'sym',why:'기호주의에서는 사람이 사실과 규칙을 직접 기록합니다.'},
  {id:'h',label:'수많은 수치를 조정하며 지식을 익힘',answer:'con',why:'연결주의는 데이터로 연결 강도를 조정하며 학습합니다.'}]});

 // Farmer, wolf, goat and cabbage. A state is the side (0 here, 1 across) of each of the four.
 const WHO=[['farmer','농부'],['wolf','늑대'],['goat','염소'],['cabbage','양배추']],NAME=Object.fromEntries(WHO);
 const danger=s=>{for(const side of [0,1]){if(s.farmer===side)continue;if(s.wolf===side&&s.goat===side)return '농부가 없는 사이 늑대가 염소를 먹었습니다.';if(s.goat===side&&s.cabbage===side)return '농부가 없는 사이 염소가 양배추를 먹었습니다.'}return ''};
 function search(){
  // Breadth-first search over the sixteen states, as a computer would do it.
  const key=s=>WHO.map(([k])=>s[k]).join(''),start={farmer:0,wolf:0,goat:0,cabbage:0},seen=new Map([[key(start),null]]),queue=[start];
  let goal=null;
  while(queue.length){const s=queue.shift();if(WHO.every(([k])=>s[k]===1)){goal=s;break}
   for(const take of [null,'wolf','goat','cabbage']){if(take&&s[take]!==s.farmer)continue;const n={...s,farmer:1-s.farmer};if(take)n[take]=1-s[take];
    if(danger(n)||seen.has(key(n)))continue;seen.set(key(n),[key(s),take,s.farmer]);queue.push(n)}}
  const path=[];for(let k=key(goal);seen.get(k);k=seen.get(k)[0])path.unshift(seen.get(k));
  return {visited:seen.size,path:path.map(([,take,from])=>`${take?`농부와 ${NAME[take]}`:'농부 혼자'} ${from?'← 돌아옴':'→ 건너감'}`)};
 }
 L.add('riverCrossing','custom',{
  hint:'배에 태울 것을 고른 뒤 <b>건너기</b>를 누릅니다. 배에는 농부와 하나까지만 탈 수 있고, 농부가 없으면 늑대는 염소를, 염소는 양배추를 먹습니다.',
  body:`<div class="md-split" style="--split:1.45fr 1fr"><div class="md-panel"><div class="s51-river"><section class="s51-bank" data-bank="0"><h3>이쪽</h3></section><div class="s51-water" id="s51-rc-water"></div><section class="s51-bank" data-bank="1"><h3>건너편</h3></section></div>
   <p class="s51-note" id="s51-rc-count"></p><p class="s51-note" style="margin-top:auto">이쪽 기슭에 있는 것을 누르면 배에 태우고, 한 번 더 누르면 내립니다. 아무것도 태우지 않으면 농부 혼자 건넙니다.</p></div>
   <div class="md-panel"><h3>건넌 기록</h3><ol class="s51-log" id="s51-rc-log"></ol><div id="s51-rc-search" style="margin-top:auto"></div></div></div>`,
  state:()=>({s:{farmer:0,wolf:0,goat:0,cabbage:0},take:null,moves:[],history:[],lost:'',search:false}),
  render(ui,st,reset){
   const cross=ui.action('건너기',()=>{
    if(st.lost)return;st.history.push(JSON.stringify([st.s,st.moves]));
    const from=st.s.farmer,n={...st.s,farmer:1-from};if(st.take)n[st.take]=1-n[st.take];
    st.moves=[...st.moves,{text:`${st.take?`농부와 ${NAME[st.take]}`:'농부 혼자'} ${from?'← 돌아옴':'→ 건너감'}`}];st.s=n;st.take=null;st.lost=danger(n);
    if(st.lost)st.moves[st.moves.length-1].bad=true;draw()},true);
   const undo=ui.action('되돌리기',()=>{const last=st.history.pop();if(!last)return;[st.s,st.moves]=JSON.parse(last);st.take=null;st.lost='';draw()});
   ui.action('컴퓨터 탐색 보기',()=>{st.search=true;draw()});ui.action('처음부터',reset);
   function draw(){
    const won=WHO.every(([k])=>st.s[k]===1);
    for(const side of [0,1])ui.q(`[data-bank="${side}"]`).innerHTML=`<h3>${side?'건너편':'이쪽'}</h3>`+WHO.filter(([k])=>k!=='farmer'&&st.s[k]===side&&st.take!==k).map(([k,name])=>
     `<button type="button" class="s51-who" data-who="${k}" ${side!==st.s.farmer||st.lost||won?'disabled':''} ${st.lost&&st.lost.includes(name)?'data-danger="true"':''}>${name}</button>`).join('');
    const water=ui.q('#s51-rc-water');water.dataset.side=st.s.farmer;
    water.innerHTML=`<div class="s51-boat">배<span>농부</span>${st.take?`<span>${NAME[st.take]}</span>`:''}</div>`;
    ui.q('#s51-rc-count').textContent=`건넌 횟수 ${st.moves.length}번`;
    ui.q('#s51-rc-log').innerHTML=st.moves.length?st.moves.map(m=>`<li ${m.bad?'data-bad="true"':''}>${m.text}</li>`).join(''):'<li style="list-style:none;margin-left:-1.4em">아직 건너지 않았습니다.</li>';
    if(st.search){const r=search();ui.q('#s51-rc-search').innerHTML=`<h3>컴퓨터의 탐색</h3><p class="s51-note">안전한 상태를 하나씩 넓혀 가며 ${r.visited}가지 상태를 확인했습니다. 가장 짧은 방법은 ${r.path.length}번입니다.</p><ol class="s51-log">${r.path.map(t=>`<li>${t}</li>`).join('')}</ol>`}
    else ui.q('#s51-rc-search').innerHTML='';
    cross.disabled=!!st.lost||won;undo.disabled=!st.history.length;
    if(st.lost)ui.say(`${st.lost} 되돌리기를 눌러 다른 방법을 찾아보세요.`,'bad');
    else if(won)ui.say(st.moves.length===7?'7번 만에 모두 건넜습니다. 가장 적은 횟수입니다. 규칙이 분명한 퍼즐은 상태와 규칙을 기호로 나타내 탐색할 수 있습니다.':`${st.moves.length}번 만에 모두 건넜습니다. 가장 적은 횟수는 7번입니다. 더 줄여 보세요.`,'good');
    else ui.say(st.take?`농부와 ${NAME[st.take]}가 배에 탔습니다. 건너기를 누르세요.`:'배에 태울 것을 고르거나, 그대로 건너기를 누르면 농부 혼자 건넙니다.');
   }
   ui.body.addEventListener('click',e=>{const b=e.target.closest('.s51-who');if(!b||b.disabled)return;st.take=st.take===b.dataset.who?null:b.dataset.who;draw()});
   draw();
  }});

 // The count of possible paths when every step offers the same number of choices.
 const fmtCount=n=>{if(n<1e16)return Math.round(n).toLocaleString('ko-KR');const e=Math.floor(Math.log10(n));return `약 ${(n/10**e).toFixed(1)} × 10<sup>${e}</sup>`};
 const fmtTime=sec=>{if(sec<.01)return '0.01초 미만';if(sec<60)return `${sec.toFixed(2)}초`;if(sec<3600)return `약 ${Math.round(sec/60)}분`;if(sec<86400)return `약 ${Math.round(sec/3600)}시간`;
  const days=sec/86400,years=days/365;if(days<365)return `약 ${Math.round(days)}일`;return years<1e16?`약 ${Math.round(years).toLocaleString('ko-KR')}년`:`${fmtCount(years)}년`};
 L.add('explosion','custom',{
  hint:'단계마다 고를 수 있는 <b>선택지의 수</b>와 <b>단계 수</b>를 바꾸어 경우의 수가 얼마나 빨리 늘어나는지 봅니다. 시간은 1초에 100만 가지를 확인하는 컴퓨터로 계산합니다.',
  body:`<div class="md-split" style="--split:1fr 1.1fr"><div class="md-panel"><h3>조건 바꾸기</h3>
   <label class="md-slider">선택지의 수<input type="range" data-k="c" min="2" max="10" step="1"><output></output></label>
   <label class="md-slider">단계 수<input type="range" data-k="n" min="1" max="30" step="1"><output></output></label>
   <h3 style="margin-top:.4em">단계별 경우의 수</h3><ul class="md-list" id="s51-ex-list"></ul></div>
   <div class="md-panel"><h3>모든 경우의 수</h3><p class="s51-big" id="s51-ex-big"></p><h3>모두 확인하는 데 걸리는 시간</h3><p class="s51-big" id="s51-ex-time" style="font-size:1.5em"></p><p class="md-verdict" id="s51-ex-verdict"></p></div></div>`,
  state:()=>({c:3,n:10}),
  render(ui,st,reset){
   ui.action('처음 값으로',reset);
   function draw(){
    ui.all('[data-k]').forEach(n=>{n.value=st[n.dataset.k];n.nextElementSibling.textContent=st[n.dataset.k]+(n.dataset.k==='c'?'개':'단계')});
    const total=st.c**st.n,sec=total/1e6,steps=[...new Set([1,2,5,10,20,30].filter(k=>k<st.n).concat(st.n))];
    ui.q('#s51-ex-list').innerHTML=steps.map(k=>`<li><span>${k}단계</span><b>${fmtCount(st.c**k)}가지</b></li>`).join('');
    ui.q('#s51-ex-big').innerHTML=`${fmtCount(total)}가지`;ui.q('#s51-ex-time').innerHTML=fmtTime(sec);
    const v=ui.q('#s51-ex-verdict'),slow=sec>86400;v.textContent=slow?'모두 확인하기 어려움':'모두 확인할 수 있음';v.dataset.tone=slow?'bad':'good';
    ui.say(slow?'단계가 늘 때마다 경우의 수가 곱으로 늘어나는 조합 폭발입니다. 범용 추론의 한계가 드러나며 연구는 좁은 분야의 전문 지식으로 방향을 바꾸었습니다.':'단계를 늘려 보세요. 단계가 하나 늘 때마다 경우의 수는 선택지의 수만큼 곱해집니다.',slow?'bad':'');
   }
   ui.body.addEventListener('input',e=>{const k=e.target.dataset.k;if(k){st[k]=Number(e.target.value);draw()}});draw();
  }});

 L.add('historyOrder','order',{hint:'기호주의 AI의 일곱 장면을 <b>일어난 순서</b>대로 놓아 봅니다. 확인하면 연도가 나옵니다.',seed:11,from:'먼저',to:'나중',items:[
  {key:'1956',label:'다트머스 회의',sub:'인공지능 분야의 출발'},
  {key:'1957',label:'일반 문제 해결기',sub:'수단 목표 분석'},
  {key:'1965',label:'DENDRAL',sub:'분자 구조를 추정한 첫 전문가 시스템'},
  {key:'1973',label:'라이트힐 보고서',sub:'첫 번째 겨울의 시작'},
  {key:'1980',label:'XCON',sub:'기업이 쓴 주문 구성 시스템'},
  {key:'1982',label:'제5세대 컴퓨터 계획',sub:'일본의 논리 프로그래밍 투자'},
  {key:'1987',label:'LISP 전용 기계 시장 붕괴',sub:'두 번째 겨울의 시작'}]});

 L.add('componentMatch','match',{hint:'동물 판별 전문가 시스템에서 일어나는 일을 맡는 <b>구성 요소</b>와 짝지어 봅니다.',leftTitle:'구성 요소',rightTitle:'동물 판별 시스템에서 하는 일',seed:5,pairs:[
  {left:'지식 베이스',right:'규칙 1부터 규칙 6까지 담아 둠'},
  {left:'작업 메모리',right:'털이 있음, 고기를 먹음 같은 지금의 사실을 기억함'},
  {left:'추론 엔진',right:'조건이 맞는 규칙 3을 골라 육식동물이라는 결론을 냄'},
  {left:'설명 기능',right:'왜 묻나요? 질문에 규칙 1을 보여 줌'},
  {left:'사용자 인터페이스',right:'털이 있나요? 질문을 화면에 띄우고 답을 받음'},
  {left:'지식 공학자',right:'동물학자의 판별 기준을 규칙으로 정리함'}]});

 // The knowledge base of the animal example on the slides.
 const RULES=[{n:1,if:['털이 있음'],then:'포유류'},{n:2,if:['깃털이 있음'],then:'조류'},{n:3,if:['포유류','고기를 먹음'],then:'육식동물'},
  {n:4,if:['육식동물','황갈색','검은 점'],then:'치타'},{n:5,if:['육식동물','황갈색','검은 줄무늬'],then:'호랑이'},{n:6,if:['조류','날지 못함','헤엄침'],then:'펭귄'}];
 const OBSERVED=['털이 있음','깃털이 있음','고기를 먹음','황갈색','검은 점','검은 줄무늬','날지 못함','헤엄침'],ANIMALS=['치타','호랑이','펭귄'];
 const ruleText=r=>`${r.if.join(' 그리고 ')} → ${r.then}`;
 const PRESETS=[['슬라이드 예시',['털이 있음','고기를 먹음','황갈색','검은 점']],['줄무늬가 있는 동물',['털이 있음','고기를 먹음','황갈색','검은 줄무늬']],['물가의 새',['깃털이 있음','날지 못함','헤엄침']],['먹이를 모르는 동물',['털이 있음','황갈색','검은 점']]];
 L.add('forwardChain','custom',{
  hint:'처음 사실을 고른 뒤 한 단계씩 실행합니다. 추론 엔진은 <b>조건이 모두 맞는 규칙</b>을 찾아 결론을 새 사실로 더하고, 쓸 규칙이 없으면 멈춥니다.',
  body:`<div class="md-split" style="--split:1fr 1.15fr"><div class="md-panel"><h3>처음 사실</h3><div class="md-chips">${PRESETS.map((p,i)=>`<button type="button" class="md-chip" data-preset="${i}">${p[0]}</button>`).join('')}</div>
   <div class="s51-facts">${OBSERVED.map(f=>`<button type="button" class="s51-fact" data-fact="${f}">${f}</button>`).join('')}</div>
   <h3>지식 베이스</h3><ul class="s51-rules" id="s51-fw-rules"></ul></div>
   <div class="md-panel"><h3>작업 메모리</h3><div class="s51-wm" id="s51-fw-wm"></div><h3>추론 기록</h3><table class="s51-table"><thead><tr><th>단계</th><th>조건 맞은 규칙</th><th>실행한 규칙</th><th>새 사실</th></tr></thead><tbody id="s51-fw-steps"></tbody></table></div></div>`,
  state:()=>({facts:[...PRESETS[0][1]],steps:[],ended:false}),
  render(ui,st,reset){
   const memory=()=>new Set([...st.facts,...st.steps.map(s=>s.add)]),matching=wm=>RULES.filter(r=>r.if.every(c=>wm.has(c))&&!wm.has(r.then));
   function step(){if(st.ended)return;const c=matching(memory());if(!c.length){st.ended=true;return}st.steps.push({cands:c.map(r=>r.n),n:c[0].n,add:c[0].then})}
   const one=ui.action('한 단계 실행',()=>{step();draw()},true),all=ui.action('끝까지 실행',()=>{while(!st.ended)step();draw()});ui.action('처음부터',reset);
   function draw(){
    const wm=memory(),cands=st.ended?[]:matching(wm).map(r=>r.n),fired=st.steps.map(s=>s.n);
    ui.all('.s51-fact').forEach(b=>b.setAttribute('aria-pressed',String(st.facts.includes(b.dataset.fact))));
    ui.all('[data-preset]').forEach(b=>b.setAttribute('aria-pressed',String(PRESETS[b.dataset.preset][1].join()===[...st.facts].sort((a,b)=>OBSERVED.indexOf(a)-OBSERVED.indexOf(b)).join())));
    ui.q('#s51-fw-rules').innerHTML=RULES.map(r=>`<li data-st="${fired.includes(r.n)?'fired':cands.includes(r.n)?'match':''}"><b>규칙 ${r.n}</b><span>${r.if.join(' 그리고 ')}</span><em>${r.then}</em></li>`).join('');
    ui.q('#s51-fw-wm').innerHTML=[...st.facts.map(f=>`<span>${f}</span>`),...st.steps.map(s=>`<span data-new="true">${s.add}</span>`)].join('')||'<span>사실 없음</span>';
    ui.q('#s51-fw-steps').innerHTML=st.steps.map((s,i)=>`<tr><td>${i+1}</td><td>${s.cands.map(n=>'규칙 '+n).join(', ')}</td><td>규칙 ${s.n}</td><td>${s.add}</td></tr>`).join('')+(st.ended?`<tr><td>${st.steps.length+1}</td><td>없음</td><td>-</td><td>추론 종료</td></tr>`:'');
    one.disabled=all.disabled=st.ended;
    const found=st.steps.filter(s=>ANIMALS.includes(s.add)).map(s=>s.add),last=st.steps[st.steps.length-1];
    if(st.ended&&found.length)ui.say(`결론은 ${found.join(', ')}입니다. 어떻게 판단했나요? ${fired.map(n=>'규칙 '+n).join(' → ')}의 순서로 결론에 이르렀습니다.`,'good');
    else if(st.ended)ui.say('쓸 규칙이 없어 동물 이름까지 이르지 못했습니다. 필요한 사실이 빠지면 결론이 나오지 않습니다.','bad');
    else if(last&&last.cands.length>1)ui.say(`조건이 맞는 규칙이 ${last.cands.length}개였습니다. 여기서는 번호가 작은 규칙을 먼저 고르는 방식으로 충돌을 해결했습니다.`);
    else if(last)ui.say(`규칙 ${last.n}의 조건이 모두 맞아 '${last.add}'를 새 사실로 더했습니다. 새 사실로 다른 규칙의 조건이 맞는지 다시 비교합니다.`);
    else ui.say(st.facts.length?'노란 규칙은 지금 조건이 모두 맞는 규칙입니다. 한 단계 실행을 눌러 보세요.':'처음 사실을 하나 이상 고르세요.');
   }
   ui.body.addEventListener('click',e=>{
    const f=e.target.closest('.s51-fact'),p=e.target.closest('[data-preset]');
    if(f)st.facts=st.facts.includes(f.dataset.fact)?st.facts.filter(x=>x!==f.dataset.fact):[...st.facts,f.dataset.fact];
    else if(p)st.facts=[...PRESETS[p.dataset.preset][1]];else return;
    st.steps=[];st.ended=false;draw();
   });draw();
  }});

 // Backward chaining replayed from the answers given so far; it stops at the first question that has no answer yet.
 const ASK={'털이 있음':'털이 있나요?','깃털이 있음':'깃털이 있나요?','고기를 먹음':'고기를 먹나요?','황갈색':'황갈색인가요?','검은 점':'검은 점이 있나요?','검은 줄무늬':'검은 줄무늬가 있나요?','날지 못함':'날지 못하나요?','헤엄침':'헤엄치나요?'};
 function backward(goal,answers){
  const events=[],known={};let pending=null;
  function prove(g,stack,depth){
   if(g in known)return known[g];
   const rules=RULES.filter(r=>r.then===g);
   if(!rules.length){
    if(!(g in answers)){pending={fact:g,stack};throw pending}
    events.push({kind:'ask',depth,text:`질문 ${ASK[g]} 답 ${answers[g]?'예':'아니요'}`});return known[g]=answers[g];
   }
   for(const r of rules){
    events.push({kind:'goal',depth,text:`${g}인가? 규칙 ${r.n}, 하위 목표 ${r.if.join(', ')}`});
    const failed=r.if.find(c=>!prove(c,[...stack,{goal:g,rule:r}],depth+1));
    if(!failed){events.push({kind:'ok',depth,text:`${g} 확인, 규칙 ${r.n}`});return known[g]=true}
    events.push({kind:'no',depth,text:`규칙 ${r.n}로 ${g}임을 보이지 못함, ${failed} 아님`});
   }
   return known[g]=false;
  }
  let result=null;try{result=prove(goal,[],0)}catch(e){if(e!==pending)throw e}
  return {events,pending,result,asked:Object.keys(known).filter(k=>k in ASK)};
 }
 L.add('backwardChain','custom',{
  hint:'확인할 <b>목표</b>를 고르고 동물 하나를 떠올려 질문에 답합니다. 질문을 받으면 <b>왜 묻나요?</b>로 설명 기능을 확인하세요. 시작 전에 질문이 몇 개일지 예상해 보세요.',
  body:`<div class="md-split" style="--split:1fr 1.15fr"><div class="md-panel"><h3>확인할 목표</h3><div class="md-chips">${ANIMALS.map(a=>`<button type="button" class="md-chip" data-goal="${a}">${a}인가?</button>`).join('')}</div>
   <div id="s51-bw-ask"></div><div class="s51-why" id="s51-bw-why" hidden></div><p class="s51-note" id="s51-bw-count" style="margin-top:auto"></p></div>
   <div class="md-panel"><h3>목표에서 근거로</h3><ol class="s51-trace" id="s51-bw-trace"></ol></div></div>`,
  state:()=>({goal:'치타',answers:{},why:false}),
  render(ui,st,reset){
   ui.action('처음부터',reset);
   function draw(){
    const r=backward(st.goal,st.answers);
    ui.all('[data-goal]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.goal===st.goal)));
    ui.q('#s51-bw-trace').innerHTML=r.events.map(e=>`<li data-kind="${e.kind}" style="margin-left:${e.depth*1.1}em">${esc(e.text)}</li>`).join('')+(r.pending?`<li data-kind="ask" style="margin-left:${r.pending.stack.length*1.1}em">질문 ${ASK[r.pending.fact]} 답을 기다림</li>`:'');
    const box=ui.q('#s51-bw-ask'),why=ui.q('#s51-bw-why');
    if(r.pending){
     box.innerHTML=`<div class="s51-ask"><small>시스템</small><p>${ASK[r.pending.fact]}</p><div class="md-choices" style="--n:3"><button type="button" class="md-choice" data-answer="1">예</button><button type="button" class="md-choice" data-answer="0">아니요</button><button type="button" class="md-choice" data-act="why">왜 묻나요?</button></div></div>`;
     why.hidden=!st.why;why.innerHTML=[...r.pending.stack].reverse().map((f,i)=>`${i?'그다음 ':''}${f.goal}인지 확인하려고 합니다. 규칙 ${f.rule.n}, ${esc(ruleText(f.rule))}`).join('<br>');
    }else{box.innerHTML=`<p class="md-verdict" data-tone="${r.result?'good':'bad'}">${r.result?`${st.goal}입니다`:`${st.goal}${st.goal==='펭귄'?'이':'가'} 아닙니다`}</p>`;why.hidden=true}
    const unasked=Object.keys(ASK).filter(f=>!r.asked.includes(f));
    ui.q('#s51-bw-count').textContent=`지금까지 받은 질문 ${r.asked.length}개`;
    if(r.pending)ui.say(st.why?'설명 기능은 지금 확인하는 목표와 그 목표를 내는 규칙을 보여 줍니다. 답을 골라 계속하세요.':'떠올린 동물에 맞게 답하세요. 목표를 내는 규칙의 조건이 하위 목표가 됩니다.');
    else ui.say(`질문 ${r.asked.length}개로 결론을 냈습니다. ${unasked.length?`${unasked.slice(0,3).join(', ')} 같은 사실은 목표와 관계가 없어 묻지 않았습니다.`:''} 다른 목표나 다른 동물로 다시 해 보세요.`,'good');
   }
   ui.body.addEventListener('click',e=>{
    const g=e.target.closest('[data-goal]'),a=e.target.closest('[data-answer]');
    if(g){st.goal=g.dataset.goal;st.answers={};st.why=false}
    else if(a){const r=backward(st.goal,st.answers);if(r.pending){st.answers={...st.answers,[r.pending.fact]:a.dataset.answer==='1'};st.why=false}}
    else if(e.target.closest('[data-act=why]'))st.why=true;else return;
    draw();
   });draw();
  }});

 const WAYS=['정방향 추론','역방향 추론'];
 L.add('inferenceQuiz','quiz',{hint:'학교 업무에 알맞은 <b>추론 방식</b>을 골라 봅니다.',closing:'새 자료가 계속 들어오거나 결론이 열려 있으면 정방향, 확인할 결론이 정해져 있으면 역방향이 알맞습니다.',questions:[
  {q:'출결 기록이 입력될 때마다 결석이 쌓인 학생을 찾아 담임에게 알립니다.',short:'출결 입력마다 알림',choices:WAYS,answer:0,why:'새 자료가 들어올 때마다 바로 반영하는 데이터 주도 추론입니다.'},
  {q:'이 학생이 교육복지 지원 대상 요건을 갖추었는지 확인합니다.',short:'지원 대상 요건 확인',choices:WAYS,answer:1,why:'확인할 결론이 정해져 있어 그 결론에 필요한 조건만 묻는 목표 주도 추론입니다.'},
  {q:'날씨와 행사 일정을 넣으면 가능한 체육 수업 장소를 모두 제시합니다.',short:'가능한 장소 모두 제시',choices:WAYS,answer:0,why:'결론이 여럿이고 열려 있어 알려진 사실에서 출발합니다.'},
  {q:'학생의 두통이 수면 부족 때문인지 확인합니다.',short:'원인 가설 확인',choices:WAYS,answer:1,why:'가설을 세우고 그 근거를 확인하는 목표 주도 추론입니다.'},
  {q:'혈액 검사 결과를 묻고 감염균과 항생제를 추천한 MYCIN의 추론 방식은?',short:'MYCIN',choices:WAYS,answer:1,why:'MYCIN은 목표에서 출발해 필요한 것만 묻는 역방향 추론을 썼습니다.'}]});

 const PROBLEMS=['빠진 규칙','충돌','순환','드문 예외'];
 const rq=(rules,what)=>`<ul class="s51-rq">${rules.map(r=>`<li>${r}</li>`).join('')}<li><em>${what}</em></li></ul>`;
 L.add('ruleProblems','quiz',{hint:'규칙표를 시험하다 생긴 일입니다. 어떤 <b>문제</b>인지 골라 봅니다.',closing:'규칙을 시험하며 문제를 찾고, 빠진 규칙과 충돌하는 규칙을 고칩니다.',questions:[
  {html:'<p>비가 오고 미세먼지도 매우 나쁜 날, 두 결론이 함께 나왔습니다.</p>'+rq(['<b>규칙 1</b> 비가 오고 운동장 수업 예정이면 → 강당으로 장소 변경','<b>규칙 2</b> 미세먼지 매우 나쁨이면 → 교실 수업'],'결론: 강당으로 장소 변경, 교실 수업'),short:'같은 사실에서 다른 결론',choices:PROBLEMS,columns:4,answer:1,why:'같은 사실에서 다른 결론이 나오는 충돌입니다. 우선순위를 정하거나 조건을 나눕니다.'},
  {html:'<p>체온은 36.8도이지만 기침이 심한 학생에게 아무 안내도 나오지 않았습니다.</p>'+rq(['<b>규칙 1</b> 체온 37.5도 이상이면 → 보건실 안내'],'결론: 없음'),short:'결론이 나오지 않음',choices:PROBLEMS,columns:4,answer:0,why:'결론이 나오지 않는 빠진 규칙입니다. 필요한 조건과 결론을 추가합니다.'},
  {html:'<p>추론이 끝나지 않고 같은 두 규칙을 계속 실행합니다.</p>'+rq(['<b>규칙 1</b> 보충 수업 대상이면 → 학부모 상담','<b>규칙 2</b> 학부모 상담이면 → 보충 수업 대상'],'결론: 규칙 1, 규칙 2, 규칙 1, …'),short:'규칙이 서로를 계속 부름',choices:PROBLEMS,columns:4,answer:2,why:'규칙이 서로를 계속 부르는 순환입니다. 결론이 조건으로 되돌아가지 않게 고칩니다.'},
  {html:'<p>강당이 공사 중인 날에도 강당으로 가라는 안내가 나왔습니다.</p>'+rq(['<b>규칙 1</b> 비가 오고 운동장 수업 예정이면 → 강당으로 장소 변경'],'결론: 강당으로 장소 변경'),short:'엉뚱한 결론',choices:PROBLEMS,columns:4,answer:3,why:'규칙이 예상하지 못한 드문 예외입니다. 예외 규칙을 추가하거나 사람이 확인하는 단계를 둡니다.'}]});

 L.add('ruleVsGen','sort',{hint:'여덟 가지 특징이 <b>규칙 기반 전문가 시스템</b>과 <b>생성형 AI</b> 가운데 어디에 해당하는지 놓아 봅니다.',
  bins:[{id:'rule',label:'규칙 기반 전문가 시스템'},{id:'gen',label:'생성형 AI'}],cards:[
  {id:'a',label:'전문가가 쓴 규칙에서 지식을 얻음',answer:'rule',why:'지식의 출처가 전문가가 쓴 규칙입니다.'},
  {id:'b',label:'대규모 텍스트에서 학습함',answer:'gen',why:'생성형 AI는 대규모 텍스트에서 학습합니다.'},
  {id:'c',label:'규칙을 적용한 추론으로 답을 만듦',answer:'rule',why:'추론 엔진이 규칙을 사실에 적용해 답을 만듭니다.'},
  {id:'d',label:'다음 토큰을 예측하며 답을 만듦',answer:'gen',why:'생성형 AI는 다음 토큰을 예측하며 문장을 만듭니다.'},
  {id:'e',label:'같은 질문에 늘 같은 답',answer:'rule',why:'같은 입력에 늘 같은 규칙이 적용됩니다.'},
  {id:'f',label:'실행마다 답이 달라질 수 있음',answer:'gen',why:'확률에 따라 토큰을 고르므로 실행마다 결과가 달라질 수 있습니다.'},
  {id:'g',label:'사용한 규칙을 근거로 제시',answer:'rule',why:'설명 기능이 결론까지 쓴 규칙을 보여 줍니다.'},
  {id:'h',label:'넓은 분야와 자연어를 다룸',answer:'gen',why:'생성형 AI는 넓은 분야와 자연어를 다루지만 근거 추적이 어렵습니다.'}]});
})();
