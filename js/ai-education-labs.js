/* Student activities added between the unchanged source slides. */
(()=>{
 'use strict';
 const activities={
  automation:{intro:'기능 이름보다 판단 기준을 살펴보세요. 사례를 읽고 가장 알맞은 설명을 선택하세요.',questions:[
   ['온도가 28도를 넘으면 정해 둔 규칙에 따라 냉방을 켭니다.',['규칙 기반 자동화','데이터로 학습한 AI','설명만으로 구분할 수 없음'],0,'사람이 정한 조건을 그대로 실행합니다. 자동으로 작동한다고 모두 AI는 아닙니다.'],
   ['고양이와 강아지 사진 수천 장으로 학습한 모델이 새 사진을 분류합니다.',['규칙 기반 자동화','데이터로 학습한 AI','설명만으로 구분할 수 없음'],1,'학습 데이터에서 찾은 특징으로 새 사진을 판단합니다. 학습한 범위와 다른 사진에서는 틀릴 수 있습니다.'],
   ['서비스가 “맞춤 추천”이라는 이름으로 상품을 보여 줍니다.',['규칙 기반 자동화','데이터로 학습한 AI','설명만으로 구분할 수 없음'],2,'이름만으로 내부 방식을 알 수 없습니다. 정해진 규칙인지, 데이터로 학습했는지 추가 정보가 필요합니다.']
  ]},
  tasks:{intro:'학교 행사 안내문을 만든다고 생각해 보세요. 아래 조건에서 각 과업을 어떻게 나누면 좋을까요?',questions:[
   ['확정된 일정만 입력해 안내문 표현을 세 가지로 바꾸기',['AI 초안을 사람이 검토','AI 결과를 검토 없이 확정','AI에 최종 책임 맡기기'],0,'AI가 초안을 제안하고 사람이 일정, 대상과 어조를 확인합니다. 반복적인 표현 작업을 도울 수 있습니다.'],
   ['학부모에게 공개할 학생 사진의 동의 여부를 확인하고 게시 결정하기',['AI가 얼굴만 보고 결정','담당자가 동의와 공개 범위 확인','보기 좋은 사진이면 모두 게시'],1,'공개 결정에는 동의 기록과 맥락이 필요합니다. 담당자가 근거를 확인하고 책임 있게 결정해야 합니다.'],
   ['안내문 내용을 둘러싼 학부모의 이의 제기에 응답하기',['AI 답변을 자동 발송','학부모 감정을 점수로만 판단','담당자가 사정을 듣고 답변 결정'],2,'대화의 맥락과 관계를 이해하고 책임 있게 소통해야 합니다. 초안 작성에 AI를 쓰더라도 최종 판단은 담당자가 합니다.']
  ]},
  evidence:{intro:'다음은 검토 연습을 위한 생성형 AI 응답 예시입니다. 실제 연구 결과가 아닙니다.',quote:'“AI 학습 앱을 쓰면 모든 학생의 성적이 30% 향상됩니다. 2025 미래교육연구소 보고서에서 확인했습니다.”',questions:[
   ['이 응답을 수업 자료에 넣기 전, 무엇부터 할까요?',['문장이 자연스러우니 인용','보고서 원문과 연구 조건 확인','출처 이름만 남기고 수치 사용'],1,'보고서가 실제로 있는지, 원문이 같은 주장을 하는지, 대상과 측정 방법은 무엇인지 확인해야 합니다. 출처처럼 보이는 표현도 만들어질 수 있습니다.'],
   ['검색해도 원문을 찾지 못했습니다. 어떻게 고치면 좋을까요?',['출처와 수치를 빼고 효과를 단정','근거 확인 전에는 효과 주장 보류','비슷한 보고서 이름으로 교체'],1,'확인하지 못한 수치와 효과를 사실로 전달하지 않습니다. 근거가 있는 자료를 찾거나, 효과를 조사할 질문으로 바꿀 수 있습니다.']
  ]},
  perspectives:{intro:'같은 AI 도구라도 무엇을 배우고 무엇으로 확인하는지에 따라 교육의 관점이 달라집니다.',questions:[
   ['번역기가 존댓말을 잘못 옮긴 사례를 모아 AI의 한계를 설명합니다.',['AI에 관한 교육','AI를 활용한 교육','두 관점을 함께 다룸'],0,'평가 대상은 AI의 특성과 한계에 대한 이해입니다. 도구를 사용했는지만으로 분류하지 않습니다.'],
   ['번역기 결과와 자신의 번역을 비교해 영어 문장의 어조를 고칩니다.',['AI에 관한 교육','AI를 활용한 교육','두 관점을 함께 다룸'],1,'학습 목표는 영어 표현과 어조를 개선하는 것입니다. AI는 교과 학습을 돕는 도구로 쓰입니다.'],
   ['번역 오류의 원인을 설명하고, 맥락에 맞게 번역을 고친 이유도 평가합니다.',['AI에 관한 교육','AI를 활용한 교육','두 관점을 함께 다룸'],2,'AI 한계 이해와 언어 학습을 모두 목표로 삼고 각각의 증거를 확인합니다.']
  ]},
  alignment:{intro:'목표는 “주장과 근거의 타당성을 판단한다”입니다. 목표에 맞는 활동과 평가 증거를 연결해 보세요.',questions:[
   ['이 목표에 맞는 학생 활동은 무엇일까요?',['AI 답변을 그대로 복사','AI가 쓴 글의 근거를 원문과 대조','AI 도구 이름을 많이 외우기'],1,'근거가 주장을 뒷받침하는지 직접 비교하고 판단해야 목표를 수행할 수 있습니다.'],
   ['무엇을 보면 학생이 배웠는지 확인할 수 있을까요?',['완성된 글의 길이','AI 사용 횟수','근거 대조표와 수정 이유'],2,'검토한 원문, 타당성 판단, 수정 이유가 학생의 사고 과정을 보여 줍니다.'],
   ['평가에서 가장 적절한 기준은 무엇일까요?',['표현이 화려한 정도','근거의 관련성과 판단 이유의 설득력','AI 출력과 같은 정도'],1,'평가 기준도 주장과 근거 판단이라는 목표를 직접 확인해야 합니다.']
  ]},
  cases:{intro:'앞서 본 네 사례를 떠올려 보세요. 결과물뿐 아니라 학생이 수행한 사고와 평가 증거를 기준으로 판단하세요.',questions:[
   ['사례 A, 분류 모델의 오류를 분석하는 활동의 핵심 증거는?',['오류 사례와 데이터 개선 이유','모델 화면 캡처만'],0,'분류 원리와 한계를 이해했는지는 오류를 해석하고 개선 이유를 설명하는 과정에서 확인합니다.'],
   ['사례 B, AI의 글쓰기 피드백을 검토할 때 필요한 것은?',['글을 만든 속도','초안과 수정본, 피드백 채택 이유'],1,'초안과 수정본을 비교하고 AI 피드백을 채택하거나 거절한 이유를 확인해야 학생의 판단을 알 수 있습니다.'],
   ['사례 C, 번역을 맥락에 맞게 고쳤다는 증거는?',['수정 전후 문장과 어조를 바꾼 이유','번역 도구 이름'],0,'언어 학습의 증거는 도구 사용 여부보다 맥락을 고려한 수정과 그 이유입니다.'],
   ['사례 D, AI 생성 결과만 제출했다면 어떤 활동을 추가할까요?',['결과물을 더 길게 만들기','오류 검토와 수정 이유를 설명하기'],1,'완성된 출력만으로 학생의 이해를 알기 어렵습니다. 자신의 판단과 수정 과정을 설명하도록 설계할 수 있습니다.']
  ]}
 };
 const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const states=new Map();
 window.aiEducationLabs={mount(root,slide){
  const id=slide.labId;
  if(id==='recommendation'){
   root.innerHTML=`<h2>${escape(slide.title)}</h2><p>관심이 비슷한 콘텐츠와 새로운 분야의 콘텐츠 사이에서 추천 기준을 바꿔 보세요.</p><div class="ae-lab-panel"><label for="ae-interest">관심 일치 비중 <output id="ae-weight"></output></label><input id="ae-interest" type="range" min="0" max="100" step="10" value="${states.get(id)??70}"><p class="ae-lab-small">왼쪽은 새 분야 탐색, 오른쪽은 기존 관심 일치에 더 큰 비중을 줍니다.</p><ol id="ae-ranking" class="ae-ranking" aria-label="추천 순위"></ol><p id="ae-ranking-status" class="sr-only" aria-live="polite"></p></div><p class="ae-lab-small">계산 예시: 점수 = 관심 일치 × 비중 + 새 분야 탐색 × 나머지 비중. 아래 숫자는 체험용이며 실제 서비스의 추천 공식이 아닙니다.</p><p class="ae-lab-prompt">추천 순위가 바뀌면 내가 접하는 정보도 어떻게 달라질까요?</p>`;
   const items=[['축구 경기 분석',95,10],['스포츠 과학',75,40],['도시 생태 이야기',35,85],['낯선 나라의 음악',15,100]];
   const update=()=>{const w=Number(root.querySelector('input').value);states.set(id,w);root.querySelector('output').textContent=`${w}%`;const ranked=items.map(([name,interest,novelty])=>({name,interest,novelty,score:(interest*w+novelty*(100-w))/100})).sort((a,b)=>b.score-a.score);root.querySelector('ol').innerHTML=ranked.map((x,i)=>`<li><b>${i+1}. ${x.name}</b><span>관심 ${x.interest}, 탐색 ${x.novelty}</span><strong>${x.score.toFixed(1)}점</strong><meter min="0" max="100" value="${x.score}" aria-label="${x.name} 추천 점수"></meter></li>`).join('');root.querySelector('#ae-ranking-status').textContent=`관심 일치 ${w}%, 첫 번째 추천은 ${ranked[0].name}`};root.querySelector('input').oninput=update;update();return;
  }
  const activity=activities[id],answers=states.get(id)||[];states.set(id,answers);
  root.innerHTML=`<h2>${escape(slide.title)}</h2><p>${escape(activity.intro)}</p>${activity.quote?`<blockquote class="ae-lab-quote">${escape(activity.quote)}</blockquote>`:''}<div class="ae-questions">${activity.questions.map(([question,options],i)=>`<fieldset class="ae-lab-panel"><legend>${i+1}. ${escape(question)}</legend><div class="ae-options">${options.map((option,j)=>`<button type="button" data-question="${i}" data-answer="${j}" aria-pressed="false">${escape(option)}</button>`).join('')}</div><p class="ae-feedback" id="ae-feedback-${i}" aria-live="polite"></p></fieldset>`).join('')}</div><div class="ae-lab-bottom"><span id="ae-progress" role="status"></span><button type="button" id="ae-lab-reset">다시 체험하기</button></div>`;
  const show=(i,j)=>{const q=activity.questions[i];root.querySelectorAll(`[data-question="${i}"]`).forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.answer)===j)));const p=root.querySelector(`#ae-feedback-${i}`);p.textContent=(j===q[2]?'이렇게 판단할 수 있어요. ':'다시 생각해 보세요. ')+q[3];p.dataset.correct=String(j===q[2]);root.querySelector('#ae-progress').textContent=`${answers.filter(x=>x!==undefined).length} / ${activity.questions.length}개 판단 완료`};
  root.querySelectorAll('[data-question]').forEach(b=>b.onclick=()=>{const i=Number(b.dataset.question),j=Number(b.dataset.answer);answers[i]=j;show(i,j)});
  answers.forEach((j,i)=>show(i,j));if(!answers.length)root.querySelector('#ae-progress').textContent=`0 / ${activity.questions.length}개 판단 완료`;
  root.querySelector('#ae-lab-reset').onclick=()=>{states.delete(id);this.mount(root,slide);root.querySelector('[data-question]').focus()};
 }};
})();
