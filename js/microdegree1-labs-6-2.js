/* 6주차 오후, 생성형 인공지능 결과 해석과 검증: activity slides. The club notice, the sample answers and the penalty scoring are written for these activities. */
(()=>{
 'use strict';
 const L=window.ceLabs;if(!L)return;const esc=L.esc;
 L.style(`.ce-lab.md-lab .s62-ask{flex:none;padding:.35em .9em;border-left:.25em solid #3f5dae;background:#f6f8fd;font-size:.88em}
.md-lab .s62-rows{flex:1;min-height:0;display:flex;flex-direction:column;gap:.4em}
.md-lab .s62-row{flex:1 1 auto;display:grid;grid-template-columns:1.8em minmax(0,1fr) auto;align-items:center;gap:.8em;padding:.25em .8em;border:1px solid #b9c6e6;border-radius:.5em;background:#f6f8fd;font-size:.9em;line-height:1.35}
.md-lab .s62-row>b{display:grid;place-items:center;width:1.7em;height:1.7em;border-radius:50%;background:#3f5dae;color:#fff;font-size:.9em}
.md-lab .s62-two{display:flex;gap:.45em}.md-lab .s62-two .md-chip{padding:.35em .95em;font-size:.88em}.md-lab .s62-two .md-chip[aria-pressed=true],.md-lab .s62-verdicts .md-chip[aria-pressed=true]{background:#fff7df;font-weight:800}
.md-lab .s62-spot{grid-template-columns:1.8em 7.4em minmax(0,1fr)}.md-lab .s62-pred{color:#52607f;font-size:.8em}
.md-lab .s62-chunks{display:flex;flex-wrap:wrap;align-items:center;gap:.3em}
.md-lab .s62-chunk{padding:.18em .6em;border:1px solid #9fb0dc;border-radius:.4em;background:#fff;color:#1c2c4c;line-height:1.3;cursor:pointer}.md-lab .s62-chunk:hover:enabled{background:#ebf0fc}
.md-lab .s62-chunk[data-s=miss]{border-style:dashed;background:#f6f8fd;color:#8490ad;cursor:default}.md-lab .s62-chunk[data-s=hit]{border-color:#c2413b;background:#fdeceb;color:#b5372f;font-weight:800;cursor:default}.md-lab .s62-chunk[data-s=rest]{cursor:default}
.md-lab .s62-fix{flex-basis:100%;color:#16794c;font-size:.94em;font-weight:800}.md-lab .s62-fix[data-kind=none]{color:#52607f}
.md-lab .s62-model{display:grid;gap:.4em}.ce-lab.md-lab .s62-model p{display:flex;align-items:baseline;justify-content:space-between;gap:1em}.md-lab .s62-model p>b{color:#2c478f}
.md-lab .s62-model p span b{font-size:1.45em;color:#3f5dae}.md-lab .s62-model small{color:#52607f;font-size:.8em}
.md-lab .s62-stack{display:flex;height:2em;border:1px solid #b9c6e6;border-radius:.3em;overflow:hidden}.md-lab .s62-stack i{display:block;height:100%}
.md-lab [data-k=none]{background:#c9d3ec}.md-lab [data-k=right]{background:#1f8a5b}.md-lab [data-k=wrong]{background:#c2413b}
.md-lab .s62-key{display:flex;flex-wrap:wrap;gap:.2em 1.2em;font-size:.82em}.md-lab .s62-key i{display:inline-block;width:.9em;height:.9em;margin-right:.4em;border-radius:.2em;vertical-align:-.1em}
.ce-lab.md-lab .s62-note{font-size:.78em;line-height:1.4;color:#52607f}
.md-lab .s62-lines{flex:1;min-height:0;display:flex;flex-direction:column;gap:.4em}
.md-lab .s62-line{display:grid;grid-template-columns:1.4em minmax(0,1fr) auto;flex:1 1 auto;align-items:center;gap:.6em;width:100%;padding:.25em .7em;border:1px solid #c9d3ec;border-radius:.5em;background:#fff;color:#1c2c4c;font-size:.9em;line-height:1.35;text-align:left}
.md-lab .s62-line[data-can=true]{cursor:pointer}.md-lab .s62-line[data-can=true]:hover{background:#ebf0fc}
.md-lab .s62-box{display:grid;place-items:center;width:1.35em;height:1.35em;padding:0;border:1px solid #9fb0dc;border-radius:.3em;background:#fff;color:#fff;font-size:.9em;font-style:normal;line-height:1}
.md-lab .s62-box[aria-pressed=true],.md-lab [aria-pressed=true]>.s62-box{outline:0;border-color:#f0a202;background:#f0a202}
.md-lab .s62-tag{display:inline-block;margin-left:.5em;padding:0 .55em;border-radius:99em;background:#ebf0fc;color:#2c478f;font-size:.84em;font-weight:800;white-space:nowrap}.md-lab .s62-tag[data-tone=warn]{background:#fff3cf;color:#7a5600}.md-lab .s62-tag[data-tone=good]{background:#e3f5ec;color:#16794c}.md-lab [data-result] .s62-tag{background:#fff}
.md-lab .s62-verdicts{display:flex;gap:.3em}.md-lab .s62-verdicts .md-chip{padding:.2em .7em;font-size:.84em}.md-lab .s62-verdicts .md-chip:disabled{cursor:default;color:#2c478f}
.md-lab .s62-source{font-size:.86em}.md-lab .s62-source li b{flex:none;color:#2c478f}.md-lab .s62-source li span{text-align:right}`);

 // The sample answer of the slide before, sentence by sentence.
 const SENTENCES=['한글은 세종대왕이 1446년에 창제한 문자입니다.','창제 당시에는 24자로 만들어졌습니다.','1940년 경주에서 발견된 『훈민정음 해례본』은 1997년 유네스코 세계기록유산에 등재되었습니다.','2026년은 훈민정음 반포 590주년입니다.','참고문헌, 김민준(2019), 「훈민정음의 과학적 원리」, 한국어문연구 12호'];
 const GUESS={ok:'그대로 쓴다',doubt:'의심스럽다'},KEY='s62Predict';
 L.add('s62Predict','custom',{
  hint:'앞 장의 응답 예시입니다. 검색하지 않고 문장마다 <b>그대로 써도 될지</b> 예상을 적어 봅니다. 확인 결과는 다음 장에 있습니다.',
  body:`<p class="s62-ask">요청문 “초등학교 4학년 한글날 수업에 쓸 한글 소개 글을 써 줘. 참고문헌도 하나 붙여 줘.”</p>
   <div class="s62-rows">${SENTENCES.map((s,i)=>`<div class="s62-row"><b>${i+1}</b><span>${esc(s)}</span><div class="s62-two">${Object.entries(GUESS).map(([v,label])=>`<button type="button" class="md-chip" data-i="${i}" data-v="${v}">${label}</button>`).join('')}</div></div>`).join('')}</div>`,
  state:()=>L.memory.get(KEY)||{pred:SENTENCES.map(()=>null)},
  render(ui,st,reset){
   ui.action('다시 하기',()=>{L.memory.set(KEY,null);reset()});
   function draw(){
    ui.all('.s62-two .md-chip').forEach(b=>b.setAttribute('aria-pressed',String(st.pred[b.dataset.i]===b.dataset.v)));
    const n=st.pred.filter(Boolean).length,doubt=st.pred.filter(v=>v==='doubt').length;
    ui.say(n<SENTENCES.length?`다섯 문장 중 ${n}문장의 예상을 적었습니다. 의심스러운 이유도 한 줄씩 떠올려 보세요.`:`예상을 모두 적었습니다. 의심스럽다고 본 문장은 ${doubt}개입니다. 다음 장의 확인 결과와 비교해 보세요.`,n===SENTENCES.length?'good':'');
   }
   ui.body.addEventListener('click',e=>{const b=e.target.closest('.s62-two .md-chip');if(b){st.pred[b.dataset.i]=b.dataset.v;L.memory.set(KEY,st);draw()}});draw();
  }});

 // The corrected part of each sentence, as given on the slide before.
 const SPOTS=[{chunks:['한글은','세종대왕이','1446년에 창제한','문자입니다.'],bad:2,fix:'1443년 창제, 1446년 반포 (창제와 반포를 혼동)'},
  {chunks:['창제 당시에는','24자로','만들어졌습니다.'],bad:1,fix:'창제 당시 28자, 현재 24자 사용'},
  {chunks:['1940년','경주에서','발견된 『훈민정음 해례본』은','1997년','유네스코 세계기록유산에 등재되었습니다.'],bad:1,fix:'1940년 안동에서 발견, 1997년 등재는 사실'},
  {chunks:['2026년은','훈민정음 반포','590주년입니다.'],bad:2,fix:'2026에서 1446을 빼면 580, 반포 580주년'}];
 L.add('s62Spot','custom',{
  hint:'확인 결과를 떠올리며 1번부터 4번 문장에서 <b>고쳐야 할 부분</b>을 눌러 짚어 봅니다. 앞에서 적은 예상이 함께 나타납니다.',
  body:`<div class="s62-rows">${SPOTS.map((s,i)=>`<div class="s62-row s62-spot"><b>${i+1}</b><span class="s62-pred" data-p="${i}"></span><div class="s62-chunks" data-row="${i}"></div></div>`).join('')}
   <div class="s62-row s62-spot"><b>5</b><span class="s62-pred" data-p="4"></span><div class="s62-chunks"><span>${esc(SENTENCES[4])}</span><span class="s62-fix" data-kind="none">확인 불가: 학술 DB에서 서지를 찾지 못함, 인용하지 않음</span></div></div></div>`,
  state:()=>({found:SPOTS.map(()=>false),miss:SPOTS.map(()=>[]),last:''}),
  render(ui,st,reset){
   ui.action('다시 하기',reset);
   const pred=(L.memory.get(KEY)||{}).pred||[];
   function draw(){
    ui.all('.s62-pred').forEach(n=>{const p=pred[n.dataset.p];n.textContent=p?`예상: ${GUESS[p]}`:'예상 기록 없음'});
    SPOTS.forEach((s,i)=>{ui.q(`.s62-chunks[data-row="${i}"]`).innerHTML=s.chunks.map((c,j)=>{const state=st.found[i]?(j===s.bad?'hit':'rest'):st.miss[i].includes(j)?'miss':'';
     return `<button type="button" class="s62-chunk" data-j="${j}" data-s="${state}" ${state?'disabled':''}>${esc(c)}</button>`}).join('')+(st.found[i]?`<span class="s62-fix">바른 내용: ${esc(s.fix)}</span>`:'')});
    const n=st.found.filter(Boolean).length,tries=st.miss.reduce((sum,m)=>sum+m.length,0);
    ui.say(n===SPOTS.length?`네 문장의 고칠 곳을 모두 찾았습니다(다른 곳을 짚은 횟수 ${tries}번). 매끄러운 문장과 구체적인 수치는 정확성의 증거가 아닙니다.`:st.last==='miss'?'확인 결과에서 고친 곳은 다른 부분입니다. 다시 짚어 보세요.':`네 문장 중 ${n}문장의 고칠 곳을 찾았습니다.`,n===SPOTS.length?'good':st.last==='miss'?'bad':'');
   }
   ui.body.addEventListener('click',e=>{const b=e.target.closest('.s62-chunk');if(!b||b.disabled)return;const i=Number(b.parentElement.dataset.row),j=Number(b.dataset.j);
    if(j===SPOTS[i].bad){st.found[i]=true;st.last='hit'}else{st.miss[i].push(j);st.last='miss'}draw()});draw();
  }});

 // SimpleQA figures from the slide before, read as counts out of 100 questions.
 const MODELS=[{name:'gpt-5-thinking-mini',none:52,right:22,wrong:26},{name:'o4-mini',none:1,right:24,wrong:75}];
 const points=tenths=>(tenths<0?'−':'')+(Math.abs(tenths)/10).toFixed(Math.abs(tenths)%10?1:0);
 L.add('s62Scoring','custom',{
  hint:'앞 장의 SimpleQA 결과를 100문항으로 바꾸어 봅니다. <b>오답의 감점</b>을 바꾸면 어느 모델의 점수가 더 높아질까요? 감점 채점은 이 활동을 위해 만든 계산 예시입니다.',
  body:`<div class="md-split" style="--split:1.45fr 1fr"><div class="md-panel" style="gap:1.7em"><h3>100문항 가운데</h3>${MODELS.map((m,i)=>`<div class="s62-model"><p><b>${m.name}</b><span>점수 <b data-score="${i}"></b>점</span></p>
   <div class="s62-stack" aria-hidden="true">${['none','right','wrong'].map(k=>`<i data-k="${k}" style="width:${m[k]}%"></i>`).join('')}</div>
   <p><span class="s62-key"><span><i data-k="none"></i>답하지 않음 ${m.none}</span><span><i data-k="right"></i>정답 ${m.right}</span><span><i data-k="wrong"></i>오답 ${m.wrong}</span></span><small data-how="${i}"></small></p></div>`).join('')}<p class="s62-note" style="margin-top:auto">막대는 100문항을 답하지 않음, 정답, 오답으로 나눈 것입니다. 점수는 정답 수에서 감점과 오답 수를 곱한 값을 뺀 것입니다.</p></div>
   <div class="md-panel"><h3>채점 방식</h3><label class="md-slider" style="grid-template-columns:7.4em 1fr 3.6em">오답 1개의 감점<input type="range" id="s62-sc-p" min="0" max="10" step="1" aria-label="오답 1개의 감점"><output id="s62-sc-out"></output></label>
   <ul class="md-list"><li><span>정답 1개</span><b>+1점</b></li><li><span>답하지 않음</span><b>0점</b></li><li><span>오답 1개</span><b id="s62-sc-wrong"></b></li></ul>
   <p style="font-size:.9em;margin-top:auto">점수가 더 높은 모델</p><p class="md-verdict" id="s62-sc-top" style="margin-top:0;font-size:1.25em;background:#ebf0fc;color:#2c478f"></p></div></div>`,
  state:()=>({p:0}),
  render(ui,st,reset){
   ui.action('처음 값으로',reset);
   function draw(){
    const score=MODELS.map(m=>m.right*10-st.p*m.wrong),top=score[0]>score[1]?0:1,penalty=st.p?`−${points(st.p)}점`:'0점';
    ui.q('#s62-sc-p').value=st.p;ui.q('#s62-sc-out').textContent=points(st.p)+'점';ui.q('#s62-sc-wrong').textContent=penalty;
    MODELS.forEach((m,i)=>{ui.q(`[data-score="${i}"]`).textContent=points(score[i]);ui.q(`[data-how="${i}"]`).textContent=`정답 ${m.right} − ${points(st.p)} × 오답 ${m.wrong}`});
    const v=ui.q('#s62-sc-top');v.textContent=MODELS[top].name;
    ui.say(st.p===0?`정답률만 보면 거의 모든 질문에 답한 o4-mini가 ${points(score[1])}점으로 앞섭니다. 오답 75개는 점수에 드러나지 않습니다.`
     :`오답에 ${points(st.p)}점을 감점하자 답하지 않은 문항이 많은 gpt-5-thinking-mini가 ${points(score[0])}점으로 ${points(score[1])}점인 o4-mini를 앞섭니다.`,st.p?'good':'');
   }
   ui.q('#s62-sc-p').addEventListener('input',e=>{st.p=Number(e.target.value);draw()});draw();
  }});

 L.add('s62Types','match',{hint:'일곱 가지 오류 유형과 나타난 모습을 짝지어 봅니다. 오른쪽은 앞 슬라이드의 사례와 설명에서 가져온 문장입니다.',leftTitle:'오류 유형',rightTitle:'나타난 모습',seed:17,pairs:[
  {left:'사실 오류',right:'제임스 웹 우주망원경이 외계 행성의 첫 사진을 찍었다고 답함'},
  {left:'환각',right:'없는 인물과 수치를 만들어 내어 사실처럼 소개함'},
  {left:'계산과 논리 오류',right:'28명 중 7명이 찬성했는데 찬성률을 20%라고 답함'},
  {left:'오래된 정보',right:'Bard가 Gemini로 이름을 바꾼 뒤에도 Bard로 안내함'},
  {left:'맥락 오해',right:'초등 3학년 자료를 요청했는데 중학교 용어로 설명함'},
  {left:'편향된 서술',right:'직업을 소개하며 특정 성별만 예로 듦'},
  {left:'출처 날조와 인용 불일치',right:'실제 판결문에 없는 문장을 판결문에서 인용했다고 적음'}]});

 L.add('s62Steps','order',{hint:'검증의 다섯 단계를 진행 순서대로 놓아 봅니다.',columns:5,seed:29,from:'처음',to:'마지막',items:[
  {key:'1단계',label:'주장 나누기',sub:'한 문장씩 확인 단위로'},{key:'2단계',label:'우선순위',sub:'수치, 인용, 날짜 먼저 확인'},{key:'3단계',label:'근거 찾기',sub:'원문과 1차 자료'},
  {key:'4단계',label:'교차 확인',sub:'독립된 다른 출처'},{key:'5단계',label:'판정 기록',sub:'판정, 근거, 바른 내용'}]});

 L.add('s62Where','quiz',{hint:'AI 답에 나온 주장을 어디에서 확인할지 고릅니다. 요약한 글이 아니라 <b>그 사실을 처음 내놓은 곳</b>을 찾습니다.',
  closing:'AI는 후보 제시에만 쓰고, 판정의 근거는 원문과 1차 자료에서 찾습니다.',questions:[
  {q:'AI 답에 나온 법령의 조문 번호가 맞는지 확인하려면 어디를 볼까요?',short:'법령과 조문',choices:['조문을 요약한 블로그 글','국가법령정보센터의 법령 원문','다른 AI의 답'],answer:1,why:'법령과 조문의 1차 자료는 법령 원문이며 국가법령정보센터에서 찾습니다.'},
  {q:'AI가 붙인 참고문헌이 실제로 있는 문헌인지 확인하려면 어떻게 할까요?',short:'논문과 참고문헌',choices:['같은 AI에게 실제 문헌인지 묻는다','제목과 저자가 그럴듯한지 읽어 본다','KCI, RISS, 학술지 누리집에서 원문을 찾는다'],answer:2,why:'가짜 판례 사건에서 ChatGPT는 실제냐는 질문에 그렇다고 답했습니다. 참고문헌은 학술 DB에서 존재와 내용을 확인합니다.'},
  {q:'AI 답에 나온 출생아 수 통계가 맞는지 확인하려면 어디를 볼까요?',short:'통계 수치',choices:['국가통계포털(KOSIS)의 공식 통계표','통계를 요약한 글','여러 AI에게 같은 질문을 한 결과'],answer:0,why:'통계 수치의 1차 자료는 공식 통계표입니다. 기준 연도와 조사 시점도 함께 확인합니다.'},
  {q:'세 가지 AI가 모두 같은 답을 냈습니다. 사실로 확인된 것일까요?',short:'AI끼리의 일치',choices:['확인되었다','확인되지 않았다'],answer:1,why:'여러 AI가 같은 오류를 학습했을 수 있으므로 AI끼리의 일치는 사실 확인을 대신하지 못합니다.'},
  {q:'AI 답의 출처로 낯선 누리집이 붙었습니다. 가장 먼저 할 일은 무엇일까요?',short:'낯선 출처와 측면 읽기',choices:['로고와 소개 글, 디자인을 살펴본다','본문을 처음부터 끝까지 깊이 읽는다','새 탭을 열어 다른 곳의 평가를 찾는다'],answer:2,why:'측면 읽기는 낯선 자료를 깊이 읽기 전에 그 자료와 작성자를 다른 곳에서 어떻게 평가하는지 먼저 확인하는 방법입니다.'}]});

 // An invented answer about an invented club notice. Sentences 1 to 4 carry a number, a date or a citation.
 const LINES=[{t:'과학 동아리는 실험을 좋아하는 학생을 위한 활동입니다.',why:'수치, 인용, 날짜가 없어 우선순위가 낮은 문장입니다. 시간이 있으면 같은 방법으로 확인합니다.'},
  {t:'모집 인원은 24명입니다.',tag:'수치',v:'ok',why:'안내문의 모집 인원 24명과 같으므로 확인됨입니다. 근거 자료와 위치를 함께 적습니다.'},
  {t:'활동은 4월 6일부터 매주 수요일에 합니다.',tag:'날짜',v:'fix',why:'안내문에는 매주 월요일로 적혀 있으므로 수정함입니다. 바른 내용과 근거를 적습니다.'},
  {t:'지난해 신청자 40명 중 30명이 수료해 수료율은 70%입니다.',tag:'수치',v:'fix',why:'30 ÷ 40 = 0.75이므로 수료율은 75%입니다. 수치는 직접 다시 계산해 수정함으로 적습니다.'},
  {t:'한 연구에 따르면 동아리 활동으로 과학 성적이 15% 오릅니다.',tag:'인용',v:'none',why:'안내문에 없고 어떤 연구인지도 찾을 수 없으므로 확인 불가입니다. 삭제하거나 확인한 뒤 사용합니다.'},
  {t:'신청서는 담당 교사에게 냅니다.',why:'수치, 인용, 날짜가 없어 우선순위가 낮은 문장입니다. 안내문의 신청 방법과 같습니다.'}];
 const VERDICTS={ok:'확인됨',fix:'수정함',none:'확인 불가'},FIRST=LINES.filter(l=>l.v).length;
 L.add('s62Verdict','custom',{
  hint:'AI 답에서 <b>수치, 인용, 날짜</b>가 있어 먼저 확인할 문장을 표시한 뒤, 근거 자료와 대조해 판정을 붙입니다. 답과 안내문은 이 활동을 위해 만든 예시입니다.',
  body:`<div class="md-split" style="--split:1.55fr 1fr"><div class="md-panel"><h3>AI 답 예시, 과학 동아리 소개 글</h3><div class="s62-lines" id="s62-vd-lines"></div></div><div class="md-panel" id="s62-vd-side"></div></div>`,
  state:()=>({phase:'mark',marks:LINES.map(()=>false),verdict:LINES.map(()=>null),why:''}),
  render(ui,st,reset){
   const go=ui.action('근거 자료 보기',()=>{
    if(st.phase==='mark'){st.phase='judge';st.why=''}
    else if(st.verdict.filter(Boolean).length<FIRST){st.why='need';draw();return}
    else{st.phase='done';st.why=''}
    draw();
   },true);
   ui.action('처음부터',reset);
   function draw(){
    const mark=st.phase==='mark',done=st.phase==='done';
    ui.q('#s62-vd-lines').innerHTML=LINES.map((l,i)=>`<div class="s62-line" data-i="${i}" data-can="${mark||done}"><button type="button" class="s62-box" aria-pressed="${st.marks[i]}" aria-label="${i+1}번 문장을 먼저 확인할 문장으로 표시" ${st.phase==='judge'?'disabled':''}>✓</button>
     <span>${esc(l.t)}${!mark&&l.tag?`<small class="s62-tag" data-tone="${st.marks[i]?'good':'warn'}">${l.tag}${st.marks[i]?'':', 표시 안 함'}</small>`:''}${!mark&&!l.tag&&st.marks[i]?'<small class="s62-tag">우선순위 낮음</small>':''}</span>
     ${!mark&&l.v?`<span class="s62-verdicts">${Object.entries(VERDICTS).map(([v,label])=>`<button type="button" class="md-chip" data-v="${v}" ${done?`disabled ${v===l.v?'data-result="right"':v===st.verdict[i]?'data-result="wrong"':''}`:`aria-pressed="${st.verdict[i]===v}"`}>${label}</button>`).join('')}</span>`:'<span></span>'}</div>`).join('');
    ui.q('#s62-vd-side').innerHTML=mark?`<h3>먼저 확인할 것</h3><ul class="md-list s62-source"><li><b>수치</b><span>인원, 비율, 계산 결과</span></li><li><b>인용</b><span>연구, 문헌, 출처</span></li><li><b>날짜</b><span>날짜와 요일</span></li></ul>
      <p class="s62-note" style="margin-top:auto">문장을 눌러 표시한 다음 '근거 자료 보기'를 누르면 동아리 운영 안내문이 나타납니다.</p>`
     :`<h3>근거 자료, 동아리 운영 안내문 예시</h3><ul class="md-list s62-source"><li><b>모집 인원</b><span>24명</span></li><li><b>활동</b><span>4월 6일부터 매주 월요일</span></li><li><b>지난해</b><span>신청 40명, 수료 30명</span></li><li><b>신청</b><span>담당 교사에게 신청서 제출</span></li></ul>
      <h3 style="margin-top:auto">신뢰도 표시 세 가지</h3><ul class="md-list s62-source"><li><b>확인됨</b><span>근거 자료에서 같은 내용 확인</span></li><li><b>수정함</b><span>틀린 내용을 바로잡음</span></li><li><b>확인 불가</b><span>근거를 찾지 못함</span></li></ul>`;
    go.textContent=mark?'근거 자료 보기':'판정 확인';go.disabled=done;
    const hit=LINES.filter((l,i)=>l.v&&st.marks[i]).length,extra=LINES.filter((l,i)=>!l.v&&st.marks[i]).length,right=LINES.filter((l,i)=>l.v&&st.verdict[i]===l.v).length;
    ui.say(mark?`먼저 확인할 문장으로 ${st.marks.filter(Boolean).length}개를 표시했습니다.`
     :st.why==='need'?'수치, 인용, 날짜가 있는 네 문장 모두에 판정을 고른 뒤 확인하세요.'
     :st.why?st.why
     :done?`네 문장 중 ${right}문장의 판정이 근거와 맞습니다. 문장을 누르면 근거가 나옵니다.`
     :`먼저 확인할 네 문장 중 ${hit}개를 표시했습니다${extra?`(우선순위가 낮은 문장 ${extra}개도 표시)`:''}. 이제 안내문과 대조해 판정을 고르세요.`,st.why==='need'?'bad':done&&!st.why&&right===FIRST?'good':'');
   }
   ui.body.addEventListener('click',e=>{
    const line=e.target.closest('.s62-line');if(!line)return;const i=Number(line.dataset.i),chip=e.target.closest('.s62-verdicts .md-chip');
    if(st.phase==='mark')st.marks[i]=!st.marks[i];
    else if(st.phase==='judge'){if(!chip)return;st.verdict[i]=chip.dataset.v;st.why=''}
    else st.why=`${i+1}번 문장: ${LINES[i].why}`;
    draw();
   });draw();
  }});

 // A first answer that has been checked, one request from the slide before, and an invented revision that changes more than was asked.
 const BEFORE=[['한글은 세종대왕이 1446년에 창제한 문자입니다.','수정 요청','warn'],['창제 당시에는 28자였고 지금은 24자를 씁니다.','확인됨','good'],['『훈민정음 해례본』은 1940년 안동에서 발견되었습니다.','확인됨','good'],['한글날 수업에서 다루면 학생의 흥미를 높일 가능성이 있습니다.','그대로 둠','']];
 const AFTER=[{t:'한글은 세종대왕이 1443년에 창제한 문자입니다.',changed:false,kind:'요청한 수정',why:'요청한 대로 고친 문장입니다. 고친 부분은 근거와 다시 대조합니다.'},
  {t:'창제 5년 뒤인 1446년에 반포되었습니다.',changed:true,kind:'새로 생긴 오류',why:'고친 문장 주변에 요청하지 않은 문장과 새 수치가 생겼습니다. 1446 − 1443 = 3이므로 5년 뒤가 아니라 3년 뒤입니다.'},
  {t:'창제 당시에도 지금처럼 24자였습니다.',changed:true,kind:'바뀐 맞는 내용',why:'이미 확인한 문장이 다른 뜻으로 바뀌었습니다. 창제 당시에는 28자였습니다.'},
  {t:'『훈민정음 해례본』은 1940년 안동에서 발견되었습니다.',changed:false,kind:'그대로',why:'처음 답과 같은 문장입니다.'},
  {t:'한글날 수업에서 다루면 학생의 흥미가 높아집니다.',changed:true,kind:'사라진 신중한 표현',why:'“가능성이 있습니다”가 단정 표현으로 바뀌었습니다.'}];
 L.add('s62Recheck','custom',{
  hint:'수정 요청은 창제 연도 하나였습니다. 고친 답에서 <b>요청하지 않았는데 바뀌었거나 새로 생긴 문장</b>을 모두 고르세요. 두 답은 이 활동을 위해 만든 예시입니다.',
  body:`<div class="md-split" style="--split:1fr 1.1fr"><div class="md-panel"><h3>처음 답과 판정</h3><div class="s62-lines">${BEFORE.map(([t,tag,tone],i)=>`<div class="s62-line" style="grid-template-columns:1.4em minmax(0,1fr)"><b style="color:#2c478f">${i+1}</b><span>${esc(t)}<small class="s62-tag" data-tone="${tone}">${tag}</small></span></div>`).join('')}</div>
   <p class="s62-ask" style="margin-top:auto">수정 요청문 “한글 창제 연도를 1443년으로 고쳐 줘.”</p></div>
   <div class="md-panel"><h3>AI가 고친 답</h3><div class="s62-lines" id="s62-rc-lines"></div></div></div>`,
  state:()=>({picked:AFTER.map(()=>false),checked:false,why:''}),
  render(ui,st,reset){
   const check=ui.action('확인',()=>{st.checked=true;st.why='';draw()},true);ui.action('다시 하기',reset);
   function draw(){
    ui.q('#s62-rc-lines').innerHTML=AFTER.map((l,i)=>`<button type="button" class="s62-line" data-i="${i}" data-can="true" style="grid-template-columns:1.4em minmax(0,1fr)" ${st.checked?`data-result="${st.picked[i]===l.changed?'right':'wrong'}"`:`aria-pressed="${st.picked[i]}"`}><i class="s62-box" ${st.checked&&st.picked[i]?'style="border-color:#f0a202;background:#f0a202"':''}>✓</i>
     <span>${esc(l.t)}${st.checked?`<small class="s62-tag" data-tone="${l.changed?'warn':'good'}">${l.kind}</small>`:''}</span></button>`).join('');
    check.disabled=st.checked;
    const right=AFTER.filter((l,i)=>st.picked[i]===l.changed).length;
    ui.say(st.why||(st.checked?`다섯 문장 중 ${right}문장을 바르게 판단했습니다. 문장을 누르면 이유가 나옵니다.`:`요청하지 않은 변화가 있는 문장으로 ${st.picked.filter(Boolean).length}개를 골랐습니다.`),st.checked&&!st.why&&right===AFTER.length?'good':'');
   }
   ui.body.addEventListener('click',e=>{const b=e.target.closest('#s62-rc-lines .s62-line');if(!b)return;const i=Number(b.dataset.i);
    if(st.checked)st.why=`${AFTER[i].kind}: ${AFTER[i].why}`;else st.picked[i]=!st.picked[i];draw()});draw();
  }});
})();
