/* Chapter 5: examples and student measurements have separate state. */
(()=>{
 'use strict';
 const KEY='ai-education-chapter5-v2';
 const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 let state={};try{state=JSON.parse(sessionStorage.getItem(KEY)||'{}')}catch{}
 const save=()=>{try{sessionStorage.setItem(KEY,JSON.stringify(state))}catch{document.querySelectorAll('[data-save-status]').forEach(e=>e.textContent='자동 저장을 사용할 수 없습니다. 기록 파일을 내려받으세요.')}};
 const pct=(a,b)=>b?`${(100*a/b).toFixed(1)}%`:'계산 불가';
 const options=(xs,v)=>xs.map(x=>`<option value="${esc(x)}"${x===v?' selected':''}>${esc(x||'선택')}</option>`).join('');
 const field=(key,label,value='',hint='')=>`<label class="ch5-field">${label}<textarea data-field="${key}" rows="2" placeholder="${esc(hint)}">${esc(value)}</textarea></label>`;
 const metrics=items=>`<div class="ch5-metrics">${items.map(([k,v])=>`<div><span>${k}</span><strong>${v}</strong></div>`).join('')}</div>`;
 function download(){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify({course:'AI교육의 이해 / 언플러그드AI교육',chapter:'인공지능 윤리',...state},null,2)],{type:'application/json'}));a.download='인공지능윤리_활동기록.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
 function shell(root,s,intro,html){root.innerHTML=`<div class="ch5-sheet"><h2>${esc(s.title)}</h2>${intro?`<p class="ch5-intro">${intro}</p>`:''}${html}<div class="ch5-footer"><p data-save-status>기록은 이 탭에 저장됩니다. 탭을 닫기 전에 내려받으세요.</p><button type="button" data-download>기록 내려받기</button></div></div>`;root.querySelector('[data-download]').onclick=download}
 function fields(root,d,after=()=>{}){root.querySelectorAll('[data-field]').forEach(e=>e.oninput=()=>{d[e.dataset.field]=e.value;save();after()})}
 function ethics(root,s){
  const d=state.ethics??={};shell(root,s,'사진으로 준비물을 분류하는 학교용 도구의 도입을 검토합니다.',`<div class="ch5-grid">${[['learner','학습자, 오류의 영향과 수정 방법'],['operator','운영자, 업무 감소와 검토 부담'],['provider','자료 제공자, 이용 범위와 삭제'],['developer','개발 담당자, 실패 원인과 개선 근거']].map(([k,l])=>field(k,l,d[k],'기대하는 이익, 가능한 부담, 필요한 대안')).join('')}</div>${field('conflict','충돌하는 가치와 조정 방안',d.conflict,'어느 한쪽의 부담을 줄이기 위해 무엇을 바꿀 수 있나요?')}`);fields(root,d);
 }
 function accuracy(root,s){
  const d=state.accuracyExample??={kind:'계산 예시',counts:[18,20,12,20],prediction:'',revealed:false};
  shell(root,s,'계산 예시, 같은 조건별 정확도라도 표본 수에 따라 전체 정확도가 달라집니다.',`<div class="ch5-table-wrap"><table><thead><tr><th>조건</th><th>정답 수</th><th>사진 수</th></tr></thead><tbody>${['밝음','어두움'].map((l,i)=>`<tr><th>${l}</th>${[i*2,i*2+1].map((n,j)=>`<td><input type="number" min="0" max="10000" step="1" data-count="${n}" value="${d.counts[n]}" aria-label="${l} ${j?'사진 수':'정답 수'}"></td>`).join('')}</tr>`).join('')}</tbody></table></div><div class="ch5-gate"><label>전체 정확도 예상<select data-prediction>${options(['','50% 미만','50% 이상 80% 미만','80% 이상'],d.prediction)}</select></label><button data-reveal ${d.prediction?'':'disabled'}>결과 확인</button></div><div data-example-result ${d.revealed?'':'hidden'}></div>`);
  const result=root.querySelector('[data-example-result]');
  function render(){if(!d.revealed)return;const v=d.counts.map(Number);if(d.counts.some(x=>x==='')||v.some(x=>!Number.isInteger(x)||x<0||x>10000)||v[0]>v[1]||v[2]>v[3]){result.innerHTML='<p>사진 수 이내의 정답 수를 0 이상의 정수로 입력하세요.</p>';return}const [a,n,b,m]=v;result.innerHTML=metrics([['밝음 정확도',pct(a,n)],['어두움 정확도',pct(b,m)],['전체 정확도',pct(a+b,n+m)]])+`<p>${a+b} / ${n+m}장, 조건별 정답 수를 합한 뒤 전체 사진 수로 나눕니다.</p><p>조명 조건의 성능 차이를 살펴보는 예시입니다. 사람 집단에 대한 공정성을 판단하려면 집단별 영향과 사용 맥락을 별도로 확인해야 합니다.</p>`}
  root.querySelectorAll('[data-count]').forEach(e=>e.oninput=()=>{d.counts[+e.dataset.count]=e.value;d.prediction='';d.revealed=false;root.querySelector('[data-prediction]').value='';root.querySelector('[data-reveal]').disabled=true;result.hidden=true;save()});
  root.querySelector('[data-prediction]').onchange=e=>{d.prediction=e.target.value;d.revealed=false;result.hidden=true;root.querySelector('[data-reveal]').disabled=!d.prediction;save()};
  root.querySelector('[data-reveal]').onclick=()=>{if(!d.prediction)return;d.revealed=true;result.hidden=false;render();save()};render();
 }
 const COLAB='https://colab.research.google.com/github/jinsung4069/jinsung4069.github.io/blob/main/data/lectures/ai-education-ch5-bias-lab.ipynb';
 function colab(root,s){
  const d=state.colab??={kind:'학생 실행 기록',prediction:'',reason:''};const ready=()=>!!(d.prediction&&d.reason?.trim());
  const num=(k,label,hint)=>`<label class="ch5-field">${label}<input type="number" min="0" max="100" step="0.1" data-num="${k}" value="${esc(d[k])}" placeholder="${esc(hint)}"></label>`;
  shell(root,s,'결과를 보기 전에 예상과 이유를 적으면 노트북 링크와 결과 기록란이 열립니다.',`<div class="ch5-grid"><label class="ch5-field">어두운 사진에서 더 정확할 모델<select data-prediction>${options(['','모델 A','모델 B','비슷함'],d.prediction)}</select></label>${field('reason','그렇게 예상한 이유',d.reason,'학습 자료의 구성과 연결해 적습니다.')}</div><p data-gate-status role="status"></p><div data-colab-open ${ready()?'':'hidden'}><p><a class="ch5-button" href="${COLAB}" target="_blank" rel="noopener noreferrer">Colab 노트북 열기</a></p><p class="ch5-note">파일 메뉴에서 Drive에 사본 저장을 먼저 선택합니다. Google 계정이 필요합니다.</p><div class="ch5-grid">${num('ratioB','빈칸 1, 모델 B의 어두운 사진 비율(%)','예, 50')}${num('threshold','빈칸 5, 보류 기준 점수(%)','예, 80')}</div><div class="ch5-table-wrap"><table><thead><tr><th>모델</th><th>밝음 정확도(%)</th><th>어두움 정확도(%)</th></tr></thead><tbody>${['A','B'].map(m=>`<tr><th>${m}</th>${['Bright','Dark'].map(c=>`<td><input type="number" min="0" max="100" step="0.1" data-num="${m}${c}" value="${esc(d[m+c])}" aria-label="모델 ${m} ${c==='Bright'?'밝음':'어두움'} 정확도"></td>`).join('')}</tr>`).join('')}</tbody></table></div><div data-colab-result></div><div class="ch5-grid">${field('observation','예상과 비교한 결과, 남은 차이의 설명',d.observation)}${field('limits','해석의 한계와 확인하지 못한 조건',d.limits,'코드로 만든 어두운 조건, 같은 자료원, 반복 실행의 변동')}</div></div>`);
  const valid=v=>v!==''&&v!==undefined&&Number.isFinite(Number(v))&&Number(v)>=0&&Number(v)<=100;
  const update=()=>{root.querySelector('[data-gate-status]').textContent=ready()?'예상과 이유를 기록했습니다.':'예상과 이유를 먼저 기록하세요.';root.querySelector('[data-colab-open]').hidden=!ready();
   const box=root.querySelector('[data-colab-result]'),ks=['ABright','ADark','BBright','BDark'];if(!ks.every(k=>valid(d[k]))){box.innerHTML=ks.some(k=>d[k]!==''&&d[k]!==undefined&&!valid(d[k]))?'<p>정확도는 0 이상 100 이하로 입력하세요.</p>':'';return}
   const [ab,ad,bb,bd]=ks.map(k=>Number(d[k])),f=x=>`${x>0?'+':''}${x.toFixed(1)}%p`;
   box.innerHTML=metrics([['모델 A, 조건 간 차이',f(ab-ad)],['모델 B, 조건 간 차이',f(bb-bd)],['어두움 정확도 변화, A에서 B',f(bd-ad)],['밝음 정확도 변화, A에서 B',f(bb-ab)]])+'<p>어두운 조건은 코드로 만든 변환입니다. 조명 조건의 차이를 사람 집단의 공정성 결론으로 확대하지 않습니다.</p>'};
  root.querySelector('[data-prediction]').onchange=e=>{d.prediction=e.target.value;save();update()};
  root.querySelectorAll('[data-num]').forEach(e=>e.oninput=()=>{d[e.dataset.num]=e.value;save();update()});fields(root,d,update);update();
 }
 // At threshold .8: 28 processed, 24 correct, 12 held, 4 errors. Teaching data only.
 const example=Array.from({length:40},(_,i)=>({id:`E${String(i+1).padStart(2,'0')}`,correct:i<24||i>=28&&i<34,score:i<24?.82+(i%6)*.025:i<28?.84+(i%4)*.03:.52+(i%6)*.045}));
 function abstention(root,s){
  const d=state.abstentionExample??={kind:'개발용 계산 예시, 실제 모델 결과 아님',threshold:80};
  shell(root,s,'설명용 예시 40장, 점수가 기준보다 낮으면 사람이 검토합니다. 실제 노트북의 결과가 아닙니다.',`<label class="ch5-range">보류 기준 <output data-threshold-value></output><input type="range" min="50" max="100" step="1" value="${d.threshold}" data-threshold aria-label="보류 기준"></label><div data-abstention-metrics></div><div class="ch5-sample-strip" data-samples></div><p class="ch5-note">이 점수는 정답 확률의 보장이 아닙니다. 개발 자료에서 기준을 정하고 별도의 최종 자료로 처리 범위, 오류와 검토 부담을 확인합니다.</p>`);
  const update=()=>{d.threshold=Number(root.querySelector('[data-threshold]').value);const t=d.threshold/100,processed=example.filter(r=>r.score>=t),right=processed.filter(r=>r.correct).length,held=40-processed.length;root.querySelector('[data-threshold-value]').textContent=t.toFixed(2);root.querySelector('[data-abstention-metrics]').innerHTML=metrics([['자동 처리',`${processed.length}장, ${pct(processed.length,40)}`],['자동 처리 중 정확도',pct(right,processed.length)],['사람이 검토',`${held}장, ${pct(held,40)}`],['자동 처리 오류',`${processed.length-right}장`]]);root.querySelector('[data-samples]').innerHTML=example.map(r=>{const status=r.score<t?'보류':r.correct?'정답':'오류';return `<span data-result="${status}" title="${r.id}, 점수 ${r.score.toFixed(2)}, ${status}">${r.id}<b>${status}</b></span>`}).join('');save()};root.querySelector('[data-threshold]').oninput=update;update();
 }
 function modelCard(root,s){
  const d=state.modelCard??={};shell(root,s,'확인한 사실과 미확인 사항을 구분해 기록합니다.',`<div class="ch5-grid">${field('purpose','사용 목적과 제외할 용도',d.purpose)}${field('data','데이터 구성, 권한과 종료 처리',d.data)}${field('evidence','평가 결과와 근거',d.evidence,'자료 수, 조건별 성능, 모델 버전과 남은 오류')}${field('limits','검증하지 않은 조건과 자료',d.limits)}${field('reviewer','검토자, 판단 정보와 수정 권한',d.reviewer)}${field('response','오류 신고, 정정과 중단 절차',d.response)}</div><label class="ch5-field">활용 판단<select data-decision>${options(['','제한된 사용','조건부 사용','보류'],d.decision)}</select></label><div class="ch5-grid">${field('reason','판단 근거와 보완 조건',d.reason)}${field('unknown','아직 확인하지 못한 사항',d.unknown)}</div>`);fields(root,d);root.querySelector('[data-decision]').onchange=e=>{d.decision=e.target.value;save()};
 }
 const questions=[
  ['전체 정확도가 같으면 두 모델은 같은 정도로 공정한가요?',['전체 정확도가 같으면 충분하다','조건별 오류와 피해, 대응 방법을 함께 살펴야 한다'],1,'평균 정확도는 오류의 분포와 피해를 모두 보여주지 않습니다.'],
  ['공개 자료가 아닌 학생 자료를 Colab에 올릴 때 무엇을 확인하나요?',['목적, 처리 근거, 저장과 공유 범위를 확인한다','실습 도구이므로 확인하지 않아도 된다'],0,'Colab 노트북은 Drive에 저장되고 공유하면 출력 결과도 함께 전달됩니다. 기관의 절차도 확인합니다.'],
  ['출처를 적으면 웹 사진을 자유롭게 학습과 공개에 써도 되나요?',['이용 조건과 허락 범위를 별도로 확인한다','검색 가능한 사진이면 사용할 수 있다'],0,'출처 표시와 이용 권한은 구별합니다. 수업 내 사용과 공개 배포의 범위도 검토합니다.'],
  ['AI로 만든 이미지를 수업 자료로 쓸 때 무엇을 확인하나요?',['생성 표시와 원출처, 다른 자료와의 교차 확인','그럴듯해 보이면 그대로 사용'],0,'생성물은 사실과 다를 수 있습니다. 생성 표시가 없다고 사람이 만든 자료라는 뜻도 아닙니다.'],
  ['사람의 최종 판단이 실제로 작동하려면 무엇이 필요한가요?',['마지막 확인 버튼','판단 정보, 검토 시간, 수정 권한과 이의 처리'],1,'검토자가 오류를 발견하고 바로잡을 수 있어야 합니다.']
 ];
 function quiz(root,s){const d=state.quiz??={index:0,answers:{}};if(d.index>=questions.length)d.index=0;const [q,choices,correct,reason]=questions[d.index],answer=d.answers[d.index];shell(root,s,`${d.index+1} / ${questions.length}`,`<h3>${q}</h3><div class="ch5-choices">${choices.map((c,i)=>`<button data-answer="${i}" aria-pressed="${answer===i}">${c}</button>`).join('')}</div><div class="ch5-result" data-quiz-result ${answer===undefined?'hidden':''}>${answer===undefined?'':`<strong>${answer===correct?'맞습니다.':'다시 생각해 보세요.'}</strong><p>${reason}</p>`}</div><div class="ch5-inline"><button data-quiz-prev ${d.index===0?'disabled':''}>이전 문항</button><button data-quiz-next ${d.index===questions.length-1?'disabled':''}>다음 문항</button></div>`);root.querySelectorAll('[data-answer]').forEach(b=>b.onclick=()=>{d.answers[d.index]=+b.dataset.answer;save();quiz(root,s)});root.querySelector('[data-quiz-prev]').onclick=()=>{d.index--;save();quiz(root,s)};root.querySelector('[data-quiz-next]').onclick=()=>{d.index++;save();quiz(root,s)}}
 const handlers={ethics,accuracy,colab,abstention,'model-card':modelCard,quiz};
 window.aiEducationLabs={mount(root,s){handlers[s.lab](root,s)}};
})();
