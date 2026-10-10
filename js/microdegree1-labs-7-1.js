/* 7주차 오전, 공정성과 편향성 및 책임 있는 활용 Part 2: activity slides. The roster, the second request, the scenes and the rule sentences are written for these activities. */
(()=>{
 'use strict';
 const L=window.ceLabs;if(!L)return;const esc=L.esc;
 L.style(`.md-lab .s71-sent{display:flex;flex-wrap:wrap;align-items:center;gap:.4em .3em;font-size:1.1em;line-height:1.3}
.md-lab .s71-seg{padding:.2em .5em;border:1px dashed #9fb0dc;border-radius:.4em;background:#fff;color:#1c2c4c;cursor:pointer}.md-lab .s71-seg[aria-pressed=true]{border-style:solid;border-color:#f0a202}
.ce-lab.md-lab .s71-left{font-size:1em;line-height:1.75}.md-lab .s71-blank{display:inline-block;height:1.05em;vertical-align:-.18em;border-radius:.25em;background:repeating-linear-gradient(135deg,#c9d3ec 0 .3em,#e4e9f6 .3em .6em)}
.ce-lab.md-lab .s71-small{font-size:.84em;line-height:1.4}.md-lab .s71-tight{font-size:.84em}
.md-lab .s71-school{display:grid;grid-template-columns:2.4em repeat(6,minmax(0,1fr));gap:.5em;align-items:center;margin:auto 0}
.md-lab .s71-school>b{color:#52607f;font-size:.8em;font-weight:700;text-align:center}
.md-lab .s71-class{display:grid;grid-template-columns:repeat(4,1fr);gap:.24em;padding:.38em;border:1px solid #d5ddf1;border-radius:.45em;background:#fff}
.md-lab .s71-class i{aspect-ratio:1;border-radius:50%;background:#e1e7f5}.md-lab .s71-class i[data-on=true]{background:#3f5dae}.md-lab .s71-class i[data-one=true]{background:#f0a202;box-shadow:0 0 0 .13em #fff,0 0 0 .27em #f0a202}
.md-lab .s71-togs{display:grid;gap:.4em}
.md-lab .s71-tog{display:flex;align-items:center;justify-content:space-between;gap:.6em;padding:.38em .8em;border:1px solid #9fb0dc;border-radius:.5em;background:#fff;color:#52607f;font-size:.88em;line-height:1.3;cursor:pointer}.md-lab .s71-tog b{color:#2c478f}
.ce-lab.md-lab .s71-count{color:#52607f;text-align:center;line-height:1.1}.md-lab .s71-count b{font-size:2.9em;color:#3f5dae}
.ce-lab.md-lab .s71-quote{padding:.5em .8em;border-left:.25em solid #3f5dae;border-radius:0 .5em .5em 0;background:#fff;font-size:.92em;line-height:1.5}
.ce-lab.md-lab .s71-state{margin-top:auto;padding:.45em .6em;border-radius:.6em;background:#ebf0fc;color:#2c478f;font-weight:800;text-align:center}.ce-lab.md-lab .s71-state[data-tone=bad]{background:#fdeceb;color:#b5372f}.ce-lab.md-lab .s71-state[data-tone=good]{background:#e3f5ec;color:#16794c}.ce-lab.md-lab .s71-state[data-tone=warn]{background:#fff7df;color:#7a5600}
.md-lab .s71-rows{flex:1;min-height:0;display:grid;grid-auto-rows:minmax(0,1fr);gap:.55em}.md-lab .s71-row{display:grid;grid-template-columns:5.4em repeat(3,minmax(0,1fr));gap:.4em}
.md-lab .s71-row>span{display:grid;align-content:center;gap:.1em;line-height:1.25}.md-lab .s71-row>span b{color:#2c478f;font-size:.9em}.md-lab .s71-row small{font-size:.7em;font-weight:700}
.md-lab .s71-row small[data-kind=risk]{color:#b5372f}.md-lab .s71-row small[data-kind=lost]{color:#8a6100}.md-lab .s71-row small[data-kind=keep]{color:#16794c}
.md-lab .s71-opt{padding:.4em .6em;border:1px solid #9fb0dc;border-radius:.5em;background:#fff;color:#1c2c4c;font-size:.86em;line-height:1.35;text-align:left;cursor:pointer}
.md-lab .s71-path .s71-opt{padding:.6em .8em;font-size:.92em}.ce-lab.md-lab .s71-path h4{margin:auto 0 0;color:#52607f;font-size:.8em;font-weight:700}
.md-lab .s71-gauge{display:grid;grid-template-columns:1fr auto;gap:.2em .6em;font-size:.86em}.md-lab .s71-gauge b{color:#2c478f}.md-lab .s71-gauge .md-meter{grid-column:1/-1;height:.8em}
.md-lab .s71-need{display:grid;align-content:start;gap:.4em;min-height:6.6em}.ce-lab.md-lab .s71-need p{padding:.5em .8em;border:1px solid #b7dcc9;border-radius:.5em;background:#e3f5ec;color:#16794c;font-size:.9em;line-height:1.4}
.ce-lab.md-lab .s71-need p[data-on=true]{border-color:#f0a202;background:#fff7df;color:#6b4a00;font-weight:700}
.md-lab .s71-tree{flex:1;min-height:0;width:100%}.md-lab .s71-tree line{stroke:#c9d3ec;stroke-width:2}.md-lab .s71-tree line[data-on=true]{stroke:#c2413b;stroke-width:2.5}
.md-lab .s71-tree g[data-i]{cursor:pointer}.md-lab .s71-tree circle{fill:#f6f8fd;stroke:#b9c6e6;stroke-width:2}
.md-lab .s71-tree g[data-s=got] circle{fill:#f6c9c5;stroke:#c2413b}.md-lab .s71-tree g[data-s=stop] circle{fill:#fff7df;stroke:#f0a202;stroke-width:4}.md-lab .s71-tree g[data-s=root] circle{fill:#55627f;stroke:#1c2c4c}
.md-lab .s71-tree rect{fill:#b36b00}.md-lab .s71-tree text{font-size:14px;fill:#52607f}
.md-lab .s71-key{display:flex;flex-wrap:wrap;gap:.3em 1em;font-size:.78em;color:#3a4a6b}.md-lab .s71-key i{display:inline-block;width:.9em;height:.9em;margin-right:.35em;border:.14em solid;border-radius:50%;vertical-align:-.1em}`);
 const options=(cls,list,key)=>list.map((o,j)=>`<button type="button" class="${cls}" data-k="${key}" data-j="${j}" aria-pressed="false">${esc(o.t)}</button>`).join('');

 // The request from the opening slide, cut into parts that can be marked. mark:null means either choice is accepted.
 const SEGS=[
  {t:'6학년 2반',mark:true,why:'학년과 반은 다른 정보와 함께 쓰면 한 학생이 특정될 수 있는, 결합하면 알아보는 정보입니다.'},
  {t:'김OO',mark:true,why:'이름은 식별 정보입니다. 일부를 가려도 학년, 반과 결합하면 알아볼 수 있으므로 학생 A 같은 기호로 바꿉니다.'},
  {t:'(12세)은',mark:true,why:'나이도 학년, 반과 함께 쓰면 학생을 알아보는 데 쓰이는 정보입니다.'},
  {t:'부모님 이혼 후',mark:true,why:'가정환경은 민감한 사정입니다. 필요한 교육적 특성만 서술합니다.'},
  {t:'결석이 잦고',mark:null,why:'일반화한 상황으로 바꾸면 남길 수 있는 표현입니다. 표시해도, 남겨도 됩니다.'},
  {t:'수학 성적이 40점대로 떨어졌어.',mark:true,why:'개별 성적은 교육 기록입니다. 익명 집계나 일반화한 상황으로 바꿉니다.'},
  {t:'이 상담 기록을',mark:true,why:'상담 기록은 교육 기록입니다. 학생의 상담 내용은 AI에 입력하지 않습니다.'},
  {t:'요약해 줘.',mark:false,why:'요청하는 일 자체는 개인정보가 아닙니다. 다만 상담 기록을 빼면 요약할 대상이 남지 않습니다.'}];
 L.add('requestMark','custom',{
  hint:'도입의 요청문입니다. <b>입력하면 안 되는 정보</b>라고 생각하는 부분을 모두 눌러 표시한 뒤 확인합니다.',
  body:`<div class="md-panel" style="flex:none"><h3>한 교사가 생성형 AI에 입력하려는 요청문</h3><p class="s71-sent">${SEGS.map((s,i)=>`<button type="button" class="s71-seg" data-i="${i}" aria-pressed="false">${esc(s.t)}</button>`).join('')}</p></div>
   <div class="md-split" style="--split:1.3fr 1fr"><div class="md-panel"><h3>표시한 정보를 뺀 문장</h3><p class="s71-left" id="s71-left"></p>
    <div class="md-chips" style="align-items:center;margin-top:auto"><span class="s71-tight">이 문장으로 요청의 목적을 이룰 수 있을까요?</span><button type="button" class="md-chip" data-goal="yes" aria-pressed="false">이룰 수 있다</button><button type="button" class="md-chip" data-goal="no" aria-pressed="false">이루기 어렵다</button></div><p class="s71-small" id="s71-goal"></p></div>
    <div class="md-panel"><h3 id="s71-side"></h3><ul class="md-list s71-tight" id="s71-kinds"></ul><p class="s71-small" id="s71-why"></p></div></div>`,
  state:()=>({marked:[],checked:false,why:null,goal:null}),
  render(ui,st,reset){
   const check=ui.action('확인',()=>{st.checked=true;st.why=null;draw()},true);ui.action('다시 하기',reset);
   const marked=i=>st.marked.includes(i),right=i=>SEGS[i].mark===null||marked(i)===SEGS[i].mark;
   function draw(){
    ui.all('.s71-seg').forEach((b,i)=>{b.setAttribute('aria-pressed',String(marked(i)));if(st.checked)b.dataset.result=right(i)?'right':'wrong';else delete b.dataset.result});
    ui.q('#s71-left').innerHTML=SEGS.map((s,i)=>marked(i)?`<span class="s71-blank" style="width:${(s.t.length*.6).toFixed(1)}em"></span>`:esc(s.t)).join(' ');
    ui.all('[data-goal]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.goal===st.goal)));
    ui.q('#s71-goal').textContent=st.checked?'표시할 정보를 모두 빼면 요약할 상담 기록이 남지 않습니다. 요청의 목적을 바꾸는 방법은 뒤의 바꾸어 쓰기에서 확인합니다.':'';
    ui.q('#s71-side').textContent=st.checked?'함께 확인할 판단':'지금까지 표시한 곳';
    ui.q('#s71-kinds').innerHTML=(st.checked?[['식별 정보','이름'],['결합하면 알아보는 정보','학년과 반, 나이'],['민감한 사정','가정환경'],['교육 기록','개별 성적, 상담 기록']]:[['표시한 곳',st.marked.length+'곳'],['남긴 곳',SEGS.length-st.marked.length+'곳']]).map(([a,b])=>`<li><b>${a}</b><span>${b}</span></li>`).join('');
    ui.q('#s71-why').textContent=st.checked?(st.why===null?'요청문의 각 부분을 누르면 이유가 나옵니다.':`${SEGS[st.why].t}: ${SEGS[st.why].why}`):'이름만 가리면 충분할까요? 다른 정보와 결합하면 알아볼 수 있는 부분도 찾아봅니다.';
    check.disabled=st.checked;
    const n=SEGS.filter((_,i)=>right(i)).length;
    ui.say(st.checked?`여덟 부분 중 ${n}곳이 함께 확인할 판단과 같습니다. 요청문의 각 부분을 누르면 이유가 나옵니다.`:st.marked.length?`${st.marked.length}곳을 표시했습니다. 다 찾았으면 확인을 누르세요.`:'입력하면 안 된다고 생각하는 부분을 눌러 표시하세요.',st.checked&&n===SEGS.length?'good':'');
   }
   ui.body.addEventListener('click',e=>{
    const seg=e.target.closest('.s71-seg'),goal=e.target.closest('[data-goal]');
    if(goal){st.goal=goal.dataset.goal;draw();return}
    if(!seg)return;const i=Number(seg.dataset.i);
    if(st.checked)st.why=i;else st.marked=marked(i)?st.marked.filter(n=>n!==i):[...st.marked,i];draw();
   });
   draw();
  }});

 // A made-up school of 216 students. Each piece of information keeps only the students it fits.
 const MOVED=new Set(['6-2-4','6-1-5','6-3-2','5-2-7','4-2-6','2-2-1','1-1-8','2-3-3','3-1-10','3-3-5','4-1-0','5-3-9']);
 const STUDENTS=[];for(let c=1;c<=3;c++)for(let g=1;g<=6;g++)for(let i=0;i<12;i++)STUDENTS.push({g,c,girl:i%2===0,moved:MOVED.has(`${g}-${c}-${i}`)});
 const FACTS=[{k:'grade',name:'학년',value:'6학년',fits:s=>s.g===6},{k:'room',name:'반',value:'2반',fits:s=>s.c===2},{k:'moved',name:'전학 시기',value:'2학기에 전학 옴',fits:s=>s.moved},{k:'girl',name:'성별',value:'여학생',fits:s=>s.girl}];
 L.add('combineInfo','custom',{
  hint:'이름을 쓰지 않으면 괜찮을까요? 정보를 하나씩 넣으며 <b>조건에 맞는 학생이 몇 명 남는지</b> 확인합니다. 학교와 학생은 가상의 예시입니다.',
  body:`<div class="md-split" style="--split:1.9fr 1fr"><div class="md-panel"><h3>가상의 초등학교, 학생 216명</h3><div class="s71-school"><b></b>${[1,2,3,4,5,6].map(g=>`<b>${g}학년</b>`).join('')}
    ${[1,2,3].map(c=>`<b>${c}반</b>`+[1,2,3,4,5,6].map(g=>`<div class="s71-class">${STUDENTS.map((s,n)=>s.g===g&&s.c===c?`<i data-n="${n}"></i>`:'').join('')}</div>`).join('')).join('')}</div>
    <p class="s71-small" style="color:#52607f">점 하나가 학생 한 명입니다. 조건에 맞는 학생만 진하게 남습니다.</p></div>
   <div class="md-panel"><h3>요청문에 넣을 정보</h3><div class="s71-togs">${FACTS.map(f=>`<button type="button" class="s71-tog" data-k="${f.k}" aria-pressed="false"><span>${f.name}</span><b>${f.value}</b></button>`).join('')}</div>
    <p class="s71-quote" id="s71-phrase"></p><p class="s71-count"><b id="s71-n"></b>명 남음</p><p class="s71-state" id="s71-state"></p></div></div>`,
  state:()=>({on:[]}),
  render(ui,st,reset){
   ui.action('처음부터',reset);
   function draw(){
    const used=FACTS.filter(f=>st.on.includes(f.k)),fit=STUDENTS.map(s=>used.every(f=>f.fits(s))),n=fit.filter(Boolean).length,has=k=>st.on.includes(k);
    ui.all('.s71-tog').forEach(b=>b.setAttribute('aria-pressed',String(has(b.dataset.k))));
    ui.all('.s71-class i').forEach(d=>{const ok=fit[d.dataset.n];d.dataset.on=String(ok);d.dataset.one=String(ok&&n===1)});
    const place=[has('grade')?'6학년':'',has('room')?'2반':''].filter(Boolean).join(' '),who=[place,has('moved')?'2학기에 전학 온':''].filter(Boolean).join(', ');
    ui.q('#s71-phrase').textContent=used.length?`"${who?who+' ':''}${has('girl')?'여학생':'학생'}"`:'"우리 학교 학생"';
    ui.q('#s71-n').textContent=n;
    const state=ui.q('#s71-state');state.textContent=n===1?'한 학생이 특정됨':n<=12?'몇 명으로 좁혀짐':'아직 여러 명';state.dataset.tone=n===1?'bad':n<=12?'warn':'';
    ui.say(!used.length?'정보를 눌러 요청문에 넣어 보세요. 다시 누르면 빠집니다.':n===1?'이름을 쓰지 않았는데도 한 학생만 남았습니다. 결합하면 알아볼 수 있는 정보도 개인정보입니다.':`정보 ${used.length}가지를 함께 쓰면 216명 중 ${n}명이 남습니다. 하나를 더 넣으면 어떻게 될까요?`,n===1?'bad':'');
   }
   ui.body.addEventListener('click',e=>{const b=e.target.closest('.s71-tog');if(!b)return;const k=b.dataset.k;st.on=st.on.includes(k)?st.on.filter(v=>v!==k):[...st.on,k];draw()});
   draw();
  }});

 // A second request to rewrite. Each part can be kept, wiped out, or reduced to the characteristic that matters.
 const PARTS=[
  {name:'누구',risk:'식별 정보',lost:'학년 수준',opts:[{t:'5학년 3반 이OO(11세)는',kind:'risk'},{t:'어떤 학생이',kind:'lost'},{t:'초등학교 5학년 학생이',kind:'keep'}]},
  {name:'사정',risk:'민감한 사정',lost:'학생의 상황',opts:[{t:'작년에 전학 온 뒤 친구와 다툼이 잦고',kind:'risk'},{t:'여러 사정이 있고',kind:'lost'},{t:'최근 모둠 활동 참여가 줄었고',kind:'keep'}]},
  {name:'학습',risk:'개별 성적',lost:'어려워하는 내용',opts:[{t:'국어 단원평가가 50점이야.',kind:'risk'},{t:'공부를 어려워해.',kind:'lost'},{t:'글의 중심 생각을 찾는 데 어려움이 있어.',kind:'keep'}]},
  {name:'요청',risk:'상담 기록',lost:'필요한 도움',opts:[{t:'이 학생의 상담 기록을 요약해 줘.',kind:'risk'},{t:'어떻게 하면 좋을지 알려 줘.',kind:'lost'},{t:'읽기 보충 활동 세 가지를 제안해 줘.',kind:'keep'}]}];
 const KIND={risk:'넣지 않을 정보',lost:'특성이 사라짐',keep:'필요한 특성'};
 L.add('rewriteRequest','custom',{
  hint:'다른 요청문으로 연습합니다. 네 부분의 표현을 바꾸어 <b>식별 정보와 민감한 사정은 빼고 필요한 특성은 남긴</b> 요청을 만듭니다. 요청문은 예시입니다.',
  body:`<div class="md-split" style="--split:1.4fr 1fr"><div class="md-panel"><h3>부분마다 표현 하나 고르기</h3><div class="s71-rows">${PARTS.map((p,i)=>`<div class="s71-row"><span><b>${p.name}</b><small></small></span>${options('s71-opt',p.opts,i)}</div>`).join('')}</div></div>
   <div class="md-panel"><h3>완성된 요청</h3><p class="s71-quote" id="s71-request"></p>
    <div class="s71-gauge"><span>알아볼 수 있는 정보와 민감한 기록</span><b id="s71-risk"></b><div class="md-meter"><i id="s71-riskbar" style="background:#c2413b"></i></div></div>
    <div class="s71-gauge"><span>도움에 필요한 교육적 특성</span><b id="s71-keep"></b><div class="md-meter"><i id="s71-keepbar" style="background:#1f8a5b"></i></div></div>
    <p class="s71-state" id="s71-verdict"></p></div></div>`,
  state:()=>({pick:[0,0,0,0]}),
  render(ui,st,reset){
   ui.action('처음 요청으로',reset);
   function draw(){
    const kinds=PARTS.map((p,i)=>p.opts[st.pick[i]].kind),risk=PARTS.filter((_,i)=>kinds[i]==='risk'),lost=PARTS.filter((_,i)=>kinds[i]==='lost');
    ui.all('.s71-opt').forEach(b=>b.setAttribute('aria-pressed',String(st.pick[b.dataset.k]===Number(b.dataset.j))));
    ui.all('.s71-row small').forEach((n,i)=>{n.textContent=KIND[kinds[i]];n.dataset.kind=kinds[i]});
    ui.q('#s71-request').textContent=`"${PARTS.map((p,i)=>p.opts[st.pick[i]].t).join(' ')}"`;
    ui.q('#s71-risk').textContent=risk.length+'곳';ui.q('#s71-riskbar').style.width=risk.length*25+'%';
    ui.q('#s71-keep').textContent=`${4-lost.length} / 4`;ui.q('#s71-keepbar').style.width=(4-lost.length)*25+'%';
    const v=ui.q('#s71-verdict'),done=!risk.length&&!lost.length;
    v.textContent=risk.length?'아직 입력하지 않을 요청':lost.length?'도움을 받기 어려운 요청':'입력할 수 있는 요청';v.dataset.tone=risk.length?'bad':lost.length?'warn':'good';
    ui.say(risk.length?`넣지 않을 정보가 ${risk.length}곳 남았습니다: ${risk.map(p=>p.risk).join(', ')}.`:lost.length?`개인정보는 없지만 ${lost.map(p=>p.lost).join(', ')}까지 사라져 학생에게 맞는 도움을 받기 어렵습니다.`:'식별 정보와 민감한 사정을 빼고 교육적으로 필요한 특성만 남겼습니다. 같은 목적의 도움을 받을 수 있습니다.',done?'good':risk.length?'bad':'');
   }
   ui.body.addEventListener('click',e=>{const b=e.target.closest('.s71-opt');if(b){st.pick[b.dataset.k]=Number(b.dataset.j);draw()}});
   draw();
  }});

 L.add('inputSort','sort',{soft:true,hint:'판단표의 여섯 요청을 외부 생성형 AI에 <b>입력해도 되는지</b> 나누어 봅니다. 먼저 혼자 판단하고, 확인한 뒤 카드를 눌러 근거를 비교합니다.',
  bins:[{id:'ok',label:'입력할 수 있음',sub:'알아볼 수 있는 정보가 없는 요청'},{id:'change',label:'바꾸어서 입력',sub:'기호, 익명 집계, 일반화한 상황으로'},{id:'no',label:'확인 전에는 하지 않음',sub:'동의와 학교 방침 확인이 먼저'}],cards:[
  {id:'a',label:'교육과정 성취기준에 맞는 수업 활동을 추천해 줘',answer:'ok',why:'학생을 알아볼 수 있는 정보가 들어 있지 않은 요청입니다.'},
  {id:'b',label:'우리 반 25명의 이름과 점수로 성적 분포를 분석해 줘',answer:'change',why:'이름은 식별 정보, 개별 성적은 교육 기록입니다. 이름을 기호로 바꾸거나 익명 집계로 입력합니다.'},
  {id:'c',label:'익명 설문 응답 100건의 공통 의견을 정리해 줘',answer:['ok','change'],why:'익명 집계 자료입니다. 다만 응답 안에 학생을 알아볼 수 있는 내용이 있는지 먼저 확인합니다.'},
  {id:'d',label:'학생 사진으로 졸업 앨범용 캐리커처를 만들어 줘',answer:'no',why:'얼굴 사진은 식별 정보입니다. 학생 사진을 AI로 변환하려면 초상권과 개인정보, 보호자 동의를 확인합니다.'},
  {id:'e',label:'학부모 민원 메일 원문에 대한 답장을 써 줘',answer:['change','no'],why:'원문에는 사람과 사안을 알아볼 수 있는 내용이 담깁니다. 원문 대신 일반화한 상황으로 바꾸어 입력합니다.'},
  {id:'f',label:'교사 연수 자료의 맞춤법을 고쳐 줘',answer:'ok',why:'학생 정보가 들어 있지 않은 자료입니다.'}]});

 // The five situations of the table, arranged as the three things the slide says to check separately.
 const STAGES=[
  {name:'입력하는 자료',opts:[{t:'교사가 직접 쓴 글',need:[]},{t:'교과서 삽화나 타인 작품',need:['입력도 복제에 해당할 수 있어 이용 허락과 범위 확인']},{t:'학생 사진',need:['초상권과 개인정보, 보호자 동의 확인']}]},
  {name:'생성된 결과',opts:[{t:'내용을 설명하는 그림을 요청',need:[]},{t:'특정 작가나 캐릭터의 스타일을 요청',need:['기존 작품과 비슷해 침해가 될 수 있는지 확인']}]},
  {name:'공유하는 범위',opts:[{t:'교사 혼자 참고',need:[]},{t:'AI로 만든 자료를 수업에서 배포',need:['AI 사용 사실과 사람이 고친 부분 표시']},{t:'생성 이미지를 학교 누리집에 게시',need:['수업 목적의 이용 범위를 넘는 공개인지 확인','AI 사용 사실과 사람이 고친 부분 표시']}]}];
 L.add('materialCheck','custom',{
  hint:'수업 자료 하나를 만든다고 가정합니다. <b>입력하는 자료, 생성된 결과, 공유하는 범위</b>를 바꾸어 가며 확인할 점이 어디에서 생기는지 살펴봅니다.',
  body:`<div class="md-split s71-path" style="--split:1fr 1fr 1fr;gap:1em">${STAGES.map((s,i)=>`<div class="md-panel"><h3>${i+1}. ${s.name}</h3><div class="s71-togs">${options('s71-opt',s.opts,i)}</div><h4>확인할 점</h4><div class="s71-need" data-stage="${i}"></div></div>`).join('')}</div>`,
  state:()=>({pick:[1,0,1]}),
  render(ui,st,reset){
   ui.action('처음 선택으로',reset);
   function draw(){
    ui.all('.s71-opt').forEach(b=>b.setAttribute('aria-pressed',String(st.pick[b.dataset.k]===Number(b.dataset.j))));
    let total=0;
    STAGES.forEach((s,i)=>{const need=s.opts[st.pick[i]].need;total+=need.length;
     ui.q(`.s71-need[data-stage="${i}"]`).innerHTML=need.length?need.map(t=>`<p data-on="true">${esc(t)}</p>`).join(''):'<p data-on="false">표의 상황에 해당하지 않음</p>'});
    ui.say(total?`이 자료를 만들고 나누기 전에 확인할 점은 ${total}가지입니다. 선택을 바꾸면 확인할 점도 달라집니다.`:'표의 다섯 상황에 해당하지 않는 경로입니다. 어느 선택에서 확인할 점이 생기는지 바꾸어 보세요.',total?'':'good');
   }
   ui.body.addEventListener('click',e=>{const b=e.target.closest('.s71-opt');if(b){st.pick[b.dataset.k]=Number(b.dataset.j);draw()}});
   draw();
  }});

 L.add('labelQuiz','quiz',{hint:'AI 사용 사실의 공개, 기본법의 고지와 표시 의무, 딥페이크 대응에서 본 기준을 확인합니다.',closing:'표시가 있는지와 함께, 누가 무엇을 밝히고 확인하는지를 학급 규칙에 옮겨 봅니다.',questions:[
  {q:'인공지능 기본법 제31조의 고지와 표시 의무는 누구에게 부과될까요?',short:'고지와 표시 의무의 주체',choices:['AI를 수업에 쓰는 교사','AI를 제공하는 사업자','AI로 과제를 한 학생'],answer:1,why:'제31조는 AI를 제공하는 사업자에게 사전 고지, 결과물 표시, 딥페이크 고지의 세 가지 의무를 부과합니다.'},
  {q:'생성형 AI가 만든 결과물임을 표시하는 방법은 무엇일까요?',short:'결과물 표시의 방법',choices:['사람이 인식하거나 기계가 판독하는 방법','약관에만 적어 두는 방법','이용자가 물을 때만 알리는 방법'],answer:0,why:'제2항 결과물 표시는 사람이 인식하거나 기계가 판독하는 방법으로 합니다.'},
  {q:'실제와 구분하기 어려운 음향, 이미지, 영상은 어떻게 알려야 할까요?',short:'딥페이크 고지의 방식',choices:['제공 장소에 게시하면 된다','기계가 판독할 수 있으면 된다','이용자가 명확하게 인식하는 방식으로 알린다'],answer:2,why:'제3항 딥페이크 고지는 이용자가 명확하게 인식하는 방식으로 합니다.'},
  {q:'평가와 기록에 AI가 관여했다면 무엇을 밝혀야 할까요?',short:'평가와 기록에서 밝힐 것',columns:1,choices:['사용한 단계와 목적, 스스로 고친 부분','AI가 관여한 부분과 사람의 최종 확인','가정통신문과 누리집의 AI 활용 여부'],answer:1,why:'평가와 기록에서는 AI가 관여한 부분과 사람의 최종 확인을 밝힙니다. 첫째는 학생 과제, 셋째는 학교 소통에서 밝힐 내용입니다.'},
  {q:'동의 없이 만든 성적 합성물을 만들지는 않고 받아서 보기만 했다면 어떻게 될까요?',short:'합성물의 소지와 시청',choices:['만든 사람만 처벌된다','소지하거나 시청해도 처벌된다'],answer:1,why:'성폭력범죄의 처벌 등에 관한 특례법 제14조의2에 따라 합성물을 소지하거나 시청해도 처벌됩니다.'},
  {q:'학교에서 합성물을 발견했을 때 할 일은 무엇일까요?',short:'발견 단계에서 학교가 할 일',columns:1,choices:['증거가 남지 않도록 관련 자료를 바로 모두 지우게 한다','피해 학생 보호를 우선하고 유포 중단, 증거 보존, 학교 절차에 따른 보고를 한다','누가 만들었는지 학급 전체에 먼저 묻는다'],answer:1,why:'발견 단계에서는 피해 학생 보호를 우선하고 유포 중단, 증거 보존, 학교 절차에 따른 보고를 합니다.'}]});

 // One person passes a file to two people, four times over. A person who stops still received it but passes it to nobody.
 const NODES=31,LEVEL_Y=[36,126,216,306,394],level=i=>Math.floor(Math.log2(i+1)),xOf=i=>i>=15?25+50*(i-15):(xOf(2*i+1)+xOf(2*i+2))/2;
 L.add('shareChain','custom',{
  hint:'합성물이 <b>한 사람에게서 두 사람에게</b> 네 번 전달된다고 가정한 예시 모형입니다. 받은 사람 가운데 <b>공유를 멈추는 두 사람</b>을 골라 봅니다.',
  body:`<div class="md-split" style="--split:2.7fr 1fr"><div class="md-panel"><svg class="s71-tree" viewBox="-84 0 884 424" role="img" aria-label="한 사람에게서 두 사람에게 네 번 전달되는 공유 사슬"></svg>
    <p class="s71-key"><span><i style="background:#55627f;border-color:#1c2c4c"></i>처음 올린 사람</span><span><i style="background:#f6c9c5;border-color:#c2413b"></i>받은 사람</span><span><i style="background:#fff7df;border-color:#f0a202"></i>멈춘 사람</span><span><i style="background:#f6f8fd;border-color:#b9c6e6"></i>받지 않은 사람</span></p></div>
   <div class="md-panel"><h3>전달 결과</h3><ul class="md-list s71-tight" id="s71-levels"></ul><p class="s71-count"><b id="s71-got"></b>명이 받음</p><p class="s71-state" id="s71-spread"></p></div></div>`,
  state:()=>({stop:[]}),
  render(ui,st,reset){
   ui.action('처음부터',reset);
   function draw(full){
    const got=[true];for(let i=1;i<NODES;i++){const p=(i-1)>>1;got[i]=got[p]&&!st.stop.includes(p)}
    const state=i=>i===0?'root':st.stop.includes(i)?'stop':got[i]?'got':'none';
    let lines='',dots='';
    for(let i=1;i<NODES;i++){const p=(i-1)>>1;lines+=`<line x1="${xOf(p)}" y1="${LEVEL_Y[level(p)]}" x2="${xOf(i)}" y2="${LEVEL_Y[level(i)]}" data-on="${got[i]}"/>`}
    for(let i=0;i<NODES;i++){const x=xOf(i),y=LEVEL_Y[level(i)],r=i===0?17:15;
     dots+=`<g data-i="${i}" data-s="${state(i)}"><circle cx="${x}" cy="${y}" r="${r}"/>${state(i)==='stop'?`<rect x="${x-5.5}" y="${y-6}" width="4" height="12"/><rect x="${x+1.5}" y="${y-6}" width="4" height="12"/>`:''}</g>`}
    ui.q('.s71-tree').innerHTML=lines+dots+LEVEL_Y.slice(1).map((y,i)=>`<text x="-80" y="${y+5}">${i+1}번째 전달</text>`).join('');
    const count=lv=>{let n=0;for(let i=1;i<NODES;i++)if(level(i)===lv&&got[i])n++;return n},total=[1,2,3,4].reduce((n,lv)=>n+count(lv),0);
    ui.q('#s71-levels').innerHTML=[1,2,3,4].map(lv=>`<li><b>${lv}번째 전달</b><span>${2**lv}명 중 ${count(lv)}명</span></li>`).join('');
    ui.q('#s71-got').textContent=total;
    const s=ui.q('#s71-spread');s.textContent=total===30?'모두에게 퍼짐':total<=2?'처음 두 사람에서 멈춤':`${30-total}명은 받지 않음`;s.dataset.tone=total===30?'bad':total<=2?'good':'warn';
    ui.say(full?'멈추는 사람은 두 명까지 고를 수 있습니다. 고른 사람을 다시 누르면 취소됩니다.':!st.stop.length?'아무도 멈추지 않으면 네 번 만에 30명이 받습니다. 받은 사람 가운데 멈출 두 사람을 눌러 보세요.'
     :total<=2?'처음 받은 두 사람이 멈추자 더 퍼지지 않았습니다. 공유 전에 멈추어 판단하도록 지도하는 까닭입니다.':`멈춘 사람 ${st.stop.length}명, 받은 사람은 30명 중 ${total}명입니다. 더 앞에서 멈추면 어떻게 달라질까요?`,full?'bad':total<=2?'good':'');
   }
   ui.body.addEventListener('click',e=>{const g=e.target.closest('g[data-i]');if(!g)return;const i=Number(g.dataset.i);if(i===0)return;
    if(st.stop.includes(i))st.stop=st.stop.filter(n=>n!==i);else if(st.stop.length>=2){draw(true);return}else st.stop=[...st.stop,i];draw()});
   draw();
  }});

 L.add('checkMatch','match',{hint:'교사용 점검표의 여섯 영역과, 그 질문에 <b>아직 답하지 못한 장면</b>을 짝지어 봅니다. 장면은 이 활동을 위해 만든 예시입니다.',leftTitle:'점검 영역',rightTitle:'아직 답하지 못한 장면(예시)',seed:6,pairs:[
  {left:'목적',right:'학생이 써야 할 감상문을 AI가 대신 써 주는 활동을 계획함'},
  {left:'개인정보',right:'상담 기록을 그대로 붙여 넣고 요약을 요청함'},
  {left:'저작권',right:'교과서 삽화를 입력해 만든 그림을 이용 범위 확인 없이 게시함'},
  {left:'공정성',right:'AI 추천에서 같은 학생들이 계속 빠지는데 그대로 사용함'},
  {left:'검증과 공개',right:'AI가 만든 퀴즈를 사실 확인 없이, AI 사용도 밝히지 않고 나누어 줌'},
  {left:'책임',right:'AI 피드백이 틀렸을 때 누가 어떻게 바로잡을지 정하지 않음'}]});

 L.add('ruleSort','sort',{soft:true,hint:'학급 AI 사용 규칙에 넣을 문장을 양식의 <b>다섯 항목</b>에 놓아 봅니다. 문장은 초등 고학년 학급을 가정해 만든 예시입니다.',
  bins:[{id:'aim',label:'목적',sub:'AI를 쓰는 수업 활동과 이유'},{id:'allow',label:'허용과 금지',sub:'쓸 수 있는 활동과 쓰지 않을 활동'},{id:'open',label:'공개 방법',sub:'AI 사용을 밝히는 방식'},{id:'privacy',label:'개인정보',sub:'입력하지 않을 정보'},{id:'verify',label:'확인 절차',sub:'결과를 확인하는 방법'}],cards:[
  {id:'a',label:'모둠 발표 주제를 정할 때 질문을 떠올리려고 써요',answer:'aim',why:'AI를 쓰는 수업 활동과 이유를 밝힌 목적 문장입니다.'},
  {id:'b',label:'독서 감상문은 AI에게 대신 쓰게 하지 않아요',answer:'allow',why:'쓰지 않을 활동을 정한 허용과 금지 문장입니다.'},
  {id:'c',label:'발표 자료 끝에 쓴 도구와 사용 단계를 적어요',answer:'open',why:'AI 사용을 밝히는 방식을 정한 공개 방법 문장입니다.'},
  {id:'d',label:'내 이름, 친구 이름, 얼굴 사진은 넣지 않아요',answer:'privacy',why:'입력하지 않을 정보를 정한 개인정보 문장입니다.'},
  {id:'e',label:'AI 답은 선생님이나 책으로 한 번 더 확인해요',answer:'verify',why:'결과를 확인하는 방법을 정한 확인 절차 문장입니다.'},
  {id:'f',label:'낱말 뜻이 궁금할 때는 AI에 물어봐도 돼요',answer:['allow','aim'],why:'쓸 수 있는 활동을 정한 허용과 금지 문장입니다. 쓰는 이유를 함께 적으면 목적 문장으로도 볼 수 있습니다.'},
  {id:'g',label:'AI로 만든 것은 AI로 만들었다고 말해요',answer:'open',why:'AI 사용을 밝히는 방식을 정한 공개 방법 문장입니다.'}]});
})();
