/* Week 4 activities. Iris data is the Orange sample dataset, not generated data. */
window.Week4Labs = (() => {
  'use strict';
  const esc = s => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const names=['Setosa','Versicolor','Virginica'], colors=['#2363b4','#bc511d','#6d3eb0'];
  const featureNames=['꽃받침 길이','꽃받침 너비','꽃잎 길이','꽃잎 너비'];
  const data=window.WEEK4_IRIS.map(r=>({x:r.slice(0,4),label:r[4].replace('Iris-',''),c:['Iris-setosa','Iris-versicolor','Iris-virginica'].indexOf(r[4])}));
  const result='<div class="result" role="status" aria-live="polite"></div>';
  const prediction = choices => `<div class="prediction-row"><label>내 예상 <select data-prediction><option value="">선택하세요</option>${choices.map(s=>`<option>${s}</option>`).join('')}</select></label><button data-reveal disabled>결과 확인</button></div><div class="result" role="status" aria-live="polite" hidden></div>`;
  const quizData={
    tasks:[
      {q:'정답 품종이 붙은 꽃 자료로 새 꽃의 품종 예측',a:['분류','회귀','군집화'],ok:0,why:'예측할 답이 품종이라는 범주이고, 학습 자료에 정답이 있습니다.'},
      {q:'기온과 과거 기록으로 내일의 전력 사용량 예측',a:['분류','회귀','군집화'],ok:1,why:'예측할 답이 연속적인 수치입니다.'},
      {q:'미리 정한 그룹 없이 구매 행동이 비슷한 고객 묶기',a:['분류','회귀','군집화'],ok:2,why:'정답 그룹 없이 자료 사이의 유사성을 사용합니다.'}
    ],
    review:[
      {q:'Test & Score에 Tree만 연결했는데 결과가 없습니다.',a:['File의 Data도 연결한다','Tree Viewer만 추가한다','품종을 Features에 넣는다'],ok:0,why:'평가에는 데이터와 Learner가 모두 필요합니다.'},
      {q:'학습에 쓴 자료에서 100%를 맞혔습니다. 무엇을 알 수 있나요?',a:['새 꽃도 모두 맞힌다','학습 자료는 잘 맞혔지만 새 자료 성능은 추가 확인해야 한다','평가는 필요 없다'],ok:1,why:'훈련 자료의 점수만으로 일반화 성능을 판단할 수 없습니다.'},
      {q:'공정한 알고리즘 비교에 필요한 조건은?',a:['알고리즘마다 다른 데이터를 쓴다','가장 잘 나온 점수만 기록한다','같은 데이터와 평가 분할을 사용한다'],ok:2,why:'입력과 평가 조건을 맞춰야 알고리즘의 차이를 해석할 수 있습니다.'}
    ]
  };
  const read = key => {try{return JSON.parse(localStorage.getItem('ai-week4-'+key)||'null');}catch{return null;}};
  const save = (key,v) => {try{localStorage.setItem('ai-week4-'+key,JSON.stringify(v));return true;}catch{return false;}};
  const opts=(items,selected)=>items.map((s,i)=>`<option value="${i}" ${i===selected?'selected':''}>${s}</option>`).join('');
  function render(kind) {
    if(quizData[kind])return '<div class="quiz-progress"></div><div class="question"></div>'+result+'<div class="buttons"><button data-next-question>다음 문제</button></div>';
    if(kind==='threshold')return '<label>꽃잎 길이 기준, cm <input data-cut type="range" min="1" max="7" step="0.1" value="2.5"><output data-value>2.5</output></label><p class="small">기준 이하이면 Setosa, 초과하면 나머지 품종으로 예측합니다.</p><div data-chart></div>'+prediction(['모두 구분할 수 있다','일부를 잘못 구분할 것이다']);
    if(kind==='neighbors')return '<div class="lab-split"><div data-chart></div><div><label>이웃 수 k <select data-k><option>1</option><option selected>3</option><option>5</option></select></label><label>새 점의 X <input data-x type="range" min="0" max="10" step="0.5" value="5"></label><label>새 점의 Y <input data-y type="range" min="0" max="10" step="0.5" value="5"></label>'+prediction(['A','B'])+'<p class="small">좌표 예시, 파랑 A, 주황 B, 노랑 새 점<br>두 특징은 같은 스케일, 거리가 같으면 번호 순</p></div></div>';
    if(kind==='setup')return '<div class="checklist">'+['운영체제에 맞는 Orange3를 설치하거나 Portable을 준비했다.','Orange를 실행하고 New로 작업 공간을 열었다.','File과 Data Table 위젯을 찾았다.','File과 Data Table을 연결하고 두 번 클릭해 보았다.'].map((s,i)=>`<label><input type="checkbox" data-check="${i}">${s}</label>`).join('')+'</div>'+result+'<p class="small">확인 내용은 이 브라우저에만 저장됩니다.</p>';
    if(kind==='wiring')return '<div class="wire-rows">'+[['File, Data','표로 보기'],['File, Data','나무 학습'],['Tree, Model','나무 구조 보기'],['Tree, Learner','교차 검증'],['Test & Score, Evaluation Results','오류 확인']].map((r,i)=>`<label><span>${r[0]}<small>${r[1]}</small></span><select data-wire="${i}" aria-label="${r[0]}, ${r[1]}의 도착 위젯"><option value="">도착 위젯 선택</option>${['Data Table','Tree','Tree Viewer','Test & Score','Confusion Matrix'].map(s=>`<option>${s}</option>`).join('')}</select></label>`).join('')+'</div><button data-check-wires>연결 확인</button>'+result;
    if(kind==='iris')return `<div class="buttons"><label>X축 <select data-axis-x>${opts(featureNames,2)}</select></label><label>Y축 <select data-axis-y>${opts(featureNames,3)}</select></label><label><input type="checkbox" data-labels checked>품종 색 표시</label></div><div data-chart></div><div class="iris-legend">${names.map((n,i)=>`<span style="--series:${colors[i]}">${n}</span>`).join('')}</div>${result}`;
    if(kind==='folds')return '<div class="fold-controls buttons">'+[1,2,3,4,5].map(n=>`<button data-fold="${n}" aria-pressed="${n===1}">${n}회차</button>`).join('')+'</div><div class="fold-grid">'+[1,2,3,4,5].map(n=>`<div data-group="${n}"><b>묶음 ${n}</b><span></span></div>`).join('')+'</div>'+result+'<p class="small">150개를 품종별 균형이 맞는 5묶음으로 나눈 설명입니다. 각 꽃은 한 번 평가에, 네 번 학습에 사용됩니다.</p>';
    if(kind==='matrix')return '<div class="matrix-layout"><div><p class="small">혼동행렬 예시</p><table><thead><tr><th>실제 ∖ 예측</th>'+names.map(n=>`<th>${n}</th>`).join('')+'</tr></thead><tbody>'+[[48,2,0],[0,44,6],[0,4,46]].map((row,i)=>'<tr><th>'+names[i]+'</th>'+row.map((v,j)=>`<td><button data-cell="${i},${j}" aria-label="실제 ${names[i]}, 예측 ${names[j]}, ${v}개">${v}</button></td>`).join('')+'</tr>').join('')+'</tbody></table></div><div class="result" role="status" aria-live="polite">표의 숫자를 눌러 실제 품종과 예측 품종을 확인하세요.</div></div><label>정확도, % <input data-accuracy type="number" min="0" max="100" step="0.1" placeholder="0~100"></label><button data-check-accuracy>계산 확인</button><p data-score-answer role="status"></p>';
    if(kind==='reflection')return '<div class="record-grid">'+[['tree','Tree의 CA와 설정'],['knn','kNN의 CA와 k값'],['finding','혼동한 품종과 관찰한 차이'],['reason','설정을 바꾼 결과와 해석의 한계']].map(([id,label])=>`<label for="w4-${id}">${label}<textarea id="w4-${id}" data-record="${id}" rows="2"></textarea></label>`).join('')+'</div><div class="buttons"><button data-download>활동 기록 다운로드</button><button data-clear>기록 비우기</button></div>'+result+'<p class="small">내용은 이 브라우저에만 저장되며 서버로 전송하지 않습니다.</p>';
    return '';
  }
  function svgPlot(points,{xlabel='X',ylabel='Y',xlim=[0,10],ylim=[0,10],lines=[],onPoint=false}={}) {
    const X=x=>65+(x-xlim[0])/(xlim[1]-xlim[0])*630,Y=y=>270-(y-ylim[0])/(ylim[1]-ylim[0])*235;
    let s='<svg class="w4-chart" viewBox="0 0 760 330" role="img" aria-label="'+esc(xlabel+'와 '+ylabel+' 산점도')+'">';
    for(let t=0;t<=4;t++) {const x=xlim[0]+t*(xlim[1]-xlim[0])/4,y=ylim[0]+t*(ylim[1]-ylim[0])/4;s+=`<path class="grid-line" d="M${X(x)} 35V270M65 ${Y(y)}H695"/><text x="${X(x)}" y="294" text-anchor="middle">${+x.toFixed(1)}</text><text x="55" y="${Y(y)+5}" text-anchor="end">${+y.toFixed(1)}</text>`;}
    lines.forEach(l=>s+=`<path d="M${X(l[0])} ${Y(l[1])}L${X(l[2])} ${Y(l[3])}" stroke="#b84a29" stroke-width="2" stroke-dasharray="6 4"/>`);
    points.forEach((p,i)=>{s+=`<circle cx="${X(p.x)}" cy="${Y(p.y)}" r="${p.r||4.7}" fill="${p.color||'#425573'}" stroke="${p.selected?'#172a4c':'#ffffff'}" stroke-width="${p.selected?3:1}" ${onPoint?`tabindex="0" role="button" data-point="${i}" aria-label="${esc(p.label)}"`:''}><title>${esc(p.label||'')}</title></circle>`;});
    return s+`<text x="380" y="324" text-anchor="middle">${esc(xlabel)}</text><text x="14" y="155" transform="rotate(-90 14 155)" text-anchor="middle">${esc(ylabel)}</text></svg>`;
  }
  function bind(root) {
    const kind=root.dataset.kind,$=s=>root.querySelector(s),all=s=>[...root.querySelectorAll(s)];
    const out=text=>{const el=$('.result');if(el)el.textContent=text;};
    const on=(s,e,f)=>$(s).addEventListener(e,f);
    function predictionGate() {
      let answer='';
      on('[data-prediction]','change',()=>{$('[data-reveal]').disabled=!$('[data-prediction]').value;$('.result').hidden=true;});
      on('[data-reveal]','click',()=>{out(`내 예상, ${$('[data-prediction]').value}. ${answer}`);$('.result').hidden=false;});
      return text=>{answer=text;$('.result').hidden=true;$('.result').textContent='';$('[data-prediction]').value='';$('[data-reveal]').disabled=true;};
    }
    if(quizData[kind]){
      let index=0;const questions=quizData[kind];
      const paint=()=>{const q=questions[index];$('.quiz-progress').textContent=`${index+1} / ${questions.length}`;$('.question').innerHTML=`<p class="question-title">${q.q}</p><div class="buttons">${q.a.map((s,i)=>`<button data-answer="${i}">${s}</button>`).join('')}</div>`;out('답을 선택하세요.');all('[data-answer]').forEach(b=>b.addEventListener('click',()=>{all('[data-answer]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));out((+b.dataset.answer===q.ok?'맞습니다. ':'다시 생각해 보세요. ')+q.why);}));};
      on('[data-next-question]','click',()=>{index=(index+1)%questions.length;paint();});paint();
    }
    if(kind==='threshold'){
      const stageAnswer=predictionGate();
      const update=()=>{const cut=+$('[data-cut]').value;$('[data-value]').value=cut.toFixed(1);let correct=0,tp=0,fp=0;data.forEach(d=>{const pred=d.x[2]<=cut,actual=d.c===0;if(pred===actual)correct++;if(pred&&actual)tp++;if(pred&&!actual)fp++;});$('[data-chart]').innerHTML=svgPlot(data.map(d=>({x:d.x[2],y:d.x[3],color:colors[d.c],label:names[d.c]})),{xlabel:'꽃잎 길이, cm',ylabel:'꽃잎 너비, cm',xlim:[0,7],ylim:[0,3],lines:[[cut,0,cut,3]]});stageAnswer(`전체 150개 자료의 규칙 일치율, ${(100*correct/150).toFixed(1)}% (${correct} / 150). Setosa로 예측한 ${tp+fp}개 중 실제 Setosa ${tp}개, 다른 품종 ${fp}개.`);};on('[data-cut]','input',update);update();
    }
    if(kind==='neighbors'){
      const stageAnswer=predictionGate();
      const pts=[{x:5,y:4.5,c:0},{x:4,y:5,c:1},{x:6,y:5,c:1},{x:4,y:6,c:1},{x:7,y:6,c:0},{x:2,y:2,c:0},{x:8,y:8,c:1}];
      const update=()=>{const x=+$('[data-x]').value,y=+$('[data-y]').value,k=+$('[data-k]').value;const ranked=pts.map((p,i)=>({...p,i,dist:Math.hypot(x-p.x,y-p.y)})).sort((a,b)=>a.dist-b.dist||a.i-b.i).slice(0,k);const a=ranked.filter(p=>p.c===0).length,b=k-a;$('[data-chart]').innerHTML=svgPlot([...pts.map((p,i)=>({...p,color:colors[p.c],r:8,label:`${i+1}번, ${p.c?'B':'A'}`})),{x,y,r:10,color:'#efb52a',selected:true,label:'예측할 점'}]);stageAnswer(`새 점 (${x}, ${y}), k=${k}. A ${a}개, B ${b}개, 예측 ${a>b?'A':'B'}.`);};all('[data-x],[data-y],[data-k]').forEach(el=>el.addEventListener('input',update));update();
    }
    if(kind==='setup'){
      const old=read('setup')||[];all('[data-check]').forEach((el,i)=>el.checked=!!old[i]);const update=()=>{const checks=all('[data-check]').map(e=>e.checked),saved=save('setup',checks);out(`${checks.filter(Boolean).length} / 4개 확인${checks.every(Boolean)?', 붓꽃 실습을 시작할 준비가 되었습니다.':'.'}${saved?'':' 현재 브라우저에서는 기록을 저장할 수 없습니다.'}`);};all('input').forEach(el=>el.addEventListener('change',update));update();
    }
    if(kind==='wiring')on('[data-check-wires]','click',()=>{const answers=['Data Table','Tree','Tree Viewer','Test & Score','Confusion Matrix'];let n=0;all('select').forEach((el,i)=>{const correct=el.value===answers[i];el.setAttribute('aria-invalid',String(!correct));if(correct)n++;});out(n===5?'5개 연결이 모두 맞습니다. 실제 Orange에서도 같은 입력과 출력을 확인하세요.':`${n} / 5개 연결이 맞습니다. 표시된 연결의 역할을 다시 확인하세요.`);});
    if(kind==='iris'){
      const update=()=>{const x=+$('[data-axis-x]').value,y=+$('[data-axis-y]').value,color=$('[data-labels]').checked,limits=i=>[Math.floor(Math.min(...data.map(d=>d.x[i]))*2)/2-.2,Math.ceil(Math.max(...data.map(d=>d.x[i]))*2)/2+.2];$('[data-chart]').innerHTML=svgPlot(data.map((d,i)=>({x:d.x[x],y:d.x[y],color:color?colors[d.c]:'#6d7b90',label:`${i+1}번 ${names[d.c]}, ${featureNames[x]} ${d.x[x]}, ${featureNames[y]} ${d.x[y]}`})),{xlabel:featureNames[x]+', cm',ylabel:featureNames[y]+', cm',xlim:limits(x),ylim:limits(y),onPoint:true});$('.iris-legend').hidden=!color;out(x===y?'같은 특징을 두 축에 놓으면 점들이 대각선 위에 놓입니다. 서로 다른 특징을 골라 비교하세요.':'점을 누르거나 키보드로 선택하여 측정값을 확인하세요.');all('[data-point]').forEach(p=>{const show=()=>out(p.getAttribute('aria-label'));p.addEventListener('click',show);p.addEventListener('focus',show);p.addEventListener('keydown',e=>{if(['Enter',' '].includes(e.key)){e.preventDefault();show();}});});};all('select,input').forEach(el=>el.addEventListener('change',update));update();
    }
    if(kind==='folds'){
      const update=n=>{all('[data-fold]').forEach(b=>b.setAttribute('aria-pressed',String(+b.dataset.fold===n)));all('[data-group]').forEach(el=>{const test=+el.dataset.group===n;el.classList.toggle('held-out',test);el.querySelector('span').textContent=test?'평가 30개':'학습 30개';});out(`${n}회차: 묶음 ${n}의 30개를 평가합니다. 나머지 120개로 새 모델을 학습하며, 이번 평가 묶음의 정답은 학습에 쓰지 않습니다.`);};all('[data-fold]').forEach(el=>el.addEventListener('click',()=>update(+el.dataset.fold)));update(1);
    }
    if(kind==='matrix'){
      all('[data-cell]').forEach(el=>el.addEventListener('click',()=>{const [i,j]=el.dataset.cell.split(',').map(Number);out(`실제 ${names[i]}를 ${names[j]}로 예측한 꽃 ${el.textContent}개입니다. ${i===j?'대각선이므로 맞힌 사례입니다.':'대각선 밖이므로 틀린 사례입니다.'}`);}));
      on('[data-check-accuracy]','click',()=>{const input=$('[data-accuracy]'),value=+input.value;const correct=input.value!==''&&Math.abs(value-92)<.11;$('[data-score-answer]').textContent=correct?'맞습니다. (48 + 44 + 46) ÷ 150 × 100 = 92%입니다.':'대각선 48 + 44 + 46을 더하고 전체 150으로 나눈 뒤 100을 곱하세요.';});
    }
    if(kind==='reflection'){
      const old=read('reflection')||{};all('textarea').forEach(el=>el.value=old[el.dataset.record]||'');const fields=()=>Object.fromEntries(all('textarea').map(el=>[el.dataset.record,el.value]));const update=()=>out(save('reflection',fields())?'이 브라우저에 저장했습니다.':'저장 공간을 사용할 수 없습니다. 활동 기록을 다운로드하세요.');all('textarea').forEach(el=>el.addEventListener('input',update));
      on('[data-download]','click',()=>{const text=['AI알고리즘 4주차 활동 기록','머신러닝 알고리즘과 Orange3 첫 실습','평가 방법: 5겹 교차 검증, Stratified',...all('textarea').map(el=>$(`label[for="${el.id}"]`).firstChild.textContent+'\n'+(el.value||'(미작성)'))].join('\n\n');const url=URL.createObjectURL(new Blob(['\ufeff',text],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='AI알고리즘_4주차_활동기록.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
      on('[data-clear]','click',()=>{if(!confirm('이 브라우저에 저장한 4주차 활동 기록을 비울까요?'))return;all('textarea').forEach(el=>el.value='');update();});out('Orange에서 확인한 본인의 결과를 입력하세요.');
    }
  }
  return {render,bind};
})();
