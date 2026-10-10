/* 5주차 오전, 지식 기반 인공지능 도구 활용 Part 1: activity slides. Documents, answers, probabilities and unit counts are examples written for these activities. */
(()=>{
 'use strict';
 const L=window.ceLabs;if(!L)return;const esc=L.esc;
 L.style(`.md-lab .s51-tabs{display:flex;flex-wrap:wrap;gap:.4em}
.md-lab .s51-tab{padding:.28em .8em;border:1px solid #9fb0dc;border-radius:.5em;background:#fff;color:#2c478f;font-size:.82em;line-height:1.3;cursor:pointer}
.md-lab .s51-sents{display:grid;gap:.4em}
.md-lab .s51-sent{display:flex;align-items:baseline;justify-content:space-between;gap:.6em;padding:.5em .8em;border:1px solid #9fb0dc;border-radius:.5em;background:#fff;color:#1c2c4c;font-size:1em;line-height:1.35;text-align:left;cursor:pointer}
.md-lab .s51-sent i{flex:none;font-style:normal;font-size:.85em;font-weight:800;color:#3f5dae}
.md-lab .s51-box{padding:.6em .9em;border:1px solid #d5ddf1;border-radius:.5em;background:#fff;font-size:.98em;line-height:1.45}
.md-lab .s51-box small{display:block;margin-bottom:.15em;color:#52607f;font-size:.85em}
.md-lab .s51-box .md-btn{margin-top:.5em}
.md-lab p.s51-note{font-size:.78em;line-height:1.4;color:#52607f}
.md-lab p.s51-line{font-size:.95em;line-height:1.4}
.md-lab .s51-field{display:flex;align-items:center;gap:.7em;font-size:.9em}.md-lab .s51-field select{flex:1;min-width:0}
.md-lab .s51-checks{display:grid;gap:.45em;margin:0;padding:0;list-style:none}
.md-lab .s51-checks li{display:grid;grid-template-columns:1fr 1.15fr;align-items:center;gap:.8em;padding:.5em .9em;border:1px solid #d5ddf1;border-left:.35em solid #9fb0dc;border-radius:.5em;background:#fff;font-size:.95em;line-height:1.35}
.md-lab .s51-checks b{display:block;color:#2c478f}.md-lab .s51-checks span{color:#52607f;font-size:.92em}.md-lab .s51-checks em{font-style:normal;font-weight:800}
.md-lab .s51-checks li[data-tone=ok]{border-left-color:#1f8a5b}.md-lab .s51-checks li[data-tone=ok] em{color:#16794c}
.md-lab .s51-checks li[data-tone=warn]{border-left-color:#f0a202}.md-lab .s51-checks li[data-tone=warn] em{color:#8a5a00}
.md-lab .s51-checks li[data-tone=fail]{border-left-color:#c2413b}.md-lab .s51-checks li[data-tone=fail] em{color:#b5372f}
.md-lab .s51-checks li[data-on=true]{border-left-color:#f0a202;background:#fff7df}.md-lab .s51-checks li[data-on=false]{opacity:.75}
.md-lab .s51-verdict[data-tone=warn]{background:#fff7df;color:#8a5a00}
.md-lab .s51-toks{display:flex;flex-wrap:wrap;gap:.35em}
.md-lab .s51-tok{padding:.2em .7em;border:1px solid #c9d3ec;border-radius:.5em;background:#fff;color:#52607f;font-size:1.15em}
.md-lab .s51-tok[data-kind=gen]{border-color:#3f5dae;background:#3f5dae;color:#fff;font-weight:800}
.md-lab .s51-tok[data-kind=next]{border:1px dashed #f0a202;background:#fff7df;color:#8a5a00}
.md-lab .s51-cands{display:grid;gap:.5em}
.md-lab .s51-cand{display:grid;grid-template-columns:7.5em 1fr 3em;align-items:center;gap:.7em;font-size:1.05em}.md-lab .s51-cand b{color:#2c478f}.md-lab .s51-cand span{text-align:right;color:#52607f}
.md-lab .s51-runs{display:grid;gap:.45em;margin:0;padding:0;list-style:none;font-size:.95em}
.md-lab .s51-runs li{padding:.4em .7em;border:1px solid #d5ddf1;border-radius:.5em;background:#fff;line-height:1.35}
.md-lab .s51-runs b{display:block;color:#2c478f;font-size:.88em}.md-lab .s51-runs li[data-tone=bad]{border-color:#c2413b;background:#fdeceb}.md-lab .s51-runs em{font-style:normal;font-weight:800;color:#b5372f}
.md-lab .s51-bar{position:relative;display:flex;height:2.2em;border:1px solid #c9d3ec;background:linear-gradient(90deg,#fff 41.667%,#fdeceb 41.667%)}
.md-lab .s51-bar i{display:block;height:100%}.md-lab .s51-bar u{position:absolute;top:-.25em;bottom:-.25em;left:41.667%;width:.14em;background:#c2413b}
.md-lab .s51-scale{position:relative;height:1.2em;font-size:.76em;color:#b5372f}.md-lab .s51-scale span{position:absolute;left:41.667%;transform:translateX(-50%);white-space:nowrap}
.md-lab .s51-legend{display:grid;grid-template-columns:1fr 1fr;gap:.3em .8em;margin:0;padding:0;list-style:none;font-size:.92em}
.md-lab .s51-legend li{display:flex;align-items:center;gap:.5em}.md-lab .s51-legend i{flex:none;width:.9em;height:.9em;border-radius:.2em}.md-lab .s51-legend b{margin-left:auto;color:#2c478f}
.md-lab .s51-units{display:grid;grid-template-columns:repeat(6,1fr);gap:.3em}
.md-lab .s51-units span{display:grid;justify-items:center;padding:.25em .1em;border:1px solid #c9d3ec;border-radius:.4em;background:#fff;font-size:.88em;line-height:1.3}
.md-lab .s51-units small{font-size:.86em}.md-lab .s51-units span[data-st=in]{border-color:#1f8a5b;background:#e3f5ec;color:#16794c}
.md-lab .s51-units span[data-st=out]{border-color:#c2413b;background:#fdeceb;color:#b5372f}.md-lab .s51-units span[data-st=skip]{border-style:dashed;color:#6b7896}
.md-lab .s51-ps{display:grid;gap:.35em;margin:0;padding:0;list-style:none;font-size:.9em}
.md-lab .s51-ps li{display:grid;grid-template-columns:auto 1fr auto;align-items:baseline;gap:.5em;padding:.3em .6em;border:1px solid #d5ddf1;border-radius:.45em;background:#fff;line-height:1.35}
.md-lab .s51-ps li>b{color:#3f5dae}.md-lab .s51-ps li>em{font-style:normal;font-size:.86em;color:#6b7896;white-space:nowrap}
.md-lab .s51-ps li[data-found=true]{border-color:#3f5dae;background:#ebf0fc}.md-lab .s51-ps li[data-found=true]>em{color:#2c478f;font-weight:800}
.md-lab .s51-ps li[data-miss=true]{border:1px dashed #c2413b}.md-lab .s51-ps li[data-miss=true]>em{color:#b5372f;font-weight:800}
.md-lab .s51-ps mark,.md-lab .s51-words mark{padding:0 .15em;border-radius:.2em;background:#ffe08a;color:inherit}
.md-lab .s51-words{font-size:.9em;line-height:1.5;color:#52607f}
.md-lab .s51-answer{display:grid;gap:.3em;padding:.5em .7em;border:1px solid #d5ddf1;border-radius:.5em;background:#fff;font-size:.92em;line-height:1.4}.md-lab .s51-answer b{color:#3f5dae}
.md-lab .s51-els{display:grid;gap:.4em}
.md-lab .s51-el{display:grid;padding:.3em .8em;border:1px solid #9fb0dc;border-radius:.5em;background:#fff;color:#1c2c4c;line-height:1.3;text-align:left;cursor:pointer}
.md-lab .s51-el{align-content:center}.md-lab .s51-el b{color:#2c478f;font-size:1em}.md-lab .s51-el small{font-size:.8em;color:#52607f}
.md-lab .s51-req{display:grid;gap:.45em;font-size:.98em;line-height:1.4}
.md-lab .s51-req div{display:grid;grid-template-columns:2.6em 1fr;gap:.5em;align-items:baseline}.md-lab .s51-req b{color:#3f5dae;font-size:.88em}
.md-lab .s51-req div[data-vague=true]{color:#8a5a00}.md-lab .s51-req div[data-vague=true] b{color:#8a5a00}
.md-lab .s51-feat{display:grid;gap:.3em;margin:0;padding:0;list-style:none;font-size:.9em}
.md-lab .s51-feat li{display:grid;grid-template-columns:2.6em 1fr;gap:.5em;padding:.25em .6em;border:1px solid #f0d58a;border-radius:.4em;background:#fff7df;line-height:1.35}
.md-lab .s51-feat li[data-set=true]{border-color:#9fd4b8;background:#e3f5ec}.md-lab .s51-feat b{color:#2c478f}
.md-lab .s51-shape{display:grid;gap:.22em;padding:.45em .6em;border:1px dashed #9fb0dc;border-radius:.5em;background:#fff}
.md-lab .s51-shape div{display:grid;grid-template-columns:repeat(var(--c),1fr);gap:.3em}
.md-lab .s51-shape i{height:.42em;border-radius:.2em;background:#c9d3ec}.md-lab .s51-shape b{font-size:.66em;line-height:1.3;color:#2c478f;text-align:center;background:#ebf0fc;border-radius:.2em}`);

 L.add('toolTypeSort','sort',{hint:'교사의 여덟 가지 과제에 실제로 쓰는 기능이 무엇인지 놓아 봅니다. 과제는 이 활동을 위해 만든 예시입니다.',
  bins:[{id:'gen',label:'생성'},{id:'search',label:'검색 결합'},{id:'ground',label:'자료 기반'},{id:'image',label:'이미지'},{id:'voice',label:'음성'}],cards:[
  {id:'a',label:'확인 문항 초안 다섯 개 쓰기',answer:'gen',why:'학습한 패턴으로 새 글과 문항을 작성하는 생성 기능입니다.'},
  {id:'b',label:'읽기 자료를 학년 수준에 맞게 다시 쓰기',answer:'gen',why:'학습한 패턴으로 새 글을 작성하는 생성 기능입니다.'},
  {id:'c',label:'웹에서 찾은 문서를 링크와 함께 요약하기',answer:'search',why:'웹 검색 결과를 답에 반영하고 링크를 제시하는 검색 결합 기능입니다.'},
  {id:'d',label:'올린 문서에서 찾아 인용과 함께 정리하기',answer:'ground',why:'올린 자료에서 찾아 인용과 함께 답하는 자료 기반 기능입니다.'},
  {id:'e',label:'올린 단원의 용어와 순서를 따라 정리하기',answer:'ground',why:'올린 자료에서 찾아 답하므로 자료의 용어와 순서를 따릅니다.'},
  {id:'f',label:'글로 설명한 실험 장면을 그림으로 만들기',answer:'image',why:'글로 설명한 장면을 그림으로 생성하는 이미지 기능입니다.'},
  {id:'g',label:'낭독한 말을 글로 옮기기',answer:'voice',why:'말을 글로 옮기는 음성 기능입니다.'},
  {id:'h',label:'받아쓰기 문장을 음성으로 읽어 주기',answer:'voice',why:'글을 음성으로 합성하는 음성 기능입니다.'}]});

 // The same question answered three ways. What the learner can open depends on how the tool shows its basis.
 const SAME='답의 문장과 원문이 같은 내용입니다.';
 const BASIS={
  model:{tab:'학습한 지식으로만 답함',basis:'근거 표시 없음',check:'사실과 수치를 원문과 대조',mark:'',items:[
   {t:'식물은 빛, 물, 이산화 탄소를 이용해 양분을 만듭니다.',src:'직접 찾은 원문, 교과서 단원 예시 12쪽',ev:'식물은 빛, 물, 이산화 탄소를 이용해 스스로 양분을 만듭니다.',same:true,why:SAME},
   {t:'광합성은 주로 뿌리에서 일어납니다.',src:'직접 찾은 원문, 교과서 단원 예시 12쪽',ev:'광합성은 주로 잎에서 일어납니다.',same:false,why:'답은 뿌리, 원문은 잎입니다. 문장이 자연스러워도 내용이 맞는 것은 아닙니다.'},
   {t:'만든 양분은 줄기를 거쳐 식물 전체로 이동합니다.',src:'직접 찾은 원문, 교과서 단원 예시 13쪽',ev:'잎에서 만든 양분은 줄기를 거쳐 식물 전체로 이동합니다.',same:true,why:SAME}]},
  web:{tab:'웹 검색 결과를 반영함',basis:'참고한 웹 문서 링크',check:'링크의 원문과 답의 일치',mark:'링크',items:[
   {t:'식물은 빛과 물만 있으면 양분을 만듭니다.',n:1,src:'링크 1, 식물 관찰 블로그 글(예시)',ev:'식물은 빛과 물, 이산화 탄소로 양분을 만든다.',same:false,why:'답에는 이산화 탄소가 빠졌습니다. 링크가 있어도 답이 원문과 다를 수 있습니다.'},
   {t:'광합성은 주로 잎에서 일어납니다.',n:1,src:'링크 1, 식물 관찰 블로그 글(예시)',ev:'광합성이 일어나는 곳은 주로 잎이다.',same:true,why:SAME},
   {t:'양분은 뿌리, 줄기, 열매 등 여러 곳에 저장됩니다.',n:2,src:'링크 2, 묻고 답하기 게시판 글(예시)',ev:'양분은 뿌리, 줄기, 열매 등 여러 곳에 저장된다.',same:true,why:SAME}]},
  doc:{tab:'올린 자료에서 찾아 답함',basis:'자료 속 인용 위치',check:'인용 부분과 답의 일치',mark:'인용',items:[
   {t:'식물은 빛, 물, 이산화 탄소를 이용해 스스로 양분을 만듭니다.',n:1,src:'인용 1, 올린 교과서 단원 예시 12쪽',ev:'식물은 빛, 물, 이산화 탄소를 이용해 스스로 양분을 만듭니다.',same:true,why:SAME},
   {t:'광합성은 주로 잎에서 일어납니다.',n:2,src:'인용 2, 올린 교과서 단원 예시 12쪽',ev:'광합성은 주로 잎에서 일어납니다.',same:true,why:SAME},
   {t:'만든 양분은 모두 줄기에 저장됩니다.',n:3,src:'인용 3, 올린 교과서 단원 예시 13쪽',ev:'잎에서 만든 양분은 줄기를 거쳐 식물 전체로 이동합니다.',same:false,why:'답은 줄기에 저장, 원문은 줄기를 거쳐 이동입니다. 인용이 있어도 답이 원문과 다를 수 있습니다.'}]}};
 L.add('basisCompare','custom',{
  hint:'같은 질문에 <b>답을 만드는 방식</b>을 바꾸어 봅니다. 문장을 눌러 근거를 열고 원문과 일치하는지 판단하세요. 답과 자료는 이 활동을 위해 만든 예시입니다.',
  body:`<div class="md-split" style="--split:1.2fr 1fr"><div class="md-panel"><div class="s51-tabs">${Object.entries(BASIS).map(([k,v])=>`<button type="button" class="s51-tab" data-mode="${k}">${v.tab}</button>`).join('')}</div>
   <p class="s51-line"><b>질문</b> 광합성에 필요한 것과 일어나는 곳, 양분이 어떻게 되는지 알려 줘.</p><div class="s51-sents" id="s51-bs-sents"></div><ul class="md-list" id="s51-bs-info" style="margin-top:auto"></ul></div>
   <div class="md-panel"><h3>근거 열어 보기</h3><div class="s51-box" id="s51-bs-ev"></div><div class="md-choices" style="--n:2"><button type="button" class="md-choice" data-j="same">원문과 일치</button><button type="button" class="md-choice" data-j="diff">원문과 다름</button></div><p class="md-why" id="s51-bs-why"></p></div></div>`,
  state:()=>({mode:'model',sel:0,judged:{},open:{}}),
  render(ui,st,reset){
   ui.action('처음부터',reset);
   function draw(){
    const m=BASIS[st.mode],it=m.items[st.sel],k=st.mode+st.sel,shown=st.mode!=='model'||st.open[k],done=st.judged[k];
    ui.all('.s51-tab').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mode===st.mode)));
    ui.q('#s51-bs-sents').innerHTML=m.items.map((x,i)=>{const j=st.judged[st.mode+i];
     return `<button type="button" class="s51-sent" data-i="${i}" aria-pressed="${i===st.sel}" ${j?`data-result="${(j==='same')===x.same?'right':'wrong'}"`:''}><span>${esc(x.t)}</span>${m.mark?`<i>[${m.mark} ${x.n}]</i>`:''}</button>`}).join('');
    ui.q('#s51-bs-info').innerHTML=`<li><b>답의 근거</b><span>${m.basis}</span></li><li><b>교사가 확인할 점</b><span>${m.check}</span></li>`;
    ui.q('#s51-bs-ev').innerHTML=shown?`<small>${esc(it.src)}</small>${esc(it.ev)}`:'<small>근거 표시 없음</small>도구가 근거를 보여 주지 않습니다. 원문을 직접 찾아야 대조할 수 있습니다.<br><button type="button" class="md-btn" data-act="open">원문 직접 찾기</button>';
    ui.all('.md-choice[data-j]').forEach(b=>{b.disabled=!shown||!!done;b.removeAttribute('data-result');if(done){if((b.dataset.j==='same')===it.same)b.dataset.result='right';else if(b.dataset.j===done)b.dataset.result='wrong'}});
    const good=done&&(done==='same')===it.same,why=ui.q('#s51-bs-why');why.hidden=!done;why.textContent=done?`${good?'맞게 판단했습니다.':'다시 살펴볼 문장입니다.'} ${it.why}`:'';
    const total=Object.keys(st.judged).length,right=Object.entries(st.judged).filter(([key,j])=>(j==='same')===BASIS[key.slice(0,-1)].items[key.slice(-1)].same).length;
    if(total===9)ui.say(`아홉 문장 가운데 ${right}개를 맞게 판단했습니다. 근거 표시가 없으면 원문을 직접 찾아야 하고, 링크와 인용이 있어도 일치 여부는 따로 확인합니다.`,'good');
    else if(done)ui.say(`${total} / 9 문장을 판단했습니다. 다른 문장과 다른 방식도 확인해 보세요.`,good?'good':'bad');
    else if(!shown)ui.say('근거 표시가 없으면 교사가 원문을 직접 찾아 대조해야 합니다.');
    else ui.say(st.mode==='model'?'직접 찾은 원문과 답의 문장을 비교해 판단하세요.':st.mode==='web'?'링크의 원문과 답의 문장을 비교해 판단하세요.':'인용한 부분과 답의 문장을 비교해 판단하세요.');
   }
   ui.body.addEventListener('click',e=>{
    const tab=e.target.closest('.s51-tab'),sent=e.target.closest('.s51-sent'),judge=e.target.closest('.md-choice[data-j]');
    if(tab){st.mode=tab.dataset.mode;st.sel=0}
    else if(sent)st.sel=Number(sent.dataset.i);
    else if(e.target.closest('[data-act=open]'))st.open[st.mode+st.sel]=true;
    else if(judge&&!judge.disabled)st.judged[st.mode+st.sel]=judge.dataset.j;
    else return;
    draw();
   });draw();
  }});

 // The table cells are the ones on the slide before; the rules only compare the age with the numbers in them.
 const any=(tone,text)=>()=>[tone,text],from13=a=>a<13?['fail','13세 미만은 이용 연령에 맞지 않습니다.']:['warn','13세 이상입니다. 국가별 연령도 확인합니다.'];
 const TOOLS=[
  {name:'ChatGPT',personal:['13세 이상, 18세 미만은 보호자 허락',a=>a<13?['fail','13세 미만은 이용 연령에 맞지 않습니다.']:a<18?['warn','18세 미만이므로 보호자 허락이 필요합니다.']:['ok','이용 연령에 맞습니다.']],school:['ChatGPT Edu 등 기관용 별도',any('warn','기관용 서비스의 조건을 따로 확인합니다.')]},
  {name:'Gemini 앱',personal:['13세 이상 또는 국가별 연령',from13],school:['Workspace for Education, 관리자가 허용',any('warn','학교 관리자가 허용했는지 확인합니다.')]},
  {name:'Claude',personal:['18세 이상',a=>a<18?['fail','18세 미만은 이용 연령에 맞지 않습니다.']:['ok','이용 연령에 맞습니다.']],school:['Claude for Teachers는 미국 교사 전용, 학생 불가',any('fail','학생은 쓸 수 없습니다.')]},
  {name:'Microsoft Copilot',personal:['13세 이상 또는 국가별 연령',from13],school:['학교 계정 Copilot Chat, 13세 이상 학생',a=>a<13?['fail','13세 미만 학생은 대상이 아닙니다.']:['ok','13세 이상 학생에 해당합니다.']]},
  {name:'Gemini Notebook',personal:['동의 연령 이상, 일부 기능 18세 이상',a=>['warn',a<18?'동의 연령을 확인합니다. 일부 기능은 쓸 수 없습니다.':'동의 연령 이상인지 확인합니다.']],school:['모든 연령, 일부 기능 18세 이상',a=>a<18?['warn','쓸 수 있지만 일부 기능은 쓸 수 없습니다.']:['ok','이용 연령에 맞습니다.']]}];
 L.add('ageCheck','custom',{
  hint:'도구, 계정, 학생 나이를 바꾸어 <b>학생이 직접 쓰는 활동</b>의 연령 조건을 확인합니다. 앞 슬라이드의 표(2026년 9월 확인)를 옮긴 것입니다.',
  body:`<div class="md-split" style="--split:1fr 1.5fr"><div class="md-panel"><h3>조건 바꾸기</h3>
   <label class="s51-field">도구<select id="s51-ag-tool">${TOOLS.map((t,i)=>`<option value="${i}">${t.name}</option>`).join('')}</select></label>
   <div class="s51-field">계정<div class="s51-tabs"><button type="button" class="s51-tab" data-account="personal">개인 계정</button><button type="button" class="s51-tab" data-account="school">학교, 기관 계정</button></div></div>
   <label class="md-slider" style="grid-template-columns:4.6em 1fr 4.2em">학생 나이<input type="range" id="s51-ag-age" min="7" max="18" step="1"><output id="s51-ag-out"></output></label>
   <h3 style="margin-top:.4em">앞 슬라이드의 표에서</h3><ul class="s51-checks" id="s51-ag-cells"></ul>
   <p class="s51-note" style="margin-top:auto">약관과 도움말은 바뀔 수 있습니다. 수업 전에 각 서비스의 공식 문서를 다시 확인합니다.</p></div>
   <div class="md-panel"><h3>확인 결과</h3><ul class="s51-checks" id="s51-ag-list"></ul><p class="md-verdict s51-verdict" id="s51-ag-verdict"></p></div></div>`,
  state:()=>({tool:0,account:'personal',age:11}),
  render(ui,st,reset){
   ui.action('처음 값으로',reset);
   function draw(){
    ui.q('#s51-ag-tool').value=st.tool;ui.q('#s51-ag-age').value=st.age;ui.q('#s51-ag-out').textContent=`만 ${st.age}세`;
    ui.all('[data-account]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.account===st.account)));
    ui.q('#s51-ag-cells').innerHTML=[['personal','개인 계정'],['school','학교, 기관 계정']].map(([k,label])=>`<li data-on="${k===st.account}" style="grid-template-columns:1fr"><div><b>${label}</b><span>${esc(TOOLS[st.tool][k][0])}</span></div></li>`).join('');
    const [cell,rule]=TOOLS[st.tool][st.account],rows=[['약관의 이용 연령',cell,rule(st.age)],
     ['개인정보 보호법 제22조의2','만 14세 미만 아동의 개인정보 처리',st.age<14?['warn','법정대리인의 동의를 받아야 합니다.']:['ok','만 14세 이상입니다.']],
     ['UNESCO 권고','교실에서 생성형 AI를 쓰는 최소 연령 13세',st.age<13?['warn','권고한 최소 연령보다 어립니다.']:['ok','권고한 최소 연령 이상입니다.']]];
    ui.q('#s51-ag-list').innerHTML=rows.map(([a,b,[tone,text]])=>`<li data-tone="${tone}"><div><b>${a}</b><span>${esc(b)}</span></div><em>${text}</em></li>`).join('');
    const fail=rows[0][2][0]==='fail',warn=rows.filter(r=>r[2][0]==='warn').length,v=ui.q('#s51-ag-verdict');
    v.textContent=fail?'교사 시연으로 바꿉니다':warn?`먼저 확인할 조건 ${warn}가지`:'연령 조건에 맞습니다';v.dataset.tone=fail?'bad':warn?'warn':'good';
    ui.say(fail?'조건을 맞추기 어려우면 교사가 화면을 시연하고 학생은 결과를 검토하는 방식으로 바꿉니다.':'연령 기준을 넘더라도 학교는 도구가 학생에게 적합한지 먼저 검증해야 합니다.',fail?'bad':'');
   }
   ui.body.addEventListener('input',e=>{if(e.target.id==='s51-ag-age')st.age=Number(e.target.value);else if(e.target.id==='s51-ag-tool')st.tool=Number(e.target.value);else return;draw()});
   ui.body.addEventListener('click',e=>{const b=e.target.closest('[data-account]');if(b){st.account=b.dataset.account;draw()}});draw();
  }});

 // A three-step toy model. The numbers are made up; the draw uses a fixed sequence so every visit shows the same runs.
 const NT_START=['식물은','햇빛을','받아'],NT_FIRST=[['잎에서',62],['스스로',25],['뿌리에서',13]],NT_LAST=[['만듭니다.',85],['만들어 냅니다.',15]];
 const NT_SECOND={잎에서:[['양분을',70],['녹말을',20],['산소를',10]],스스로:[['양분을',80],['녹말을',20]],뿌리에서:[['양분을',75],['녹말을',25]]};
 const candidates=out=>[NT_FIRST,NT_SECOND[out[0]],NT_LAST][out.length]||null,NT_MAX=4,NT_SEED=2624;
 L.add('nextToken','custom',{
  hint:'요청 뒤에 올 토큰을 <b>확률에 따라</b> 하나씩 골라 문장을 이어 씁니다. 같은 요청을 여러 번 실행해 결과를 비교하세요. 확률은 이 활동을 위해 만든 예시입니다.',
  body:`<div class="md-split" style="--split:1.5fr 1fr"><div class="md-panel"><h3>요청과 이어 쓴 문장</h3><div class="s51-toks" id="s51-nt-toks"></div><h3 style="margin-top:.5em">다음 토큰 후보의 확률</h3><div class="s51-cands" id="s51-nt-cands"></div>
   <p class="s51-note" style="margin-top:auto">확률을 계산하고 하나를 고르는 일을 문장이 끝날 때까지 되풀이합니다. 사실을 조회하는 단계는 없습니다.</p></div>
   <div class="md-panel"><h3>같은 요청, 실행 결과</h3><ol class="s51-runs" id="s51-nt-runs"></ol></div></div>`,
  state:()=>({seed:NT_SEED,out:[],runs:[],last:null}),
  render(ui,st,reset){
   const over=()=>!candidates(st.out);
   function pick(){
    const c=candidates(st.out);if(!c)return;
    st.seed=(st.seed*1103515245+12345)&0x7fffffff;let r=st.seed/0x80000000*100,chosen=c[c.length-1];
    for(const item of c){if(r<item[1]){chosen=item;break}r-=item[1]}
    st.out.push(chosen[0]);st.last=chosen;
    if(over())st.runs.push({text:[...NT_START,...st.out].join(' '),bad:st.out[0]==='뿌리에서'});
   }
   const stepButton=ui.action('토큰 하나 고르기',()=>{pick();draw()},true),runButton=ui.action('끝까지 이어 쓰기',()=>{while(!over())pick();draw()});
   const againButton=ui.action('같은 요청 다시 실행',()=>{st.out=[];st.last=null;draw()},true);ui.action('처음부터',reset);
   function draw(){
    const c=candidates(st.out),full=st.runs.length>=NT_MAX;
    ui.q('#s51-nt-toks').innerHTML=NT_START.map(t=>`<span class="s51-tok">${t}</span>`).join('')+st.out.map(t=>`<span class="s51-tok" data-kind="gen">${t}</span>`).join('')+(c?'<span class="s51-tok" data-kind="next">다음 토큰</span>':'');
    ui.q('#s51-nt-cands').innerHTML=c?c.map(([t,p])=>`<div class="s51-cand"><b>${t}</b><div class="md-meter"><i style="width:${p}%"></i></div><span>${p}%</span></div>`).join(''):'<p class="s51-line">문장이 끝났습니다. 고른 토큰이 달라지면 문장도 달라집니다.</p>';
    ui.q('#s51-nt-runs').innerHTML=st.runs.length?st.runs.map((r,i)=>`<li data-tone="${r.bad?'bad':''}"><b>실행 ${i+1}</b>${esc(r.text)}${r.bad?' <em>사실과 다름</em>':''}</li>`).join(''):'<li><b>실행 1</b>아직 끝난 문장이 없습니다.</li>';
    stepButton.hidden=runButton.hidden=!c;againButton.hidden=!!c||full;
    const lastRun=st.runs[st.runs.length-1];
    if(c)ui.say(st.last?`'${st.last[0]}' 토큰을 골랐습니다(확률 ${st.last[1]}%). 확률이 낮은 후보도 뽑힐 수 있습니다.`:'확률이 높은 후보가 자주 뽑히지만 낮은 후보도 뽑힐 수 있습니다.');
    else if(lastRun.bad)ui.say('문장은 자연스럽지만 내용은 사실과 다릅니다. 그럴듯한 문장을 만드는 과정이며 사실을 조회하는 과정은 아닙니다.','bad');
    else if(full)ui.say('같은 요청인데 실행할 때마다 결과가 달랐습니다. 수업에 쓴 결과는 저장해 두고 사실은 따로 확인합니다.','good');
    else ui.say('문장이 끝났습니다. 같은 요청으로 다시 실행해 결과를 비교해 보세요.','good');
   }
   draw();
  }});

 // One limit shared by four parts. A unit of the textbook is counted as 24 cells.
 const LIMIT=100,SCALE=240,UNIT=24,SCOPES={book:['교과서 한 권 전체(여섯 단원)',UNIT*6],unit:['한 단원(3단원)',UNIT],part:['한 단원의 한 절(3단원 1절)',8]};
 const PARTS=[['ask','요청문','#3f5dae'],['doc','올린 자료','#8fa5e0'],['chat','이전 대화','#f0a202'],['answer','답변','#1f8a5b']];
 L.add('contextBudget','custom',{
  hint:'요청문, 올린 자료, 이전 대화, 답변이 <b>하나의 한도</b>를 나누어 씁니다. 자료의 범위를 바꾸어 한도 안에 넣어 보세요. 칸 수는 이 활동을 위해 만든 예시입니다.',
  body:`<div class="md-split" style="--split:1fr 1.25fr"><div class="md-panel"><h3>한 번의 요청에 넣을 것</h3>
   <label class="s51-field">올린 자료<select data-k="scope">${Object.entries(SCOPES).map(([k,v])=>`<option value="${k}">${v[0]}</option>`).join('')}</select></label>
   <label class="md-slider">요청문<input type="range" data-k="ask" min="2" max="12" step="1"><output></output></label>
   <label class="md-slider">이전 대화<input type="range" data-k="chat" min="0" max="40" step="2"><output></output></label>
   <label class="md-slider">답변<input type="range" data-k="answer" min="10" max="30" step="2"><output></output></label>
   <p class="s51-note" style="margin-top:auto">실제 한도는 모델마다 다릅니다. 여기서는 한도를 100칸, 한 단원을 24칸으로 두었습니다.</p></div>
   <div class="md-panel"><h3>맥락 길이의 한도와 쓴 양</h3><div><div class="s51-bar" id="s51-cx-bar"></div><div class="s51-scale"><span>한도 100칸</span></div></div><ul class="s51-legend" id="s51-cx-legend"></ul>
   <h3>요약 결과를 목차와 대조하면</h3><div class="s51-units" id="s51-cx-units"></div><p class="md-verdict" id="s51-cx-verdict"></p></div></div>`,
  state:()=>({scope:'book',ask:4,chat:20,answer:20}),
  render(ui,st,reset){
   ui.action('처음 값으로',reset);
   function draw(){
    ui.all('[data-k]').forEach(n=>{n.value=st[n.dataset.k];if(n.type==='range')n.nextElementSibling.textContent=st[n.dataset.k]+'칸'});
    const doc=SCOPES[st.scope][1],size={ask:st.ask,doc,chat:st.chat,answer:st.answer},total=st.ask+doc+st.chat+st.answer,room=LIMIT-st.ask-st.chat-st.answer,over=total-LIMIT;
    ui.q('#s51-cx-bar').innerHTML=PARTS.map(([k,,color])=>`<i style="width:${size[k]/SCALE*100}%;background:${color}"></i>`).join('')+'<u></u>';
    ui.q('#s51-cx-legend').innerHTML=PARTS.map(([k,name,color])=>`<li><i style="background:${color}"></i>${name}<b>${size[k]}칸</b></li>`).join('');
    const fit=Math.max(0,Math.min(6,Math.floor(room/UNIT)));
    ui.q('#s51-cx-units').innerHTML=[1,2,3,4,5,6].map(n=>{const status=st.scope==='book'?(n<=fit?'in':'out'):n!==3?'skip':room>=doc?'in':'out';
     return `<span data-st="${status}">${n}단원<small>${status==='in'?'반영':status==='out'?'빠질 수 있음':'다음 요청'}</small></span>`}).join('');
    const v=ui.q('#s51-cx-verdict');v.textContent=over>0?`한도를 ${over}칸 넘음`:`한도 안, ${total} / ${LIMIT}칸`;v.dataset.tone=over>0?'bad':'good';
    ui.say(over<=0?'한도 안에 들어왔습니다. 나누어 요청한 뒤에도 요약에 빠진 항목이 없는지 목차와 대조합니다.':st.scope==='book'?'자료가 한도를 넘으면 일부 내용이 답에 반영되지 않을 수 있습니다. 단원이나 절 단위로 나누어 요청해 보세요.':'자료는 줄였지만 이전 대화와 답변도 같은 한도를 나누어 씁니다. 다른 부분을 줄여 보세요.',over>0?'bad':'good');
   }
   ui.body.addEventListener('input',e=>{const k=e.target.dataset.k;if(k){st[k]=k==='scope'?e.target.value:Number(e.target.value);draw()}});draw();
  }});

 // Toy retrieval: the two pieces that share the most words with the question become the material of the answer.
 const PIECES=['식물은 빛, 물, 이산화 탄소를 이용해 스스로 양분을 만들며, 이를 광합성이라고 합니다.','광합성은 주로 잎에서 일어나고, 만든 양분은 줄기를 거쳐 식물 전체로 이동합니다.','뿌리는 땅속의 물을 흡수하고 식물을 받쳐 줍니다.',
  '줄기는 뿌리에서 흡수한 물이 이동하는 통로입니다.','잎에 도달한 물이 기공을 통해 식물 밖으로 빠져나가는 것을 증산 작용이라고 합니다.','잎에 아이오딘-아이오딘화 칼륨 용액을 떨어뜨려 청람색으로 변하면 녹말이 있는 것입니다.'];
 const STEMS=['광합성','아이오딘','청람색','이산화','식물','양분','줄기','이동','뿌리','땅속','흡수','통로','도달','기공','빠져나','증산','용액','녹말'],SHORT=['빛','물','잎','밖'],SHOWN={이산화:'이산화 탄소',빠져나:'빠져나가다'};
 const ENDING=/^(은|는|이|가|을|를|에|의|와|과|로|으로|도|만|에서|에는|에서는|에도|이란|란|까지|부터|이나|입니다|인가요|일까요|이에요|예요)?$/;
 const stem=token=>STEMS.find(s=>token.startsWith(s))||SHORT.find(s=>token.startsWith(s)&&ENDING.test(token.slice(1)));
 const stemsOf=text=>new Set(text.split(/[^가-힣A-Za-z0-9]+/).map(stem).filter(Boolean));
 const marked=(text,hit)=>text.split(/([^가-힣A-Za-z0-9]+)/).map(part=>hit.has(stem(part))?`<mark>${esc(part)}</mark>`:esc(part)).join('');
 const PIECE_STEMS=PIECES.map(stemsOf);
 const ASKS=[['질문 1','광합성에는 무엇이 필요한가요?',0],['질문 2','녹말이 있는지 어떻게 확인하나요?',5],['질문 3','뿌리에서 흡수한 물은 어디로 빠져나가나요?',4],['질문 3 고쳐 쓰기','잎에서 물이 빠져나가는 것을 무엇이라고 하나요?',4]];
 L.add('ragSteps','custom',{
  hint:'질문을 고르거나 적으면 여섯 조각 가운데 <b>낱말이 가장 많이 겹치는 두 조각</b>을 찾아 인용과 함께 답합니다. 자료와 답은 이 활동을 위해 만든 예시입니다.',
  body:`<div class="md-split" style="--split:1.3fr 1fr"><div class="md-panel"><h3>올린 자료, 교과서 단원 예시를 여섯 조각으로 나눔</h3><ul class="s51-ps" id="s51-rg-ps"></ul>
   <p class="s51-note" style="margin-top:auto">실제 도구는 낱말이 아니라 의미를 수치 벡터로 바꾸어 가까운 부분을 찾습니다.</p></div>
   <div class="md-panel"><h3>질문</h3><div class="md-chips">${ASKS.map((a,i)=>`<button type="button" class="md-chip" data-ask="${i}">${a[0]}</button>`).join('')}</div>
   <form class="md-reason" id="s51-rg-form" style="margin:0"><input type="text" maxlength="40" autocomplete="off" aria-label="자료에 관한 질문" placeholder="자료에 관한 질문을 적어 보세요"><button class="md-btn primary" type="submit">묻기</button></form>
   <div class="s51-words" id="s51-rg-words"></div><h3>찾은 조각으로 만든 답</h3><div class="s51-answer" id="s51-rg-answer"></div></div></div>`,
  state:()=>({q:ASKS[0][1]}),
  render(ui,st,reset){
   ui.action('처음부터',reset);
   function draw(){
    const hit=stemsOf(st.q),score=PIECE_STEMS.map(set=>[...set].filter(s=>hit.has(s)).length),ask=ASKS.findIndex(a=>a[1]===st.q),target=ask<0?-1:ASKS[ask][2];
    const found=score.map((s,i)=>[s,i]).filter(([s])=>s>0).sort((a,b)=>b[0]-a[0]||a[1]-b[1]).slice(0,2).map(([,i])=>i),missed=target>=0&&!found.includes(target);
    ui.q('#s51-rg-form input').value=st.q;ui.all('[data-ask]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.ask)===ask)));
    ui.q('#s51-rg-ps').innerHTML=PIECES.map((p,i)=>`<li data-found="${found.includes(i)}" data-miss="${missed&&i===target}"><b>[${i+1}]</b><span>${marked(p,hit)}</span><em>${missed&&i===target?'답은 여기, ':''}겹친 낱말 ${score[i]}</em></li>`).join('');
    ui.q('#s51-rg-words').innerHTML=hit.size?`질문에서 찾은 낱말 ${[...hit].map(s=>`<mark>${SHOWN[s]||s}</mark>`).join(' ')}`:'질문에서 자료와 겹치는 낱말을 찾지 못했습니다.';
    ui.q('#s51-rg-answer').innerHTML=found.length?found.map(i=>`<div>${esc(PIECES[i])} <b>[${i+1}]</b></div>`).join(''):'<div>자료에서 찾을 수 없습니다.</div>';
    if(!found.length)ui.say('질문의 낱말이 자료에 없어 찾은 조각이 없습니다. 자료에 나오는 낱말로 바꾸어 물어보세요.');
    else if(target<0)ui.say('찾은 조각이 질문의 답을 담고 있는지는 인용한 원문을 읽어야 알 수 있습니다.');
    else if(missed)ui.say(`답은 ${target+1}번 조각에 있는데 낱말이 더 많이 겹친 다른 조각을 찾았습니다. 검색이 틀리면 인용이 붙어 있어도 답이 틀릴 수 있습니다.`,'bad');
    else ui.say(`답이 있는 ${target+1}번 조각을 찾았습니다. 찾은 부분이 답의 재료가 되고, 답의 문장과 근거 위치가 인용으로 연결됩니다.`,'good');
   }
   ui.q('#s51-rg-form').addEventListener('submit',e=>{e.preventDefault();const text=e.target.querySelector('input').value.trim();if(text){st.q=text;draw()}});
   ui.body.addEventListener('click',e=>{const chip=e.target.closest('[data-ask]');if(chip){st.q=ASKS[chip.dataset.ask][1];draw()}});draw();
  }});

 // Sentences are those of the request example on the slide before; the example question is made up.
 const ELEMENTS=[
  {id:'role',name:'역할',sub:'답하는 관점',text:'초등학교 과학 수업을 설계하는 교사의 관점으로 답해 줘.',guess:'누구의 관점으로 답할지 추측함',set:'과학 수업을 설계하는 교사의 관점'},
  {id:'context',name:'맥락',sub:'대상과 상황',text:'대상은 초등 고학년 학생, 수업 시간은 40분으로 생각해 줘.',guess:'학년이 정해지지 않은 설명',set:'초등 고학년, 40분 수업에 맞춤'},
  {id:'task',name:'과업',sub:'해야 할 일',text:'광합성을 배우는 차시의 도입 질문 세 개를 만들어 줘.',guess:'설명과 긴 활동 목록',set:'도입 질문 세 개'},
  {id:'format',name:'형식',sub:'결과의 모양',text:'질문, 예상 답, 이어질 활동을 열로 하는 표로 정리해 줘.',guess:'줄글과 목록이 섞임',set:'질문, 예상 답, 이어질 활동의 표'},
  {id:'rule',name:'조건',sub:'지킬 기준',text:'교과서에서 쓰는 용어를 사용해 줘.',guess:'교과서와 다른 용어가 섞일 수 있음',set:'교과서에서 쓰는 용어'},
  {id:'example',name:'예시',sub:'원하는 결과의 본보기',text:'"식물도 밥을 먹을까요?"와 같은 수준의 질문으로 만들어 줘.',guess:'질문의 수준을 추측함',set:'예시 질문과 같은 수준'}];
 L.add('promptBuild','custom',{
  hint:'모호한 요청에 요소를 <b>한 번에 하나씩</b> 더해 봅니다. 도구가 추측으로 채우는 부분이 어떻게 줄어드는지 확인하세요. 결과의 특징은 이 활동을 위해 만든 예시입니다.',
  body:`<div class="md-split" style="--split:.72fr 1.2fr 1.1fr"><div class="s51-els">${ELEMENTS.map(e=>`<button type="button" class="s51-el" data-el="${e.id}"><b>${e.name}</b><small>${e.sub}</small></button>`).join('')}</div>
   <div class="md-panel"><h3>지금의 요청문</h3><div class="s51-req" id="s51-pb-req"></div><p class="s51-note" id="s51-pb-count" style="margin-top:auto"></p></div>
   <div class="md-panel"><h3>결과의 특징</h3><ul class="s51-feat" id="s51-pb-feat"></ul><h3 style="margin-top:auto">결과의 모양</h3><div class="s51-shape" id="s51-pb-shape" aria-hidden="true"></div></div></div>`,
  state:()=>({on:[]}),
  render(ui,st,reset){
   ui.action('처음부터',reset);
   function draw(){
    const has=id=>st.on.includes(id),n=st.on.length;
    ui.all('.s51-el').forEach(b=>b.setAttribute('aria-pressed',String(has(b.dataset.el))));
    ui.q('#s51-pb-req').innerHTML=ELEMENTS.filter(e=>has(e.id)||e.id==='task').map(e=>has(e.id)?`<div><b>${e.name}</b><span>${esc(e.text)}</span></div>`:'<div data-vague="true"><b>과업</b><span>광합성 수업 자료 만들어 줘.</span></div>').join('');
    ui.q('#s51-pb-count').textContent=`담긴 요소 ${n}개, 도구가 추측으로 채우는 부분 ${6-n}곳`;
    ui.q('#s51-pb-feat').innerHTML=ELEMENTS.map(e=>`<li data-set="${has(e.id)}"><b>${e.name}</b><span>${has(e.id)?e.set:e.guess}</span></li>`).join('');
    const rows=has('task')?3:6,bars=k=>`<div style="--c:${k}">${'<i></i>'.repeat(k)}</div>`;
    ui.q('#s51-pb-shape').innerHTML=has('format')?'<div style="--c:3"><b>질문</b><b>예상 답</b><b>이어질 활동</b></div>'+bars(3).repeat(rows):bars(1).repeat(rows);
    const last=ELEMENTS.find(e=>e.id===st.on[n-1]);
    ui.say(n===6?'여섯 요소를 모두 담았습니다. 좋은 요청문은 길이보다 필요한 정보가 들어 있는지로 판단합니다.':n?`${last.name} 요소를 더했습니다. 결과의 특징에서 무엇이 달라졌는지 확인한 뒤 다음 요소를 더해 보세요.`:'과업만 있는 모호한 요청입니다. 왼쪽에서 요소를 하나 골라 더해 보세요.',n===6?'good':'');
   }
   ui.body.addEventListener('click',e=>{const b=e.target.closest('.s51-el');if(!b)return;const id=b.dataset.el;st.on=st.on.includes(id)?st.on.filter(x=>x!==id):[...st.on,id];draw()});draw();
  }});

 const SIX=['역할','맥락','과업','형식','조건','예시'];
 L.add('fixQuiz','quiz',{hint:'결과가 기대와 다를 때 요청문의 <b>어느 요소</b>를 고칠지 골라 봅니다. 상황은 이 활동을 위해 만든 예시입니다.',closing:'결과가 기대와 다르면 부족한 요소를 찾아 한 번에 한 가지씩 고칩니다.',questions:[
  {q:'"광합성 수업 자료 만들어 줘."라고 했더니 설명과 활동이 길게 섞여 나왔습니다.',short:'무엇을 만들지 분명하지 않을 때',choices:SIX,answer:2,why:'과업은 해야 할 일입니다. "도입 질문 세 개를 만들어 줘."처럼 구체적으로 요청합니다.'},
  {q:'도입 질문은 나왔지만 초등 고학년 학생이 이해하기 어려운 수준입니다.',short:'학년 수준이 맞지 않을 때',choices:SIX,answer:1,why:'맥락은 학년, 차시 목표, 수업 시간, 학생 수준처럼 결과를 결정하는 상황 정보입니다.'},
  {q:'내용은 괜찮은데 긴 줄글이어서 활동지에 바로 쓰기 어렵습니다.',short:'결과의 모양이 맞지 않을 때',choices:SIX,answer:3,why:'형식은 결과의 모양입니다. "질문, 예상 답, 이어질 활동을 열로 하는 표로 만들어 줘."처럼 요청합니다.'},
  {q:'교과서에서 쓰지 않는 용어가 답에 섞여 있습니다.',short:'지킬 기준이 빠졌을 때',choices:SIX,answer:4,why:'조건은 지킬 기준입니다. 교과서 용어 사용처럼 반드시 지킬 기준을 적습니다.'},
  {q:'"좋은 질문으로 해 줘."라고 했지만 원하는 질문의 수준이 전해지지 않았습니다.',short:'원하는 결과의 본보기가 없을 때',choices:SIX,answer:5,why:'예시는 원하는 결과의 본보기입니다. "이 질문과 같은 수준으로 두 개를 더 만들어 줘."처럼 요청합니다.'},
  {q:'결과가 기대와 달라 역할, 형식, 조건을 한꺼번에 바꾸어 다시 요청했습니다. 무엇이 문제일까요?',short:'여러 요소를 함께 바꿀 때',choices:['요청문이 길어진다','무엇이 결과를 바꾸었는지 알기 어렵다','도구가 답하지 못한다'],answer:1,why:'여러 요소를 함께 바꾸면 무엇이 결과를 바꾸었는지 알기 어렵습니다. 한 번에 한 가지씩 고칩니다.'}]});
})();
