/* 4주차 오전, 데이터와 인공지능 학습 Part 1: activity slides. Tables, pictures and questions are examples written for these activities. */
(()=>{
 'use strict';
 const L=window.ceLabs;if(!L)return;const esc=L.esc;
 L.style(`.md-lab .s41-tbl{width:100%;margin:0;border-collapse:collapse;border-radius:0;box-shadow:none;overflow:visible;font-size:var(--fs,.95em)}
.md-lab .s41-tbl th,.md-lab .s41-tbl td{padding:var(--pad,.5em) .4em;border:1px solid #c9d3ec;font-size:1em;line-height:1.25;text-align:center;background:#fff}
.md-lab .s41-tbl thead th{background:#3f5dae;color:#fff;font-weight:800}.md-lab .s41-tbl tbody th{background:#ebf0fc;color:#2c478f;font-weight:800}
.ce-lab.md-lab .s41-note{font-size:.8em;line-height:1.4;color:#52607f}
.md-lab .s41-asks{flex:1;min-height:0;display:grid;grid-auto-rows:minmax(0,1fr);gap:.38em;margin:0;padding:0;list-style:none}
.md-lab .s41-ask{display:grid;grid-template-columns:minmax(0,1fr) auto auto;align-items:center;gap:.4em;padding:.1em .6em;border:1px solid #d5ddf1;border-radius:.5em;background:#fff;font-size:.88em;line-height:1.3}
.md-lab .s41-ask small{display:block;font-size:.88em;color:#3a4a6b}
.md-lab .s41-ask button{padding:.3em .8em;border:1px solid #9fb0dc;border-radius:.5em;background:#ebf0fc;color:#2c478f;font-size:.92em;cursor:pointer;white-space:nowrap}
.md-lab .s41-ask button:disabled{cursor:default;opacity:.4}.md-lab .s41-ask button[data-chosen=true]{opacity:1;border-color:#3f5dae;background:#3f5dae;color:#fff}
.md-lab .s41-bits{display:grid;grid-template-columns:repeat(8,minmax(0,1fr));gap:.45em}
.md-lab .s41-bits div{display:grid;gap:.2em;justify-items:center;font-size:.85em;color:#52607f}
.md-lab .s41-bit{width:100%;height:2em;border:1px solid #9fb0dc;border-radius:.3em;background:#fff;color:#8a96b3;font-size:2em;font-weight:800;line-height:1;cursor:pointer}
.md-lab .s41-bit[data-on=true]{border-color:#3f5dae;background:#3f5dae;color:#fff}
.ce-lab.md-lab .s41-sum{font-size:1.2em;font-weight:800;text-align:center}
.md-lab .s41-todo li[data-done=true]{border-color:#1f8a5b;background:#e3f5ec}.md-lab .s41-todo small{color:#52607f}
.md-lab .s41-swatches{flex:1;min-height:0;display:grid;grid-template-columns:1fr 1fr;gap:.8em}
.md-lab .s41-swatch{display:flex;flex-direction:column;gap:.3em;min-height:0;font-size:.88em;line-height:1.3;text-align:center}
.md-lab .s41-swatch i{flex:1;min-height:0;border:1px solid #9fb0dc;border-radius:.6em}
.md-lab .s41-code{font-family:Consolas,'Courier New',monospace;letter-spacing:.04em}
.md-lab .s41-grid{flex:none;display:grid;grid-template-columns:repeat(var(--n),minmax(0,1fr));gap:.14em;width:var(--w,16em);margin:auto}
.md-lab .s41-grid>*{aspect-ratio:1;display:grid;place-items:center;min-width:0;padding:0;border:1px solid #b9c6e6;border-radius:.14em;background:#fff;color:#1c2c4c;font-size:.92em;line-height:1}
.md-lab .s41-grid button{cursor:pointer}.md-lab .s41-grid [data-v="1"]{background:#1c2c4c}
.md-lab .s41-rec>*{background:#f1f4fb}.md-lab .s41-rec [data-miss=true]{background:#fdeceb;color:#b5372f;font-weight:800}
.md-lab .s41-grid button[data-miss=true]{outline:.16em solid #c2413b;outline-offset:-.16em}
.md-lab .s41-seg{display:grid;grid-template-columns:1fr 1fr;gap:.4em}
.md-lab .s41-seg button{padding:.4em .3em;border:1px solid #9fb0dc;border-radius:.5em;background:#fff;color:#2c478f;font-size:.86em;line-height:1.25;cursor:pointer}
.md-lab .s41-cell{width:3em;height:1.9em;font-size:1em;border:1px solid #9fb0dc;border-radius:.4em;background:#fff;color:#8a96b3;font-weight:800;cursor:pointer}
.md-lab .s41-cell[data-v="1"]{background:#3f5dae;border-color:#3f5dae;color:#fff}.md-lab .s41-cell:disabled{cursor:default}
.md-lab .s41-cell[data-ok=true]{box-shadow:0 0 0 .16em #1f8a5b}.md-lab .s41-cell[data-ok=false]{box-shadow:0 0 0 .16em #c2413b}
.md-lab .s41-tbl.s41-inq{margin-top:.6em;font-size:.72em;font-weight:400}`);

 // The class survey table of the slide before it. Each question is judged against the columns the table has.
 const SURVEY=[[1,'도보',12,30,'봄'],[2,'버스',25,0,'겨울'],[3,'도보',8,15,'여름'],[4,'자전거',15,'','가을'],[5,'버스',180,20,'봄']];
 const ASKS=[{q:'버스로 통학하는 학생은 몇 명인가요?',can:true,why:'통학 방법 열에서 버스를 세면 2명입니다.'},
  {q:'독서 시간이 길면 성적도 높은가요?',can:false,why:'성적을 기록한 열이 없습니다.'},
  {q:'통학 시간이 가장 짧은 학생은 몇 번인가요?',can:true,why:'통학 시간 열에서 가장 작은 값은 3번의 8분입니다.'},
  {q:'비 오는 날에는 통학 시간이 더 걸리나요?',can:false,why:'날씨를 기록한 열이 없습니다.'},
  {q:'봄을 좋아하는 학생은 몇 명인가요?',can:true,why:'좋아하는 계절 열에서 봄을 세면 2명입니다.'},
  {q:'4번 학생은 어제 책을 몇 분 읽었나요?',can:false,why:'4번의 독서 시간 칸이 비어 있습니다.'}];
 L.add('tableAsk','custom',{
  hint:'앞 슬라이드의 예시 표입니다. 여섯 질문을 <b>이 표만으로 답할 수 있는지</b> 나누어 봅니다.',
  body:`<div class="md-split" style="--split:1fr 1.12fr"><div class="md-panel"><h3>우리 반 생활 설문(예시)</h3><table class="s41-tbl"><thead><tr><th>번호</th><th>통학 방법</th><th>통학 시간(분)</th><th>어제 독서 시간(분)</th><th>좋아하는 계절</th></tr></thead>
   <tbody>${SURVEY.map(r=>`<tr><th scope="row">${r[0]}</th>${r.slice(1).map(v=>`<td>${v}</td>`).join('')}</tr>`).join('')}</tbody></table>
   <p class="s41-note" style="margin-top:auto">질문을 나눈 뒤에는 표에서 이상해 보이는 칸이나 값이 있는지도 찾아봅니다.</p></div>
   <div class="md-panel"><h3>이 표만으로 답할 수 있을까</h3><ul class="s41-asks"></ul></div></div>`,
  state:()=>({a:{}}),
  render(ui,st,reset){
   ui.action('처음부터',reset);
   const draw=()=>{
    ui.q('.s41-asks').innerHTML=ASKS.map((it,i)=>{const done=st.a[i]!==undefined;
     return `<li class="s41-ask" ${done?`data-result="${st.a[i]===it.can?'right':'wrong'}"`:''}><span>${esc(it.q)}${done?`<small>${it.can?'답할 수 있습니다.':'답할 수 없습니다.'} ${esc(it.why)}</small>`:''}</span>${[['있다',true],['없다',false]].map(([t,v])=>`<button type="button" data-i="${i}" data-v="${v}" ${done?`disabled data-chosen="${st.a[i]===v}"`:''}>${t}</button>`).join('')}</li>`}).join('');
    const n=Object.keys(st.a).length,ok=ASKS.filter((it,i)=>st.a[i]===it.can).length;
    ui.say(n<ASKS.length?(n?`${ASKS.length}개 중 ${n}개를 나누었습니다.`:'질문마다 있다 또는 없다를 누르세요.'):`${ASKS.length}개 중 ${ok}개가 맞았습니다. 답할 수 없는 질문에는 어떤 열이나 값이 더 필요할까요?`,n===ASKS.length&&ok===n?'good':'');
   };
   ui.body.addEventListener('click',e=>{const b=e.target.closest('.s41-ask button');if(b&&st.a[b.dataset.i]===undefined){st.a[b.dataset.i]=b.dataset.v==='true';draw()}});draw();
  }});

 L.add('kindSort','sort',{hint:'아홉 가지 값을 <b>수치형</b>과 <b>범주형</b>으로 나눕니다. 숫자로 적는 값이 모두 수치형인지도 생각해 봅니다. 카드의 값은 예시입니다.',
  bins:[{id:'num',label:'수치형',sub:'양을 나타내어 크기 비교와 평균 계산이 가능한 값'},{id:'cat',label:'범주형',sub:'종류나 등급을 나타내는 값으로 평균을 내지 않음'}],cards:[
  {id:'a',label:'통학 시간',sub:'12분, 25분',answer:'num',why:'양을 나타내어 크기 비교와 평균 계산이 가능합니다.'},
  {id:'b',label:'통학 방법',sub:'도보, 버스, 자전거',answer:'cat',why:'종류를 나타내는 값으로 평균을 내지 않습니다.'},
  {id:'c',label:'교실 기온',sub:'21℃, 29℃',answer:'num',why:'단위와 함께 기록하는 양입니다.'},
  {id:'d',label:'좋아하는 계절',sub:'봄, 여름, 가을, 겨울',answer:'cat',why:'종류를 나타내는 값입니다.'},
  {id:'e',label:'학생 번호',sub:'1번, 2번, 3번',answer:'cat',why:'숫자로 적지만 양이 아니라 학생을 구별하는 값이어서 평균을 내지 않습니다.'},
  {id:'f',label:'어제 독서 시간',sub:'30분, 0분',answer:'num',why:'양을 나타내어 크기 비교와 평균 계산이 가능합니다.'},
  {id:'g',label:'만족도',sub:'높음, 보통, 낮음',answer:'cat',why:'순서가 있는 범주입니다. 등급을 나타내는 값입니다.'},
  {id:'h',label:'키',sub:'132cm, 140cm',answer:'num',why:'단위와 함께 기록하는 양입니다.'},
  {id:'i',label:'사물 이름',sub:'풀, 지우개',answer:'cat',why:'종류를 나타내는 값이며 AI 입력으로 쓰려면 숫자로 바꿉니다.'}]});

 // Eight switches are one byte. The same bits are read as a number and as a character code.
 const PLACE=[128,64,32,16,8,4,2,1],MAKE=[{v:13,label:'수 13',sub:'8 + 4 + 1'},{v:65,label:'문자 A',sub:'번호 65'},{v:97,label:'문자 a',sub:'번호 97'},{v:49,label:'숫자 문자 1',sub:'번호 49'}];
 L.add('bitSwitch','custom',{
  hint:'스위치 여덟 개가 8비트입니다. 눌러서 <b>0과 1</b>을 바꾸며 오른쪽의 네 값을 만들어 봅니다.',
  body:`<div class="md-split" style="--split:1.6fr 1fr"><div class="md-panel" style="justify-content:center;gap:.8em"><div class="s41-bits">${PLACE.map((p,i)=>`<div><span>${p}</span><button type="button" class="s41-bit" data-i="${i}" aria-label="${p}의 자리"></button></div>`).join('')}</div>
   <p class="s41-sum" id="s41-sum"></p><ul class="md-list"><li><span>이진수</span><b class="s41-code" id="s41-bin"></b></li><li><span>십진수</span><b id="s41-dec"></b></li><li><span>문자 코드로 읽으면</span><b id="s41-chr"></b></li></ul></div>
   <div class="md-panel"><h3>만들어 볼 값</h3><ul class="md-list s41-todo" id="s41-todo"></ul><p class="s41-note" style="margin-top:auto">스위치 8개로 만들 수 있는 조합은 256가지입니다. 이 활동은 번호 33부터 126까지만 문자로 보여 줍니다.</p></div></div>`,
  state:()=>({bits:[0,0,0,0,0,0,0,0],done:[]}),
  render(ui,st,reset){
   ui.action('처음부터',reset);
   const draw=()=>{
    const v=st.bits.reduce((n,b,i)=>n+b*PLACE[i],0),parts=PLACE.filter((p,i)=>st.bits[i]),bin=st.bits.join(''),hit=MAKE.find(m=>m.v===v);
    if(hit&&!st.done.includes(hit.v))st.done.push(hit.v);
    ui.all('.s41-bit').forEach((b,i)=>{b.textContent=st.bits[i];b.dataset.on=!!st.bits[i]});
    ui.q('#s41-sum').textContent=parts.length?`${parts.join(' + ')} = ${v}`:'켜진 자리가 없어 0';
    ui.q('#s41-bin').textContent=bin;ui.q('#s41-dec').textContent=v;ui.q('#s41-chr').textContent=v>=33&&v<=126?String.fromCharCode(v):'표시하지 않음';
    ui.q('#s41-todo').innerHTML=MAKE.map(m=>`<li data-done="${st.done.includes(m.v)}"><span><b>${m.label}</b> <small>${m.sub}</small></span><span>${st.done.includes(m.v)?'만듦':''}</span></li>`).join('');
    const next=MAKE.find(m=>!st.done.includes(m.v));
    ui.say(hit?`${hit.label}: ${bin}${next?`. 다음은 ${next.label}입니다.`:'. 네 값을 모두 만들었습니다. 같은 비트도 수로 읽을지 문자로 읽을지는 약속에 따릅니다.'}`:next?`${next.label}의 자리값을 골라 스위치를 눌러 보세요.`:'네 값을 모두 만들었습니다. 다른 값도 만들어 보세요.',hit?'good':'');
   };
   ui.body.addEventListener('click',e=>{const b=e.target.closest('.s41-bit');if(b){const i=Number(b.dataset.i);st.bits[i]=1-st.bits[i];draw()}});draw();
  }});

 // Three sliders are the three numbers stored for one pixel.
 const CH=['R','G','B'],GOALS=[{name:'빨강',rgb:[255,0,0]},{name:'노랑',rgb:[255,255,0]},{name:'회색',rgb:[128,128,128]}];
 L.add('rgbMix','custom',{
  hint:'한 픽셀의 <b>R, G, B 값</b>을 0부터 255까지 바꾸어 목표 색 세 가지를 차례로 만듭니다.',
  body:`<div class="md-split" style="--split:1.15fr 1fr"><div class="md-panel"><h3>이 픽셀에 저장할 값</h3>
   ${CH.map((c,i)=>`<label class="md-slider" style="grid-template-columns:5em 1fr 3em;font-size:1.05em;padding:.5em 0">${['빨강 R','초록 G','파랑 B'][i]}<input type="range" data-i="${i}" min="0" max="255" step="1"><output></output></label>`).join('')}
   <ul class="md-list" style="margin-top:auto"><li><span>저장되는 24비트</span><b class="s41-code" id="s41-rgbbits"></b></li></ul>
   <p class="s41-note">값마다 8비트, 한 픽셀에 24비트를 씁니다. 각 값이 목표와 16 이내로 가까우면 같은 색으로 봅니다.</p></div>
   <div class="md-panel"><div class="s41-swatches"><div class="s41-swatch"><b id="s41-goal"></b><i id="s41-goalbox"></i><span id="s41-goalval"></span></div><div class="s41-swatch"><b>내가 만든 색</b><i id="s41-mine"></i><span id="s41-myval"></span></div></div></div></div>`,
  state:()=>({rgb:[0,0,0],step:0}),
  render(ui,st,reset){
   const next=ui.action('다음 색',()=>{st.step++;draw()},true);ui.action('처음부터',reset);
   const css=c=>`rgb(${c.join(',')})`;
   function draw(){
    const over=st.step>=GOALS.length,goal=GOALS[Math.min(st.step,GOALS.length-1)],diff=goal.rgb.map((v,i)=>st.rgb[i]-v),match=diff.every(d=>Math.abs(d)<=16);
    ui.all('.md-slider input').forEach((n,i)=>{n.value=st.rgb[i];n.nextElementSibling.textContent=st.rgb[i]});
    ui.q('#s41-rgbbits').textContent=st.rgb.map(v=>v.toString(2).padStart(8,'0')).join(' ');
    ui.q('#s41-goal').textContent=over?'목표 색을 모두 만듦':`목표 색 ${st.step+1} / ${GOALS.length}: ${goal.name}`;ui.q('#s41-goalbox').style.background=css(goal.rgb);
    ui.q('#s41-goalval').textContent=match||over?`${goal.name}: R ${goal.rgb[0]}, G ${goal.rgb[1]}, B ${goal.rgb[2]}`:'값은 맞힌 뒤에 나타납니다';
    ui.q('#s41-mine').style.background=css(st.rgb);ui.q('#s41-myval').textContent=`R ${st.rgb[0]}, G ${st.rgb[1]}, B ${st.rgb[2]}`;
    next.hidden=over||!match;next.textContent=st.step===GOALS.length-1?'마치기':'다음 색';
    const todo=diff.map((d,i)=>Math.abs(d)<=16?'':`${CH[i]} 값을 ${d<0?'더 높게':'더 낮게'}`).filter(Boolean);
    ui.say(over?'세 색을 모두 만들었습니다. 사람에게는 색이지만 컴퓨터에는 세 숫자입니다.':match?`${goal.name}을 만들었습니다.`:`${todo.join(', ')} 바꾸어 보세요.`,over||match?'good':'');
   }
   ui.body.addEventListener('input',e=>{if(e.target.dataset.i){st.rgb[Number(e.target.dataset.i)]=Number(e.target.value);draw()}});draw();
  }});

 // Restoring a picture from its record, as in 실습 1. The picture differs from the one on the slide.
 const HEART=['01100110','10011001','10000001','10000001','01000010','00100100','00011000','00000000'],ONES=HEART.join('').split('1').length-1;
 L.add('pixelRestore','custom',{
  hint:'짝에게서 <b>기록만</b> 받았습니다. 오른쪽 모눈의 칸을 눌러 칠하며 그림을 복원합니다. 이 기록은 활동을 위해 만든 예시입니다.',
  body:`<div class="md-split"><div class="md-panel"><h3>받은 기록</h3><div class="s41-grid s41-rec" style="--n:8;--w:17em">${HEART.map((row,y)=>[...row].map(v=>`<span data-y="${y}">${v}</span>`).join('')).join('')}</div><p class="s41-note" style="text-align:center">약속: 한 줄에 여덟 칸, 1은 칠한 칸, 0은 빈칸</p></div>
   <div class="md-panel"><h3>복원하는 모눈</h3><div class="s41-grid" id="s41-paint" style="--n:8;--w:17em">${HEART.map((row,y)=>[...row].map((v,x)=>`<button type="button" data-k="${y*8+x}" aria-label="${y+1}째 줄 ${x+1}째 칸"></button>`).join('')).join('')}</div><p class="s41-note" style="text-align:center" id="s41-count"></p></div></div>`,
  state:()=>({cells:Array(64).fill(0),checked:false}),
  render(ui,st,reset){
   ui.action('확인',()=>{st.checked=true;draw()},true);ui.action('처음부터',reset);
   const want=HEART.join('');
   function draw(){
    const miss=st.cells.map((v,k)=>String(v)!==want[k]),rows=new Set(miss.map((m,k)=>m?k>>3:-1)),n=miss.filter(Boolean).length,painted=st.cells.filter(Boolean).length;
    ui.all('#s41-paint button').forEach((b,k)=>{b.dataset.v=st.cells[k];b.dataset.miss=st.checked&&miss[k]});
    ui.all('.s41-rec span').forEach(s=>{s.dataset.miss=st.checked&&rows.has(Number(s.dataset.y))});
    ui.q('#s41-count').textContent=`칠한 칸 ${painted}개, 기록의 1은 ${ONES}개`;
    ui.say(!st.checked?'기록을 한 줄씩 읽으며 1인 칸을 칠한 뒤 확인을 누르세요.':n?`기록과 다른 칸이 ${n}개 있습니다. 붉게 표시한 줄을 다시 세어 보세요.`:'기록만으로 그림을 복원했습니다. 한 줄에 여덟 칸, 1은 칠한 칸이라는 약속을 함께 알고 있었기 때문입니다.',st.checked?(n?'bad':'good'):'');
   }
   ui.body.addEventListener('click',e=>{const b=e.target.closest('#s41-paint button');if(b){const k=Number(b.dataset.k);st.cells[k]=1-st.cells[k];st.checked=false;draw()}});draw();
  }});

 // The face of the slide with four brightness steps. Fewer pixels: each 2 x 2 block becomes its rounded average.
 const FACE=['00333300','03111130','31311313','31111113','31211213','31122113','03111130','00333300'].map(r=>[...r].map(Number)),SHADE={2:['#fff','#1c2c4c'],4:['#fff','#c6d0ea','#7283b4','#1c2c4c']};
 const picture=(n,levels)=>{
  const full=FACE.map(r=>r.map(v=>levels===4?v:v>=2?1:0));
  return n===8?full:[0,2,4,6].map(y=>[0,2,4,6].map(x=>Math.floor((full[y][x]+full[y][x+1]+full[y+1][x]+full[y+1][x+1])/4+.5)));
 };
 L.add('pixelDetail','custom',{
  hint:'같은 그림을 <b>픽셀 수</b>와 <b>색 단계</b>를 바꾸어 기록합니다. 그림과 기록의 양이 어떻게 달라지는지 봅니다. 그림은 활동용 예시입니다.',
  body:`<div class="md-split" style="--split:1fr 1fr 1.05fr;gap:1em"><div class="md-panel"><h3>화면에 보이는 그림</h3><div class="s41-grid" id="s41-pic" style="--w:14.5em"></div></div><div class="md-panel"><h3>저장되는 기록</h3><div class="s41-grid s41-rec" id="s41-nums" style="--w:14.5em"></div></div>
   <div class="md-panel"><h3>픽셀 수</h3><div class="s41-seg" data-k="n"><button type="button" data-v="8">8×8</button><button type="button" data-v="4">4×4</button></div>
   <h3>색 단계</h3><div class="s41-seg" data-k="levels"><button type="button" data-v="2">2단계(0, 1)</button><button type="button" data-v="4">4단계(0~3)</button></div>
   <ul class="md-list" style="margin-top:auto"><li><span>기록의 수</span><b id="s41-cells"></b></li><li><span>한 칸의 비트 수</span><b id="s41-per"></b></li><li><span>기록의 양</span><b id="s41-total"></b></li></ul>
   <p class="s41-note">4×4는 이웃한 네 칸의 평균을 한 칸으로 기록합니다.</p></div></div>`,
  state:()=>({n:8,levels:2}),
  render(ui,st,reset){
   ui.action('처음 값으로',reset);
   const draw=()=>{
    const pic=picture(st.n,st.levels).flat(),per=st.levels===4?2:1,cells=st.n*st.n;
    ui.all('.s41-seg button').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.v)===st[b.parentElement.dataset.k])));
    ui.q('#s41-pic').style.setProperty('--n',st.n);ui.q('#s41-nums').style.setProperty('--n',st.n);
    ui.q('#s41-pic').innerHTML=pic.map(v=>`<span style="background:${SHADE[st.levels][v]}"></span>`).join('');ui.q('#s41-nums').innerHTML=pic.map(v=>`<span>${v}</span>`).join('');
    ui.q('#s41-cells').textContent=`${cells}개`;ui.q('#s41-per').textContent=`${per}비트`;ui.q('#s41-total').textContent=`${cells*per}비트`;
    ui.say(st.n===8?(st.levels===2?'8×8, 2단계: 기록 64개, 64비트입니다. 픽셀 수나 색 단계를 바꾸어 보세요.':'칸마다 0부터 3까지 쓰면 한 칸에 2비트가 필요해 기록의 양은 두 배인 128비트가 됩니다.')
     :(st.levels===2?'4×4로 줄이면 기록은 16개로 줄지만 눈과 입의 경계가 사라져 모양을 알아보기 어렵습니다.':'4×4, 4단계: 기록 16개, 32비트입니다. 색 단계를 늘려도 줄어든 픽셀에서 눈과 입은 돌아오지 않습니다.'));
   };
   ui.body.addEventListener('click',e=>{const b=e.target.closest('.s41-seg button');if(b){st[b.parentElement.dataset.k]=Number(b.dataset.v);draw()}});draw();
  }});

 // One-hot encoding of the commute column of the class table.
 const HOW=['도보','버스','도보','자전거','버스'],CATS=['도보','버스','자전거'];
 L.add('oneHot','custom',{
  hint:'예시 표의 통학 방법을 <b>원핫 인코딩</b>으로 바꿉니다. 1번처럼 2번부터 칸을 눌러 해당하면 1, 아니면 0으로 맞춥니다.',
  body:`<div class="md-split" style="--split:1.7fr 1fr"><div class="md-panel"><h3>우리 반 통학 방법(예시)</h3><table class="s41-tbl" id="s41-hot" style="--fs:1em;--pad:.5em"><thead><tr><th>번호</th><th>통학 방법</th><th>번호 붙이기</th>${CATS.map(c=>`<th>${c} 열</th>`).join('')}</tr></thead><tbody></tbody></table>
   <p class="s41-note" style="margin-top:auto">번호 붙이기는 도보 1, 버스 2, 자전거 3입니다. 모델이 3을 1보다 큰 값으로 오해할 수 있습니다.</p></div>
   <div class="md-panel"><h3>모델이 받는 값</h3><ul class="md-list" id="s41-vec"></ul></div></div>`,
  state:()=>({v:HOW.map((h,i)=>i?[0,0,0]:[1,0,0]),checked:false}),
  render(ui,st,reset){
   ui.action('확인',()=>{st.checked=true;draw()},true);ui.action('처음부터',reset);
   const good=i=>st.v[i].every((v,j)=>v===(CATS[j]===HOW[i]?1:0));
   function draw(){
    ui.q('#s41-hot tbody').innerHTML=HOW.map((h,i)=>`<tr><th scope="row" ${st.checked&&i?`data-result="${good(i)?'right':'wrong'}"`:''}>${i+1}${i?'':' (보기)'}</th><td>${h}</td><td>${CATS.indexOf(h)+1}</td>${CATS.map((c,j)=>`<td><button type="button" class="s41-cell" data-i="${i}" data-j="${j}" data-v="${st.v[i][j]}" aria-label="${i+1}번 ${c} 열" ${i?'':'disabled'} ${st.checked&&i?`data-ok="${good(i)}"`:''}>${st.v[i][j]}</button></td>`).join('')}</tr>`).join('');
    ui.q('#s41-vec').innerHTML=HOW.map((h,i)=>`<li><span>${i+1}번 ${h}</span><b class="s41-code">[${st.v[i].join(', ')}]</b></li>`).join('');
    const bad=HOW.filter((h,i)=>!good(i)).length;
    ui.say(!st.checked?'한 행에는 자기 통학 방법의 열에만 1이 들어갑니다. 다 채우면 확인을 누르세요.':bad?`${bad}개 행이 다릅니다. 붉게 표시한 행에서 1의 자리를 다시 확인하세요.`:'모든 행을 바꾸었습니다. 범주마다 열을 만들었으므로 자전거가 도보보다 큰 값으로 읽히지 않습니다.',st.checked?(bad?'bad':'good'):'');
   }
   ui.body.addEventListener('click',e=>{const b=e.target.closest('.s41-cell');if(b&&!b.disabled){const i=Number(b.dataset.i),j=Number(b.dataset.j);st.v[i][j]=1-st.v[i][j];st.checked=false;draw()}});draw();
  }});

 L.add('privacySwap','match',{hint:'처음 떠올린 수집 항목을 개인을 알아보기 어려운 방법으로 바꿉니다. 짝이 되는 <b>바꾼 수집 방법</b>을 이어 봅니다.',leftTitle:'처음 떠올린 항목',rightTitle:'바꾼 수집 방법',seed:9,pairs:[
  {left:'학생 이름',right:'번호나 모둠 기호'},{left:'얼굴이 나온 활동 사진',right:'사물이나 작품 사진'},{left:'생년월일',right:'학년'},{left:'발표 목소리 녹음',right:'악기 소리나 기계음'}]});

 const preview=`<table class="s41-tbl s41-inq" style="--pad:.3em"><thead><tr><th>학교 구분</th><th>학교수(개교)</th><th>학급수(개)</th><th>학생수(명)</th></tr></thead><tbody><tr><th scope="row">초등학교_국립</th><td>1</td><td>25</td><td>572</td></tr><tr><th scope="row">초등학교_공립</th><td>151</td><td>3867</td><td>75914</td></tr><tr><th scope="row">초등학교_사립</th><td>3</td><td>54</td><td>1621</td></tr></tbody></table>`;
 L.add('sourceQuiz','quiz',{hint:'데이터 수집과 공공데이터 확인에서 본 내용을 다섯 문항으로 점검합니다.',closing:'틀린 문항은 데이터 수집 절의 슬라이드에서 다시 확인해 보세요.',questions:[
  {q:'밝기 센서로 교실 밝기를 기록하려고 합니다. 먼저 정할 점은 무엇일까요?',short:'센서로 모을 때 먼저 정할 점',choices:['측정 간격과 센서 위치','문항의 뜻과 보기','기준일과 이용 조건'],answer:0,why:'센서는 측정 간격과 센서 위치를 먼저 정합니다. 문항의 뜻과 보기는 설문, 기준일과 이용 조건은 기존 자료에서 정할 점입니다.'},
  {q:'학교별 공시 정보를 찾을 수 있는 곳은 어디일까요?',short:'학교별 공시 정보를 찾는 곳',choices:['기상자료개방포털','학교알리미','AI 허브'],answer:1,why:'학교알리미에서 학교별 공시 정보를 찾을 수 있습니다. 기상자료개방포털은 관측 자료, AI 허브는 AI 학습용 데이터를 제공합니다.'},
  {q:'공공데이터포털에서 로그인 없이 CSV 같은 파일로 내려받는 제공 방식은 무엇일까요?',short:'로그인 없이 내려받는 제공 방식',choices:['파일데이터','오픈 API'],answer:0,why:'파일데이터는 로그인 없이 내려받고, 오픈 API는 회원 가입과 활용 신청 뒤 인증키를 받아 씁니다.'},
  {html:`학교 학급 학생수 현황 미리보기의 앞부분입니다. 한 행은 무엇을 나타낼까요?${preview}`,short:'미리보기의 한 행이 나타내는 것',choices:['학교 한 곳','학교급과 설립 구분별 합계','학생 한 명'],answer:1,why:'한 행은 개별 학교가 아니라 합계입니다. 전체 경향은 읽어도 개별 사례를 예측하는 학습 자료로 쓰기는 어렵습니다.'},
  {q:'공공누리 제3유형(출처표시, 변경금지) 자료를 수업 자료로 쓰려고 합니다. 맞는 방법은 무엇일까요?',short:'공공누리 제3유형 자료 쓰기',columns:1,choices:['출처를 표시하고 원본 그대로 쓴다','출처를 표시하고 필요한 부분만 고쳐 쓴다','출처 표시 없이 원본 그대로 쓴다'],answer:0,why:'제3유형은 변경금지 조건이 있어 원본 그대로 사용합니다. 출처표시는 네 유형에 모두 들어 있는 조건입니다.'}]});
})();
