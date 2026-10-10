/* 7주차 오후, 인공지능 활용 교육 프로젝트 설계: activity slides. Plan sentences, memos, time values and the plan excerpt are written for these activities; the rubric wording is the deck's. */
(()=>{
 'use strict';
 const L=window.ceLabs;if(!L)return;const esc=L.esc;
 L.style(`.md-lab .s72-parts{flex:none;display:grid;grid-template-columns:1fr 1fr 1.75fr;gap:.8em}.md-lab .s72-parts .md-panel{padding:.6em .8em;gap:.4em}
.md-lab .s72-stack{display:grid;gap:.32em}
.md-lab .s72-opt{padding:.32em .7em;border:1px solid #9fb0dc;border-radius:.5em;background:#fff;color:#1c2c4c;font-size:.84em;line-height:1.35;text-align:left;cursor:pointer}
.ce-lab.md-lab .s72-sentence{padding:.5em .8em;border-left:.25em solid #3f5dae;border-radius:0 .5em .5em 0;background:#fff;font-weight:700;line-height:1.5}
.ce-lab.md-lab .s72-state{margin-top:auto;padding:.4em .6em;border-radius:.6em;background:#ebf0fc;color:#2c478f;font-weight:800;text-align:center}.ce-lab.md-lab .s72-state[data-tone=bad]{background:#fdeceb;color:#b5372f}.ce-lab.md-lab .s72-state[data-tone=good]{background:#e3f5ec;color:#16794c}
.md-lab .s72-diag{font-size:.84em}.md-lab .s72-diag span[data-tone=good]{color:#16794c;font-weight:700}.md-lab .s72-diag span[data-tone=warn]{color:#8a6100;font-weight:700}.md-lab .s72-diag span[data-tone=bad]{color:#b5372f;font-weight:700}
.md-lab .s72-sl{display:grid;grid-template-columns:1fr 6.4em;align-items:center;gap:.05em .6em;font-size:.88em}.md-lab .s72-sl span{grid-column:1/-1}.md-lab .s72-sl output{font-weight:800;color:#2c478f;text-align:right}
.ce-lab.md-lab .s72-note{margin-top:auto;color:#52607f;font-size:.78em;line-height:1.45}
.md-lab .s72-methods{flex:1;min-height:0;display:grid;grid-auto-rows:minmax(0,1fr);gap:.55em}
.md-lab .s72-method{display:grid;grid-template-columns:7.6em minmax(0,1fr);align-content:center;gap:.2em .9em;padding:.4em .9em;border:1px solid #d5ddf1;border-radius:.5em;background:#fff;font-size:.86em;line-height:1.4}
.md-lab .s72-method>b{grid-row:1/4;align-self:center;color:#2c478f;font-size:1.08em;line-height:1.3}.md-lab .s72-method em{margin-right:.5em;color:#52607f;font-style:normal;font-weight:700}
.md-lab .s72-time{display:grid;grid-template-columns:minmax(0,1fr) 12.5em;align-items:center;gap:.7em}.md-lab .s72-time output{font-weight:800;color:#2c478f;text-align:right}.md-lab .s72-time .md-meter{height:.8em}
.md-lab .s72-plan{flex:1;min-height:0;display:grid;grid-auto-rows:minmax(0,1fr);gap:.45em}
.md-lab .s72-prow{display:grid;grid-template-columns:5.4em repeat(var(--n),minmax(0,1fr));gap:.4em}.md-lab .s72-prow>b{align-self:center;color:#2c478f;font-size:.86em;line-height:1.3}
.md-lab .s72-prow .s72-opt{padding:.3em .55em;font-size:.78em}
.md-lab .s72-links{flex:1;min-height:0;display:grid;grid-auto-rows:minmax(0,1fr);gap:.45em;margin:0;padding:0;list-style:none}
.md-lab .s72-links li{display:grid;align-content:center;padding:.3em .7em;border:1px solid #f0c5c1;border-left:.32em solid #c2413b;border-radius:.4em;background:#fff;font-size:.8em;line-height:1.4}
.md-lab .s72-links li[data-ok=true]{border-color:#b7dcc9;border-left-color:#1f8a5b}.md-lab .s72-links b{color:#2c478f}
.md-lab .s72-venn{flex:1;min-height:0;width:100%}.md-lab .s72-venn .s72-ring{fill:none;stroke:#7f8db0;stroke-width:2;stroke-dasharray:7 6}
.md-lab .s72-zone{cursor:pointer}.md-lab .s72-zone circle,.md-lab .s72-zone rect{fill:#fff;stroke:#52607f;stroke-width:1.5}
.md-lab .s72-zone text{font-size:15px;font-weight:800;fill:#1c2c4c;text-anchor:middle;dominant-baseline:central;pointer-events:none}.md-lab .s72-zone text.s72-sub{font-size:11px;font-weight:600;fill:#52607f}
.md-lab .s72-zone[data-done=true] circle,.md-lab .s72-zone[data-done=true] rect{fill:#e3f5ec;stroke:#1f8a5b;stroke-width:3}.md-lab .s72-zone[data-miss=true] circle{fill:#fdeceb;stroke:#c2413b;stroke-width:3}
.md-lab .s72-ref{flex:1;min-height:0;grid-auto-rows:minmax(0,1fr);font-size:.84em}.md-lab .s72-ref li{align-items:center;padding:.15em .8em;line-height:1.35}.md-lab .s72-ref li b{flex:none;min-width:3.6em;color:#2c478f}.md-lab .s72-ref li span{text-align:right}
.md-lab .s72-ref li[data-done=true]{border-color:#1f8a5b;background:#e3f5ec}
.md-lab .s72-rubwrap{flex:1;min-height:0}.md-lab .s72-rubric{width:100%;height:100%;margin:0;border-collapse:collapse;table-layout:fixed;font-size:.8em}
.md-lab .s72-rubric th,.md-lab .s72-rubric td{padding:.26em .5em;border:1px solid #c9d3ec;line-height:1.35;text-align:left}
.md-lab .s72-rubric thead th{background:#3f5dae;color:#fff;font-weight:800;text-align:center}.md-lab .s72-rubric tbody th{background:#ebf0fc;color:#2c478f;font-weight:800}
.md-lab .s72-rubric tbody tr[data-open=true] th{background:#fff7df}
.md-lab .s72-level{display:block;width:100%;padding:.3em .45em;border:1px solid #9fb0dc;border-radius:.45em;background:#fff;color:#1c2c4c;font-size:.94em;line-height:1.3;text-align:center;cursor:pointer}`);
 const options=(list,key)=>list.map((o,j)=>`<button type="button" class="s72-opt" data-k="${key}" data-j="${j}" aria-pressed="false">${esc(o.t)}</button>`).join('');

 L.add('startSort','sort',{hint:'활용안의 첫 문장입니다. <b>도구에서 출발한 계획</b>인지 <b>문제에서 출발한 계획</b>인지 나누어 봅니다. 문장은 이 활동을 위해 고른 예시입니다.',
  bins:[{id:'tool',label:'도구에서 출발',sub:'도구를 수업 어디에 넣을지 먼저 고민'},{id:'problem',label:'문제에서 출발',sub:'학생이나 교사가 어려워하는 지점을 먼저 정함'}],cards:[
  {id:'a',label:'새로 알게 된 그림 생성 AI를 미술 시간에 써 보려 합니다',answer:'tool',why:'도구가 먼저 정해져 있고 누가 무엇을 어려워하는지는 드러나지 않습니다.'},
  {id:'b',label:'4학년 학생 일부가 설명하는 글을 쓸 때 문단의 중심 문장을 세우지 못합니다',answer:'problem',why:'대상, 상황, 어려움이 드러나 여러 대안을 비교할 수 있습니다.'},
  {id:'c',label:'연수에서 배운 챗봇을 어느 단원에 넣을지 찾고 있습니다',answer:'tool',why:'도구를 넣을 자리를 찾는 계획입니다. 도구 사용이 목표가 되기 쉽습니다.'},
  {id:'d',label:'서술형 과제의 피드백이 늦어져 학생이 고쳐 쓸 때를 놓칩니다',answer:'problem',why:'피드백이 늦어지는 과제라는 어려움에서 출발합니다. AI는 여러 대안 중 하나가 됩니다.'},
  {id:'e',label:'우리 반에 AI 튜터를 도입하고 싶습니다',answer:'tool',why:'해결책만 있고 누가 무엇을 어려워하는지 드러나지 않습니다.'},
  {id:'f',label:'5학년 학생 일부가 분수의 덧셈에서 분모끼리 더하는 오류를 스스로 알아차리지 못합니다',answer:'problem',why:'해결 방법을 문장에서 뺐기 때문에 여러 대안을 비교할 수 있습니다.'}]});

 // A problem statement assembled from three elements. Each option carries the diagnosis shown beside the sentence.
 const ELEMENTS=[
  {name:'누가',opts:[{t:'(비워 둠)',tone:'bad',note:'비어 있음'},{t:'우리 반에서',tone:'warn',note:'누가 어려워하는지 분명하지 않음'},{t:'6학년 학생 일부가',tone:'good',note:'대상이 드러남'}]},
  {name:'어떤 상황에서',opts:[{t:'(비워 둠)',tone:'bad',note:'비어 있음'},{t:'국어 시간에',tone:'warn',note:'어떤 활동인지 분명하지 않음'},{t:'주장하는 글을 고쳐 쓸 때',tone:'good',note:'상황이 드러남'}]},
  {name:'무엇이 어려운가',opts:[{t:'AI 글쓰기 도우미가 필요합니다',tone:'bad',note:'어려움이 아니라 해결책',fix:true},{t:'글쓰기 능력이 부족합니다',tone:'warn',note:'모호한 단어, 관찰하기 어려움'},{t:'근거가 주장을 뒷받침하는지 스스로 점검하지 못합니다',tone:'good',note:'관찰할 수 있는 어려움'}]}];
 L.add('problemBuilder','custom',{
  hint:'세 요소에서 표현을 하나씩 골라 <b>문제 정의 문장</b>을 만듭니다. 어느 요소가 빠졌거나 흐린지 오른쪽에서 확인합니다. 표현은 예시입니다.',
  body:`<div class="s72-parts">${ELEMENTS.map((el,i)=>`<div class="md-panel"><h3>${el.name}</h3><div class="s72-stack">${options(el.opts,i)}</div></div>`).join('')}</div>
   <div class="md-split" style="--split:1.35fr 1fr"><div class="md-panel"><h3>지금 만든 문장</h3><p class="s72-sentence" id="s72-sentence"></p><p class="s72-state" id="s72-verdict"></p></div>
    <div class="md-panel"><h3>문장 점검</h3><ul class="md-list s72-diag" id="s72-diag"></ul></div></div>`,
  state:()=>({pick:[0,0,0]}),
  render(ui,st,reset){
   ui.action('고치기 전 문장으로',reset);
   function draw(){
    const got=ELEMENTS.map((el,i)=>el.opts[st.pick[i]]),tone=got.map(o=>o.tone),fixed=!!got[2].fix,all=tone.every(t=>t==='good');
    ui.all('.s72-opt').forEach(b=>b.setAttribute('aria-pressed',String(st.pick[b.dataset.k]===Number(b.dataset.j))));
    ui.q('#s72-sentence').textContent=got.filter((o,i)=>i===2||st.pick[i]>0).map(o=>o.t).join(' ')+'.';
    const compare=fixed?['bad','해결책이 정해져 비교할 수 없음']:all?['good','여러 대안을 비교할 수 있음']:['warn','세 요소가 분명해야 비교할 수 있음'];
    ui.q('#s72-diag').innerHTML=ELEMENTS.map((el,i)=>`<li><b>${el.name}</b><span data-tone="${tone[i]}">${got[i].note}</span></li>`).join('')+`<li><b>대안 비교</b><span data-tone="${compare[0]}">${compare[1]}</span></li>`;
    const left=tone.filter(t=>t!=='good').length,v=ui.q('#s72-verdict');v.textContent=all?'세 요소가 드러난 문제 정의 문장':`고쳐 쓸 요소 ${left}개`;v.dataset.tone=all?'good':'bad';
    const empty=ELEMENTS.filter((_,i)=>i<2&&st.pick[i]===0).map(el=>el.name);
    ui.say(all?'대상, 상황, 어려움이 드러나 여러 대안을 비교할 수 있습니다. 문장에 해결 방법은 들어 있지 않습니다.'
     :fixed&&empty.length===2?'해결책만 있고 누가 무엇을 어려워하는지 드러나지 않습니다. 세 요소를 하나씩 바꾸어 보세요.'
     :fixed?'해결 방법을 문장에서 빼야 대안을 비교할 수 있습니다. 무엇이 어려운지로 바꾸어 보세요.'
     :empty.length?`${empty.join(', ')} 요소가 비어 있습니다.`:'분명하지 않은 표현이 남았습니다. 모호한 단어는 관찰할 수 있는 행동으로 고칩니다.',all?'good':fixed?'bad':'');
   }
   ui.body.addEventListener('click',e=>{const b=e.target.closest('.s72-opt');if(b){st.pick[b.dataset.k]=Number(b.dataset.j);draw()}});
   draw();
  }});

 // Teacher minutes for three ways of handling the fraction example. Every minute value is an example chosen for the comparison.
 const QUIZ_MINUTES=20;
 L.add('needCompare','custom',{
  hint:'분수 덧셈 예시의 세 가지 해결 방법을 <b>우리 반의 조건</b>에 맞추어 비교합니다. 시간은 비교를 위해 정한 예시 값입니다.',
  body:`<div class="md-split" style="--split:1fr 1.5fr"><div class="md-panel"><h3>우리 반의 조건</h3>
    <label class="s72-sl"><span>오류를 확인할 학생 수</span><input type="range" data-k="n" min="2" max="28" step="2"><output></output></label>
    <label class="s72-sl"><span>한 학생의 풀이를 직접 살피는 시간</span><input type="range" data-k="t" min="1" max="5" step="1"><output></output></label>
    <label class="s72-sl"><span>AI 피드백 하나를 교사가 검토하는 시간</span><input type="range" data-k="r" min="0" max="3" step="0.5"><output></output></label>
    <label class="s72-sl"><span>계정과 입력 정보를 점검하는 시간</span><input type="range" data-k="s" min="0" max="60" step="10"><output></output></label>
    <p class="s72-note">일반 디지털 도구는 퀴즈 준비 ${QUIZ_MINUTES}분으로 두었습니다. 실제 시간은 학급과 도구에 따라 다릅니다.</p></div>
   <div class="md-panel"><h3>같은 문제를 푸는 세 가지 방법과 교사가 쓰는 시간</h3><div class="s72-methods" id="s72-methods"></div></div></div>`,
  state:()=>({n:24,t:3,r:1,s:30}),
  render(ui,st,reset){
   ui.action('처음 값으로',reset);
   function draw(){
    const text={n:st.n+'명',t:st.t+'분',r:st.r?st.r+'분':'검토 안 함',s:st.s+'분'};
    ui.all('.s72-sl input').forEach(input=>{input.value=st[input.dataset.k];input.nextElementSibling.textContent=text[input.dataset.k]});
    const direct=st.n*st.t,ai=st.n*st.r+st.s,top=Math.max(direct,ai,QUIZ_MINUTES,60);
    const rows=[['수업 방법 조정','분수 막대로 개념을 다시 설명','개별 오류 확인에 시간이 듦',direct,`${st.n}명 × ${st.t}분 = ${direct}분`],
     ['일반 디지털 도구','온라인 퀴즈로 오답을 바로 확인','오류의 이유까지는 알기 어려움',QUIZ_MINUTES,`퀴즈 준비 ${QUIZ_MINUTES}분`],
     ['AI 도구','풀이에 맞춘 개별 피드백','피드백 오류, 계정과 입력 정보 점검',ai,`${st.n}명 × ${st.r}분 + ${st.s}분 = ${ai}분`]];
    ui.q('#s72-methods').innerHTML=rows.map(([name,effect,risk,minutes,sum])=>`<div class="s72-method"><b>${name}</b><span><em>기대 효과</em>${effect}</span><span><em>부담과 위험</em>${risk}</span><div class="s72-time"><div class="md-meter"><i style="width:${minutes/top*100}%"></i></div><output>${sum}</output></div></div>`).join('');
    ui.say(!st.r?'AI 피드백을 검토하지 않으면 피드백 오류를 알아차릴 수 없습니다. 결과를 교사가 확인하고 고칠 수 있어야 적합한 문제입니다.'
     :ai<direct?`이 조건에서는 AI 도구가 직접 살피는 것보다 ${direct-ai}분 덜 듭니다. 대신 피드백 오류와 계정, 입력 정보를 점검해야 합니다.`
     :ai===direct?'이 조건에서는 AI 도구와 직접 살피는 방법에 드는 시간이 같습니다. 부담과 위험까지 견주어 고릅니다.'
     :`이 조건에서는 직접 살피는 방법이 AI 도구보다 ${ai-direct}분 덜 듭니다. AI가 아닌 대안을 고르는 근거가 됩니다.`,!st.r?'bad':'');
   }
   ui.body.addEventListener('input',e=>{const k=e.target.dataset.k;if(k){st[k]=Number(e.target.value);draw()}});
   draw();
  }});

 L.add('flowOrder','order',{hint:'다음 장을 보기 전에 활용안 설계의 <b>여덟 단계</b>를 순서대로 놓아 봅니다. 평가 계획은 차시 흐름보다 앞일까요, 뒤일까요?',columns:4,seed:5,from:'먼저',to:'나중',items:[
  {key:'1',label:'문제 정의',sub:'대상, 상황, 어려움'},{key:'2',label:'성취기준 연결',sub:'교육과정 원문 확인'},{key:'3',label:'학습 목표',sub:'관찰 가능한 행동'},{key:'4',label:'평가 계획',sub:'목표 달성의 증거'},
  {key:'5',label:'AI의 역할',sub:'학생 사용, 교사 사용'},{key:'6',label:'차시 흐름',sub:'AI 사용 전, 중, 후'},{key:'7',label:'도구와 점검',sub:'이용 조건, 윤리, 검증'},{key:'8',label:'효과 확인',sub:'기대 효과와 확인 방법'}]});

 L.add('goalQuiz','quiz',{hint:'학습 목표 문장입니다. <b>무엇을 보고 판단할지</b> 드러나는 목표인지 골라 봅니다. 첫 문장 외에는 이 활동을 위해 만든 예시입니다.',closing:'목표를 정했다면 다음 장의 백워드 설계에서 그 결과를 확인할 증거를 이어서 정합니다.',questions:[
  {q:'"AI를 활용하여 인공지능을 이해한다."',short:'AI를 활용하여 인공지능을 이해한다',choices:['평가 증거로 이어지는 목표','고쳐 쓸 목표'],answer:1,why:'도구 사용과 이해가 섞여 있어 무엇을 보고 판단할지 알 수 없습니다.'},
  {q:'"분수의 덧셈에서 틀린 풀이를 찾아 고친 이유를 설명할 수 있다."',short:'틀린 풀이를 찾아 고친 이유를 설명할 수 있다',choices:['평가 증거로 이어지는 목표','고쳐 쓸 목표'],answer:0,why:'찾기와 설명이라는 행동이 드러나 오류 설명 기록 같은 증거로 이어집니다.'},
  {q:'"생성형 AI로 발표 자료를 만들 수 있다."',short:'생성형 AI로 발표 자료를 만들 수 있다',choices:['평가 증거로 이어지는 목표','고쳐 쓸 목표'],answer:1,why:'도구 사용이 목표가 되었습니다. 평가 증거는 AI를 사용했다는 사실이 아니라 학생이 보여 준 이해입니다.'},
  {q:'"생활 속 AI 사례의 이익과 위험을 한 가지씩 들어 정리할 수 있다."',short:'사례의 이익과 위험을 들어 정리할 수 있다',choices:['평가 증거로 이어지는 목표','고쳐 쓸 목표'],answer:0,why:'정리한 내용이 그대로 평가 증거가 됩니다. 모둠 토의 관찰이나 자기 평가로 확인할 수 있습니다.'},
  {q:'"AI의 편리함을 느끼고 흥미를 가진다."',short:'AI의 편리함을 느끼고 흥미를 가진다',choices:['평가 증거로 이어지는 목표','고쳐 쓸 목표'],answer:1,why:'느낀다, 흥미를 가진다는 관찰하기 어렵습니다. 설명하기나 비교하기처럼 관찰 가능한 행동으로 고칩니다.'}]});

 L.add('conditionMatch','match',{hint:'활용안에 적은 메모가 <b>도구와 이용 조건</b>의 어느 점검 항목에 답하는지 짝지어 봅니다. 메모는 이 활동을 위해 만든 예시입니다.',leftTitle:'점검 항목',rightTitle:'활용안에 적은 메모(예시)',seed:8,pairs:[
  {left:'이용 연령과 계정',right:'학생은 가입하지 않고 교사 계정으로 시연하는 화면을 함께 봄'},
  {left:'입력 정보',right:'교실 물건 사진만 쓰고 얼굴과 이름표가 나오지 않게 촬영함'},
  {left:'저장과 학습 이용',right:'입력 자료가 학습에 쓰이지 않도록 설정을 확인하고 끔'},
  {left:'비용과 접속 환경',right:'무료 기능만 쓰고 태블릿 여섯 대로 모둠마다 한 대씩 사용함'},
  {left:'대체 방법',right:'접속이 안 되면 미리 인쇄한 예시 화면으로 활동을 이어 감'}]});

 // The TPACK picture as a board: three circles, their overlaps, and the context ring around them.
 const ZONES={TK:{x:210,y:82,r:30,sub:'기술',q:'도구의 작동 원리, 한계, 오류 대처를 알고 있는가'},PK:{x:108,y:284,r:30,sub:'교수법',q:'학습자 수준에 맞는 수업 방법과 평가를 골랐는가'},CK:{x:312,y:284,r:30,sub:'내용',q:'가르칠 개념과 흔한 오개념을 정확히 파악했는가'},
  TPK:{x:157,y:180,r:24,q:'도구가 수업 방법과 학생 참여를 어떻게 바꾸는가'},TCK:{x:263,y:180,r:24,q:'도구가 내용을 보여 주는 방식이 개념을 왜곡하지 않는가'},PCK:{x:210,y:292,r:24},
  TPACK:{x:210,y:218,r:29,q:'이 내용, 이 학생, 이 도구에서 세 지식이 맞물리는가'},XK:{x:210,y:378,sub:'맥락',q:'학교의 기기, 시간, 규정 안에서 실행할 수 있는가'}};
 const MEMOS=[['XK','학교 태블릿 수와 두 차시라는 시간, 계정 규정 안에서 할 수 있는지 확인했다.'],['CK','AI가 데이터로 학습해 예측한다는 개념과, AI가 스스로 안다고 여기는 오개념을 정리했다.'],
  ['TPK','도구를 쓰면 설명을 듣던 수업이 학생이 직접 자료를 바꾸어 보는 수업으로 달라진다.'],['TK','이미지 분류 도구가 어떻게 학습하는지, 예측이 틀리면 어떻게 대처할지 알고 있다.'],
  ['PK','5학년 수준에 맞추어 예상을 먼저 적고 비교하는 활동과 채점 기준표를 골랐다.'],['TCK','사진 몇 장으로 만든 모델이 학습이라는 개념을 잘못 보여 주지 않는지 살폈다.'],
  ['TPACK','이 개념을 이 학생들에게 이 도구로 가르치는 것이 서로 맞는지 한 문장으로 설명했다.']];
 L.add('tpackPlace','custom',{
  hint:'활용안을 점검하며 적은 메모입니다. 메모가 답하는 <b>지식 영역</b>을 그림에서 눌러 봅니다. 메모는 초등 실과 수업 예시를 바탕으로 만든 예시입니다.',
  body:`<div class="md-split" style="--split:1fr 1.35fr"><div class="md-panel"><svg class="s72-venn" viewBox="0 0 420 402" role="group" aria-label="TPACK 그림. 영역을 눌러 고릅니다.">
     <circle class="s72-ring" cx="210" cy="205" r="192"/><circle cx="210" cy="140" r="105" fill="#f0a202" fill-opacity=".2" stroke="#c98a00"/><circle cx="150" cy="246" r="105" fill="#1f8a5b" fill-opacity=".18" stroke="#1f8a5b"/><circle cx="270" cy="246" r="105" fill="#3f5dae" fill-opacity=".2" stroke="#3f5dae"/>
     ${Object.entries(ZONES).map(([k,z])=>`<g class="s72-zone" data-zone="${k}" role="button" aria-label="${k}">${k==='XK'?`<rect x="${z.x-50}" y="${z.y-15}" width="100" height="30" rx="15"/><text x="${z.x}" y="${z.y}">XK 맥락</text>`
      :`<circle cx="${z.x}" cy="${z.y}" r="${z.r}"/><text x="${z.x}" y="${z.sub?z.y-7:z.y}">${k}</text>${z.sub?`<text class="s72-sub" x="${z.x}" y="${z.y+11}">${z.sub}</text>`:''}`}</g>`).join('')}</svg></div>
    <div class="md-panel"><h3 id="s72-turn"></h3><p class="s72-sentence" id="s72-memo"></p><h3>일곱 지식과 점검 질문</h3><ul class="md-list s72-ref" id="s72-ref"></ul></div></div>`,
  state:()=>({i:0,wrong:0,miss:null}),
  render(ui,st,reset){
   ui.action('처음부터',reset);
   function draw(hit){
    const over=st.i>=MEMOS.length,done=MEMOS.slice(0,st.i).map(m=>m[0]);
    ui.q('#s72-turn').textContent=over?'일곱 메모를 모두 놓았습니다':`점검 메모 ${st.i+1} / ${MEMOS.length}`;
    ui.q('#s72-memo').textContent=over?'특정 내용을 특정 방법과 기술로 가르치는 판단이 TPACK의 핵심입니다.':MEMOS[st.i][1];
    ui.all('.s72-zone').forEach(g=>{g.dataset.done=String(done.includes(g.dataset.zone));g.dataset.miss=String(st.miss===g.dataset.zone)});
    ui.q('#s72-ref').innerHTML=['CK','PK','TK','TCK','TPK','TPACK','XK'].map(k=>`<li data-done="${done.includes(k)}"><b>${k}</b><span>${ZONES[k].q}</span></li>`).join('');
    ui.say(over?`잘못 고른 횟수는 ${st.wrong}번입니다. 내 활용안에서는 어느 지식의 메모가 가장 비어 있을까요?`
     :st.miss==='PCK'?'PCK는 이번 점검표에 없는 영역입니다. 일곱 지식 가운데에서 다시 골라 보세요.'
     :st.miss?`${st.miss}의 질문은 "${ZONES[st.miss].q}"입니다. 이 메모가 답하는 질문을 다시 찾아보세요.`
     :hit?`맞았습니다. ${hit}의 질문은 "${ZONES[hit].q}"입니다.`:'메모를 읽고 그림에서 알맞은 영역을 누르세요. 겹친 부분과 바깥 고리도 영역입니다.',over||hit?'good':st.miss?'bad':'');
   }
   ui.body.addEventListener('click',e=>{const g=e.target.closest('.s72-zone');if(!g||st.i>=MEMOS.length)return;const k=g.dataset.zone;
    if(k===MEMOS[st.i][0]){st.i++;st.miss=null;draw(k)}else{st.wrong++;st.miss=k;draw()}});
   draw();
  }});

 // The worked example of the deck with one weaker choice or two in every box. ok marks the choice the example uses.
 const PLAN=[
  {name:'성취기준과 목표',opts:[{t:'AI를 활용하여 인공지능을 이해한다.'},{t:'학습 자료를 바꾼 결과를 비교하여 AI의 예측이 달라진 이유를 설명할 수 있다.',ok:true}]},
  {name:'평가 계획',opts:[{t:'AI 도구를 끝까지 사용했는지 확인',why:'평가 증거는 AI를 사용했다는 사실이 아니라 학생이 보여 준 이해입니다.'},{t:'조건별 결과 비교표와 오류 원인 설명을 채점 기준표로 평가',ok:true},{t:'완성한 모델의 예측 정확도로 평가',why:'목표의 행동은 비교와 설명인데 평가는 모델의 정확도를 봅니다.'}]},
  {name:'AI의 역할',opts:[{t:'학생이 사진으로 두 모델을 학습시키고 예측을 비교',ok:true},{t:'AI가 비교표와 원인 설명을 대신 작성',why:'AI가 증거를 대신 만들어 학생의 이해를 확인할 수 없습니다.'},{t:'교사가 미리 만든 모델의 결과만 보여 줌',why:'학생이 자료를 바꾸어 보지 않아 비교표를 만들 수 없습니다.'}]},
  {name:'이용 조건',opts:[{t:'5학년 학생이 각자 계정을 만들어 Drive에 저장',why:'본인 계정 관리는 14세 이상이어서 5학년 학생이 직접 하기 어렵습니다.'},{t:'학생 얼굴 사진으로 모델을 학습',why:'학생 얼굴은 입력하지 않을 정보입니다. 얼굴과 이름표가 나오지 않게 촬영합니다.'},{t:'브라우저 안에서 학습, 교실 물건 사진만 사용',ok:true}]},
  {name:'검증 절차',opts:[{t:'결과가 그럴듯한지 살펴봄',why:'확인 계획은 있으나 무엇을 기준으로 확인하는지 모호합니다.'},{t:'따로 남긴 사진으로 예측을 확인하고 틀린 사례를 기록',ok:true},{t:'정하지 않음',why:'결과 확인 절차가 없어 틀린 예측을 알아차릴 수 없습니다.'}]}];
 const START=[0,0,1,0,2];
 L.add('planLink','custom',{
  hint:'작성 예시의 다섯 칸을 바꾸어 가며 <b>칸과 칸이 서로 이어지는지</b> 확인합니다. 작성 예시에 없던 선택지는 이 활동을 위해 만든 것입니다.',
  body:`<div class="md-split" style="--split:1.62fr 1fr"><div class="md-panel"><div class="s72-plan">${PLAN.map((p,i)=>`<div class="s72-prow" style="--n:${p.opts.length}"><b>${p.name}</b>${options(p.opts,i)}</div>`).join('')}</div></div>
   <div class="md-panel"><h3>칸과 칸의 연결</h3><ul class="s72-links" id="s72-links"></ul></div></div>`,
  state:()=>({pick:[...START]}),
  render(ui,st,reset){
   ui.action('고치기 전으로',reset);
   function draw(){
    const got=PLAN.map((p,i)=>p.opts[st.pick[i]]),[goal,test,role,terms,verify]=got;
    ui.all('.s72-opt').forEach(b=>b.setAttribute('aria-pressed',String(st.pick[b.dataset.k]===Number(b.dataset.j))));
    const links=[
     ['목표 → 평가 계획',goal.ok&&test.ok,!goal.ok?'목표에 도구 사용과 이해가 섞여 있어 무엇을 보고 판단할지 알 수 없습니다.':test.ok?'비교와 설명이라는 행동이 평가 증거로 바로 이어집니다.':test.why],
     ['평가 계획 → AI의 역할',test.ok&&role.ok,!role.ok?role.why:test.ok?'학생의 AI 활동이 평가할 증거를 만듭니다.':'AI 활동은 비교인데 평가 계획이 그 증거를 보지 않습니다.'],
     ['AI의 역할 → 이용 조건',!!terms.ok,terms.ok?'이용 조건을 충족하고 입력 정보는 교실 물건 사진뿐입니다.':terms.why],
     ['AI의 역할 → 검증 절차',!!verify.ok,verify.ok?'따로 남긴 사진을 기준으로 예측을 확인하고 기록합니다.':verify.why]];
    ui.q('#s72-links').innerHTML=links.map(([name,ok,text])=>`<li data-ok="${!!ok}"><b>${name} ${ok?'이어짐':'끊김'}</b>${esc(text)}</li>`).join('');
    const n=links.filter(l=>l[1]).length;
    ui.say(n===4?'다섯 칸이 서로 이어졌습니다. 작성 예시에서 본 수업과 같은 선택입니다.':`네 연결 중 ${n}곳이 이어졌습니다. 끊긴 연결의 칸을 바꾸어 보세요.`,n===4?'good':'');
   }
   ui.body.addEventListener('click',e=>{const b=e.target.closest('.s72-opt');if(b){st.pick[b.dataset.k]=Number(b.dataset.j);draw()}});
   draw();
  }});

 // Six lines of a made-up plan judged with the level descriptions of the rubric. answer is the level argued for in why.
 const LEVELS=['우수','보통','보완 필요'];
 const RUBRIC=[
  {name:'문제 정의',levels:['세 요소와 관찰 근거가 모두 드러남','세 요소는 있으나 근거가 약함','해결책 중심으로 서술됨'],answer:0,
   text:'5학년 학생 일부가 조사 보고서를 쓸 때 자료의 출처를 적지 않습니다. 지난 보고서 24편 중 15편에 출처가 없었습니다.',why:'대상, 상황, 어려움이 모두 있고 보고서를 세어 본 관찰 근거가 함께 드러납니다.'},
  {name:'AI 필요성',levels:['대안 두 가지 이상과 비교해 선택함','대안을 언급하나 비교가 약함','대안 검토 없이 도구를 정함'],answer:2,
   text:'요즘 많이 쓰는 대화형 AI를 수업에 써 보려고 이 도구로 정했습니다.',why:'다른 해결 방법을 살펴본 내용이 없고 도구부터 정했습니다.'},
  {name:'원리 이해',levels:['원리로 오류 상황을 예상하고 대비함','원리를 설명하나 수업과 연결이 약함','원리와 관련된 설명이 없음'],answer:1,
   text:'생성형 AI가 학습한 자료를 바탕으로 문장을 만들어 낸다는 점을 수업 첫머리에 설명합니다.',why:'원리 설명은 있지만 그 원리로 어떤 오류가 생길지 예상하거나 대비하는 내용이 없습니다.'},
  {name:'결과 검증',levels:['확인 주체, 시점, 기준이 구체적임','확인 계획은 있으나 기준이 모호함','결과 확인 절차가 없음'],answer:0,
   text:'학생이 AI가 알려 준 출처를 모둠 활동 시간에 직접 찾아보고, 찾지 못한 출처는 보고서에 쓰지 않습니다.',why:'학생이, 모둠 활동 시간에, 직접 찾을 수 있는 출처인지를 기준으로 확인합니다.'},
  {name:'윤리와 개인정보',levels:['입력 제한과 공개 방법까지 정함','일반적인 주의만 적음','점검 내용이 없음'],answer:1,
   text:'개인정보 보호와 저작권에 유의하여 지도합니다.',why:'입력하지 않을 정보와 AI 사용을 밝히는 방법은 정하지 않고 일반적인 주의만 적었습니다.'},
  {name:'실행 가능성',levels:['조건 확인과 대체 방법을 갖춤','조건은 확인했으나 대체 방법이 없음','이용 조건을 확인하지 않음'],answer:2,
   text:'도구의 이용 연령과 학교 기기에서 열리는지는 아직 확인하지 못했습니다.',why:'이용 연령과 접속 환경이라는 이용 조건을 아직 확인하지 않았습니다.'}];
 L.add('rubricApply','custom',{
  hint:'가상의 활용안에서 뽑은 여섯 문장을 <b>루브릭의 세 수준</b>으로 판단해 봅니다. 활용안은 이 활동을 위해 만든 예시이고, 발표 기준은 8주차에 적용합니다.',
  body:`<div class="s72-rubwrap"><table class="s72-rubric"><colgroup><col style="width:8em"><col><col style="width:11.4em"><col style="width:11.4em"><col style="width:11.4em"></colgroup>
   <thead><tr><th>기준</th><th>활용안의 문장(예시)</th>${LEVELS.map(l=>`<th>${l}</th>`).join('')}</tr></thead>
   <tbody>${RUBRIC.map((r,i)=>`<tr data-i="${i}"><th scope="row">${r.name}</th><td>${esc(r.text)}</td>${r.levels.map((l,j)=>`<td><button type="button" class="s72-level" data-j="${j}" aria-pressed="false" aria-label="${r.name}, ${LEVELS[j]}: ${l}">${l}</button></td>`).join('')}</tr>`).join('')}</tbody></table></div>`,
  state:()=>({rate:RUBRIC.map(()=>null),checked:false,open:null}),
  render(ui,st,reset){
   const check=ui.action('확인',()=>{if(st.rate.includes(null)){ui.say('여섯 기준을 모두 판단한 뒤 확인하세요.','bad');return}st.checked=true;st.open=null;draw()},true);ui.action('다시 하기',reset);
   function draw(){
    ui.all('.s72-rubric tbody tr').forEach((tr,i)=>{tr.dataset.open=String(st.checked&&st.open===i);
     tr.querySelectorAll('.s72-level').forEach((b,j)=>{b.setAttribute('aria-pressed',String(st.rate[i]===j));
      if(st.checked&&(j===RUBRIC[i].answer||j===st.rate[i]))b.dataset.result=j===RUBRIC[i].answer?'right':'wrong';else delete b.dataset.result})});
    check.disabled=st.checked;
    const n=RUBRIC.filter((r,i)=>st.rate[i]===r.answer).length,rated=st.rate.filter(v=>v!==null).length;
    if(!st.checked)ui.say(rated?`여섯 기준 중 ${rated}개를 판단했습니다.`:'기준마다 문장에 맞는 수준의 설명을 하나씩 누르세요.');
    else if(st.open===null)ui.say(`여섯 기준 중 ${n}개가 함께 확인할 판단과 같습니다. 초록 칸이 함께 확인할 수준이고, 행을 누르면 근거가 나옵니다.`,n===RUBRIC.length?'good':'');
    else{const r=RUBRIC[st.open];ui.say(`${r.name}, ${LEVELS[r.answer]}: ${r.why}`,st.rate[st.open]===r.answer?'good':'bad')}
   }
   ui.body.addEventListener('click',e=>{const tr=e.target.closest('tbody tr');if(!tr)return;const i=Number(tr.dataset.i),b=e.target.closest('.s72-level');
    if(st.checked)st.open=i;else if(b)st.rate[i]=Number(b.dataset.j);else return;draw()});
   draw();
  }});
})();
