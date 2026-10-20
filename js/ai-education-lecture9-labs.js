/* Lecture 9: the solo unplugged web activities are shown inside the viewer between the converted slides. */
(()=>{
 'use strict';
 const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const GUIDE={
  grid:['단계마다 실행하기 전에 카드가 몇 장 필요할지 먼저 예상합니다.','반복과 함수로 카드 수가 줄어든 단계를 기록합니다.'],
  alligator:['완성된 규칙표 악어를 이길 수 있는지 시도합니다.','빈칸이 있는 규칙표에서 악어가 아무 수나 두는 판을 찾습니다.','스스로 배우는 악어와 10판 이상 두며 승률의 변화를 기록합니다.'],
  monkey:['훈련 카드로 트리를 만든 뒤 테스트 카드를 몇 장 맞힐지 먼저 예상합니다.','틀린 카드의 경로를 보고 질문을 고친 뒤 컴퓨터 트리와 비교합니다.'],
  neuron:['1~3단계에서 AND, OR, NAND 뉴런을 만듭니다.','4단계에서 뉴런 하나로 XOR을 만들 수 없는 이유를 입력 평면에서 확인하고 5단계에서 은닉층으로 풉니다.','6단계에서 바퀴마다 틀린 카드 수를 기록합니다.']
 };
 window.aiEducationLabs={mount(root,s){
  const url=`/unplugged-lab/${s.lab}/`;
  root.innerHTML=`<div class="l9-lab"><div class="l9-head"><div><h2>${esc(s.title)}</h2><p>${esc(s.text[1]||'')}</p></div><a class="l9-open" href="${url}" target="_blank" rel="noopener">새 창으로 열기</a></div><ul class="l9-guide">${(GUIDE[s.lab]||[]).map(t=>`<li>${esc(t)}</li>`).join('')}</ul><iframe class="l9-frame" src="${url}?embed=1" title="${esc(s.title)} 웹 활동" loading="lazy"></iframe><p class="l9-print">웹 활동 주소: https://jinsung4069.github.io${url}</p></div>`;
 }};
})();
