/* 5주차 오후, 지식 기반 인공지능 도구 활용 Part 2: activity slides. Documents and answers are examples written for these activities, except the scanned text and the record sheet, which come from the slides. */
(()=>{
 'use strict';
 const L=window.ceLabs;if(!L)return;const esc=L.esc;
 L.style(`.md-lab .s52-docs{display:grid;gap:.5em}
.md-lab .s52-doc{display:grid;gap:.3em;padding:.45em .7em;border:1px solid #c9d3ec;border-radius:.5em;background:#fff}
.md-lab .s52-doc label{display:flex;align-items:center;gap:.5em;font-size:.95em;font-weight:800;color:#2c478f;cursor:pointer}
.md-lab .s52-doc label em{margin-left:auto;font-style:normal;font-size:.82em;font-weight:400;color:#6b7896}
.md-lab .s52-doc div{display:grid;grid-template-columns:auto 1fr;gap:.5em;padding:.2em .5em;border-radius:.35em;font-size:.86em;line-height:1.35}
.md-lab .s52-doc div b{color:#3f5dae}.md-lab .s52-doc div[data-found=true]{background:#ebf0fc;outline:1px solid #3f5dae}
.md-lab .s52-doc[data-on=false]{border-style:dashed;background:#f6f8fd}.md-lab .s52-doc[data-on=false] div{color:#8a94ab}.md-lab .s52-doc[data-on=false] div b{color:#8a94ab}
.md-lab .s52-doc mark{padding:0 .15em;border-radius:.2em;background:#ffe08a;color:inherit}
.md-lab .s52-qs{display:grid;gap:.4em}
.md-lab .s52-q,.md-lab .s52-rule{padding:.4em .8em;border:1px solid #9fb0dc;border-radius:.5em;background:#fff;color:#1c2c4c;font-size:.9em;line-height:1.35;text-align:left;cursor:pointer}
.md-lab .s52-answer{display:grid;gap:.35em;padding:.55em .8em;border:1px solid #d5ddf1;border-radius:.5em;background:#fff;font-size:.92em;line-height:1.4}
.md-lab .s52-answer b{color:#3f5dae}
.md-lab .s52-answer em{font-style:normal;margin-right:.4em;padding:0 .45em;border-radius:.3em;font-size:.82em;font-weight:800;white-space:nowrap}
.md-lab .s52-answer em[data-tag=doc]{background:#ebf0fc;color:#2c478f}.md-lab .s52-answer em[data-tag=own]{background:#fff3cf;color:#8a5a00}.md-lab .s52-answer em[data-tag=none]{background:#fdeceb;color:#b5372f;margin:0 0 0 .3em}
.md-lab .s52-rules{display:grid;gap:.45em}
.md-lab .s52-src{display:grid;gap:.35em;margin:0;padding:0;list-style:none;font-size:.88em;line-height:1.35}
.md-lab .s52-src li{display:grid;grid-template-columns:auto 1fr;gap:.4em;padding:.3em .55em;border:1px solid #d5ddf1;border-radius:.4em;background:#fff}.md-lab .s52-src b{color:#3f5dae}
.md-lab p.s52-note{font-size:.8em;line-height:1.4;color:#52607f}
.md-lab p.s52-line{font-size:.88em;line-height:1.4}
.md-lab .s52-sents{display:grid;gap:.45em}
.md-lab .s52-sent{display:flex;align-items:baseline;justify-content:space-between;gap:.6em;padding:.5em .8em;border:1px solid #9fb0dc;border-radius:.5em;background:#fff;color:#1c2c4c;font-size:.98em;line-height:1.35;text-align:left;cursor:pointer}
.md-lab .s52-sent i{flex:none;font-style:normal;font-weight:800;color:#3f5dae}
.md-lab .s52-ctx{display:grid;gap:.3em;padding:.6em .8em;border:1px solid #d5ddf1;border-radius:.5em;background:#fff;font-size:.95em;line-height:1.4}
.md-lab .s52-ctx span{color:#6b7896}.md-lab .s52-ctx strong{padding:.15em .4em;border-radius:.3em;background:#fff3cf;font-weight:400;color:#1c2c4c}
.md-lab .s52-ctx small{color:#52607f;font-size:.82em}
.md-lab .s52-scan{display:grid;gap:.6em}
.md-lab .s52-scanrow{display:flex;gap:.2em}
.md-lab .s52-ch{display:grid;justify-items:center;align-content:start;width:1.75em;height:2.35em;padding:.1em 0 0;border:1px solid #c9d3ec;border-radius:.35em;background:#fff;color:#1c2c4c;font-size:1.45em;line-height:1.3;cursor:pointer}
.md-lab .s52-ch small{font-size:.5em;line-height:1.2;font-weight:800;color:#b5372f}.md-lab .s52-gap{width:.7em}
.md-lab .s52-fields{display:grid;gap:.4em}
.md-lab .s52-field{display:grid;grid-template-columns:6.4em 1fr;align-items:center;gap:.6em;padding:.6em .9em;border:1px solid #9fb0dc;border-radius:.5em;background:#fff;color:#1c2c4c;line-height:1.3;text-align:left;cursor:pointer}
.md-lab .s52-field b{color:#2c478f;font-size:1em}.md-lab .s52-field span{display:grid;font-size:.92em}.md-lab .s52-field small{font-size:.92em;color:#6b7896}
.md-lab .s52-sits{display:grid;gap:.7em;margin:0;padding:0;list-style:none}
.md-lab .s52-sits li{display:grid;gap:.2em;padding:.5em .8em;border:1px solid #c2413b;border-left-width:.35em;border-radius:.5em;background:#fdeceb;font-size:.98em;line-height:1.45}
.md-lab .s52-sits li[data-ok=true]{border-color:#1f8a5b;background:#e3f5ec}.md-lab .s52-sits em{font-style:normal;font-weight:800;color:#b5372f}.md-lab .s52-sits li[data-ok=true] em{color:#16794c}`);

 // Toy retrieval over whichever documents are switched on: the two passages sharing the most words with the question are cited.
 const STEMS=['광합성','엽록체','포도당','단백질','이산화','식물','양분','저장','일어','녹말','급식','반찬'],SHORT=['빛','물','잎'];
 const ENDING=/^(은|는|이|가|을|를|에|의|와|과|로|으로|도|만|에서|에는|에서는|에도)?$/;
 const stem=token=>STEMS.find(s=>token.startsWith(s))||SHORT.find(s=>token.startsWith(s)&&ENDING.test(token.slice(1)));
 const stemsOf=text=>new Set(text.split(/[^가-힣A-Za-z0-9]+/).map(stem).filter(Boolean));
 const marked=(text,hit)=>text.split(/([^가-힣A-Za-z0-9]+)/).map(part=>hit.has(stem(part))?`<mark>${esc(part)}</mark>`:esc(part)).join('');
 const DOCS=[
  {id:'el',name:'초등 과학 읽기 자료',ps:['식물이 빛, 물, 이산화 탄소를 이용해 스스로 양분을 만드는 것을 광합성이라고 합니다.','광합성은 주로 잎에서 일어납니다.']},
  {id:'mid',name:'중학교 과학 읽기 자료',ps:['식물은 엽록체에서 빛에너지를 이용해 이산화 탄소와 물로 포도당을 만들며, 이 과정을 광합성이라고 합니다.','광합성으로 만든 포도당은 녹말로 바뀌어 저장됩니다.']},
  {id:'lunch',name:'급식 안내문',ps:['이번 주 급식에는 식물성 단백질 반찬이 나옵니다.','급식실은 12시부터 엽니다.']}];
 const PASSAGES=DOCS.flatMap(d=>d.ps.map(t=>({doc:d.id,t,stems:stemsOf(t)})));
 const QUESTIONS=[['식물은 광합성으로 무엇을 만드나요?',[0,2]],['광합성은 식물의 어디에서 일어나나요?',[1,2]],['만든 양분은 어떻게 저장되나요?',[3]]];
 L.add('sourceSwap','custom',{
  hint:'노트북에 올릴 자료를 바꾸면서 같은 질문을 해 봅니다. 답은 <b>올린 자료에서 찾은 두 문장</b>으로만 만들어집니다. 자료와 답은 이 활동을 위해 만든 예시입니다.',
  body:`<div class="md-split" style="--split:1.3fr 1fr"><div class="md-panel"><h3>노트북에 올릴 자료</h3><div class="s52-docs" id="s52-sw-docs"></div></div>
   <div class="md-panel"><h3>질문</h3><div class="s52-qs">${QUESTIONS.map((q,i)=>`<button type="button" class="s52-q" data-q="${i}">${q[0]}</button>`).join('')}</div><h3>찾은 문장으로 만든 답</h3><div class="s52-answer" id="s52-sw-answer"></div></div></div>`,
  state:()=>({on:{el:true,mid:false,lunch:false},q:0}),
  render(ui,st,reset){
   ui.action('처음부터',reset);
   function draw(){
    const [question,answers]=QUESTIONS[st.q],hit=stemsOf(question),score=PASSAGES.map(p=>st.on[p.doc]?[...p.stems].filter(s=>hit.has(s)).length:0);
    const found=score.map((s,i)=>[s,i]).filter(([s])=>s>0).sort((a,b)=>b[0]-a[0]||a[1]-b[1]).slice(0,2).map(([,i])=>i),from=new Set(found.map(i=>PASSAGES[i].doc));
    ui.all('.s52-q').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.q)===st.q)));
    let n=0;ui.q('#s52-sw-docs').innerHTML=DOCS.map(d=>`<div class="s52-doc" data-on="${st.on[d.id]}"><label><input type="checkbox" data-doc="${d.id}" ${st.on[d.id]?'checked':''}>${d.name}<em>${st.on[d.id]?'올림':'올리지 않음'}</em></label>${d.ps.map(t=>{const i=n++;return `<div data-found="${found.includes(i)}"><b>[${i+1}]</b><span>${st.on[d.id]?marked(t,hit):esc(t)}</span></div>`}).join('')}</div>`).join('');
    ui.q('#s52-sw-answer').innerHTML=found.length?found.map(i=>`<div>${esc(PASSAGES[i].t)} <b>[${i+1}]</b></div>`).join(''):`<div>${Object.values(st.on).some(Boolean)?'올린 자료에서 찾을 수 없습니다.':'올린 자료가 없습니다.'}</div>`;
    if(!Object.values(st.on).some(Boolean))ui.say('올린 자료가 없으면 근거로 삼을 문장도 없습니다. 자료를 하나 이상 올려 보세요.');
    else if(!found.length)ui.say('올린 자료에 질문과 관련된 부분이 없습니다. 자료에 없는 내용은 그대로 답의 한계가 됩니다.','bad');
    else if(from.size===1&&from.has('lunch'))ui.say('수업과 관계없는 자료의 문장이 근거가 되었습니다. 잘못 올린 자료는 그대로 답의 한계가 됩니다.','bad');
    else if(!found.some(i=>answers.includes(i)))ui.say('올린 자료에 이 질문의 답이 없어 낱말이 겹친 다른 문장이 근거로 쓰였습니다. 필요한 자료를 더 올려야 합니다.','bad');
    else if(from.has('el')&&from.has('mid'))ui.say('수준이 다른 두 자료의 문장이 한 답에 섞였습니다. 교사가 자료의 범위를 정해야 학년에 맞는 답을 얻기 쉽습니다.','bad');
    else if(from.has('mid'))ui.say('중학교 자료의 표현을 따른 답입니다. 같은 질문을 해도 올린 자료가 바뀌면 답도 바뀝니다.');
    else ui.say('초등 자료의 표현을 따른 답입니다. 올린 자료를 바꾸어 같은 질문을 다시 해 보세요.','good');
   }
   ui.body.addEventListener('change',e=>{const doc=e.target.dataset.doc;if(doc){st.on[doc]=e.target.checked;draw()}});
   ui.body.addEventListener('click',e=>{const b=e.target.closest('.s52-q');if(b){st.q=Number(b.dataset.q);draw()}});draw();
  }});

 // The five sentences are those on the slide before. The sample answer changes with the sentences that are switched on.
 const SCOPE=[['only','올린 자료에 있는 내용만으로 답해 줘.'],['none','자료에서 찾을 수 없는 내용은 자료에 없다고 답해 줘.'],['cite','각 문장 끝에 근거가 된 자료의 위치를 표시해 줘.'],['split','자료의 표현과 네 설명을 구분해서 보여 줘.'],['ask','답을 주기 전에 학생이 스스로 생각할 질문을 하나 먼저 해 줘.']];
 const SCOPE_SRC=['이 단원에서는 식물이 빛, 물, 이산화 탄소를 이용해 양분을 만드는 과정을 배웁니다.','광합성이 주로 잎에서 일어남을 관찰 결과로 설명합니다.','평가는 관찰 기록장으로 합니다.'];
 L.add('scopeBuild','custom',{
  hint:'요청문에 넣을 문장을 켜고 끄며 <b>답이 어떻게 달라지는지</b> 봅니다. 질문에는 자료에 없는 실험 준비물이 들어 있습니다. 자료와 답은 이 활동을 위해 만든 예시입니다.',
  body:`<div class="md-split" style="--split:1fr .82fr 1.12fr"><div class="s52-rules">${SCOPE.map(([id,t])=>`<button type="button" class="s52-rule" data-rule="${id}">${t}</button>`).join('')}</div>
   <div class="md-panel"><h3>올린 자료, 단원 안내 예시</h3><ul class="s52-src">${SCOPE_SRC.map((t,i)=>`<li><b>[${i+1}]</b>${t}</li>`).join('')}</ul><h3>질문</h3><p class="s52-line">광합성이 무엇인지와 실험 준비물을 알려 줘.</p></div>
   <div class="md-panel"><h3>답</h3><div class="s52-answer" id="s52-sc-answer"></div><p class="s52-note" id="s52-sc-note" style="margin-top:auto"></p></div></div>`,
  state:()=>({only:false,none:false,cite:false,split:false,ask:false}),
  render(ui,st,reset){
   ui.action('처음부터',reset);
   function draw(){
    ui.all('.s52-rule').forEach(b=>b.setAttribute('aria-pressed',String(st[b.dataset.rule])));
    const lines=[];
    if(st.ask)lines.push(['ask','먼저 생각해 볼까요? 식물은 양분을 어디에서 얻을까요?']);
    lines.push(['doc','광합성은 식물이 빛, 물, 이산화 탄소를 이용해 양분을 만드는 과정입니다.',1],['doc','광합성은 주로 잎에서 일어납니다.',2]);
    if(!st.only)lines.push(['own','광합성은 엽록체에서 일어나며 포도당이 만들어집니다.']);
    lines.push(st.none?['none','실험 준비물은 올린 자료에서 찾을 수 없습니다.']:st.only?['near','실험 준비물은 관찰 기록장입니다.',3]:['own','실험 준비물은 알코올램프, 비커, 아이오딘 용액입니다.']);
    ui.q('#s52-sc-answer').innerHTML=lines.map(([kind,text,at])=>`<div>${st.split&&kind!=='ask'&&kind!=='none'?`<em data-tag="${kind==='own'?'own':'doc'}">${kind==='own'?'설명':'자료'}</em>`:''}${esc(text)}${st.cite&&at?` <b>[${at}]</b>`:''}${st.cite&&kind==='own'?'<em data-tag="none">인용 없음</em>':''}</div>`).join('');
    const outside=lines.filter(l=>l[0]==='own').length,near=lines.some(l=>l[0]==='near');
    ui.q('#s52-sc-note').textContent=`자료 밖의 문장 ${outside}개, 근거 위치 ${st.cite?'표시함':'표시 없음'}, 자료에 없는 준비물은 ${st.none?'없다고 답함':near?'가까운 내용으로 답함':'만들어서 답함'}`;
    if(near)ui.say(st.cite?'준비물 문장에 인용이 붙었지만 인용한 곳은 평가 방법입니다. 자료에 없는 내용을 가까운 내용으로 답한 엉뚱한 인용입니다.':'자료에 없는 준비물을 자료의 가까운 내용으로 답했습니다. 자료에 없다고 답하게 하는 문장을 더해 보세요.','bad');
    else if(outside)ui.say(st.cite?`인용이 없는 문장 ${outside}개가 자료 밖의 내용입니다. 범위를 정하는 문장을 더해 보세요.`:'자료 밖의 내용이 섞였지만 근거 위치가 없어 어느 문장인지 가려내기 어렵습니다.','bad');
    else ui.say(Object.values(st).every(Boolean)?'다섯 문장을 모두 넣었습니다. 자료 밖의 내용이 섞이는 것을 줄였지만 인용과 원문의 일치는 계속 확인합니다.':'자료 안의 내용으로 답하고 없는 내용은 없다고 답했습니다. 나머지 문장도 켜서 달라지는 점을 확인하세요.','good');
   }
   ui.body.addEventListener('click',e=>{const b=e.target.closest('.s52-rule');if(b){st[b.dataset.rule]=!st[b.dataset.rule];draw()}});draw();
  }});

 // Five answer sentences and the passages they cite. Three do not match once the passage and its neighbours are read.
 const SAME='답의 문장과 원문이 같은 내용입니다.';
 const SOURCE=[['자료의 첫 문단입니다.','강낭콩은 4월 둘째 주에 화분에 심습니다.','화분 하나에 씨앗을 세 개씩 심습니다.'],['화분은 교실 뒤쪽 선반에 둡니다.','물은 매일 줍니다.','다만 싹이 튼 뒤에는 흙이 말랐을 때만 줍니다.'],
  ['싹이 트는 데에는 일주일쯤 걸립니다.','싹이 트면 화분의 절반만 창가로 옮깁니다.','나머지 절반은 그대로 두고 자라는 모습을 비교합니다.'],['비교한 결과는 모둠별로 정리합니다.','관찰 기록은 일주일에 두 번, 화요일과 금요일에 씁니다.','기록에는 날짜와 날씨를 함께 적습니다.']];
 const CLAIMS=[
  {t:'강낭콩은 4월 둘째 주에 심습니다.',at:1,same:true,why:SAME},
  {t:'물은 매일 줍니다.',at:2,same:false,why:'인용한 문장만 보면 같지만 뒤 문장에 조건이 있습니다. 싹이 튼 뒤에는 흙이 말랐을 때만 준다고 고칩니다.'},
  {t:'싹이 트면 모든 화분을 창가로 옮깁니다.',at:3,same:false,why:'원문은 절반만, 답은 모든 화분입니다. 범위가 바뀌었으므로 절반만 옮긴다고 고칩니다.'},
  {t:'관찰 기록은 일주일에 두 번 씁니다.',at:4,same:true,why:SAME},
  {t:'키는 자로 재어 센티미터로 적습니다.',at:4,same:false,why:'인용한 곳에는 키를 재는 방법이 없습니다. 엉뚱한 인용이므로 지우거나 교사가 근거를 따로 확인합니다.'}];
 L.add('citeCheck','custom',{
  hint:'답의 문장을 누르면 인용한 원문이 <b>앞뒤 문맥</b>과 함께 열립니다. 답의 문장이 원문과 일치하는지 판단하세요. 자료와 답은 이 활동을 위해 만든 예시입니다.',
  body:`<div class="md-split" style="--split:1fr 1.15fr"><div class="md-panel"><h3>자료 기반 도구의 답</h3><div class="s52-sents" id="s52-ct-sents"></div><p class="s52-note" id="s52-ct-log" style="margin-top:auto"></p></div>
   <div class="md-panel"><h3 id="s52-ct-title"></h3><div class="s52-ctx" id="s52-ct-ctx"></div><div class="md-choices" style="--n:2"><button type="button" class="md-choice" data-j="same">원문과 일치</button><button type="button" class="md-choice" data-j="diff">원문과 다름</button></div><p class="md-why" id="s52-ct-why"></p></div></div>`,
  state:()=>({sel:0,judged:[]}),
  render(ui,st,reset){
   ui.action('처음부터',reset);
   const right=i=>(st.judged[i]==='same')===CLAIMS[i].same;
   function draw(){
    const c=CLAIMS[st.sel],done=st.judged[st.sel],[before,quote,after]=SOURCE[c.at-1],count=st.judged.filter(Boolean).length;
    ui.q('#s52-ct-sents').innerHTML=CLAIMS.map((x,i)=>`<button type="button" class="s52-sent" data-i="${i}" aria-pressed="${i===st.sel}" ${st.judged[i]?`data-result="${right(i)?'right':'wrong'}"`:''}><span>${esc(x.t)}</span><i>[${x.at}]</i></button>`).join('');
    ui.q('#s52-ct-title').textContent=`인용 [${c.at}]의 원문 위치`;
    ui.q('#s52-ct-ctx').innerHTML=`<small>올린 자료, 강낭콩 기르기 수업 안내 예시</small><span>${esc(before)}</span><strong>${esc(quote)}</strong><span>${esc(after)}</span>`;
    ui.all('.md-choice[data-j]').forEach(b=>{b.disabled=!!done;b.removeAttribute('data-result');if(done){if((b.dataset.j==='same')===c.same)b.dataset.result='right';else if(b.dataset.j===done)b.dataset.result='wrong'}});
    const why=ui.q('#s52-ct-why');why.hidden=!done;why.textContent=done?`${right(st.sel)?'맞게 판단했습니다.':'다시 살펴볼 문장입니다.'} ${c.why}`:'';
    ui.q('#s52-ct-log').textContent=`기록: 확인한 문장 ${count} / ${CLAIMS.length}, 원문과 다른 문장 ${CLAIMS.filter((x,i)=>st.judged[i]&&!x.same).length}개`;
    if(count===CLAIMS.length)ui.say(`다섯 문장 가운데 ${CLAIMS.filter((_,i)=>right(i)).length}개를 맞게 판단했습니다. 인용이 있어도 세 문장은 원문과 달랐습니다. 불일치와 수정 내용을 기록해 둡니다.`,'good');
    else if(done)ui.say(right(st.sel)?'맞았습니다. 다른 문장도 확인해 보세요.':'다시 볼 문장입니다. 다른 문장도 확인해 보세요.',right(st.sel)?'good':'bad');
    else ui.say('인용한 문장만 보지 말고 앞뒤 문장까지 읽은 뒤 판단하세요.');
   }
   ui.body.addEventListener('click',e=>{
    const sent=e.target.closest('.s52-sent'),judge=e.target.closest('.md-choice[data-j]');
    if(sent)st.sel=Number(sent.dataset.i);else if(judge&&!judge.disabled)st.judged[st.sel]=judge.dataset.j;else return;
    draw();
   });draw();
  }});

 // The four lines and their recognised text are the ones on the slide before.
 const SCAN=[['인공지능 윤리','안공자능 윤리',{0:'인',2:'지'}],['인공지능 프로그래밍','안공자능 프로그래밍',{0:'인',2:'지'}],['생성형 AI의 이해','생성형 內의 이해',{4:'AI'}],['생성형 AI란?','생성형 시란?',{4:'AI'}]];
 const SCAN_TOTAL=SCAN.reduce((n,row)=>n+Object.keys(row[2]).length,0),SCAN_WORDS=['인공지능','AI','생성형','윤리'];
 L.add('scanErrors','custom',{
  hint:'교재 목차의 스캔본을 텍스트로 바꾼 실제 결과입니다. 원래 표기와 다른 <b>글자를 눌러</b> 모두 찾고, 이 텍스트에서 낱말을 찾으면 어떻게 되는지 확인하세요.',
  body:`<div class="md-split" style="--split:1.15fr 1fr"><div class="md-panel"><h3>텍스트로 바뀐 결과</h3><div class="s52-scan" id="s52-sn-rows"></div><p class="s52-note" style="margin-top:auto">표와 그림에서 가져온 답은 원본을 열어 한 칸씩 대조합니다.</p></div>
   <div class="md-panel"><h3>교재의 원래 표기</h3><ul class="md-list" id="s52-sn-orig"></ul><h3>이 낱말을 찾으면</h3><div class="md-chips">${SCAN_WORDS.map(w=>`<button type="button" class="md-chip" data-word="${w}">${w}</button>`).join('')}</div><ul class="md-list" id="s52-sn-hits"></ul><p class="s52-line" id="s52-sn-lost"></p></div></div>`,
  state:()=>({found:[],word:'인공지능',miss:false}),
  render(ui,st,reset){
   ui.action('처음부터',reset);
   function draw(){
    ui.q('#s52-sn-rows').innerHTML=SCAN.map(([,text,wrong],r)=>`<div class="s52-scanrow">${[...text].map((ch,i)=>{const key=r+'-'+i,hit=st.found.includes(key);
     return ch===' '?'<span class="s52-gap"></span>':`<button type="button" class="s52-ch" data-key="${key}" ${hit?'data-result="wrong"':''} aria-label="${esc(ch)}">${esc(ch)}<small>${hit?wrong[i]:''}</small></button>`}).join('')}</div>`).join('');
    ui.q('#s52-sn-orig').innerHTML=SCAN.map(([orig,,wrong],r)=>{const all=Object.keys(wrong).length,got=st.found.filter(k=>k.startsWith(r+'-')).length;return `<li><span>${esc(orig)}</span><b>틀린 글자 ${got} / ${all}</b></li>`}).join('');
    ui.all('[data-word]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.word===st.word)));
    const before=SCAN.filter(row=>row[0].includes(st.word)).length,after=SCAN.filter(row=>row[1].includes(st.word)).length;
    ui.q('#s52-sn-hits').innerHTML=`<li><span>원래 표기에서 찾은 줄</span><b>${before}줄</b></li><li><span>바뀐 텍스트에서 찾은 줄</span><b>${after}줄</b></li>`;
    ui.q('#s52-sn-lost').textContent=before>after?`틀린 글자 때문에 ${before-after}줄을 찾지 못합니다. 도구가 찾지 못한 내용은 답에도 반영되지 않습니다.`:'이 낱말에는 틀린 글자가 없어 그대로 찾습니다.';
    const n=st.found.length;
    if(st.miss)ui.say('이 글자는 원래 표기와 같습니다. 오른쪽의 원래 표기와 한 글자씩 대조해 보세요.','bad');
    else if(n===SCAN_TOTAL)ui.say('틀린 글자 여섯 개를 모두 찾았습니다. 읽기 어려운 자료는 그대로 답의 한계가 되므로 표와 그림에서 가져온 답은 원본과 대조합니다.','good');
    else ui.say(`틀린 글자 ${n} / ${SCAN_TOTAL}개를 찾았습니다. 문자 인식을 거치며 틀린 글자를 눌러 보세요.`);
   }
   ui.body.addEventListener('click',e=>{
    const ch=e.target.closest('.s52-ch'),word=e.target.closest('[data-word]');
    if(ch){const [r,i]=ch.dataset.key.split('-');st.miss=!(i in SCAN[r][2]);if(!st.miss&&!st.found.includes(ch.dataset.key))st.found.push(ch.dataset.key)}
    else if(word){st.word=word.dataset.word;st.miss=false}else return;
    draw();
   });draw();
  }});

 L.add('roleSort','sort',{hint:'수업 자료를 만드는 일곱 가지 일을 <b>사람</b>과 <b>AI</b> 가운데 누가 맡을지 놓아 봅니다.',
  bins:[{id:'human',label:'사람',sub:'목표를 정하고 결과를 판단'},{id:'ai',label:'AI',sub:'초안과 대안을 빠르게 제시'}],cards:[
  {id:'a',label:'차시 목표와 기준 정하기',answer:'human',why:'목표 설정 단계에서 사람이 목표와 기준을 결정합니다.'},
  {id:'b',label:'도입 활동의 대안 여러 개 내놓기',answer:'ai',why:'초안 생성 단계에서 AI가 대안과 초안을 제시합니다.'},
  {id:'c',label:'학습지의 첫 초안 쓰기',answer:'ai',why:'초안 생성 단계에서 AI가 대안과 초안을 제시합니다.'},
  {id:'d',label:'초안의 사실과 학년 수준 점검하기',answer:'human',why:'검토와 수정 단계에서 사람이 사실, 수준, 적합성을 점검합니다.'},
  {id:'e',label:'우리 학급에 맞는지 살펴 고치기',answer:'human',why:'검토와 수정 단계에서 사람이 적합성을 점검합니다.'},
  {id:'f',label:'수업에 쓸지 결정하기',answer:'human',why:'최종 판단 단계에서 사람이 사용 여부를 결정합니다.'},
  {id:'g',label:'결과에 책임지기',answer:'human',why:'최종 판단과 책임은 사람에게 있습니다.'}]});

 L.add('useLevelSort','sort',{hint:'학생이 밝힌 AI 사용 방식이 다섯 수준 가운데 어디에 해당하는지 놓아 봅니다. 학생의 말은 이 활동을 위해 만든 예시입니다.',
  bins:[{id:'l1',label:'1 AI 사용 없음'},{id:'l2',label:'2 계획'},{id:'l3',label:'3 협업'},{id:'l4',label:'4 전면 사용'},{id:'l5',label:'5 탐구'}],cards:[
  {id:'a',label:'모든 단계를 AI 없이 스스로 했어요',answer:'l1',why:'모든 단계를 학생이 스스로 수행하는 수준입니다.'},
  {id:'b',label:'AI로 조사할 질문을 찾고 글은 직접 썼어요',answer:'l2',why:'아이디어 탐색과 조사에 쓰고 결과물은 학생이 작성하는 수준입니다.'},
  {id:'c',label:'AI와 초안을 쓰고 틀린 곳을 검토해 고쳤어요',answer:'l3',why:'초안 작성에 쓰고 학생이 비판적으로 검토하는 수준입니다.'},
  {id:'d',label:'직접 쓴 글을 AI로 다듬고 바뀐 곳을 검토했어요',answer:'l3',why:'다듬기에 쓰고 학생이 비판적으로 검토하는 수준입니다.'},
  {id:'e',label:'과제 전반에 AI를 쓰고 이끈 과정을 평가받았어요',answer:'l4',why:'과제 전반에 쓰며 AI를 이끌고 평가하는 능력을 보는 수준입니다.'},
  {id:'f',label:'AI를 창의적으로 써서 새로운 접근을 탐구했어요',answer:'l5',why:'AI를 창의적으로 활용해 새로운 접근을 탐구하는 수준입니다.'}]});

 const RESPONSES=['확인 항목을 미리 정하기','먼저 자기 생각을 적고 묻기','검토 범위를 좁혀 꼼꼼히 보기','사용한 사람이 최종 책임지기'];
 L.add('collabQuiz','quiz',{hint:'협업에서 사람이 판단을 건너뛰는 순간입니다. 알맞은 <b>대응</b>을 골라 봅니다. 상황은 이 활동을 위해 만든 예시입니다.',closing:'협업이 편리해질수록 사람이 판단을 건너뛰는 순간이 생기기 쉽습니다.',questions:[
  {q:'AI가 만든 학습지를 검토 없이 그대로 인쇄했습니다.',short:'과도한 의존',choices:RESPONSES,columns:2,answer:0,why:'과도한 의존입니다. 확인 항목을 미리 정해 두고 검토한 뒤에 씁니다.'},
  {q:'AI가 처음 내놓은 활동을 본 뒤로 다른 대안이 떠오르지 않습니다.',short:'첫 제안에 고정',choices:RESPONSES,columns:2,answer:1,why:'첫 제안에 고정된 모습입니다. 먼저 자기 생각을 적은 뒤에 묻습니다.'},
  {q:'시간이 부족해 긴 결과를 훑어보기만 하고 넘어갔습니다.',short:'형식적 검토',choices:RESPONSES,columns:2,answer:2,why:'형식적 검토입니다. 검토 범위를 좁혀 그 부분을 꼼꼼히 봅니다.'},
  {q:'자료의 오류를 지적받자 도구가 틀린 것이라고만 설명했습니다.',short:'책임의 흐려짐',choices:RESPONSES,columns:2,answer:3,why:'책임이 흐려진 모습입니다. 사용한 사람에게 최종 책임이 있습니다.'},
  {q:'2026학년도 학교생활기록부 기재요령은 AI로 생성한 자료를 서술형 항목에 그대로 입력하는 것을 허용한다.',short:'학교생활기록부와 AI 생성 자료',choices:['그렇다','아니다'],answer:1,why:'그대로 입력하는 행위를 금지합니다. 윤문 등의 보조 수단으로 쓴 경우에도 최종 입력 전에 허위나 과장이 없는지 확인해야 합니다.'}]});

 // Items and written examples are those of the record sheet on the slide before.
 const FIELDS=[['tool','사용 도구','Gemini Notebook, 학교 계정'],['date','날짜','연수 5주차, 과학 3차시'],['input','입력 요약','교육과정 한 단원, 학습지 요청'],['result','결과','활동 세 개의 학습지 초안'],['edit','수정 내용','범위 밖 실험 삭제, 용어 수정'],['proof','확인한 근거','성취기준 원문']];
 const LATER=[['학습지에서 오류가 발견되었습니다. 어떤 도구와 요청으로 만든 자료인가요?',['tool','input']],['같은 결과를 다시 확인하려고 합니다. 언제 만든 어떤 결과인가요?',['date','result']],['동료 교사가 이 자료를 쓰려고 합니다. 무엇을 확인하고 고쳤나요?',['edit','proof']]];
 L.add('recordFields','custom',{
  hint:'기록지의 여섯 항목을 켜고 끄며, 나중에 생기는 <b>세 가지 상황</b>에 기록으로 답할 수 있는지 확인합니다. 작성 예시는 앞 슬라이드의 표를 옮긴 것입니다.',
  body:`<div class="md-split" style="--split:1fr 1.25fr"><div class="md-panel"><h3>기록지에 적은 항목</h3><div class="s52-fields" id="s52-rc-fields"></div></div>
   <div class="md-panel"><h3>나중에 생기는 상황</h3><ul class="s52-sits" id="s52-rc-sits"></ul></div></div>`,
  state:()=>({on:['result']}),
  render(ui,st,reset){
   ui.action('처음부터',reset);
   const name=id=>FIELDS.find(f=>f[0]===id);
   function draw(){
    ui.q('#s52-rc-fields').innerHTML=FIELDS.map(([id,label,example])=>{const on=st.on.includes(id);return `<button type="button" class="s52-field" data-field="${id}" aria-pressed="${on}"><b>${label}</b><span>${on?esc(example):'<small>적지 않음</small>'}</span></button>`}).join('');
    let ok=0;ui.q('#s52-rc-sits').innerHTML=LATER.map(([question,need])=>{const lack=need.filter(id=>!st.on.includes(id)),fine=!lack.length;if(fine)ok++;
     return `<li data-ok="${fine}"><span>${question}</span><em>${fine?`답할 수 있음: ${need.map(id=>name(id)[2]).join(' / ')}`:`답하기 어려움, 빠진 항목: ${lack.map(id=>name(id)[1]).join(', ')}`}</em></li>`}).join('');
    ui.say(ok===3?'세 상황 모두 기록으로 답할 수 있습니다. 결과 전체보다 다시 찾고 확인할 수 있는 정보를 중심으로 남깁니다.':`세 상황 가운데 ${ok}개에 답할 수 있습니다. 빠진 항목을 눌러 기록해 보세요.`,ok===3?'good':'');
   }
   ui.body.addEventListener('click',e=>{const b=e.target.closest('.s52-field');if(!b)return;const id=b.dataset.field;st.on=st.on.includes(id)?st.on.filter(x=>x!==id):[...st.on,id];draw()});draw();
  }});

 L.add('uploadSort','sort',{hint:'일곱 가지 자료를 자료 기반 도구에 올려도 되는지 나누어 봅니다. 자료를 올리는 일은 자료를 외부 서비스에 복사하는 일입니다.',
  bins:[{id:'ok',label:'올려도 됨',sub:'이용 조건이 분명한 공개 문서'},{id:'check',label:'확인한 뒤 결정',sub:'이용 조건, 공동 작성자, 공개 범위'},{id:'no',label:'올리지 않음',sub:'학생 개인정보가 담긴 자료'}],cards:[
  {id:'a',label:'고시된 교육과정 문서',answer:'ok',why:'공개된 공공 문서로 실습 자료로 적합합니다.'},
  {id:'b',label:'동료와 함께 만든 학습지',answer:'check',why:'교사가 만든 자료는 공동 작성자와 공개 범위를 확인합니다.'},
  {id:'c',label:'교과서 파일',answer:'check',why:'교과서와 유료 자료는 이용 조건을 확인하기 전에는 올리지 않습니다.'},
  {id:'d',label:'유료 문제집 파일',answer:'check',why:'교과서와 유료 자료는 이용 조건을 확인하기 전에는 올리지 않습니다.'},
  {id:'e',label:'학생 이름과 성적이 적힌 표',answer:'no',why:'학생의 이름, 번호, 성적은 AI 도구에 입력하지 않습니다.'},
  {id:'f',label:'이름을 지운 상담 기록',answer:'no',why:'이름을 지워도 학급, 특이 사항, 사건이 결합되면 누구인지 알 수 있습니다.'},
  {id:'g',label:'학생 얼굴이 나온 활동 사진',answer:'no',why:'학생의 사진은 AI 도구에 입력하지 않습니다.'}]});
})();
