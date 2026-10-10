/* 6주차 오전, 공정성과 편향성 및 책임 있는 활용 Part 1: activity slides. Toy records, toy models and school scenes are written for these activities. */
(()=>{
 'use strict';
 const L=window.ceLabs;if(!L)return;const esc=L.esc;
 L.style(`.md-lab .s61-bar{flex:none;align-items:center;gap:.6em;font-size:.9em}.md-lab .s61-bar .md-chip{font-size:.92em;padding:.3em .95em}.md-lab .s61-bar .md-chip[aria-pressed=true]{background:#fff7df;font-weight:800}
.ce-lab.md-lab .s61-note{font-size:.78em;line-height:1.4;color:#52607f}
.md-lab .s61-table{flex:none;margin:0;font-size:.78em}.md-lab .s61-table th,.md-lab .s61-table td{font-size:1em}.md-lab .s61-table td,.md-lab .s61-table td:nth-child(n+3){width:auto;text-align:center}.md-lab .s61-table tbody th{text-align:left}
.md-lab .s61-table td[data-pass=true]{background:#e3f5ec;color:#16794c;font-weight:800}.md-lab .s61-table td[data-pass=false]{color:#6b7896}
.md-lab .s61-group{display:grid;gap:.35em}.ce-lab.md-lab .s61-group p{display:flex;justify-content:space-between;gap:1em;font-size:.9em}.md-lab .s61-group p b{color:#2c478f}
.md-lab .s61-dots{display:grid;grid-template-columns:repeat(10,1fr);gap:.3em}
.md-lab .s61-dots span{aspect-ratio:1;display:grid;place-items:center;border:1px dashed #b9c6e6;border-radius:50%;background:#fff;color:#8490ad;font-size:.76em;font-weight:800}
.md-lab .s61-dots span[data-s=pass]{border:1px solid #3f5dae;background:#3f5dae;color:#fff}.md-lab .s61-dots span[data-s=lost]{border:1px solid #c2413b;background:#fdeceb;color:#b5372f}.md-lab .s61-dots span[data-s=odd]{border:1px solid #f0a202;background:#fff7df;color:#7a5600}
.ce-lab.md-lab .s61-legend{display:flex;flex-wrap:wrap;gap:.25em 1.1em;font-size:.78em;color:#3a4a6b}.md-lab .s61-legend i{display:inline-block;width:.95em;height:.95em;margin-right:.4em;border:1px dashed #b9c6e6;border-radius:50%;background:#fff;vertical-align:-.12em}
.md-lab .s61-legend i[data-s=pass],.md-lab .s61-legend i[data-k=hit]{border:1px solid #3f5dae;background:#3f5dae}.md-lab .s61-legend i[data-s=lost]{border:1px solid #c2413b;background:#fdeceb}
.md-lab .s61-legend i[data-k]{border-radius:.2em;border-style:solid}.md-lab .s61-legend i[data-k=miss]{border-color:#c2413b;background:#c2413b}.md-lab .s61-legend i[data-k=wrong]{border-color:#f0a202;background:#f0a202}.md-lab .s61-legend i[data-k=rest]{border-color:#dfe7fa;background:#dfe7fa}
.md-lab .s61-tiles{display:grid;grid-template-columns:4.4em repeat(10,1fr);align-items:center;gap:.25em;font-size:.82em}.md-lab .s61-tiles b{color:#2c478f}
.md-lab .s61-mix{display:grid;grid-template-columns:repeat(20,1fr);gap:.2em}.md-lab .s61-mix span{height:1.5em;border-radius:.25em;background:#3f5dae}.md-lab .s61-mix span[data-g=b]{background:#f0a202}
.md-lab .s61-tiles span{display:grid;place-items:center;height:2.3em;border:1px dashed #b9c6e6;border-radius:.3em;background:#fff;color:#a3adc6}
.md-lab .s61-tiles span[data-on=true]{border:1px solid #3f5dae;background:#3f5dae;color:#fff;font-weight:800}
.md-lab .s61-acc{display:grid;grid-template-columns:4.4em 1fr 3.4em;align-items:center;gap:.6em;font-size:.9em}.md-lab .s61-acc b{text-align:right;color:#2c478f}.md-lab .s61-acc .md-meter i[data-low=true]{background:#f0a202}
.md-lab .s61-grades{display:grid;grid-template-columns:1fr 1fr;gap:1.1em}.md-lab .s61-grade{display:flex;flex-direction:column;gap:.5em;min-width:0}
.ce-lab.md-lab .s61-grade h3 small{font-size:.82em;font-weight:600;color:#52607f;margin-left:.4em}.md-lab .s61-grade .md-list{font-size:.8em}
.md-lab .s61-unit{display:grid;grid-template-columns:repeat(20,1fr);gap:.15em}.md-lab .s61-unit span{aspect-ratio:1;border-radius:.15em;background:#dfe7fa}
.md-lab .s61-unit span[data-k=hit]{background:#3f5dae}.md-lab .s61-unit span[data-k=miss]{background:#c2413b}.md-lab .s61-unit span[data-k=wrong]{background:#f0a202}
.md-lab .s61-crit{font-size:.86em}.md-lab .s61-crit li{align-items:center}.md-lab .s61-crit span{display:grid;gap:.1em;min-width:0}.md-lab .s61-crit span b{color:#2c478f}.md-lab .s61-crit small{font-size:.86em;line-height:1.3;color:#52607f}
.md-lab .s61-crit em{flex:none;padding:.1em .7em;border-radius:99em;font-style:normal;font-weight:800;white-space:nowrap}.md-lab .s61-crit em[data-ok=true]{background:#e3f5ec;color:#16794c}.md-lab .s61-crit em[data-ok=false]{background:#fdeceb;color:#b5372f}.md-lab .s61-crit em[data-ok=na]{background:#eef2fb;color:#52607f}
.md-lab .s61-case{font-size:1.05em;font-weight:800;line-height:1.45;color:#1c2c4c}
.md-lab .s61-opts{flex:1;min-height:0}.md-lab .s61-opts .md-choice{display:flex;flex-direction:column;justify-content:center;gap:.6em;padding:1em 1.2em;text-align:left;font-size:1.05em;line-height:1.5}.md-lab .s61-opts .md-choice small{color:#2c478f;font-size:.86em;font-weight:800}
.md-lab .s61-views{flex:1;min-height:0;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:.9em}.md-lab .s61-views .md-panel{gap:.5em}
.ce-lab.md-lab .s61-views .md-panel p{font-size:.86em;line-height:1.4}.ce-lab.md-lab .s61-views .md-panel p.s61-count{font-size:1em;font-weight:800;color:#2c478f}.md-lab .s61-views .md-panel p span{display:block;color:#52607f;font-size:.9em}`);

 L.add('s61Fair','pick',{hint:'표의 정보만 보고 첫 판단을 골라 봅니다. 1학년 100명 중 30명, 2학년 100명 중 10명을 추천한 결정은 공정할까요?',
  reasonLabel:'판단하려면 무엇을 더 알아야 할지 적어 봅니다.',after:'골랐습니다. 2절의 계산 예시에서 두 학년의 추천을 다시 살펴봅니다.',options:[
  {id:'fair',label:'공정하다',sub:'1학년 담당 교사는 대체로 적절하다고 보았다'},{id:'unfair',label:'불공정하다',sub:'두 학년의 추천 인원이 30명과 10명으로 다르다'},
  {id:'hold',label:'아직 판단할 수 없다',sub:'더 알아야 할 것이 있다'}]});

 // A model that copies past decisions: the pass rate of past applicants with the same visible values decides the prediction.
 // Columns: group, club, qualified, past applicants, past passes.
 const PAST=[['가','A',1,15,12],['가','A',0,9,1],['가','B',1,4,3],['가','B',0,2,0],['나','A',1,1,0],['나','A',0,1,0],['나','B',1,5,1],['나','B',0,3,0]];
 // Columns: group, club, qualified, new applicants. Each group has six qualified applicants.
 const NEW=[['가','A',1,5],['가','B',1,1],['가','A',0,3],['가','B',0,1],['나','A',1,1],['나','B',1,5],['나','A',0,1],['나','B',0,3]];
 const MODES=[{label:'집단, 동아리, 자격 모두',keys:[0,1,2]},{label:'집단 항목 지움',keys:[1,2]},{label:'집단과 동아리 항목 지움',keys:[2]}];
 const cell=(k,v)=>k===0?`${v} 집단`:k===1?`동아리 ${v}`:v?'자격 충족':'자격 미달';
 L.add('s61Proxy','custom',{
  hint:'과거 합격 기록을 배운 채용 모델입니다. <b>모델에 보여 주는 항목</b>을 지우며 새 지원자의 결과를 봅니다. 기록과 지원자는 이 활동을 위해 만든 예시입니다.',
  body:`<div class="md-chips s61-bar"><span>모델에 보여 주는 항목</span>${MODES.map((m,i)=>`<button type="button" class="md-chip" data-mode="${i}">${m.label}</button>`).join('')}</div>
   <div class="md-split" style="--split:1.2fr 1fr"><div class="md-panel"><h3>모델이 과거 기록 40건에서 배운 것</h3><table class="md-check s61-table"><thead><tr><th>같은 조건의 과거 지원자</th><th>지원</th><th>합격</th><th>합격 비율</th><th>모델의 예측</th></tr></thead><tbody id="s61-px-rows"></tbody></table>
   <p class="s61-note" style="margin-top:auto">과거 지원자는 가 집단 30명, 나 집단 10명입니다. 가 집단은 주로 동아리 A, 나 집단은 주로 동아리 B였습니다. 자격을 충족한 지원자 가운데 가 집단은 19명 중 15명, 나 집단은 6명 중 1명이 합격했습니다. 모델은 합격 비율이 50% 이상인 조건을 합격으로 예측합니다.</p></div>
   <div class="md-panel"><h3>새 지원자 20명의 예측 결과</h3><div id="s61-px-new" style="display:grid;gap:.7em"></div>
   <p class="s61-legend"><span><i data-s="pass"></i>합격 예측</span><span><i data-s="lost"></i>자격을 충족했지만 탈락 예측</span><span><i></i>자격 미달, 탈락 예측</span></p>
   <p class="s61-note" style="margin-top:auto">원 안의 글자는 지원자의 동아리입니다. 자격을 충족한 지원자는 두 집단 모두 6명입니다.</p></div></div>`,
  state:()=>({mode:0}),
  render(ui,st,reset){
   ui.action('처음부터',reset);
   function draw(){
    const keys=MODES[st.mode].keys,id=r=>keys.map(k=>r[k]).join('|'),learned=new Map();
    for(const r of PAST){const c=learned.get(id(r))||{name:keys.map(k=>cell(k,r[k])).join(', '),n:0,pass:0};c.n+=r[3];c.pass+=r[4];learned.set(id(r),c)}
    const passes=r=>{const c=learned.get(id(r));return c.pass*2>=c.n};
    ui.all('[data-mode]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.mode)===st.mode)));
    ui.q('#s61-px-rows').innerHTML=[...learned.values()].map(c=>`<tr><th scope="row">${c.name}</th><td>${c.n}명</td><td>${c.pass}명</td><td>${Math.round(c.pass/c.n*100)}%</td><td data-pass="${c.pass*2>=c.n}">${c.pass*2>=c.n?'합격':'탈락'}</td></tr>`).join('');
    const count={};
    ui.q('#s61-px-new').innerHTML=['가','나'].map(g=>{
     const people=NEW.filter(r=>r[0]===g).flatMap(r=>Array.from({length:r[3]},()=>({club:r[1],s:passes(r)?(r[2]?'pass':'odd'):r[2]?'lost':'out'})));
     count[g]=people.filter(p=>p.s==='pass'||p.s==='odd').length;
     return `<div class="s61-group"><p><span>${g} 집단 10명</span><b>합격 예측 ${count[g]}명</b></p><div class="s61-dots">${people.map(p=>`<span data-s="${p.s}">${p.club}</span>`).join('')}</div></div>`}).join('');
    ui.say(st.mode===0?`과거 결정을 그대로 배운 모델은 자격이 같아도 가 집단 ${count.가}명, 나 집단 ${count.나}명을 합격으로 예측합니다.`
     :st.mode===1?`집단 항목을 지워도 가 집단 ${count.가}명, 나 집단 ${count.나}명입니다. 나 집단이 많은 동아리 B가 집단을 대신하는 신호가 되었습니다.`
     :`집단과 연결된 동아리 항목까지 지우자 두 집단 모두 ${count.가}명입니다. 이 예시와 달리 슬라이드의 채용 도구에는 다른 차별 가능성이 남았습니다.`,st.mode===2?'good':'');
   }
   ui.body.addEventListener('click',e=>{const b=e.target.closest('[data-mode]');if(b){st.mode=Number(b.dataset.mode);draw()}});draw();
  }});

 // A recognizer that only knows the expressions it met in training. Each group speaks with ten expressions of its own.
 L.add('s61DataMix','custom',{
  hint:'학습 자료 20건에 <b>나 집단 자료</b>를 몇 건 넣을지 바꾸어 봅니다. 본 적 있는 표현만 알아듣는 아주 단순한 음성 인식 모델을 가정한 계산 예시입니다.',
  body:`<div class="md-split" style="--split:1fr 1.2fr"><div class="md-panel"><h3>학습 자료 20건의 구성</h3>
   <label class="md-slider" style="grid-template-columns:6.4em 1fr 6.2em">나 집단 자료<input type="range" id="s61-dm-k" min="0" max="10" step="2" aria-label="학습 자료 20건 중 나 집단 자료 수"><output id="s61-dm-out"></output></label>
   <div class="s61-mix" id="s61-dm-mix" aria-hidden="true"></div><p class="s61-legend"><span><i data-k="hit"></i><span id="s61-dm-a"></span></span><span><i data-k="wrong"></i><span id="s61-dm-b"></span></span></p>
   <h3 style="margin-top:.6em">모델이 배운 표현 (집단마다 10가지)</h3><div class="s61-tiles" id="s61-dm-tiles"></div>
   <p class="s61-note" style="margin-top:auto">두 집단은 저마다 다른 표현 10가지로 말합니다. 자료 1건에는 새 표현 1가지가 담기고, 모델은 학습 자료에 나온 표현만 알아듣습니다. 가 집단 자료는 늘 10건 이상이어서 10가지를 모두 배웁니다.</p></div>
   <div class="md-panel"><h3>평가 자료 100건으로 잰 정확도</h3><table class="md-check s61-table" style="font-size:.84em"><thead><tr><th>평가 자료의 구성</th><th>가 집단</th><th>나 집단</th><th>전체 정확도</th></tr></thead><tbody id="s61-dm-rows"></tbody></table>
   <h3 style="margin-top:.5em">집단별로 나누어 본 정확도</h3><div id="s61-dm-acc" style="display:grid;gap:.45em"></div>
   <p class="s61-note" style="margin-top:auto">평가 자료에는 각 집단의 표현 10가지가 같은 횟수로 나온다고 가정했습니다.</p></div></div>`,
  state:()=>({k:2}),
  render(ui,st,reset){
   ui.action('처음 값으로',reset);
   function draw(){
    const k=st.k,skewA=100-5*k,skewB=5*k,skewHit=k*k/2,skew=skewA+skewHit,even=50+5*k;
    ui.q('#s61-dm-k').value=k;ui.q('#s61-dm-out').textContent=`${k}건 (${k*5}%)`;
    ui.q('#s61-dm-mix').innerHTML=Array.from({length:20},(_,i)=>`<span data-g="${i<20-k?'a':'b'}"></span>`).join('');ui.q('#s61-dm-a').textContent=`가 집단 자료 ${20-k}건`;ui.q('#s61-dm-b').textContent=`나 집단 자료 ${k}건`;
    ui.q('#s61-dm-tiles').innerHTML=[['가 집단',10],['나 집단',k]].map(([name,known])=>`<b>${name}</b>${Array.from({length:10},(_,i)=>`<span data-on="${i<known}">${i+1}</span>`).join('')}`).join('');
    ui.q('#s61-dm-rows').innerHTML=`<tr><th scope="row">학습 자료와 같은 구성</th><td>${skewA}건 중 ${skewA}건</td><td>${skewB?`${skewB}건 중 ${skewHit}건`:'자료 없음'}</td><td><b>${skew}%</b></td></tr>
     <tr><th scope="row">두 집단 50건씩</th><td>50건 중 50건</td><td>50건 중 ${5*k}건</td><td><b>${even}%</b></td></tr>`;
    ui.q('#s61-dm-acc').innerHTML=[['가 집단',100],['나 집단',k*10]].map(([name,p])=>`<div class="s61-acc"><span>${name}</span><div class="md-meter"><i data-low="${p<100}" style="width:${p}%"></i></div><b>${p}%</b></div>`).join('');
    ui.say(k===0?'학습 자료와 같은 구성으로 평가하면 100%입니다. 평가 자료에 나 집단이 없어 나 집단 정확도 0%가 점수에 드러나지 않습니다.'
     :k===10?'두 집단의 자료를 같은 수로 넣자 어느 평가 자료로 재어도 두 집단 모두 100%입니다.'
     :`같은 모델인데 치우친 평가 자료로는 ${skew}%, 고른 평가 자료로는 ${even}%입니다. 나 집단만 보면 ${k*10}%이므로 집단별로 나누어 평가해야 차이가 드러납니다.`,k===10?'good':'');
   }
   ui.q('#s61-dm-k').addEventListener('input',e=>{st.k=Number(e.target.value);draw()});draw();
  }});

 L.add('s61Source','sort',{hint:'여섯 장면에서 편향이 생긴 지점을 <b>데이터</b>, <b>알고리즘과 설계</b>, <b>사용과 해석</b>으로 나눕니다.',
  bins:[{id:'data',label:'데이터',sub:'대표성 부족, 과거 차별이 담긴 기록'},{id:'design',label:'알고리즘과 설계',sub:'예측 목표와 대리 지표, 최적화 기준'},{id:'use',label:'사용과 해석',sub:'결과에 대한 과신, 검증 범위 밖의 적용'}],cards:[
  {id:'a',label:'표준어 음성만 학습해 방언을 더 자주 놓침',answer:'data',why:'학습 자료가 실제 사용자 집단을 고르게 담지 못한 대표성 편향입니다.'},
  {id:'b',label:'플랫폼 접속 시간으로 학습 참여를 잼',answer:'design',why:'측정하기 쉬운 값이 개념을 대신한 대리 지표이며 집에 기기가 없는 학생을 놓칠 수 있습니다.'},
  {id:'c',label:'기계가 낸 결과를 내 판단보다 더 믿음',answer:'use',why:'결과를 읽는 사람에게서 생기는 자동화 편향입니다.'},
  {id:'d',label:'차별이 담긴 과거 합격 기록을 정답으로 배움',answer:'data',why:'과거의 결정 기록에 담긴 차별을 그대로 배운 경우입니다.'},
  {id:'e',label:'학습 추천 점수를 반 배정의 근거로 씀',answer:'use',why:'검증한 범위 밖의 목적에 결과를 옮겨 쓴 경우입니다.'},
  {id:'f',label:'도움이 필요한 정도를 성적 하락 폭으로만 잼',answer:'design',why:'대리 지표를 고르는 설계 단계의 문제이며 처음부터 성적이 낮았던 학생을 놓칠 수 있습니다.'}]});

 // The worked example of the slide before: 100 students per grade, 50 and 20 of them really need support.
 const GRADES=[{name:'1학년',need:50},{name:'2학년',need:20}];
 L.add('s61Criteria','custom',{
  hint:'두 학년의 <b>추천 인원</b>을 바꾸어 세 기준을 한꺼번에 맞출 수 있는지 확인합니다. 도움이 필요한 학생부터 추천된다고 가정한 계산 예시입니다.',
  body:`<div class="md-split" style="--split:1.6fr 1fr"><div class="md-panel"><div class="s61-grades">${GRADES.map((g,i)=>`<div class="s61-grade" data-g="${i}"><h3>${g.name} 100명<small>도움이 필요한 학생 ${g.need}명</small></h3>
   <label class="md-slider" style="grid-template-columns:4.4em 1fr 6.6em">추천 인원<input type="range" min="0" max="100" step="5" aria-label="${g.name} 추천 인원"><output></output></label>
   <div class="s61-unit" aria-hidden="true"></div>
   <ul class="md-list"><li><span>놓친 학생 (필요한 ${g.need}명 중)</span><b data-f="miss"></b></li><li><span>잘못 선정 (나머지 ${100-g.need}명 중)</span><b data-f="wrong"></b></li><li><span data-f="of"></span><b data-f="mean"></b></li></ul></div>`).join('')}</div>
   <p class="s61-legend" style="margin-top:auto"><span>한 칸은 학생 1명</span><span><i data-k="hit"></i>필요하고 추천받음</span><span><i data-k="miss"></i>필요한데 놓침</span><span><i data-k="wrong"></i>필요하지 않은데 선정</span><span><i data-k="rest"></i>필요하지 않고 추천받지 않음</span></p></div>
   <div class="md-panel"><h3>세 기준으로 보면</h3><ul class="md-list s61-crit" id="s61-cr-list"></ul>
   <h3 style="margin-top:auto">슬라이드의 두 방식</h3><div class="md-chips"><button type="button" class="md-chip" data-set="50,20">필요한 학생을 정확히 추천</button><button type="button" class="md-chip" data-set="35,35">두 학년 모두 35%로 추천</button></div></div></div>`,
  state:()=>({n:[50,20]}),
  render(ui,st,reset){
   ui.action('처음 값으로',reset);
   const pct=(a,b)=>Math.round(a/b*100);
   function draw(){
    const r=GRADES.map((g,i)=>{const n=st.n[i],hit=Math.min(n,g.need);return {n,hit,miss:g.need-hit,wrong:n-hit,need:g.need,rest:100-g.need}});
    r.forEach((v,i)=>{
     const box=ui.q(`.s61-grade[data-g="${i}"]`),set=(f,t)=>box.querySelector(`[data-f=${f}]`).textContent=t;
     box.querySelector('input').value=v.n;box.querySelector('output').textContent=`${v.n}명 (${v.n}%)`;
     box.querySelector('.s61-unit').innerHTML=['hit','miss','wrong','rest'].map(k=>`<span data-k="${k}"></span>`.repeat(k==='rest'?v.rest-v.wrong:v[k])).join('');
     set('miss',`${v.miss}명, ${pct(v.miss,v.need)}%`);set('wrong',`${v.wrong}명, ${pct(v.wrong,v.rest)}%`);set('of',`필요한 학생 (추천 ${v.n}명 중)`);set('mean',v.n?`${v.hit}명, ${pct(v.hit,v.n)}%`:'추천 없음');
    });
    const [a,b]=r,ratio=a.n===b.n,error=a.miss*b.need===b.miss*a.need&&a.wrong*b.rest===b.wrong*a.rest,meaning=a.n&&b.n?a.hit*b.n===b.hit*a.n:null;
    const row=(name,detail,ok)=>`<li><span><b>${name}</b><small>${detail}</small></span><em data-ok="${ok===null?'na':ok}">${ok===null?'비교 불가':ok?'같음':'다름'}</em></li>`;
    ui.q('#s61-cr-list').innerHTML=row('결과 비율의 동일',`추천 비율 ${a.n}%와 ${b.n}%`,ratio)
     +row('오류율의 동일',`놓친 비율 ${pct(a.miss,a.need)}%와 ${pct(b.miss,b.need)}%, 잘못 뽑은 비율 ${pct(a.wrong,a.rest)}%와 ${pct(b.wrong,b.rest)}%`,error)
     +row('점수 의미의 동일',meaning===null?'추천받은 학생이 없는 학년이 있음':`추천받은 학생 중 필요한 학생 ${pct(a.hit,a.n)}%와 ${pct(b.hit,b.n)}%`,meaning);
    ui.say(a.n===0&&b.n===0?`아무도 추천하지 않으면 추천 비율과 오류율은 같아지지만 도움이 필요한 ${a.need+b.need}명을 모두 놓칩니다.`
     :a.n===100&&b.n===100?`모두 추천하면 추천 비율과 오류율은 같아지지만 필요하지 않은 ${a.rest+b.rest}명까지 선정되어 추천의 의미가 달라집니다.`
     :ratio&&!error?`추천 비율을 맞추자 오류율이 달라졌습니다. 놓친 학생은 1학년 ${a.miss}명과 2학년 ${b.miss}명, 잘못 선정은 1학년 ${a.wrong}명과 2학년 ${b.wrong}명입니다.`
     :error&&!ratio?`오류율은 같지만 추천 비율이 ${a.n}%와 ${b.n}%로 다릅니다. 실제로 도움이 필요한 학생의 비율이 학년마다 다르기 때문입니다.`
     :meaning?'추천받은 학생 중 필요한 학생의 비율은 같지만 추천 비율과 오류율이 다릅니다. 한 기준을 맞추면 다른 기준에서 차이가 생깁니다.'
     :'추천 비율과 오류율이 모두 다릅니다. 추천 인원을 바꾸어 한 기준씩 맞추어 보세요.');
   }
   ui.body.addEventListener('input',e=>{const box=e.target.closest('.s61-grade');if(box&&e.target.type==='range'){st.n[Number(box.dataset.g)]=Number(e.target.value);draw()}});
   ui.body.addEventListener('click',e=>{const b=e.target.closest('[data-set]');if(b){st.n=b.dataset.set.split(',').map(Number);draw()}});draw();
  }});

 // Three situations in the deck's own terms. Each option is the first question of one of the three views on the slide before.
 const VIEWS={u:{name:'공리주의',key:'결과',rule:'가장 많은 사람에게 가장 큰 이익',ask:'전체 학생의 학습 효과가 가장 커지는가'},
  d:{name:'의무론',key:'의무와 원칙',rule:'결과와 관계없이 지켜야 할 규칙',ask:'한 사람이라도 수단으로 대하지 않는가'},
  v:{name:'덕 윤리',key:'성품',rule:'좋은 사람이라면 할 행동',ask:'신중하고 정직한 교사라면 어떻게 쓸까'}};
 const CASES=[
  {name:'보충 학습 추천',q:'보충 학습 대상을 AI 추천으로 정하면 전체 성적은 오르지만, 접속 기록이 적은 학생 몇 명이 대상에서 빠집니다.',options:[['d','모든 학생을 동등하게 대한다는 원칙에 어긋나지 않는가'],['u','전체 성적이 오르는 이익이 빠진 학생의 피해보다 큰가'],['v','신중한 교사라면 추천 결과를 확인한 뒤 판단하는가']]},
  {name:'AI 사용 사실 알리기',q:'AI로 만든 학습 자료의 반응이 좋습니다. AI 사용 사실을 밝히면 자료를 덜 믿는 사람이 생길 수 있습니다.',options:[['v','정직한 교사라면 AI 사용 사실과 한계를 숨기지 않는가'],['d','반응과 관계없이 사용 사실을 알린다는 규칙을 지키는가'],['u','밝힐 때와 밝히지 않을 때 학생이 얻는 이익은 어느 쪽이 큰가']]},
  {name:'자율주행차의 규칙',q:'자율주행차가 피할 수 없는 사고에서 보행자와 탑승자 중 누구를 보호할지, 설계자가 미리 규칙으로 정해야 합니다.',options:[['u','피해를 입는 사람의 수가 가장 적어지는가'],['v','책임 있는 설계자라면 결정의 이유를 스스로 설명할 수 있는가'],['d','수와 관계없이 한 사람이라도 수단으로 대하지 않는가']]}];
 L.add('s61Views','custom',{
  hint:'세 상황에서 <b>가장 먼저 따질 질문</b>을 고르면 세 관점 가운데 어디에 가까운지 보여 줍니다. 상황은 이 활동을 위해 만든 예시이며 정해진 답은 없습니다.',
  body:'<div class="md-quiz" id="s61-vw"></div>',
  state:()=>({i:0,picks:[]}),
  render(ui,st,reset){
   const box=ui.q('#s61-vw'),next=ui.action('다음',()=>{st.i++;draw()},true);ui.action('처음부터',reset);
   function draw(){
    if(st.i>=CASES.length){
     box.innerHTML=`<div class="s61-views">${Object.entries(VIEWS).map(([id,v])=>{const mine=CASES.filter((c,i)=>st.picks[i]===id).map(c=>c.name),n=mine.length;
      return `<div class="md-panel"><h3>${v.name} (${v.key})</h3><p class="s61-count">세 상황 중 ${n}번 선택</p><div class="md-meter" aria-hidden="true"><i style="width:${n/CASES.length*100}%"></i></div><p><span>판단 기준</span>${v.rule}</p><p><span>AI 활용에서 묻는 질문</span>${v.ask}</p><p style="margin-top:auto"><span>이 관점의 질문을 고른 상황</span>${mine.join(', ')||'없음'}</p></div>`}).join('')}</div>`;
     next.hidden=true;ui.say('윤리 이론마다 판단하는 기준이 다릅니다. 고르지 않은 관점의 질문으로 같은 상황을 다시 살펴보세요.','good');return;
    }
    const c=CASES[st.i],pick=st.picks[st.i],done=pick!==undefined;
    box.innerHTML=`<p class="md-count">상황 ${st.i+1} / ${CASES.length}</p><p class="s61-case">${esc(c.q)} 무엇을 가장 먼저 따질까요?</p>
     <div class="md-choices s61-opts" style="--n:3">${c.options.map(([id,text])=>`<button type="button" class="md-choice" data-id="${id}" ${done?`disabled aria-pressed="${id===pick}"`:''}>${esc(text)}${done?`<small>${VIEWS[id].name} (${VIEWS[id].key})</small>`:''}</button>`).join('')}</div>
     ${done?`<p class="md-why">내 선택은 ${VIEWS[pick].name} 관점에 가깝습니다. 이 관점의 판단 기준은 '${VIEWS[pick].rule}'입니다.</p>`:''}`;
    next.hidden=!done;next.textContent=st.i===CASES.length-1?'결과 보기':'다음';
    ui.say(done?'다른 두 질문은 어느 관점에서 나온 것인지도 확인해 보세요.':'질문 하나를 고르세요.');
   }
   box.addEventListener('click',e=>{const b=e.target.closest('.md-choice');if(b&&st.picks[st.i]===undefined){st.picks[st.i]=b.dataset.id;draw()}});draw();
  }});

 L.add('s61Principle','match',{hint:'교육분야 인공지능 윤리원칙 여섯 가지와 학교 장면을 짝지어 봅니다. 장면은 이 활동을 위해 만든 예시입니다.',leftTitle:'교육분야 인공지능 윤리원칙',rightTitle:'학교 장면 예시',seed:13,pairs:[
  {left:'학습자의 주도성과 다양성 보장',right:'AI가 추천한 과제를 학생이 스스로 고르고 바꿀 수 있게 한다'},
  {left:'교수자의 전문성 존중',right:'AI 결과는 참고 자료로 두고 최종 판단은 교사가 내린다'},
  {left:'교육의 기회균등과 공정성 보장',right:'기기가 없는 학생이 보충 학습 대상에서 빠지지 않았는지 살핀다'},
  {left:'교육당사자의 안전 보장',right:'학생에게 해로운 내용이 나오지 않는지 수업 전에 확인한다'},
  {left:'데이터 처리의 투명성과 설명 가능',right:'추천이 어떤 기록을 근거로 나왔는지 학생과 보호자에게 설명한다'},
  {left:'합목적적 활용과 프라이버시 보호',right:'학습 추천을 위해 모은 기록을 다른 목적에 쓰지 않는다'}]});

 L.add('s61Law','checklist',{hint:'수업이나 업무에 쓰는 AI 도구 하나를 떠올리고, 조항에서 나온 다섯 가지 확인 질문에 답해 봅니다.',head:['조항','학교에서 확인할 질문'],scale:['그렇다','확인 중','아니다, 모름'],
  lowest:'사업자에게 먼저 확인할 항목:',allGood:'다섯 질문 모두 확인했습니다. 확인한 근거가 약관과 화면 어디에 있는지 적어 두세요.',items:[
  {label:'제31조 투명성',question:'학생과 보호자가 AI 사용을 아는가'},{label:'제33조 고영향 확인',question:'학생 평가에 쓰이는 도구인가'},
  {label:'제34조 사업자 책무',question:'결과의 근거와 정정 절차가 있는가'},{label:'제35조 영향평가',question:'도입 전 평가 결과를 볼 수 있는가'},
  {label:'제43조 과태료',question:'약관과 화면에 고지가 있는가'}]});

 L.add('s61Analysis','sort',{soft:true,hint:'사례 E 학습 추천을 분석한 메모 여섯 장을 분석표의 다섯 항목에 놓아 봅니다. 메모는 이 활동을 위해 만든 예시입니다.',
  bins:[{id:'source',label:'편향의 원천'},{id:'people',label:'영향받는 사람'},{id:'criteria',label:'공정성 기준'},{id:'rule',label:'윤리 원칙과 법'},{id:'fix',label:'개선 방법'}],cards:[
  {id:'a',label:'학습 참여를 접속 시간만으로 판단함',answer:'source',why:'대리 지표를 고른 설계 단계에서 생긴 편향입니다.'},
  {id:'b',label:'기기가 없는 학생이 보충 학습 기회를 놓침',answer:'people',why:'누가 어떤 기회에서 불리해졌는지를 적은 메모입니다.'},
  {id:'c',label:'도움이 필요한 학생을 놓친 비율을 비교함',answer:'criteria',why:'오류율의 동일이라는 기준으로 보면 문제가 드러납니다.'},
  {id:'d',label:'교육의 기회균등과 공정성 보장 원칙',answer:'rule',why:'교육분야 인공지능 윤리원칙의 5번 원칙과 연결됩니다.'},
  {id:'e',label:'학생 평가에 쓴다면 고영향 여부를 확인함',answer:'rule',why:'인공지능 기본법은 학생 평가를 고영향 인공지능 영역에 포함합니다.'},
  {id:'f',label:'접속 기록에 교사 관찰을 더해 판단함',answer:'fix',why:'설계 단계에서 근거를 바꾸는 개선 방법입니다. 바꾼 뒤에 남는 것도 함께 적습니다.'}]});
})();
