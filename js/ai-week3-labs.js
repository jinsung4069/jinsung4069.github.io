/* Small, deterministic teaching simulations. No remote model or personal data. */
window.Week3Labs = (() => {
  'use strict';
  const $=(s,r)=>r.querySelector(s), esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const mean=a=>a.reduce((s,v)=>s+v,0)/a.length, fmt=(n,d=2)=>Number(n).toLocaleString('ko-KR',{maximumFractionDigits:d});
  const table=(h,rows)=>`<table><thead><tr>${h.map(x=>`<th scope="col">${x}</th>`).join('')}</tr></thead><tbody>${rows.map(row=>`<tr>${row.map(x=>`<td>${x}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
  const result='<div class="result" role="status" aria-live="polite"></div>';
  const range=(id,label,min,max,step,value)=>`<label for="${id}">${label} <input id="${id}" type="range" min="${min}" max="${max}" step="${step}" value="${value}"><output for="${id}">${value}</output></label>`;
  const chart=(points,x,neighbors=[])=>`<svg class="number-chart" viewBox="0 0 850 145" role="img" aria-label="길이 축에 표시한 학습 사례와 새 점"><path d="M40 100H810" stroke="#62718c"/>${Array.from({length:11},(_,i)=>`<text x="${40+i*77}" y="125" text-anchor="middle">${i}</text>`).join('')}${points.map((p,i)=>`<circle cx="${40+p[0]*77}" cy="65" r="${neighbors.includes(i)?16:11}" fill="${p[1]==='A'?'#3e5dae':'#b45e1b'}" stroke="${neighbors.includes(i)?'#162b51':'white'}" stroke-width="3"/><text x="${40+p[0]*77}" y="37" text-anchor="middle">${p[1]}</text>`).join('')}${x==null?'':`<path d="M${40+x*77} 82v22" stroke="#92236b" stroke-width="4"/><text x="${40+x*77}" y="18" text-anchor="middle" fill="#92236b">새 점</text>`}</svg>`;
  const questions={
    concept:[
      ['전문가가 만든 조건 규칙을 사실에 적용해 결론을 냅니다.',['규칙 기반','학습 기반'],0,'사람이 지식을 규칙으로 표현하고 추론 기구가 그 규칙을 적용합니다.'],
      ['사진과 이름표를 반복해서 사용하여 분류 기준을 조정합니다.',['규칙 기반','학습 기반'],1,'사람은 목표와 학습 방법을 정하고, 모델의 기준은 사례로부터 조정됩니다.'],
      ['사진 분류 모델에 처음 보는 사진 한 장을 넣었습니다.',['학습','추론'],1,'이미 만든 모델을 사용하는 추론입니다. 이 사용만으로 가중치가 바뀌지는 않습니다.']
    ],
    history:[
      ['다트머스 제안서와 1956년 연구 모임',['AI라는 이름의 연구 분야 형성','인터넷 검색 서비스의 탄생','심층 신경망의 최초 완성'],0,'1955년 제안서에서 Artificial Intelligence라는 명칭을 사용하고 1956년 여름 모임을 제안했습니다.'],
      ['2012년 AlexNet',['전문가 규칙만으로 이미지 분류','데이터와 GPU를 활용한 심층 신경망의 성과','AI 연구의 시작'],1,'대규모 이미지 데이터, 심층 신경망, GPU 학습의 결합이 이미지 분류 성능을 높였습니다.'],
      ['알파고의 바둑 판단',['딥러닝만으로 모든 경우를 암기','사람이 모든 수를 규칙으로 작성','신경망과 탐색, 학습 방법을 결합'],2,'좋은 수와 국면을 평가하는 신경망을 탐색과 결합했습니다.']
    ],
    process:[
      ['훈련 사진은 잘 맞히지만 다른 교실의 사진을 자주 틀립니다.',['훈련 점수만 보고 완료','조명과 배경별 오류를 살펴 데이터 개선','테스트 정답을 입력 특징에 추가'],1,'새 조건에서 생기는 오류를 확인합니다. 평가 정답을 입력에 넣으면 실제 성능을 평가할 수 없습니다.'],
      ['두 모델 중 하나를 골라야 합니다.',['검증 자료로 비교하고 최종 테스트는 남겨 둠','테스트 점수가 좋을 때까지 계속 수정','훈련 정확도가 높은 모델을 무조건 선택'],0,'모델 선택과 최종 평가에 쓰는 자료를 구분합니다. 반복 사용한 테스트는 독립적인 평가가 아닙니다.'],
      ['사과와 배의 사진을 새로 모으려고 합니다.',['각 과일을 항상 같은 배경에서만 촬영','한 종류의 사진 수만 늘림','과일별 조명과 각도를 다양하게 수집'],2,'과일 종류와 우연히 함께 나타나는 배경에만 의존하지 않도록 촬영 조건을 다양화합니다.']
    ]
  };
  const html={
    rules:()=>`<div class="buttons">${[['member','회원 등록',true],['overdue','연체 있음',false],['stock','책 있음',true]].map(([id,t,v])=>`<label><input id="rule-${id}" type="checkbox" ${v?'checked':''}>${t}</label>`).join('')}</div>${result}`,
    threshold:()=>`${range('fruit-threshold','길이 경계, cm',2,10,.5,6)}<p class="small">경계보다 짧으면 사과 A, 같거나 길면 바나나 B. 가상 자료입니다.</p><div class="train"></div><button class="primary" data-test>처음 보는 자료로 평가</button> <button data-reset>다시 탐색</button>${result}`,
    neighbors:()=>`${range('neighbor-x','새 점의 길이',0,10,.5,5)}<label>이웃 수 k <select id="neighbor-k"><option>1</option><option selected>3</option><option>5</option><option>7</option></select></label><div class="plot"></div>${result}<p class="small">A는 파란 원, B는 갈색 원입니다. 거리가 같은 이웃은 길이가 작은 것부터 선택합니다.</p>`,
    cluster:()=>`<p>자료: 1, 2, 3, 7, 8, 9 / 시작 중심: 1, 3</p><div class="buttons"><button class="primary" data-step>가까운 중심에 배정</button><button data-reset>처음으로</button></div><div class="cluster-display"></div>${result}`,
    reward:()=>`${range('bonus','우회 경로의 중간 보너스',0,8,1,0)}<div class="comparison"><section><h3>짧은 경로</h3><p>4번 이동 후 도착</p></section><section><h3>우회 경로</h3><p>6번 이동, 보너스 1회, 도착</p></section></div>${result}<p class="small">한 번 이동할 때 −1, 도착 시 +10, 할인율 1의 계산 모형입니다. 경로 점수 비교이며 학습 알고리즘 실행은 아닙니다.</p>`,
    neuron:()=>`<div class="buttons"><label>입력 x₁ <select id="nx1"><option>0</option><option selected>1</option></select></label><label>입력 x₂ <select id="nx2"><option>0</option><option selected>1</option></select></label><button data-and>AND 설정</button><button data-or>OR 설정</button></div>${range('nw1','가중치 w₁',-2,2,.5,1)}${range('nw2','가중치 w₂',-2,2,.5,1)}${range('nb','편향 b',-3,3,.5,-1.5)}${result}<div class="truth"></div><p class="small">합계 z가 0 이상이면 출력 1, 0 미만이면 출력 0입니다. 여기서는 값을 직접 조정하며 자동 학습은 하지 않습니다.</p>`,
    gradient:()=>`<p>학습 자료 (x, y): (1, 2), (2, 4), (3, 6) / 모형 ŷ = wx</p><label>학습률 <select id="learning-rate"><option value=".01">0.01</option><option value=".05" selected>0.05</option><option value=".3">0.30</option></select></label><div class="buttons"><button data-step class="primary">한 번 학습</button><button data-ten>10번 학습</button><button data-reset>처음으로</button></div>${result}<div class="loss-chart"></div><p class="small">MSE = 평균((wx − y)²). w의 기울기 = 2 × 평균(x(wx − y)). 새 w = 이전 w − 학습률 × 기울기.</p>`,
    tokens:()=>`<div class="token-sentence" aria-live="polite">오늘은</div><div class="token-choices buttons"></div><button data-reset>처음부터 선택</button>${result}<p class="small">단어를 토큰처럼 사용하는 단순화 모형입니다. 표시한 확률은 교육용으로 정한 값이며 실제 AI의 계산 결과가 아닙니다.</p>`,
    evaluation:()=>`${range('eval-threshold','경고를 내는 점수 기준',.1,.9,.1,.5)}<p class="small">기준 이상이면 경고합니다. 점수는 가상 모델의 출력이며 실제 확률로 보정된 값은 아닙니다.</p><div class="eval-table"></div>${result}`,
    reflection:()=>`<label for="reflection-example">선택한 체험과 입력</label><textarea id="reflection-example" placeholder="어떤 입력을 사용했나요?"></textarea><label for="reflection-change">바꾼 값과 관찰 결과</label><textarea id="reflection-change" placeholder="무엇을 바꾸었고 계산 결과가 어떻게 변했나요?"></textarea><label for="reflection-limit">새로운 사례와 한계</label><textarea id="reflection-limit" placeholder="새로운 자료에서도 같은 결과일까요? 무엇을 더 확인할까요?"></textarea><button data-download class="primary">활동 기록 저장</button><p class="small">입력 내용은 서버로 보내지 않습니다. 새로고침 전에 기록을 내려받으세요.</p>`
  };
  function render(kind){
    if(questions[kind])return `<div class="buttons question-nav">${questions[kind].map((_,i)=>`<button data-q="${i}" aria-pressed="${i===0}">문항 ${i+1}</button>`).join('')}</div><div class="question"></div>${result}`;
    return html[kind]();
  }
  function bind(root){
    const kind=root.dataset.kind, out=$('.result',root),on=(s,e,fn)=>$(s,root).addEventListener(e,fn);
    root.querySelectorAll('input[type=range]').forEach(el=>el.addEventListener('input',()=>el.nextElementSibling.textContent=el.value));
    if(questions[kind]){
      let current=0;const answers=[];
      const show=()=>{const q=questions[kind][current];$('.question',root).innerHTML=`<p class="question-title">${q[0]}</p><div class="buttons">${q[1].map((a,i)=>`<button data-answer="${i}" aria-pressed="${answers[current]===i}">${a}</button>`).join('')}</div>`;out.textContent=answers[current]==null?'판단의 근거를 생각한 뒤 선택하세요.':(answers[current]===q[2]?'맞습니다. ':'다시 생각해 보세요. ')+q[3];root.querySelectorAll('[data-q]').forEach(b=>b.setAttribute('aria-pressed',String(+b.dataset.q===current)));};
      root.addEventListener('click',e=>{const q=e.target.closest('[data-q]'),a=e.target.closest('[data-answer]');if(q){current=+q.dataset.q;show()}if(a){answers[current]=+a.dataset.answer;show()}});show();
    }
    if(kind==='rules'){
      const update=()=>{const member=$('#rule-member',root).checked,overdue=$('#rule-overdue',root).checked,stock=$('#rule-stock',root).checked,eligible=member&&!overdue;out.innerHTML=`<ol><li>규칙 1: 회원 ${member?'참':'거짓'}, 연체 없음 ${!overdue?'참':'거짓'} → 대출 자격 <strong>${eligible?'있음':'없음'}</strong></li><li>규칙 2: 대출 자격 ${eligible?'참':'거짓'}, 책 있음 ${stock?'참':'거짓'} → <strong>${eligible&&stock?'대출 가능':'대출 불가'}</strong></li></ol><p>모든 조건은 사람이 작성한 규칙에 따라 검사합니다.</p>`;};root.addEventListener('change',update);update();
    }
    if(kind==='threshold'){
      const train=[[2,'A'],[3,'A'],[4,'A'],[5,'A'],[6,'B'],[7,'A'],[8,'B'],[9,'B']],test=[[3.5,'A'],[5.5,'B'],[7.5,'B'],[8.5,'B']];let revealed=false;
      const results=data=>{const t=+$('#fruit-threshold',root).value;return data.map(([x,y])=>[x,y,x<t?'A':'B',(x<t?'A':'B')===y?'맞음':'틀림'])};
      const update=()=>{const rows=results(train);$('.train',root).innerHTML=table(['길이',...train.map(p=>p[0])],[['정답',...train.map(p=>p[1])],['예측',...rows.map(p=>p[2])]])+`<p>훈련 자료: ${rows.filter(p=>p[3]==='맞음').length} / 8</p>`;out.textContent='훈련 자료를 보며 경계를 정한 뒤 평가하세요.';};on('#fruit-threshold','input',update);on('[data-test]','click',()=>{revealed=true;$('#fruit-threshold',root).disabled=true;$('[data-test]',root).disabled=true;const rows=results(test);out.innerHTML=table(['새 길이','정답','예측','결과'],rows)+`<p>테스트: ${rows.filter(p=>p[3]==='맞음').length} / 4. 훈련 점수와 비교해 보세요.</p>`;});on('[data-reset]','click',()=>{$('#fruit-threshold',root).disabled=false;$('[data-test]',root).disabled=false;update();if(revealed)out.textContent='이미 본 테스트 자료입니다. 다시 조정한 결과는 독립적인 최종 성능으로 해석하지 않습니다.';});update();
    }
    if(kind==='neighbors'){
      const points=[[1,'A'],[2,'A'],[3,'B'],[4,'A'],[6,'B'],[7,'B'],[8,'A'],[9,'B']];
      const update=()=>{const x=+$('#neighbor-x',root).value,k=+$('#neighbor-k',root).value,near=points.map((p,i)=>({i,x:p[0],label:p[1],d:Math.abs(p[0]-x)})).sort((a,b)=>a.d-b.d||a.x-b.x).slice(0,k),a=near.filter(p=>p.label==='A').length;$('.plot',root).innerHTML=chart(points,x,near.map(p=>p.i));out.innerHTML=`<p>이웃 길이: ${near.map(p=>p.x+'('+p.label+')').join(', ')}<br>A ${a}표, B ${k-a}표 → 예측 <strong>${a>k/2?'A':'B'}</strong></p>`;};root.addEventListener('input',update);root.addEventListener('change',update);update();
    }
    if(kind==='cluster'){
      const points=[1,2,3,7,8,9];let centers=[1,3],groups=null,phase=0,round=0;
      const update=()=>{$('.cluster-display',root).innerHTML=table(['중심 1','중심 2'],[[...centers.map(x=>fmt(x))]])+(groups?table(['자료',...points],[['배정 군집',...groups.map(g=>g+1)]]):'');$('[data-step]',root).textContent=phase?'군집의 평균으로 이동':'가까운 중심에 배정';};
      on('[data-step]','click',()=>{if(!phase){groups=points.map(x=>Math.abs(x-centers[0])<=Math.abs(x-centers[1])?0:1);out.textContent='현재 중심과 가까운 쪽에 배정했습니다. 거리 동률이면 군집 1을 선택합니다.';}else{const prev=[...centers];centers=centers.map((c,i)=>{const a=points.filter((_,j)=>groups[j]===i);return a.length?mean(a):c});round++;out.textContent=`${round}회 갱신: 중심 ${centers.map(x=>fmt(x)).join(', ')}. `+(centers.every((x,i)=>x===prev[i])?'중심이 더 이상 움직이지 않습니다.':'다시 배정하면 군집이 바뀔 수 있습니다.');}phase=1-phase;update();});on('[data-reset]','click',()=>{centers=[1,3];groups=null;phase=0;round=0;out.textContent='먼저 가까운 중심에 자료를 배정하세요.';update()});out.textContent='먼저 가까운 중심에 자료를 배정하세요.';update();
    }
    if(kind==='reward'){
      const update=()=>{const bonus=+$('#bonus',root).value,short=6,long=4+bonus;out.innerHTML=`<p>짧은 경로: −4 + 10 = <strong>${short}</strong><br>우회 경로: −6 + ${bonus} + 10 = <strong>${long}</strong></p><p>${long===short?'두 경로의 누적 보상이 같습니다.':long>short?'우회 경로의 보상이 더 큽니다.':'짧은 경로의 보상이 더 큽니다.'} 보상의 설계가 선호 행동을 바꿀 수 있습니다.</p>`;};on('input','input',update);update();
    }
    if(kind==='neuron'){
      const update=()=>{const x1=+$('#nx1',root).value,x2=+$('#nx2',root).value,w1=+$('#nw1',root).value,w2=+$('#nw2',root).value,b=+$('#nb',root).value,z=w1*x1+w2*x2+b;out.innerHTML=`<p class="metric">${w1} × ${x1} + ${w2} × ${x2} + (${b}) = ${fmt(z)} → 출력 ${z>=0?1:0}</p>`;$('.truth',root).innerHTML=table(['x₁','x₂','합계 z','출력'],[[0,0],[0,1],[1,0],[1,1]].map(([a,c])=>[a,c,fmt(w1*a+w2*c+b),w1*a+w2*c+b>=0?1:0]));};root.addEventListener('input',update);root.addEventListener('change',update);for(const [selector,b]of [['[data-and]',-1.5],['[data-or]',-.5]])on(selector,'click',()=>{for(const [id,value]of [['nw1',1],['nw2',1],['nb',b]]){const el=$('#'+id,root);el.value=value;el.nextElementSibling.textContent=value;}update();});update();
    }
    if(kind==='gradient'){
      let w=0,n=0,losses=[56/3],message='';
      const update=()=>{const loss=14/3*(w-2)**2;out.innerHTML=`<p class="metric">${n}회 학습, w = ${fmt(w,5)}, MSE = ${fmt(loss,5)}</p><p>${message||'목표값을 정확히 맞히는 w는 2입니다. 학습을 진행해 접근하는지 관찰하세요.'}</p>`;const shown=losses.slice(-21),max=Math.max(...shown,1e-9);$('.loss-chart',root).innerHTML=`<svg viewBox="0 0 850 150" role="img" aria-label="최근 학습 단계의 손실, 세로 축은 현재 표시 범위에 맞춰집니다"><text x="10" y="20">최근 ${shown.length}개 손실, 최대 ${fmt(max,2)}</text><path d="M30 30V125H820" fill="none" stroke="#62718c"/><polyline points="${shown.map((v,i)=>`${30+i*780/Math.max(1,shown.length-1)},${125-v/max*85}`).join(' ')}" fill="none" stroke="#3e5dae" stroke-width="3"/>${shown.map((v,i)=>`<circle cx="${30+i*780/Math.max(1,shown.length-1)}" cy="${125-v/max*85}" r="3" fill="#3e5dae"/>`).join('')}</svg>`;};
      const step=()=>{const lr=+$('#learning-rate',root).value,g=28/3*(w-2),next=w-lr*g;if(Math.abs(next)>1e6){message='값이 지나치게 커져 멈췄습니다. 초기화한 뒤 학습률을 낮춰 보세요.';return;}const before=losses.at(-1);w=next;n++;const loss=14/3*(w-2)**2;losses.push(loss);message=loss>before?'손실이 증가했습니다. 학습률이 너무 크면 최적값을 지나쳐 발산할 수 있습니다.':'손실이 감소하거나 수렴하고 있습니다.';};on('[data-step]','click',()=>{step();update()});on('[data-ten]','click',()=>{for(let i=0;i<10;i++)step();update()});on('[data-reset]','click',()=>{w=0;n=0;losses=[56/3];message='';update()});update();
    }
    if(kind==='tokens'){
      let sentence=['오늘은'];const options=()=>sentence.length===1?[['맑은',.6],['비 오는',.4]]:sentence.length===2?(sentence[1]==='맑은'?[['날입니다.',.7],['아침입니다.',.3]]:[['날입니다.',.8],['밤입니다.',.2]]):[];
      const update=()=>{$('.token-sentence',root).textContent=sentence.join(' ');$('.token-choices',root).innerHTML=options().map(([t,p],i)=>`<button data-token="${i}">${t} <b>${Math.round(p*100)}%</b></button>`).join('');out.textContent=sentence.length<3?'같은 문맥에서도 여러 후보가 가능합니다. 직접 하나를 선택하세요.':'선택한 토큰을 문맥에 추가해 다음 표현을 이어 붙였습니다. 이 문장이 실제 날씨를 확인한 결과는 아닙니다.';};root.addEventListener('click',e=>{const b=e.target.closest('[data-token]');if(b){sentence.push(options()[+b.dataset.token][0]);update()}});on('[data-reset]','click',()=>{sentence=['오늘은'];update()});update();
    }
    if(kind==='evaluation'){
      const scores=[.9,.8,.7,.6,.5,.4,.3,.2],truth=[1,1,0,1,0,1,0,0];
      const update=()=>{const t=+$('#eval-threshold',root).value,pred=scores.map(v=>v>=t?1:0);let tp=0,tn=0,fp=0,fn=0;pred.forEach((v,i)=>{if(v&&truth[i])tp++;else if(v)fp++;else if(truth[i])fn++;else tn++;});$('.eval-table',root).innerHTML=table(['점수',...scores],[['실제 경고 필요',...truth],['모델의 경고',...pred]]);out.innerHTML=`<p>맞힌 수 ${tp+tn} / 8, 정확도 ${fmt((tp+tn)/8*100)}%</p><p>올바른 경고 ${tp}, 잘못된 경고 ${fp}, 놓친 사례 ${fn}, 올바른 비경고 ${tn}</p><p>정밀도 ${tp+fp?fmt(tp/(tp+fp)*100)+'%':'계산 불가, 경고 없음'}, 재현율 ${fmt(tp/(tp+fn)*100)}%</p>`;};on('input','input',update);update();
    }
    if(kind==='reflection')on('[data-download]','click',()=>{const text=['AI알고리즘 3주차 활동 기록',...['example','change','limit'].map(id=>$('label[for=reflection-'+id+']',root).textContent+'\n'+$('#reflection-'+id,root).value)].join('\n\n'),url=URL.createObjectURL(new Blob(['\ufeff',text],{type:'text/plain;charset=utf-8'})),a=document.createElement('a');a.href=url;a.download='AI알고리즘_3주차_활동기록.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
  }
  return {render,bind};
})();
