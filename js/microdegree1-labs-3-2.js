/* 3주차 오후, 생활 속 인공지능 서비스 분석: activity slides. Conditions and wording follow the slides; sample dialogue, videos and the toy models are named as examples in each hint. */
(()=>{
 'use strict';
 const L=window.ceLabs;if(!L)return;const esc=L.esc;
 L.style(`.md-lab .s32-say{flex:none;display:flex;align-items:baseline;gap:.9em;padding:.4em .9em;border-left:.25em solid #3f5dae;background:#f6f8fd}.md-lab .s32-say span{color:#52607f;font-size:.85em;white-space:nowrap}.md-lab .s32-say b{font-size:1.15em}
.md-lab .s32-cols{flex:1;min-height:0;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1em}.md-lab .s32-cols .md-panel{gap:.45em}.md-lab .s32-cols small{color:#52607f;font-size:.8em}
.md-lab .s32-cols .md-choice{flex:1;padding:.3em .6em}
.md-lab .s32-table{margin-top:0}.md-lab .s32-table th,.md-lab .s32-table td{font-size:inherit}.md-lab .s32-done td:nth-child(n+3){width:auto;text-align:left}
.md-lab .s32-stages{flex:1;min-height:0;display:grid;grid-template-columns:1fr auto 1fr auto 1fr;align-items:stretch;gap:.5em}.md-lab .s32-stages>i{align-self:center;font-style:normal;color:#3f5dae;font-size:1.4em;font-weight:800}
.md-lab .s32-stages small{color:#52607f;font-size:.8em}.md-lab .md-body .s32-box{padding:.4em .7em;border:1px solid #b9c6e6;border-radius:.5em;background:#fff;font-size:.9em;line-height:1.4}
.md-lab .md-body .s32-tag{font-size:.8em;font-weight:800;color:#16794c}.md-lab .s32-tag[data-bad=true]{color:#b5372f}
.md-lab .s32-check{display:flex;align-items:center;gap:.5em;margin-top:auto;font-size:.86em;cursor:pointer}
.md-lab .s32-ends{flex:none;display:grid;grid-template-columns:1fr 1.5fr;gap:.9em}.md-lab .s32-ends .s32-box{display:flex;gap:.8em}.md-lab .s32-ends b{color:#2c478f;white-space:nowrap}
.md-lab .s32-plot{flex:1;min-height:0;position:relative}.md-lab .s32-plot svg{position:absolute;inset:0;width:100%;height:100%}.md-lab .s32-plot text{font-family:inherit;fill:#52607f}
.md-lab .s32-wide{grid-template-columns:auto 1fr 3.2em}
.md-lab .s32-prob{display:grid;grid-template-columns:4em 1fr 3.4em;align-items:center;gap:.55em .7em}.md-lab .s32-prob b{color:#2c478f}.md-lab .s32-prob span{font-weight:800;text-align:right}
.md-lab .s32-seen{display:grid;gap:.35em;margin:0;padding:0;list-style:none;font-size:.88em}.md-lab .s32-seen li{display:flex;align-items:center;gap:.5em;padding:.25em .6em;border:1px solid #d5ddf1;border-radius:.4em;background:#fff}
.md-lab .s32-seen li>span{flex:1;min-width:0}.md-lab .s32-seen small,.md-lab .s32-rank small{color:#52607f}.md-lab .s32-seen .md-chip{font-size:.86em;padding:.15em .7em;white-space:nowrap}
.md-lab .s32-rank li>span{display:flex;align-items:baseline;gap:.5em;min-width:0}.md-lab .s32-rank i{flex:none;font-style:normal;font-weight:800;color:#3f5dae}.md-lab .s32-rank li>b{white-space:nowrap}
.md-lab .md-body .s32-note{font-size:.8em;color:#52607f}
.md-lab .s32-rubric{display:grid;grid-template-columns:5.6em repeat(3,minmax(0,1fr));grid-template-rows:auto;grid-auto-rows:minmax(0,1fr);gap:.4em;min-height:0;font-size:.88em}
.md-lab .s32-rubric>b{display:grid;place-items:center;border-radius:.4em;background:#ebf0fc;color:#2c478f}.md-lab .s32-rubric>span{padding:.15em;border-radius:.4em;background:#3f5dae;color:#fff;font-weight:800;text-align:center}
.md-lab .s32-rubric .md-choice{padding:.2em .5em}
.md-lab .s32-mid{background:#fff7df;color:#7a5600}
.md-lab .s32-pick{flex:none;display:flex;align-items:center;gap:1.4em;font-size:.9em}.md-lab .s32-pick .md-chip{font-size:.95em;padding:.2em 1em}.md-lab .s32-pick label{flex:1;display:grid;grid-template-columns:auto 1fr 4em;align-items:center;gap:.6em}.md-lab .s32-pick output{font-weight:800;color:#2c478f;text-align:right}
.md-lab .s32-age{flex:1}.md-lab .s32-age td:nth-child(n+2){width:auto;text-align:left}.md-lab .s32-age td[data-off=true]{color:#8894b0}.md-lab .s32-age tbody th{white-space:normal;width:9.5em}`);

 // Everyday experiences rewritten as input, processing and result. The first row is the slide's own example.
 const EXP=[{say:'사진을 찍으면 글자를 알려 준다',in:'사진',job:'문자 인식',out:'텍스트'},{say:'문장을 넣으면 다른 언어로 바꿔 준다',in:'문장',job:'번역문 생성',out:'다른 언어의 문장'},
  {say:'영상을 보고 나면 다음에 볼 영상이 뜬다',in:'시청 기록',job:'관심 추정과 추천',out:'영상 목록'},{say:'메일함이 광고 메일을 따로 모아 준다',in:'메일 내용',job:'스팸 여부 분류',out:'스팸 또는 정상 표시'}];
 const SLOTS=[['in','입력','서비스가 받는 데이터',4],['job','처리','작동하는 AI 기능',9],['out','결과','서비스가 내놓는 것',13]];
 L.add('s32Parts','custom',{
  hint:'사용 경험 한 문장을 <b>입력, 처리, 결과</b>로 나누어 다시 적습니다. 칸마다 하나씩 고른 뒤 확인하세요. 첫 문장 말고는 이 활동을 위해 만든 예시입니다.',
  body:'<div id="s32-pt" style="flex:1;min-height:0;display:flex;flex-direction:column;gap:.65em"></div>',
  state:()=>({round:0,pick:{},checked:false}),
  render(ui,st,reset){
   const good=()=>SLOTS.every(([k])=>st.pick[k]===EXP[st.round][k]);
   const main=ui.action('확인',()=>{
    if(st.checked&&good()){st.round++;st.pick={};st.checked=false}
    else if(SLOTS.some(([k])=>!st.pick[k])){ui.say('세 칸에서 하나씩 모두 고른 뒤 확인하세요.','bad');return}
    else st.checked=true;
    draw();
   },true);ui.action('처음부터',reset);
   function draw(){
    const over=st.round>=EXP.length;main.hidden=over;
    if(over){
     ui.q('#s32-pt').innerHTML=`<table class="md-check s32-table s32-done"><thead><tr><th>사용 경험</th><th>입력</th><th>처리</th><th>결과</th></tr></thead><tbody>${EXP.map(e=>`<tr><th scope="row">${e.say}</th><td>${e.in}</td><td>${e.job}</td><td>${e.out}</td></tr>`).join('')}</tbody></table>`;
     ui.say('네 경험을 모두 나누었습니다. 판단이 엇갈린 서비스도 입력과 결과가 무엇인지부터 확인해 봅니다.','good');return;
    }
    const e=EXP[st.round];
    ui.q('#s32-pt').innerHTML=`<p class="s32-say"><span>경험 ${st.round+1} / ${EXP.length}</span><b>"${e.say}"</b></p><div class="s32-cols">${SLOTS.map(([k,name,sub,seed])=>`<div class="md-panel"><h3>${name} <small>${sub}</small></h3>${L.shuffled(EXP.map(x=>x[k]),seed).map(v=>
     `<button type="button" class="md-choice" data-k="${k}" data-v="${v}" aria-pressed="${st.pick[k]===v}"${st.checked&&st.pick[k]===v?` data-result="${v===e[k]?'right':'wrong'}"`:''}>${v}</button>`).join('')}</div>`).join('')}</div>`;
    main.textContent=st.checked&&good()?(st.round===EXP.length-1?'정리 보기':'다음 경험'):'확인';
    const n=SLOTS.filter(([k])=>st.pick[k]===e[k]).length;
    ui.say(!st.checked?'입력, 처리, 결과 칸에서 알맞은 것을 하나씩 고르세요.':good()?`입력은 ${e.in}, 처리는 ${e.job}, 결과는 ${e.out}입니다.`:`세 칸 중 ${n}칸이 맞았습니다. 빨간 칸을 다시 골라 보세요.`,st.checked?(good()?'good':'bad'):'');
   }
   ui.body.addEventListener('click',e=>{const b=e.target.closest('.md-choice');if(!b||st.checked&&good())return;st.pick[b.dataset.k]=b.dataset.v;st.checked=false;draw()});draw();
  }});

 // A phone booking passes through three functions. An error stays in everything that follows the stage where it starts.
 const STAGES=[['음성 인식','말을 글로 바꿈','이름을 잘못 알아듣게 하기'],['대화 처리','글에서 예약 정보를 뽑음','시간을 잘못 뽑게 하기'],['음성 합성','응답 문장을 말소리로 바꿈','인원을 잘못 읽게 하기']];
 L.add('s32Pipeline','custom',{
  hint:'전화 예약 서비스의 세 단계 가운데 <b>오류가 생기는 단계</b>를 바꾸어 결과가 어디서부터 틀리는지 봅니다. 대화 내용은 이 활동을 위해 만든 예시입니다.',
  body:`<p class="s32-say"><span>고객의 말</span><b>"나래입니다. 내일 6시에 네 명 예약할게요."</b></p>
   <div class="s32-stages">${STAGES.map(([name,sub,err],i)=>`${i?'<i aria-hidden="true">→</i>':''}<div class="md-panel"><h3>${i+1} ${name} <small>${sub}</small></h3><p class="s32-box" data-o="${i}"></p><p class="s32-tag" data-t="${i}"></p><label class="s32-check"><input type="checkbox" data-e="${i}">${err}</label></div>`).join('')}</div>
   <div class="s32-ends"><p class="s32-box" data-r="book"><b>남은 예약 기록</b><span></span></p><p class="s32-box" data-r="heard"><b>고객이 들은 안내</b><span></span></p></div>`,
  state:()=>({e:[true,false,false]}),
  render(ui,st,reset){
   ui.action('오류 모두 끄기',()=>{st.e=[false,false,false];draw()});ui.action('처음부터',reset);
   function draw(){
    const [a,b,c]=st.e,name=a?'나라':'나래',time=b?7:6,book=`이름 ${name}, 내일 ${time}시, 4명`,heard=`"${name} 님, 내일 ${time}시 ${c?'세':'네'} 명으로 예약했습니다."`;
    [`${name}입니다. 내일 6시에 네 명 예약할게요.`,book,heard].forEach((text,i)=>{
     const own=st.e[i],carried=st.e.slice(0,i).some(Boolean),box=ui.q(`[data-o="${i}"]`),tag=ui.q(`[data-t="${i}"]`);
     box.textContent=text;box.dataset.result=own||carried?'wrong':'right';tag.dataset.bad=String(own||carried);
     tag.textContent=own&&carried?'넘어온 오류에 이 단계의 오류가 더해짐':own?'이 단계에서 생긴 오류':carried?'올바르게 작동했지만 넘어온 오류가 남음':'올바르게 작동함';
    });
    ui.all('[data-e]').forEach(n=>n.checked=st.e[Number(n.dataset.e)]);
    const set=(k,text,bad)=>{const n=ui.q(`[data-r=${k}]`);n.querySelector('span').textContent=text;n.dataset.result=bad?'wrong':'right'};
    set('book',book,a||b);set('heard',heard,a||b||c);
    const count=st.e.filter(Boolean).length;
    ui.say(!count?'세 단계가 모두 올바르게 작동해 예약 기록과 안내가 맞습니다. 한 단계에 오류를 넣어 보세요.':count>1?`오류가 ${count}곳에서 겹쳤습니다. 마지막 결과만 보아서는 어느 단계의 문제인지 알기 어렵습니다.`
     :a?'음성 인식에서 이름을 잘못 알아들었습니다. 뒤 단계가 올바르게 작동해도 예약 정보가 틀립니다.':b?'음성 인식은 맞았지만 대화 처리에서 시간을 잘못 뽑아 예약 기록이 틀립니다.':'예약 기록은 맞지만 음성 합성에서 인원을 잘못 읽어 고객은 틀린 안내를 들었습니다.',count?'bad':'good');
   }
   ui.body.addEventListener('change',e=>{const i=e.target.dataset.e;if(i!==undefined){st.e[Number(i)]=e.target.checked;draw()}});draw();
  }});

 // A toy classifier that only knows the classes it was trained on. Probabilities are shared among those classes alone.
 const KINDS=[['강아지',4,7,'#3f5dae'],['고양이',3,3,'#b36b00'],['토끼',9,2,'#16794c']],PHOTOS={dog:['강아지 사진',4,7],cat:['고양이 사진',3,3],rabbit:['토끼 사진',9,2]};
 L.add('s32Prob','custom',{
  hint:'<b>강아지와 고양이만</b> 학습한 분류 모델입니다. 토끼 사진을 넣거나 사진의 특징을 바꾸어 확률 막대를 살펴봅니다. 모델과 수치는 이 활동을 위해 만든 예시입니다.',
  body:`<div class="md-split" style="--split:1.15fr 1fr"><div class="md-panel"><div class="md-chips">${Object.entries(PHOTOS).map(([k,v])=>`<button type="button" class="md-chip" data-photo="${k}">${v[0]} 넣기</button>`).join('')}</div><div class="s32-plot" id="s32-pb-plot"></div>
   <label class="md-slider s32-wide">귀 길이<input type="range" data-k="ear" min="0" max="10" step="0.5"><output></output></label><label class="md-slider s32-wide">몸집<input type="range" data-k="body" min="0" max="10" step="0.5"><output></output></label></div>
   <div class="md-panel"><h3>모델이 내놓은 확률</h3><div class="s32-prob" id="s32-pb-bars"></div><label class="s32-check" style="margin-top:.4em"><input type="checkbox" id="s32-pb-learn">토끼 사진도 학습시키기</label>
   <p class="s32-note">이 모델은 넣은 사진이 학습한 범주의 대표 사진과 얼마나 가까운지만 비교합니다.</p><p class="md-verdict" id="s32-pb-out"></p></div></div>`,
  state:()=>({ear:9,body:2,photo:'rabbit',learned:false}),
  render(ui,st,reset){
   ui.action('처음부터',reset);
   const X=v=>52+v*31,Y=v=>262-v*23;
   function draw(){
    const known=KINDS.slice(0,st.learned?3:2),raw=known.map(k=>Math.exp(-((st.ear-k[1])**2+(st.body-k[2])**2)/5)),sum=raw.reduce((a,b)=>a+b,0),p=raw.map(v=>Math.round(v/sum*100)),top=p.indexOf(Math.max(...p));
    ui.q('#s32-pb-plot').innerHTML=`<svg viewBox="0 0 380 304" role="img" aria-label="귀 길이와 몸집으로 나타낸 사진과 학습한 범주"><path d="M52 32V262H362" fill="none" stroke="#9fb0dc" stroke-width="1.5"/>
     <text x="207" y="298" font-size="14" text-anchor="middle">귀 길이</text><text x="16" y="147" font-size="14" text-anchor="middle" transform="rotate(-90 16 147)">몸집</text>${[0,5,10].map(v=>`<text x="${X(v)}" y="280" font-size="13" text-anchor="middle">${v}</text><text x="44" y="${Y(v)+5}" font-size="13" text-anchor="end">${v}</text>`).join('')}
     ${known.map(k=>`<path d="M${X(st.ear)} ${Y(st.body)}L${X(k[1])} ${Y(k[2])}" stroke="${k[3]}" stroke-dasharray="4 4"/>`).join('')}
     ${known.map(k=>`<circle cx="${X(k[1])}" cy="${Y(k[2])}" r="26" fill="${k[3]}" fill-opacity=".16" stroke="${k[3]}" stroke-width="1.5"/><text x="${X(k[1])}" y="${Y(k[2])-31}" font-size="14" text-anchor="middle" style="fill:${k[3]};font-weight:800;paint-order:stroke;stroke:#f6f8fd;stroke-width:4px">${k[0]}</text>`).join('')}<rect x="${X(st.ear)-8}" y="${Y(st.body)-8}" width="16" height="16" rx="3" fill="#1c2c4c" stroke="#fff" stroke-width="2"/>
     <rect x="52" y="8" width="13" height="13" rx="3" fill="#1c2c4c"/><text x="72" y="19" font-size="13" style="fill:#1c2c4c;font-weight:800">넣은 사진</text></svg>`;
    ui.all('.md-slider input').forEach(n=>{n.value=st[n.dataset.k];n.nextElementSibling.textContent=st[n.dataset.k]});ui.all('[data-photo]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.photo===st.photo)));
    ui.q('#s32-pb-bars').innerHTML=known.map((k,i)=>`<b>${k[0]}</b><div class="md-meter"><i style="width:${p[i]}%;background:${k[3]}"></i></div><span>${p[i]}%</span>`).join('');ui.q('#s32-pb-learn').checked=st.learned;
    const out=ui.q('#s32-pb-out'),answer=`${known[top][0]} ${p[top]}%`;out.textContent=answer;out.dataset.tone=st.photo==='rabbit'?(top===2?'good':'bad'):'';out.classList.toggle('s32-mid',st.photo!=='rabbit');
    ui.say(st.photo==='rabbit'?(st.learned?`토끼를 학습한 뒤에는 '${answer}'라고 답합니다. 학습한 범주가 달라지면 같은 사진의 확률도 달라집니다.`:`토끼 사진인데 '${answer}'라고 답합니다. 확률 표시는 학습한 범주 안에서 비교한 값입니다.`)
     :st.photo?`'${answer}'라고 답합니다. 학습한 범주의 사진은 대표 사진과 가까워 높은 확률이 나옵니다.`:`가장 높은 확률은 '${answer}'입니다. 어떤 특징을 넣어도 확률은 학습한 범주끼리만 나누어 가집니다.`,st.photo==='rabbit'&&!st.learned?'bad':'');
   }
   ui.body.addEventListener('input',e=>{const k=e.target.dataset.k;if(k){st[k]=Number(e.target.value);st.photo='';draw()}else if(e.target.id==='s32-pb-learn'){st.learned=e.target.checked;draw()}});
   ui.body.addEventListener('click',e=>{const b=e.target.closest('[data-photo]');if(!b)return;const v=PHOTOS[b.dataset.photo];Object.assign(st,{photo:b.dataset.photo,ear:v[1],body:v[2]});draw()});draw();
  }});

 L.add('s32SixSort','sort',{columns:3,hint:'서비스를 검토하며 던지는 질문이 <b>여섯 가지 분석 요소</b> 가운데 어디에 해당하는지 놓아 봅니다.',
  bins:[{id:'goal',label:'목적'},{id:'in',label:'입력'},{id:'job',label:'처리'},{id:'out',label:'출력'},{id:'terms',label:'이용 조건'},{id:'fit',label:'적용 적합성'}],cards:[
  {id:'a',label:'누구의 어떤 문제를 해결하는가',answer:'goal',why:'서비스가 누구의 어떤 불편이나 문제를 해결하려는지 묻는 목적 질문입니다.'},
  {id:'b',label:'받는 데이터에 개인정보가 들어가는가',answer:'in',why:'서비스가 판단에 쓰는 데이터를 살피는 입력 질문입니다.'},
  {id:'c',label:'위치, 카메라 수집 기능이 켜져 있는가',answer:'in',why:'기기 센서로 수집하는 데이터를 확인하는 입력 질문입니다.'},
  {id:'d',label:'분류, 추천, 생성, 인식 중 무엇인가',answer:'job',why:'입력을 받아 결과를 만드는 AI 기능을 묻는 처리 질문입니다.'},
  {id:'e',label:'결과를 얼마나 믿을지 알려 주는 표시가 있는가',answer:'out',why:'결과의 형태와 신뢰도 표시를 살피는 출력 질문입니다.'},
  {id:'f',label:'학생 연령에 이용이 허용되는가',answer:'terms',why:'누가 어떤 조건으로 쓸 수 있는지 묻는 이용 조건 질문입니다.'},
  {id:'g',label:'무료 범위와 추가 과금 조건은 무엇인가',answer:'terms',why:'무료 범위와 추가 과금 조건을 묻는 비용 항목은 이용 조건에 들어갑니다.'},
  {id:'h',label:'AI 없이 더 쉬운 방법은 없는가',answer:'fit',why:'대안을 묻는 적용 적합성 질문입니다.'},
  {id:'i',label:'틀렸을 때의 피해와 대처 방법은 무엇인가',answer:'fit',why:'위험을 묻는 적용 적합성 질문입니다.'}]});

 // A toy recommender: interest per topic is the sum of the marks in the record, and ties keep the popularity order.
 const TOPICS={sci:'과학',cook:'요리',ball:'축구',song:'동요',trip:'여행'},MARKS=[['watch','시청',1],['like','좋아요',2],['skip','관심 없음',-2]];
 const SEEN=[['화산 실험 따라 하기','sci'],['식물 관찰 일기','sci'],['5분 계란 요리','cook'],['주말 축구 하이라이트','ball'],['동요 모음 30분','song'],['국내 기차 여행','trip']];
 const POOL=[['율동 동요 이어 듣기','song'],['초간단 간식 만들기','cook'],['드리블 기초 연습','ball'],['용암 램프 만들기','sci'],['제주 걷기 여행','trip'],['별자리 관찰하는 법','sci']];
 L.add('s32Recommend','custom',{
  hint:'영상마다 <b>시청, 좋아요, 관심 없음</b>을 눌러 이용 기록을 바꾸면 추천 순서가 달라집니다. 영상과 점수 규칙은 이 활동을 위해 만든 예시이며 실제 서비스의 방식이 아닙니다.',
  body:`<div class="md-split" style="--split:1.25fr 1fr"><div class="md-panel"><h3>내 이용 기록</h3><ul class="s32-seen">${SEEN.map(([t,k],i)=>`<li><span>${t} <small>${TOPICS[k]}</small></span>${MARKS.map(([m,name])=>`<button type="button" class="md-chip" data-i="${i}" data-m="${m}">${name}</button>`).join('')}</li>`).join('')}</ul>
   <p class="s32-note" style="margin-top:auto">주제별 관심 점수: 시청 +1, 좋아요 +2, 관심 없음 -2. 점수가 같으면 인기 순서를 따릅니다.</p></div><div class="md-panel"><h3>다음에 볼 영상의 추천 순서</h3><ul class="md-list s32-rank" id="s32-rc-rank"></ul></div></div>`,
  state:()=>({marks:['like','watch','','','watch','']}),
  render(ui,st,reset){
   ui.action('기록 지우기',()=>{st.marks=SEEN.map(()=>'');draw()});ui.action('처음부터',reset);
   function draw(){
    const score={};SEEN.forEach(([,k],i)=>{const m=MARKS.find(v=>v[0]===st.marks[i]);score[k]=(score[k]||0)+(m?m[2]:0)});
    const rank=POOL.map((v,i)=>({title:v[0],topic:v[1],pop:i+1,score:score[v[1]]||0})).sort((a,b)=>b.score-a.score||a.pop-b.pop);
    ui.all('.s32-seen .md-chip').forEach(b=>b.setAttribute('aria-pressed',String(st.marks[Number(b.dataset.i)]===b.dataset.m)));
    ui.q('#s32-rc-rank').innerHTML=rank.map((v,i)=>`<li><span><i>${i+1}</i>${v.title} <small>${TOPICS[v.topic]}, 인기 ${v.pop}위</small></span><b>${v.score>0?'+':''}${v.score}</b></li>`).join('');
    const top=rank[0],used=st.marks.some(Boolean);
    ui.say(!used?'이용 기록이 없으면 이 예시는 인기 순서대로 보여 줍니다. 기록을 남기면 순서가 어떻게 달라질까요?':top.score>0?`1순위는 '${top.title}'입니다. ${TOPICS[top.topic]} 영상의 관심 점수가 ${top.score}점으로 가장 높기 때문입니다.`
     :'관심 없음으로 표시한 주제의 영상이 아래로 내려갔습니다. 추천은 이용 기록으로 관심을 추정한 결과입니다.');
   }
   ui.body.addEventListener('click',e=>{const b=e.target.closest('.s32-seen .md-chip');if(!b)return;const i=Number(b.dataset.i);st.marks[i]=st.marks[i]===b.dataset.m?'':b.dataset.m;draw()});draw();
  }});

 L.add('s32PolicyQuiz','quiz',{hint:'교육용 AI 서비스의 유형과 학습지원 소프트웨어 선정 절차를 확인합니다.',closing:'날짜와 절차는 슬라이드에 적힌 출처 기준이며 이후 바뀔 수 있습니다.',questions:[
  {q:'2025년 8월 초중등교육법 개정으로 AI 디지털교과서는 무엇으로 규정되었을까요?',short:'AI 디지털교과서의 법적 지위',choices:['교과서','교육자료','체험형 도구'],answer:1,why:'교과서가 아닌 교육자료로 규정되었습니다.'},
  {q:'학교의 장이 학습지원 소프트웨어를 교육자료로 선정할 때 거쳐야 하는 것은?',short:'선정할 때 거치는 심의',choices:['교과협의회 심의','학교운영위원회 심의','별도 절차 없음'],answer:1,why:'교육부 장관이 정한 기준을 따르고 학교운영위원회 심의를 거쳐야 합니다.'},
  {q:'이 선정 절차는 언제부터 적용될까요?',short:'선정 절차의 적용 시점',choices:['2025년 8월','2026년 3월 1일','2027년 3월 1일'],answer:1,why:'선정 절차는 2026년 3월 1일부터 적용됩니다.'},
  {q:'교사가 학생 개인정보 없이 수업 준비에만 쓰는 소프트웨어도 심의 대상이다.',short:'수업 준비용 소프트웨어의 심의',choices:['그렇다','아니다'],answer:1,why:'학생 개인정보 없이 수업 준비나 행정업무에만 쓰는 소프트웨어는 심의 대상이 아닙니다.'},
  {q:'공공에서 만든 AI 펭톡을 정규 교과에서 쓰며 학생 개인정보를 처리한다면?',short:'공공 제작 서비스의 확인',choices:['공공 제작이므로 확인 없이 사용','선정 기준과 심의 적용'],answer:1,why:'공공 제작 서비스도 정규 교과에서 학생 개인정보를 처리하면 선정 기준과 심의를 적용합니다.'},
  {q:'선정 절차 네 단계의 순서로 알맞은 것은?',short:'선정 절차의 순서',columns:1,choices:['의견 수렴 → 기준 확인 → 안건 심의 → 확정','기준 확인 → 의견 수렴 → 확정 → 안건 심의','안건 심의 → 의견 수렴 → 기준 확인 → 확정'],answer:0,why:'교과협의회 등의 의견 수렴, 필수기준과 선택기준 확인, 학교운영위원회 심의, 최종 선정의 순서입니다.'}]});

 L.add('s32ToolSort','sort',{hint:'체험형 도구 세 가지의 특징 카드를 알맞은 도구에 놓아 봅니다. 학생이 넣은 데이터가 <b>어디로 가는지</b>에 주목합니다.',
  bins:[{id:'tm',label:'Teachable Machine'},{id:'qd',label:'Quick, Draw!'},{id:'en',label:'엔트리'}],cards:[
  {id:'a',label:'학습은 브라우저 안, 샘플은 서버로 보내지 않음',answer:'tm',why:'Teachable Machine은 계정 없이 시작하며 샘플을 서버로 보내지 않는다고 안내합니다.'},
  {id:'b',label:'20초 안에 그린 낙서를 신경망이 알아맞힘',answer:'qd',why:'Quick, Draw!는 20초 안에 그린 낙서를 신경망이 알아맞히는 게임입니다.'},
  {id:'c',label:'번역 블록은 파파고를 활용',answer:'en',why:'엔트리의 번역 블록은 파파고를, 음성 인식 블록은 클로바 스피치를 활용합니다.'},
  {id:'d',label:'Drive에 저장하면 샘플이 내 Drive에 남음',answer:'tm',why:'Teachable Machine에서 Drive에 저장하면 샘플이 내 Drive에 남습니다.'},
  {id:'e',label:'그림이 공개 낙서 데이터셋에 더해짐',answer:'qd',why:'Quick, Draw! 참여자의 그림은 공개 낙서 데이터셋에 더해져 기계학습 연구에 쓰입니다.'},
  {id:'f',label:'만 14세 미만은 가입 때 보호자 동의',answer:'en',why:'엔트리는 만 14세 미만이 회원가입할 때 보호자 동의가 필요합니다.'},
  {id:'g',label:'모델을 올리면 링크를 아는 누구나 사용',answer:'tm',why:'Teachable Machine에 모델을 올리면 링크를 아는 누구나 쓸 수 있습니다.'},
  {id:'h',label:'CC BY 4.0으로 누구나 내려받는 데이터셋',answer:'qd',why:'Quick, Draw! 데이터셋은 CC BY 4.0 라이선스로 누구나 내려받을 수 있습니다.'},
  {id:'i',label:'교사 계정으로 학급을 만들어 학생 관리',answer:'en',why:'엔트리는 교사 계정으로 학급을 만들어 학생을 관리할 수 있습니다.'}]});

 // The example rubric. Only the rule about 이용 조건 is on the slide; the other two verdicts are this activity's own example.
 const RUBRIC=[['교육 목적','학습 목표에 직접 필요함','일부 활동에만 도움이 됨','목표와 관계가 적음'],['발달 단계','학생이 결과를 해석함','교사 안내가 있으면 가능함','결과 해석이 어려움'],
  ['이용 조건','필수기준을 모두 충족함','계정 방식 조정이 필요함','연령이나 개인정보 기준을 충족하지 못함'],['대안','AI만의 장점이 분명함','대안과 효과가 비슷함','더 쉬운 대안이 있음'],['위험','오류 피해가 작고 바로 고칠 수 있음','교사 확인이 필요함','오류 피해가 큼']];
 L.add('s32Rubric','custom',{
  hint:'어떤 서비스를 떠올리며 다섯 기준의 점수를 골라 봅니다. <b>이용 조건이 1점</b>이면 어떻게 될까요? 그 밖의 판정 문구는 이 활동을 위해 정한 예시입니다.',
  body:`<div class="md-split" style="--split:2.5fr 1fr"><div class="s32-rubric"><span>기준</span><span>3 적합</span><span>2 보완 후 사용</span><span>1 부적합</span>
   ${RUBRIC.map((r,i)=>`<b>${r[0]}</b>${[3,2,1].map(n=>`<button type="button" class="md-choice" data-i="${i}" data-n="${n}">${r[4-n]}</button>`).join('')}`).join('')}</div>
   <div class="md-panel"><h3>판단 결과</h3><ul class="md-list"><li><span>합계</span><b id="s32-rb-sum"></b></li><li><span>이용 조건</span><b id="s32-rb-terms"></b></li></ul><p id="s32-rb-fix" style="font-size:.88em"></p><p class="md-verdict" id="s32-rb-out" style="margin-top:auto"></p></div></div>`,
  state:()=>({score:[3,2,1,3,3]}),
  render(ui,st,reset){
   ui.action('처음 값으로',reset);
   function draw(){
    ui.all('.s32-rubric .md-choice').forEach(b=>b.setAttribute('aria-pressed',String(st.score[Number(b.dataset.i)]===Number(b.dataset.n))));
    const sum=st.score.reduce((a,b)=>a+b,0),hold=st.score[2]===1,all=st.score.every(n=>n===3),weak=RUBRIC.filter((r,i)=>st.score[i]<3).map(r=>r[0]),low=RUBRIC.filter((r,i)=>i!==2&&st.score[i]===1).map(r=>r[0]);
    ui.q('#s32-rb-sum').textContent=`${sum} / 15점`;ui.q('#s32-rb-terms').textContent=st.score[2]+'점';
    ui.q('#s32-rb-fix').textContent=all?'3점 미만인 기준이 없습니다.':`3점 미만인 기준: ${weak.join(', ')}`;
    const out=ui.q('#s32-rb-out');out.textContent=hold?'학생 사용 보류':all?'사용':low.length?'보완 또는 보류 판단':'보완 후 사용';out.dataset.tone=hold?'bad':all?'good':'';out.classList.toggle('s32-mid',!hold&&!all);
    ui.say(hold?`합계는 ${sum}점이지만 이용 조건이 1점이므로 다른 점수와 관계없이 학생 사용을 보류합니다.`:all?'다섯 기준이 모두 3점입니다. 점수마다 근거를 찾은 문서를 함께 적어 둡니다.':low.length?`${low.join(', ')} 기준이 1점입니다. 이용 조건과 달리 정해진 규칙이 없으므로 근거를 놓고 보완해 쓸지 보류할지 판단합니다.`:`${weak.join(', ')} 기준을 어떻게 보완할지 적은 뒤 사용합니다. 점수를 가른 근거 문서도 함께 적습니다.`,hold?'bad':all?'good':'');
   }
   ui.body.addEventListener('click',e=>{const b=e.target.closest('.s32-rubric .md-choice');if(b){st.score[Number(b.dataset.i)]=Number(b.dataset.n);draw()}});draw();
  }});

 // The same service judged under three ways of using it, with the age lines the slides give for student accounts.
 const MODES=[['demo','교사 시연','학생 개인정보를 처리하지 않음','관찰과 예측 중심'],['group','모둠 체험, 저장 안 함','기기와 데이터 삭제 절차 확인','직접 조작, 결과는 남지 않음'],['account','학생 계정 사용','연령, 보호자 동의, 심의 확인','작품 저장과 누적 학습 가능']];
 const AGE=[['개인정보 보호법 제22조의2','개인정보 처리에 동의가 필요하면 법정대리인의 동의를 받음','법정대리인 동의 요건(만 14세 미만)에 해당하지 않음'],['Google 계정','스스로 관리할 수 없음 (만 14세 이상이 기준)','스스로 관리할 수 있음'],
  ['YouTube','부모나 법정대리인이 사용 설정해야 이용','약관의 이용 원칙(만 14세 이상)에 해당함'],['엔트리','회원가입 때 보호자 동의가 필요함','보호자 동의 대상(만 14세 미만)이 아님']];
 L.add('s32Mode','custom',{
  hint:'같은 서비스라도 <b>사용 방식</b>과 학생의 나이에 따라 확인할 조건이 달라집니다. 방식을 고르고 나이를 옮겨 보세요.',
  body:`<div class="s32-pick"><div class="md-chips">${MODES.map(m=>`<button type="button" class="md-chip" data-mode="${m[0]}">${m[1]}</button>`).join('')}</div><label>학생의 나이<input type="range" id="s32-md-age" min="8" max="16" step="1"><output></output></label></div>
   <div class="md-split" style="--split:1fr 1.7fr"><div class="md-panel"><h3>이 사용 방식에서</h3><ul class="md-list" id="s32-md-row" style="font-size:.88em"></ul><p class="md-verdict" id="s32-md-out" style="margin-top:auto;font-size:1.1em"></p></div>
   <div class="md-panel"><h3>학생 계정의 연령 기준</h3><table class="md-check s32-table s32-age"><tbody></tbody></table><p class="s32-note">초등학생 전체와 중학생 일부가 만 14세 미만에 해당합니다.</p></div></div>`,
  state:()=>({mode:'account',age:11}),
  render(ui,st,reset){
   ui.action('처음 값으로',reset);
   function draw(){
    const m=MODES.find(v=>v[0]===st.mode),account=st.mode==='account',young=st.age<14;
    ui.all('[data-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mode===st.mode)));ui.q('#s32-md-age').value=st.age;ui.q('#s32-md-age').nextElementSibling.textContent=`만 ${st.age}세`;
    ui.q('#s32-md-row').innerHTML=`<li style="display:grid;gap:.1em"><span>이용 조건 판단</span><b>${m[2]}</b></li><li style="display:grid;gap:.1em"><span>학습 경험</span><b>${m[3]}</b></li>`;
    ui.q('.s32-age tbody').innerHTML=AGE.map(r=>`<tr><th scope="row">${r[0]}</th><td data-off="${!account}"${account?` data-result="${young?'wrong':'right'}"`:''}>${account?r[young?1:2]:'학생 계정을 만들지 않음'}</td></tr>`).join('');
    const out=ui.q('#s32-md-out');out.textContent=!account?'계정 기준 해당 없음':young?'동의 절차부터 확인':'연령 기준에 맞음';out.dataset.tone=!account?'':young?'bad':'good';out.classList.toggle('s32-mid',!account);
    ui.say(st.mode==='demo'?'교사 시연은 학생 개인정보를 처리하지 않습니다. 대신 학습 경험은 관찰과 예측 중심이 됩니다.':st.mode==='group'?'모둠 체험은 기기와 데이터 삭제 절차를 확인합니다. 학생이 직접 조작하지만 결과는 남지 않습니다.'
     :young?`만 ${st.age}세는 만 14세 미만입니다. 학생 계정을 만들기 전에 법의 동의 요건과 서비스의 연령 기준을 함께 확인합니다.`:`만 ${st.age}세는 연령 기준에 맞습니다. 학생 계정을 쓰면 작품 저장과 누적 학습이 가능하지만 심의 확인은 남아 있습니다.`);
   }
   ui.body.addEventListener('click',e=>{const b=e.target.closest('[data-mode]');if(b){st.mode=b.dataset.mode;draw()}});ui.q('#s32-md-age').addEventListener('input',e=>{st.age=Number(e.target.value);draw()});draw();
  }});
})();
