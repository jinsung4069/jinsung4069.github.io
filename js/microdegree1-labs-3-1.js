/* 3주차 오전, 기계학습과 인공신경망의 기본 원리: activity slides. Numbers follow the slides they come after; toy data is named as an example in each hint. */
(()=>{
 'use strict';
 const L=window.ceLabs;if(!L)return;const esc=L.esc,R=v=>Math.round(v*100)/100,pct=(a,b)=>Math.round(a/b*100);
 L.style(`.md-lab .s31-plot{flex:1;min-height:0;position:relative}.md-lab .s31-plot svg{position:absolute;inset:0;width:100%;height:100%}
.md-lab .s31-plot text{font-family:inherit;fill:#52607f}
.md-lab .s31-table{margin-top:0}.md-lab .s31-table th,.md-lab .s31-table td{font-size:inherit}
.md-lab .s31-row{flex:none;display:flex;align-items:center;gap:.9em;font-size:.9em}.md-lab .s31-row .md-chip{font-size:.95em;padding:.2em 1em}
.md-lab .s31-mail th:first-child{width:3.2em;text-align:center}.md-lab .s31-mail td:nth-child(n+3){width:7em}.md-lab .s31-mail .s31-new td:nth-child(2)::before{content:'새 메일 ';color:#b36b00;font-weight:800}
.md-lab .s31-wide{grid-template-columns:auto 1fr 4.4em}
.md-lab .md-body .s31-note{font-size:.82em;color:#52607f}
.md-lab .s31-fit{flex:none;display:grid;grid-template-columns:auto 13em 9em 1fr;align-items:center;gap:.8em;font-size:.9em}.md-lab .s31-fit output{font-weight:800;color:#2c478f}
.md-lab .s31-cm{flex:none;font-size:.86em}.md-lab .s31-cm td:nth-child(n+2){width:auto;text-align:center}.md-lab .s31-cm td b{font-size:1.25em}
.md-lab .s31-pc{table-layout:fixed}.md-lab .s31-pc th:first-child{width:8.6em}.md-lab .s31-pc td:nth-child(2){width:13em}.md-lab .s31-pc td:nth-child(n+3){width:auto}.md-lab .s31-pc td:last-child{width:6em;font-weight:800;color:#2c478f}
.md-lab .s31-ctl{display:grid;grid-template-columns:1fr 4.8em;align-items:center;gap:.5em}.md-lab .s31-ctl output{font-weight:800;color:#2c478f;text-align:right;white-space:nowrap}
.md-lab .s31-pc .s31-sum th,.md-lab .s31-pc .s31-sum td{background:#fff7df}
.md-lab .s31-lm{table-layout:fixed;font-size:.84em}.md-lab .s31-lm thead th{white-space:normal;padding:.3em .2em}.md-lab .s31-lm td,.md-lab .s31-lm td:nth-child(n+3){width:auto;text-align:center}.md-lab .s31-lm th:first-child{width:4.6em;text-align:center}
.md-lab .s31-lm .s31-next th,.md-lab .s31-lm .s31-next td:not([data-result]){background:#fff7df}
.md-lab .s31-pts{display:grid;grid-template-columns:1fr 1fr;gap:.35em;font-size:.84em}.md-lab .s31-pts span{padding:.2em .6em;border:1px solid #d5ddf1;border-radius:.4em;background:#fff}
.md-lab .s31-check{display:flex;align-items:center;gap:.5em;font-size:.9em;cursor:pointer}
.md-lab .s31-tok{flex:1;display:grid;grid-template-columns:7.2em 1fr 1fr;align-items:center;align-content:space-evenly;gap:.5em 1em;font-size:1.05em}.md-lab .s31-tok>span{color:#52607f;font-size:.86em}
.md-lab .s31-bar{display:grid;grid-template-columns:1fr 3.6em;align-items:center;gap:.5em}.md-lab .s31-bar span{font-weight:800;color:#2c478f;text-align:right}.md-lab .s31-bar .s31-hit{background:#f0a202}
.md-lab .md-body .s31-lead{padding:.45em .8em;border:1px solid #b9c6e6;border-radius:.5em;background:#fff;font-size:1.15em;font-weight:800}.md-lab .s31-lead i{font-style:normal;color:#b36b00}`);

 // Slide 3's six mail titles. A rule is "the title contains one of the chosen words". The second set arrives later and breaks rules tuned to the first.
 const MAILS=[['[무료] 당첨을 축하합니다! 지금 확인하세요',1],['3월 학부모 총회 일정 안내',0],['무료 급식 신청서 제출 안내',0],['계정이 잠겼습니다. 링크에서 본인 인증',1],['무.료 쿠.폰 지급 이벤트',1],['연수 자료 공유드립니다(첨부 1건)',0]];
 const MORE=[['학교 축제 이벤트 참가 신청 안내',0],['당.첨 안내, 상품 수령은 여기서',1],['연수 이수 인증서 발급 링크 안내',0],['택배 주소 오류, 지금 수정하세요',1]];
 const WORDS=['무료','당첨','링크','인증','쿠폰','이벤트'];
 L.add('s31SpamRules','custom',{
  hint:'제목에 <b>고른 낱말</b>이 있으면 스팸으로 거르는 규칙을 만들어 여섯 통에 적용합니다. 메일과 스팸 여부는 모두 설명을 위해 만든 예시입니다.',
  body:`<div class="s31-row"><span>만약 제목에 이 낱말이 있으면 스팸</span><div class="md-chips">${WORDS.map(w=>`<button type="button" class="md-chip" data-w="${w}">${w}</button>`).join('')}</div></div>
   <table class="md-check s31-table s31-mail"><thead><tr><th>번호</th><th>메일 제목(예시)</th><th>실제</th><th>규칙의 판단</th><th>결과</th></tr></thead><tbody></tbody></table>`,
  state:()=>({words:['무료'],more:false}),
  render(ui,st,reset){
   const more=ui.action('새 메일 받기',()=>{st.more=true;draw()},true);ui.action('처음부터',reset);
   const judge=m=>st.words.some(w=>m[0].includes(w))?1:0,tally=list=>({ok:list.filter(m=>judge(m)===m[1]).length,block:list.filter(m=>judge(m)&&!m[1]).length,miss:list.filter(m=>!judge(m)&&m[1]).length});
   function draw(){
    ui.all('.md-chip').forEach(b=>b.setAttribute('aria-pressed',String(st.words.includes(b.dataset.w))));
    ui.q('.s31-mail tbody').innerHTML=(st.more?[...MAILS,...MORE]:MAILS).map((m,i)=>{const p=judge(m),ok=p===m[1];
     return `<tr${i>=MAILS.length?' class="s31-new"':''}><th scope="row">${i+1}</th><td>${esc(m[0])}</td><td>${m[1]?'스팸':'정상'}</td><td>${p?'스팸':'정상'}</td><td data-result="${ok?'right':'wrong'}">${ok?'맞음':p?'잘못 막음':'놓침'}</td></tr>`}).join('');
    more.disabled=st.more;const a=tally(MAILS),b=tally(MORE);
    if(st.more)ui.say(`처음 여섯 통은 ${a.ok}통, 새 메일 네 통은 ${b.ok}통을 맞혔습니다. 예외가 생길 때마다 사람이 규칙을 다시 고쳐야 합니다.`,a.ok+b.ok===10?'good':'');
    else if(a.ok===6)ui.say("여섯 통을 모두 맞혔습니다. 이 규칙이 다른 메일에도 통할까요? '새 메일 받기'로 확인합니다.",'good');
    else ui.say(`여섯 통 중 ${a.ok}통을 맞혔습니다. 잘못 막은 정상 메일 ${a.block}통, 놓친 스팸 ${a.miss}통입니다. 낱말을 바꿔 규칙을 고쳐 보세요.`);
   }
   ui.body.addEventListener('click',e=>{const b=e.target.closest('.md-chip');if(!b)return;const w=b.dataset.w;st.words=st.words.includes(w)?st.words.filter(v=>v!==w):[...st.words,w];draw()});draw();
  }});

 // Loss (w-3)^2 on one weight. One step is w - width * slope, the update written on the slide's figure.
 const loss=w=>(w-3)**2,far=w=>Math.abs(w-3)>5,LIMIT=30;
 L.add('s31Descent','custom',{
  hint:'가로축은 가중치, 세로축은 손실입니다. <b>한 번에 바꾸는 폭</b>을 정하고 손실이 줄어드는 쪽으로 한 걸음씩 옮겨 봅니다. 곡선과 수치는 이 활동을 위해 만든 예시입니다.',
  body:`<div class="md-split" style="--split:1.5fr 1fr"><div class="md-panel"><div class="s31-plot" id="s31-gd"></div></div>
   <div class="md-panel"><h3>지금 위치</h3><ul class="md-list" id="s31-gd-now"></ul><label class="md-slider s31-wide">한 번에 바꾸는 폭<input type="range" id="s31-gd-rate" min="1" max="11" step="1"><output></output></label>
   <p class="s31-note">새 가중치 = 가중치 - 폭 × 기울기</p><p id="s31-gd-calc" style="font-size:.88em"></p></div></div>`,
  state:()=>({rate:1,path:[0]}),
  render(ui,st,reset){
   const X=w=>50+(w+2)*49,Y=v=>330-v*12.4,now=()=>st.path[st.path.length-1],over=()=>loss(now())<.005||far(now())||st.path.length>LIMIT;
   function step(){if(over())return;const w=now();st.path.push(Math.round((w-st.rate/10*2*(w-3))*1e4)/1e4)}
   const one=ui.action('한 걸음',()=>{step();draw()},true),ten=ui.action('열 걸음',()=>{for(let i=0;i<10;i++)step();draw()});ui.action('처음부터',reset);
   function draw(){
    const w=now(),n=st.path.length-1,rate=st.rate/10,slope=2*(w-3);
    let curve='';for(let i=0;i<=100;i++){const v=-2+i/10;curve+=`${i?'L':'M'}${X(v).toFixed(1)} ${Y(loss(v)).toFixed(1)}`}
    const seen=st.path.filter(v=>!far(v)),ticks=[-2,0,2,4,6,8].map(v=>`<text x="${X(v)}" y="350" font-size="14" text-anchor="middle">${v}</text>`).join('')+[0,5,10,15,20,25].map(v=>`<text x="42" y="${Y(v)+5}" font-size="14" text-anchor="end">${v}</text>`).join('');
    ui.q('#s31-gd').innerHTML=`<svg viewBox="0 0 560 376" role="img" aria-label="가중치에 따른 손실 곡선과 지금 위치"><path d="M50 20V330H540" fill="none" stroke="#9fb0dc" stroke-width="1.5"/>${ticks}
     <text x="295" y="372" font-size="15" text-anchor="middle">가중치</text><text x="16" y="175" font-size="15" text-anchor="middle" transform="rotate(-90 16 175)">손실</text>
     <path d="M${X(3)} 330V${Y(0)-34}" stroke="#1f8a5b" stroke-dasharray="5 4"/><text x="${X(3)}" y="${Y(0)-42}" font-size="13" text-anchor="middle" style="fill:#16794c">손실이 가장 작은 곳</text>
     <path d="${curve}" fill="none" stroke="#3f5dae" stroke-width="3"/><polyline points="${seen.map(v=>`${X(v).toFixed(1)},${Y(loss(v)).toFixed(1)}`).join(' ')}" fill="none" stroke="#f0a202" stroke-width="2"/>
     ${seen.slice(0,-1).map(v=>`<circle cx="${X(v).toFixed(1)}" cy="${Y(loss(v)).toFixed(1)}" r="4.5" fill="#f0a202"/>`).join('')}${far(w)?'':`<circle cx="${X(w).toFixed(1)}" cy="${Y(loss(w)).toFixed(1)}" r="9" fill="#1c2c4c" stroke="#fff" stroke-width="2"/>`}</svg>`;
    ui.q('#s31-gd-now').innerHTML=[['걸음 수',n+'걸음'],['가중치',R(w)],['손실',R(loss(w))],['발밑의 기울기',R(slope)]].map(([a,b])=>`<li><span>${a}</span><b>${b}</b></li>`).join('');
    ui.q('#s31-gd-rate').value=st.rate;ui.q('#s31-gd-rate').nextElementSibling.textContent=rate;
    const prev=n?st.path[n-1]:null;ui.q('#s31-gd-calc').textContent=n?`방금 걸음: ${R(prev)} - ${rate} × (${R(2*(prev-3))}) = ${R(w)}`:`다음 걸음: ${R(w)} - ${rate} × (${R(slope)}) = ${R(w-rate*slope)}`;
    one.disabled=ten.disabled=over();
    if(!n)ui.say("'한 걸음'을 누르면 발밑의 기울기를 보고 손실이 줄어드는 쪽으로 가중치를 옮깁니다.");
    else if(far(w))ui.say('폭이 너무 커서 걸을수록 손실이 커지다가 그래프 밖으로 벗어났습니다. 폭을 줄여 다시 해 보세요.','bad');
    else if(loss(w)<.005)ui.say(`${n}걸음 만에 손실이 0에 가까워졌습니다(0.005 미만). 폭을 바꾸어 걸음 수를 비교해 보세요.`,'good');
    else if(n>=LIMIT)ui.say(`${LIMIT}걸음을 걸어도 손실이 가장 작은 곳에 닿지 못했습니다. 폭을 바꾸어 보세요.`,'bad');
    else if(loss(w)>=loss(prev))ui.say('가장 낮은 곳을 건너뛰어 반대편 비탈로 넘어갔습니다. 손실이 줄지 않습니다.','bad');
    else ui.say(`손실이 ${R(loss(prev))}에서 ${R(loss(w))}까지 줄었습니다.${(prev-3)*(w-3)<0?' 가장 낮은 곳을 한 번 건너뛰었습니다.':''}`);
   }
   ui.q('#s31-gd-rate').addEventListener('input',e=>{st.rate=Number(e.target.value);st.path=[0];draw()});draw();
  }});

 // Three boundaries over the same points. ○ lies above the smooth curve; two training points and two new points are exceptions.
 const G=x=>.16*(x-5)**2+2.5,bump=(x,c,a)=>a*Math.exp(-((x-c)**2)/.5);
 const BOUNDS=[['직선','과소적합',()=>3.5],['완만한 곡선','적절한 적합',G],['구불구불한 곡선','과대적합',x=>G(x)+bump(x,5.2,4.5)+bump(x,8.3,-2)]];
 const TRAIN=[[3,6,1],[4,4.5,1],[3.6,4,1],[6,5.5,1],[7,6.5,1],[4.5,7.5,1],[6.5,8,1],[2.5,8.5,1],[8,7.5,1],[8.3,2.6,1],[.8,3,0],[.3,5.6,0],[3,1.2,0],[4.5,.8,0],[9.8,5.6,0],[7.5,1.8,0],[9.3,3,0],[.6,5.2,0],[9.6,4.8,0],[5.2,5.8,0]];
 const FRESH=[[3.5,5.5,1],[5,7,1],[6.3,3.8,1],[7,5,1],[4.8,5.2,1],[5.5,5.4,1],[2.8,7,1],[7.5,8.5,1],[4,3.6,1],[1.5,3,1],[1,2,0],[4,1.5,0],[7,2,0],[8.6,3.3,0],[8,3,0],[.4,4.5,0],[9.7,5,0],[.2,5.8,0],[9.2,4.6,0],[6.5,6,0]];
 const hit=(f,[x,y,c])=>(y>f(x)?1:0)===c;
 function fitPlot(points,f){
  const X=x=>20+x*27,Y=y=>235-y*22.5;let d='';
  for(let i=0;i<=100;i++){const x=i/10;d+=`${i?'L':'M'}${X(x).toFixed(1)} ${Y(Math.min(10,Math.max(0,f(x)))).toFixed(1)}`}
  return `<svg viewBox="0 0 310 245" role="img" aria-label="두 범주의 점과 분류 경계"><path d="${d}L290 10L20 10Z" fill="#eef2fb"/><rect x="20" y="10" width="270" height="225" fill="none" stroke="#9fb0dc"/><path d="${d}" fill="none" stroke="#3f5dae" stroke-width="2.5"/>
   ${points.filter(p=>!hit(f,p)).map(([x,y])=>`<circle cx="${X(x)}" cy="${Y(y)}" r="10.5" fill="#fdeceb" stroke="#c2413b" stroke-width="1.5"/>`).join('')}
   ${points.map(([x,y,c])=>c?`<circle cx="${X(x)}" cy="${Y(y)}" r="5.5" fill="#fff" stroke="#b36b00" stroke-width="2.2"/>`:`<path d="M${X(x)-5} ${Y(y)-5}l10 10m0 -10l-10 10" stroke="#16794c" stroke-width="2.4" fill="none"/>`).join('')}</svg>`;
 }
 L.add('s31Fit','custom',{
  hint:'같은 점들을 나누는 <b>경계의 복잡도</b>를 바꾸며 훈련 데이터와 새 데이터에서 맞힌 비율을 비교합니다. 점과 경계는 이 활동을 위해 만든 예시입니다.',
  body:`<label class="s31-fit">경계의 복잡도<input type="range" id="s31-fit-level" min="0" max="2" step="1"><output></output><span class="s31-note">○와 ×는 두 범주입니다. 빨간 동그라미는 경계가 틀리게 나눈 점입니다.</span></label>
   <div class="md-split">${['훈련 데이터 20개','새 데이터 20개'].map((t,i)=>`<div class="md-panel"><h3>${t}</h3><div class="s31-plot" data-set="${i}"></div><div class="s31-bar"><div class="md-meter"><i></i></div><span></span></div></div>`).join('')}</div>`,
  state:()=>({level:0}),
  render(ui,st,reset){
   ui.action('처음부터',reset);
   function draw(){
    const [name,kind,f]=BOUNDS[st.level],score=[TRAIN,FRESH].map(set=>set.filter(p=>hit(f,p)).length);
    ui.q('#s31-fit-level').value=st.level;ui.q('.s31-fit output').textContent=name;
    ui.all('.s31-plot').forEach((n,i)=>{n.innerHTML=fitPlot(i?FRESH:TRAIN,f);const bar=n.nextElementSibling;bar.querySelector('i').style.width=score[i]*5+'%';bar.querySelector('span').textContent=score[i]*5+'%'});
    const [a,b]=score.map(n=>n*5);
    ui.say(st.level===0?`${kind}: 경계가 너무 단순해 훈련 데이터도 ${a}%만 맞히고 새 데이터도 ${b}%에 그칩니다.`:st.level===1?`${kind}: 훈련 데이터 ${a}%, 새 데이터 ${b}%입니다. 처음 보는 데이터에서도 성능이 유지됩니다.`
     :`${kind}: 훈련 데이터의 예외 점까지 맞춰 ${a}%가 되었지만 새 데이터에서는 ${b}%로 떨어집니다.`,st.level===1?'good':'');
   }
   ui.q('#s31-fit-level').addEventListener('input',e=>{st.level=Number(e.target.value);draw()});draw();
  }});

 // 100 mails with a spam score. At the starting cut-off of 50 the four cells are the slide's 15, 5, 3 and 77.
 const SPAM=[20,30,35,40,45,50,55,55,60,65,65,70,75,75,80,85,85,90,95,95],NORMAL={5:14,10:14,15:12,20:10,25:9,30:7,35:5,40:4,45:2,50:1,55:1,65:1};
 const HAM=Object.entries(NORMAL).flatMap(([s,n])=>Array(n).fill(Number(s)));
 L.add('s31Threshold','custom',{
  hint:'스팸 점수가 <b>기준 점수</b> 이상인 메일을 스팸으로 예측합니다. 기준을 옮기며 세 지표를 비교합니다. 점수 분포는 이 활동을 위해 만든 예시입니다.',
  body:`<div class="md-split" style="--split:1.4fr 1fr"><div class="md-panel"><div class="s31-plot" id="s31-th-plot"></div><label class="md-slider s31-wide">기준 점수<input type="range" id="s31-th" min="5" max="100" step="5"><output></output></label></div>
   <div class="md-panel"><h3>혼동행렬</h3><table class="md-check s31-table s31-cm"><thead><tr><th></th><th>스팸으로 예측</th><th>정상으로 예측</th></tr></thead><tbody><tr><th scope="row">실제 스팸 (20통)</th><td data-c="tp" data-result="right"></td><td data-c="fn" data-result="wrong"></td></tr>
   <tr><th scope="row">실제 정상 (80통)</th><td data-c="fp" data-result="wrong"></td><td data-c="tn" data-result="right"></td></tr></tbody></table><ul class="md-list" id="s31-th-rate" style="font-size:.84em"></ul></div></div>`,
  state:()=>({cut:50}),
  render(ui,st,reset){
   ui.action('처음 값으로',reset);
   const X=s=>80+s*5.25;
   function dots(list,base,right,wrong,hollow){const stack={};return list.map(s=>{const k=stack[s]=(stack[s]||0)+1,flag=s>=st.cut;
    return `<circle cx="${X(s).toFixed(1)}" cy="${base-(k-1)*13}" r="5.4" fill="${(flag?right:wrong)[0]}" stroke="${(flag?right:wrong)[1]}" stroke-width="1.4"/>`}).join('')}
   function draw(){
    const tp=SPAM.filter(s=>s>=st.cut).length,fp=HAM.filter(s=>s>=st.cut).length,fn=20-tp,tn=80-fp,x=X(st.cut-2.5);
    ui.q('#s31-th-plot').innerHTML=`<svg viewBox="0 0 620 400" role="img" aria-label="스팸 점수에 따라 늘어놓은 메일 100통과 기준 점수"><rect x="${x}" y="44" width="${614-x}" height="329" fill="#fff7df"/>
     <path d="M76 373H614" stroke="#9fb0dc" stroke-width="1.5"/>${[0,25,50,75,100].map(v=>`<text x="${X(v)}" y="393" font-size="15" text-anchor="middle">${v}</text>`).join('')}<text x="4" y="393" font-size="15">스팸 점수</text>
     <text x="4" y="108" font-size="15">실제 스팸</text><text x="4" y="127" font-size="14">20통</text><text x="4" y="341" font-size="15">실제 정상</text><text x="4" y="360" font-size="14">80통</text>
     ${dots(SPAM,118,['#1f8a5b','#16794c'],['#c2413b','#a5342f'])}${dots(HAM,360,['#fff','#c2413b'],['#b9c6e6','#8fa0cc'])}
     <path d="M${x} 34V373" stroke="#b36b00" stroke-width="2.5"/>${st.cut<=75?`<text x="${x+8}" y="64" font-size="15" style="fill:#7a5600">스팸으로 예측 →</text>`:''}${st.cut>=35?`<text x="${x-8}" y="64" font-size="15" text-anchor="end">← 정상으로 예측</text>`:''}</svg>`;
    ui.q('#s31-th').value=st.cut;ui.q('#s31-th').nextElementSibling.textContent=st.cut+'점';
    const cell={tp:[tp,'맞게 찾음'],fn:[fn,'놓침'],fp:[fp,'잘못 막음'],tn:[tn,'맞게 통과']};ui.all('.s31-cm td').forEach(td=>{const [n,t]=cell[td.dataset.c];td.innerHTML=`<b>${n}통</b> ${t}`});
    const eq=(a,b)=>`${a}÷${b} ${a*100%b?'≒':'='} ${pct(a,b)}%`;
    ui.q('#s31-th-rate').innerHTML=[['정확도','맞힌 메일의 비율',`(${tp}+${tn})÷100 = ${tp+tn}%`],['재현율','실제 스팸 중 찾아낸 비율',eq(tp,20)],['정밀도','스팸 예측 중 실제 스팸',tp+fp?eq(tp,tp+fp):'예측한 스팸 없음']].map(([a,b,c])=>`<li><span><b>${a}</b> ${b}</span><b>${c}</b></li>`).join('');
    ui.say(!(tp+fp)?`모두 정상이라고 답해도 정확도는 ${tn}%입니다. 하지만 스팸을 한 통도 찾지 못합니다.`:st.cut===50?'앞 슬라이드의 예시와 같은 결과입니다. 기준 점수를 옮겨 세 지표가 어떻게 달라지는지 보세요.'
     :st.cut<50?`기준을 낮추면 놓친 스팸은 ${fn}통으로 줄지만 잘못 막은 정상 메일이 ${fp}통으로 늘어납니다.`:`기준을 높이면 잘못 막은 정상 메일은 ${fp}통으로 줄지만 놓친 스팸이 ${fn}통으로 늘어납니다.`,tp+fp?'':'bad');
   }
   ui.q('#s31-th').addEventListener('input',e=>{st.cut=Number(e.target.value);draw()});draw();
  }});

 L.add('s31LearnSort','sort',{soft:true,hint:'다섯 사례와 관련된 일을 <b>학습에 어떤 정보를 주는지</b>에 따라 나누어 봅니다. 판단이 갈리는 사례도 있습니다.',
  bins:[{id:'sup',label:'지도학습',sub:'입력과 정답(레이블)'},{id:'unsup',label:'비지도학습',sub:'정답 없는 데이터'},{id:'rl',label:'강화학습',sub:'행동에 대한 보상'}],cards:[
  {id:'a',label:'스팸 분류',sub:'사람이 스팸 여부를 표시한 메일로 학습',answer:'sup',why:'입력과 정답(레이블)으로 범주를 고르는 지도학습의 분류입니다.'},
  {id:'b',label:'손글씨 인식',sub:'정답이 붙은 숫자 이미지로 학습',answer:'sup',why:'정답이 붙은 이미지를 0부터 9 중 하나로 판별하는 지도학습의 분류입니다.'},
  {id:'c',label:'집값 추정',sub:'면적과 위치로 연속적인 수치를 예측',answer:'sup',why:'연속적인 수치를 예측하는 회귀이며 지도학습의 과제입니다.'},
  {id:'d',label:'비슷한 이용자 묶기',sub:'시청 기록이 비슷한 이용자끼리 묶음',answer:'unsup',why:'정답 없이 특성이 비슷한 데이터끼리 묶는 군집입니다. 묶음의 의미는 사람이 해석합니다.'},
  {id:'e',label:'알파고의 자기 대국',sub:'대국의 승패를 보상으로 삼음',answer:'rl',why:'행동한 뒤 받은 보상으로 전략을 고치는 강화학습입니다.'},
  {id:'f',label:'번역',sub:'원문과 번역문의 짝으로 학습한다면',answer:'sup',why:'원문이 입력, 번역문이 정답 역할을 한다면 지도학습으로 볼 수 있습니다.'},
  {id:'g',label:'영상 추천',sub:'어떤 정보로 학습하는지 따져 보기',answer:['unsup','sup'],why:'시청 기록이 비슷한 이용자를 묶어 추천에 쓴다면 비지도학습입니다. 학습에 주는 정보에 따라 판단이 갈릴 수 있는 사례입니다.'}]});

 // The slide's table: inputs 1, 3, 0, weights 2, 0.5, -3, bias -2, sum 1.5.
 const FEATURES=["'무료' 포함",'링크 수','주소록 발신자'];
 L.add('s31Perceptron','custom',{
  hint:'입력과 가중치, 편향을 바꾸어 <b>합계와 출력</b>이 어떻게 달라지는지 확인합니다. 처음 값은 앞 슬라이드의 예시와 같습니다.',
  body:`<div class="md-split" style="--split:2fr 1fr"><table class="md-check s31-table s31-pc"><thead><tr><th>특성</th><th>입력 x</th><th>가중치 w</th><th>x × w</th></tr></thead><tbody>
   ${FEATURES.map((f,i)=>`<tr><th scope="row">${f}</th><td><div class="s31-ctl"><input type="range" data-k="x" data-i="${i}" min="0" max="${i===1?5:1}" step="1" aria-label="${f} 입력"><output></output></div></td><td><div class="s31-ctl"><input type="range" data-k="w" data-i="${i}" min="-4" max="4" step="0.5" aria-label="${f} 가중치"><output></output></div></td><td data-p="${i}"></td></tr>`).join('')}
   <tr><th scope="row">편향 b</th><td></td><td><div class="s31-ctl"><input type="range" data-k="b" min="-4" max="4" step="0.5" aria-label="편향"><output></output></div></td><td data-p="b"></td></tr>
   <tr class="s31-sum"><th scope="row">합계와 출력</th><td colspan="2" id="s31-pc-eq"></td><td id="s31-pc-sum"></td></tr></tbody></table>
   <div class="md-panel"><h3>활성화 함수의 판단</h3><p style="font-size:.9em">합이 0보다 크면 스팸(1), 아니면 정상(0)으로 출력합니다.</p><ul class="md-list"><li><span>합계</span><b id="s31-pc-s"></b></li><li><span>0보다 큰가</span><b id="s31-pc-gt"></b></li></ul><p class="md-verdict" id="s31-pc-out"></p></div></div>`,
  state:()=>({x:[1,3,0],w:[2,.5,-3],b:-2}),
  render(ui,st,reset){
   ui.action('처음 값으로',reset);
   function draw(){
    ui.all('.s31-pc input').forEach(n=>{const k=n.dataset.k,i=Number(n.dataset.i),v=k==='b'?st.b:st[k][i];n.value=v;n.nextElementSibling.textContent=k==='x'&&i!==1?(v?'1 (예)':'0 (아니요)'):v});
    const parts=st.x.map((x,i)=>R(x*st.w[i])),sum=R(parts.reduce((a,b)=>a+b,st.b)),spam=sum>0,show=v=>v<0?`(${v})`:v;
    parts.forEach((p,i)=>ui.q(`[data-p="${i}"]`).textContent=p);ui.q('[data-p=b]').textContent=st.b;
    ui.q('#s31-pc-eq').textContent=`${parts.map(show).join(' + ')} + ${show(st.b)}`;ui.q('#s31-pc-sum').textContent=`${sum} → ${spam?'스팸':'정상'}`;
    ui.q('#s31-pc-s').textContent=sum;ui.q('#s31-pc-gt').textContent=spam?'크다':'크지 않다';
    const out=ui.q('#s31-pc-out');out.textContent=spam?'스팸 (1)':'정상 (0)';out.dataset.tone=spam?'bad':'good';
    const first=String([st.x,st.w,st.b])==='1,3,0,2,0.5,-3,-2';
    ui.say(first?'앞 슬라이드와 같은 값입니다. 주소록 발신자의 입력을 1로 바꾸면 합계와 출력이 어떻게 달라질까요?':`합계가 ${sum}입니다. 0보다 ${spam?'크므로 출력은 스팸(1)':'크지 않으므로 출력은 정상(0)'}입니다.`);
   }
   ui.body.addEventListener('input',e=>{const k=e.target.dataset.k;if(!k)return;const v=Number(e.target.value);if(k==='b')st.b=v;else st[k][Number(e.target.dataset.i)]=v;draw()});draw();
  }});

 // The four labelled mails of the features slide, judged with the weights of the perceptron slide. Only a wrong prediction changes weights.
 const CASES=[[1,3,0,1],[0,0,1,0],[1,1,1,0],[0,2,0,1]],BIAS=-2,START=[2,.5,-3];
 L.add('s31Learn','custom',{
  hint:'앞에서 본 가중치로 레이블이 붙은 메일 네 통을 차례로 판단합니다. <b>예측이 틀릴 때만</b> 그 메일에 있던 특성의 가중치를 학습률만큼 고칩니다.',
  body:`<div class="md-split" style="--split:1.85fr 1fr"><div style="display:flex;flex-direction:column;gap:.5em;min-height:0"><table class="md-check s31-table s31-lm"><thead><tr><th>메일</th><th>'무료' 포함</th><th>링크 수</th><th>주소록 발신자</th><th>레이블</th><th>합계</th><th>예측</th><th>결과</th></tr></thead><tbody></tbody></table>
   <p class="s31-note" style="flex:none">예는 1, 아니요는 0으로 넣었습니다. 합계는 입력 × 가중치를 모두 더하고 편향 ${BIAS}를 더한 값이며, 0보다 크면 스팸으로 예측합니다.</p></div>
   <div class="md-panel"><h3>지금의 가중치</h3><ul class="md-list" id="s31-lm-w"></ul><label style="font-size:.9em">학습률 <select id="s31-lm-rate">${[.1,.5,1,2].map(v=>`<option value="${v}">${v}</option>`).join('')}</select></label><p id="s31-lm-log" style="font-size:.86em;margin-top:auto"></p></div></div>`,
  state:()=>({w:[...START],rate:1,i:0,round:1,wrong:0,fixes:0,done:false,log:null}),
  render(ui,st,reset){
   const sum=m=>R(m[0]*st.w[0]+m[1]*st.w[1]+m[2]*st.w[2]+BIAS);
   function step(){
    if(st.done)return;const m=CASES[st.i],s=sum(m),p=s>0?1:0,changes=[];
    if(p!==m[3]){m.slice(0,3).forEach((x,j)=>{if(x){const old=st.w[j];st.w[j]=R(old+st.rate*(m[3]-p)*x);changes.push(`${FEATURES[j]} ${old} → ${st.w[j]}`)}});st.wrong++;st.fixes++}
    st.log={n:st.i+1,s,kind:p===m[3]?'ok':p?'block':'miss',changes};
    if(++st.i===CASES.length){if(st.wrong)Object.assign(st,{i:0,round:st.round+1,wrong:0});else st.done=true}
   }
   const next=ui.action('다음 메일',()=>{step();draw()},true),lap=ui.action('한 바퀴 끝까지',()=>{do step();while(st.i&&!st.done);draw()});ui.action('처음부터',reset);
   function draw(){
    ui.q('.s31-lm tbody').innerHTML=CASES.map((m,i)=>{const s=sum(m),p=s>0?1:0,ok=p===m[3];
     return `<tr${!st.done&&i===st.i?' class="s31-next"':''}><th scope="row">${i+1}</th><td>${m[0]}</td><td>${m[1]}</td><td>${m[2]}</td><td>${m[3]?'스팸':'정상'}</td><td>${s}</td><td>${p?'스팸':'정상'}</td><td data-result="${ok?'right':'wrong'}">${ok?'맞음':p?'잘못 막음':'놓침'}</td></tr>`}).join('');
    ui.q('#s31-lm-w').innerHTML=FEATURES.map((f,j)=>`<li><span>${f}</span><b>${st.w[j]}</b></li>`).join('')+`<li><span>편향 b (그대로 둠)</span><b>${BIAS}</b></li>`;
    ui.q('#s31-lm-rate').value=st.rate;next.disabled=lap.disabled=st.done;
    const g=st.log;ui.q('#s31-lm-log').textContent=!g?'노란 줄이 다음에 확인할 메일입니다.':g.kind==='ok'?`메일 ${g.n}: 예측이 맞아 가중치는 그대로입니다.`:`메일 ${g.n}에서 고친 가중치: ${g.changes.join(', ')} (학습률 ${st.rate} × 입력 값만큼 ${g.kind==='miss'?'높임':'낮춤'})`;
    if(st.done)ui.say(`${st.round}바퀴째에 네 통을 모두 맞혔습니다. 가중치를 고친 횟수는 ${st.fixes}번입니다. 학습률을 바꾸어 비교해 보세요.`,'good');
    else if(!g)ui.say("앞 장의 가중치로는 메일 4를 놓칩니다. '다음 메일'을 눌러 한 통씩 확인하며 가중치를 고쳐 봅니다.");
    else ui.say(g.kind==='ok'?`메일 ${g.n}: 합계 ${g.s}, 예측이 맞았습니다. 가중치는 예측이 틀린 사례에서만 고칩니다.`:g.kind==='miss'?`메일 ${g.n}: 스팸을 정상으로 놓쳤습니다. 이 메일에 있던 특성의 가중치를 높였습니다.`:`메일 ${g.n}: 정상 메일을 스팸으로 막았습니다. 이 메일에 있던 특성의 가중치를 낮췄습니다.`,g.kind==='ok'?'':'bad');
   }
   ui.q('#s31-lm-rate').addEventListener('change',e=>{Object.assign(st,{w:[...START],rate:Number(e.target.value),i:0,round:1,wrong:0,fixes:0,done:false,log:null});draw()});draw();
  }});

 // XOR with one line (a single perceptron) or with the band between two parallel lines (two hidden units).
 const XOR=[[0,0,0],[0,1,1],[1,0,1],[1,1,0]],BOX=[[-.5,-.5],[1.5,-.5],[1.5,1.5],[-.5,1.5]];
 const cut=(poly,f,positive)=>{const out=[];poly.forEach((p,i)=>{const q=poly[(i+1)%poly.length],a=f(p),b=f(q),ia=positive?a>0:a<=0,ib=positive?b>0:b<=0;if(ia)out.push(p);if(ia!==ib){const t=a/(a-b);out.push([p[0]+(q[0]-p[0])*t,p[1]+(q[1]-p[1])*t])}});return out};
 L.add('s31Xor','custom',{
  hint:'파란 점은 정답 1, 빨간 점은 정답 0입니다. 직선을 옮겨 <b>파란 점만</b> 색칠된 영역에 들어가게 해 보세요. 직선 하나로 될까요?',
  body:`<div class="md-split" style="--split:1fr 1.05fr"><div class="md-panel"><div class="s31-plot" id="s31-xor"></div></div><div class="md-panel"><h3>직선 w1 × x1 + w2 × x2 + b = 0</h3>
   ${[['w1','가중치 w1',2],['w2','가중치 w2',2],['b','편향 b',3]].map(([k,t,m])=>`<label class="md-slider s31-wide">${t}<input type="range" data-k="${k}" min="${-m}" max="${m}" step="0.5"><output></output></label>`).join('')}
   <label class="s31-check"><input type="checkbox" id="s31-xor-two">직선 하나 더 쓰기 (두 직선 사이만 1)</label><label class="md-slider s31-wide">둘째 직선의 편향<input type="range" data-k="b2" min="-3" max="3" step="0.5"><output></output></label>
   <div class="s31-pts" id="s31-xor-pts"></div><p class="md-verdict" id="s31-xor-out" style="font-size:1.15em"></p></div></div>`,
  state:()=>({w1:1,w2:1,b:-.5,b2:-3,two:false}),
  render(ui,st,reset){
   ui.action('처음 값으로',reset);
   const PX=x=>50+(x+.5)*150,PY=y=>330-(y+.5)*150,pts=poly=>poly.map(p=>`${PX(p[0]).toFixed(1)},${PY(p[1]).toFixed(1)}`).join(' ');
   function line(c,color){ // The part of the line inside the plotted square.
    const f=p=>st.w1*p[0]+st.w2*p[1]+c,ends=[];if(!st.w1&&!st.w2)return '';
    BOX.forEach((p,i)=>{const q=BOX[(i+1)%BOX.length],a=f(p),b=f(q);if(!a)ends.push(p);else if(a*b<0){const t=a/(a-b);ends.push([p[0]+(q[0]-p[0])*t,p[1]+(q[1]-p[1])*t])}});
    return ends.length>1?`<polyline points="${pts(ends.slice(0,2))}" fill="none" stroke="${color}" stroke-width="3"/>`:''}
   function draw(){
    const f1=p=>st.w1*p[0]+st.w2*p[1]+st.b,f2=p=>st.w1*p[0]+st.w2*p[1]+st.b2,out=p=>f1(p)>0&&!(st.two&&f2(p)>0)?1:0;
    let area=cut(BOX,f1,true);if(st.two)area=cut(area,f2,false);
    const right=XOR.filter(p=>out(p)===p[2]).length;
    ui.q('#s31-xor').innerHTML=`<svg viewBox="0 0 370 366" role="img" aria-label="XOR의 네 점과 직선이 나눈 영역"><rect x="50" y="30" width="300" height="300" fill="#fff" stroke="#9fb0dc"/>
     ${area.length>2?`<polygon points="${pts(area)}" fill="#cfdcf8"/>`:''}<path d="M${PX(0)} 30V330M50 ${PY(0)}H350" stroke="#c9d3ec"/>
     ${[0,1].map(v=>`<text x="${PX(v)}" y="348" font-size="14" text-anchor="middle">${v}</text><text x="40" y="${PY(v)+5}" font-size="14" text-anchor="end">${v}</text>`).join('')}<text x="200" y="364" font-size="14" text-anchor="middle">입력 x1</text><text x="14" y="180" font-size="14" text-anchor="middle" transform="rotate(-90 14 180)">입력 x2</text>
     ${line(st.b,'#1c2c4c')}${st.two?line(st.b2,'#b36b00'):''}
     ${XOR.map(p=>`${out(p)===p[2]?`<circle cx="${PX(p[0])}" cy="${PY(p[1])}" r="19" fill="none" stroke="#1f8a5b" stroke-width="3"/>`:''}<circle cx="${PX(p[0])}" cy="${PY(p[1])}" r="13" fill="${p[2]?'#3f5dae':'#c2413b'}"/><text x="${PX(p[0])}" y="${PY(p[1])+5}" font-size="14" text-anchor="middle" style="fill:#fff;font-weight:800">${p[2]}</text>`).join('')}</svg>`;
    ui.all('.md-slider input').forEach(n=>{n.value=st[n.dataset.k];n.nextElementSibling.textContent=st[n.dataset.k];if(n.dataset.k==='b2')n.disabled=!st.two});ui.q('#s31-xor-two').checked=st.two;
    ui.q('#s31-xor-pts').innerHTML=XOR.map(p=>`<span data-result="${out(p)===p[2]?'right':'wrong'}">입력 (${p[0]}, ${p[1]}) 정답 ${p[2]} → 출력 ${out(p)}</span>`).join('');
    const v=ui.q('#s31-xor-out');v.textContent=`네 점 중 ${right}개 맞음`;v.dataset.tone=right===4?'good':'bad';
    ui.say(right===4?'직선 두 개를 조합해 네 점을 모두 맞혔습니다. 은닉층을 두면 이렇게 여러 직선을 조합한 경계를 만들 수 있습니다.'
     :st.two?'색칠된 띠 안에 파란 점 두 개만 들어가도록 둘째 직선의 편향을 옮겨 보세요.':`직선 하나로 네 점 중 ${right}개를 맞혔습니다. 네 개를 모두 맞히는 값을 찾아보고, 찾지 못하면 직선을 하나 더 씁니다.`,right===4?'good':'');
   }
   ui.body.addEventListener('input',e=>{const k=e.target.dataset.k;if(k)st[k]=Number(e.target.value);else if(e.target.id==='s31-xor-two')st.two=e.target.checked;else return;draw()});draw();
  }});

 // The slide's example probabilities. Draws follow a fixed pseudo-random sequence so a reload shows the same run.
 const TOKENS=[['카레',31],['비빔밥',22],['김치볶음밥',15],['그 밖의 후보',32]];
 L.add('s31Token','custom',{
  hint:'앞의 글 뒤에 올 토큰을 <b>확률에 따라</b> 하나씩 뽑아 붙입니다. 여러 번 뽑으면 어떤 글이 얼마나 나올까요? 확률은 앞 슬라이드의 예시 값입니다.',
  body:`<div class="md-split" style="--split:1.5fr 1fr"><div class="md-panel"><p class="s31-lead">오늘 급식 메뉴는 <i id="s31-tok-last"></i></p><div class="s31-tok"><span>다음 토큰 후보</span><span>확률(예시)</span><span>뽑힌 횟수</span>
   ${TOKENS.map(([t,p],i)=>`<b>${t}</b><div class="s31-bar"><div class="md-meter"><i style="width:${p}%"></i></div><span>${p}%</span></div><div class="s31-bar"><div class="md-meter"><i class="s31-hit" data-i="${i}"></i></div><span data-n="${i}"></span></div>`).join('')}</div>
   <p class="s31-note" style="margin-top:auto">모델은 확률을 계산한 뒤 하나를 골라 붙이는 일을 반복해 글을 만듭니다.</p></div><div class="md-panel"><h3>만들어진 글 (최근 6개)</h3><ul class="md-list" id="s31-tok-log"></ul></div></div>`,
  state:()=>({seed:20261024,counts:[0,0,0,0],recent:[]}),
  render(ui,st,reset){
   function pick(){
    let t=st.seed=(st.seed+0x6D2B79F5)|0;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);
    let r=((t^t>>>14)>>>0)/4294967296*100,i=0;while(i<TOKENS.length-1&&r>=TOKENS[i][1]){r-=TOKENS[i][1];i++}
    st.counts[i]++;st.recent=[i,...st.recent].slice(0,6);
   }
   ui.action('한 번 뽑기',()=>{pick();draw()},true);ui.action('100번 뽑기',()=>{for(let i=0;i<100;i++)pick();draw()});ui.action('처음부터',reset);
   function draw(){
    const total=st.counts.reduce((a,b)=>a+b,0);
    ui.q('#s31-tok-last').textContent=st.recent.length?TOKENS[st.recent[0]][0]:'□';
    st.counts.forEach((n,i)=>{ui.q(`.s31-hit[data-i="${i}"]`).style.width=(total?n/total*100:0)+'%';ui.q(`[data-n="${i}"]`).textContent=n+'번'});
    ui.q('#s31-tok-log').innerHTML=st.recent.length?st.recent.map(i=>`<li><span>오늘 급식 메뉴는 <b>${TOKENS[i][0]}</b></span></li>`).join(''):'<li><span>아직 뽑지 않았습니다.</span></li>';
    ui.say(total&&total<20?`${total}번 뽑았습니다. 방금 뽑힌 토큰은 '${TOKENS[st.recent[0]][0]}'입니다. 다시 뽑으면 다른 토큰이 이어질 수 있습니다.`:total?`${total}번 가운데 '카레'는 ${st.counts[0]}번(${pct(st.counts[0],total)}%) 나왔습니다. 확률대로 뽑으므로 같은 글 뒤에도 매번 다른 토큰이 이어질 수 있습니다.`:"'한 번 뽑기'를 누르면 확률에 따라 다음 토큰 하나를 골라 붙입니다.");
   }
   draw();
  }});
})();
