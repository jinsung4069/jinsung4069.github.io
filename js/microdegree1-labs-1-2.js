/* 1주차 오후, 인공지능의 개념과 발전 Part 1: activity slides. Example answers and rules are written for these activities. */
(()=>{
 'use strict';
 const L=window.ceLabs;if(!L)return;const esc=L.esc;

 L.add('deviceSort','sort',{soft:true,hint:'여섯 기기를 <b>AI</b>, <b>AI 아님</b>, <b>판단 보류</b>로 나눕니다. 작동 원리를 모르면 판단 보류에 두어도 됩니다.',
  bins:[{id:'ai',label:'AI'},{id:'no',label:'AI 아님'},{id:'hold',label:'판단 보류'}],cards:[
  {id:'door',label:'자동문',sub:'사람이 다가가면 문이 열림',answer:'no',why:'센서 값이 기준을 넘으면 문을 여는 규칙 자동화입니다.'},
  {id:'calc',label:'계산기',sub:'입력한 식의 값을 계산함',answer:'no',why:'정해진 연산 절차를 그대로 실행하므로 AI가 아닙니다.'},
  {id:'translate',label:'번역 앱',sub:'문장을 다른 언어로 바꿈',answer:'ai',why:'번역 예문으로 학습한 모델이 문장을 생성합니다.'},
  {id:'video',label:'동영상 추천',sub:'다음에 볼 영상을 제안함',answer:'ai',why:'이용 기록에서 관심을 추정해 순서를 제안합니다.'},
  {id:'robot',label:'로봇청소기',sub:'집 안을 돌며 청소함',answer:['ai','no','hold'],why:'제품마다 다릅니다. 충돌 감지 규칙만 쓰는 제품도, 지도 작성과 사물 인식을 하는 제품도 있습니다.'},
  {id:'spam',label:'스팸 메일 필터',sub:'광고 메일을 따로 모음',answer:'ai',why:'대부분 스팸으로 표시된 메일 사례로 학습한 기준을 적용합니다.'}]});

 // A rule switches on at a fixed temperature; the learned control follows the usage record it was given.
 const HOURS=[8,9,10,11,12,13,14,15,16,17],WEATHER={sunny:{label:'맑은 날',t:[24,25,27,28,29,30,31,31,30,29]},cloudy:{label:'흐린 날',t:[23,24,25,26,26,27,27,27,26,26]}};
 const RECORDS={morning:{label:'오전에만 쓰는 교실',use:[0,1,1,1,0,0,0,0,0,0]},afternoon:{label:'오후에만 쓰는 특별실',use:[0,0,0,0,0,1,1,1,0,0]},allday:{label:'종일 쓰는 교실(12시 점심)',use:[0,1,1,1,0,1,1,1,0,0]}};
 L.add('thermostat','custom',{
  hint:'같은 날씨에서 <b>규칙 제어</b>와 <b>학습 제어</b>가 냉방기를 언제 켜는지 비교합니다. 학습한 사용 기록을 바꾸면 무엇이 달라질까요?',
  body:`<div class="md-chips" style="align-items:center;gap:1.2em;font-size:.9em"><label>날씨 <select data-k="weather">${Object.entries(WEATHER).map(([k,v])=>`<option value="${k}">${v.label}</option>`).join('')}</select></label>
   <label>학습한 사용 기록 <select data-k="record">${Object.entries(RECORDS).map(([k,v])=>`<option value="${k}">${v.label}</option>`).join('')}</select></label>
   <label style="display:flex;align-items:center;gap:.5em">기준 온도 <input type="range" data-k="limit" min="25" max="30" step="1" style="width:9em"><b id="th-limit"></b></label></div>
   <table class="md-check md-hours"><tbody></tbody></table>`,
  state:()=>({weather:'sunny',record:'morning',limit:27}),
  render(ui,st,reset){
   ui.action('처음 값으로',reset);
   const draw=()=>{
    ui.all('[data-k]').forEach(n=>n.value=st[n.dataset.k]);ui.q('#th-limit').textContent=st.limit+'℃';
    const t=WEATHER[st.weather].t,use=RECORDS[st.record].use;
    const rule=t.map(v=>v>=st.limit),learn=t.map((v,i)=>use[i]?v>=st.limit-1:!!use[i+1]&&v>=st.limit-2);
    const row=(name,cells,cls='')=>`<tr class="${cls}"><th scope="row">${name}</th>${cells.join('')}</tr>`,on=flags=>flags.map(f=>`<td data-on="${f}">${f?'켬':''}</td>`);
    ui.q('.md-hours tbody').innerHTML=row('시각',HOURS.map(h=>`<td>${h}시</td>`),'md-hour')+row('냉방 없을 때 실내 온도',t.map(v=>`<td>${v}℃</td>`))
     +row('기록 속 교실 사용',use.map(u=>`<td data-use="${!!u}">${u?'사용':''}</td>`))+row('규칙 제어',on(rule))+row('학습 제어',on(learn));
    const count=flags=>flags.filter(Boolean).length,empty=flags=>flags.filter((f,i)=>f&&!use[i]).length,pre=learn.filter((f,i)=>f&&!use[i]).length;
    ui.say(`규칙 제어는 ${count(rule)}시간 가동(빈 교실 ${empty(rule)}시간)이며 사용 기록을 바꾸어도 그대로입니다. 학습 제어는 ${count(learn)}시간 가동${pre?`(수업 전 미리 ${pre}시간)`:''}이고 기록이 달라지면 결과도 달라집니다.`);
   };
   ui.body.addEventListener('input',e=>{const k=e.target.dataset.k;if(k){st[k]=k==='limit'?Number(e.target.value):e.target.value;draw()}});draw();
  }});

 L.add('viewsSort','sort',{columns:2,hint:'여섯 가지 시스템이 지능을 보는 네 관점 가운데 어디에 가장 가까운지 놓아 봅니다.',
  bins:[{id:'th',label:'사람처럼 생각하기',sub:'사람의 사고 과정을 모형화'},{id:'tr',label:'합리적으로 생각하기',sub:'논리적으로 올바른 추론'},{id:'ah',label:'사람처럼 행동하기',sub:'사람과 구별되지 않는 행동'},{id:'ar',label:'합리적으로 행동하기',sub:'목표를 가장 잘 이루는 행동'}],cards:[
  {id:'a',label:'사람이 문제를 푸는 순서를 흉내 낸 풀이 모형',answer:'th',why:'사람의 사고 과정을 컴퓨터 모형으로 옮겨 비교하는 인지 모델링입니다.'},
  {id:'b',label:'전제에서 논리 규칙으로 결론을 이끄는 추론기',answer:'tr',why:'논리학의 올바른 추론 규칙을 따르는 사고의 법칙 접근입니다.'},
  {id:'c',label:'글로 대화하면 사람과 구별되지 않는 챗봇',answer:'ah',why:'튜링 테스트가 대표 기준인 사람처럼 행동하기입니다.'},
  {id:'d',label:'도착 시간이 가장 짧은 길을 고르는 내비게이션',answer:'ar',why:'주어진 목표를 가장 잘 이루는 행동을 고르는 합리적 에이전트입니다.'},
  {id:'e',label:'사람이 자주 하는 계산 실수까지 재현하는 모형',answer:'th',why:'잘 푸는지가 아니라 사람의 사고와 얼마나 닮았는지를 봅니다.'},
  {id:'f',label:'먼지가 많은 곳부터 청소 경로를 정하는 로봇',answer:'ar',why:'사람을 닮았는지보다 청소라는 목표를 얼마나 잘 이루는지로 평가합니다.'}]});

 // A vacuum agent on a small floor: perceive, decide, act, check.
 const W=8,H=4,WALLS=['2,1','2,2','5,0','5,1'],DUST=['1,0','4,1','7,0','0,3','3,3','6,2','7,3'];
 L.add('agentLoop','custom',{
  hint:'로봇청소기 에이전트가 <b>지각, 판단, 행동, 결과 확인</b>을 되풀이합니다. 목표를 바꾸면 행동이 어떻게 달라질까요?',
  body:`<div class="md-split" style="--split:1.5fr 1fr"><div class="md-floor" style="--w:${W}"></div><div class="md-panel"><h3>이번 단계</h3><ul class="md-list" id="ag-log"></ul>
   <label style="font-size:.9em;margin-top:auto">목표 <select id="ag-goal"><option value="clean">먼지를 모두 치우기</option><option value="fast">12걸음 안에 끝내기</option></select></label></div></div>`,
  state:()=>({x:0,y:0,dust:[...DUST],steps:0,goal:'clean',log:null,done:false}),
  render(ui,st,reset){
   const key=(x,y)=>`${x},${y}`,free=(x,y)=>x>=0&&y>=0&&x<W&&y<H&&!WALLS.includes(key(x,y));
   const DIRS=[[1,0,'오른쪽','오른쪽으로'],[0,1,'아래','아래로'],[-1,0,'왼쪽','왼쪽으로'],[0,-1,'위','위로']];
   function path(){ // Breadth-first search to the nearest dust.
    const seen=new Map([[key(st.x,st.y),null]]),queue=[[st.x,st.y]];
    while(queue.length){const [x,y]=queue.shift();if(st.dust.includes(key(x,y))){const way=[];let k=key(x,y);while(seen.get(k)){way.unshift(seen.get(k));const [dx,dy]=seen.get(k);const [px,py]=k.split(',').map(Number);k=key(px-dx,py-dy)}return way}
     for(const d of DIRS){const nx=x+d[0],ny=y+d[1];if(free(nx,ny)&&!seen.has(key(nx,ny))){seen.set(key(nx,ny),d);queue.push([nx,ny])}}}
    return null;
   }
   function step(){
    if(st.done)return;
    const near=DIRS.filter(d=>!free(st.x+d[0],st.y+d[1])).map(d=>d[2]),way=path();
    if(!way||!way.length){st.done=true;return}
    const d=way[0];st.x+=d[0];st.y+=d[1];st.steps++;
    const cleaned=st.dust.includes(key(st.x,st.y));if(cleaned)st.dust=st.dust.filter(k=>k!==key(st.x,st.y));
    st.log=[['지각',near.length?`막힌 방향은 ${near.join(', ')}`:'네 방향이 모두 열려 있음'],['판단',`가장 가까운 먼지까지 ${way.length}걸음`],['행동',`${d[3]} 한 칸 이동`],['결과 확인',cleaned?'먼지를 치움':'아직 이동 중']];
    if(!st.dust.length||st.goal==='fast'&&st.steps>=12)st.done=true;
   }
   const stepButton=ui.action('한 단계',()=>{step();draw()},true),runButton=ui.action('끝까지 실행',()=>{while(!st.done)step();draw()});ui.action('처음부터',reset);
   function draw(){
    let cells='';for(let y=0;y<H;y++)for(let x=0;x<W;x++){const k=key(x,y);cells+=`<span data-kind="${WALLS.includes(k)?'wall':st.x===x&&st.y===y?'robot':st.dust.includes(k)?'dust':''}"></span>`}
    ui.q('.md-floor').innerHTML=cells;ui.q('#ag-goal').value=st.goal;
    ui.q('#ag-log').innerHTML=(st.log||[['지각','센서로 환경 정보를 받음'],['판단','목표에 맞는 행동 선택'],['행동','작동기로 실행'],['결과 확인','바뀐 환경을 다시 지각']]).map(([a,b])=>`<li><b>${a}</b><span>${esc(b)}</span></li>`).join('');
    stepButton.disabled=runButton.disabled=st.done;
    const left=st.dust.length,total=DUST.length;
    ui.say(!st.done?`${st.steps}걸음, 치운 먼지 ${total-left} / ${total}`:left?`12걸음 안에 끝낸다는 목표는 이루었지만 먼지 ${left}곳이 남았습니다. 목표를 잘못 정하면 잘 달성해도 원하지 않는 결과가 나옵니다.`:`${st.steps}걸음 만에 먼지를 모두 치웠습니다.`,st.done?(left?'bad':'good'):'');
   }
   ui.q('#ag-goal').addEventListener('change',e=>{const goal=e.target.value;Object.assign(st,{x:0,y:0,dust:[...DUST],steps:0,goal,log:null,done:false});draw()});draw();
  }});

 L.add('functionSort','sort',{hint:'여덟 가지 일이 인공지능의 네 기능 가운데 어디에 해당하는지 놓아 봅니다.',
  bins:[{id:'see',label:'인식'},{id:'reason',label:'표현과 추론'},{id:'learn',label:'학습'},{id:'talk',label:'상호작용'}],cards:[
  {id:'a',label:'사진 속 글자 영역을 찾아 읽기',answer:'see',why:'입력 신호에서 의미 있는 대상을 구별하는 인식입니다.'},
  {id:'b',label:'말소리를 글로 바꾸기',answer:'see',why:'마이크로 받은 신호에서 낱말을 알아보는 인식입니다.'},
  {id:'c',label:'지도를 도시와 도로의 연결로 나타내기',answer:'reason',why:'지식을 컴퓨터가 다룰 수 있는 형태로 바꾸는 표현입니다.'},
  {id:'d',label:'규칙과 사실에서 결론 이끌기',answer:'reason',why:'표현한 지식에서 결론을 이끄는 추론입니다.'},
  {id:'e',label:'이름표가 붙은 사진으로 분류 기준 만들기',answer:'learn',why:'예시 데이터로 판단 기준을 만드는 학습입니다.'},
  {id:'f',label:'이용 기록이 쌓일수록 추천 기준 고치기',answer:'learn',why:'데이터로 판단 기준을 개선하는 학습입니다.'},
  {id:'g',label:'질문을 듣고 말로 답하기',answer:'talk',why:'사람의 말을 받아들이고 반응을 돌려주는 상호작용입니다.'},
  {id:'h',label:'어려운 질문을 상담원에게 넘기기',answer:'talk',why:'대화의 흐름 속에서 사람과 주고받는 상호작용입니다.'}]});

 L.add('categorySort','sort',{hint:'대표 예를 네 범주에 놓아 봅니다. 모든 AI가 머신러닝은 아닙니다.',
  bins:[{id:'rule',label:'규칙 기반 AI',sub:'사람이 지식과 규칙을 직접 작성'},{id:'ml',label:'머신러닝',sub:'데이터에서 기준을 학습'},{id:'dl',label:'딥러닝',sub:'여러 층의 신경망이 특징까지 학습'},{id:'gen',label:'생성형 AI',sub:'학습한 패턴으로 새 결과물 생성'}],cards:[
  {id:'a',label:'전문가 시스템',answer:'rule',why:'전문가의 지식을 사람이 규칙으로 옮겨 추론합니다.'},{id:'b',label:'길 찾기 탐색',answer:'rule',why:'사람이 설계한 탐색 절차로 경로를 찾습니다.'},
  {id:'c',label:'스팸 메일 분류',answer:'ml',why:'스팸 사례 데이터에서 분류 기준을 학습합니다.'},{id:'d',label:'상품 추천',answer:'ml',why:'구매와 이용 기록에서 예측 기준을 학습합니다.'},
  {id:'e',label:'얼굴 인식',answer:'dl',why:'여러 층의 신경망이 얼굴의 특징까지 학습합니다.'},{id:'f',label:'음성 인식',answer:'dl',why:'여러 층의 신경망이 소리의 특징까지 학습합니다.'},
  {id:'g',label:'대화형 챗봇',answer:'gen',why:'학습한 패턴으로 새 문장을 만들어 냅니다.'},{id:'h',label:'이미지 생성',answer:'gen',why:'학습한 패턴으로 새 그림을 만들어 냅니다.'}]});

 const pair=(question,a,b)=>`${esc(question)}<div class="md-answers"><p><b>답 A</b>${esc(a)}</p><p><b>답 B</b>${esc(b)}</p></div>`;
 L.add('imitationGame','quiz',{hint:'심사자가 되어 글로만 대화합니다. 두 답 가운데 <b>프로그램이 만든 답</b>은 어느 쪽일까요? 답은 모두 이 활동을 위해 만든 예시입니다.',
  closing:'맞히기 어려웠다면, 그것이 프로그램이 이해했다는 증거일까요?',questions:[
  {html:pair('어제 저녁에 뭐 드셨어요?','김치찌개를 끓였는데 좀 짜게 돼서 밥을 두 공기나 먹었어요.','저녁 식사는 하루의 중요한 식사입니다. 어떤 음식을 좋아하시나요?'),short:'경험을 묻는 질문',choices:['답 A','답 B','구별할 수 없다'],answer:1,why:'답 B는 경험을 묻는 질문에 일반적인 말로 되묻습니다. 경험을 묻는 질문에서 차이가 드러났습니다.'},
  {html:pair('367 곱하기 42는 얼마예요?','15,414입니다.','잠깐만요, 암산은 어렵네요. 만 오천쯤 될 것 같은데요.'),short:'계산을 묻는 질문',choices:['답 A','답 B','구별할 수 없다'],answer:0,why:'답 A는 너무 빠르고 정확합니다. 사람처럼 보이려면 오히려 일부러 느리고 틀리게 답해야 합니다.'},
  {html:pair('비 오는 날 생각나는 사람이 있나요?','비는 대기 중의 수증기가 응결해 떨어지는 현상입니다.','초등학교 때 우산을 같이 쓰고 가던 짝꿍이 가끔 생각나요.'),short:'기억을 묻는 질문',choices:['답 A','답 B','구별할 수 없다'],answer:0,why:'답 A는 질문의 낱말에만 반응해 사전 같은 설명을 내놓았습니다.'},
  {html:pair('주말에 뭐 하실 거예요?','아직 모르겠어요. 날씨가 좋으면 가까운 산에나 다녀올까 해요.','밀린 빨래부터 하고, 그다음에는 그냥 누워 있을래요.'),short:'그럴듯한 두 답',choices:['답 A','답 B','구별할 수 없다'],answer:2,why:'두 답 모두 그럴듯하게 말하도록 만든 예시입니다. 사람처럼 보이는 것과 내용을 이해하는 것은 같지 않습니다.'}]});

 // The player follows the rulebook without knowing what the notes mean.
 const NOTES=[{in:'你好吗？',out:'我很好。',mean:['잘 지내세요?','저는 잘 지내요.']},{in:'你叫什么名字？',out:'我叫小明。',mean:['이름이 뭐예요?','제 이름은 샤오밍이에요.']},{in:'今天天气怎么样？',out:'今天天气很好。',mean:['오늘 날씨가 어때요?','오늘 날씨가 아주 좋아요.']}];
 L.add('chineseRoom','custom',{
  hint:'여러분은 방 안의 사람입니다. 뜻은 몰라도 됩니다. 들어온 쪽지와 <b>모양이 같은 줄</b>을 규칙서에서 찾아 답 쪽지를 내보내세요.',
  body:`<div class="md-split" style="--split:1fr 1.15fr"><div class="md-panel"><h3>규칙서</h3><table class="md-check md-rules"><thead><tr><th>이런 쪽지가 들어오면</th><th>이 쪽지를 내보낸다</th></tr></thead><tbody>${L.shuffled(NOTES,3).map(n=>`<tr><td lang="zh">${n.in}</td><td lang="zh">${n.out}</td></tr>`).join('')}</tbody></table></div>
   <div class="md-panel"><h3 id="cr-title"></h3><p class="md-note" id="cr-in" lang="zh"></p><div class="md-choices" id="cr-out" style="--n:3"></div><div id="cr-reveal"></div></div></div>`,
  state:()=>({round:0,wrong:0}),
  render(ui,st,reset){
   ui.action('처음부터',reset);
   function draw(miss){
    const over=st.round>=NOTES.length;
    ui.q('#cr-title').textContent=over?'방 밖에서 본 대화':`들어온 쪽지 ${st.round+1} / ${NOTES.length}`;ui.q('#cr-in').hidden=over;ui.q('#cr-out').hidden=over;
    if(over){
     ui.q('#cr-reveal').innerHTML=`<ul class="md-list">${NOTES.map(n=>`<li><span lang="zh">${n.in} → ${n.out}</span><span>${n.mean[0]} → ${n.mean[1]}</span></li>`).join('')}</ul><p style="font-size:.9em;margin-top:.6em">밖에서는 방 안의 사람이 중국어를 잘한다고 생각합니다. 여러분은 방금 뜻을 알고 답했나요?</p>`;
     ui.say('기호를 규칙대로 처리하는 것만으로 이해가 생겼다고 할 수 있을까요?','good');return;
    }
    const note=NOTES[st.round];ui.q('#cr-in').textContent=note.in;ui.q('#cr-reveal').innerHTML='';
    ui.q('#cr-out').innerHTML=L.shuffled(NOTES,st.round+5).map(n=>`<button type="button" class="md-choice" lang="zh" data-out="${n.out}">${n.out}</button>`).join('');
    ui.say(miss?'규칙서의 줄과 모양이 다릅니다. 다시 찾아보세요.':'규칙서에서 같은 모양의 줄을 찾아 내보낼 쪽지를 고르세요.',miss?'bad':'');
   }
   ui.body.addEventListener('click',e=>{const b=e.target.closest('#cr-out .md-choice');if(!b)return;if(b.dataset.out===NOTES[st.round].out){st.round++;draw()}else{st.wrong++;draw(true)}});draw();
  }});

 L.add('timelineOrder','order',{hint:'인공지능 70년의 열 장면을 일어난 순서대로 놓아 봅니다. 확인하면 연도가 나타납니다.',columns:5,seed:23,from:'1950년',to:'2022년',items:[
  {key:'1950',label:'튜링',sub:'모방 게임 제안'},{key:'1956',label:'다트머스 회의',sub:'AI 이름 탄생'},{key:'1966',label:'ELIZA',sub:'규칙으로 대화 흉내'},{key:'1974',label:'첫 번째 겨울',sub:'연구비 축소'},
  {key:'1980년대',label:'전문가 시스템',sub:'규칙 기반 AI 확산'},{key:'1987',label:'두 번째 겨울',sub:'규칙 유지의 한계'},{key:'1997',label:'딥블루',sub:'체스 챔피언 승리'},{key:'2012',label:'딥러닝',sub:'이미지 인식 도약'},
  {key:'2016',label:'알파고',sub:'이세돌 9단에 승리'},{key:'2022',label:'ChatGPT',sub:'생성형 AI 대중화'}]});

 // A small keyword chatbot in the manner of ELIZA. The rule that produced each reply is shown beside it.
 const RULES=[[/엄마|아빠|부모|가족|아이|딸|아들/,'가족','가족 이야기를 조금 더 들려주시겠어요?'],[/힘들|피곤|지쳐|지쳤|걱정|불안/,'힘든 마음','왜 그렇게 느끼시는지 말씀해 주시겠어요?'],
  [/학생|수업|학교|교실/,'학교','학교에서 있었던 일을 더 이야기해 주세요.'],[/항상|맨날|늘 |매일/,'항상','구체적인 예를 하나 들어 주실 수 있나요?'],
  [/(.+?)\s*싶(어요|다|습니다|은데)/,'~고 싶다',m=>`왜 ${m[1].trim()} 싶으신가요?`],[/아니|싫|못 하/,'부정','조금 부정적으로 들리네요. 이유가 있을까요?'],[/\?|까요|나요/,'질문','그 질문이 왜 중요하다고 생각하시나요?']];
 const FALLBACK=['계속 말씀해 주세요.','그 이야기를 조금 더 자세히 들려주세요.','그것은 당신에게 어떤 의미인가요?'];
 L.add('eliza','custom',{
  hint:'낱말을 규칙에 맞추어 되묻는 챗봇입니다. 문장을 보내고 <b>어떤 규칙이 쓰였는지</b> 확인해 보세요. 실명이나 개인 이야기는 적지 않습니다.',
  body:`<div class="md-split" style="--split:1.5fr 1fr"><div class="md-panel"><div class="md-chat" id="el-chat" aria-live="polite"></div><form class="md-reason" id="el-form"><input type="text" maxlength="60" autocomplete="off" aria-label="챗봇에게 보낼 문장" placeholder="문장을 적어 보내세요"><button class="md-btn primary" type="submit">보내기</button></form>
   <div class="md-chips">${['요즘 수업 준비가 힘들어요','주말에는 푹 쉬고 싶어요','학생들이 맨날 같은 질문을 해요','너는 내 말을 이해하니?'].map(t=>`<button type="button" class="md-chip">${t}</button>`).join('')}</div></div>
   <div class="md-panel"><h3>방금 쓰인 규칙</h3><ul class="md-list" id="el-rule"></ul><p style="font-size:.8em;color:#52607f;margin-top:auto">규칙은 ${RULES.length}개뿐입니다. 맞는 낱말이 없으면 정해 둔 말을 차례로 돌려씁니다.</p></div></div>`,
  state:()=>({log:[['bot','안녕하세요. 요즘 어떤 일이 마음에 걸리시나요?']],rule:null,miss:0}),
  render(ui,st,reset){
   ui.action('처음부터',reset);
   function reply(text){
    for(const [pattern,name,answer] of RULES){const m=text.match(pattern);if(m){st.rule=[['찾은 낱말',m[0].trim()],['규칙',name],['되묻는 틀',typeof answer==='string'?answer:'왜 ○○ 싶으신가요?']];return typeof answer==='string'?answer:answer(m)}}
    st.rule=[['찾은 낱말','없음'],['규칙','기본 응답'],['되묻는 틀','정해 둔 말 돌려쓰기']];return FALLBACK[st.miss++%FALLBACK.length];
   }
   function send(text){text=text.trim();if(!text)return;st.log.push(['me',text],['bot',reply(text)]);st.log=st.log.slice(-7);draw()}
   function draw(){
    ui.q('#el-chat').innerHTML=st.log.map(([who,t])=>`<p data-who="${who}">${esc(t)}</p>`).join('');
    ui.q('#el-rule').innerHTML=(st.rule||[['찾은 낱말','아직 없음']]).map(([a,b])=>`<li><b>${a}</b><span>${esc(b)}</span></li>`).join('');
    ui.say(st.rule?'뜻을 이해한 답일까요, 낱말에 맞춘 답일까요?':'아래 예시 문장을 눌러도 됩니다.');
   }
   ui.q('#el-form').addEventListener('submit',e=>{e.preventDefault();const input=e.target.querySelector('input');send(input.value);input.value='';input.focus()});
   ui.body.addEventListener('click',e=>{const chip=e.target.closest('.md-chip');if(chip)send(chip.textContent)});draw();
  }});

 L.add('conceptQuiz','quiz',{hint:'학생이 할 법한 말입니다. 맞는 설명인지 판단해 봅니다.',closing:'틀린 생각이라기보다 겉으로 보이는 경험에서 나온 추론입니다. 그렇게 생각한 이유를 먼저 물어봅니다.',questions:[
  {q:'"AI는 스스로 생각하고 느껴요."',choices:['맞는 설명','바로잡을 설명'],answer:1,why:'학습한 패턴으로 결과를 계산하며 감정이나 의도를 갖지 않습니다.'},
  {q:'"사람이 쓴 규칙으로 판단하는 AI도 있어요."',choices:['맞는 설명','바로잡을 설명'],answer:0,why:'전문가 시스템처럼 사람이 작성한 규칙으로 추론하는 AI도 있습니다.'},
  {q:'"자동으로 움직이면 모두 AI예요."',choices:['맞는 설명','바로잡을 설명'],answer:1,why:'정해진 조건만 실행하면 자동화이므로 판단 방식을 확인합니다.'},
  {q:'"AI의 답은 항상 정확해요."',choices:['맞는 설명','바로잡을 설명'],answer:1,why:'데이터와 조건에 따라 틀릴 수 있으므로 확인이 필요합니다.'},
  {q:'"AI 결과는 학습한 데이터의 영향을 받아요."',choices:['맞는 설명','바로잡을 설명'],answer:0,why:'같은 방법이라도 어떤 데이터로 배웠는지에 따라 결과가 달라집니다.'},
  {q:'"모든 AI는 데이터로 학습해요."',choices:['맞는 설명','바로잡을 설명'],answer:1,why:'사람이 작성한 규칙으로 추론하는 AI도 있습니다.'}]});
})();
