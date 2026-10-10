/* 2주차 오전, 인공지능의 개념과 발전 Part 2: activity slides. Rules, tasks and numbers marked as examples are written for these activities. */
(()=>{
 'use strict';
 const L=window.ceLabs;if(!L)return;const esc=L.esc;
 L.style(`.md-lab .s21-line{flex:1;min-height:0;max-height:13em;display:grid;grid-template-columns:repeat(8,minmax(0,1fr));gap:.5em}
.md-lab .s21-slot{display:flex;flex-direction:column;gap:.3em;min-height:0}.md-lab .s21-slot .md-step{padding:.3em .2em;min-height:0}
.md-lab .s21-slot .md-step b{font-size:.9em}.md-lab .s21-slot .md-step small{font-size:.7em}
.md-lab .s21-unsure{flex:none;padding:.15em 0;font-size:.72em}.md-lab .s21-tag{flex:none;height:1.5em;font-size:.74em;font-weight:800;text-align:center;color:#b36b00}
.md-lab .s21-cap{font-size:.8em;color:#52607f}
.md-lab .s21-gaps{display:grid;grid-template-columns:repeat(16,minmax(0,1fr));gap:.3em .25em;align-items:stretch}
.md-lab .s21-gap{padding:.2em 0;border:1px dashed #9fb0dc;border-radius:.5em;background:#fff;color:#6b7896;font-size:.78em;line-height:1.3;text-align:center;cursor:pointer}
.md-lab .s21-gap:disabled{cursor:default}.md-lab .s21-gap[data-m="0"]:disabled{visibility:hidden}
.md-lab .s21-gap[data-m="1"],.md-lab .s21-band[data-m="1"]{border:1px solid #1f8a5b;background:#e3f5ec;color:#16794c;font-weight:800}
.md-lab .s21-gap[data-m="2"],.md-lab .s21-band[data-m="2"]{border:1px solid #c2413b;background:#fdeceb;color:#b5372f;font-weight:800}
.md-lab .s21-band{padding:.2em .3em;border-radius:.5em;font-size:.76em;line-height:1.3;text-align:center}
.md-lab .s21-rowname{grid-column:1/-1;font-size:.78em;color:#52607f}
.md-lab .s21-sum{grid-template-columns:repeat(3,minmax(0,1fr))}
.md-lab .s21-plot,.md-lab .s21-chart{flex:1;min-height:0;width:100%}
.md-lab .s21-legend{display:flex;flex-wrap:wrap;gap:.2em 1.1em;font-size:.76em;color:#52607f}.md-lab .s21-legend span{display:flex;align-items:center;gap:.4em}
.md-lab .s21-legend i{width:.95em;height:.95em;border-radius:50%;border:.14em solid #3f5dae;background:#fff}.md-lab .s21-legend i[data-k=one]{background:#3f5dae}
.md-lab .s21-legend i[data-k=area]{border-radius:.2em;border-color:#dfe7fa;background:#dfe7fa}.md-lab .s21-legend i[data-k=all]{border-radius:.2em;background:#3f5dae}
.md-lab .s21-legend i[data-k=few]{border-radius:.2em;border-color:#f0a202;background:#f0a202}
.md-lab .s21-truth td,.md-lab .s21-truth td:nth-child(n+3){width:auto;text-align:center}.md-lab .s21-truth{font-size:.84em}
.md-lab .s21-wide{grid-template-columns:10.5em 1fr 4.6em}
.md-lab .s21-facts{display:grid;gap:.45em}
.md-lab .s21-fact{display:flex;align-items:center;gap:.55em;padding:.45em .7em;border:1px solid #9fb0dc;border-radius:.5em;background:#fff;color:#1c2c4c;font-size:.86em;line-height:1.3;text-align:left;cursor:pointer}
.md-lab .s21-fact i{flex:none;display:grid;place-items:center;width:1.25em;height:1.25em;border:1px solid #9fb0dc;border-radius:.3em;background:#fff;font-style:normal;font-size:.85em}
.md-lab .s21-fact[aria-pressed=true] i{background:#f0a202;border-color:#f0a202;color:#fff}
.md-lab .s21-trace{display:grid;gap:.35em;margin:0;padding:0;list-style:none;font-size:.86em}.md-lab .s21-trace li{padding:.3em .7em;border-left:.25em solid #3f5dae;background:#fff;line-height:1.35}
.md-lab .s21-out{margin-top:auto;padding:.5em .7em;border-radius:.6em;background:#ebf0fc;font-size:.9em;line-height:1.4}.md-lab .s21-out b{display:block;color:#2c478f}
.md-lab .s21-out[data-tone=good]{background:#e3f5ec}.md-lab .s21-out[data-tone=bad]{background:#fdeceb}.md-lab .s21-out[data-tone=bad] b{color:#b5372f}
.md-lab .s21-rules li{display:grid;grid-template-columns:3.4em 1fr;gap:.05em .5em;padding:.3em .6em;font-size:.88em;line-height:1.35}
.md-lab .s21-rules li b{grid-row:span 2;color:#2c478f}.md-lab .s21-rules li[data-on=true]{border-color:#f0a202;background:#fff7df}
.md-lab .s21-plane{flex:1;min-height:0;display:grid;grid-template-columns:1.6em 3.2em repeat(3,minmax(0,1fr));grid-template-rows:repeat(3,minmax(0,1fr)) auto auto;gap:.3em;font-size:.8em;color:#52607f}
.md-lab .s21-ylab{grid-row:1/span 3;writing-mode:vertical-rl;text-align:center}.md-lab .s21-xlab{grid-column:3/span 3;text-align:center}
.md-lab .s21-tick{display:grid;place-items:center;text-align:center}
.md-lab .s21-cell{position:relative;display:flex;flex-wrap:wrap;align-content:flex-start;gap:.2em;min-height:0;padding:1.45em .35em .2em;border:1px solid #9fb0dc;border-radius:.5em;cursor:pointer}
.md-lab .s21-cell::before{content:attr(data-name);position:absolute;top:.2em;left:.55em;font-size:.9em;color:#3a4a6b}
.md-lab .s21-cell[data-zone=ai]{background:#f6f8fd}.md-lab .s21-cell[data-zone=both]{background:#dfe7fa}.md-lab .s21-cell[data-zone=teacher]{background:#b9c6e6}
.md-lab .s21-task{font-size:.95em;padding:.1em .55em;line-height:1.3;color:#1c2c4c}.md-lab .md-panel .s21-task{padding:.25em .8em;font-size:.84em}`);

 // The eight cards of the prediction activity, in the order they happened. DEALT is the mixed order printed on the slide.
 const EVENTS=[['1950','모방 게임','튜링의 지능 판단 방법'],['1956','다트머스 학술회의','인공지능이라는 이름 등장'],['1958','퍼셉트론','학습하는 인공 신경 모형'],['1980년대','전문가 시스템','기업에서 규칙 기반 AI 확산'],
  ['1997','딥블루','체스 세계 챔피언에게 승리'],['2012','이미지넷 대회','딥러닝이 오류를 크게 줄임'],['2016','알파고','이세돌 9단에게 승리'],['2022','ChatGPT','누구나 쓰는 대화형 AI 공개']];
 const DEALT=[4,1,7,2,6,3,5,0],MARKS=['표시','기대','실망'],KEY='s21-predict';
 const stored=()=>{const m=L.memory.get(KEY);return m&&Array.isArray(m.order)&&m.order.length===8&&Array.isArray(m.marks)?m:null};
 const gapRow=(marks,locked)=>marks.map((m,i)=>`<button type="button" class="s21-gap" data-i="${i}" data-m="${m}" style="grid-column:${2*i+2}/span 2" ${locked?'disabled':''}>${MARKS[m]}</button>`).join('');

 L.add('eventPredict','custom',{
  hint:'사건 카드 여덟 장을 <b>일어난 순서</b>로 놓고, 가장 자신 없는 카드와 기대와 실망의 시기를 표시합니다. 연도는 아직 확인하지 않습니다.',
  body:`<div class="md-axis"><span>먼저</span><i></i><span>나중</span></div><div class="s21-line"></div>
   <div class="s21-cap">카드 사이의 칸을 누를 때마다 기대가 커진 시기, 실망이 컸던 시기, 표시 없음으로 바뀝니다.</div><div class="s21-gaps"></div><ul class="md-list s21-sum"></ul>`,
  state:()=>{const m=stored();return {order:m?[...m.order]:[...DEALT],unsure:m?m.unsure:null,marks:m?[...m.marks]:[0,0,0,0,0,0,0],pick:null}},
  render(ui,st,reset){
   ui.action('처음부터',()=>{L.memory.set(KEY,null);reset()});
   function draw(){
    L.memory.set(KEY,{order:st.order,unsure:st.unsure,marks:st.marks});
    ui.q('.s21-line').innerHTML=st.order.map((e,pos)=>`<div class="s21-slot"><button type="button" class="md-step" data-pos="${pos}" aria-pressed="${st.pick===pos}"><span>${pos+1}</span><b>${EVENTS[e][1]}</b><small>${EVENTS[e][2]}</small></button>
     <button type="button" class="md-chip s21-unsure" data-e="${e}" aria-pressed="${st.unsure===e}">자신 없음</button></div>`).join('');
    ui.q('.s21-gaps').innerHTML=gapRow(st.marks);
    const count=m=>st.marks.filter(v=>v===m).length;
    ui.q('.s21-sum').innerHTML=[['가장 자신 없는 카드',st.unsure===null?'아직 없음':EVENTS[st.unsure][1]],['기대가 커진 시기',count(1)+'곳'],['실망이 컸던 시기',count(2)+'곳']].map(([a,b])=>`<li><span>${a}</span><b>${b}</b></li>`).join('');
    ui.say(st.pick!==null?'바꿀 자리의 카드를 누르세요.':st.unsure===null?'카드 두 장을 차례로 누르면 자리가 바뀝니다. 가장 자신 없는 카드에는 자신 없음을 표시하세요.'
     :!count(1)&&!count(2)?'카드 사이의 칸을 눌러 기대가 커진 시기와 실망이 컸던 시기를 예상해 보세요.':'예상 연표를 기록했습니다. 뒤의 연표 확인 활동에서 실제 연도와 비교합니다.',st.pick===null&&st.unsure!==null&&count(1)+count(2)?'good':'');
   }
   ui.body.addEventListener('click',e=>{
    const card=e.target.closest('.md-step'),unsure=e.target.closest('.s21-unsure'),gap=e.target.closest('.s21-gap');
    if(card){const pos=Number(card.dataset.pos);if(st.pick===null)st.pick=pos;else{[st.order[st.pick],st.order[pos]]=[st.order[pos],st.order[st.pick]];st.pick=null}}
    else if(unsure){const id=Number(unsure.dataset.e);st.unsure=st.unsure===id?null:id}
    else if(gap){const i=Number(gap.dataset.i);st.marks[i]=(st.marks[i]+1)%3}
    else return;
    draw();
   });
   draw();
  }});

 // A single perceptron unit on two inputs: the weighted sum is compared with a threshold.
 const PROBLEMS={and:{label:'둘 다 1일 때만 1',t:[0,0,0,1]},or:{label:'하나라도 1이면 1',t:[0,1,1,1]},xor:{label:'서로 다를 때만 1 (XOR)',t:[0,1,1,0]}},INPUTS=[[0,0],[1,0],[0,1],[1,1]];
 L.add('xorLab','custom',{
  hint:'가중치와 기준값을 바꾸어 네 가지 입력을 모두 맞혀 봅니다. 곱해 더한 값이 기준값 이상이면 1을 냅니다. <b>XOR</b>도 풀 수 있을까요?',
  body:`<div class="md-split" style="--split:1fr 1.3fr"><div class="md-panel"><h3>입력과 판단 경계</h3><svg class="s21-plot" viewBox="0 0 320 300" role="img" aria-label="두 입력의 평면에 놓인 네 점과 퍼셉트론의 판단 경계"></svg>
   <div class="s21-legend"><span><i data-k="one"></i>정답이 1인 입력</span><span><i></i>정답이 0인 입력</span><span><i data-k="area"></i>출력이 1인 쪽</span></div></div>
   <div class="md-panel"><div class="md-chips" id="s21-prob">${Object.entries(PROBLEMS).map(([k,p])=>`<button type="button" class="md-chip" data-p="${k}">${p.label}</button>`).join('')}</div>
   <label class="md-slider">가중치 1<input type="range" data-k="w1" min="-2" max="2" step="0.5"><output></output></label>
   <label class="md-slider">가중치 2<input type="range" data-k="w2" min="-2" max="2" step="0.5"><output></output></label>
   <label class="md-slider">기준값<input type="range" data-k="th" min="-1" max="3" step="0.5"><output></output></label>
   <table class="md-check s21-truth"><thead><tr><th>입력 1</th><th>입력 2</th><th>곱해 더한 값</th><th>출력</th><th>정답</th><th>판정</th></tr></thead><tbody></tbody></table></div></div>`,
  state:()=>({p:'and',w1:.5,w2:.5,th:.5,steps:0,tries:0,next:0}),
  render(ui,st,reset){
   const X=v=>60+v*200,Y=v=>250-v*200,clamp=(v,a,b)=>Math.min(b,Math.max(a,v)),num=v=>String(Math.round(v*10)/10);
   const out=i=>+(st.w1*INPUTS[i][0]+st.w2*INPUTS[i][1]>=st.th),target=()=>PROBLEMS[st.p].t;
   const fix=ui.action('틀린 입력으로 가중치 고치기',()=>{ // The perceptron rule: one wrong example moves the weights toward its answer.
    for(let n=0;n<4;n++){const i=(st.next+n)%4,d=target()[i]-out(i);if(!d)continue;
     st.w1=clamp(st.w1+.5*d*INPUTS[i][0],-2,2);st.w2=clamp(st.w2+.5*d*INPUTS[i][1],-2,2);st.th=clamp(st.th-.5*d,-1,3);st.next=(i+1)%4;st.steps++;break}
    draw();
   },true);
   ui.action('처음 값으로',reset);
   function draw(){
    const t=target(),sq=[[-.25,-.25],[1.25,-.25],[1.25,1.25],[-.25,1.25]],f=p=>st.w1*p[0]+st.w2*p[1]-st.th,area=[],edge=[];
    sq.forEach((p,i)=>{const q=sq[(i+1)%4],a=f(p),b=f(q);if(a>=0)area.push(p);if((a>=0)!==(b>=0)){const k=a/(a-b),c=[p[0]+k*(q[0]-p[0]),p[1]+k*(q[1]-p[1])];area.push(c);edge.push(c)}});
    const at=p=>`${X(p[0]).toFixed(1)},${Y(p[1]).toFixed(1)}`;
    ui.q('.s21-plot').innerHTML=`<rect x="10" y="0" width="300" height="300" rx="8" fill="#fff" stroke="#c9d3ec"/>${area.length?`<polygon points="${area.map(at).join(' ')}" fill="#dfe7fa"/>`:''}
     <path d="M${X(0)} ${Y(1.2)}V${Y(0)}H${X(1.2)}" fill="none" stroke="#9fb0dc" stroke-width="1.5"/><text x="${X(.5)}" y="${Y(0)+19}" text-anchor="middle" font-size="13" fill="#52607f">입력 1</text><text x="${X(0)-10}" y="${Y(.5)}" text-anchor="middle" font-size="13" fill="#52607f" transform="rotate(-90 ${X(0)-10} ${Y(.5)})">입력 2</text>
     ${edge.length===2?`<line x1="${X(edge[0][0])}" y1="${Y(edge[0][1])}" x2="${X(edge[1][0])}" y2="${Y(edge[1][1])}" stroke="#3f5dae" stroke-width="3"/>`:''}
     ${INPUTS.map(([a,b],i)=>`<circle cx="${X(a)}" cy="${Y(b)}" r="20" fill="none" stroke="${out(i)===t[i]?'#1f8a5b':'#c2413b'}" stroke-width="3.5"/><circle cx="${X(a)}" cy="${Y(b)}" r="12" fill="${t[i]?'#3f5dae':'#fff'}" stroke="#3f5dae" stroke-width="3"/>
      <text x="${X(a)}" y="${Y(b)+40}" text-anchor="middle" font-size="13" fill="#1c2c4c">(${a}, ${b})</text>`).join('')}`;
    ui.all('#s21-prob .md-chip').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.p===st.p)));
    ui.all('.md-slider input').forEach(n=>{n.value=st[n.dataset.k];n.nextElementSibling.textContent=num(st[n.dataset.k])});
    ui.q('.s21-truth tbody').innerHTML=INPUTS.map(([a,b],i)=>{const sum=st.w1*a+st.w2*b,y=out(i);
     return `<tr data-result="${y===t[i]?'right':'wrong'}"><td>${a}</td><td>${b}</td><td>${num(sum)} ${sum>=st.th?'≥':'<'} ${num(st.th)}</td><td>${y}</td><td>${t[i]}</td><td>${y===t[i]?'맞음':'틀림'}</td></tr>`}).join('');
    const right=INPUTS.filter((_,i)=>out(i)===t[i]).length;fix.disabled=right===4;
    ui.say(right===4?`네 가지 입력을 모두 맞혔습니다.${st.steps?` 틀린 입력으로 가중치를 ${st.steps}번 고쳤습니다.`:''}`
     :st.p==='xor'&&(st.steps>=6||st.tries>=10)?'어떤 값을 골라도 틀린 입력이 남습니다. 직선 하나로는 XOR의 두 종류를 나눌 수 없기 때문입니다.'
     :`네 가지 가운데 ${right}가지를 맞혔습니다. 값을 직접 바꾸거나 틀린 입력으로 가중치를 고쳐 보세요.`,right===4?'good':st.p==='xor'&&(st.steps>=6||st.tries>=10)?'bad':'');
   }
   ui.body.addEventListener('input',e=>{const k=e.target.dataset.k;if(k){st[k]=Number(e.target.value);st.tries++;draw()}});
   ui.body.addEventListener('click',e=>{const b=e.target.closest('#s21-prob .md-chip');if(b){st.p=b.dataset.p;st.steps=st.tries=st.next=0;draw()}});
   draw();
  }});

 // A small rule base for a made-up classroom projector. Rule 5 is the one the learner adds.
 const FACTS=['전원 표시등이 꺼져 있다','전원 케이블이 빠져 있다','화면에 신호 없음이 뜬다','화면이 흐릿하다','타는 냄새가 난다'];
 const RULES=[{need:[0],mid:'전원 공급 이상'},{need:['전원 공급 이상',1],say:'전원 케이블을 다시 꽂는다'},{need:[2],say:'영상 케이블과 입력 선택을 확인한다'},{need:[3],say:'초점 조절 링을 돌려 맞춘다'},{need:[4],say:'전원 케이블을 뽑고 사용을 멈춘다',extra:true}];
 const ruleText=c=>typeof c==='number'?FACTS[c]:c;
 L.add('expertSystem','custom',{
  hint:'교실 프로젝터 고장을 진단하는 전문가 시스템입니다. 증상을 고르면 <b>추론 엔진</b>이 지식 베이스의 규칙을 적용합니다. 규칙은 활동용 예시입니다.',
  body:`<div class="md-split" style="--split:1fr 1.1fr 1.35fr"><div class="md-panel"><h3>사용자가 고른 증상</h3><div class="s21-facts">${FACTS.map((f,i)=>`<button type="button" class="s21-fact" data-i="${i}"><i></i>${f}</button>`).join('')}</div></div>
   <div class="md-panel"><h3>추론 엔진이 적용한 규칙</h3><ol class="s21-trace"></ol><div class="s21-out"></div></div>
   <div class="md-panel"><h3 id="s21-kb"></h3><ul class="md-list s21-rules"></ul></div></div>`,
  state:()=>({facts:[0,1],extra:false}),
  render(ui,st,reset){
   const add=ui.action('타는 냄새 규칙 추가',()=>{st.extra=true;draw()},true);ui.action('처음부터',reset);
   function infer(){ // Forward chaining: keep applying rules whose conditions are all known.
    const known=new Set(st.facts),fired=[];let again=true;
    while(again){again=false;RULES.forEach((r,i)=>{if(r.extra&&!st.extra||fired.includes(i)||!r.need.every(c=>known.has(c)))return;fired.push(i);if(r.mid)known.add(r.mid);again=true})}
    return fired;
   }
   function draw(){
    const fired=infer(),advice=fired.filter(i=>RULES[i].say),clash=fired.includes(1)&&fired.includes(4),rules=RULES.filter(r=>!r.extra||st.extra);
    ui.all('.s21-fact').forEach((b,i)=>{const on=st.facts.includes(i);b.setAttribute('aria-pressed',String(on));b.querySelector('i').textContent=on?'✓':''});
    ui.q('.s21-trace').innerHTML=fired.map((i,n)=>`<li>${n+1}. 규칙 ${i+1} 적용: ${RULES[i].mid?`${RULES[i].mid}(중간 결론)`:'조언을 찾음'}</li>`).join('')||'<li>적용한 규칙이 없습니다.</li>';
    const box=ui.q('.s21-out');box.dataset.tone=clash||st.facts.length&&!advice.length?'bad':advice.length?'good':'';
    box.innerHTML=advice.length?`<b>${clash?'조언이 서로 충돌함':'조언'}</b>${advice.map(i=>esc(RULES[i].say)).join('<br>')}`:st.facts.length?`<b>판단하지 못함</b>${fired.length?'전원 공급 이상까지만 추론했고 조언을 줄 규칙이 없습니다.':'고른 증상에 맞는 규칙이 없습니다.'}`:'<b>증상 없음</b>증상을 하나 이상 고르세요.';
    ui.q('#s21-kb').textContent=`지식 베이스 (규칙 ${rules.length}개)`;
    ui.q('.s21-rules').innerHTML=rules.map((r,i)=>`<li data-on="${fired.includes(i)}"><b>규칙 ${i+1}</b><span>조건: ${r.need.map(ruleText).join(' + ')}</span><span>결론: ${r.mid||'조언, '+r.say}</span></li>`).join('');
    add.disabled=st.extra;
    ui.say(clash?'규칙 2는 케이블을 꽂으라 하고 규칙 5는 뽑으라고 합니다. 규칙이 늘수록 서로 충돌하기 쉽습니다.'
     :advice.length?`규칙 ${fired.length}개를 차례로 적용해 조언 ${advice.length}가지를 찾았습니다. 다른 증상도 골라 보세요.`
     :st.facts.length?'규칙 밖의 상황은 판단하지 못합니다. 사람이 새 규칙을 써 넣어야 합니다.':'왼쪽에서 증상을 눌러 고르세요.',clash||st.facts.length&&!advice.length?'bad':'');
   }
   ui.body.addEventListener('click',e=>{const b=e.target.closest('.s21-fact');if(!b)return;const i=Number(b.dataset.i);st.facts=st.facts.includes(i)?st.facts.filter(n=>n!==i):[...st.facts,i];draw()});
   draw();
  }});

 // Positions to look at when every move is searched, and when a learned network keeps only a few candidate moves.
 const MOVES=[5,10,20,30,50,100,200],KEEP=[0,20,10,5,3],SPEED=2e8;
 const big=n=>{
  if(n<1e4)return Math.round(n).toLocaleString('ko-KR');if(n>=1e20)return `10의 ${Math.floor(Math.log10(n))}제곱`;
  const [name,unit]=[['경',1e16],['조',1e12],['억',1e8],['만',1e4]].find(u=>n>=u[1]),x=n/unit;
  return `약 ${x>=100?Math.round(x).toLocaleString('ko-KR'):x>=10?Math.round(x):Math.round(x*10)/10}${name}`;
 };
 const many=n=>big(n)+(n<1e4?'개':' 개');
 const span=n=>{const s=n/SPEED;if(s<1)return '1초 미만';const [unit,size]=s<60?['초',1]:s<3600?['분',60]:s<86400?['시간',3600]:s<31536000?['일',86400]:['년',31536000],v=big(s/size);return `${v.startsWith('약')||v.startsWith('10')?v:'약 '+v}${/\d$/.test(v)?'':' '}${unit}`};
 L.add('searchRange','custom',{
  hint:'<b>모든 수를 탐색</b>할 때와 <b>신경망이 추린 후보만 탐색</b>할 때의 국면 수를 비교합니다. 수의 개수는 원리를 보기 위한 예시 값입니다.',
  body:`<div class="md-split" style="--split:1.35fr 1fr"><div class="md-panel"><h3>깊이마다 살펴볼 국면 수</h3><svg class="s21-chart" viewBox="0 0 600 330" role="img" aria-label="내다보는 깊이에 따라 늘어나는 국면 수 막대 그래프"></svg>
   <div class="s21-legend"><span><i data-k="all"></i>모든 수를 탐색</span><span><i data-k="few"></i>추린 후보만 탐색</span><span>점선: 1초에 약 2억 개씩 평가할 때의 분량</span></div></div>
   <div class="md-panel"><label class="md-slider s21-wide">한 번에 둘 수 있는 수<input type="range" data-k="bi" min="0" max="${MOVES.length-1}" step="1"><output></output></label>
   <label class="md-slider s21-wide">내다보는 깊이<input type="range" data-k="d" min="1" max="12" step="1"><output></output></label>
   <label class="md-slider s21-wide">신경망이 추린 후보<input type="range" data-k="ki" min="0" max="${KEEP.length-1}" step="1"><output></output></label>
   <ul class="md-list" id="s21-search"></ul><ul class="md-list" style="margin-top:auto;font-size:.8em"><li><b>딥블루</b><span>빠른 탐색과 사람이 설계한 평가 규칙</span></li><li><b>알파고</b><span>학습한 신경망으로 탐색할 범위를 줄임</span></li></ul>
   <div style="font-size:.78em;color:#52607f">평가 속도는 딥블루의 1초 약 2억 개로 계산했습니다.</div></div></div>`,
  state:()=>({bi:3,d:6,ki:0}),
  render(ui,st,reset){
   ui.action('처음 값으로',reset);
   function draw(){
    const b=MOVES[st.bi],k=KEEP[st.ki]?Math.min(KEEP[st.ki],b):0,all=b**st.d,few=k?k**st.d:0,Yv=v=>290-v/30*265,ticks=[[0,'1'],[4,'1만'],[8,'1억'],[12,'1조'],[16,'1경'],[20,'10의 20제곱'],[24,'10의 24제곱'],[28,'10의 28제곱']];
    const marks=[[Math.log10(SPEED),'1초'],[Math.log10(SPEED*86400),'하루'],[Math.log10(SPEED*31536000),'1년']];
    let bars='';for(let i=1;i<=12;i++){const x=118+(i-1)*39;bars+=`<text x="${x+11}" y="308" text-anchor="middle" font-size="13" fill="#52607f">${i}</text>`;if(i>st.d)continue;
     bars+=`<rect x="${x}" y="${Yv(i*Math.log10(b))}" width="${k?11:22}" height="${290-Yv(i*Math.log10(b))}" fill="#3f5dae"/>`+(k?`<rect x="${x+11}" y="${Yv(i*Math.log10(k))}" width="11" height="${290-Yv(i*Math.log10(k))}" fill="#f0a202"/>`:'')}
    ui.q('.s21-chart').innerHTML=ticks.map(([v,t])=>`<line x1="108" x2="592" y1="${Yv(v)}" y2="${Yv(v)}" stroke="#e3e8f5"/><text x="102" y="${Yv(v)+4}" text-anchor="end" font-size="12" fill="#52607f">${t}</text>`).join('')
     +marks.map(([v,t])=>`<line x1="108" x2="592" y1="${Yv(v)}" y2="${Yv(v)}" stroke="#c2413b" stroke-dasharray="5 4"/><text x="590" y="${Yv(v)-4}" text-anchor="end" font-size="12" fill="#b5372f">${t}</text>`).join('')
     +bars+`<line x1="108" x2="592" y1="290" y2="290" stroke="#9fb0dc"/><text x="350" y="326" text-anchor="middle" font-size="13" fill="#52607f">내다보는 깊이(몇 수 앞)</text>`;
    ui.all('.md-slider input').forEach(n=>{n.value=st[n.dataset.k];n.nextElementSibling.textContent=n.dataset.k==='bi'?b+'가지':n.dataset.k==='d'?st.d+'수 앞':k?k+'가지':'추리지 않음'});
    ui.q('#s21-search').innerHTML=[['모든 수를 탐색할 때',many(all)],['걸리는 시간',span(all)],...(k?[['추린 후보만 탐색할 때',many(few)],['걸리는 시간',span(few)]]:[])].map(([a,v])=>`<li><span>${a}</span><b>${v}</b></li>`).join('');
    ui.say(k?(k<b?`모든 수를 탐색하면 ${span(all)}, 후보 ${k}가지만 탐색하면 ${span(few)}입니다. 학습한 신경망이 탐색할 범위를 줄입니다.`:'추린 후보가 둘 수 있는 수보다 적어야 탐색할 범위가 줄어듭니다.')
     :`한 수 더 내다볼 때마다 국면 수가 ${b}배로 늘어납니다. ${st.d}수 앞까지 모두 평가하는 데 걸리는 시간은 ${span(all)}입니다.`,k&&k<b?'good':'');
   }
   ui.body.addEventListener('input',e=>{const key=e.target.dataset.k;if(key){st[key]=Number(e.target.value);draw()}});draw();
  }});

 // The saved prediction comes back with the real years; the learner moves the cards into place.
 const fresh=()=>{const m=stored(),order=m?[...m.order]:[...DEALT];return {order,start:[...order],unsure:m?m.unsure:null,marks:m?[...m.marks]:null,moves:0,pick:null}};
 L.add('timelineCheck','custom',{
  hint:'앞에서 놓은 예상 연표입니다. 실제 연도를 보고 카드 두 장을 차례로 눌러 <b>제자리로 옮깁니다</b>.',
  body:`<div class="md-axis"><span>1950년</span><i></i><span>2022년</span></div><div class="s21-line"></div><div class="s21-gaps"></div><ul class="md-list s21-sum"></ul>`,
  state:fresh,
  render(ui,st,reset){
   if(!st.moves)Object.assign(st,fresh());
   ui.action('다시 하기',reset);
   const placed=order=>order.filter((e,pos)=>e===pos).length;
   function draw(){
    const done=placed(st.order)===8,first=placed(st.start);
    ui.q('.s21-line').innerHTML=st.order.map((e,pos)=>`<div class="s21-slot"><button type="button" class="md-step" data-pos="${pos}" data-result="${e===pos?'right':'wrong'}" aria-pressed="${st.pick===pos}" ${done?'disabled':''}><span>${EVENTS[e][0]}</span><b>${EVENTS[e][1]}</b><small>${EVENTS[e][2]}</small></button>
     <span class="s21-tag">${st.unsure===e?'자신 없음':''}</span></div>`).join('');
    ui.q('.s21-gaps').innerHTML=(st.marks&&st.marks.some(Boolean)?`<span class="s21-rowname">내가 예상한 기대와 실망의 시기</span>${gapRow(st.marks,true)}`:'')
     +(done?`<span class="s21-rowname">실제로 기대가 컸던 시기와 두 번의 겨울</span><span class="s21-band" data-m="1" style="grid-column:1/span 5">1950~60년대, 곧 사람 수준의 기계가 나온다</span><span class="s21-band" data-m="2" style="grid-column:6/span 2">첫 번째 겨울</span>
      <span class="s21-band" data-m="2" style="grid-column:8/span 2">두 번째 겨울</span><span class="s21-band" data-m="1" style="grid-column:11/span 6">2010년대 이후, 데이터로 배우면 무엇이든 된다</span><span class="s21-band" data-m="1" style="grid-column:5/span 6">1980년대, 전문가의 지식을 담으면 된다</span>`
      :'<span class="s21-rowname">카드를 모두 제자리에 놓으면 기대가 컸던 시기와 두 번의 겨울이 나타납니다.</span>');
    ui.q('.s21-sum').innerHTML=[['처음부터 제자리였던 카드',first+'장'],['카드를 옮긴 횟수',st.moves+'번'],['자신 없다고 한 카드',st.unsure===null?'기록 없음':`${EVENTS[st.unsure][1]}, ${st.start[st.unsure]===st.unsure?'제자리였음':'자리가 달랐음'}`]].map(([a,b])=>`<li><span>${a}</span><b>${b}</b></li>`).join('');
    ui.say(done?(st.moves?`연표를 완성했습니다. 처음에는 ${first}장이 제자리였고 ${st.moves}번 옮겼습니다. 어떤 카드가 가장 헷갈렸나요?`:'처음 예상이 실제 순서와 같습니다. 가장 망설인 카드는 무엇이었나요?')
     :st.pick!==null?'바꿀 자리의 카드를 누르세요.':`여덟 장 중 ${placed(st.order)}장이 제자리입니다. 자리를 바꿀 카드 두 장을 차례로 누르세요.`,done?'good':'');
   }
   ui.body.addEventListener('click',e=>{
    const card=e.target.closest('.md-step');if(!card||card.disabled)return;const pos=Number(card.dataset.pos);
    if(st.pick===null)st.pick=pos;else{if(st.pick!==pos){[st.order[st.pick],st.order[pos]]=[st.order[pos],st.order[st.pick]];st.moves++}st.pick=null}
    draw();
   });
   draw();
  }});

 L.add('factorSort','sort',{hint:'2010년대 이후의 발전을 이끈 아홉 가지를 <b>데이터</b>, <b>알고리즘</b>, <b>컴퓨팅</b> 세 요인으로 나누어 봅니다.',
  bins:[{id:'data',label:'데이터'},{id:'algo',label:'알고리즘'},{id:'compute',label:'컴퓨팅'}],cards:[
  {id:'a',label:'인터넷과 스마트폰이 만든 대규모 자료',answer:'data',why:'인터넷, 스마트폰, 센서가 만든 대규모 데이터입니다.'},
  {id:'b',label:'역전파',answer:'algo',why:'다층 신경망을 학습시키는 방법이므로 알고리즘입니다.'},
  {id:'c',label:'GPU 두 개로 대규모 신경망 학습',answer:'compute',why:'2012년 이미지넷 대회에서 달라진 컴퓨팅 요인입니다.'},
  {id:'d',label:'약 120만 장의 이름표 붙은 학습용 사진',answer:'data',why:'2012년 이미지넷 대회의 데이터 요인입니다.'},
  {id:'e',label:'합성곱 신경망',answer:'algo',why:'이미지 분류 오류를 크게 줄인 신경망 구조이므로 알고리즘입니다.'},
  {id:'f',label:'클라우드의 대규모 병렬 계산',answer:'compute',why:'GPU와 클라우드의 대규모 병렬 계산은 컴퓨팅입니다.'},
  {id:'g',label:'트랜스포머',answer:'algo',why:'단어들의 관계를 한꺼번에 계산하는 신경망 구조이므로 알고리즘입니다.'},
  {id:'h',label:'센서가 모은 기록',answer:'data',why:'센서가 만든 대규모 데이터입니다.'},
  {id:'i',label:'과적합을 줄이는 기법',answer:'algo',why:'2012년 이미지넷 대회의 알고리즘 요인입니다.'}]});

 L.add('lifeMatch','match',{hint:'생활 속 여섯 사례에서 AI가 <b>무엇을 입력받아 무엇을 내놓는지</b> 짝지어 봅니다.',leftTitle:'사례',rightTitle:'입력받는 것과 내놓는 것',seed:13,pairs:[
  {left:'스마트 스피커',right:'사용자의 말을 글로 바꾸고 음악 재생이나 날씨 안내로 답함'},
  {left:'자율주행차',right:'카메라, 레이더, 라이다로 주변을 인식해 속도와 방향을 정함'},
  {left:'의료 영상 판독 지원',right:'엑스레이, CT 영상에서 의심 부위를 표시함'},
  {left:'알파폴드',right:'아미노산 서열에서 단백질의 입체 구조를 예측함'},
  {left:'AI 펭톡',right:'영어 말하기를 음성 인식으로 진단해 발음과 표현에 피드백을 줌'},
  {left:'반자동 오프사이드',right:'카메라 12대와 공 속 센서로 선수와 공의 움직임을 추적함'}]});

 // Two criteria from the slide become the axes; the sum of the two levels decides the group.
 const JOBS=[['안내문 번역 초안',['ai'],'슬라이드의 예시에서 AI에게 맡길 일입니다. 반복적이고 결과 확인이 쉽습니다.'],['공지문 초안 작성',['ai','both'],'초안 작성은 AI가 도울 수 있는 일입니다. 내보내기 전에 교사가 확인합니다.'],
  ['수준별 연습 문제 구성',['both'],'슬라이드의 예시에서 함께할 일입니다. AI가 제안하고 교사가 검토합니다.'],['채점 보조와 오류 유형 정리',['both'],'AI가 채점을 보조하고 성취 판단과 결과에 대한 책임은 교사에게 있습니다.'],
  ['성취 판단',['teacher'],'슬라이드의 예시에서 교사가 해야 할 일입니다. 결과에 대한 책임이 필요합니다.'],['학생 상담',['teacher'],'슬라이드의 예시에서 교사가 해야 할 일입니다. 관계와 가치가 필요합니다.']];
 const ZONES={ai:['AI에게 맡길 일','반복적이고 결과 확인이 쉬움'],both:['함께할 일','AI가 제안하고 교사가 검토'],teacher:['교사가 해야 할 일','관계, 가치, 책임이 필요함']},zoneOf=(x,y)=>x+y<=1?'ai':x+y===2?'both':'teacher';
 L.add('roleMap','custom',{
  hint:'과업 여섯 가지를 <b>결과의 영향</b>과 <b>오류 확인의 쉬움</b>에 따라 판에 놓습니다. 놓인 칸이 세 묶음 가운데 하나를 정합니다. 칸의 구분은 활동용 예시입니다.',
  body:`<div class="md-split" style="--split:1.5fr 1fr"><div class="s21-plane"><span class="s21-ylab">결과의 영향</span>
   ${[2,1,0].map(y=>`<span class="s21-tick">${['작음','보통','큼'][y]}</span>${[0,1,2].map(x=>`<div class="s21-cell" role="button" tabindex="0" data-x="${x}" data-y="${y}" data-zone="${zoneOf(x,y)}" data-name="${ZONES[zoneOf(x,y)][0]}"></div>`).join('')}`).join('')}
   <span></span><span></span>${['쉬움','보통','어려움'].map(t=>`<span class="s21-tick">${t}</span>`).join('')}<span></span><span></span><span class="s21-xlab">오류 확인</span></div>
   <div class="md-panel"><h3>놓을 과업</h3><div class="md-chips" id="s21-jobs"></div><ul class="md-list" id="s21-zones"></ul>
   <div style="margin-top:auto;font-size:.78em;color:#52607f">학생 개인정보가 들어가는 과업은 AI에 입력하기 전에 학교의 기준을 먼저 확인합니다.</div></div></div>`,
  state:()=>({at:{},pick:null,checked:false,why:''}),
  render(ui,st,reset){
   const zone=i=>st.at[i]?zoneOf(...st.at[i]):null,same=i=>JOBS[i][1].includes(zone(i));
   const check=ui.action('예시와 비교',()=>{
    if(JOBS.some((_,i)=>!st.at[i])){ui.say('과업을 모두 놓은 뒤 비교하세요.','bad');return}
    st.checked=true;st.pick=null;st.why='';draw();
   },true);
   ui.action('다시 하기',reset);
   const chip=i=>`<button type="button" class="md-chip s21-task" data-i="${i}" ${st.checked?`data-result="${same(i)?'right':'wrong'}"`:`aria-pressed="${st.pick===i}"`}>${JOBS[i][0]}</button>`;
   function draw(){
    ui.all('.s21-cell').forEach(c=>{c.innerHTML=JOBS.map((_,i)=>st.at[i]&&st.at[i][0]===Number(c.dataset.x)&&st.at[i][1]===Number(c.dataset.y)?chip(i):'').join('')});
    ui.q('#s21-jobs').innerHTML=JOBS.map((_,i)=>st.at[i]?'':chip(i)).join('')||'<span style="font-size:.84em;color:#6b7896">과업을 모두 놓았습니다.</span>';
    const count=z=>JOBS.filter((_,i)=>zone(i)===z).length;
    ui.q('#s21-zones').innerHTML=Object.entries(ZONES).map(([z,[name,note]])=>`<li style="display:grid;grid-template-columns:1fr auto;gap:.05em 1em"><b>${name}</b><b>${count(z)}가지</b><span style="grid-column:1/-1;font-size:.88em">${note}</span></li>`).join('');
    check.disabled=st.checked;
    const left=JOBS.filter((_,i)=>!st.at[i]).length;
    ui.say(st.checked?(st.why||`여섯 가지 중 ${JOBS.filter((_,i)=>same(i)).length}가지가 슬라이드의 예시와 같은 묶음입니다. 과업을 누르면 예시의 근거가 나옵니다.`)
     :st.pick!==null?`'${JOBS[st.pick][0]}' 과업을 놓을 칸을 누르세요.`:left?'과업을 누른 다음 놓을 칸을 누르세요. 놓은 과업도 다시 눌러 옮길 수 있습니다.':'여섯 가지를 모두 놓았습니다. 예시와 비교해 보세요.',st.checked&&!st.why?'good':'');
   }
   const act=e=>{
    const task=e.target.closest('.s21-task'),cell=e.target.closest('.s21-cell');
    // A chip that already lies in a cell counts as that cell while another task is being carried.
    if(task&&(st.checked||st.pick===null||!cell||Number(task.dataset.i)===st.pick)){const i=Number(task.dataset.i);if(st.checked)st.why=`${JOBS[i][0]}: ${JOBS[i][2]}`;else st.pick=st.pick===i?null:i;draw();return}
    if(cell&&st.pick!==null&&!st.checked){
     const x=Number(cell.dataset.x),y=Number(cell.dataset.y);
     if(JOBS.filter((_,i)=>i!==st.pick&&st.at[i]&&st.at[i][0]===x&&st.at[i][1]===y).length>=4){ui.say('한 칸에는 네 가지까지 놓을 수 있습니다. 조건이 조금 다른 과업은 옆 칸에 놓아 보세요.','bad');return}
     st.at[st.pick]=[x,y];st.pick=null;draw();
    }
   };
   ui.body.addEventListener('click',act);ui.body.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.classList.contains('s21-cell'))act(e)});
   draw();
  }});
})();
