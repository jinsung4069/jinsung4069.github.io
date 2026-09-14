(() => {
  'use strict';
  const {slides,chapters,rows,columns}=window.WEEK2;
  const $=(s,root=document)=>root.querySelector(s);
  const esc=x=>String(x??'결측').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const fmt=(v,d=2)=>v==null?'결측':Number(v).toLocaleString('ko-KR',{maximumFractionDigits:d});
  const mean=a=>a.reduce((s,x)=>s+x,0)/a.length;
  const quantile=(a,q)=>{a=[...a].sort((x,y)=>x-y);const p=(a.length-1)*q,l=Math.floor(p);return a[l]+(a[Math.ceil(p)]-a[l])*(p-l);};
  const std=a=>Math.sqrt(mean(a.map(x=>(x-mean(a))**2)));
  const table=(heads,body)=>`<table><thead><tr>${heads.map(h=>`<th scope="col">${esc(h)}</th>`).join('')}</tr></thead><tbody>${body.map(r=>`<tr>${r.map(x=>`<td${x==null?' class="missing"':''}>${esc(x)}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
  const code=x=>`<pre><code>${esc(x)}</code></pre>`;
  const nb='https://colab.research.google.com/github/jinsung4069/jinsung4069.github.io/blob/main/data/lectures/ai-week2.ipynb';
  const colab=()=>`<a class="link primary" href="${nb}" target="_blank" rel="noopener">코랩 실습 열기 ↗</a><a class="link" href="../data/lectures/ai-week2.ipynb" download>노트북 다운로드</a><a class="link" href="../data/lectures/week2_flights.csv" download>가상 CSV 다운로드</a><span class="full-url">${nb}</span><p class="small">코랩 실행과 Drive 저장은 Google 로그인이 필요합니다. 브라우저 체험은 로그인 없이 이용할 수 있습니다.</p>`;
  const state={prediction:'',reflections:{},filterPrediction:'',quizScore:null};
  const quiz=[
    ['관측값 80개 중 유효값이 74개라면 결측값은 몇 개인가요?',['6개','74개','80개'],0,'전체 80개에서 유효값 74개를 빼면 결측값은 6개입니다.'],
    ['빨강, 파랑, 초록에 각각 0, 1, 2를 부여했을 때 올바른 해석은 무엇인가요?',['초록이 빨강보다 두 배 큽니다.','범주를 구별하는 코드입니다.','색의 밝기를 측정했습니다.'],1,'정수 코드는 범주의 식별 표현입니다. 수치의 크기와 거리에 의미가 있는지 별도로 판단합니다.'],
    ['두 학교의 대출 기록을 같은 열 구조로 이어 붙이는 방법은 무엇인가요?',['concat, 행 방향','mean','dropna'],0,'같은 열 구조를 행 방향으로 합치려면 concat을 사용합니다. 학교 구분 열과 중복 여부도 확인합니다.'],
    ['전체 자료의 평균으로 결측치를 채운 뒤 학습 자료와 평가 자료를 나누면 어떤 문제가 생기나요?',['항상 안전합니다.','평가 정보가 처리 기준에 섞입니다.','모든 결측치가 0이 됩니다.'],1,'학습 자료에서 대체 기준을 구하고 평가 자료에는 같은 기준을 적용해야 합니다.'],
    ['표준화한 데이터에 관한 올바른 설명은 무엇인가요?',['반드시 정규분포입니다.','모든 값이 0부터 1 사이입니다.','중심과 크기를 조정한 값입니다.'],2,'표준화는 중심과 크기를 조정하며 원래 분포의 모양을 정규분포로 바꾸지 않습니다.']
  ];
  const labs={
    prediction:()=>`<label for="prediction">나의 예상</label><textarea id="prediction" placeholder="예상과 그렇게 생각한 이유를 적어 보세요."></textarea><p class="small">작성한 예상은 분석 기록에 포함됩니다. 새로고침하면 기록이 초기화됩니다.</p>`,
    colab,
    cells:()=>`<div class="split"><div>${code('prices = [60, 80, 100]')}<button data-action="prepare">1번 셀 실행</button></div><div>${code('sum(prices) / len(prices)')}<button data-action="run">2번 셀 실행</button></div></div><div class="result" aria-live="polite">2번 셀부터 실행해 보세요.</div><button data-action="reset">런타임 초기화</button>`,
    dataset:()=>`<p class="small">가상 항공권 12건입니다. 가격 단위는 천 원, 비행시간은 시간, 출발까지 남은 기간은 일입니다.</p><div class="split">${[rows.slice(0,6),rows.slice(6)].map(a=>table(['id','항공사','좌석','시간','일수','가격'],a)).join('')}</div><p class="small">id는 항공권을 구별하는 식별자입니다. 결측치 처리를 비교하기 위해 비행시간 한 건을 비워 두었습니다.</p>`,
    inspect:()=>`<div class="buttons">${['head','tail','shape','info','describe','value_counts'].map(v=>`<button data-inspect="${v}">${v}</button>`).join('')}</div><div class="result" aria-live="polite"></div>`,
    filter:()=>`<label>좌석 <select class="seat"><option value="전체">전체</option><option>일반</option><option>우등</option></select></label><label>가격 상한 <input class="max-price" type="range" min="60" max="900" step="10" value="200"><output class="max-label">200</output>천 원</label><label>예상 건수 <input class="expected" type="number" min="0" max="12" aria-label="조건 검색 예상 건수"></label><button class="primary apply">결과 확인</button><div class="result" aria-live="polite">조건에 맞는 항공권의 건수를 예상한 뒤 결과를 확인하세요.</div>`,
    group:()=>`<label>그룹 기준 <select class="group-key"><option value="airline">항공사</option><option value="seat">좌석</option></select></label><label>집계 <select class="group-agg"><option value="mean">평균</option><option value="median">중앙값</option><option value="sum">합계</option></select></label><div class="result" aria-live="polite"></div>`,
    merge:()=>`<div class="split"><div><p>항공권 기록</p>${table(['id','항공사'],[[1,'가람'],[2,'누리']])}</div><div><p>항공사 정보</p>${table(['항공사','분류'],[['가람','A'],['다온','B']])}</div></div><label>병합 방식 <select class="join-how"><option>inner</option><option>left</option><option>right</option><option>outer</option></select></label><div class="result" aria-live="polite"></div>`,
    summary:()=>`<label><input class="include-extreme" type="checkbox" checked>900천 원 관측값 포함</label><div class="result" aria-live="polite"></div>`,
    histogram:()=>`<label>구간 수 <select class="bins"><option>4</option><option selected>6</option><option>12</option></select></label><div class="plot"></div><div class="small hist-caption" aria-live="polite"></div>`,
    correlation:()=>`<label>좌석 <select class="corr-seat"><option>전체</option><option>일반</option><option>우등</option></select></label><label><input class="corr-extreme" type="checkbox" checked>900천 원 관측값 포함</label><div class="plot"></div><div class="small corr-caption" aria-live="polite"></div>`,
    missing:()=>`<label>처리 방법 <select class="missing-method"><option value="keep">원본 유지</option><option value="drop">행 삭제</option><option value="mean">평균 대체</option><option value="median">중앙값 대체</option></select></label><div class="result" aria-live="polite"></div>`,
    outlier:()=>`<label>IQR 배수 <input class="iqr" type="range" min="1" max="4" step="0.5" value="1.5"><output class="iqr-label">1.5</output></label><div class="result" aria-live="polite"></div>`,
    encoding:()=>`<label>방법 <select class="encoding-method"><option value="label">레이블 코드</option><option value="onehot">원핫 인코딩</option></select></label><div class="result" aria-live="polite"></div>`,
    scaling:()=>`<label>방법 <select class="scaling-method"><option value="minmax">최소 최대 정규화</option><option value="standard">표준화</option></select></label><label><input class="scale-extreme" type="checkbox">500 추가</label><div class="result" aria-live="polite"></div>`,
    quiz:()=>`<div class="buttons quiz-nav">${quiz.map((q,i)=>`<button type="button" data-question="${i}" aria-pressed="${i===0}">문항 ${i+1}</button>`).join('')}</div><form id="quizForm">${quiz.map((q,i)=>`<fieldset class="quiz-item" data-q="${i}" ${i?'hidden':''}><legend>${i+1}. ${q[0]}</legend>${q[1].map((a,j)=>`<label><input type="radio" name="q${i}" value="${j}">${a}</label>`).join('')}<p class="quiz-answer" hidden>${q[3]}</p></fieldset>`).join('')}<button class="primary" type="submit">답 확인하기</button> <button type="reset">다시 풀기</button><div class="result" role="status">다섯 문항에 모두 응답한 뒤 해설을 확인하세요.</div></form>`,
    reflection:()=>`<label for="finding">자료에서 확인한 결과</label><textarea id="finding" placeholder="조건과 수치를 함께 적어 보세요."></textarea><label for="reason">전처리 선택과 이유</label><textarea id="reason" placeholder="처리 전후의 변화와 선택 이유를 적어 보세요."></textarea><label for="limit">해석의 한계와 추가 질문</label><textarea id="limit" placeholder="추가로 필요한 자료나 확인할 점은 무엇인가요?"></textarea><button class="primary" id="saveReflection">분석 기록 다운로드</button><p class="small">작성한 분석 기록을 내려받아 학교 이러닝 시스템에 제출하세요.</p>`,
    sources:()=>`<div class="buttons"><a href="https://pandas.pydata.org/docs/user_guide/indexing.html" target="_blank" rel="noopener">pandas 선택</a><a href="https://pandas.pydata.org/docs/user_guide/merging.html" target="_blank" rel="noopener">pandas 병합</a><a href="https://scikit-learn.org/stable/common_pitfalls.html" target="_blank" rel="noopener">scikit-learn 데이터 누수</a><a href="https://research.google.com/colaboratory/faq.html" target="_blank" rel="noopener">Colab 안내</a></div><p class="small">교재 연결 자료, 1장 18~31쪽, 2장 32~43쪽, 3장 44~53쪽, 4장 54~97쪽, 5장 98~123쪽, 6장 124~163쪽</p><p class="small">브라우저 체험에서는 계산 결과로 개념을 확인합니다. Python 코드를 직접 실행하려면 연결된 코랩 노트북을 사용하세요.</p>`
  };
  const diagrams = {
    pixels: () => `<figure class="foundation-figure pixel-example"><div class="pixel-grid" role="img" aria-label="첫 줄은 모두 파란색이고, 나머지 세 줄은 마지막 칸만 파란색인 4행 4열 그림">${[1,1,1,1,0,0,0,1,0,0,0,1,0,0,0,1].map(value => `<span class="${value ? 'filled' : ''}"></span>`).join('')}</div><div><p class="pixel-code">1111<br>0001<br>0001<br>0001</p><p>0은 흰 칸, 1은 파란 칸<br>화소 값 16개 = 16비트</p></div></figure>`,
    'library-bars': () => `<figure class="foundation-figure"><figcaption>도서관 점심시간 방문 횟수, 가상 자료</figcaption><div class="library-bars">${[['월',12],['화',18],['수',10],['목',20]].map(([day,value]) => `<div><span>${day}</span><span class="library-bar" style="--bar-width:${value/20*100}%" aria-hidden="true"></span><b>${value}회</b></div>`).join('')}</div></figure>`
  };
  const footer=(s,i)=>`<div class="slide-footer"><span>${s.source ? `<a href="${esc(s.source.url)}" target="_blank" rel="noopener">출처: ${esc(s.source.label)}</a>` : "AI알고리즘, 데이터 과학의 이해와 분석"}</span><span>${String(i+1).padStart(2,'0')}</span></div>`;
  $('#stage').innerHTML=slides.map((s,i)=>{
    let inner='';
    if(s.type==='cover')inner=`<div class="cover-copy"><p>${esc(s.sub)}</p><h1>${esc(s.title)}</h1>${s.text?`<p>${esc(s.text)}</p>`:''}</div><div class="presenter">전인성<br>광주교육대학교 컴퓨터교육과</div>`;
    else if(s.type==='section')inner=`<div class="section-copy"><div class="section-number">${String(s.ch).padStart(2,'0')}</div><h2>${esc(s.title)}</h2><p>${esc(s.sub)}</p></div>`;
    else inner=`<h2 class="slide-title">${esc(s.title)}</h2><span class="slide-chapter">${s.foundation ? esc(s.tag) : s.ch===0?'시작하기':s.ch===7?'정리와 적용':`CHAPTER ${String(s.ch).padStart(2,'0')}`}</span><div class="slide-body">${s.lead?`<p class="lead">${s.lead}</p>`:''}${s.quote?`<blockquote class="curriculum-quote">${esc(s.quote)}</blockquote>`:''}${s.diagram?diagrams[s.diagram]():''}${s.compare?`<div class="comparison">${s.compare.map(c=>`<section><h3>${c[0]}</h3><p>${c[1]}</p></section>`).join('')}</div>`:''}${(s.paragraphs||[]).map(p=>`<p>${p}</p>`).join('')}${s.steps?`<ol class="process">${s.steps.map((x,j)=>`<li><b>${j+1}</b>${x}</li>`).join('')}</ol>`:''}${s.table?table(s.table.heads,s.table.rows):''}${s.note?`<p class="foundation-note">${esc(s.note)}</p>`:''}${s.code?code(s.code):''}${s.lab?`<div class="lab" data-kind="${s.lab}">${labs[s.lab]()}</div>`:''}</div>`;
    return `<article class="slide ${s.type||''}${s.foundation ? ' foundation' : ''}" id="slide-${i+1}" data-lab="${s.lab||''}" aria-roledescription="슬라이드" aria-label="${i+1} / ${slides.length}, ${esc(s.title.replace('\n',' '))}" ${i?'hidden':''}>${inner}${footer(s,i)}</article>`;
  }).join('');
  // Each lab keeps its controls and results when moving to another slide.
  document.querySelectorAll('.lab').forEach(root=>{
    const kind=root.dataset.kind,result=$('.result',root),on=(selector,event,fn)=>$(selector,root).addEventListener(event,fn);
    if(kind==='prediction')on('textarea','input',e=>state.prediction=e.target.value);
    if(kind==='cells'){
      let ready=false;root.addEventListener('click',e=>{const a=e.target.dataset.action;if(!a)return;if(a==='prepare'){ready=true;result.textContent='prices 변수에 [60, 80, 100]을 저장했습니다.';}if(a==='run')result.textContent=ready?'실행 결과 80.0, 세 가격의 평균입니다.':"NameError: name 'prices' is not defined. 먼저 1번 셀을 실행해야 합니다.";if(a==='reset'){ready=false;result.textContent='변수와 실행 상태를 초기화했습니다. 2번 셀부터 다시 실행해 보세요.';}});
    }
    if(kind==='inspect'){
      const update=v=>{
        root.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.inspect===v)));
        if(v==='head'||v==='tail')result.innerHTML=code(`df.${v}(3)`)+table(columns,v==='head'?rows.slice(0,3):rows.slice(-3));
        if(v==='shape')result.innerHTML=code('df.shape')+'<p class="metric">(12, 6)</p><p>항공권 12건이 6개의 변수로 구성되어 있습니다.</p>';
        if(v==='info')result.innerHTML=code('df.info()')+table(['열','유효값','자료형'],columns.map((c,i)=>[c,i===3?11:12,[1,2].includes(i)?'문자열':i===3?'float':'int']));
        if(v==='describe'){const a=rows.map(r=>r[3]).filter(x=>x!=null);result.innerHTML=code("df['duration'].describe()")+table(['count','mean','std (ddof=1)','min','25%','50%','75%','max'],[[a.length,fmt(mean(a)),fmt(std(a)*Math.sqrt(a.length/(a.length-1))),1,fmt(quantile(a,.25)),fmt(quantile(a,.5)),fmt(quantile(a,.75)),4]])+'<p>count는 결측치를 제외한 11개입니다.</p>';}
        if(v==='value_counts')result.innerHTML=code("df['airline'].value_counts()")+table(['항공사','빈도'],[['가람',6],['누리',6]]);
      };root.addEventListener('click',e=>{if(e.target.dataset.inspect)update(e.target.dataset.inspect);});update('head');
    }
    if(kind==='filter'){
      const dirty=()=>{$('.max-label',root).textContent=$('.max-price',root).value;result.textContent='조건을 선택한 뒤 결과 확인을 눌러 주세요.';};on('.seat','change',dirty);on('.max-price','input',dirty);
      let resultPage=0; const applyFilter=()=>{const seat=$('.seat',root).value,max=Number($('.max-price',root).value),a=rows.filter(r=>(seat==='전체'||r[2]===seat)&&r[5]<=max),expected=$('.expected',root).value;state.filterPrediction=expected;result.innerHTML=code(`df[${seat==='전체'?'':`(df['seat'] == '${seat}') & `}(df['price'] <= ${max})]`)+`<p><strong>${a.length}건</strong>${a.length>6?`, ${resultPage*6+1}~${Math.min(a.length,resultPage*6+6)}번째 결과`:''}${expected!==''?`, 예상 ${esc(expected)}건과 비교해 보세요.`:''}${a.length>6?` <button class="more-results">${resultPage===0?'다음 결과 7~12':'이전 결과 1~6'}</button>`:''}</p>`+(a.length?table(['id','항공사','좌석','가격'],a.slice(resultPage*6,resultPage*6+6).map(r=>[r[0],r[1],r[2],r[5]])):'<p>이 조건에 맞는 항공권이 없습니다.</p>');const more=$('.more-results',root);if(more)more.addEventListener('click',()=>{resultPage=1-resultPage;applyFilter();});};on('.apply','click',()=>{resultPage=0;applyFilter();});
    }
    if(kind==='group'){
      const update=()=>{const key=$('.group-key',root).value,agg=$('.group-agg',root).value,idx=columns.indexOf(key),groups=[...new Set(rows.map(r=>r[idx]))];result.innerHTML=code(`df.groupby('${key}')['price'].agg(['${agg}', 'count'])`)+table([key,agg==='sum'?'가격 합계(천 원)':agg==='median'?'가격 중앙값(천 원)':'가격 평균(천 원)','건수'],groups.map(g=>{const a=rows.filter(r=>r[idx]===g).map(r=>r[5]);return[g,fmt(agg==='sum'?a.reduce((x,y)=>x+y,0):agg==='median'?quantile(a,.5):mean(a)),a.length];}));};on('.group-key','change',update);on('.group-agg','change',update);update();
    }
    if(kind==='merge'){
      const update=()=>{const how=$('.join-how',root).value;let body=[[1,'가람','A']];if(['left','outer'].includes(how))body.push([2,'누리',null]);if(['right','outer'].includes(how))body.push([null,'다온','B']);result.innerHTML=code(`tickets.merge(airlines, on='airline', how='${how}')`)+table(['id','항공사','분류'],body)+`<p>${body.length}행입니다. 빈 연결은 결측으로 남습니다.</p>`;};on('select','change',update);update();
    }
    if(kind==='summary'){
      const update=()=>{const a=rows.map(r=>r[5]).filter(v=>$('.include-extreme',root).checked||v!==900);result.innerHTML=table(['건수','평균(천 원)','중앙값(천 원)','최댓값(천 원)'],[[a.length,fmt(mean(a)),fmt(quantile(a,.5)),Math.max(...a)]])+'<p>900천 원의 관측값을 포함할 때와 제외할 때의 평균과 중앙값을 비교하세요.</p><p class="small">이 비교는 극단적인 값의 영향을 확인하기 위한 것입니다. 제외했을 때의 결과만으로 삭제 여부를 결정하지 않습니다.</p>';};on('input','change',update);update();
    }
    if(kind==='histogram'){
      const update=()=>{const bins=Number($('select',root).value),counts=Array(bins).fill(0),size=900/bins;rows.forEach(r=>counts[Math.min(bins-1,Math.floor(r[5]/size))]++);const max=Math.max(...counts),w=530/bins;let bars=counts.map((n,i)=>`<rect x="${45+i*w}" y="${170-n/max*135}" width="${w-4}" height="${n/max*135}" fill="#3e5dae"/><text x="${45+i*w+w/2}" y="${160-n/max*135}" text-anchor="middle" font-size="13">${n}</text><text x="${45+i*w}" y="190" font-size="11">${fmt(i*size,0)}</text>`).join('');$('.plot',root).innerHTML=`<svg class="chart" viewBox="0 0 620 235" role="img" aria-label="가격 히스토그램, 구간별 건수 ${counts.join(', ')}"><text x="5" y="18" font-size="13">건수</text><line x1="40" y1="170" x2="580" y2="170" stroke="#8290aa"/>${bars}<text x="575" y="190" font-size="11">900</text><text x="300" y="218" font-size="13">가격(천 원)</text></svg>`;$('.hist-caption',root).textContent=`구간 너비 ${fmt(size)}천 원, 총 ${counts.reduce((a,b)=>a+b,0)}건. 왼쪽 경계를 포함하고 마지막 구간은 900을 포함합니다.`;};on('select','change',update);update();
    }
    if(kind==='correlation'){
      const update=()=>{const seat=$('select',root).value,ex=$('input',root).checked,a=rows.filter(r=>r[3]!=null&&(seat==='전체'||r[2]===seat)&&(ex||r[5]!==900)),xs=a.map(r=>r[3]),ys=a.map(r=>r[5]),xm=mean(xs),ym=mean(ys),corr=mean(xs.map((x,i)=>(x-xm)*(ys[i]-ym)))/(std(xs)*std(ys));let dots=a.map(r=>`<circle cx="${55+r[3]/4*500}" cy="${180-r[5]/900*155}" r="5" fill="${r[2]==='일반'?'#3e5dae':'#bc4a00'}"><title>${r[0]}, ${r[2]}, ${r[3]}시간, ${r[5]}천 원</title></circle>`).join('');$('.plot',root).innerHTML=`<svg class="chart" viewBox="0 0 620 235" role="img" aria-label="비행시간과 가격 산점도. ${seat} ${a.length}건, 상관계수 ${fmt(corr,3)}"><text x="4" y="15" font-size="12">가격(천 원)</text><line x1="55" y1="20" x2="55" y2="180" stroke="#8290aa"/><line x1="55" y1="180" x2="560" y2="180" stroke="#8290aa"/>${[0,300,600,900].map(v=>`<text x="48" y="${185-v/900*155}" text-anchor="end" font-size="11">${v}</text>`).join('')}${[0,1,2,3,4].map(v=>`<text x="${55+v/4*500}" y="198" text-anchor="middle" font-size="11">${v}</text>`).join('')}${dots}<text x="255" y="226" font-size="12">비행시간(시간)</text><text x="390" y="15" fill="#3e5dae" font-size="12">● 일반</text><text x="465" y="15" fill="#bc4a00" font-size="12">● 우등</text></svg>`;$('.corr-caption',root).textContent=`유효한 ${a.length}쌍, Pearson 상관계수 ${fmt(corr,3)}. 비행시간 결측 한 건은 계산에서 제외합니다.`;};on('select','change',update);on('input','change',update);update();
    }
    if(kind==='missing'){
      const update=()=>{const method=$('select',root).value,original=rows.map(r=>r[3]),valid=original.filter(v=>v!=null),fill=method==='mean'?mean(valid):quantile(valid,.5),changed=method==='drop'?valid:original.map(v=>v==null&&method!=='keep'?fill:v),numeric=changed.filter(v=>v!=null);result.innerHTML=code(method==='keep'?"df['duration'].isna().sum()":method==='drop'?"df.dropna(subset=['duration'])":`work = df.copy()\nwork['duration'] = work['duration'].fillna(work['duration'].${method}())`)+table(['전체 행 수','결측 개수','비행시간 평균','106번 처리'],[[changed.length,changed.length-numeric.length,fmt(mean(numeric),3),method==='drop'?'행 제외':method==='keep'?'결측 유지':fmt(fill,3)+'시간']])+'<p class="small">이 체험은 전체 표에서 처리 결과를 비교합니다. 모델의 성능을 평가할 때는 학습 자료에서만 대체값을 구합니다.</p>';};on('select','change',update);update();
    }
    if(kind==='outlier'){
      const update=()=>{const a=rows.map(r=>r[5]),q1=quantile(a,.25),q3=quantile(a,.75),k=Number($('input',root).value),lo=q1-k*(q3-q1),hi=q3+k*(q3-q1),out=rows.filter(r=>r[5]<lo||r[5]>hi);$('output',root).textContent=k;result.innerHTML=table(['Q1','Q3','IQR','하한','상한'],[[q1,q3,q3-q1,fmt(lo),fmt(hi)]])+`<p>점검 대상 <strong>${out.map(r=>`${r[0]}번, ${r[5]}천 원`).join(', ')||'없음'}</strong></p><p class="small">가격 단위는 천 원입니다. 기준을 바꿔도 원본 자료는 삭제하지 않습니다.</p>`;};on('input','input',update);update();
    }
    if(kind==='encoding'){
      const update=()=>{const one=$('select',root).value==='onehot';result.innerHTML=one?code("pd.get_dummies(df[['airline']], dtype=int)")+table(['항공사','airline_가람','airline_누리'],[['가람',1,0],['누리',0,1]])+'<p>각 열은 해당 항공사인지 나타냅니다.</p>':code("codes, categories = pd.factorize(df['airline'])")+table(['항공사','코드'],[['가람',0],['누리',1]])+'<p>코드 0과 1은 항공사를 구별하며, 우열이나 크기를 나타내지 않습니다.</p>';};on('select','change',update);update();
    }
    if(kind==='scaling'){
      const update=()=>{const a=[10,20,30,40,50],ex=$('input',root).checked,method=$('select',root).value;if(ex)a.push(500);const m=mean(a),sd=std(a),lo=Math.min(...a),hi=Math.max(...a),b=a.map(x=>method==='minmax'?(x-lo)/(hi-lo):(x-m)/sd);result.innerHTML=table(['원래 값',...a],[[method==='minmax'?'정규화':'표준화',...b.map(x=>fmt(x,3))]])+`<p>변환 후 평균 <strong>${fmt(mean(b),3)}</strong>, 표준편차 <strong>${fmt(std(b),3)}</strong></p>`+code(method==='minmax'?"(x - x.min()) / (x.max() - x.min())":"(x - x.mean()) / x.std(ddof=0)")+'<p class="small">표준화에는 StandardScaler와 같은 ddof=0 기준을 사용합니다. 극단적인 값이 변환 결과에 미치는 영향을 비교하세요.</p>';};on('select','change',update);on('input','change',update);update();
    }
    if(kind==='quiz'){
      const showQuestion=n=>{root.querySelectorAll('.quiz-item').forEach((f,i)=>f.hidden=i!==n);root.querySelectorAll('[data-question]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.question)===n)));};
      root.querySelectorAll('[data-question]').forEach(b=>b.addEventListener('click',()=>showQuestion(Number(b.dataset.question))));

      on('form','submit',e=>{e.preventDefault();const answers=quiz.map((q,i)=>$(`input[name=q${i}]:checked`,root));if(answers.some(a=>!a)){result.textContent='아직 응답하지 않은 문항이 있습니다. 5문항에 모두 답해 주세요.';return;}const score=answers.filter((a,i)=>Number(a.value)===quiz[i][2]).length;state.quizScore=score;root.querySelectorAll('.quiz-answer').forEach((a,i)=>{a.hidden=false;a.textContent=(Number(answers[i].value)===quiz[i][2]?'정답. ':'다시 생각해 보기. ')+quiz[i][3];});result.textContent=`5문항 중 ${score}문항을 맞혔습니다. 해설을 읽고 선택의 이유를 비교해 보세요.`;});
      on('form','reset',()=>{showQuestion(0);root.querySelectorAll('.quiz-answer').forEach(a=>a.hidden=true);result.textContent='다섯 문항에 모두 응답한 뒤 해설을 확인하세요.';state.quizScore=null;});
      root.addEventListener('change',()=>{root.querySelectorAll('[data-question]').forEach((b,i)=>{b.textContent='문항 '+(i+1)+($(`input[name=q${i}]:checked`,root)?' ✓':'');});root.querySelectorAll('.quiz-answer').forEach(a=>a.hidden=true);result.textContent='응답을 변경했습니다. 답 확인하기를 다시 눌러 주세요.';state.quizScore=null;});
    }
    if(kind==='reflection'){
      root.querySelectorAll('textarea').forEach(t=>t.addEventListener('input',()=>state.reflections[t.id]=t.value));
      on('#saveReflection','click',()=>{const text=`AI알고리즘 2주차 분석 기록\n수업용 가상 데이터 활동\n\n처음 예상\n${state.prediction||'(미작성)'}\n\n자료에서 확인한 결과\n${state.reflections.finding||'(미작성)'}\n\n전처리 선택과 이유\n${state.reflections.reason||'(미작성)'}\n\n해석의 한계와 추가 질문\n${state.reflections.limit||'(미작성)'}\n\n최종 자가 점검\n${state.quizScore==null?'미완료':state.quizScore+' / 5'}\n`;download(text,'AI알고리즘_2주차_분석기록.txt','text/plain;charset=utf-8');});
    }
  });
  function download(content,name,type){const url=URL.createObjectURL(new Blob(['\ufeff',content],{type})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
  const viewer = $('#deckViewer');
  const dialog = $('#tocDialog');
  const pageDialog = $('#pageDialog');
  const pageNumber = $('#pageNumber');
  const articles = [...document.querySelectorAll('.slide')];
  const searchText = articles.map(article => article.textContent.toLocaleLowerCase());
  $('#tocContents').innerHTML = chapters.map((ch,j) => `<section><h3>${esc(ch)}</h3>${slides.map((s,i) => s.ch===j ? `<button type="button" data-slide="${i}"><span>${i+1}</span><b>${esc(s.title.replace('\n',' '))}</b></button>` : '').join('')}</section>`).join('');
  const tocButtons = [...$('#tocContents').querySelectorAll('button')];
  pageNumber.max = slides.length;
  $('#totalSlides').textContent = slides.length;
  let current = -1;
  let revealTimer;
  function revealControls() {
    viewer.classList.add('controls-visible');
    clearTimeout(revealTimer);
    revealTimer = setTimeout(() => viewer.classList.remove('controls-visible'), 3500);
  }
  viewer.addEventListener('pointerdown', revealControls);
  const fromHash = () => {
    const match = location.hash.match(/^#slide-(\d+)$/);
    return match ? Math.min(slides.length-1, Math.max(0, Number(match[1])-1)) : 0;
  };
  function go(index, hash=true) {
    index = Math.max(0, Math.min(slides.length-1, index));
    articles.forEach((article,j) => article.hidden = index !== j);
    current = index;
    viewer.classList.toggle('lab-mode', !!slides[index].lab);
    pageNumber.value = index+1;
    $('#previous').disabled = index === 0;
    $('#next').disabled = index === slides.length-1;
    $('#slideStatus').textContent = `${index+1} / ${slides.length}, ${slides[index].title.replace('\n',' ')}`;
    tocButtons.forEach((button,j) => button.setAttribute('aria-current', String(index === j)));
    if (hash && location.hash !== `#slide-${index+1}`) history.pushState(null, '', `#slide-${index+1}`);
  }
  $('#previous').addEventListener('click', () => go(current-1));
  $('#next').addEventListener('click', () => go(current+1));
  window.addEventListener('hashchange', () => go(fromHash(), false));
  $('#tocButton').addEventListener('click', () => dialog.showModal());
  $('#closeToc').addEventListener('click', () => dialog.close());
  $('#tocSearch').addEventListener('input', event => {
    const query = event.target.value.trim().toLocaleLowerCase();
    tocButtons.forEach(button => button.hidden = !searchText[Number(button.dataset.slide)].includes(query));
    $('#tocContents').querySelectorAll('section').forEach(section => section.hidden = !section.querySelector('button:not([hidden])'));
    $('#tocEmpty').hidden = tocButtons.some(button => !button.hidden);
  });
  dialog.addEventListener('click', event => {
    const button = event.target.closest('button[data-slide]');
    if (button) { go(Number(button.dataset.slide)); dialog.close(); }
  });
  $('#pageButton').addEventListener('click', () => { pageNumber.value = current+1; pageDialog.showModal(); pageNumber.focus(); pageNumber.select(); });
  $('#closePage').addEventListener('click', () => pageDialog.close());
  $('#pageForm').addEventListener('submit', event => { event.preventDefault(); go(Number(pageNumber.value)-1); pageDialog.close(); });
  [dialog, pageDialog].forEach(modal => {
    modal.addEventListener('close', revealControls);
    modal.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        modal.close();
      }
    });
  });
  function setFullscreenButton() {
    const active = !!document.fullscreenElement;
    const button = $('#fullscreenButton');
    const label = active ? '전체 화면 종료' : '전체 화면';
    button.setAttribute('aria-label', label);
    button.dataset.tip = label;
    button.querySelector('use').setAttribute('href', `#deck-icon-${active ? 'minimize' : 'maximize'}`);
  }
  $('#fullscreenButton').addEventListener('click', async () => {
    try { if (document.fullscreenElement) await document.exitFullscreen(); else await $('#presentation').requestFullscreen(); }
    catch { $('#slideStatus').textContent = '이 브라우저에서는 전체 화면을 사용할 수 없습니다.'; }
  });
  document.addEventListener('fullscreenchange', setFullscreenButton);
  $('#printButton').addEventListener('click', () => window.print());
  document.addEventListener('keydown', event => {
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || dialog.open || pageDialog.open || event.target.closest('input,textarea,select,[contenteditable=true],summary,.lab,header') || (event.key===' ' && event.target.closest('button,a'))) return;
    if (['ArrowRight','PageDown',' ','ArrowLeft','PageUp','Home','End'].includes(event.key)) {
      event.preventDefault();
      go(event.key==='Home' ? 0 : event.key==='End' ? slides.length-1 : current+(['ArrowLeft','PageUp'].includes(event.key) ? -1 : 1));
    }
  });
  go(fromHash(), false);
  revealControls();
})();
