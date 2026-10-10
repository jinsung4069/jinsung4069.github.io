/* 1주차 오전, 개강식 및 오리엔테이션: activity slides. Figures and wording follow the slides they come after. */
(()=>{
 'use strict';
 const L=window.ceLabs;if(!L)return;
 const TRENDS=[
  {id:'reasoning',label:'추론형 모델',sub:'단계를 나누어 생각한 뒤 답함'},{id:'multimodal',label:'멀티모달',sub:'글, 그림, 소리, 영상을 함께 다룸'},
  {id:'grounded',label:'자료 기반 생성',sub:'내가 준 자료 안에서 답과 인용 제시'},{id:'agent',label:'AI 에이전트',sub:'도구를 써서 일을 이어서 수행'},
  {id:'small',label:'작고 저렴한 모델',sub:'기기 안 실행, 공개 모델 확산'},{id:'physical',label:'피지컬 AI',sub:'로봇처럼 현실에서 움직임'}];

 L.add('passCalc','custom',{
  hint:'출석 시간과 영역별 점수를 바꾸어 이수 기준 두 가지를 모두 충족하는지 확인합니다.',
  body:`<div class="md-split" style="--split:1.25fr 1fr"><div class="md-panel"><h3>내 점수 넣어 보기</h3>
   <label class="md-slider">출석 시간<input type="range" data-k="hours" min="0" max="45" step="1"><output></output></label>
   <label class="md-slider">과제 및 산출물<input type="range" data-k="task" min="0" max="30" step="1"><output></output></label>
   <label class="md-slider">프로젝트 평가<input type="range" data-k="project" min="0" max="40" step="1"><output></output></label>
   <label class="md-slider">참여<input type="range" data-k="join" min="0" max="10" step="1"><output></output></label>
   <p style="font-size:.78em;color:#52607f">출석 점수 20점은 출석 시간에 비례한다고 가정한 계산 예시입니다. 실제 산정 방식은 운영 안내를 따릅니다.</p></div>
   <div class="md-panel"><h3>이수 기준 확인</h3><ul class="md-list"><li><span>출석률 80% 이상(36시간)</span><b id="pc-rate"></b></li><li><span>총점 60% 이상</span><b id="pc-total"></b></li></ul>
   <div class="md-meter" aria-hidden="true"><i id="pc-bar"></i></div><p id="pc-note" style="font-size:.85em"></p><p class="md-verdict" id="pc-verdict"></p></div></div>`,
  state:()=>({hours:45,task:24,project:30,join:8}),
  render(ui,st,reset){
   ui.action('처음 값으로',reset);
   const draw=()=>{
    ui.all('.md-slider input').forEach(input=>{input.value=st[input.dataset.k];input.nextElementSibling.textContent=st[input.dataset.k]+(input.dataset.k==='hours'?'시간':'점')});
    const rate=st.hours/45*100,attend=Math.round(st.hours/45*200)/10,total=Math.round((attend+st.task+st.project+st.join)*10)/10,okRate=st.hours>=36,okTotal=total>=60;
    ui.q('#pc-rate').textContent=`${rate.toFixed(1)}% ${okRate?'충족':'미달'}`;ui.q('#pc-total').textContent=`${total}점 ${okTotal?'충족':'미달'}`;
    ui.q('#pc-bar').style.width=total+'%';ui.q('#pc-note').textContent=`출석 ${attend} + 과제 ${st.task} + 프로젝트 ${st.project} + 참여 ${st.join} = ${total}점`;
    const v=ui.q('#pc-verdict');v.textContent=okRate&&okTotal?'이수':'미이수';v.dataset.tone=okRate&&okTotal?'good':'bad';
    ui.say(okRate&&okTotal?'두 기준을 모두 충족했습니다.':!okRate?`출석이 ${36-st.hours}시간 모자랍니다. 결석할 수 있는 시간은 9시간까지입니다.`:`총점이 ${Math.round((60-total)*10)/10}점 모자랍니다.`,okRate&&okTotal?'good':'bad');
   };
   ui.body.addEventListener('input',e=>{if(e.target.dataset.k){st[e.target.dataset.k]=Number(e.target.value);draw()}});draw();
  }});

 L.add('trendPick','pick',{hint:'설명을 듣기 전에 직관으로 고릅니다. 1년 안에 내 수업이나 업무를 가장 크게 바꿀 흐름은 무엇일까요?',options:TRENDS,
  after:'골랐습니다. 이 선택은 Part 2 마지막 장에서 다시 확인합니다.'});

 L.add('genaiOrder','order',{hint:'생성형 AI의 여덟 장면을 일어난 순서대로 놓아 봅니다. 확인하면 시기가 나타납니다.',columns:4,seed:11,from:'2022년',to:'2026년',items:[
  {key:'2022.11',label:'ChatGPT 공개',sub:'대화형 AI 대중화'},{key:'2023.12',label:'Gemini 공개',sub:'글, 그림, 소리를 함께'},
  {key:'2024.5',label:'GPT-4o 공개',sub:'실시간 음성 대화'},{key:'2024.9',label:'o1 공개',sub:'생각한 뒤 답하는 추론'},
  {key:'2025.1',label:'DeepSeek-R1',sub:'추론 모델 공개 배포'},{key:'2025.8',label:'GPT-5 공개',sub:'질문에 따라 추론 선택'},
  {key:'2026.6',label:'Claude Fable 5',sub:'상위 모델은 제한 공개'},{key:'2026.10',label:'GPT-6 공개',sub:'차트와 버튼으로 답함'}]});

 L.add('riskMatch','match',{hint:'여섯 가지 위험과 학교에서 생길 수 있는 장면을 짝지어 봅니다.',leftTitle:'위험',rightTitle:'학교에서 생길 수 있는 장면',seed:5,pairs:[
  {left:'환각',right:'없는 자료나 통계를 사실처럼 제시'},{left:'편향',right:'특정 집단에 대한 고정관념이 담긴 예문'},
  {left:'딥페이크',right:'친구 얼굴을 합성한 사진과 영상'},{left:'저작권',right:'남의 그림과 글을 출처 없이 학습자료에 사용'},
  {left:'개인정보',right:'학생 이름과 상담 내용을 AI에 입력'},{left:'과의존',right:'스스로 생각하기 전에 AI에 먼저 묻기'}]});

 L.add('policyQuiz','quiz',{hint:'정책 동향에서 본 날짜와 수치를 확인합니다.',closing:'날짜와 수치는 공식 발표 기준이며 이후 바뀔 수 있습니다.',questions:[
  {q:'인공지능 기본법은 언제부터 시행되었을까요?',short:'인공지능 기본법 시행 시기',choices:['2025년 1월','2026년 1월','2026년 3월'],answer:1,why:'2025년 1월에 공포되었고 2026년 1월 22일부터 시행되었습니다.'},
  {q:'인공지능 기본법에서 의무를 지는 주체는 누구일까요?',short:'기본법의 의무 주체',choices:['AI를 쓰는 교사','AI를 개발하거나 제공하는 사업자','AI를 쓰는 학생과 보호자'],answer:1,why:'의무의 주체는 사업자입니다. 다만 학교가 평가에 AI 도구를 들일 때 무엇을 확인할지 묻는 근거가 됩니다.'},
  {q:'초중등 학생 평가에 쓰이는 AI는 인공지능 기본법의 고영향 AI에 포함된다.',short:'학생 평가용 AI와 고영향 AI',choices:['그렇다','아니다'],answer:0,why:'제2조는 초중등 학생 평가에 쓰이는 AI를 고영향 AI 영역에 포함합니다.'},
  {q:'2025년 8월 법 개정 뒤 AI 디지털교과서의 지위는 무엇이 되었을까요?',short:'AI 디지털교과서의 지위',choices:['교과서','교육자료','학습지원 소프트웨어 인증 도구'],answer:1,why:'교육자료로 바뀌어 학교가 쓸지와 무엇을 쓸지를 정합니다.'},
  {q:'2026년 3월 선정된 AI 중점학교는 몇 곳일까요?',short:'AI 중점학교 수',choices:['730개교','1,141개교','2,000개교'],answer:1,why:'1,141개교가 선정되어 3년 동안 운영하며, 2028년까지 2,000곳으로 늘릴 계획입니다.'},
  {q:'UNESCO가 2023년 생성형 AI 지침에서 권고한 교실 사용 최소 연령은?',short:'UNESCO 권고 최소 연령',choices:['10세','13세','16세'],answer:1,why:'사람 중심 접근과 함께 교실 사용 최소 13세를 권고했습니다.'}]});

 L.add('schoolCheck','checklist',{hint:'우리 학교를 떠올리며 여섯 질문에 답해 봅니다. 이어지는 모둠 토의의 쟁점을 고르는 데 씁니다.',head:['쟁점','학교에서 던질 질문'],scale:['그렇다','부분적','아니다, 모름'],
  lowest:'먼저 다룰 쟁점 후보:',allGood:'여섯 질문 모두 준비되어 있습니다. 근거가 되는 학교 규정이나 사례를 떠올려 보세요.',items:[
  {label:'교사 역할',question:'AI가 만든 자료를 누가 검토하고 최종 판단하는지 정해져 있다'},{label:'개인정보',question:'학생 정보를 입력하지 않고도 활동할 수 있다'},
  {label:'저작권',question:'AI 결과물과 원자료의 이용 조건을 확인한다'},{label:'접근성과 격차',question:'기기와 계정이 없는 학생도 같은 경험을 한다'},
  {label:'과의존',question:'AI 없이 생각하고 표현하는 시간이 있다'},{label:'계정과 데이터',question:'학생 계정과 학습 기록을 누가 어떻게 관리하는지 안다'}]});

 L.add('trendReview','pick',{review:'trendPick',hint:'Part 2를 모두 본 지금, 1년 안에 내 수업이나 업무를 가장 크게 바꿀 흐름을 다시 골라 봅니다.',options:TRENDS,reasonLabel:'생각이 바뀌었거나 그대로인 이유를 적어 봅니다.'});
})();
