/* Chapters 6, 7-1 and 7-2: student activities inserted between the converted slides. */
(()=>{
 'use strict';
 const viewer=document.querySelector('.ce-viewer');if(!viewer)return;
 const CH=viewer.dataset.chapter,KEY=`ai-education-chapter${CH}-v1`;
 const NAMES={'6':'인공지능과 데이터과학','7-1':'인공지능 프로그래밍 Ⅰ','7-2':'인공지능 프로그래밍 Ⅱ'};
 const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 let state={};try{state=JSON.parse(sessionStorage.getItem(KEY)||'{}')}catch{}
 const save=()=>{try{sessionStorage.setItem(KEY,JSON.stringify(state))}catch{document.querySelectorAll('[data-save-status]').forEach(e=>e.textContent='자동 저장을 사용할 수 없습니다. 기록 파일을 내려받으세요.')}};
 const options=(xs,v)=>xs.map(x=>`<option value="${esc(x)}"${x===v?' selected':''}>${esc(x||'선택')}</option>`).join('');
 const field=(key,label,value='',hint='')=>`<label class="ch5-field">${label}<textarea data-field="${key}" rows="2" placeholder="${esc(hint)}">${esc(value)}</textarea></label>`;
 const select=(key,label,xs,value)=>`<label class="ch5-field">${label}<select data-select="${key}">${options(['',...xs],value)}</select></label>`;
 const metrics=items=>`<div class="ch5-metrics">${items.map(([k,v])=>`<div><span>${k}</span><strong>${v}</strong></div>`).join('')}</div>`;
 const COLAB=name=>`https://colab.research.google.com/github/jinsung4069/jinsung4069.github.io/blob/main/data/lectures/${name}.ipynb`;
 function download(){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify({course:'AI교육의 이해 / 언플러그드AI교육',chapter:NAMES[CH],...state},null,2)],{type:'application/json'}));a.download=`${NAMES[CH].replace(/\s/g,'')}_활동기록.json`;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
 function shell(root,s,intro,html){root.innerHTML=`<div class="ch5-sheet"><h2>${esc(s.title)}</h2>${intro?`<p class="ch5-intro">${intro}</p>`:''}${html}<div class="ch5-footer"><p data-save-status>기록은 이 탭에 저장됩니다. 탭을 닫기 전에 내려받으세요.</p><button type="button" data-download>기록 내려받기</button></div></div>`;root.querySelector('[data-download]').onclick=download}
 function bind(root,d,after=()=>{}){root.querySelectorAll('[data-field]').forEach(e=>e.oninput=()=>{d[e.dataset.field]=e.value;save();after()});root.querySelectorAll('[data-select]').forEach(e=>e.onchange=()=>{d[e.dataset.select]=e.value;save();after()})}

 /* Multiple choice items: [question, choices, correct index, explanation] */
 function quiz(name,intro,questions){
  return function run(root,s){
   const d=state[name]??={index:0,answers:{}};if(d.index>=questions.length)d.index=0;
   const [q,choices,correct,reason]=questions[d.index],answer=d.answers[d.index];
   const done=Object.keys(d.answers).length,right=Object.entries(d.answers).filter(([i,a])=>questions[i][2]===a).length;
   shell(root,s,`${intro} ${d.index+1} / ${questions.length}`,`<h3>${q}</h3><div class="ch5-choices">${choices.map((c,i)=>`<button type="button" data-answer="${i}" aria-pressed="${answer===i}">${c}</button>`).join('')}</div><div class="ch5-result" role="status" ${answer===undefined?'hidden':''}>${answer===undefined?'':`<strong>${answer===correct?'맞습니다.':'다시 생각해 보세요.'}</strong><p>${reason}</p>`}</div><div class="ch5-inline"><button type="button" data-prev ${d.index===0?'disabled':''}>이전 문항</button><button type="button" data-next ${d.index===questions.length-1?'disabled':''}>다음 문항</button><p class="ch5-note">응답 ${done}문항, 맞힌 문항 ${right}개</p></div>`);
   root.querySelectorAll('[data-answer]').forEach(b=>b.onclick=()=>{d.answers[d.index]=+b.dataset.answer;save();run(root,s)});
   root.querySelector('[data-prev]').onclick=()=>{d.index--;save();run(root,s)};root.querySelector('[data-next]').onclick=()=>{d.index++;save();run(root,s)};
  }
 }

 /* Colab gate: prediction and reason first, then the link and result fields checked against the answer notebook. */
 function colabGate(name,notebook,predictLabel,predictOptions,checks,extra){
  return function(root,s){
   const d=state[name]??={kind:'학생 실행 기록',prediction:'',reason:''};const ready=()=>!!(d.prediction&&d.reason?.trim());
   shell(root,s,'결과를 보기 전에 예상과 이유를 적으면 노트북 링크와 결과 기록란이 열립니다.',`<div class="ch5-grid">${select('prediction',predictLabel,predictOptions,d.prediction)}${field('reason','그렇게 예상한 이유',d.reason)}</div><p data-gate-status role="status"></p><div data-open ${ready()?'':'hidden'}><p><a class="ch5-button" href="${COLAB(notebook)}" target="_blank" rel="noopener noreferrer">Colab 노트북 열기</a></p><p class="ch5-note">파일 메뉴에서 Drive에 사본 저장을 먼저 선택합니다. Google 계정이 필요합니다. 빈칸의 기본값으로 실행했을 때의 결과와 비교합니다.</p><div class="ch5-table-wrap"><table><thead><tr><th>확인할 결과</th><th>내 결과</th><th>비교</th></tr></thead><tbody>${checks.map(([k,label,,step])=>`<tr><th>${label}</th><td><input type="number" step="${step||'any'}" data-num="${k}" value="${esc(d[k])}" aria-label="${esc(label)}"></td><td data-check="${k}"></td></tr>`).join('')}</tbody></table></div>${extra(d)}</div>`);
   const update=()=>{root.querySelector('[data-gate-status]').textContent=ready()?'예상과 이유를 기록했습니다.':'예상과 이유를 먼저 기록하세요.';root.querySelector('[data-open]').hidden=!ready();
    checks.forEach(([k,,want])=>{const cell=root.querySelector(`[data-check="${k}"]`),v=d[k];if(v===undefined||v===''){cell.textContent='';return}const step=checks.find(c=>c[0]===k)[3],tol=Number(step)/2+1e-9;cell.textContent=Math.abs(Number(v)-want)<=tol?'기본값 실행 결과와 같습니다.':'다릅니다. 빈칸의 값과 실행 순서를 확인하세요.'})};
   root.querySelectorAll('[data-num]').forEach(e=>e.oninput=()=>{d[e.dataset.num]=e.value;save();update()});bind(root,d,update);update();
  }
 }

 /* ---------- Chapter 6 ---------- */
 const clean=quiz('clean','실습 파일에서 실제로 찾을 수 있는 문제입니다. 펭귄 종의 평균과 그래프를 비교하는 분석을 기준으로 판단합니다.',[
  ['species 열에 Adelie, adelie, Adelie 뒤의 공백, ADELIE처럼 같은 종이 다르게 적혀 있습니다.',['다른 값이므로 그대로 둔다','공백을 지우고 하나의 표기로 통일한다','소문자로 적힌 행만 지운다'],1,'같은 종이 여러 값으로 세어지면 종별 평균과 개수가 나뉩니다. 노트북에서 표기를 통일하면 서로 다른 값이 7개에서 3개로 줄어듭니다.'],
  ['모든 열의 값이 똑같은 행이 여섯 쌍 있습니다.',['하나만 남기고 지운다','모두 지운다','그대로 둔다'],0,'같은 개체가 두 번 들어가면 평균과 그래프에 두 배로 반영됩니다. 하나만 남기면 350행이 344행이 됩니다. 값이 같은 서로 다른 개체일 가능성은 관측 번호 같은 다른 열로 확인합니다.'],
  ['아델리펭귄의 몸무게가 3.075로 적혀 있고 다른 측정값은 정상 범위입니다.',['평균값으로 바꾼다','kg으로 적은 값으로 보고 1000을 곱한다','이상치이므로 지운다'],1,'성체 펭귄의 몸무게는 수천 g입니다. 3.075 kg은 3075 g이고 같은 종의 범위 안에 있습니다. 노트북에서는 100 g보다 작은 값 4개를 이렇게 고치고 기준과 근거를 기록합니다.'],
  ['부리, 날개, 몸무게가 모두 비어 있는 행이 2개 있습니다.',['평균값으로 채운다','종 비교에 쓸 정보가 없으므로 지운다','0으로 채운다'],1,'측정값이 하나도 없으면 종 비교에 쓸 수 없습니다. 지운 행이 특정 종에 몰리는지 함께 확인하고 정제 기록에 남깁니다.'],
  ['측정값은 모두 있고 성별만 비어 있는 행이 9개 있습니다.',['종 비교에서는 그대로 두고 성별을 비교할 때 따로 처리한다','결측이 있으므로 모두 지운다','가장 많은 성별로 채운다'],0,'종을 비교하는 분석에는 성별이 쓰이지 않으므로 지우면 정보만 잃습니다. 분석의 목적에 따라 같은 결측도 다르게 처리합니다.']
 ]);
 const chart=quiz('chart','질문을 읽고 알맞은 그래프를 고릅니다.',[
  ['세 종의 날개 길이가 각각 어떤 범위에 어떻게 퍼져 있는지 알고 싶습니다.',['꺾은선그래프','히스토그램','원그래프'],1,'값이 퍼져 있는 모양은 히스토그램으로 봅니다. Colab 실습 4단계에서 종별 날개 길이의 히스토그램을 직접 그려 봅니다.'],
  ['섬마다 관측한 펭귄이 몇 마리인지 비교하고 싶습니다.',['막대그래프','산점도','꺾은선그래프'],0,'항목 사이의 크기 비교는 막대그래프가 알맞습니다.'],
  ['부리가 길수록 부리가 두꺼운지 알고 싶습니다.',['원그래프','히스토그램','산점도'],2,'두 값의 관계는 산점도로 봅니다. 종을 색으로 나누어 그리면 전체 자료와 종별 자료의 경향이 다르게 보입니다.'],
  ['2007년부터 2009년까지 해마다 관측한 펭귄 수의 변화를 보고 싶습니다.',['꺾은선그래프','원그래프','산점도'],0,'시간에 따른 변화는 꺾은선그래프로 봅니다. 해마다 조사한 섬과 횟수가 같은지도 함께 확인해야 변화의 원인을 말할 수 있습니다.'],
  ['전체 펭귄 가운데 각 종이 차지하는 비율을 보여 주고 싶습니다.',['산점도','원그래프','히스토그램'],1,'전체에서 차지하는 비율은 원그래프로 보여 줍니다. 항목이 많거나 비율이 비슷하면 막대그래프가 비교하기 쉽습니다.']
 ]);
 const colab6=colabGate('colab','ai-education-ch6-data-lab','날개 길이로 다른 두 종과 가장 뚜렷하게 구별될 종',['아델리','턱끈','젠투','구별되지 않음'],[
  ['rows','정제를 마친 뒤 남은 행 수',342,'1'],['unit','단위 오류로 고친 행 수',4,'1'],['gentoo','젠투펭귄의 날개 길이 평균(mm)',217.2,'0.1'],['corrAll','전체 자료의 부리 길이와 두께 상관계수',-0.24,'0.01'],['corrAdelie','아델리펭귄만의 상관계수',0.39,'0.01']
 ],d=>`<div class="ch5-grid">${field('compare','예상과 비교한 결과',d.compare,'예상한 종과 히스토그램의 결과가 같았나요?')}${field('limits','결론을 적용할 수 있는 범위',d.limits,'관측한 섬, 연도, 종별 표본 수를 생각합니다.')}</div>`);
 const quality=quiz('quality','상황을 읽고 가장 먼저 문제 삼아야 할 품질 관점이나 편향을 고릅니다.',[
  ['학교 누리집 설문에 응답한 학생들의 답만으로 전교생이 원하는 체험학습 장소를 정했습니다.',['측정 편향','표본 편향','기록 편향'],1,'응답한 학생이 전교생을 고르게 대표하지 못합니다. 응답자를 더 모아도 같은 방식으로 모으면 편향은 그대로 남습니다.'],
  ['창가 한 곳에만 둔 센서의 값으로 교실 전체의 온도를 판단했습니다.',['측정 편향','누락 편향','적시성'],0,'측정 위치가 한쪽으로 치우쳐 있습니다. 여러 위치에 센서를 두거나 측정 위치를 결론에 포함합니다.'],
  ['결석이 잦은 학생의 학습 기록이 대부분 비어 있는데 빈 행을 지우고 학급 평균을 냈습니다.',['일관성','누락 편향','적시성'],1,'빠진 값이 특정 집단에 몰려 있으면 지운 뒤의 평균이 그 집단을 반영하지 못합니다. 결측이 어디에 몰려 있는지 먼저 확인합니다.'],
  ['펭귄 실습 자료에서 턱끈펭귄은 Dream 섬, 젠투펭귄은 Biscoe 섬에서만 관측되었습니다. 섬 이름으로 종을 판별하는 규칙을 다른 지역 자료에도 쓰려고 합니다.',['대표성','정확성','일관성'],0,'이 자료의 섬과 종의 관계는 관측한 장소의 특징입니다. 다른 지역이나 다른 해의 펭귄에게 같은 결론을 적용할 근거가 없습니다.'],
  ['교사마다 다른 기준으로 매긴 참여도 점수를 모아 학급끼리 비교했습니다.',['기록 편향','표본 편향','완전성'],0,'같은 것을 다른 기준으로 기록하면 학급의 차이인지 기록한 사람의 차이인지 구별할 수 없습니다.']
 ]);

 /* ---------- Chapter 7-1 ---------- */
 function problem(root,s){
  const d=state.problem??={};
  shell(root,s,'오늘 Colab 실습이나 자신의 수업 문제 하나를 골라 모델을 만들기 전에 적습니다.',`<div class="ch5-grid">${field('topic','해결하려는 문제와 사용자',d.topic,'누가, 언제, 어떤 어려움을 겪나요?')}${field('io','입력과 출력',d.io,'무엇을 넣으면 무엇을 알려 주나요?')}${select('task','모델의 종류',['분류','예측','군집'],d.task)}${select('learning','학습 방식',['지도학습','비지도학습'],d.learning)}${field('data','데이터와 수집 방법',d.data,'특징과 정답, 수량, 출처')}${field('criterion','성공 기준',d.criterion,'예, 학습에 쓰지 않은 자료에서 정확도 90% 이상')}${field('impact','틀렸을 때의 영향과 확인 방법',d.impact)}${field('unknown','아직 정하지 못한 것',d.unknown)}</div><p class="ch5-note" data-hint role="status"></p>`);
  const hint=()=>{const t=d.task,l=d.learning;root.querySelector('[data-hint]').textContent=!t||!l?'모델의 종류와 학습 방식을 고르면 둘이 맞는지 확인합니다.':t==='군집'&&l==='지도학습'?'군집은 정답 없이 비슷한 것끼리 묶으므로 비지도학습입니다.':t!=='군집'&&l==='비지도학습'?'분류와 예측은 정답이 있는 데이터로 배우므로 지도학습입니다.':'모델의 종류와 학습 방식이 맞습니다. 성공 기준은 결과를 보기 전에 정합니다.'};
  bind(root,d,hint);hint();
 }
 // Training split of the Colab notebook (test_size 0.25, stratify, random_state 2026): bill length, flipper length, species.
 const TRAIN=[[36.3,190,"A"],[48.4,203,"G"],[40.9,187,"C"],[54.2,201,"C"],[49.0,216,"G"],[42.8,209,"G"],[48.6,230,"G"],[37.3,192,"A"],[47.3,222,"G"],[41.5,195,"A"],[39.6,196,"A"],[39.6,186,"A"],[35.9,190,"A"],[39.0,186,"A"],[40.6,187,"A"],[38.2,185,"A"],[50.0,220,"G"],[50.0,224,"G"],[46.2,187,"C"],[48.5,219,"G"],[35.2,186,"A"],[46.3,215,"G"],[39.5,188,"A"],[37.0,185,"A"],[37.6,181,"A"],[46.1,211,"G"],[48.7,210,"G"],[44.9,212,"G"],[48.1,199,"C"],[38.8,191,"A"],[37.6,185,"A"],[42.0,200,"A"],[49.8,198,"C"],[48.2,221,"G"],[47.0,185,"C"],[50.5,201,"C"],[42.0,190,"A"],[50.8,228,"G"],[50.9,196,"C"],[49.8,230,"G"],[47.6,215,"G"],[42.7,208,"G"],[51.0,203,"C"],[38.3,189,"A"],[45.2,215,"G"],[49.2,195,"C"],[43.5,220,"G"],[49.3,217,"G"],[46.4,221,"G"],[45.7,195,"C"],[39.3,190,"A"],[37.8,193,"A"],[40.6,193,"A"],[40.7,190,"A"],[49.4,216,"G"],[52.0,210,"C"],[42.7,196,"A"],[46.7,195,"C"],[46.4,216,"G"],[38.2,190,"A"],[36.5,182,"A"],[47.7,216,"G"],[35.1,193,"A"],[46.9,222,"G"],[46.5,192,"C"],[45.6,194,"C"],[46.9,192,"C"],[46.8,215,"G"],[50.5,222,"G"],[36.6,184,"A"],[43.4,218,"G"],[36.2,187,"A"],[50.2,218,"G"],[34.5,187,"A"],[42.9,215,"G"],[37.6,194,"A"],[40.2,200,"A"],[55.9,228,"G"],[49.6,216,"G"],[49.5,229,"G"],[45.5,210,"G"],[45.5,214,"G"],[45.3,208,"G"],[37.8,190,"A"],[39.2,196,"A"],[43.3,208,"G"],[47.3,216,"G"],[36.8,193,"A"],[44.0,208,"G"],[44.1,210,"A"],[50.0,218,"G"],[37.2,184,"A"],[45.4,211,"G"],[35.0,190,"A"],[35.3,187,"A"],[50.5,200,"C"],[43.5,213,"G"],[45.1,207,"G"],[36.4,195,"A"],[36.0,186,"A"],[36.9,189,"A"],[48.8,222,"G"],[46.4,191,"C"],[38.1,198,"A"],[45.8,197,"A"],[41.1,182,"A"],[45.2,191,"C"],[46.2,209,"G"],[37.8,186,"A"],[39.6,191,"A"],[42.1,195,"A"],[35.7,185,"A"],[55.1,230,"G"],[48.2,210,"G"],[35.5,195,"A"],[50.4,222,"G"],[51.3,198,"C"],[50.5,225,"G"],[46.2,221,"G"],[37.7,183,"A"],[41.1,189,"A"],[36.0,187,"A"],[37.7,198,"A"],[48.4,213,"G"],[41.1,188,"A"],[41.5,201,"A"],[43.2,208,"G"],[45.6,191,"A"],[45.8,219,"G"],[45.5,220,"G"],[50.4,224,"G"],[35.5,190,"A"],[45.4,188,"C"],[39.1,181,"A"],[48.1,209,"G"],[49.8,229,"G"],[38.6,188,"A"],[50.8,201,"C"],[51.5,187,"C"],[39.6,186,"A"],[46.6,193,"C"],[49.0,212,"C"],[40.9,191,"A"],[46.5,217,"G"],[36.7,187,"A"],[37.5,179,"A"],[49.6,193,"C"],[40.6,199,"A"],[49.7,195,"C"],[41.4,202,"A"],[49.1,228,"G"],[40.8,208,"A"],[54.3,231,"G"],[46.8,215,"G"],[36.6,185,"A"],[45.9,190,"C"],[50.1,225,"G"],[39.6,190,"A"],[39.2,195,"A"],[38.6,191,"A"],[43.2,192,"A"],[37.8,180,"A"],[38.8,180,"A"],[47.5,218,"G"],[40.9,214,"G"],[45.3,210,"G"],[37.3,191,"A"],[40.1,188,"A"],[46.0,194,"A"],[42.0,210,"G"],[50.6,193,"C"],[47.5,212,"G"],[50.7,223,"G"],[47.2,215,"G"],[37.5,199,"A"],[43.2,187,"C"],[50.3,197,"C"],[50.2,202,"C"],[45.5,196,"C"],[50.5,216,"G"],[43.2,197,"A"],[38.1,187,"A"],[36.4,184,"A"],[42.5,197,"A"],[37.2,178,"A"],[42.9,196,"A"],[38.7,195,"A"],[53.4,219,"G"],[45.0,220,"G"],[46.2,214,"G"],[39.7,184,"A"],[52.2,197,"C"],[51.3,193,"C"],[32.1,188,"A"],[59.6,230,"G"],[41.0,203,"A"],[48.7,208,"G"],[41.7,210,"G"],[42.4,181,"C"],[46.8,189,"C"],[47.5,199,"C"],[40.9,184,"A"],[48.5,191,"C"],[49.5,200,"C"],[38.1,181,"A"],[37.9,193,"A"],[42.8,195,"A"],[41.1,182,"A"],[40.2,193,"A"],[45.5,212,"G"],[36.5,181,"A"],[33.5,190,"A"],[51.3,218,"G"],[39.7,193,"A"],[51.5,230,"G"],[43.8,208,"G"],[46.7,219,"G"],[44.4,219,"G"],[46.2,217,"G"],[38.8,190,"A"],[38.5,190,"A"],[47.4,212,"G"],[58.0,181,"C"],[51.9,206,"C"],[49.2,221,"G"],[38.9,190,"A"],[45.2,198,"C"],[34.6,198,"A"],[49.1,212,"G"],[41.1,192,"A"],[44.1,196,"A"],[47.2,214,"G"],[50.1,190,"C"],[35.0,192,"A"],[45.7,214,"G"],[41.1,205,"A"],[46.0,195,"C"],[40.2,176,"A"],[45.2,212,"G"],[37.8,174,"A"],[46.1,178,"C"],[50.9,196,"C"],[51.3,197,"C"],[45.8,210,"G"],[34.0,185,"A"],[35.7,202,"A"],[43.5,202,"C"],[41.3,194,"A"],[37.0,185,"A"],[49.9,213,"G"],[46.5,210,"G"],[53.5,205,"C"],[35.9,189,"A"],[40.3,195,"A"],[38.9,181,"A"],[52.8,205,"C"]];
 const KO={A:'아델리',C:'턱끈',G:'젠투'},COLOR={A:'#e07b39',C:'#8e5bb5',G:'#2a8c82'};
 function knn(root,s){
  const d=state.knn??={bill:45,flipper:195,k:10};
  const X0=31,X1=61,Y0=170,Y1=235,W=640,H=440,P=60;
  const sx=x=>P+(x-X0)/(X1-X0)*(W-P-12),sy=y=>H-P-(y-Y0)/(Y1-Y0)*(H-P-12);
  const ticks=(a,b,step,f)=>{let o='';for(let v=Math.ceil(a/step)*step;v<=b;v+=step)o+=f(v);return o};
  const axes=ticks(X0,X1,5,v=>`<line x1="${sx(v)}" x2="${sx(v)}" y1="${H-P}" y2="12" class="ch67-grid"/><text x="${sx(v)}" y="${H-P+22}" text-anchor="middle">${v}</text>`)+ticks(Y0,Y1,10,v=>`<line x1="${P}" x2="${W-12}" y1="${sy(v)}" y2="${sy(v)}" class="ch67-grid"/><text x="${P-8}" y="${sy(v)+5}" text-anchor="end">${v}</text>`);
  shell(root,s,'학습 자료 256마리의 부리 길이와 날개 길이입니다. 그래프를 누르거나 값을 입력해 새 펭귄을 놓고 k를 바꾸어 봅니다.',`<div class="ch67-knn"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="부리 길이와 날개 길이 산점도, 새 펭귄의 위치와 가까운 이웃" data-plot>${axes}<text x="${(W+P)/2}" y="${H-6}" text-anchor="middle" class="ch67-axis">부리 길이 (mm)</text><text transform="translate(14 ${(H-P)/2}) rotate(-90)" text-anchor="middle" class="ch67-axis">날개 길이 (mm)</text><g data-lines></g>${TRAIN.map((p,i)=>`<circle data-i="${i}" cx="${sx(p[0]).toFixed(1)}" cy="${sy(p[1]).toFixed(1)}" r="4" fill="${COLOR[p[2]]}" fill-opacity=".55"/>`).join('')}<g data-new></g></svg><div><div class="ch67-legend">${Object.keys(KO).map(c=>`<span><i style="background:${COLOR[c]}"></i>${KO[c]}</span>`).join('')}</div><div class="ch5-inline"><label>부리 길이 (mm)<input type="number" min="${X0}" max="${X1}" step="0.1" data-bill value="${d.bill}"></label><label>날개 길이 (mm)<input type="number" min="${Y0}" max="${Y1}" step="1" data-flipper value="${d.flipper}"></label></div><label class="ch5-range">이웃의 수 k <output data-kv></output><input type="range" min="1" max="25" step="1" value="${d.k}" data-k aria-label="이웃의 수 k"></label><div class="ch5-inline">${[[39,190],[46,205],[50,196],[45,195]].map(([b,f])=>`<button type="button" data-preset="${b},${f}">${b} mm, ${f} mm</button>`).join('')}</div><div data-result role="status"></div></div></div><p class="ch5-note">두 값 모두 mm 단위라 그대로 거리를 잽니다. 단위가 다른 특징을 더할 때는 Colab 실습 4-4처럼 크기를 맞춥니다. 버튼의 앞 세 점은 노트북 4-2의 새 펭귄과 같습니다.</p>`);
  const plot=root.querySelector('[data-plot]');
  function update(){
   const b=Number(d.bill),f=Number(d.flipper),k=Number(d.k);root.querySelector('[data-kv]').textContent=k;
   if(!Number.isFinite(b)||!Number.isFinite(f)||b<X0||b>X1||f<Y0||f>Y1){root.querySelector('[data-result]').innerHTML=`<p>부리 길이는 ${X0}~${X1}, 날개 길이는 ${Y0}~${Y1} 사이로 입력하세요.</p>`;return}
   const near=TRAIN.map((p,i)=>({i,p,dist:Math.hypot(p[0]-b,p[1]-f)})).sort((a,c)=>a.dist-c.dist||a.i-c.i).slice(0,k);
   const votes={A:0,C:0,G:0};near.forEach(n=>votes[n.p[2]]++);const top=Math.max(...Object.values(votes)),winners=Object.keys(votes).filter(c=>votes[c]===top);
   root.querySelector('[data-lines]').innerHTML=near.map(n=>`<line x1="${sx(b)}" y1="${sy(f)}" x2="${sx(n.p[0])}" y2="${sy(n.p[1])}" stroke="${COLOR[n.p[2]]}" stroke-width="1.6"/>`).join('');
   plot.querySelectorAll('circle[data-i]').forEach(c=>{c.setAttribute('r','4');c.setAttribute('fill-opacity','.55')});near.forEach(n=>{const c=plot.querySelector(`circle[data-i="${n.i}"]`);c.setAttribute('r','6.5');c.setAttribute('fill-opacity','1')});
   root.querySelector('[data-new]').innerHTML=`<circle cx="${sx(b)}" cy="${sy(f)}" r="9" fill="#fff" stroke="#18345b" stroke-width="3"/><circle cx="${sx(b)}" cy="${sy(f)}" r="3" fill="#18345b"/>`;
   const result=winners.length>1?`동점 (${winners.map(c=>KO[c]).join(', ')})`:KO[winners[0]];
   root.querySelector('[data-result]').innerHTML=metrics([['아델리',`${votes.A} / ${k}`],['턱끈',`${votes.C} / ${k}`],['젠투',`${votes.G} / ${k}`]])+`<p><b>판단 ${result}</b>, 가장 많은 표의 비율 ${(100*top/k).toFixed(0)}%. ${winners.length>1?'표가 같으면 판단을 보류하고 다른 특징을 더 확인하는 편이 안전합니다.':top/k<0.7?'이웃의 의견이 갈립니다. 경계 근처의 점입니다.':'이웃 대부분이 같은 종입니다.'}</p>`;
   save();
  }
  const setPoint=(b,f)=>{d.bill=Math.round(b*10)/10;d.flipper=Math.round(f);root.querySelector('[data-bill]').value=d.bill;root.querySelector('[data-flipper]').value=d.flipper;update()};
  plot.addEventListener('click',e=>{const r=plot.getBoundingClientRect(),x=(e.clientX-r.left)/r.width*W,y=(e.clientY-r.top)/r.height*H;setPoint(Math.min(X1,Math.max(X0,X0+(x-P)/(W-P-12)*(X1-X0))),Math.min(Y1,Math.max(Y0,Y0+(H-P-y)/(H-P-12)*(Y1-Y0))))});
  root.querySelector('[data-bill]').oninput=e=>{d.bill=e.target.value;update()};root.querySelector('[data-flipper]').oninput=e=>{d.flipper=e.target.value;update()};
  root.querySelector('[data-k]').oninput=e=>{d.k=Number(e.target.value);update()};
  root.querySelectorAll('[data-preset]').forEach(bt=>bt.onclick=()=>{const [b,f]=bt.dataset.preset.split(',').map(Number);setPoint(b,f)});update();
 }
 const colab71=colabGate('colab','ai-education-ch7-1-model-lab','k를 1로 하면 학습 자료 정확도는 어떻게 될까요',['100%에 가깝다','평가 자료 정확도와 비슷하다','평가 자료 정확도보다 낮다'],[
  ['test10','k=10일 때 평가 자료 정확도(%)',95.3,'0.1'],['raw3','세 특징, 표준화 없음 정확도(%)',77.9,'0.1'],['scaled3','세 특징, 표준화 후 정확도(%)',97.7,'0.1'],['r2','예측 모델의 평가 자료 R²',0.73,'0.01'],['mae','예측 모델의 평균 절대 오차(g)',329,'1']
 ],d=>`<div class="ch5-grid">${field('k1','k=1에서 학습 자료 정확도가 높은 이유',d.k1,'노트북 4-3의 그래프를 보고 적습니다.')}${field('scale','몸무게를 그대로 더했을 때 정확도가 떨어진 이유',d.scale)}${field('cluster','군집 번호와 실제 종의 관계',d.cluster)}${field('limit','이 모델을 쓸 수 없는 상황',d.limit)}</div>`);
 const interpret=quiz('interpret','실습 결과를 설명한 문장입니다. 가장 타당한 해석을 고릅니다.',[
  ['k=1 모델의 학습 자료 정확도는 100%입니다.',['완벽한 모델이므로 바로 사용한다','자기 자신을 가장 가까운 이웃으로 찾은 결과이므로 평가 자료로 다시 확인한다','k가 작을수록 좋은 모델이다'],1,'학습 자료의 점은 자기 자신이 가장 가까운 이웃이라 거의 다 맞힙니다. 같은 모델의 평가 자료 정확도는 96.5%였습니다.'],
  ['평가 자료 정확도는 95.3%이고 턱끈펭귄의 재현율은 13/17입니다.',['모든 종을 95% 정도로 맞힌다','턱끈펭귄을 다른 종보다 자주 놓치므로 따로 보고하고 보완한다','평가 자료가 적어서 해석할 수 없다'],1,'전체 정확도는 자료가 많은 종에 끌려갑니다. 클래스별 재현율과 혼동행렬을 함께 봅니다.'],
  ['예측 모델의 식은 몸무게 = 49.9 × 날개 길이 − 5837입니다.',['날개 길이가 1 mm 길면 몸무게를 약 49.9 g 크게 예측한다','날개를 늘리면 펭귄이 무거워진다','날개 길이가 0이면 몸무게가 −5837 g이다'],0,'기울기는 예측값의 변화량입니다. 원인을 뜻하지 않고, 자료 범위 밖의 절편은 해석하지 않습니다.'],
  ['날개 길이가 260 mm인 펭귄의 몸무게를 같은 식으로 예측하려고 합니다.',['식에 넣으면 정확하게 예측된다','학습 자료의 범위(약 172~231 mm) 밖이라 믿기 어렵다고 밝힌다','R²가 0.73이므로 73% 확률로 맞는다'],1,'학습한 범위 밖의 예측은 근거가 약합니다. R²는 맞을 확률이 아니라 평가 자료의 변동 가운데 모델이 설명한 비율입니다.'],
  ['군집 결과에서 1번 군집에는 턱끈 9마리와 젠투 116마리가 들어 있습니다.',['1번은 젠투를 뜻하는 번호다','번호는 임의이므로 무리의 특징을 보고 해석한다','군집이 틀렸으므로 쓸 수 없다'],1,'군집은 정답 없이 묶으므로 번호에 뜻이 없습니다. 묶은 뒤 실제 종과 비교해 어떤 특징으로 나뉘었는지 해석합니다.'],
  ['새 펭귄에 대한 이웃 10마리의 표가 아델리 5, 턱끈 5로 나뉘었습니다.',['먼저 나온 종으로 판단한다','판단을 보류하고 다른 특징이나 사람의 확인을 더한다','두 종 모두 정답으로 처리한다'],1,'신뢰도가 낮은 경우의 처리 방법을 미리 정해 두어야 합니다. 앞 활동의 45 mm, 195 mm 지점이 이런 경우입니다.']
 ]);

 /* ---------- Chapter 7-2 ---------- */
 function plan(root,s){
  const d=state.plan??={};
  shell(root,s,'과제 2의 계획서입니다. Colab 노트북 B-1 표와 같은 항목입니다.',`<div class="ch5-grid">${field('title','프로젝트 이름과 문제',d.title,'누가, 언제, 어떤 어려움을 겪나요?')}${field('io','입력과 출력',d.io,'무엇을 넣으면 무엇을 알려 주고, 그 뒤 무엇을 하나요?')}${select('task','모델의 종류',['분류: 이미지','분류: 텍스트','분류: 음성','분류: 숫자','예측: 숫자','군집: 숫자'],d.task)}${select('tool','도구',['엔트리','Colab','둘 다'],d.tool)}${field('data','데이터 계획',d.data,'클래스, 수량, 수집 방법, 출처와 이용 조건')}${field('criterion','성공 기준',d.criterion,'학습에 쓰지 않은 자료에서 확인할 기준')}${field('impact','오류의 영향과 확인',d.impact,'틀리면 생기는 일, 신뢰도 기준, 사람의 확인 방법')}${field('privacy','개인정보와 저작권 확인',d.privacy,'얼굴, 목소리, 이름 없이 만들 수 있나요?')}</div><p class="ch5-note" data-progress role="status"></p>`);
  const keys=['title','io','task','tool','data','criterion','impact','privacy'];
  const progress=()=>{const n=keys.filter(k=>String(d[k]??'').trim()).length;root.querySelector('[data-progress]').textContent=`작성한 항목 ${n} / ${keys.length}`};bind(root,d,progress);progress();
 }
 const KINDS=['정상 입력','경계 입력','다른 조건','엉뚱한 입력','추가 1','추가 2'];
 function tests(root,s){
  const d=state.tests??={rows:KINDS.map(()=>({input:'',expected:'',actual:'',result:''}))};
  shell(root,s,'잘 되는 경우보다 어디서 실패하는지 찾는 것이 목적입니다. 결과는 보고서의 테스트 표로 옮깁니다.',`<div class="ch5-table-wrap"><table class="ch5-log"><thead><tr><th>테스트</th><th>입력</th><th>기대 결과</th><th>실제 결과와 신뢰도</th><th>판정</th></tr></thead><tbody>${KINDS.map((k,i)=>`<tr><th>${k}</th>${['input','expected','actual'].map(c=>`<td><input type="text" data-row="${i}" data-col="${c}" value="${esc(d.rows[i][c])}" aria-label="${k} ${c==='input'?'입력':c==='expected'?'기대 결과':'실제 결과'}"></td>`).join('')}<td><select data-row="${i}" data-col="result" aria-label="${k} 판정">${options(['','통과','실패','보류'],d.rows[i].result)}</select></td></tr>`).join('')}</tbody></table></div><div data-summary></div>${field('next','실패한 테스트에서 고칠 점',d.next,'데이터를 보완할지, 신뢰도 기준을 둘지, 동작을 바꿀지 적습니다.')}`);
  const summary=()=>{const c=x=>d.rows.filter(r=>r.result===x).length;root.querySelector('[data-summary]').innerHTML=metrics([['통과',c('통과')],['실패',c('실패')],['보류',c('보류')]])};
  root.querySelectorAll('[data-row]').forEach(e=>{const h=()=>{d.rows[+e.dataset.row][e.dataset.col]=e.value;save();summary()};e.oninput=h;e.onchange=h});bind(root,d);summary();
 }
 const errors=quiz('errors','증상을 읽고 오류의 종류를 고릅니다. 앞의 네 문항은 Colab 노트북 A의 실제 결과입니다.',[
  ['KeyError: "[\'flipper_lenght_mm\'] not in index"',['데이터 오류','문법과 이름 오류','정답 누출'],1,'열 이름의 철자가 틀려 그런 열이 없다는 뜻입니다. 오류 메시지의 마지막 줄과 화살표가 가리키는 줄을 먼저 봅니다.'],
  ['ValueError: Input X contains NaN.',['데이터 오류','평가 오류','논리 오류'],0,'입력에 빈 값이 있어 학습이 멈췄습니다. 측정값이 빈 행을 먼저 처리합니다.'],
  ['k를 1로 하고 정확도를 계산했더니 100%가 나왔습니다. 오류 메시지는 없습니다.',['정답 누출','평가 오류','문법과 이름 오류'],1,'학습에 쓴 자료로 평가했습니다. 학습 자료와 평가 자료를 나누면 평가 자료 정확도는 96.5%입니다.'],
  ['특징에 종 이름을 숫자로 바꾼 열을 더했더니 평가 자료 정확도가 100%가 되었습니다.',['데이터 오류','정답 누출','평가 오류'],1,'새 펭귄을 관측할 때는 종 이름을 모르므로 그 열은 입력이 될 수 없습니다. 그 열을 빼면 96.5%입니다.'],
  ['엔트리에서 신뢰도가 낮으면 다시 보여 달라고 말하게 만들었는데, 신뢰도가 높을 때 그 말이 나옵니다.',['논리 오류','데이터 오류','문법과 이름 오류'],0,'실행은 되지만 조건의 비교 방향이 의도와 반대입니다. 입력별로 기대한 결과와 실제 결과를 비교해 찾습니다.']
 ]);
 const SUBMIT=[['작품 또는 노트북','엔트리 작품 공유 링크 또는 Colab 노트북 공유 링크'],['프로젝트 계획서','문제, 입력과 출력, 모델, 데이터 계획, 성공 기준'],['테스트와 오류 수정 기록','테스트 표, 오류 수정 표, 바꾼 설정과 결과'],['결과 해석','성공 기준 달성 여부, 자주 틀린 경우와 이유, 데이터의 한계'],['수업 적용','학생이 직접 판단할 부분, 적용할 학년과 교과']];
 const CHECK=[['개인정보','얼굴, 목소리, 이름, 학번이 데이터와 화면에 없는가'],['저작권','웹에서 가져온 이미지와 글의 이용 조건을 확인했는가'],['공개 범위','엔트리 작품과 Colab 노트북의 공유 범위를 정했는가'],['재현','다른 사람이 링크만으로 실행해 같은 결과를 볼 수 있는가'],['생성형 AI 활용','코드나 글에 생성형 AI를 썼다면 사용 범위를 적었는가']];
 const CRITERIA=['문제 정의','데이터','구현','테스트와 오류 수정','해석과 수업 적용'];
 function checklist(root,s){
  const d=state.checklist??={done:{},self:{}};
  const box=(group,[k,v])=>`<label class="ch5-check"><input type="checkbox" data-check="${group}:${k}" ${d.done[`${group}:${k}`]?'checked':''}><span><b>${k}</b>, ${v}</span></label>`;
  shell(root,s,'제출물과 점검 항목을 확인하고 평가 기준으로 스스로 판단합니다. 제출 기한과 방법은 수업 안내를 따릅니다.',`<div class="ch5-grid"><div class="ch5-panel"><h3>제출물</h3>${SUBMIT.map(x=>box('제출물',x)).join('')}</div><div class="ch5-panel"><h3>제출 전 점검</h3>${CHECK.map(x=>box('점검',x)).join('')}</div></div><div class="ch5-table-wrap"><table><thead><tr><th>평가 기준</th><th>스스로 판단</th></tr></thead><tbody>${CRITERIA.map(c=>`<tr><th>${c}</th><td><select data-self="${c}" aria-label="${c} 스스로 판단">${options(['','충분함','보완이 필요함'],d.self[c])}</select></td></tr>`).join('')}</tbody></table></div><div data-summary></div>${field('plan','보완할 점과 남은 일',d.plan)}`);
  const summary=()=>{const n=Object.values(d.done).filter(Boolean).length,m=Object.values(d.self).filter(v=>v==='보완이 필요함').length;root.querySelector('[data-summary]').innerHTML=metrics([['확인한 항목',`${n} / ${SUBMIT.length+CHECK.length}`],['보완이 필요한 기준',`${m}개`],['남은 확인',`${SUBMIT.length+CHECK.length-n}개`]])};
  root.querySelectorAll('[data-check]').forEach(e=>e.onchange=()=>{d.done[e.dataset.check]=e.checked;save();summary()});
  root.querySelectorAll('[data-self]').forEach(e=>e.onchange=()=>{d.self[e.dataset.self]=e.value;save();summary()});bind(root,d);summary();
 }

 const handlers={
  '6':{clean,chart,colab:colab6,quality},
  '7-1':{problem,knn,colab:colab71,interpret},
  '7-2':{plan,tests,errors,checklist}
 }[CH]||{};
 window.aiEducationLabs={mount(root,s){handlers[s.lab](root,s)}};
})();
