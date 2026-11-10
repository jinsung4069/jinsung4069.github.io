/* Lecture 11: animations and student activities inserted between the converted slides.
   The simulations are simplified teaching examples. No AI model runs in the browser. */
(()=>{
 'use strict';
 const viewer=document.querySelector('.ce-viewer');if(!viewer)return;
 const KEY='ai-education-lecture11-v1',NAME='피지컬 AI 교육 사례와 인공지능 융합 교육';
 const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
 let state={};try{state=JSON.parse(sessionStorage.getItem(KEY)||'{}')}catch{}
 const save=()=>{try{sessionStorage.setItem(KEY,JSON.stringify(state))}catch{document.querySelectorAll('[data-save-status]').forEach(e=>e.textContent='자동 저장을 사용할 수 없습니다. 기록 파일을 내려받으세요.')}};
 const field=(key,label,value='',hint='')=>`<label class="ch5-field">${label}<textarea data-field="${key}" rows="2" placeholder="${esc(hint)}">${esc(value)}</textarea></label>`;
 const metrics=items=>`<div class="ch5-metrics">${items.map(([k,v])=>`<div><span>${k}</span><strong ${v}></strong></div>`).join('')}</div>`;
 function download(){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify({course:'AI교육의 이해 / 언플러그드AI교육',lecture:NAME,...state},null,2)],{type:'application/json'}));a.download='피지컬AI교육사례와인공지능융합교육_활동기록.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
 function shell(root,s,intro,html){root.innerHTML=`<div class="ch5-sheet l11"><h2>${esc(s.title)}</h2>${intro?`<p class="ch5-intro">${intro}</p>`:''}${html}<div class="ch5-footer"><p data-save-status>기록은 이 탭에 저장됩니다. 탭을 닫기 전에 내려받으세요.</p><button type="button" data-download>기록 내려받기</button></div></div>`;root.querySelector('[data-download]').onclick=download}
 function bind(root,d,after=()=>{}){root.querySelectorAll('[data-field]').forEach(e=>e.oninput=()=>{d[e.dataset.field]=e.value;save();after()})}
 /* One animation loop at a time. It stops when the activity leaves the screen. */
 let raf=0;
 function animate(root,frame){cancelAnimationFrame(raf);let last=0;const tick=t=>{if(!root.isConnected||root.hidden||!root.querySelector('.l11'))return;const dt=last?Math.min(.05,(t-last)/1000):0;last=t;frame(dt);raf=requestAnimationFrame(tick)};raf=requestAnimationFrame(tick)}
 const mix=(a,b,p)=>'#'+[0,2,4].map(i=>Math.round(parseInt(a.slice(1+i,3+i),16)*(1-p)+parseInt(b.slice(1+i,3+i),16)*p).toString(16).padStart(2,'0')).join('');

 /* ---------- 1. A device that follows a written rule ---------- */
 function rule(root,s){
  const d=state.rule??={threshold:50,note:''};let light=200,t=.5,playing=false,covered=false;
  const leds=Array.from({length:25},(_,i)=>`<circle data-led cx="${-32+i%5*16}" cy="${-22+Math.floor(i/5)*14}" r="5"/>`).join('');
  shell(root,s,'밝기를 바꾸거나 하루를 흘려 보내며 규칙의 조건과 LED를 살펴봅니다. 빛 감지 값의 범위는 0부터 255까지입니다.',`<div class="l11-sim"><svg class="l11-svg" viewBox="0 0 640 330" role="img" aria-label="창밖의 밝기에 따라 켜지고 꺼지는 LED 장치"><rect data-sky width="640" height="232"/><g data-stars fill="#fff"><circle cx="90" cy="50" r="2"/><circle cx="210" cy="92" r="1.6"/><circle cx="330" cy="40" r="2"/><circle cx="455" cy="80" r="1.6"/><circle cx="560" cy="46" r="2"/><circle cx="150" cy="150" r="1.4"/><circle cx="520" cy="150" r="1.4"/></g><circle data-sun r="26" fill="#f6b73c"/><rect y="232" width="640" height="98" fill="#d8c4a2"/><rect y="232" width="640" height="6" fill="#b89d73"/><g transform="translate(320,236)"><circle data-glow cy="-16" r="92" fill="#ff5a3c"/><rect x="-78" y="-66" width="156" height="118" rx="14" fill="#1f2f4d"/><rect x="-78" y="34" width="156" height="18" rx="6" fill="#c9a23a"/><g data-leds>${leds}</g><circle cx="58" cy="-48" r="8" fill="#9fd3ff" stroke="#fff" stroke-width="2"/><text x="96" y="-44" class="l11-label">빛 센서</text><g data-hand><rect x="38" y="-74" width="74" height="46" rx="20" fill="#e8b88f" stroke="#b9855c" stroke-width="2"/><text x="96" y="-84" class="l11-label">손으로 가림</text></g></g></svg><div><div class="l11-code" role="group" aria-label="블록 코드"><div class="l11-block">무한 반복</div><div class="l11-block l11-in1" data-if>만약 빛 감지 값 <b data-v></b> &lt; <b data-th></b> 이면 <em data-cond></em></div><div class="l11-block l11-in2" data-on>LED 켜기</div><div class="l11-block l11-in1">아니면</div><div class="l11-block l11-in2" data-off>LED 끄기</div></div><label class="l11-range">창밖의 밝기 <output data-light-out></output><input type="range" min="0" max="255" step="1" data-light></label><div class="ch5-inline"><label class="l11-num">기준값 <input type="number" min="0" max="255" step="5" data-threshold value="${esc(d.threshold)}"></label><button type="button" data-play aria-pressed="false">하루 흘려 보내기</button><button type="button" data-cover aria-pressed="false">손으로 센서 가리기</button></div></div></div>${metrics([['빛 감지 값','data-m-v'],['조건의 결과','data-m-c'],['LED','data-m-l']])}<div class="ch5-result" role="status" data-msg></div>${field('note','이 규칙으로 해결되지 않는 상황과 고칠 방법',d.note,'예, 낮에 커튼을 치면 LED가 켜진다.')}`);
  const $=q=>root.querySelector(q),sky=$('[data-sky]'),sun=$('[data-sun]'),range=$('[data-light]');
  function draw(){
   const th=clamp(Number(d.threshold)||0,0,255),v=covered?Math.min(light,6):light,on=v<th;
   sky.setAttribute('fill',mix('#101a33','#8ecfff',light/255));$('[data-stars]').setAttribute('opacity',clamp((70-light)/70,0,1));
   sun.setAttribute('cx',40+clamp(t,0,1)*560);sun.setAttribute('cy',250-light/255*200);
   $('[data-glow]').setAttribute('opacity',on?.28:0);root.querySelectorAll('[data-led]').forEach(e=>e.setAttribute('fill',on?'#ff5a3c':'#44506a'));
   $('[data-hand]').setAttribute('visibility',covered?'visible':'hidden');
   $('[data-v]').textContent=v;$('[data-th]').textContent=th;$('[data-cond]').textContent=on?'참':'거짓';
   $('[data-on]').classList.toggle('active',on);$('[data-off]').classList.toggle('active',!on);
   range.value=light;$('[data-light-out]').textContent=light;
   $('[data-m-v]').textContent=v;$('[data-m-c]').textContent=on?'참':'거짓';$('[data-m-l]').textContent=on?'켜짐':'꺼짐';
   $('[data-msg]').innerHTML=covered&&light>=th?'<strong>낮인데 LED가 켜졌습니다.</strong><p>장치는 어두워진 이유를 구분하지 못합니다. 센서값이 기준보다 작으면 켠다는 규칙만 따릅니다.</p>':on?'<strong>센서값이 기준값보다 작아 LED가 켜졌습니다.</strong><p>기준값과 동작은 사람이 미리 정했습니다.</p>':'<strong>센서값이 기준값 이상이라 LED가 꺼졌습니다.</strong><p>기준값을 바꾸면 켜지는 시점이 달라집니다.</p>';
  }
  range.oninput=()=>{light=+range.value;playing=false;$('[data-play]').setAttribute('aria-pressed','false');draw()};
  $('[data-threshold]').oninput=e=>{d.threshold=e.target.value;save();draw()};
  $('[data-cover]').onclick=e=>{covered=!covered;e.currentTarget.setAttribute('aria-pressed',String(covered));draw()};
  $('[data-play]').onclick=e=>{playing=!playing;e.currentTarget.setAttribute('aria-pressed',String(playing));if(playing&&t>=1.2)t=0};
  bind(root,d);draw();
  animate(root,dt=>{if(!playing)return;t+=dt/11;if(t>1.3)t=0;light=Math.round(clamp(Math.sin(Math.PI*clamp(t,0,1))*290,0,255));draw()});
 }

 /* ---------- 2. Sense, decide, act loop ---------- */
 function loop(root,s){
  const W=9,H=6,C=60,DIR=[[1,0],[0,1],[-1,0],[0,-1]],d=state.loop??={limit:1,note:''};
  let walls,bot,phase,shown,count,sense,decision,auto=false,anim=null,wait=0;
  const reset=()=>{walls=new Set(['4,1','4,2','2,3','6,4','7,1']);bot={x:1,y:4,h:0,px:1,py:4,pa:0};phase=0;shown=-1;count=0;sense=null;decision=null;anim=null};
  const blocked=(x,y)=>x<0||y<0||x>=W||y>=H||walls.has(x+','+y);
  let grid='';for(let i=1;i<W;i++)grid+=`<line x1="${i*C}" y1="0" x2="${i*C}" y2="${H*C}"/>`;for(let j=1;j<H;j++)grid+=`<line x1="0" y1="${j*C}" x2="${W*C}" y2="${j*C}"/>`;
  shell(root,s,'로봇은 초음파 센서로 앞의 거리를 재고, 규칙으로 판단하고, 바퀴로 움직입니다. 칸을 누르면 장애물을 놓거나 치웁니다.',`<div class="l11-sim"><svg class="l11-svg l11-arena" viewBox="0 0 ${W*C} ${H*C}" role="img" aria-label="장애물이 놓인 방과 로봇" data-arena><g class="l11-gridlines">${grid}</g><g data-walls></g><g data-bot><line data-beam x1="22" y1="0" y2="0"/><rect x="-22" y="-23" width="14" height="8" rx="3" fill="#333"/><rect x="-22" y="15" width="14" height="8" rx="3" fill="#333"/><rect x="6" y="-23" width="14" height="8" rx="3" fill="#333"/><rect x="6" y="15" width="14" height="8" rx="3" fill="#333"/><rect x="-24" y="-17" width="48" height="34" rx="9" fill="#31578e"/><circle cx="18" cy="-8" r="5" fill="#fff"/><circle cx="18" cy="8" r="5" fill="#fff"/></g></svg><div><ol class="l11-stages"><li data-stage="0"><b>감지</b><span data-s0></span></li><li data-stage="1"><b>판단</b><span data-s1></span></li><li data-stage="2"><b>행동</b><span data-s2></span></li></ol><p class="l11-back">행동이 환경을 바꾸고 다시 감지로 이어집니다. 되풀이 <b data-count>0</b>회</p><label class="l11-range">돌기 시작하는 거리 <output data-limit-out></output><input type="range" min="1" max="3" step="1" data-limit value="${esc(d.limit)}"></label><div class="ch5-inline"><button type="button" data-step>한 단계</button><button type="button" data-auto aria-pressed="false">자동 실행</button><button type="button" data-reset>처음으로</button></div></div></div><p class="ch5-note">이 로봇의 판단은 사람이 쓴 규칙입니다. 피지컬 AI에서는 판단 자리에 데이터로 학습한 모델이 들어갑니다.</p>${field('note','장애물을 바꾸었을 때 로봇의 움직임에서 달라진 점',d.note)}`);
  const $=q=>root.querySelector(q),g=$('[data-bot]'),beam=$('[data-beam]');
  function draw(){
   $('[data-walls]').innerHTML=[...walls].map(k=>{const [x,y]=k.split(',').map(Number);return `<rect x="${x*C+5}" y="${y*C+5}" width="${C-10}" height="${C-10}" rx="8" fill="#8a6f52"/>`}).join('');
   g.setAttribute('transform',`translate(${bot.px*C+C/2} ${bot.py*C+C/2}) rotate(${bot.pa})`);
   const show=sense!==null&&shown<2;beam.setAttribute('visibility',show?'visible':'hidden');if(show)beam.setAttribute('x2',Math.max(24,(sense+.5)*C-4));
   root.querySelectorAll('[data-stage]').forEach(e=>e.classList.toggle('active',+e.dataset.stage===shown));
   $('[data-s0]').textContent=sense===null?'초음파 센서로 앞의 거리 측정':`앞의 빈칸 ${sense}칸`;
   $('[data-s1]').textContent=decision?`빈칸 ${sense}칸, 기준 ${d.limit}칸 ${decision==='turn'?'미만이므로 돌기':'이상이므로 직진'}`:`앞의 빈칸이 ${d.limit}칸 미만이면 돌기, 아니면 직진`;
   $('[data-s2]').textContent=shown===2?(decision==='turn'?'오른쪽으로 90도 회전':'앞으로 한 칸 이동'):'모터로 바퀴 구동';
   $('[data-count]').textContent=count;$('[data-limit-out]').textContent=`${d.limit}칸`;
  }
  function step(){
   if(anim)return;const [dx,dy]=DIR[bot.h];
   if(phase===0){let k=0;while(!blocked(bot.x+dx*(k+1),bot.y+dy*(k+1)))k++;sense=k;decision=null;shown=0;phase=1}
   else if(phase===1){decision=sense<d.limit?'turn':'go';shown=1;phase=2}
   else{const from=[bot.px,bot.py,bot.pa];if(decision==='go'){bot.x+=dx;bot.y+=dy;anim={p:0,from,to:[bot.x,bot.y,bot.pa]}}else{bot.h=(bot.h+1)%4;anim={p:0,from,to:[bot.px,bot.py,bot.pa+90]}}shown=2;phase=0;count++}
   draw();
  }
  $('[data-step]').onclick=()=>{auto=false;$('[data-auto]').setAttribute('aria-pressed','false');step()};
  $('[data-auto]').onclick=e=>{auto=!auto;e.currentTarget.setAttribute('aria-pressed',String(auto));wait=0};
  $('[data-reset]').onclick=()=>{auto=false;$('[data-auto]').setAttribute('aria-pressed','false');reset();draw()};
  $('[data-limit]').oninput=e=>{d.limit=+e.target.value;save();if(phase===2){phase=1;shown=0;decision=null}draw()};
  $('[data-arena]').onclick=e=>{if(anim)return;const r=e.currentTarget.getBoundingClientRect(),x=Math.floor((e.clientX-r.left)/r.width*W),y=Math.floor((e.clientY-r.top)/r.height*H),k=x+','+y;if(x<0||y<0||x>=W||y>=H||(x===bot.x&&y===bot.y))return;walls.has(k)?walls.delete(k):walls.add(k);phase=0;shown=-1;sense=null;decision=null;draw()};
  bind(root,d);reset();draw();
  animate(root,dt=>{
   if(anim){anim.p=Math.min(1,anim.p+dt/.32);const e=anim.p*anim.p*(3-2*anim.p);[bot.px,bot.py,bot.pa]=anim.from.map((a,i)=>a+(anim.to[i]-a)*e);if(anim.p>=1)anim=null;draw()}
   else if(auto){wait-=dt;if(wait<=0){step();wait=.42}}
  });
 }

 /* ---------- 3. Vision, language, action ---------- */
 const SHAPES={
  apple:'<circle r="19" fill="#d94a3d"/><path d="M0-19q2-9 9-11" stroke="#5b3a1e" stroke-width="3" fill="none"/>',
  banana:'<path d="M-28-8Q0 26 28-8Q0 8-28-8Z" fill="#f2c230" stroke="#b98a10" stroke-width="2"/>',
  blue:'<rect x="-19" y="-19" width="38" height="38" rx="5" fill="#3f7fd9"/>',
  green:'<rect x="-19" y="-19" width="38" height="38" rx="5" fill="#3fa66b"/>'
 };
 const VLA_NAMES={apple:'사과',banana:'바나나',blue:'파란 블록',green:'초록 블록',bowl:'그릇',box:'상자'};
 const COMMANDS=[
  {text:'바나나를 그릇에 담아 줘',parts:[['바나나','obj'],'를 ',['그릇','dst'],'에 담아 줘'],moves:[['banana','bowl']]},
  {text:'빨간 사과를 상자에 넣어 줘',parts:[['빨간 사과','obj'],'를 ',['상자','dst'],'에 넣어 줘'],moves:[['apple','box']]},
  {text:'파란 블록을 초록 블록 위에 올려 줘',parts:[['파란 블록','obj'],'을 ',['초록 블록','dst'],' 위에 올려 줘'],moves:[['blue','green']]},
  {text:'과일을 모두 그릇에 담아 줘',parts:[['과일','obj'],'을 모두 ',['그릇','dst'],'에 담아 줘'],moves:[['apple','bowl'],['banana','bowl']]}
 ];
 function vla(root,s){
  const d=state.vla??={note:''},SLOTS=[[105,262],[245,262],[395,262],[535,262]],FIXED={bowl:[190,128],box:[450,124]},HOME=[320,46];
  let order=['apple','blue','banana','green'],cmd=0,stage=-1,clock=0,queue=[],seg=null,pos={},grip=[...HOME],closed=false,held=null,log=[];
  const place=()=>{order.forEach((id,i)=>pos[id]=[...SLOTS[i]]);grip=[...HOME];closed=false;held=null};
  shell(root,s,'지시를 고르고 실행하면 영상에서 물건을 찾고, 지시의 뜻을 파악하고, 팔을 움직이는 단계가 차례로 나타납니다.',`<div class="l11-commands" role="group" aria-label="지시 고르기">${COMMANDS.map((c,i)=>`<button type="button" data-cmd="${i}" aria-pressed="${i===0}">${c.text}</button>`).join('')}</div><div class="l11-sim"><svg class="l11-svg" viewBox="0 0 640 330" role="img" aria-label="탁자 위의 물건과 로봇 팔"><rect width="640" height="330" fill="#f3efe6"/><rect x="24" y="70" width="592" height="236" rx="16" fill="#e2d3b6" stroke="#bfa980" stroke-width="2"/><g data-fixed><path d="M-52-8h104q-6 34-52 34T-52-8Z" fill="#fff" stroke="#8fa3bf" stroke-width="3" transform="translate(190 128)"/><g transform="translate(450 124)"><rect x="-62" y="-22" width="124" height="52" rx="5" fill="#caa56d" stroke="#8e6c35" stroke-width="3"/><rect x="-54" y="-14" width="108" height="36" fill="#a8824a"/></g></g><g data-objects></g><g data-boxes></g><line data-arm x1="320" y1="-10" stroke="#7b8799" stroke-width="12" stroke-linecap="round"/><g data-grip><rect x="-20" y="-16" width="40" height="12" rx="4" fill="#4b5668"/><rect data-f1 y="-6" width="7" height="30" rx="3" fill="#4b5668"/><rect data-f2 y="-6" width="7" height="30" rx="3" fill="#4b5668"/></g></svg><div><ol class="l11-stages"><li data-stage="0"><b>시각</b><span>카메라 영상에서 물건의 종류와 위치 파악</span></li><li data-stage="1"><b>언어</b><span data-lang></span></li><li data-stage="2"><b>행동</b><span>팔과 집게를 움직이는 값을 차례로 출력</span></li></ol><div class="l11-log" data-log aria-live="polite"></div><div class="ch5-inline"><button type="button" data-run>실행</button><button type="button" data-shuffle>물건 섞기</button></div></div></div><p class="ch5-note">VLA 모델의 입력과 출력을 단순하게 그린 애니메이션입니다. 실제 모델을 실행하지 않으며, 실제 로봇은 영상과 지시에서 행동 값을 한 번에 만들어 냅니다.</p>${field('note','물건을 섞은 뒤 같은 지시를 실행했을 때 달라진 것과 그대로인 것',d.note)}`);
  const $=q=>root.querySelector(q);
  function plan(){
   queue=[];const c=COMMANDS[cmd],n=c.moves.length,move=(to,text)=>queue.push({to,text});
   c.moves.forEach(([id,dst],i)=>{
    const [ox,oy]=SLOTS[order.indexOf(id)],off=(i-(n-1)/2)*40,[tx,ty]=dst in FIXED?[FIXED[dst][0]+off,FIXED[dst][1]-4]:[SLOTS[order.indexOf(dst)][0],SLOTS[order.indexOf(dst)][1]-38];
    move([ox,oy-80],`${VLA_NAMES[id]} 위로 이동`);move([ox,oy-24],'팔 내리기');queue.push({grab:id,text:'집게 닫기'});move([ox,oy-100],'들어 올리기');
    move([tx,ty-100],`${VLA_NAMES[dst]} 위로 이동`);move([tx,ty-24],'팔 내리기');queue.push({release:[tx,ty],text:'집게 열기'});move([tx,ty-100],'팔 올리기');
   });move(HOME,'처음 자리로');
  }
  function run(){place();plan();stage=0;clock=0;seg=null;log=[];draw()}
  function draw(){
   const c=COMMANDS[cmd],objs=new Set(c.moves.map(m=>m[0])),dsts=new Set(c.moves.map(m=>m[1]));
   $('[data-objects]').innerHTML=order.map(id=>`<g transform="translate(${pos[id][0]} ${pos[id][1]})">${SHAPES[id]}</g>`).join('');
   $('[data-boxes]').innerHTML=stage<0?'':[...order,'bowl','box'].map(id=>{const [x,y]=pos[id]||FIXED[id],w=id==='bowl'?124:id==='box'?140:id==='banana'?72:54,h=id==='box'?68:id==='bowl'?52:54,k=stage>=1?(objs.has(id)?'obj':dsts.has(id)?'dst':''):'';return `<g class="l11-det ${k}" transform="translate(${x} ${y})"><rect x="${-w/2}" y="${-h/2-(id==='bowl'?-6:0)}" width="${w}" height="${h}" rx="4"/><text x="${-w/2}" y="${-h/2-6}">${VLA_NAMES[id]}</text></g>`}).join('');
   $('[data-arm]').setAttribute('x2',grip[0]);$('[data-arm]').setAttribute('y2',grip[1]-14);$('[data-grip]').setAttribute('transform',`translate(${grip[0]} ${grip[1]})`);
   $('[data-f1]').setAttribute('x',closed?-17:-24);$('[data-f2]').setAttribute('x',closed?10:17);
   root.querySelectorAll('[data-stage]').forEach(e=>e.classList.toggle('active',+e.dataset.stage===stage));
   $('[data-lang]').innerHTML=stage>=1?c.parts.map(p=>Array.isArray(p)?`<mark class="${p[1]}">${p[0]}</mark>`:p).join('')+', <mark class="obj">옮길 물건</mark>과 <mark class="dst">놓을 곳</mark>':'지시에서 옮길 물건과 놓을 곳 파악';
   const box=$('[data-log]');box.innerHTML=log.length?log.map(x=>`<span>${x}</span>`).join(''):'<em>실행을 누르면 행동 값이 여기에 쌓입니다.</em>';box.scrollTop=box.scrollHeight;
   $('[data-run]').textContent=stage>=0&&stage<3?'다시 실행':'실행';
  }
  root.querySelectorAll('[data-cmd]').forEach(b=>b.onclick=()=>{cmd=+b.dataset.cmd;root.querySelectorAll('[data-cmd]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));stage=-1;log=[];place();draw()});
  $('[data-run]').onclick=run;
  $('[data-shuffle]').onclick=()=>{const before=order.join();do{for(let i=order.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[order[i],order[j]]=[order[j],order[i]]}}while(order.join()===before);stage=-1;log=[];place();draw()};
  bind(root,d);place();draw();
  animate(root,dt=>{
   if(stage<0||stage>2)return;
   if(stage<2){clock+=dt;if(clock>1.5){stage++;clock=0}draw();return}
   if(!seg){seg=queue.shift();if(!seg){stage=3;draw();return}seg.p=0;seg.from=[...grip];
    if(seg.to)log.push(`${seg.text} (Δx ${Math.round(seg.to[0]-grip[0])}, Δy ${Math.round(seg.to[1]-grip[1])})`);else log.push(seg.text)}
   seg.p=Math.min(1,seg.p+dt/(seg.to?.5:.3));
   if(seg.to){const e=seg.p*seg.p*(3-2*seg.p);grip=seg.from.map((a,i)=>a+(seg.to[i]-a)*e)}
   if(held)pos[held]=[grip[0],grip[1]+24];
   if(seg.p>=1){if(seg.grab){closed=true;held=seg.grab}if(seg.release){pos[held]=seg.release;closed=false;held=null}seg=null}
   draw();
  });
 }

 /* ---------- 4. Smart wheelchair: tilt sensing, slope class, seat angle ---------- */
 const SLOPES=[[-20,'가파른 내리막'],[-10,'완만한 내리막'],[0,'평지'],[10,'완만한 오르막'],[20,'가파른 오르막']];
 const ROUTE=[0,0,10,10,20,20,6,0,0,-10,-10,-20,-20,-8,0,0];
 function wheelchair(root,s){
  const d=state.wheelchair??={control:true,note:''};let slope=0,seat=0,driving=false,t=0,spin=0,scroll=0;
  shell(root,s,'경사를 바꾸거나 경사로를 주행하며 의자가 수평을 유지하는지 봅니다. 의자 각도 조절을 끄고 차이를 비교합니다.',`<div class="l11-sim"><svg class="l11-svg" viewBox="0 0 640 340" role="img" aria-label="경사로 위의 휠체어"><rect width="640" height="340" fill="#eaf4ff"/><g data-world><rect x="-400" y="250" width="1440" height="400" fill="#b7c7a3"/><line data-road x1="-400" y1="250" x2="1040" y2="250" stroke="#7f946a" stroke-width="5" stroke-dasharray="26 22"/><g transform="translate(320 250)"><g data-w1 transform="translate(-34 -34)"><circle r="34" fill="none" stroke="#33415c" stroke-width="7"/><path d="M-34 0h68M0-34v68" stroke="#33415c" stroke-width="3"/></g><g data-w2 transform="translate(50 -14)"><circle r="14" fill="none" stroke="#33415c" stroke-width="6"/><path d="M-14 0h28M0-14v28" stroke="#33415c" stroke-width="2"/></g><path d="M-34-34L10-62L50-14" fill="none" stroke="#5b6b85" stroke-width="7" stroke-linejoin="round"/><g data-seat transform="translate(10 -62)"><rect x="-46" y="-12" width="76" height="12" rx="5" fill="#31578e"/><rect x="-50" y="-78" width="12" height="70" rx="5" fill="#31578e"/><path d="M-30-12v-52M-30-34h40l6 34" fill="none" stroke="#e39a4f" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/><circle cx="-30" cy="-84" r="15" fill="#e8b88f"/><line x1="-70" y1="-106" x2="56" y2="-106" stroke="#25836e" stroke-width="3"/><circle data-bubble cy="-106" r="6" fill="#25836e"/></g></g></g><line x1="20" y1="60" x2="620" y2="60" stroke="#9fb3cf" stroke-width="2" stroke-dasharray="6 8"/><text x="24" y="50" class="l11-label">수평선</text></svg><div><ol class="l11-stages"><li class="active"><b>감지</b><span data-w-sense></span></li><li class="active"><b>판단</b><span data-w-class></span></li><li class="active"><b>행동</b><span data-w-act></span></li></ol><label class="l11-range">경사 <output data-slope-out></output><input type="range" min="-25" max="25" step="1" data-slope></label><div class="ch5-inline"><button type="button" data-drive aria-pressed="false">경사로 주행</button><button type="button" data-control aria-pressed="${!!d.control}">의자 각도 조절</button></div></div></div>${metrics([['땅의 경사','data-m-slope'],['모델의 판단','data-m-class'],['의자의 기울기','data-m-seat']])}<p class="ch5-note">경사를 다섯 가지로 나누어 학습한 모델을 가정한 예시입니다. 모델은 학습한 경사 가운데 가장 가까운 하나로 판단하므로, 그 사이의 경사에서는 의자가 조금 기울어집니다.</p>${field('note','의자가 가장 많이 기울어진 경사와 그 이유',d.note)}`);
  const $=q=>root.querySelector(q),range=$('[data-slope]'),sign=v=>(v>0?'+':'')+v;
  function draw(){
   const [angle,label]=SLOPES.reduce((a,b)=>Math.abs(b[0]-slope)<Math.abs(a[0]-slope)?b:a),lean=Math.round((slope-seat)*10)/10;
   $('[data-world]').setAttribute('transform',`rotate(${-slope} 320 250)`);$('[data-seat]').setAttribute('transform',`translate(10 -62) rotate(${seat})`);
   $('[data-bubble]').setAttribute('cx',-7+clamp(-(slope-seat)*4,-56,56));
   $('[data-road]').setAttribute('stroke-dashoffset',scroll);$('[data-w1]').setAttribute('transform',`translate(-34 -34) rotate(${spin})`);$('[data-w2]').setAttribute('transform',`translate(50 -14) rotate(${spin*2.4})`);
   range.value=Math.round(slope);$('[data-slope-out]').textContent=`${sign(Math.round(slope))}도`;
   $('[data-w-sense]').textContent=`기울기 센서 ${sign(Math.round(slope))}도`;$('[data-w-class]').textContent=`${label}, ${sign(angle)}도`;
   $('[data-w-act]').textContent=d.control?`모터로 의자를 ${sign(angle)}도만큼 반대로 조절`:'의자 각도 조절 꺼짐';
   $('[data-m-slope]').textContent=`${sign(Math.round(slope))}도`;$('[data-m-class]').textContent=label;$('[data-m-seat]').textContent=Math.abs(lean)<.5?'수평':`${Math.abs(Math.round(lean))}도 ${lean>0?'뒤로':'앞으로'}`;
   return angle;
  }
  range.oninput=()=>{slope=+range.value;driving=false;$('[data-drive]').setAttribute('aria-pressed','false')};
  $('[data-drive]').onclick=e=>{driving=!driving;e.currentTarget.setAttribute('aria-pressed',String(driving));if(driving)t=0};
  $('[data-control]').onclick=e=>{d.control=!d.control;save();e.currentTarget.setAttribute('aria-pressed',String(!!d.control))};
  bind(root,d);draw();
  animate(root,dt=>{
   if(driving){t+=dt*.9;const i=Math.floor(t),n=ROUTE.length-1;if(i>=n){t=0}else{const p=t-i,e=p*p*(3-2*p);slope=ROUTE[i]+(ROUTE[i+1]-ROUTE[i])*e}spin+=dt*150;scroll-=dt*90}
   const target=d.control?draw():0,gap=target-seat;seat+=clamp(gap,-dt*45,dt*45);draw();
  });
 }

 /* ---------- 5. Rule cards and example cards ---------- */
 const ITEMS=[
  {c:'빨간색',sh:'둥근 모양',name:'사과',kind:'과일',fill:'#d94a3d'},{c:'파란색',sh:'네모난 모양',name:'파란 블록',kind:'장난감',fill:'#3f7fd9'},
  {c:'주황색',sh:'둥근 모양',name:'귤',kind:'과일',fill:'#ee8f2f'},{c:'노란색',sh:'길쭉한 모양',name:'바나나',kind:'과일',fill:'#f2c230'},
  {c:'빨간색',sh:'네모난 모양',name:'빨간 블록',kind:'장난감',fill:'#d94a3d'},{c:'초록색',sh:'네모난 모양',name:'초록 블록',kind:'장난감',fill:'#3fa66b'},
  {c:'보라색',sh:'둥근 모양',name:'자두',kind:'과일',fill:'#8a4fb0'},{c:'노란색',sh:'둥근 모양',name:'노란 공',kind:'장난감',fill:'#f2c230'}
 ];
 const KNOWN=[0,3,1,5],KINDS=['과일','장난감'];
 const art=(o,size=64)=>`<svg class="l11-art" viewBox="-36 -36 72 72" width="${size}" height="${size}" aria-hidden="true">${o.sh==='둥근 모양'?`<circle r="24" fill="${o.fill}"/>`:o.sh==='네모난 모양'?`<rect x="-23" y="-23" width="46" height="46" rx="6" fill="${o.fill}"/>`:`<path d="M-32-10Q0 30 32-10Q0 10-32-10Z" fill="${o.fill}"/>`}</svg>`;
 const byRule=o=>{const k=KNOWN.find(i=>ITEMS[i].c===o.c&&ITEMS[i].sh===o.sh);return k===undefined?'없음':ITEMS[k].kind};
 function byExample(o){
  const scored=KNOWN.map(i=>[ITEMS[i],(ITEMS[i].c===o.c)+(ITEMS[i].sh===o.sh)]),best=Math.max(...scored.map(x=>x[1])),near=scored.filter(x=>x[1]===best&&best>0).map(x=>x[0]),kinds=[...new Set(near.map(x=>x.kind))];
  return {near,kind:kinds.length===1?kinds[0]:'갈림'};
 }
 function cards(root,s){
  const d=state.cards??={round:'rule',rule:{},example:{},note:''};
  const tabs=`<div class="l11-commands" role="group" aria-label="활동 단계">${[['rule','1. 규칙 카드'],['example','2. 예시 카드'],['compare','3. 비교']].map(([k,v])=>`<button type="button" data-round="${k}" aria-pressed="${d.round===k}">${v}</button>`).join('')}</div>`;
  let html;
  if(d.round==='compare'){
   const ruleRight=ITEMS.filter(o=>byRule(o)===o.kind).length,ruleNone=ITEMS.filter(o=>byRule(o)==='없음').length,mine=ITEMS.filter((o,i)=>d.example[i]===o.kind).length,answered=Object.keys(d.example).length;
   html=`<div class="ch5-metrics"><div><span>규칙 카드, 바르게 분류</span><strong>${ruleRight} / ${ITEMS.length}</strong><small>분류 불가 ${ruleNone}개, 오판 ${ITEMS.length-ruleRight-ruleNone}개</small></div><div><span>예시 카드, 내 판단</span><strong>${mine} / ${ITEMS.length}</strong><small>응답 ${answered}개, 오판 ${answered-mine}개</small></div><div><span>낯선 물건</span><strong>${ruleNone}개</strong><small>카드에 없던 색과 모양의 조합</small></div></div><div class="ch5-table-wrap"><table><thead><tr><th>센서가 말한 정보</th><th>실제 물건</th><th>규칙 카드</th><th>예시 카드, 내 판단</th><th>닮은 예시로 판단</th></tr></thead><tbody>${ITEMS.map((o,i)=>{const r=byRule(o),e=byExample(o),m=d.example[i];return `<tr><th>${o.c}, ${o.sh}</th><td>${o.name}, ${o.kind}</td><td>${r==='없음'?'분류 불가':r+' 상자'}</td><td>${m?`${m} 상자, ${m===o.kind?'맞음':'오판'}`:'응답 없음'}</td><td>${e.kind==='갈림'?'판단이 갈림':`${e.kind} 상자, ${e.kind===o.kind?'맞음':'오판'}`}</td></tr>`}).join('')}</tbody></table></div><p class="ch5-note">닮은 예시로 판단은 색과 모양이 같은 예시 카드를 찾아 그 상자를 고른 결과입니다. 센서가 색과 모양만 전하므로 노란 공과 같은 물건은 과일 예시와 더 닮아 보입니다.</p>${field('note','규칙 카드와 예시 카드로 판단할 때의 차이, 오판을 줄일 방법',d.note,'예, 센서가 크기와 무게도 말하게 한다.')}`;
  }else{
   const isRule=d.round==='rule',ans=d[d.round],i=ITEMS.findIndex((_,k)=>ans[k]===undefined),last=d[`${d.round}Last`],showing=last!==undefined&&ans[last]!==undefined?last:(i<0?ITEMS.length-1:undefined);
   const cur=showing!==undefined?showing:i,o=ITEMS[cur],a=ans[cur],done=Object.keys(ans).length;
   const left=isRule?`<div class="ch5-panel"><h3>규칙 카드</h3><ul class="l11-rules">${KNOWN.map(k=>`<li>${ITEMS[k].c}이고 ${ITEMS[k].sh}이면 <b>${ITEMS[k].kind} 상자</b></li>`).join('')}</ul></div>`:`<div class="ch5-panel"><h3>예시 카드</h3><div class="l11-examples">${KINDS.map(k=>`<div><b>${k} 상자</b><div>${KNOWN.filter(x=>ITEMS[x].kind===k).map(x=>`<figure>${art(ITEMS[x],56)}<figcaption>${ITEMS[x].name}</figcaption></figure>`).join('')}</div></div>`).join('')}</div></div>`;
   let verdict='';
   if(a!==undefined){
    if(isRule){const r=byRule(o);verdict=a===r?(r==='없음'?`<strong>규칙 카드에 없는 물건입니다.</strong><p>실제 물건은 ${o.name}이며 ${o.kind} 상자에 들어가야 합니다. 규칙만으로는 분류하지 못했습니다.</p>`:`<strong>규칙대로 분류했습니다.</strong><p>실제 물건은 ${o.name}, ${o.kind} 상자가 맞습니다.</p>`):`<strong>규칙 카드와 다른 판단입니다.</strong><p>${r==='없음'?`${o.c}이고 ${o.sh}인 물건의 규칙은 없습니다.`:`규칙 카드는 ${r} 상자입니다.`} 실제 물건은 ${o.name}, ${o.kind}입니다.</p>`}
    else{const e=byExample(o);verdict=`<strong>${a===o.kind?'맞았습니다.':'오판입니다.'}</strong><p>실제 물건은 ${o.name}, ${o.kind}입니다. ${e.near.length?`닮은 예시는 ${e.near.map(x=>x.name).join(', ')}입니다.`:'닮은 예시가 없습니다.'}${e.kind==='갈림'?' 닮은 예시가 두 상자에 모두 있어 판단이 갈립니다.':''}</p>`}
   }
   const choices=[...KINDS.map(k=>[k,`${k} 상자`]),...(isRule?[['없음','규칙에 없음']]:[])];
   html=`<div class="ch5-grid">${left}<div class="ch5-panel l11-turn"><h3>물건 ${cur+1} / ${ITEMS.length}</h3><p class="l11-say"><span>센서 역할</span>${o.c}, ${o.sh}</p><div class="l11-reveal ${a===undefined?'':'shown'}">${a===undefined?'<span class="l11-unknown">?</span>':art(o,84)+`<b>${o.name}</b>`}</div><div class="l11-commands">${choices.map(([k,v])=>`<button type="button" data-pick="${k}" aria-pressed="${a===k}" ${a===undefined?'':'disabled'}>${v}</button>`).join('')}</div><div class="ch5-result" role="status" ${a===undefined?'hidden':''}>${verdict}</div><div class="ch5-inline"><button type="button" data-next ${a===undefined?'disabled':''}>${done===ITEMS.length?(isRule?'예시 카드로 넘어가기':'비교 보기'):'다음 물건'}</button><button type="button" data-again>이 단계 다시 하기</button></div></div></div><p class="ch5-note">${isRule?'AI 역할을 맡아 규칙 카드만 보고 판단합니다. 맞는 규칙이 없으면 규칙에 없음을 고릅니다.':'AI 역할을 맡아 예시 카드와 닮은 정도를 근거로 판단합니다. 이번에는 모든 물건을 두 상자 가운데 하나에 넣어야 합니다.'}</p>`;
  }
  shell(root,s,'센서 역할은 물건의 색과 모양만 말합니다. 같은 물건 여덟 개를 규칙 카드와 예시 카드로 한 번씩 분류합니다.',tabs+html);
  const again=()=>cards(root,s);
  root.querySelectorAll('[data-round]').forEach(b=>b.onclick=()=>{d.round=b.dataset.round;delete d.ruleLast;delete d.exampleLast;save();again()});
  root.querySelectorAll('[data-pick]').forEach(b=>b.onclick=()=>{const ans=d[d.round],i=ITEMS.findIndex((_,k)=>ans[k]===undefined);ans[i]=b.dataset.pick;d[`${d.round}Last`]=i;save();again()});
  const next=root.querySelector('[data-next]');if(next)next.onclick=()=>{const full=Object.keys(d[d.round]).length===ITEMS.length;delete d[`${d.round}Last`];if(full)d.round=d.round==='rule'?'example':'compare';save();again()};
  const redo=root.querySelector('[data-again]');if(redo)redo.onclick=()=>{d[d.round]={};delete d[`${d.round}Last`];save();again()};
  bind(root,d);
 }

 /* ---------- 6. Activity 1: connecting sensor, AI and device ---------- */
 const DESIGN=[['problem','생활문제','방학 동안 시드는 교실 화분'],['sense','감지, 센서','카메라로 잎 촬영'],['decide','판단, AI 모델','싱싱한 잎과 시든 잎 분류'],['act','행동, 장치','물 펌프 작동, 담당 학생에게 알림'],['guard','오판 대비','토양 습도 센서값을 함께 확인']];
 const DESIGN_CHECK=['센서가 만드는 데이터에 판단에 필요한 정보가 들어 있는가','모델이 학습할 데이터를 학생이 직접 모을 수 있는가','판단 결과가 장치의 행동으로 이어지는가','모델이 틀렸을 때 사람이 확인하거나 멈출 방법이 있는가'];
 function design(root,s){
  const d=state.design??={checks:{}};
  shell(root,s,'예시를 참고해 나의 설계를 적습니다. 적은 내용은 아래의 흐름 그림에 바로 나타납니다.',`<div class="ch5-table-wrap"><table class="l11-form"><thead><tr><th>구분</th><th>예시</th><th>나의 설계</th></tr></thead><tbody>${DESIGN.map(([k,label,ex])=>`<tr><th>${label}</th><td>${ex}</td><td><textarea data-field="${k}" rows="2" aria-label="${label}, 나의 설계">${esc(d[k])}</textarea></td></tr>`).join('')}</tbody></table></div><div class="l11-flow" aria-label="나의 설계 흐름">${[['sense','감지'],['decide','판단'],['act','행동']].map(([k,v],i)=>`${i?'<i aria-hidden="true"></i>':''}<div><b>${v}</b><span data-flow="${k}"></span></div>`).join('')}</div><p class="l11-guard">오판 대비, <span data-flow="guard"></span></p><div class="ch5-panel"><h3>설계 점검</h3>${DESIGN_CHECK.map((c,i)=>`<label class="ch5-check"><input type="checkbox" data-check="${i}" ${d.checks[i]?'checked':''}><span>${c}</span></label>`).join('')}<p class="ch5-note" data-check-status role="status"></p></div>`);
  const update=()=>{root.querySelectorAll('[data-flow]').forEach(e=>{const k=e.dataset.flow,v=(d[k]||'').trim();e.textContent=v||`예시, ${DESIGN.find(x=>x[0]===k)[2]}`;e.classList.toggle('empty',!v)});const n=Object.values(d.checks).filter(Boolean).length;root.querySelector('[data-check-status]').textContent=`확인한 항목 ${n} / ${DESIGN_CHECK.length}`};
  root.querySelectorAll('[data-check]').forEach(e=>e.onchange=()=>{d.checks[e.dataset.check]=e.checked;save();update()});bind(root,d,update);update();
 }

 /* ---------- 7. Activity 2: choosing a convergence topic ---------- */
 const CRITERIA=[['life','학생의 삶','학생이 실제로 겪는 문제인가','학생의 생활에서 겪는 장면으로 주제를 좁힙니다.'],['curriculum','교육과정','교과 성취기준과 인공지능 성취기준에 모두 닿는가','관련 교과와 인공지능 성취기준을 하나씩 찾아 나란히 놓습니다.'],['data','데이터','학생이 직접 모으는 데이터인가','학생이 찍거나 재거나 조사해 모을 수 있는 데이터로 바꿉니다.'],['need','AI의 필요','규칙만으로 풀기 어렵고 분류나 예측이 필요한가','규칙만으로 풀린다면 피지컬 컴퓨팅이나 일반 코딩 주제가 더 알맞습니다.'],['condition','실행 조건','차시, 기기, 학생 수준에 맞는가','차시 수와 쓸 수 있는 기기에 맞게 활동의 범위를 줄입니다.']];
 const OUTLINE=[['problem','생활문제','누가 겪는 어떤 불편인지'],['standards','교과와 성취기준','관련 교과, 인공지능 성취기준'],['model','데이터와 AI 모델','모을 데이터, 분류나 예측 모델'],['device','센서와 장치','선택 항목, 감지와 행동'],['activity','학생 활동','차시별 주요 활동'],['assessment','평가','교과와 인공지능 소양의 평가 방법']];
 function topic(root,s){
  const d=state.topic??={answers:{}};
  shell(root,s,'주제를 적고 다섯 가지 질문으로 점검한 뒤 수업 개요를 작성합니다.',`<label class="ch5-field">융합 주제<textarea data-field="title" rows="1" placeholder="예, 우리 학교 분리배출 실수 줄이기">${esc(d.title)}</textarea></label><div class="ch5-table-wrap l11-gap"><table><thead><tr><th>기준</th><th>점검 질문</th><th>나의 판단</th></tr></thead><tbody>${CRITERIA.map(([k,label,q])=>`<tr><th>${label}</th><td>${q}</td><td><div class="l11-yn" role="group" aria-label="${label}">${['예','아니오'].map(v=>`<button type="button" data-answer="${k}:${v}" aria-pressed="${d.answers[k]===v}">${v}</button>`).join('')}</div></td></tr>`).join('')}</tbody></table></div><div class="ch5-result" role="status" data-summary></div><h3>수업 개요</h3><div class="ch5-table-wrap"><table class="l11-form"><thead><tr><th>항목</th><th>작성 안내</th><th>나의 수업</th></tr></thead><tbody>${OUTLINE.map(([k,label,guide])=>`<tr><th>${label}</th><td>${guide}</td><td><textarea data-field="${k}" rows="2" aria-label="${label}, 나의 수업">${esc(d[k])}</textarea></td></tr>`).join('')}</tbody></table></div>`);
  const summary=()=>{const yes=CRITERIA.filter(c=>d.answers[c[0]]==='예').length,no=CRITERIA.filter(c=>d.answers[c[0]]==='아니오'),left=CRITERIA.length-yes-no.length;root.querySelector('[data-summary]').innerHTML=`<strong>충족 ${yes} / ${CRITERIA.length}${left?`, 남은 질문 ${left}개`:''}</strong>${no.length?`<ul>${no.map(c=>`<li><b>${c[1]}</b>, ${c[3]}</li>`).join('')}</ul>`:left?'<p>질문마다 예 또는 아니오를 고릅니다.</p>':'<p>다섯 기준을 모두 충족했습니다. 수업 개요를 작성합니다.</p>'}`};
  root.querySelectorAll('[data-answer]').forEach(b=>b.onclick=()=>{const [k,v]=b.dataset.answer.split(':');d.answers[k]=d.answers[k]===v?undefined:v;save();root.querySelectorAll(`[data-answer^="${k}:"]`).forEach(x=>x.setAttribute('aria-pressed',String(d.answers[k]===x.dataset.answer.split(':')[1])));summary()});
  bind(root,d);summary();
 }

 const handlers={rule,loop,vla,wheelchair,cards,design,topic};
 window.aiEducationLabs={mount(root,s){cancelAnimationFrame(raf);handlers[s.lab](root,s)}};
})();
