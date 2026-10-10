/* 8주차 오전, 프로젝트 발표 및 종합 평가, 수료식: activity slides. Sample feedback and the sample plan are written for these activities. */
(()=>{
 'use strict';
 const L=window.ceLabs;if(!L)return;const esc=L.esc;
 L.style(`.md-lab .s81-clock{font-size:5.2em;font-weight:800;line-height:1;color:#3f5dae;text-align:center;font-variant-numeric:tabular-nums}
.md-lab .s81-stages{display:grid;grid-template-columns:5fr 1fr 2fr;gap:.4em;align-items:end}.md-lab .s81-stage{display:grid;gap:.3em;font-size:.9em;text-align:center;line-height:1.25}
.md-lab .s81-stage b{color:#2c478f}.md-lab .s81-stage[data-now=true] b{color:#b36b00}.md-lab .s81-stage[data-now=true] .md-meter{outline:.14em solid #f0a202}
.md-lab .s81-doc{display:grid;grid-template-columns:1fr 1fr;grid-auto-rows:1fr;gap:.5em;flex:1;min-height:0}
.md-lab .s81-spot{display:flex;align-items:center;gap:.6em;padding:.3em .8em;border:1px solid #9fb0dc;border-radius:.5em;background:#fff;color:#1c2c4c;font-size:.86em;line-height:1.3;text-align:left;cursor:pointer}
.md-lab .s81-spot i{flex:none;width:1.3em;height:1.3em;border:1px solid #9fb0dc;border-radius:.3em;background:#fff;font-style:normal;display:grid;place-items:center;font-size:.85em}
.md-lab .s81-spot[aria-pressed=true] i{background:#f0a202;border-color:#f0a202;color:#fff}`);

 // A presenter's clock for the 5 + 1 + 2 minute round on the slide before it.
 const STAGES=[{name:'발표 5분',note:'문제, 설계, 시연',sec:300},{name:'확인 질문 1분',note:'사실만 묻고 답하기',sec:60},{name:'피드백 2분',note:'칭찬, 질문, 제안',sec:120}];
 L.add('presentTimer','custom',{
  hint:'한 사람의 발표 한 차례(예시 8분)를 재는 시계입니다. 단계가 바뀌면 아래 막대가 다음 칸으로 넘어갑니다.',
  body:`<div class="md-split" style="--split:1.6fr 1fr"><div class="md-panel" style="justify-content:center;gap:1.2em"><div class="s81-clock" id="s81-clock"></div><div class="s81-stages">${STAGES.map((s,i)=>`<div class="s81-stage" data-i="${i}"><b>${s.name}</b><div class="md-meter"><i></i></div></div>`).join('')}</div></div>
   <div class="md-panel"><h3>지금 할 일</h3><ul class="md-list" id="s81-now"></ul><label style="font-size:.9em;margin-top:auto">빠르기 <select id="s81-speed"><option value="1">실제 속도</option><option value="20">20배 빠르게 미리 보기</option></select></label></div></div>`,
  state:()=>({used:0,running:false,speed:1}),
  render(ui,st,reset){
   const total=STAGES.reduce((n,s)=>n+s.sec,0),toggle=ui.action('시작',()=>{st.running=!st.running;draw()},true);ui.action('처음부터',()=>{st.running=false;reset()});
   const ROLES=[[['발표자','문제, 설계, 시연 제시'],['검토자','기록지에 메모']],[['발표자','사실만 짧게 답함'],['검토자','사실 확인 질문']],[['발표자','말하지 않고 기록'],['검토자','칭찬, 질문, 제안']],[['발표자','반영할 의견 선택'],['검토자','기록지 전달']]];
   function draw(){
    const left=Math.max(0,total-st.used);ui.q('#s81-clock').textContent=`${Math.floor(left/60)}:${String(Math.floor(left%60)).padStart(2,'0')}`;
    let before=0,now=STAGES.length;
    STAGES.forEach((s,i)=>{const part=Math.min(1,Math.max(0,(st.used-before)/s.sec));if(part<1&&now===STAGES.length)now=i;ui.q(`.s81-stage[data-i="${i}"] i`).style.width=part*100+'%';before+=s.sec});
    ui.all('.s81-stage').forEach((n,i)=>n.dataset.now=String(i===now));
    ui.q('#s81-now').innerHTML=ROLES[now].map(([a,b])=>`<li><b>${a}</b><span>${b}</span></li>`).join('');ui.q('#s81-speed').value=st.speed;
    toggle.textContent=st.running?'일시 정지':'시작';toggle.disabled=left===0;
    ui.say(left===0?'한 차례가 끝났습니다. 발표자는 반영할 의견을 고르고 검토자는 기록지를 전달합니다.':now<STAGES.length?`지금은 ${STAGES[now].name} 단계입니다.`:'',left===0?'good':'');
   }
   ui.q('#s81-speed').addEventListener('change',e=>{st.speed=Number(e.target.value)});
   const timer=setInterval(()=>{
    if(!ui.body.isConnected){clearInterval(timer);st.running=false;return}
    if(st.running){st.used=Math.min(total,st.used+st.speed);if(st.used>=total)st.running=false;draw()}
   },1000);
   draw();
  }});

 L.add('sceneSort','sort',{hint:'발표 자료의 문장이 다섯 장면 가운데 어디에 들어갈지 놓아 봅니다. 문장은 이 활동을 위해 만든 예시입니다.',
  bins:[{id:'problem',label:'문제'},{id:'design',label:'설계'},{id:'demo',label:'시연'},{id:'verify',label:'검증'},{id:'improve',label:'개선'}],cards:[
  {id:'a',label:'5학년 학생이 실험 결과를 해석하는 글쓰기를 어려워합니다',answer:'problem',why:'누가, 어떤 상황에서 무엇이 어려운지를 말하는 문제 장면입니다.'},
  {id:'b',label:'성취기준과 학습 목표, 평가 계획은 다음과 같습니다',answer:'design',why:'성취기준, 목표, 평가 계획을 제시하는 설계 장면입니다.'},
  {id:'c',label:'학생이 AI에 질문하는 화면을 1~2분 보여 드립니다',answer:'demo',why:'AI 사용 장면을 1~2분 보여 주는 시연 장면입니다.'},
  {id:'d',label:'AI 결과의 오류는 이 방법으로 확인합니다',answer:'verify',why:'오류 확인 방법을 밝히는 검증 장면입니다.'},
  {id:'e',label:'개인정보와 저작권은 이렇게 점검했습니다',answer:'verify',why:'윤리 점검은 검증 장면에 담습니다.'},
  {id:'f',label:'평가 계획이 목표와 이어지는지 의견을 듣고 싶습니다',answer:'improve',why:'받고 싶은 피드백 질문을 남기는 개선 장면입니다.'}]});

 L.add('demoCheck','checklist',{hint:'내 시연을 떠올리며 여섯 항목을 점검합니다. 실행 가능성은 조건을 확인하고 대비했는지로 봅니다.',head:['점검 항목','확인 내용'],scale:['확인함','확인 중','아직'],
  lowest:'발표 전에 먼저 확인할 항목:',allGood:'여섯 항목을 모두 확인했습니다.',items:[
  {label:'접속',question:'발표 장소의 기기와 네트워크로 도구가 열린다'},{label:'계정',question:'로그인되어 있고 비밀번호가 화면에 보이지 않는다'},
  {label:'예시 자료',question:'학생 개인정보가 없는 자료이다'},{label:'대체 자료',question:'접속 실패에 대비한 화면 캡처나 녹화가 있다'},
  {label:'시간',question:'시연을 2분 안에 끝낼 수 있다'},{label:'화면',question:'알림, 다른 탭, 개인 파일이 보이지 않는다'}]});

 L.add('cqsSort','sort',{hint:'검토자의 말을 <b>칭찬</b>, <b>질문</b>, <b>제안</b>으로 나눕니다. 문장은 이 활동을 위해 만든 응답 예시입니다.',
  bins:[{id:'c',label:'칭찬',sub:'기준을 충족한 부분'},{id:'q',label:'질문',sub:'설계 의도와 근거'},{id:'s',label:'제안',sub:'바로 적용할 수정 방향 하나'}],cards:[
  {id:'a',label:'평가 증거가 학습 목표의 동사와 바로 이어집니다',answer:'c',why:'활용안의 특정 부분이 기준을 충족했다고 짚는 칭찬입니다.'},
  {id:'b',label:'AI 결과가 틀리면 학생은 어떻게 알아차리나요?',answer:'q',why:'설계의 근거를 묻는 질문입니다.'},
  {id:'c',label:'따로 남긴 사진으로 확인하는 단계를 넣어 보세요',answer:'s',why:'바로 적용할 수 있는 수정 방향 하나를 말하는 제안입니다.'},
  {id:'d',label:'문제 정의에 학년과 상황이 분명히 드러납니다',answer:'c',why:'문제 정의 기준을 충족한 부분을 가리키는 칭찬입니다.'},
  {id:'e',label:'이 도구를 학생 계정으로 쓸 수 있는지 확인하셨나요?',answer:'q',why:'이용 조건이라는 근거를 묻는 질문입니다.'},
  {id:'f',label:'검증 단계에 누가 확인하는지 한 줄을 더해 보세요',answer:'s',why:'고칠 위치와 방향을 하나로 좁힌 제안입니다.'}]});

 L.add('tuningOrder','order',{hint:'튜닝 프로토콜의 일곱 단계를 진행 순서대로 놓아 봅니다.',columns:4,seed:9,from:'시작',to:'끝',items:[
  {key:'1단계',label:'소개',sub:'목표와 규칙 안내'},{key:'2단계',label:'발표',sub:'발표자만 말함'},{key:'3단계',label:'확인 질문',sub:'사실 확인만'},{key:'4단계',label:'생각 정리',sub:'조용히 메모'},
  {key:'5단계',label:'피드백',sub:'발표자는 듣고 기록'},{key:'6단계',label:'발표자 성찰',sub:'의견을 골라 응답'},{key:'7단계',label:'마무리',sub:'과정 돌아보기'}]});

 L.add('feedbackSort','sort',{soft:true,hint:'기록지에 적힌 말입니다. 발표자가 <b>어느 부분을 어떻게 고칠지</b> 알 수 있는 말을 골라 나눕니다. 문장은 응답 예시입니다.',
  bins:[{id:'good',label:'도움이 되는 말',sub:'부분과 기준을 가리킴'},{id:'weak',label:'덜 도움이 되는 말',sub:'고칠 곳을 알 수 없음'}],cards:[
  {id:'a',label:'재미있는 수업이네요',answer:'weak',why:'어느 부분이 어떤 기준을 충족했는지 알 수 없습니다.'},
  {id:'b',label:'3단계에서 비교 기준이 표로 제시되어 좋습니다',answer:'good',why:'위치(3단계)와 좋은 이유를 함께 짚었습니다.'},
  {id:'c',label:'AI가 틀릴 수도 있을 것 같아요',answer:'weak',why:'걱정은 맞지만 어디를 고칠지 드러나지 않습니다.'},
  {id:'d',label:'따로 남긴 사진이 없으면 오류를 어떻게 확인하나요?',answer:'good',why:'같은 걱정을 수정 가능한 질문으로 바꾸었습니다.'},
  {id:'e',label:'전체적으로 조금 더 보완하면 좋겠습니다',answer:'weak',why:'보완할 부분과 방향이 없습니다.'},
  {id:'f',label:'평가 계획에 확인 시점을 한 줄 넣어 보세요',answer:'good',why:'고칠 위치와 방향을 하나로 좁혔습니다.'}]});

 L.add('triage','sort',{soft:true,hint:'받은 의견을 세 묶음으로 나눕니다. 루브릭 기준과 연결된 의견부터 반영합니다. 의견은 이 활동을 위해 만든 예시입니다.',
  bins:[{id:'now',label:'바로 반영',sub:'기준과 연결되고 수정이 간단'},{id:'later',label:'검토 후 반영',sub:'조건 확인이나 추가 자료 필요'},{id:'keep',label:'반영하지 않음',sub:'이유를 적고 보관'}],cards:[
  {id:'a',label:'검증 단계에 누가 확인하는지 적어 주세요',answer:'now',why:'결과 검증 기준과 연결되고 한 줄로 고칠 수 있습니다.'},
  {id:'b',label:'학습 목표와 평가 기준의 동사를 같은 말로 맞춰 주세요',answer:'now',why:'기준과 연결되고 수정이 간단합니다.'},
  {id:'c',label:'학교 기기에서 도구가 열리는지 확인이 필요합니다',answer:'later',why:'실행 가능성의 조건을 확인한 뒤 반영합니다.'},
  {id:'d',label:'학생이 쓸 수 있는 연령인지 약관을 다시 보세요',answer:'later',why:'이용 조건을 확인할 추가 자료가 필요합니다.'},
  {id:'e',label:'발표 화면의 배경색을 바꾸면 더 보기 좋겠습니다',answer:['keep','now'],why:'루브릭 기준과 거리가 멀어 뒤로 미루거나 보관합니다. 간단하다면 반영해도 됩니다.'},
  {id:'f',label:'아예 다른 교과의 수업으로 바꾸면 어떨까요?',answer:'keep',why:'정의한 문제와 맞지 않습니다. 이유를 적고 보관합니다.'}]});

 // Finding what must be fixed in a plan before it is shared.
 const SPOTS=[['학생 얼굴이 보이는 모둠 활동 사진',true,'학생 개인정보: 얼굴은 삭제하거나 가립니다.'],['이름을 가린 관찰 기록지',false,'이름을 지웠으므로 그대로 둘 수 있습니다.'],
  ['학생 목소리가 담긴 발표 녹음',true,'학생 개인정보: 목소리도 삭제 여부를 확인합니다.'],['출처를 적지 않은 인터넷 식물 사진',true,'저작권: 출처와 이용 허락을 확인합니다.'],
  ['교사가 직접 찍은 화단 사진',false,'직접 만든 자료이므로 그대로 둘 수 있습니다.'],['도구 이름만 있고 약관 확인 날짜가 없음',true,'이용 조건: 도구 약관과 확인 날짜를 적습니다.'],
  ['도구가 없을 때의 대체 방법 안내',false,'동료가 따라 할 수 있도록 함께 적는 내용입니다.'],['이용 허락을 확인하지 않은 삽화',true,'저작권: 이용 허락을 확인합니다.']];
 L.add('shareCheck','custom',{
  hint:'공유하려는 활용안에 들어 있는 자료 여덟 가지입니다. <b>공유 전에 고쳐야 할 것</b>을 모두 고르세요. 자료 목록은 이 활동을 위해 만든 예시입니다.',
  body:`<div class="md-split" style="--split:2.1fr 1fr"><div class="s81-doc">${SPOTS.map((s,i)=>`<button type="button" class="s81-spot" data-i="${i}" aria-pressed="false"><i></i>${s[0]}</button>`).join('')}</div>
   <div class="md-panel"><h3>공유 전 확인</h3><ul class="md-list"><li><b>학생 개인정보</b><span>이름, 얼굴, 목소리</span></li><li><b>저작권</b><span>출처와 이용 허락</span></li><li><b>이용 조건</b><span>약관과 확인 날짜</span></li></ul><p id="s81-why" style="font-size:.88em;margin-top:auto"></p></div></div>`,
  state:()=>({picked:[],checked:false,why:''}),
  render(ui,st,reset){
   const check=ui.action('확인',()=>{st.checked=true;st.why='';draw()},true);ui.action('다시 하기',reset);
   function draw(){
    ui.all('.s81-spot').forEach((b,i)=>{const on=st.picked.includes(i);b.setAttribute('aria-pressed',String(on));b.querySelector('i').textContent=on?'✓':'';
     if(st.checked)b.dataset.result=on===SPOTS[i][1]?'right':'wrong';else delete b.dataset.result});
    check.disabled=st.checked;ui.q('#s81-why').textContent=st.why;
    const right=SPOTS.filter((s,i)=>st.picked.includes(i)===s[1]).length;
    ui.say(st.checked?`여덟 가지 중 ${right}가지를 바르게 판단했습니다. 항목을 누르면 이유가 나옵니다.`:`고칠 것으로 ${st.picked.length}가지를 골랐습니다.`,st.checked&&right===SPOTS.length?'good':'');
   }
   ui.body.addEventListener('click',e=>{const b=e.target.closest('.s81-spot');if(!b)return;const i=Number(b.dataset.i);
    if(st.checked)st.why=SPOTS[i][2];else st.picked=st.picked.includes(i)?st.picked.filter(n=>n!==i):[...st.picked,i];draw()});
   draw();
  }});

 L.add('reflectPick','pick',{hint:'여섯 단계 가운데 이 과정에서 내 판단이 가장 크게 달라진 단계 하나를 골라 봅니다.',reasonLabel:'무엇이 달라졌는지 한 문장으로 적어 봅니다.',after:'골랐습니다. 다음 장에서 다음 학기의 적용 계획으로 이어 갑니다.',options:[
  {id:'concept',label:'개념',sub:'학생에게 AI를 한 문장으로 어떻게 설명하는가'},{id:'principle',label:'원리',sub:'데이터와 학습 방식이 결과를 어떻게 바꾸는가'},
  {id:'use',label:'활용',sub:'도구를 고를 때 무엇을 먼저 보았는가'},{id:'verify',label:'검증',sub:'AI 결과를 믿기 전에 무엇을 확인하는가'},
  {id:'ethics',label:'윤리',sub:'누구에게 어떤 위험이 생길 수 있는가'},{id:'apply',label:'적용',sub:'다음 학기에 실제로 적용할 한 차시는 무엇인가'}]});
})();
