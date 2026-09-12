(()=>{
 'use strict';
 const panel=document.getElementById('ce-lab');if(!panel)return;
 const chapter=Number(document.querySelector('.ce-viewer').dataset.chapter),q=s=>panel.querySelector(s);
 const box=(title,intro,controls)=>{panel.innerHTML=`<h2>${title}</h2><p>${intro}</p><div class="ce-lab-controls">${controls}</div><div class="ce-result" id="lab-result" role="status" aria-live="polite"></div>`};
 const result=t=>q('#lab-result').textContent=t;
 if(chapter===2){
  box('입력, 처리, 출력','숫자와 연산을 선택하고 컴퓨터의 처리 흐름을 따라가세요.','<label>첫 번째 수 <input id="a" type="number" value="7" min="-10000" max="10000"></label><label>연산 <select id="op"><option value="+">더하기</option><option value="*">곱하기</option></select></label><label>두 번째 수 <input id="b" type="number" value="3" min="-10000" max="10000"></label><button id="run">처리하기</button>');
  q('#run').onclick=()=>{const a=Number(q('#a').value),b=Number(q('#b').value),op=q('#op').value;result(`입력 장치 → ${a}, ${b}, ${op==='+'?'덧셈':'곱셈'}\n기억 장치 → 두 수와 연산을 보관\n중앙처리장치 → ${a} ${op==='+'?'+':'×'} ${b} 계산\n출력 장치 → ${op==='+'?a+b:a*b}`)};q('#run').click();
 }else if(chapter===3){
  box('8비트로 숫자 표현하기','각 비트를 눌러 0과 1을 바꿔 보세요. 켜진 자리의 값을 합하면 십진수가 됩니다.','<div class="ce-bits" id="bits"></div><button id="reset">모두 0으로</button>');
  const bits=Array(8).fill(0);q('#bits').innerHTML=bits.map((_,i)=>`<button data-i="${i}" aria-pressed="false" aria-label="${2**(7-i)} 자리 비트"><small>${2**(7-i)}</small><b>0</b></button>`).join('');
  function draw(){q('#bits').querySelectorAll('button').forEach((b,i)=>{b.setAttribute('aria-pressed',String(!!bits[i]));b.querySelector('b').textContent=bits[i]});result(`이진수 ${bits.join('')} = 십진수 ${bits.reduce((s,b,i)=>s+b*2**(7-i),0)}`)}
  q('#bits').onclick=e=>{const b=e.target.closest('button');if(b){bits[Number(b.dataset.i)]^=1;draw()}};q('#reset').onclick=()=>{bits.fill(0);draw()};draw();
 }else if(chapter===4){
  box('스택과 큐 비교하기','값을 차례로 넣고 꺼내며 후입선출과 선입선출을 비교하세요.','<label>구조 <select id="kind"><option value="stack">스택</option><option value="queue">큐</option></select></label><label>값 <input id="value" value="A" maxlength="12" size="10"></label><button id="push">넣기</button><button id="pop">꺼내기</button><button id="reset">초기화</button>');
  let values=[];function draw(last=''){result(`${q('#kind').value==='stack'?'스택, 오른쪽이 TOP':'큐, 왼쪽이 FRONT'}\n[ ${values.join(' | ')} ]\n${last}`)}
  q('#push').onclick=()=>{if(values.length>=12){draw('최대 12개까지 넣을 수 있습니다.');return}const v=q('#value').value.trim();if(v)values.push(v);draw()};q('#pop').onclick=()=>{draw(values.length?`꺼낸 값: ${q('#kind').value==='stack'?values.pop():values.shift()}`:'비어 있습니다.')};q('#reset').onclick=()=>{values=[];draw()};q('#kind').onchange=()=>{values=[];draw()};draw();
 }else if(chapter===5){
  box('최대공약수 찾기','두 양의 정수를 입력하고 유클리드 호제법의 반복 과정을 따라가세요.','<label>첫 번째 수 <input id="a" type="number" value="48" min="1" max="1000000"></label><label>두 번째 수 <input id="b" type="number" value="18" min="1" max="1000000"></label><button id="run">과정 보기</button>');
  q('#run').onclick=()=>{let a=Number(q('#a').value),b=Number(q('#b').value);if(!Number.isInteger(a)||!Number.isInteger(b)||a<1||b<1||a>1e6||b>1e6){result('1부터 1,000,000까지의 정수를 입력하세요.');return}const steps=[];while(b){steps.push(`${a} ÷ ${b}의 나머지 = ${a%b}`);[a,b]=[b,a%b]}result(steps.join('\n')+`\n최대공약수 = ${a}`)};q('#run').click();
 }else if(chapter===6){
  box('버블 정렬 한 단계씩','이웃한 두 값을 비교하고 왼쪽이 더 크면 서로 바꿉니다. 한 번에 한 쌍씩 비교하세요.','<button id="step">다음 비교</button><button id="reset">처음으로</button><div class="ce-bars" id="bars" aria-label="현재 배열"></div>');
  let values=[5,2,8,1,6],i=0,end=4,done=false;function draw(message){q('#bars').innerHTML=values.map(v=>`<span style="height:${v*12}px">${v}</span>`).join('');result(message+`\n현재 배열: ${values.join(', ')}`);q('#step').disabled=done}
  q('#step').onclick=()=>{const a=values[i],b=values[i+1];if(a>b)[values[i],values[i+1]]=[b,a];const msg=`${a}와 ${b} 비교 → ${a>b?'자리 바꾸기':'유지'}`;i++;if(i>=end){i=0;end--}if(end===0)done=true;draw(done?msg+'\n정렬 완료':msg)};q('#reset').onclick=()=>{values=[5,2,8,1,6];i=0;end=4;done=false;draw('왼쪽 첫 번째 쌍부터 시작합니다.')};q('#reset').click();
 }else if(chapter===7){
  box('조건과 반복의 실행 추적','1부터 입력한 수까지 반복하며 짝수만 더하는 프로그램을 실행하세요.','<label>마지막 수 <input id="limit" type="number" min="1" max="20" value="6"></label><button id="run">실행 추적</button>');
  q('#run').onclick=()=>{const limit=Number(q('#limit').value);if(!Number.isInteger(limit)||limit<1||limit>20){result('1부터 20까지의 정수를 입력하세요.');return}let sum=0;const lines=['합계 = 0'];for(let i=1;i<=limit;i++){if(i%2===0)sum+=i;lines.push(`i = ${i}, 짝수 조건 ${i%2===0?'참 → 더하기':'거짓 → 건너뛰기'}, 합계 = ${sum}`)}result(lines.join('\n'))};q('#run').click();
 }else if(chapter===8){
  box('논리 연산과 XOR','두 입력을 바꿔 AND, OR, XOR의 출력을 비교하세요. XOR은 두 입력이 다를 때 1입니다.','<label>입력 A <select id="a"><option>0</option><option>1</option></select></label><label>입력 B <select id="b"><option>0</option><option>1</option></select></label>');
  const draw=()=>{const a=Number(q('#a').value),b=Number(q('#b').value);result(`AND: ${a&b}\nOR: ${a|b}\nXOR: ${a^b}\nXOR 진리표: 00 → 0, 01 → 1, 10 → 1, 11 → 0`)};q('#a').onchange=draw;q('#b').onchange=draw;draw();
 }else if(chapter===9){
  box('분류 임계값 바꾸기','가상의 모델이 양성 점수 0.72를 출력했습니다. 임계값을 바꾸고 최종 분류가 어떻게 달라지는지 확인하세요.','<label>임계값 <input id="threshold" type="range" min="0" max="100" value="50"></label>');
  const draw=()=>{const threshold=Number(q('#threshold').value)/100;result(`모델의 양성 점수: 0.72\n임계값: ${threshold.toFixed(2)}\n분류 결과: ${0.72>=threshold?'양성':'음성'}\n점수가 임계값 이상이면 양성으로 분류합니다.`)};q('#threshold').oninput=draw;draw();
  const a=document.createElement('a');a.href='ai-understanding-lab.html';a.textContent='추가 실습: 데이터로 인공지능 학습시키기 →';panel.append(a);
 }else if(chapter===10){
  box('공유 전 정보 가리기','가상의 게시물에서 이름과 연락처를 숨겨 보세요. 아래 자료는 체험을 위한 예시입니다.','<label><input id="name" type="checkbox" checked> 이름 숨기기</label><label><input id="contact" type="checkbox" checked> 연락처 숨기기</label>');
  const draw=()=>result(`이름: ${q('#name').checked?'익명':'가상 학생 A'}\n연락처: ${q('#contact').checked?'비공개':'student@example.invalid'}\n내용: 오늘 만든 프로그램의 화면을 공유합니다.`);q('#name').onchange=draw;q('#contact').onchange=draw;draw();
 }else if(chapter===11){
  box('센서 값으로 LED 제어하기','빛 센서가 어두움을 감지하면 LED를 켜는 모형입니다. 센서 값과 기준값을 바꿔 보세요.','<label>빛 센서 값 <input id="light" type="range" min="0" max="100" value="20"></label><label>기준값 <input id="threshold" type="range" min="0" max="100" value="40"></label>');
  const draw=()=>{const light=Number(q('#light').value),threshold=Number(q('#threshold').value),on=light<threshold;result(`입력: 빛 센서 ${light}\n처리: ${light} < ${threshold} → ${on?'참':'거짓'}\n출력: LED ${on?'켜짐 💡':'꺼짐'}\n이 체험은 실제 로봇과 연결되지 않는 브라우저 모형입니다.`)};q('#light').oninput=draw;q('#threshold').oninput=draw;draw();
 }
})();
