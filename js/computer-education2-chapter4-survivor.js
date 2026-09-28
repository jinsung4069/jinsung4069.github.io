(()=>{
 'use strict';
 const WIDTH=320,HEIGHT=180,POINTS_PER_QUIZ=5,ATTACK_RADIUS=38,PICKUP_RADIUS=9;
 const questions=[
  {kind:'array',name:'배열',prompt:'배열 [A, B, C]의 인덱스 1에 X를 넣으면?',choices:['[A, X, B, C]','[A, B, X, C]','[X, A, B, C]'],answer:0,why:'배열의 인덱스는 0부터 시작합니다. 인덱스 1의 B부터 오른쪽으로 이동합니다.'},
  {kind:'list',name:'연결 리스트',prompt:'A → B → C에서 노드 B를 삭제하려면?',choices:['A의 다음 노드를 C로 연결한다','C의 다음 노드를 A로 연결한다','A의 다음 노드를 비워 둔다'],answer:0,why:'A의 연결을 C로 바꾸면 B를 건너뛰고 A → C가 됩니다.'},
  {kind:'stack',name:'스택',prompt:'아래부터 A, B, C인 스택에서 Pop한 뒤 D를 Push하면 TOP은?',choices:['A','B','D'],answer:2,why:'TOP의 C가 먼저 나가고 D가 맨 위에 들어옵니다.'},
  {kind:'queue',name:'큐',prompt:'FRONT부터 A, B, C인 큐에서 Dequeue한 뒤 D를 Enqueue하면 FRONT는?',choices:['A','B','D'],answer:1,why:'가장 앞의 A가 먼저 나가므로 B가 새로운 FRONT입니다.'}
 ];
 const rewards=[
  {id:'rapid',icon:'✦',name:'연사 강화',detail:'자동 공격 간격 20% 감소'},
  {id:'boots',icon:'➜',name:'이동 강화',detail:'이동 속도 증가'},
  {id:'heart',icon:'♥',name:'생명 회복',detail:'최대 체력 +1, 체력 회복'}
 ];
 let activeCleanup=null;
 function stop(){if(activeCleanup){activeCleanup();activeCleanup=null}}
 function mount(panel){
  stop();
  panel.innerHTML=`<div class="c4-survivor" id="c4-survivor">
   <div class="c4-survivor-heading"><div><div class="c4-survivor-kicker">PIXEL SURVIVAL · 자료구조</div><h2>자료구조 생존전</h2></div><div class="c4-survivor-actions"><button id="c4-pause" type="button">일시정지</button><button id="c4-new" type="button">새 게임</button></div></div>
   <div class="c4-survivor-hud"><span id="c4-score">점수 0</span><span id="c4-health">체력 ♥♥♥♥♥</span><span id="c4-progress">문제 0 / 4</span><span id="c4-next">다음 문제 5점</span></div>
   <div class="c4-survivor-arena"><canvas id="c4-canvas" width="${WIDTH}" height="${HEIGHT}" tabindex="0" aria-label="도트 생존 게임. 방향키나 WASD로 이동하고 가까운 적을 자동 공격하며 보석을 주워 점수를 얻습니다.">캔버스를 지원하는 브라우저가 필요합니다.</canvas><div class="c4-survivor-arena-label">AUTO ATTACK</div></div>
   <div class="c4-survivor-bottom"><div class="c4-survivor-help">방향키, WASD 또는 방향 버튼으로 이동 · 가까운 적만 자동 공격 · 보석을 주워 점수 획득</div><div class="c4-survivor-pad" aria-label="모바일 이동 버튼"><button type="button" data-dir="up" aria-label="위로 이동">▲</button><div><button type="button" data-dir="left" aria-label="왼쪽으로 이동">◀</button><button type="button" data-dir="down" aria-label="아래로 이동">▼</button><button type="button" data-dir="right" aria-label="오른쪽으로 이동">▶</button></div></div></div>
   <div class="c4-survivor-status" id="c4-survivor-status" role="status" aria-live="polite">시작 버튼을 누르면 생존 게임이 시작됩니다.</div>
   <div class="c4-survivor-modal" id="c4-survivor-modal" role="dialog" aria-modal="true" aria-label="게임 안내"></div>
   </div>`;
  const root=panel.querySelector('#c4-survivor'),get=s=>root.querySelector(s),canvas=get('#c4-canvas'),ctx=canvas.getContext('2d',{alpha:false}),modal=get('#c4-survivor-modal');
  const controller=new AbortController(),signal=controller.signal,keys=new Set();
  let phase='ready',raf=0,last=0,score=0,health=5,maxHealth=5,round=0,speed=58,attackInterval=.45,shotClock=0,spawnClock=0,hitClock=0;
  let enemies=[],shots=[],gems=[],sparks=[],target=null,player={x:WIDTH/2,y:HEIGHT/2};
  const mastered=new Set();
  const clamp=(n,lo,hi)=>Math.max(lo,Math.min(hi,n));
  const setStatus=s=>{get('#c4-survivor-status').textContent=s};
  function hud(){get('#c4-score').textContent=`점수 ${score}`;get('#c4-health').textContent=`체력 ${'♥'.repeat(health)}${'♡'.repeat(maxHealth-health)}`;get('#c4-progress').textContent=`문제 ${mastered.size} / 4`;get('#c4-next').textContent=`다음 문제 ${(round+1)*POINTS_PER_QUIZ}점`;get('#c4-pause').disabled=!['playing','paused'].includes(phase)}
  function showModal(html,label){modal.hidden=false;modal.innerHTML=`<div class="c4-survivor-dialog">${html}</div>`;modal.setAttribute('aria-label',label);modal.querySelector('button')?.focus({preventScroll:true})}
  function hideModal(){modal.hidden=true;modal.replaceChildren()}
  function startLoop(){last=0;if(!raf)raf=requestAnimationFrame(frame)}
  function play(){phase='playing';keys.clear();target=null;hideModal();hud();canvas.focus({preventScroll:true});setStatus(`생존 중, 점수 ${score}. 가까운 적을 자동으로 공격하고 보석을 주우세요.`);startLoop()}
  function pause(){if(phase!=='playing')return;phase='paused';keys.clear();target=null;hud();showModal('<div class="c4-survivor-badge">PAUSE</div><h3>잠시 멈춤</h3><p>준비되면 다시 움직이세요.</p><button type="button" data-action="resume">계속하기</button>','일시정지');setStatus('게임이 일시정지되었습니다.')}
  function reset(){phase='ready';score=0;health=5;maxHealth=5;round=0;speed=58;attackInterval=.45;shotClock=0;spawnClock=.25;hitClock=0;player={x:WIDTH/2,y:HEIGHT/2};enemies=[];shots=[];gems=[];sparks=[];keys.clear();target=null;mastered.clear();hud();draw();showModal('<div class="c4-survivor-badge">PIXEL SURVIVAL</div><h3>자료구조 생존전</h3><p>가까운 적은 자동으로 공격합니다. 움직여서 떨어진 <strong>보석을 주워야 점수</strong>를 얻습니다. 5점마다 자료구조 문제가 나옵니다.</p><p>정답을 맞히면 세 가지 보상 중 하나를 골라 다음 라운드를 시작합니다.</p><button type="button" data-action="start">게임 시작</button>','게임 시작');setStatus('시작 버튼을 누르면 생존 게임이 시작됩니다.')}
  function gameOver(){phase='over';keys.clear();hud();showModal(`<div class="c4-survivor-badge">GAME OVER</div><h3>다시 도전해요</h3><p>이번 점수 ${score}점 · 해결한 자료구조 ${mastered.size} / 4</p><button type="button" data-action="restart">다시 시작</button>`,'게임 종료');setStatus(`게임 종료. ${score}점, ${mastered.size}개 자료구조 문제 해결.`)}
  function quiz(){phase='quiz';keys.clear();target=null;hud();const q=questions[round%questions.length];showModal(`<div class="c4-survivor-badge">${q.name} 문제 · ${score}점</div><h3>${q.prompt}</h3><div class="c4-survivor-options">${q.choices.map((choice,i)=>`<button type="button" data-answer="${i}"><span>${i+1}</span>${choice}</button>`).join('')}</div><p class="c4-survivor-feedback" id="c4-quiz-feedback" role="status" aria-live="polite">답을 골라 보세요.</p>`,'자료구조 문제');setStatus(`${q.name} 문제에 답할 차례입니다.`)}
  function reward(){phase='reward';const q=questions[round%questions.length];mastered.add(q.kind);hud();showModal(`<div class="c4-survivor-badge">정답 · ${q.name}</div><h3>보상 하나를 선택하세요</h3><p>${q.why}</p><div class="c4-survivor-rewards">${rewards.map(r=>`<button type="button" data-reward="${r.id}"><strong aria-hidden="true">${r.icon}</strong><span>${r.name}</span><small>${r.detail}</small></button>`).join('')}</div>`,'보상 선택');setStatus(`정답입니다. ${q.name} 문제를 해결했습니다. 세 보상 중 하나를 선택하세요.`)}
  function chooseReward(id){if(phase!=='reward')return;const name=rewards.find(r=>r.id===id)?.name;if(!name)return;if(id==='rapid')attackInterval=Math.max(.18,attackInterval*.8);if(id==='boots')speed=Math.min(110,speed+15);if(id==='heart'){maxHealth=Math.min(9,maxHealth+1);health=maxHealth}round++;enemies=[];shots=[];sparks=[];spawnClock=.8;play();setStatus(`${name} 획득. ${mastered.size===4?'네 자료구조를 모두 익혔습니다. 생존을 계속할 수 있습니다.':'다음 문제까지 생존하세요.'}`)}
  function spawn(){if(enemies.length>=38)return;const side=Math.floor(Math.random()*4),margin=8,x=side===0?-margin:side===1?WIDTH+margin:Math.random()*WIDTH,y=side===2?-margin:side===3?HEIGHT+margin:Math.random()*HEIGHT;enemies.push({x,y,kind:Math.random()<.5?'bat':'slime',speed:14+Math.min(score*.8,14)+Math.random()*5})}
  function fire(){const nearby=enemies.filter(e=>Math.hypot(e.x-player.x,e.y-player.y)<=ATTACK_RADIUS);if(!nearby.length)return;const nearest=nearby.reduce((best,e)=>Math.hypot(e.x-player.x,e.y-player.y)<Math.hypot(best.x-player.x,best.y-player.y)?e:best);shots.push({x:player.x,y:player.y,target:nearest})}
  function dropGem(e){let x=e.x,y=e.y;if(Math.hypot(x-player.x,y-player.y)<18){x=player.x+(player.x<WIDTH/2?18:-18);y=player.y}gems.push({x:clamp(x,6,WIDTH-6),y:clamp(y,6,HEIGHT-6)});if(gems.length>150)gems.shift()}
  function burst(x,y){for(let i=0;i<5;i++)sparks.push({x,y,vx:(Math.random()-.5)*45,vy:(Math.random()-.5)*45,life:.35})}
  function update(dt){
   let dx=Number(keys.has('right')||keys.has('d')||keys.has('arrowright'))-Number(keys.has('left')||keys.has('a')||keys.has('arrowleft'));
   let dy=Number(keys.has('down')||keys.has('s')||keys.has('arrowdown'))-Number(keys.has('up')||keys.has('w')||keys.has('arrowup'));
   if(!dx&&!dy&&target){dx=target.x-player.x;dy=target.y-player.y;if(Math.hypot(dx,dy)<3){dx=0;dy=0;target=null}}
   const length=Math.hypot(dx,dy);if(length){player.x=clamp(player.x+dx/length*speed*dt,9,WIDTH-9);player.y=clamp(player.y+dy/length*speed*dt,9,HEIGHT-9)}
   spawnClock-=dt;if(spawnClock<=0){spawn();spawnClock=Math.max(.48,.9-score*.012)}
   shotClock-=dt;if(shotClock<=0){fire();shotClock=attackInterval}
   hitClock=Math.max(0,hitClock-dt);
   for(let i=enemies.length-1;i>=0;i--){const e=enemies[i],ex=player.x-e.x,ey=player.y-e.y,d=Math.hypot(ex,ey)||1;e.x+=ex/d*e.speed*dt;e.y+=ey/d*e.speed*dt;if(d<8&&hitClock===0){health--;hitClock=1.25;burst(player.x,player.y);enemies.splice(i,1);hud();if(health<=0){gameOver();return}}}
   for(let i=shots.length-1;i>=0;i--){const shot=shots[i];if(!enemies.includes(shot.target)){shots.splice(i,1);continue}const e=shot.target,dx=e.x-shot.x,dy=e.y-shot.y,d=Math.hypot(dx,dy)||1;shot.x+=dx/d*175*dt;shot.y+=dy/d*175*dt;if(d<7){const index=enemies.indexOf(e);if(index>=0){enemies.splice(index,1);burst(e.x,e.y);dropGem(e)}shots.splice(i,1)}}
   for(let i=gems.length-1;i>=0;i--){const gem=gems[i];if(Math.hypot(gem.x-player.x,gem.y-player.y)<PICKUP_RADIUS){gems.splice(i,1);score++;burst(gem.x,gem.y);hud();if(score>=(round+1)*POINTS_PER_QUIZ){quiz();return}}}
   sparks=sparks.filter(p=>p.life>0);for(const p of sparks){p.x+=p.vx*dt;p.y+=p.vy*dt;p.life-=dt}
  }
  function pixel(x,y,w,h,color){ctx.fillStyle=color;ctx.fillRect(Math.round(x),Math.round(y),w,h)}
  function drawPlayer(){const x=Math.round(player.x)-6,y=Math.round(player.y)-7;if(hitClock>0&&Math.floor(hitClock*12)%2===0)return;pixel(x+2,y+11,10,2,'#10152c');pixel(x+2,y+4,9,9,'#5683dd');pixel(x+1,y+5,2,6,'#324f9b');pixel(x+11,y+5,2,6,'#324f9b');pixel(x+3,y+1,7,7,'#f2cda7');pixel(x+2,y,9,3,'#d8efff');pixel(x+3,y+5,1,1,'#152540');pixel(x+8,y+5,1,1,'#152540');pixel(x+11,y+5,5,2,'#fbdf72')}
  function drawEnemy(e){const x=Math.round(e.x)-6,y=Math.round(e.y)-5;pixel(x+1,y+9,11,2,'#10152c');if(e.kind==='bat'){pixel(x,y+3,3,5,'#9154a8');pixel(x+10,y+3,3,5,'#9154a8');pixel(x+3,y+1,7,8,'#b86cbb');pixel(x+4,y+5,2,1,'#ffed8e');pixel(x+8,y+5,2,1,'#ffed8e')}else{pixel(x+2,y+3,9,7,'#5fc9a2');pixel(x+4,y+1,5,3,'#8ce2b8');pixel(x+4,y+6,1,1,'#183b3a');pixel(x+8,y+6,1,1,'#183b3a')}}
  function draw(){
   ctx.fillStyle='#151b36';ctx.fillRect(0,0,WIDTH,HEIGHT);
   for(let y=0;y<HEIGHT;y+=16)for(let x=0;x<WIDTH;x+=16){pixel(x,y,15,15,(x/16+y/16)%2?'#1a2544':'#1d2949');pixel(x+3,y+3,2,2,'#26365b')}
   for(const gem of gems){pixel(gem.x-2,gem.y-3,5,6,'#53dca8');pixel(gem.x-1,gem.y-2,3,3,'#c5ffdb')}
   for(const p of sparks)pixel(p.x,p.y,2,2,'#ffe49a');for(const shot of shots){pixel(shot.x-2,shot.y-2,5,5,'#f5d96d');pixel(shot.x-1,shot.y-1,3,3,'#fff6c4')}for(const e of enemies)drawEnemy(e);drawPlayer();
   ctx.strokeStyle='#7685b5';ctx.lineWidth=2;ctx.strokeRect(1,1,WIDTH-2,HEIGHT-2)
  }
  function frame(now){raf=0;if(phase!=='playing'){draw();return}const dt=last?Math.min((now-last)/1000,.05):0;last=now;update(dt);draw();if(phase==='playing')raf=requestAnimationFrame(frame)}
  function onKeyDown(e){const key=e.key.toLowerCase();if(['arrowup','arrowdown','arrowleft','arrowright','w','a','s','d'].includes(key)){e.preventDefault();e.stopImmediatePropagation();if(phase==='playing')keys.add(key)}else if(e.key==='Escape'&&phase==='playing'){e.preventDefault();e.stopImmediatePropagation();pause()}}
  document.addEventListener('keydown',onKeyDown,{capture:true,signal});
  document.addEventListener('keyup',e=>{keys.delete(e.key.toLowerCase())},{capture:true,signal});
  root.querySelector('.c4-survivor-pad').addEventListener('pointerdown',e=>{const b=e.target.closest('[data-dir]');if(!b)return;e.preventDefault();b.setPointerCapture(e.pointerId);keys.add(b.dataset.dir);b.classList.add('is-held')},{signal});
  for(const type of ['pointerup','pointercancel','lostpointercapture'])root.querySelector('.c4-survivor-pad').addEventListener(type,e=>{const b=e.target.closest('[data-dir]');if(b){keys.delete(b.dataset.dir);b.classList.remove('is-held')}},{signal});
  function canvasPoint(e){const rect=canvas.getBoundingClientRect();return{x:clamp((e.clientX-rect.left)/rect.width*WIDTH,0,WIDTH),y:clamp((e.clientY-rect.top)/rect.height*HEIGHT,0,HEIGHT)}}
  canvas.addEventListener('pointerdown',e=>{if(phase!=='playing')return;e.preventDefault();canvas.setPointerCapture(e.pointerId);target=canvasPoint(e)},{signal});
  canvas.addEventListener('pointermove',e=>{if(canvas.hasPointerCapture(e.pointerId))target=canvasPoint(e)},{signal});
  canvas.addEventListener('pointerup',()=>{target=null},{signal});canvas.addEventListener('pointercancel',()=>{target=null},{signal});
  modal.addEventListener('click',e=>{const answer=e.target.closest('[data-answer]'),choice=e.target.closest('[data-reward]'),action=e.target.closest('[data-action]');if(answer&&phase==='quiz'){const q=questions[round%questions.length];if(Number(answer.dataset.answer)===q.answer)reward();else{answer.disabled=true;answer.classList.add('is-wrong');get('#c4-quiz-feedback').textContent='다시 생각해 보세요. 정답은 아직 공개되지 않았습니다.'}}else if(choice)chooseReward(choice.dataset.reward);else if(action){if(action.dataset.action==='start'||action.dataset.action==='resume')play();else if(action.dataset.action==='restart'){reset();play()}}},{signal});
  get('#c4-pause').addEventListener('click',()=>phase==='playing'?pause():phase==='paused'?play():null,{signal});get('#c4-new').addEventListener('click',reset,{signal});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)pause()},{signal});
  reset();
  activeCleanup=()=>{phase='stopped';cancelAnimationFrame(raf);controller.abort();keys.clear();target=null};
 }
 window.ceChapter4Survivor={mount,stop};
})();
