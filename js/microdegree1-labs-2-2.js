/* 2주차 오후, 인공지능의 능력과 한계: activity slides. Toy data, sample sentences and model rules marked as examples are written for these activities. */
(()=>{
 'use strict';
 const L=window.ceLabs;if(!L)return;const esc=L.esc;
 L.style(`.md-lab .s22-tasks{flex:1;min-height:0;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));grid-template-rows:repeat(4,minmax(0,1fr));grid-auto-flow:column;gap:.5em 1.2em}
.md-lab .s22-task{display:flex;align-items:center;gap:.6em;min-height:0;padding:.3em .7em;border:1px solid #b9c6e6;border-radius:.6em;background:#f6f8fd;font-size:.9em;line-height:1.3}
.md-lab .s22-no{flex:none;display:grid;place-items:center;width:1.6em;height:1.6em;border-radius:50%;background:#3f5dae;color:#fff;font-size:.85em}
.md-lab .s22-name{flex:1;min-width:0}.md-lab .s22-who{flex:none;display:flex;gap:.3em}
.md-lab .s22-pill{min-width:3.3em;padding:.3em .55em;border:1px solid #9fb0dc;border-radius:.5em;background:#fff;color:#2c478f;font-size:.9em;line-height:1.3;text-align:center;cursor:pointer;white-space:nowrap}
.md-lab .s22-pill:disabled{cursor:default;color:#1c2c4c}.md-lab .s22-pill.s22-res{background:#3f5dae;border-color:#3f5dae;color:#fff;font-weight:800}
.md-lab .s22-sum{grid-template-columns:repeat(3,minmax(0,1fr))}
.md-lab .s22-plot{flex:1;min-height:0;width:100%}
.md-lab .s22-wide{grid-template-columns:7em 1fr 3.8em}.md-lab .s22-narrow{grid-template-columns:5.6em 1fr 1.8em}
.md-lab .s22-line{display:flex;align-items:center;gap:.5em;font-size:.88em;line-height:1.35;cursor:pointer}
.md-lab .s22-animal{flex:1;min-height:0;width:100%}
.md-lab .s22-bars{display:grid;gap:.5em}.md-lab .s22-bar{display:grid;grid-template-columns:3.6em 1fr 3em;align-items:center;gap:.5em;font-size:.9em}.md-lab .s22-bar b{text-align:right;color:#2c478f}
.md-lab .s22-result{margin-top:auto;padding:.4em;border-radius:.6em;background:#ebf0fc;color:#2c478f;font-size:1.25em;font-weight:800;text-align:center}
.md-lab .s22-result[data-tone=bad]{background:#fdeceb;color:#b5372f}.md-lab .s22-result[data-tone=warn]{background:#fff7df;color:#8a5a00}
.md-lab .s22-recs{flex:1;min-height:0;display:grid;grid-auto-rows:minmax(0,1fr);gap:.35em;margin:0;padding:0;list-style:none}
.md-lab .s22-rec{display:grid;grid-template-columns:1.5em minmax(0,1fr) 7em auto auto;align-items:center;gap:.5em;padding:0 .6em;border:1px solid #d5ddf1;border-radius:.5em;background:#fff;font-size:.86em;line-height:1.25}
.md-lab .s22-rec>span:first-child{color:#6b7896;text-align:center}.md-lab .s22-rec small{margin-left:.6em;padding:.05em .55em;border-radius:99em;background:#ebf0fc;color:#2c478f}
.md-lab .s22-rec .md-btn{padding:.2em .7em;font-size:.92em}
.md-lab .s22-chat{align-self:flex-end;max-width:90%;padding:.35em .9em;border-radius:.8em;background:#3f5dae;color:#fff;font-size:.9em}
.md-lab .s22-answer{padding:.6em .8em;border:1px solid #b9c6e6;border-radius:.6em;background:#fff;font-size:1.08em;line-height:1.9}
.md-lab .s22-blank{display:inline-block;min-width:3.4em;border-bottom:.12em solid #9fb0dc;color:#6b7896;text-align:center}
.md-lab .s22-word{padding:.05em .45em;border:1px solid #9fb0dc;border-radius:.4em;background:#ebf0fc;color:#1c2c4c;font-weight:800;cursor:pointer}.md-lab .s22-word:disabled{cursor:default;color:#1c2c4c}
.md-lab .s22-note{font-size:.8em;color:#52607f;line-height:1.4}
.md-lab .s22-train{display:grid;grid-template-columns:3.6em repeat(6,minmax(0,1fr));align-items:center;gap:.35em;font-size:.88em}.md-lab .s22-train b{color:#2c478f}
.md-lab .s22-photo{position:relative;display:grid;place-items:center;aspect-ratio:1;border:1px solid #9fb0dc;border-radius:.4em;overflow:hidden}
.md-lab .s22-photo svg{width:78%;height:78%}
.md-lab .s22-photo[data-bg=snow]{background:#eef4fb radial-gradient(circle,#fff 22%,transparent 24%) 0 0/.6em .6em}.md-lab .s22-photo[data-bg=grass]{background:#bfe0a6}
.md-lab .s22-photo[data-focus=bg]{box-shadow:inset 0 0 0 .28em #f0a202}.md-lab .s22-photo[data-focus=bg] svg{opacity:.3}
.md-lab .s22-photo[data-focus=shape]::after{content:'';position:absolute;inset:7%;border:.22em solid #f0a202;border-radius:50%}
.md-lab .s22-tests{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.5em}
.md-lab .s22-test{display:grid;grid-template-columns:3.6em minmax(0,1fr);align-items:center;gap:.6em;padding:.35em .5em;border:1px solid #d5ddf1;border-radius:.5em;background:#fff;font-size:.82em;line-height:1.35}
.md-lab .s22-test b{display:block;color:#2c478f}
.md-lab .s22-share{display:flex;flex:none;height:1.7em;border-radius:99em;overflow:hidden;background:#dfe7fa;font-size:.78em;line-height:1.7;color:#fff;text-align:center;white-space:nowrap}
.md-lab .s22-share i{font-style:normal;background:#f0a202;color:#3a2a00}.md-lab .s22-share i+i{background:#3f5dae;color:#fff}
.md-lab .s22-rows{flex:1;min-height:0;display:grid;grid-template-rows:auto repeat(3,minmax(0,1fr));gap:.5em}
.md-lab .s22-row{display:grid;grid-template-rows:auto minmax(0,1fr);gap:.25em;min-height:0}.md-lab .s22-row>b{font-size:.84em;color:#2c478f}
.md-lab .s22-row .md-choices{min-height:0}.md-lab .s22-row .md-choice{padding:.3em .6em;font-size:.84em;line-height:1.35}
.md-lab .s22-draft{display:grid;gap:.35em;padding:.6em .8em;border:1px solid #b9c6e6;border-radius:.6em;background:#fff;font-size:.9em;line-height:1.45}.md-lab .s22-draft span[data-empty=true]{color:#8b96b0}`);

 // The eight task cards of the prediction activity with the result and reason given on the next two slides.
 const WHO={ai:'AI',human:'사람',both:'함께'},KEY='s22-tasks';
 const TASKS=[['사진 1만 장에서 고양이 사진 골라내기','ai','비슷한 사진을 학습한 분류 모델은 지치지 않고 같은 기준을 적용합니다.'],['처음 간 집 부엌에서 컵을 찾아 물 따르기','human','처음 보는 공간에서 물체를 찾고 힘을 조절하는 일은 로봇에게 어렵습니다.'],
  ['1년 치 급식 잔반 기록에서 요일별 경향 찾기','ai','많은 기록에서 반복되는 패턴을 빠르게 계산합니다.'],['‘참 잘했다’가 칭찬인지 비꼼인지 알아차리기','human','말투, 표정, 두 사람의 관계라는 맥락이 필요합니다.'],
  ['한국어 안내문을 영어로 초벌 번역하기','both','빠른 초안은 AI가 만들고 고유명사와 문화 맥락은 사람이 확인합니다.'],['바둑 대국에서 이기기','ai','2016년 알파고가 이세돌 9단에게 4승 1패로 이겼습니다.'],
  ['낯선 공사 현장에서 안내원 손짓 보고 운전하기','human','학습 자료에 드문 상황이며 사람의 의도를 읽어야 합니다.'],['다툰 두 학생 중 먼저 사과할 사람 정하기','human','무엇이 공정한지는 가치 판단이며 결과의 책임도 사람에게 있습니다.']];
 const guesses=()=>{const m=L.memory.get(KEY);return m&&typeof m==='object'?m:{}};

 L.add('taskPredict','custom',{
  hint:'여덟 가지 과제마다 <b>AI</b>, <b>사람</b>, <b>함께</b> 중 누가 더 잘할지 예상해 누릅니다. 결과는 뒤에서 확인합니다.',
  body:`<div class="s22-tasks">${TASKS.map((t,i)=>`<div class="s22-task"><span class="s22-no">${i+1}</span><span class="s22-name">${t[0]}</span><span class="s22-who">${Object.entries(WHO).map(([k,v])=>`<button type="button" class="s22-pill" data-i="${i}" data-who="${k}">${v}</button>`).join('')}</span></div>`).join('')}</div><ul class="md-list s22-sum"></ul>`,
  state:()=>({picks:guesses()}),
  render(ui,st,reset){
   ui.action('처음부터',()=>{L.memory.set(KEY,null);reset()});
   function draw(){
    L.memory.set(KEY,st.picks);
    ui.all('.s22-pill').forEach(b=>b.setAttribute('aria-pressed',String(st.picks[b.dataset.i]===b.dataset.who)));
    const n=TASKS.filter((_,i)=>st.picks[i]).length;
    ui.q('.s22-sum').innerHTML=Object.entries(WHO).map(([k,v])=>`<li><span>${v}</span><b>${TASKS.filter((_,i)=>st.picks[i]===k).length}개</b></li>`).join('');
    ui.say(n<TASKS.length?`여덟 과제 중 ${n}개를 예상했습니다. 함께는 AI가 초안을 만들고 사람이 확인하는 분업입니다.`:'예상을 모두 기록했습니다. 그렇게 생각한 이유를 한 문장으로 말해 본 뒤 결과를 확인합니다.',n===TASKS.length?'good':'');
   }
   ui.body.addEventListener('click',e=>{const b=e.target.closest('.s22-pill');if(!b)return;if(st.picks[b.dataset.i]===b.dataset.who)delete st.picks[b.dataset.i];else st.picks[b.dataset.i]=b.dataset.who;draw()});
   draw();
  }});

 L.add('taskReview','custom',{
  hint:'과제를 누르면 <b>결과와 근거</b>가 나옵니다. 예상이 없는 과제는 먼저 예상 칸을 눌러 고를 수 있습니다. 조건에 따라 결과는 달라질 수 있습니다.',
  body:'<div class="s22-tasks"></div>',
  state:()=>({picks:guesses(),shown:[],why:null}),
  render(ui,st,reset){
   if(!st.shown.length)st.picks={...guesses()};
   const all=ui.action('모두 확인',()=>{st.shown=TASKS.map((_,i)=>i);st.why=null;draw()},true);ui.action('다시 하기',reset);
   function draw(){
    ui.q('.s22-tasks').innerHTML=TASKS.map((t,i)=>{const open=st.shown.includes(i),mine=st.picks[i];
     return `<div class="s22-task" data-i="${i}" ${open&&mine?`data-result="${mine===t[1]?'right':'wrong'}"`:''} style="cursor:pointer"><span class="s22-no">${i+1}</span><span class="s22-name">${t[0]}</span>
      <span class="s22-who"><button type="button" class="s22-pill s22-guess" data-i="${i}" ${open?'disabled':''}>예상 ${mine?WHO[mine]:'없음'}</button><button type="button" class="s22-pill ${open?'s22-res':''}" data-i="${i}">${open?'결과 '+WHO[t[1]]:'결과 보기'}</button></span></div>`}).join('');
    all.disabled=st.shown.length===TASKS.length;
    const guessed=st.shown.filter(i=>st.picks[i]),same=guessed.filter(i=>st.picks[i]===TASKS[i][1]).length;
    ui.say(st.why!==null?`${st.why+1}번 결과는 ${WHO[TASKS[st.why][1]]}. ${TASKS[st.why][2]}`
     :st.shown.length<TASKS.length?'과제를 눌러 결과와 근거를 확인하세요.'
     :guessed.length?`예상한 ${guessed.length}개 가운데 ${same}개가 결과와 같습니다. 예상과 달랐던 과제를 눌러 근거의 조건을 확인해 보세요.`:'결과를 모두 확인했습니다. 과제를 누르면 근거가 나옵니다. 사람이 더 잘하는 과제의 공통점은 무엇일까요?',st.shown.length===TASKS.length&&st.why===null?'good':'');
   }
   ui.body.addEventListener('click',e=>{
    const guess=e.target.closest('.s22-guess'),row=e.target.closest('.s22-task');if(!row)return;const i=Number(row.dataset.i);
    if(guess&&!guess.disabled){const order=['ai','human','both'];st.picks[i]=order[(order.indexOf(st.picks[i])+1)%3];L.memory.set(KEY,st.picks);st.why=null}
    else{if(!st.shown.includes(i))st.shown.push(i);st.why=i}
    draw();
   });
   draw();
  }});

 // Thirty made-up summer days: temperature drives both ice cream sales and swimming accidents.
 const dice=(s=>()=>(s=(s*1103515245+12345)&0x7fffffff)/0x7fffffff)(11),DAYS=Array.from({length:30},()=>[dice()*12-6,dice()*2-1,dice()*2-1]);
 L.add('causeSim','custom',{
  hint:'점 하나는 하루입니다. <b>기온</b>과 <b>아이스크림 판매</b>를 각각 바꾸어 물놀이 사고가 어떻게 달라지는지 봅니다. 수치는 활동용 예시입니다.',
  body:`<div class="md-split" style="--split:1.35fr 1fr"><div class="md-panel"><h3>아이스크림 판매와 물놀이 사고 (30일)</h3><svg class="s22-plot" viewBox="0 0 520 320" role="img" aria-label="하루 아이스크림 판매량과 물놀이 사고 건수의 산점도"></svg></div>
   <div class="md-panel"><label class="md-slider s22-wide">평균 기온<input type="range" data-k="temp" min="22" max="32" step="1"><output></output></label>
   <label class="md-slider s22-wide">판매 줄이기<input type="range" data-k="cut" min="0" max="80" step="10"><output></output></label>
   <label class="s22-line"><input type="checkbox" data-k="show">기온을 점의 색으로 표시(붉을수록 더운 날)</label>
   <ul class="md-list" id="s22-cause"></ul><div class="s22-result" id="s22-cause-say"></div></div></div>`,
  state:()=>({temp:27,cut:0,show:false,last:''}),
  render(ui,st,reset){
   ui.action('처음 값으로',reset);
   const X=v=>70+v/600*430,Y=v=>275-v/9*250,mix=k=>`rgb(${[[63,194],[93,65],[174,59]].map(([a,b])=>Math.round(a+(b-a)*k)).join(',')})`;
   function draw(){
    const days=DAYS.map(([dt,ns,na])=>{const t=st.temp+dt,full=Math.max(0,20*(t-14)+40*ns);return {t,full,sale:full*(1-st.cut/100),acc:Math.max(0,.4*(t-18)+na)}});
    const mean=k=>days.reduce((n,d)=>n+d[k],0)/days.length,acc=Math.round(mean('acc')*10)/10;
    ui.q('.s22-plot').innerHTML=[0,200,400,600].map(v=>`<line x1="${X(v)}" x2="${X(v)}" y1="25" y2="275" stroke="#e3e8f5"/><text x="${X(v)}" y="292" text-anchor="middle" font-size="12" fill="#52607f">${v}</text>`).join('')
     +[0,3,6,9].map(v=>`<line x1="70" x2="500" y1="${Y(v)}" y2="${Y(v)}" stroke="#e3e8f5"/><text x="62" y="${Y(v)+4}" text-anchor="end" font-size="12" fill="#52607f">${v}</text>`).join('')
     +`<text x="285" y="313" text-anchor="middle" font-size="13" fill="#52607f">하루 아이스크림 판매(개)</text><text x="16" y="150" text-anchor="middle" font-size="13" fill="#52607f" transform="rotate(-90 16 150)">물놀이 사고(건)</text>
      <line x1="70" x2="500" y1="${Y(mean('acc'))}" y2="${Y(mean('acc'))}" stroke="#c2413b" stroke-dasharray="5 4"/><text x="498" y="${Y(mean('acc'))-5}" text-anchor="end" font-size="12" fill="#b5372f">하루 평균 사고 ${acc}건</text>`
     +(st.cut?days.map(d=>`<circle cx="${X(d.full).toFixed(1)}" cy="${Y(d.acc).toFixed(1)}" r="5" fill="none" stroke="#b9c6e6"/>`).join(''):'')
     +days.map(d=>`<circle cx="${X(d.sale).toFixed(1)}" cy="${Y(d.acc).toFixed(1)}" r="5.5" fill="${st.show?mix(Math.min(1,Math.max(0,(d.t-16)/22))):'#3f5dae'}" fill-opacity=".85"/>`).join('');
    ui.all('[data-k]').forEach(n=>{if(n.type==='checkbox')n.checked=st.show;else{n.value=st[n.dataset.k];n.nextElementSibling.textContent=n.dataset.k==='temp'?st.temp+'℃':st.cut?st.cut+'% 줄임':'그대로'}});
    ui.q('#s22-cause').innerHTML=[['하루 평균 판매',Math.round(mean('sale'))+'개'],['하루 평균 사고',acc+'건']].map(([a,b])=>`<li><span>${a}</span><b>${b}</b></li>`).join('');
    const box=ui.q('#s22-cause-say');box.textContent=st.cut?'판매만 줄고 사고는 그대로':st.last==='temp'?'기온이 두 값을 함께 바꿈':'두 값이 함께 늘어남';box.dataset.tone=st.cut?'bad':'';
    ui.say(st.cut?`판매를 ${st.cut}% 줄여도 사고는 하루 평균 ${acc}건 그대로입니다. 두 값은 함께 변할 뿐 판매가 사고의 원인은 아닙니다.`
     :st.last==='temp'?'기온을 바꾸면 판매와 사고가 함께 변합니다. 더운 날씨가 두 값을 함께 늘리는 숨은 원인입니다.'
     :'판매가 많은 날에 사고도 많습니다. 판매를 줄이면 사고가 줄어들까요? 오른쪽에서 직접 바꾸어 보세요.',st.cut?'bad':'');
   }
   ui.body.addEventListener('input',e=>{const k=e.target.dataset.k;if(!k)return;if(k==='show')st.show=e.target.checked;else{st[k]=Number(e.target.value);st.last=k}draw()});draw();
  }});

 L.add('fourCheck','checklist',{hint:'AI에게 맡기려는 일 하나를 떠올리고 네 질문에 답해 봅니다. 맡기기 전에 무엇부터 살펴야 할까요?',head:['질문','AI에게 일을 맡기기 전에 확인할 내용'],scale:['그렇다','부분적','아니다, 모름'],
  lowest:'맡기기 전에 먼저 살필 질문:',allGood:'네 질문을 모두 통과했습니다. 그래도 AI의 답은 한 번 더 확인하고 중요한 결정은 사람이 합니다.',items:[
  {label:'목표',question:'무엇을 맞히거나 만들지 분명하게 정해져 있다'},{label:'데이터',question:'비슷한 예시가 충분하고 그 정답을 믿을 수 있다'},
  {label:'상황',question:'지금 쓰는 상황이 학습했던 상황과 비슷하다'},{label:'확인',question:'틀렸을 때 알아차리고 고칠 수 있다'}]});

 // A toy classifier on three hand-set features. It can only answer with a category it was trained on.
 const CATS=[['개',v=>.45*(v[1]-5)+.3*(v[2]-5)],['고양이',v=>-.45*(v[1]-5)-.3*(v[2]-5)+.1*(v[0]-3)],['토끼',v=>1.2*(v[0]-6.5)]];
 const SHOTS={dog:['개 사진',[3,8,7]],cat:['고양이 사진',[3,2,3]],rabbit:['토끼 사진',[10,3,2]],blur:['흐린 사진',[3,5,6]]},FEATURES=['귀 길이','주둥이 길이','몸 크기'];
 L.add('classifySim','custom',{
  hint:'개와 고양이만 배운 분류 모델입니다. 입력을 바꾸어 <b>범주별 가능성</b>과 결과를 봅니다. 특징과 계산식은 원리를 보기 위한 예시입니다.',
  body:`<div class="md-split" style="--split:1fr 1.05fr 1.05fr"><div class="md-panel"><h3>1. 입력</h3><svg class="s22-animal" viewBox="0 0 200 230" role="img" aria-label="특징 값에 따라 달라지는 동물 그림"></svg>
   <div class="md-chips">${Object.entries(SHOTS).map(([k,s])=>`<button type="button" class="md-chip" data-shot="${k}">${s[0]}</button>`).join('')}</div></div>
   <div class="md-panel"><h3>2. 특징</h3>${FEATURES.map((f,i)=>`<label class="md-slider s22-narrow">${f}<input type="range" data-f="${i}" min="0" max="10" step="1"><output></output></label>`).join('')}
   <label class="s22-line" style="margin-top:.4em"><input type="checkbox" id="s22-rabbit">범주에 토끼를 더해 다시 학습</label>
   <div class="s22-note" style="margin-top:auto">모델은 그림이 아니라 특징의 수치로 범주마다 가능성을 계산합니다.</div></div>
   <div class="md-panel"><h3>3. 범주별 가능성과 결과</h3><div class="s22-bars"></div><div class="s22-result"></div></div></div>`,
  state:()=>({shot:'dog',v:[...SHOTS.dog[1]],rabbit:false}),
  render(ui,st,reset){
   ui.action('처음부터',reset);
   function draw(){
    const [e,s,b]=st.v,ear=5+3.3*e,snout=[8+1.6*s,7+.9*s],body=18+2*b,fill='#c9d3ec',line='stroke="#3f5dae" stroke-width="2.5"';
    const pic=ui.q('.s22-animal');pic.style.filter=st.shot==='blur'?'blur(.16em)':'';
    pic.innerHTML=`<ellipse cx="100" cy="${134+body}" rx="${28+3.5*b}" ry="${body}" fill="${fill}" ${line}/><ellipse cx="80" cy="${92-ear*.8}" rx="10" ry="${ear}" fill="${fill}" ${line}/><ellipse cx="120" cy="${92-ear*.8}" rx="10" ry="${ear}" fill="${fill}" ${line}/>
     <circle cx="100" cy="110" r="32" fill="${fill}" ${line}/><ellipse cx="100" cy="122" rx="${snout[0]}" ry="${snout[1]}" fill="#fff" ${line}/><circle cx="100" cy="${122-snout[1]*.4}" r="4" fill="#1c2c4c"/><circle cx="87" cy="99" r="3.5" fill="#1c2c4c"/><circle cx="113" cy="99" r="3.5" fill="#1c2c4c"/>`;
    ui.all('[data-shot]').forEach(c=>c.setAttribute('aria-pressed',String(c.dataset.shot===st.shot)));
    ui.all('[data-f]').forEach(n=>{n.value=st.v[n.dataset.f];n.nextElementSibling.textContent=st.v[n.dataset.f]});ui.q('#s22-rabbit').checked=st.rabbit;
    const cats=CATS.slice(0,st.rabbit?3:2),ex=cats.map(c=>Math.exp(c[1](st.v))),sum=ex.reduce((a,x)=>a+x,0),p=ex.map(x=>Math.round(x/sum*100)),top=p.indexOf(Math.max(...p)),name=cats[top][0];
    ui.q('.s22-bars').innerHTML=cats.map((c,i)=>`<div class="s22-bar"><span>${c[0]}</span><div class="md-meter"><i style="width:${p[i]}%"></i></div><b>${p[i]}%</b></div>`).join('');
    const outside=st.shot==='rabbit'&&!st.rabbit,unsure=p[top]<70,box=ui.q('.s22-result');
    box.textContent=`결과: ${name}`;box.dataset.tone=outside?'bad':unsure?'warn':'';
    ui.say(outside?`토끼를 넣어도 모른다고 답하지 않습니다. 정해진 범주 가운데 가장 비슷한 ${name}를 ${p[top]}% 가능성으로 답합니다.`
     :unsure?`가장 높은 범주의 가능성이 ${p[top]}%입니다. 확실한 답으로 받아들이지 말고 다른 후보를 확인하거나 다른 각도로 다시 입력합니다.`
     :st.shot==='rabbit'?'범주에 토끼가 있을 때에만 토끼라고 답할 수 있습니다. 분류 모델은 항상 정해진 범주 안에서 답을 고릅니다.'
     :`범주마다 가능성을 계산해 가장 높은 ${name}를 출력합니다. 토끼 사진이나 흐린 사진을 넣으면 어떻게 될까요?`,outside?'bad':'');
   }
   ui.body.addEventListener('click',e=>{const c=e.target.closest('[data-shot]');if(c){st.shot=c.dataset.shot;st.v=[...SHOTS[st.shot][1]];draw()}});
   ui.body.addEventListener('input',e=>{if(e.target.dataset.f){st.v[e.target.dataset.f]=Number(e.target.value);st.shot='';draw()}else if(e.target.id==='s22-rabbit'){st.rabbit=e.target.checked;draw()}});
   draw();
  }});

 // Made-up video titles in four fields. A score rises with the watch record of the same field and items are listed by score.
 const FIELDS=['과학','요리','운동','음악'],TITLES=[['화산 모형 실험','달의 모양 변화','자석 놀이','물의 순환','식물 관찰','별자리 찾기'],['김밥 말기','달걀찜 만들기','과일 화채','떡볶이 만들기','샌드위치 만들기','주먹밥 만들기'],
  ['줄넘기 기초','축구 드리블','아침 스트레칭','배드민턴 서브','달리기 자세','농구 슛 연습'],['리코더 연습','합창 발성','장구 장단','우쿨렐레 코드','박자 익히기','동요 반주']];
 const VIDEOS=TITLES[0].flatMap((_,n)=>FIELDS.map((_,f)=>({title:TITLES[f][n],f,base:3-(n*4+f)*.12})));
 L.add('recommendSim','custom',{
  hint:'추천 목록에서 <b>시청</b>을 눌러 이용 기록을 쌓아 봅니다. 점수가 높은 순서로 여섯 개를 보여 줍니다. 영상 제목과 점수 계산은 활동용 예시입니다.',
  body:`<div class="md-split" style="--split:1.55fr 1fr"><div class="md-panel"><h3>추천 목록 (관심 가능성 점수가 높은 순)</h3><ol class="s22-recs"></ol></div>
   <div class="md-panel"><h3>나의 이용 기록</h3><ul class="md-list" id="s22-record"></ul><div class="md-chips"><button type="button" class="md-chip" data-act="family">가족이 같은 계정으로 요리 영상 3편 시청</button><button type="button" class="md-chip" data-act="clear">시청 기록 삭제</button></div>
   <div class="s22-bar" style="grid-template-columns:auto 1fr 3.4em;margin-top:auto"><span>추천 목록 속 분야</span><div class="md-meter"><i id="s22-wide"></i></div><b id="s22-wide-n"></b></div></div></div>`,
  state:()=>({w:[0,0,0,0],d:[0,0,0,0],seen:{},last:null}),
  render(ui,st,reset){
   ui.action('처음부터',reset);
   function draw(){
    const score=(v,i)=>v.base+st.w[v.f]-2*st.d[v.f]+.2*(st.seen[i]||0),top=VIDEOS.map((v,i)=>({...v,i,s:score(v,i)})).sort((a,b)=>b.s-a.s).slice(0,6),max=Math.max(top[0].s,1);
    ui.q('.s22-recs').innerHTML=top.map((v,n)=>`<li class="s22-rec"><span>${n+1}</span><span><b>${v.title}</b><small>${FIELDS[v.f]}</small></span><div class="md-meter" aria-hidden="true"><i style="width:${Math.max(3,v.s/max*100)}%"></i></div>
     <button type="button" class="md-btn primary" data-act="watch" data-i="${v.i}">시청</button><button type="button" class="md-btn" data-act="no" data-i="${v.i}">관심 없음</button></li>`).join('');
    ui.q('#s22-record').innerHTML=FIELDS.map((f,i)=>`<li><span>${f}</span><b>${st.d[i]?'관심 없음 표시':`시청 ${st.w[i]}회`}</b></li>`).join('');
    const kinds=new Set(top.map(v=>v.f)).size;ui.q('#s22-wide').style.width=kinds*25+'%';ui.q('#s22-wide-n').textContent=kinds+'가지';
    const [act,f]=st.last||[],only=FIELDS[top[0].f];
    ui.say(act==='family'?'가족이 본 기록도 내 관심으로 계산됩니다. 이용 기록은 관심의 단서일 뿐 취향 전체가 아닙니다.'
     :act==='clear'?'시청 기록을 삭제했습니다. 이용자가 일부 신호를 직접 조정할 수 있습니다.'
     :act==='no'?`${FIELDS[f]} 분야에 관심 없음을 표시해 추천에서 뒤로 밀렸습니다. 이용자가 일부 신호를 직접 조정할 수 있습니다.`
     :act==='watch'?(kinds===1?`추천 여섯 개가 모두 ${only} 분야입니다. 이미 본 것과 비슷한 항목이 먼저 나와 선택의 폭이 좁아졌습니다.`:`${FIELDS[f]} 분야를 ${st.w[f]}번 시청했습니다. 추천 목록 속 분야는 ${kinds}가지입니다. 같은 분야를 더 시청해 보세요.`)
     :'보고 싶은 영상의 시청을 눌러 보세요. 추천 목록의 순서와 분야가 어떻게 달라질까요?',act==='watch'&&kinds===1?'bad':'');
   }
   ui.body.addEventListener('click',e=>{
    const b=e.target.closest('[data-act]');if(!b)return;const act=b.dataset.act,i=Number(b.dataset.i),f=act==='family'?1:VIDEOS[i]?.f;
    if(act==='watch'){st.w[f]++;st.seen[i]=(st.seen[i]||0)+1}else if(act==='no')st.d[f]++;else if(act==='family')st.w[1]+=3;else{st.w=[0,0,0,0];st.seen={}}
    st.last=[act,f];draw();
   });
   draw();
  }});

 // A sentence is written one slot at a time by drawing from made-up word probabilities; the source sheet is only for the learner to check against.
 const SLOTS=[{name:'위치',fact:'2층',c:[['2층',55],['1층',30],['3층',15]]},{name:'책의 수',fact:'약 8천 권',c:[['약 8천 권',50],['약 5천 권',30],['약 1만 권',20]]},{name:'닫는 시각',fact:'오후 4시 30분',c:[['오후 4시 30분',55],['오후 5시',30],['오후 4시',15]]}];
 const PARTS=['우리 학교 도서관은 ',0,'에 있고 책이 ',1,' 있으며 ',2,'까지 엽니다.'];
 L.add('generateSim','custom',{
  hint:'생성 모델이 <b>이어질 말의 가능성</b>에 따라 문장을 완성합니다. 완성된 문장을 사실 자료와 대조해 보세요. 학교, 자료, 가능성 값은 모두 활동용 예시입니다.',
  body:`<div class="md-split" style="--split:1.5fr 1fr"><div class="md-panel"><div class="s22-chat">우리 학교 도서관을 한 문장으로 소개해 줘.</div><div class="s22-answer" id="s22-answer"></div><h3 id="s22-next"></h3><div class="s22-bars" id="s22-cand"></div>
   <div class="s22-note" style="margin-top:auto">모델은 사실 자료를 보지 않습니다. 여러 학교 소개 글에서 배운 패턴으로 그럴듯한 말을 고릅니다.</div></div>
   <div class="md-panel"><h3>사실 자료 (학교 안내문)</h3><ul class="md-list">${SLOTS.map(s=>`<li><span>${s.name}</span><b>${s.fact}</b></li>`).join('')}</ul><h3>응답 기록</h3><ul class="md-list" id="s22-log"></ul></div></div>`,
  state:()=>({seed:47,words:[],marked:[],phase:'write',log:[]}),
  render(ui,st,reset){
   const go=ui.action('',()=>{
    if(st.phase==='write'){st.seed=(st.seed*1103515245+12345)&0x7fffffff;let r=st.seed/0x7fffffff*100;const slot=SLOTS[st.words.length];st.words.push((slot.c.find(c=>(r-=c[1])<0)||slot.c[0])[0]);if(st.words.length===SLOTS.length)st.phase='check'}
    else if(st.phase==='check'){st.phase='done';st.log.push(st.words.filter((w,i)=>w!==SLOTS[i].fact).length)}
    else{st.words=[];st.marked=[];st.phase='write'}
    draw();
   },true);
   ui.action('처음부터',reset);
   function draw(){
    const wrong=i=>st.words[i]!==SLOTS[i].fact,n=st.words.length;
    ui.q('#s22-answer').innerHTML=PARTS.map(p=>typeof p==='string'?p:p>=n?'<span class="s22-blank">?</span>'
     :`<button type="button" class="s22-word" data-i="${p}" ${st.phase==='done'?`disabled data-result="${wrong(p)?'wrong':'right'}"`:st.phase==='check'?`aria-pressed="${st.marked.includes(p)}"`:'disabled'}>${st.words[p]}</button>`).join('');
    const slot=SLOTS[Math.min(n,SLOTS.length-1)];
    ui.q('#s22-next').textContent=st.phase==='write'?`이어질 말의 가능성: ${slot.name}`:`마지막으로 고른 말의 가능성: ${slot.name}`;
    ui.q('#s22-cand').innerHTML=slot.c.map(c=>`<div class="s22-bar" style="grid-template-columns:7.5em 1fr 3em"><span>${c[0]}</span><div class="md-meter"><i style="width:${c[1]}%"></i></div><b>${c[1]}%</b></div>`).join('');
    ui.q('#s22-log').innerHTML=st.log.slice(-4).map((k,i)=>`<li><span>응답 ${st.log.length-Math.min(4,st.log.length)+i+1}</span><b>${k?`자료와 다른 곳 ${k}곳`:'자료와 모두 같음'}</b></li>`).join('')||'<li><span>아직 대조한 응답이 없습니다.</span></li>';
    go.textContent=st.phase==='write'?'다음 말 고르기':st.phase==='check'?'자료와 대조':'같은 요청 다시 보내기';
    const bad=SLOTS.filter((_,i)=>wrong(i)).length,found=SLOTS.every((_,i)=>wrong(i)===st.marked.includes(i)),clean=st.log.filter(k=>!k).length;
    ui.say(st.phase==='write'?(n?'가능성이 가장 높은 말이 늘 뽑히는 것은 아닙니다. 다음 말을 계속 골라 보세요.':'다음 말 고르기를 누르면 가능성에 따라 말이 하나씩 정해집니다.')
     :st.phase==='check'?'문장이 완성되었습니다. 사실 자료와 다른 부분을 모두 눌러 표시한 뒤 대조하세요.'
     :`자료와 다른 곳은 ${bad}곳입니다. ${found?'정확히 찾았습니다.':'표시와 다른 곳이 있으니 색을 확인하세요.'} 지금까지 ${st.log.length}번 가운데 모두 맞은 응답은 ${clean}번입니다.`,st.phase==='done'?(bad?'bad':'good'):'');
   }
   ui.body.addEventListener('click',e=>{const w=e.target.closest('.s22-word');if(!w||st.phase!=='check')return;const i=Number(w.dataset.i);st.marked=st.marked.includes(i)?st.marked.filter(k=>k!==i):[...st.marked,i];draw()});
   draw();
  }});

 // A simplified version of the wolf and husky experiment: the model leans on whichever cue fits the training photos best.
 const face=kind=>{const [fur,mask,eye]=kind==='wolf'?['#9a9488','#d9d4c8','#c48a00']:['#4b5167','#ffffff','#3f8fd0'];
  return `<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M7 18 10 3l9 9zM33 18 30 3l-9 9z" fill="${fur}"/><circle cx="20" cy="23" r="13" fill="${fur}"/><path d="M20 15c-4 3-8 6-8 11a8 8 0 0 0 16 0c0-5-4-8-8-11z" fill="${mask}"/><circle cx="14.5" cy="20" r="2" fill="${eye}"/><circle cx="25.5" cy="20" r="2" fill="${eye}"/><circle cx="20" cy="27" r="2.2" fill="#1c2c4c"/></svg>`};
 const NAMES={wolf:'늑대',husky:'허스키'},GROUND={snow:'눈 위의',grass:'풀밭의'},TESTS=[['husky','snow'],['wolf','grass'],['wolf','snow'],['husky','grass']];
 L.add('huskySim','custom',{
  hint:'늑대와 허스키 분류 실험을 단순하게 만든 예시입니다. 학습 사진의 <b>배경</b>을 바꾸면 모델이 배우는 기준과 새 사진의 결과가 어떻게 달라질까요?',
  body:`<div class="md-split" style="--split:1.2fr 1fr"><div class="md-panel"><h3>학습 사진 12장</h3><div class="s22-train" data-kind="wolf"></div><div class="s22-train" data-kind="husky"></div>
   <label class="md-slider s22-wide" style="grid-template-columns:11em 1fr 3em">눈 배경인 늑대 사진<input type="range" data-k="wolf" min="0" max="6" step="1"><output></output></label>
   <label class="md-slider s22-wide" style="grid-template-columns:11em 1fr 3em">눈 배경인 허스키 사진<input type="range" data-k="husky" min="0" max="6" step="1"><output></output></label>
   <ul class="md-list" id="s22-acc"></ul></div>
   <div class="md-panel"><h3>새 사진 4장으로 시험</h3><div class="s22-tests"></div><label class="s22-line"><input type="checkbox" id="s22-explain">설명 보기: 판단에 크게 작용한 부분 표시</label>
   <div class="s22-share" id="s22-share"></div><div class="s22-note" style="margin-top:auto">생김새만으로는 학습 사진 12장 중 10장을 맞힌다고 가정했습니다.</div></div></div>`,
  state:()=>({wolf:6,husky:0,explain:false}),
  render(ui,st,reset){
   ui.action('처음 값으로',reset);
   function draw(){
    const fit=(st.wolf+6-st.husky)/12,bg=Math.abs(fit-.5),shape=10/12-.5,useBg=bg>shape,snow=fit>=.5?'wolf':'husky',other=k=>k==='wolf'?'husky':'wolf';
    const answer=([kind,ground])=>useBg?(ground==='snow'?snow:other(snow)):kind,focus=st.explain?(useBg?'bg':'shape'):'';
    ui.all('.s22-train').forEach(row=>{const kind=row.dataset.kind;row.innerHTML=`<b>${NAMES[kind]}</b>`+Array.from({length:6},(_,i)=>`<span class="s22-photo" data-bg="${i<st[kind]?'snow':'grass'}">${face(kind)}</span>`).join('')});
    ui.all('.md-slider input').forEach(n=>{n.value=st[n.dataset.k];n.nextElementSibling.textContent=st[n.dataset.k]+'장'});ui.q('#s22-explain').checked=st.explain;
    const right=TESTS.filter(t=>answer(t)===t[0]).length,train=Math.round((useBg?Math.max(fit,1-fit):10/12)*100);
    ui.q('.s22-tests').innerHTML=TESTS.map(t=>`<div class="s22-test" data-result="${answer(t)===t[0]?'right':'wrong'}"><span class="s22-photo" data-bg="${t[1]}" data-focus="${focus}">${face(t[0])}</span><span><b>${GROUND[t[1]]} ${NAMES[t[0]]}</b>모델의 답: ${NAMES[answer(t)]}</span></div>`).join('');
    ui.q('#s22-acc').innerHTML=[['학습 사진 12장 정확도',train+'%'],['새 사진 4장 정확도',`4장 중 ${right}장`]].map(([a,b])=>`<li><span>${a}</span><b>${b}</b></li>`).join('');
    const part=Math.round(bg/(bg+shape)*100),share=ui.q('#s22-share');share.style.visibility=st.explain?'visible':'hidden';
    share.innerHTML=`<i style="width:${part}%">${part>=22?`배경 ${part}%`:''}</i><i style="width:${100-part}%">${part<=78?`생김새 ${100-part}%`:''}</i>`;
    ui.say(useBg?(st.explain?`모델은 동물이 아니라 배경을 보고 답했습니다. 눈이 있으면 ${NAMES[snow]}라고 배운 것입니다. 학습 사진의 배경을 섞어 보세요.`
      :`학습 사진은 ${train}% 맞히는데 새 사진은 4장 중 ${right}장만 맞힙니다. 설명 보기를 켜서 모델이 본 곳을 확인해 보세요.`)
     :`배경만으로는 두 동물이 잘 나뉘지 않아 모델은 생김새를 기준으로 삼습니다. 새 사진 4장 중 ${right}장을 맞힙니다.`,useBg?'bad':'good');
   }
   ui.body.addEventListener('input',e=>{if(e.target.dataset.k)st[e.target.dataset.k]=Number(e.target.value);else if(e.target.id==='s22-explain')st.explain=e.target.checked;else return;draw()});draw();
  }});

 // Three sentences are chosen one per principle. Each option is [sentence, follows the principle, comment].
 const STEPS=['1. AI가 하는 일을 입력과 결과로','2. 잘하는 일과 틀리는 조건을 한 쌍으로','3. 결과를 확인하는 행동으로 마무리'];
 const LEVELS={elem:['초등학생에게',[
   [['AI는 그림이 무엇인지 다 알아요.',false,'안다는 말은 AI를 사람처럼 표현합니다. 예시에서 찾은 패턴으로 추측한다고 말합니다.'],['AI는 그림을 아주 많이 보고 비슷한 점을 찾아서 맞혀요.',true,'하는 일을 입력과 결과로 설명했습니다.'],['AI는 우리처럼 생각해서 답을 정해요.',false,'생각한다는 말은 AI를 사람처럼 표현합니다.']],
   [['처음 보는 그림은 틀릴 수 있어요.',true,'잘하는 일에 틀리는 조건을 짝지어 말했습니다.'],['그래서 AI는 틀리는 일이 없어요.',false,'잘하는 일만 말하고 틀리는 조건이 빠졌습니다.'],['AI는 자주 틀리니까 믿으면 안 돼요.',false,'어떤 조건에서 틀리는지가 없습니다. 잘하는 일과 틀리는 조건을 한 쌍으로 알려 줍니다.']],
   [['그래서 AI가 말한 대로 하면 돼요.',false,'확인하는 행동이 없습니다. AI의 답은 한 번 더 확인합니다.'],['무엇이 옳은지도 AI가 정해 줘요.',false,'무엇이 옳은지는 AI가 아니라 우리가 함께 정합니다.'],['그래서 친구나 선생님과 확인해요.',true,'결과를 확인하는 행동으로 마무리했습니다.']]]],
  sec:['중고등학생에게',[
   [['AI는 문제의 뜻을 이해하고 정답을 압니다.',false,'이해한다, 안다는 말은 AI를 사람처럼 표현합니다.'],['AI는 스스로 판단해서 답을 결정합니다.',false,'AI를 사람처럼 표현했습니다. 예시에서 찾은 패턴으로 추측한다고 말합니다.'],['AI는 학습한 데이터의 패턴으로 가능성이 가장 높은 답을 고릅니다.',true,'하는 일을 입력과 결과로 설명했습니다.']],
   [['확신도가 높으면 정답이라고 볼 수 있습니다.',false,'확신도는 모델의 계산 결과일 뿐 정답이라는 보장이 아닙니다.'],['학습 때와 상황이 다르면 확신도가 높아도 틀릴 수 있습니다.',true,'잘하는 일에 틀리는 조건을 짝지어 말했습니다.'],['AI는 사람보다 항상 정확합니다.',false,'잘하는 일만 말하고 틀리는 조건이 빠졌습니다.']],
   [['그래서 AI의 답은 한 번 더 확인하고, 중요한 결정은 사람이 합니다.',true,'결과를 확인하는 행동으로 마무리했습니다.'],['그래서 AI의 답을 그대로 옮겨 적습니다.',false,'확인하는 행동이 없습니다. AI의 답은 한 번 더 확인합니다.'],['그래서 근거는 따로 확인하지 않아도 됩니다.',false,'확인하는 행동이 없습니다. 중요한 결정에는 다른 근거와 사람의 확인을 함께 둡니다.']]]]};
 L.add('explainBuilder','custom',{
  hint:'세 원칙마다 문장을 하나씩 골라 학생에게 할 <b>설명</b>을 완성합니다. 고른 문장이 원칙에 맞는지 바로 확인됩니다. 문장은 활동용 예시입니다.',
  body:`<div class="md-split" style="--split:1.75fr 1fr"><div class="s22-rows"><div class="md-chips">${Object.entries(LEVELS).map(([k,v])=>`<button type="button" class="md-chip" data-level="${k}">${v[0]}</button>`).join('')}</div>
   ${STEPS.map((s,r)=>`<div class="s22-row"><b>${s}</b><div class="md-choices" style="--n:3" data-r="${r}"></div></div>`).join('')}</div>
   <div class="md-panel"><h3>완성된 설명</h3><div class="s22-draft"></div><h3>세 원칙 확인</h3><ul class="md-list" id="s22-rules"></ul><div class="s22-result" id="s22-verdict"></div></div></div>`,
  state:()=>({level:'elem',pick:{elem:[null,null,null],sec:[null,null,null]},last:null}),
  render(ui,st,reset){
   ui.action('처음부터',reset);
   function draw(){
    const rows=LEVELS[st.level][1],pick=st.pick[st.level],ok=r=>pick[r]!==null&&rows[r][pick[r]][1],done=pick.every(p=>p!==null),good=[0,1,2].filter(ok).length;
    ui.all('[data-level]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.level===st.level)));
    ui.all('.md-choices[data-r]').forEach(box=>{const r=Number(box.dataset.r);box.innerHTML=rows[r].map((o,j)=>`<button type="button" class="md-choice" data-j="${j}" ${pick[r]===j?`data-result="${o[1]?'right':'wrong'}"`:''}>${o[0]}</button>`).join('')});
    ui.q('.s22-draft').innerHTML=pick.map((p,r)=>`<span data-empty="${p===null}">${p===null?`${r+1}번 문장을 골라 주세요.`:rows[r][p][0]}</span>`).join('');
    ui.q('#s22-rules').innerHTML=['사람처럼 표현하지 않기','틀리는 조건을 함께 말하기','확인하는 행동으로 마무리'].map((t,r)=>`<li><span>${t}</span><b>${pick[r]===null?'고르기 전':ok(r)?'지킴':'다시 보기'}</b></li>`).join('');
    const box=ui.q('#s22-verdict');box.textContent=done?(good===3?'세 원칙을 모두 지킴':`세 원칙 중 ${good}가지를 지킴`):'문장 고르는 중';box.dataset.tone=done&&good<3?'warn':'';
    ui.say(st.last!==null&&pick[st.last]!==null?rows[st.last][pick[st.last]][2]+(done&&good===3?' 세 원칙을 모두 지킨 설명이 완성되었습니다.':'')
     :'원칙마다 문장을 하나씩 누르세요. 다른 문장을 누르면 바꿀 수 있습니다.',st.last!==null&&pick[st.last]!==null?(ok(st.last)?'good':'bad'):'');
   }
   ui.body.addEventListener('click',e=>{
    const level=e.target.closest('[data-level]'),choice=e.target.closest('.s22-row .md-choice');
    if(level){st.level=level.dataset.level;st.last=null}else if(choice){const r=Number(choice.parentElement.dataset.r);st.pick[st.level][r]=Number(choice.dataset.j);st.last=r}else return;
    draw();
   });
   draw();
  }});
})();
