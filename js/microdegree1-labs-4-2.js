/* 4주차 오후, 데이터와 인공지능 학습 Part 2: activity slides. Sentences, tables, charts and the toy model are examples written for these activities. */
(()=>{
 'use strict';
 const L=window.ceLabs;if(!L)return;const esc=L.esc;
 L.style(`.md-lab .s42-tbl{width:100%;margin:0;border-collapse:collapse;border-radius:0;box-shadow:none;overflow:visible;font-size:var(--fs,.95em)}
.md-lab .s42-tbl th,.md-lab .s42-tbl td{padding:var(--pad,.42em) .4em;border:1px solid #c9d3ec;font-size:1em;line-height:1.25;text-align:center;background:#fff}
.md-lab .s42-tbl thead th{background:#3f5dae;color:#fff;font-weight:800}.md-lab .s42-tbl tbody th{background:#ebf0fc;color:#2c478f;font-weight:800}
.md-lab .s42-tbl tr[data-gone=true] td,.md-lab .s42-tbl tr[data-gone=true] th{background:#eef0f5;color:#8a93a8;text-decoration:line-through}
.md-lab .s42-tbl td[data-mark=true]{background:#fff7df;color:#7a5600;font-weight:800}.md-lab .s42-tbl td small{font-weight:400}
.ce-lab.md-lab .s42-note{font-size:.8em;line-height:1.4;color:#52607f}
.md-lab .s42-agree{flex:1;min-height:0;display:flex;flex-direction:column}
.md-lab .s42-cards{flex:1;min-height:0;display:grid;grid-template-columns:1fr 1fr;grid-auto-rows:minmax(0,1fr);gap:.4em .8em}
.md-lab .s42-card{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:.5em;padding:.1em .7em;border:1px solid #d5ddf1;border-radius:.5em;background:#fff;font-size:.88em;line-height:1.3}
.md-lab .s42-card small{display:block;font-size:.88em;color:#3a4a6b}
.md-lab .s42-pick{display:flex;gap:.3em}
.md-lab .s42-pick button{padding:.3em .7em;border:1px solid #9fb0dc;border-radius:.5em;background:#ebf0fc;color:#2c478f;font-size:.92em;cursor:pointer;white-space:nowrap}
.md-lab .s42-pick button[data-on=true]{border-color:#3f5dae;background:#3f5dae;color:#fff}.md-lab .s42-pick button:disabled{cursor:default}.md-lab .s42-pick button:disabled:not([data-on=true]){opacity:.4}
.md-lab .s42-guide{display:grid;gap:.4em;margin:0;padding:0;list-style:none;font-size:.86em;line-height:1.4}
.md-lab .s42-guide li{display:grid;grid-template-columns:4.6em minmax(0,1fr);gap:.6em;padding:.4em .7em;border:1px solid #d5ddf1;border-radius:.4em;background:#fff}.md-lab .s42-guide b{color:#2c478f}
.ce-lab.md-lab .s42-rate{margin-top:auto;padding:.4em .8em;border-left:.25em solid #f0a202;background:#fff7df;font-size:.88em}
.md-lab .s42-ctl{display:grid;grid-template-columns:7.4em minmax(0,1fr);align-items:center;gap:.5em;font-size:.84em;line-height:1.25}
.md-lab .s42-seg{display:flex;gap:.35em}
.md-lab .s42-seg button{flex:1;padding:.32em .2em;border:1px solid #9fb0dc;border-radius:.5em;background:#fff;color:#2c478f;font-size:.95em;line-height:1.25;cursor:pointer;white-space:nowrap}
.md-lab .s42-tiles{display:grid;grid-template-columns:repeat(3,1fr);gap:.5em}
.md-lab .s42-tile{padding:.3em;border:1px solid #d5ddf1;border-radius:.5em;background:#fff;font-size:.86em;line-height:1.3;text-align:center}.md-lab .s42-tile b{display:block;font-size:1.6em;color:#3f5dae}
.md-lab .s42-svg{flex:1;min-height:0;width:100%;display:block}
.md-lab .s42-norm{display:grid;grid-template-columns:4.5em minmax(0,1fr) 4.2em 10em 5.4em;align-items:center;gap:.25em .8em;font-size:.9em}
.md-lab .s42-norm>b{color:#2c478f}.md-lab .s42-norm>i{font-style:normal;font-size:.86em;color:#52607f}.md-lab .s42-norm output{font-weight:800;color:#2c478f;text-align:right}
.md-lab .s42-chart{margin-top:.4em;font-weight:400}.md-lab .s42-chart svg{display:block;width:24.5em;margin:auto}
.md-lab .s42-conds{flex:none;display:grid;grid-template-columns:.6fr repeat(4,1fr);gap:.4em}
.md-lab .s42-conds button{padding:.34em .2em;border:1px solid #9fb0dc;border-radius:.5em;background:#fff;color:#2c478f;font-size:.86em;line-height:1.25;cursor:pointer}
.md-lab .s42-legend{flex:none;display:flex;flex-wrap:wrap;justify-content:center;gap:.2em 1.1em;font-size:.78em;line-height:1.3;color:#3a4a6b}.md-lab .s42-legend i{display:inline-block;width:.75em;height:.75em;margin-right:.35em;vertical-align:-.05em}
.md-lab .s42-hit{cursor:pointer}`);

 const PREDICT=[{id:'white',label:'흰 책상에서만 모은 모델',sub:'한 가지 배경에서 찍은 사진으로 학습'},{id:'many',label:'여러 배경에서 모은 모델',sub:'배경을 바꾸어 가며 찍은 사진으로 학습'},{id:'same',label:'비슷하게 맞힐 것이다',sub:'같은 도구이므로 차이가 없음'}];
 L.add('w4BgPredict','pick',{hint:'같은 도구로 만든 두 모델입니다. <b>나무 책상 위</b>의 풀과 지우개는 어느 모델이 더 잘 맞힐지 예상해 봅니다.',options:PREDICT,
  after:'예상을 기록했습니다. 뒤의 조건 비교 체험을 마친 뒤 다시 확인합니다.'});

 // Two raters, before and after a written guideline. The partner's labels are fixed examples.
 const NAME={c:'개념',p:'절차',h:'보류'},SETS=[[
  {t:'소수의 곱셈에서 소수점은 왜 옮기나요?',mate:'c'},{t:'소수의 곱셈은 어떤 순서로 계산하나요?',mate:'p'},{t:'평균은 무엇이고 어떻게 구하나요?',mate:'p'},{t:'각도기의 중심은 어디에 맞추나요?',mate:'p'},{t:'삼각형의 넓이는 왜 2로 나누나요?',mate:'c'},
  {t:'이 식은 어떻게 나온 거예요?',mate:'p'},{t:'약분은 왜 하고 어떤 순서로 하나요?',mate:'c'},{t:'그래프의 제목은 어디에 쓰나요?',mate:'p'},{t:'물은 왜 끓으면 수증기가 되나요?',mate:'c'},{t:'검산은 왜 필요하고 어떻게 하나요?',mate:'p'}],[
  {t:'이 공식은 어떻게 나온 거예요?',mate:'c'},{t:'자의 눈금 0은 어디에 맞추나요?',mate:'p'},{t:'비율은 무엇이고 어떻게 구하나요?',mate:'h'},{t:'분모가 같아야 더할 수 있는 이유는 무엇인가요?',mate:'c'},{t:'실험 기구는 어떤 순서로 정리하나요?',mate:'p'}]];
 const GUIDE=[['정의','개념은 뜻이나 이유를 묻는 질문, 절차는 방법, 순서, 위치를 묻는 질문'],['포함 예','개념: 왜 그런가요, 무엇이 다른가요. 절차: 어떤 순서로 하나요, 어디에 쓰나요'],['제외 예','"어떻게 나온 거예요"는 방법이 아니라 이유를 묻는 말이므로 절차가 아니라 개념'],['보류 규칙','한 문장에서 개념과 절차를 함께 물으면 보류로 따로 표시']];
 L.add('labelAgree','custom',{
  hint:'학생 질문을 <b>개념</b>과 <b>절차</b>로 나누고 짝과 비교합니다. 문장과 짝의 레이블은 이 활동을 위해 만든 예시입니다.',
  body:'<div class="s42-agree"></div>',
  state:()=>({phase:0,a:[[],[]],shown:[false,false]}),
  render(ui,st,reset){
   const main=ui.action('짝과 비교하기',()=>{const k=st.phase;if(!st.shown[k])st.shown[k]=true;else if(k===0)st.phase=1;draw()},true);ui.action('처음부터',reset);
   const count=k=>SETS[k].filter((it,i)=>st.a[k][i]).length,same=k=>SETS[k].filter((it,i)=>st.a[k][i]===it.mate).length,rate=k=>Math.round(same(k)/SETS[k].length*100);
   const cards=(k,opts)=>SETS[k].map((it,i)=>{const mine=st.a[k][i],shown=st.shown[k];
    return `<div class="s42-card" ${shown?`data-result="${mine===it.mate?'right':'wrong'}"`:''}><span>${esc(it.t)}${shown?`<small>짝의 레이블은 ${NAME[it.mate]}, ${mine===it.mate?'일치':'불일치'}</small>`:''}</span><div class="s42-pick">${opts.map(v=>`<button type="button" data-i="${i}" data-v="${v}" data-on="${mine===v}" ${shown?'disabled':''}>${NAME[v]}</button>`).join('')}</div></div>`}).join('');
   function draw(){
    const k=st.phase,total=SETS[k].length,n=count(k);
    ui.q('.s42-agree').innerHTML=k===0?`<div class="s42-cards">${cards(0,['c','p'])}</div>`
     :`<div class="md-split" style="--split:1fr 1.25fr"><div class="md-panel"><h3>레이블링 지침(예시)</h3><ul class="s42-guide">${GUIDE.map(([a,b])=>`<li><b>${a}</b><span>${esc(b)}</span></li>`).join('')}</ul><p class="s42-rate">지침 전 일치율 <b>${rate(0)}%</b> (10개 중 ${same(0)}개)${st.shown[1]?`<br>지침 후 일치율 <b>${rate(1)}%</b> (5개 중 ${same(1)}개)`:''}</p></div>
      <div class="md-panel"><h3>새 문장 5개 다시 나누기</h3><div class="s42-cards" style="grid-template-columns:1fr">${cards(1,['c','p','h'])}</div></div></div>`;
    main.textContent=k===0&&st.shown[0]?'지침 보고 다시 나누기':'짝과 비교하기';main.disabled=!st.shown[k]&&n<total;main.hidden=k===1&&st.shown[1];
    if(k===0)ui.say(st.shown[0]?`짝과 같은 답은 10개 중 ${same(0)}개, 일치율 ${rate(0)}%입니다. 일치하지 않은 문장을 모아 지침을 만듭니다.`:n<total?`기준 없이 각자 생각대로 나눕니다. 10개 중 ${n}개를 나누었습니다.`:'모두 나누었습니다. 짝과 비교해 같은 답의 비율을 계산합니다.');
    else if(!st.shown[1])ui.say(n<total?`지침을 읽고 새 문장을 나눕니다. 5개 중 ${n}개를 나누었습니다.`:'모두 나누었습니다. 지침을 따른 짝과 다시 비교합니다.');
    else ui.say(`지침 전 일치율 ${rate(0)}%, 지침 후 ${rate(1)}%입니다. ${rate(1)>rate(0)?'기준을 글로 정하자 같은 답을 고른 비율이 높아졌습니다.':'일치하지 않은 사례는 지침을 고치거나 보류 자료로 분리합니다.'}`,rate(1)>=rate(0)?'good':'');
   }
   ui.body.addEventListener('click',e=>{const b=e.target.closest('.s42-pick button');if(b&&!b.disabled){st.a[st.phase][Number(b.dataset.i)]=b.dataset.v;draw()}});draw();
  }});

 L.add('qualityMatch','match',{hint:'데이터 품질의 여섯 요소와 그 요소가 지켜지지 않은 <b>교실 데이터의 예</b>를 짝지어 봅니다.',leftTitle:'품질 요소',rightTitle:'점검에서 찾은 문제',seed:6,pairs:[
  {left:'정확성',right:'통학 시간 18분을 180분으로 입력'},{left:'완전성',right:'독서 시간 칸이 비어 있음'},{left:'일관성',right:'도보, 걸어서, 걸음이 섞임'},
  {left:'대표성',right:'맑은 날 사진만 수집'},{left:'균형',right:'풀 50장, 지우개 5장'},{left:'최신성',right:'3년 전 학급 수 자료 사용'}]});

 // A small table with one blank, one extreme value and three spellings of one category.
 const ROWS=[[1,'도보',12],[2,'버스',25],[3,'걸어서',8],[4,'자전거',15],[5,'버스',180],[6,'걸음',null],[7,'도보',24]],WALK=['도보','걸어서','걸음'];
 const mean=a=>a.reduce((s,v)=>s+v,0)/a.length,median=a=>{const s=[...a].sort((x,y)=>x-y),m=s.length>>1;return s.length%2?s[m]:(s[m-1]+s[m])/2},one=v=>(Math.round(v*10)/10).toFixed(1);
 const CLEAN=[['miss','빈칸(6번)',[['none','그대로 둠'],['drop','행 삭제'],['mean','평균으로 채움'],['median','중앙값으로 채움']]],['out','180분(5번)',[['keep','그대로 유지'],['fix','18분으로 수정'],['drop','행 삭제']]],['label','통학 방법 표기',[['raw','그대로 둠'],['one','도보로 통일']]]];
 function tidy(st){
  const rows=ROWS.map(([n,how,t])=>({n,how:st.label==='one'&&WALK.includes(how)?'도보':how,t,tag:'',gone:false}));
  for(const r of rows)if(r.t===180){if(st.out==='drop')r.gone=true;else if(st.out==='fix'){r.t=18;r.tag='수정'}}
  const known=rows.filter(r=>!r.gone&&r.t!==null).map(r=>r.t);
  for(const r of rows)if(r.t===null){if(st.miss==='drop')r.gone=true;else if(st.miss!=='none'){r.t=st.miss==='mean'?mean(known):median(known);r.tag='채움'}}
  const used=rows.filter(r=>!r.gone&&r.t!==null),groups=new Map();
  for(const r of rows)if(!r.gone)groups.set(r.how,(groups.get(r.how)||0)+1);
  return {rows,used,vals:used.map(r=>r.t),groups};
 }
 function dots(used,avg,mid){
  const X=v=>70+v*2.8,seen=[];let out='<line x1="70" y1="96" x2="574" y2="96" stroke="#55627f" stroke-width="1.5"/>';
  for(let v=0;v<=180;v+=30)out+=`<line x1="${X(v)}" y1="96" x2="${X(v)}" y2="102" stroke="#55627f"/><text x="${X(v)}" y="118" text-anchor="middle" font-size="13" fill="#52607f">${v}</text>`;
  out+='<text x="596" y="118" text-anchor="end" font-size="12" fill="#52607f">분</text>';
  const rule=(v,y,color,dash)=>`<line x1="${X(v)}" y1="${y+5}" x2="${X(v)}" y2="96" stroke="${color}" stroke-width="2" ${dash?'stroke-dasharray="5 3"':''}/>`;
  const name=(v,y,color,label,left)=>`<text x="${X(v)+(left?-6:6)}" y="${y}" text-anchor="${left?'end':'start'}" font-size="14" font-weight="800" fill="${color}">${label}</text>`;
  out+=rule(avg,10,'#3f5dae')+rule(mid,30,'#16794c',true)+name(avg,19,'#3f5dae',`평균 ${one(avg)}`,avg<mid)+name(mid,39,'#16794c',`중앙값 ${one(mid)}`,mid<=avg);
  for(const r of [...used].sort((a,b)=>a.t-b.t)){const x=X(r.t);let level=0;while(seen.some(s=>s.level===level&&Math.abs(s.x-x)<14))level++;seen.push({x,level});out+=`<circle cx="${x}" cy="${86-level*14}" r="6.5" fill="${r.tag?'#f0a202':'#1c2c4c'}" stroke="#fff" stroke-width="1"/>`}
  return out;
 }
 L.add('cleanTable','custom',{
  hint:'예시로 만든 통학 기록입니다. <b>빈칸, 180분, 섞인 표기</b>의 처리 방법을 바꾸며 평균과 중앙값이 어떻게 달라지는지 봅니다.',
  body:`<div class="md-split" style="--split:1fr 1.75fr"><div class="md-panel"><h3>우리 반 통학 기록(예시)</h3><table class="s42-tbl" id="s42-clean" style="--fs:.9em;--pad:.34em"><thead><tr><th>번호</th><th>통학 방법</th><th>통학 시간(분)</th></tr></thead><tbody></tbody></table><p class="s42-note" id="s42-groups" style="margin-top:auto"></p></div>
   <div class="md-panel" style="gap:.45em">${CLEAN.map(([k,label,opts])=>`<div class="s42-ctl"><b>${label}</b><div class="s42-seg" data-k="${k}">${opts.map(([v,t])=>`<button type="button" data-v="${v}">${t}</button>`).join('')}</div></div>`).join('')}
   <div class="s42-tiles"><div class="s42-tile">계산에 쓴 사례<b id="s42-n"></b></div><div class="s42-tile">평균 통학 시간<b id="s42-mean"></b></div><div class="s42-tile">중앙값<b id="s42-median"></b></div></div>
   <svg class="s42-svg" id="s42-dots" viewBox="0 0 600 124" role="img" aria-label="통학 시간 점그래프"></svg></div></div>`,
  state:()=>({miss:'none',out:'keep',label:'raw'}),
  render(ui,st,reset){
   ui.action('처음 값으로',reset);
   const draw=()=>{
    const {rows,used,vals,groups}=tidy(st),avg=mean(vals),mid=median(vals);
    ui.all('.s42-seg button').forEach(b=>b.setAttribute('aria-pressed',String(st[b.parentElement.dataset.k]===b.dataset.v)));
    ui.q('#s42-clean tbody').innerHTML=rows.map(r=>`<tr data-gone="${r.gone}"><th scope="row">${r.n}</th><td>${r.how}</td><td data-mark="${!!r.tag&&!r.gone}">${r.t===null?'':Number.isInteger(r.t)?r.t:one(r.t)}${r.tag&&!r.gone?` <small>(${r.tag})</small>`:''}</td></tr>`).join('');
    ui.q('#s42-groups').textContent=`통학 방법별 학생 수: ${[...groups].map(([k,v])=>`${k} ${v}명`).join(', ')}`;
    ui.q('#s42-n').textContent=`${vals.length}개`;ui.q('#s42-mean').textContent=`${one(avg)}분`;ui.q('#s42-median').textContent=`${one(mid)}분`;
    ui.q('#s42-dots').innerHTML=dots(used,avg,mid);
    const untouched=st.miss==='none'&&st.out==='keep'&&st.label==='raw';
    ui.say(untouched?'180분 하나가 평균을 44.0분으로 끌어올렸습니다. 중앙값은 19.5분입니다. 처리 방법을 하나씩 바꾸어 보세요.'
     :`평균 ${one(avg)}분, 중앙값 ${one(mid)}분입니다. ${st.out==='keep'?'180분은 원인을 확인한 뒤 수정, 삭제, 유지 중 하나를 정합니다.':st.out==='fix'?'입력 실수로 확인된 값만 고칩니다.':'행을 삭제하면 그 학생의 통학 방법도 함께 사라집니다.'}${st.miss==='mean'||st.miss==='median'?' 채운 값은 표에 따로 표시했습니다.':''}`);
   };
   ui.body.addEventListener('click',e=>{const b=e.target.closest('.s42-seg button');if(b){st[b.parentElement.dataset.k]=b.dataset.v;draw()}});draw();
  }});

 // Min-max scaling of the four commute times on the slide. Any value can be moved.
 const two=v=>String(Math.round(v*100)/100);
 function lines(v,lo,hi){
  const X=(t,max)=>70+t/max*500,axis=(y,max,ticks,unit)=>`<line x1="70" y1="${y}" x2="570" y2="${y}" stroke="#55627f" stroke-width="1.5"/>${ticks.map(t=>`<line x1="${X(t,max)}" y1="${y}" x2="${X(t,max)}" y2="${y+6}" stroke="#55627f"/><text x="${X(t,max)}" y="${y+20}" text-anchor="middle" font-size="12" fill="#52607f">${t}</text>`).join('')}<text x="8" y="${y+4}" font-size="13" font-weight="800" fill="#2c478f">${unit}</text>`;
  const place=(xs,y)=>{const put=[];for(const x of xs){let level=0;while(put.some(o=>o.level===level&&Math.abs(o.x-x)<21))level++;put.push({x,level,y:y-13-22*level})}return put};
  const top=place(v.map(t=>X(t,180)),90),bottom=hi>lo?place(v.map(t=>X((t-lo)/(hi-lo),1)),182):[];
  const dot=(p,i)=>`<circle cx="${p.x}" cy="${p.y}" r="10" fill="#3f5dae"/><text x="${p.x}" y="${p.y+4.5}" text-anchor="middle" font-size="12" font-weight="800" fill="#fff">${i+1}</text>`;
  return axis(90,180,[0,30,60,90,120,150,180],'분')+axis(182,1,[0,.25,.5,.75,1],'0~1')+bottom.map((p,i)=>`<line x1="${top[i].x}" y1="${top[i].y}" x2="${p.x}" y2="${p.y}" stroke="#b9c6e6" stroke-width="1.2"/>`).join('')+top.map(dot).join('')+bottom.map(dot).join('');
 }
 L.add('normalize','custom',{
  hint:'슬라이드의 통학 시간 네 값입니다. 값을 옮기며 <b>(값 − 최솟값) ÷ (최댓값 − 최솟값)</b>이 어떻게 바뀌는지 봅니다.',
  body:`<div class="md-panel" style="flex:1;min-height:0"><div class="s42-norm"><i>학생</i><i>통학 시간 바꾸기</i><i style="text-align:right">값</i><i>계산</i><i style="text-align:right">정규화 값</i>
   ${[0,1,2,3].map(i=>`<b>학생 ${i+1}</b><input type="range" data-i="${i}" min="0" max="180" step="5" aria-label="학생 ${i+1}의 통학 시간"><output data-o="v"></output><span data-o="c"></span><output data-o="n"></output>`).join('')}</div>
   <svg class="s42-svg" id="s42-lines" viewBox="0 0 600 208" role="img" aria-label="원래 값과 정규화 값의 수직선"></svg></div>`,
  state:()=>({v:[5,15,25,45]}),
  render(ui,st,reset){
   ui.action('4번을 180분으로',()=>{st.v[3]=180;draw()});ui.action('처음 값으로',reset);
   function draw(){
    const lo=Math.min(...st.v),hi=Math.max(...st.v),flat=hi===lo,norm=st.v.map(t=>flat?null:(t-lo)/(hi-lo));
    ui.all('.s42-norm input').forEach((n,i)=>{n.value=st.v[i]});
    ui.all('[data-o=v]').forEach((n,i)=>{n.textContent=st.v[i]+'분'});ui.all('[data-o=c]').forEach((n,i)=>{n.textContent=`(${st.v[i]} − ${lo}) ÷ ${hi-lo}`});ui.all('[data-o=n]').forEach((n,i)=>{n.textContent=flat?'계산 불가':two(norm[i])});
    ui.q('#s42-lines').innerHTML=lines(st.v,lo,hi);
    const rest=norm.filter(n=>n!==null&&n<1),squeezed=!flat&&rest.length===3&&rest.every(n=>n<=.25);
    ui.say(flat?'값이 모두 같으면 최댓값 − 최솟값이 0이어서 계산할 수 없습니다.':`최솟값 ${lo}분은 0, 최댓값 ${hi}분은 1이 됩니다.${squeezed?' 큰 값 하나 때문에 나머지 세 값이 0 가까이에 몰렸습니다.':' 나머지 값은 그 사이의 비율입니다.'}`);
   }
   ui.body.addEventListener('input',e=>{if(e.target.dataset.i){st.v[Number(e.target.dataset.i)]=Number(e.target.value);draw()}});draw();
  }});

 // Twenty example commute times: 5 8 9 | 10 12 12 14 15 15 17 18 | 20 22 24 25 28 | 30 33 35 | none | 58
 const BINS=[3,8,5,3,0,1];
 const histogram=`<svg viewBox="0 0 460 172" role="img" aria-label="통학 시간 히스토그램">${[0,2,4,6,8].map(n=>`<line x1="50" y1="${134-n*13.5}" x2="410" y2="${134-n*13.5}" stroke="${n?'#d5ddf1':'#55627f'}"/><text x="42" y="${138-n*13.5}" text-anchor="end" font-size="12" fill="#52607f">${n}</text>`).join('')}
  ${BINS.map((n,i)=>`<rect x="${51+i*60}" y="${134-n*13.5}" width="58" height="${n*13.5}" fill="#3f5dae"/>`).join('')}${[0,10,20,30,40,50,60].map((t,i)=>`<text x="${50+i*60}" y="150" text-anchor="middle" font-size="12" fill="#52607f">${t}</text>`).join('')}
  <text x="230" y="168" text-anchor="middle" font-size="12" fill="#1c2c4c">통학 시간(분)</text><text x="8" y="14" font-size="12" fill="#1c2c4c">학생 수(명)</text></svg>`;
 const BX=v=>50+v*6,boxplot=`<svg viewBox="0 0 460 172" role="img" aria-label="통학 시간 상자그림"><line x1="50" y1="124" x2="410" y2="124" stroke="#55627f"/>${[0,10,20,30,40,50,60].map(t=>`<line x1="${BX(t)}" y1="124" x2="${BX(t)}" y2="130" stroke="#55627f"/><text x="${BX(t)}" y="146" text-anchor="middle" font-size="12" fill="#52607f">${t}</text>`).join('')}
  <line x1="${BX(5)}" y1="70" x2="${BX(12)}" y2="70" stroke="#1c2c4c" stroke-width="2"/><line x1="${BX(26.5)}" y1="70" x2="${BX(35)}" y2="70" stroke="#1c2c4c" stroke-width="2"/><line x1="${BX(5)}" y1="56" x2="${BX(5)}" y2="84" stroke="#1c2c4c" stroke-width="2"/><line x1="${BX(35)}" y1="56" x2="${BX(35)}" y2="84" stroke="#1c2c4c" stroke-width="2"/>
  <rect x="${BX(12)}" y="42" width="${BX(26.5)-BX(12)}" height="56" fill="#ebf0fc" stroke="#3f5dae" stroke-width="2"/><line x1="${BX(17.5)}" y1="42" x2="${BX(17.5)}" y2="98" stroke="#3f5dae" stroke-width="3.5"/><circle cx="${BX(58)}" cy="70" r="5.5" fill="#fff" stroke="#c2413b" stroke-width="2.5"/>
  <text x="230" y="166" text-anchor="middle" font-size="12" fill="#1c2c4c">통학 시간(분)</text></svg>`;
 const chart=(text,svg)=>`${esc(text)}<div class="s42-chart">${svg}</div>`;
 L.add('chartQuiz','quiz',{hint:'한 학급 20명의 통학 시간을 그린 그래프입니다. 값은 이 활동을 위해 만든 예시입니다.',closing:'학습 전에 분포를 보면 결측, 치우침, 이상치를 먼저 발견할 수 있습니다.',questions:[
  {html:chart('히스토그램에서 학생이 가장 많이 몰린 구간은 어디일까요?',histogram),short:'값이 몰린 구간 읽기',columns:4,choices:['0분 이상 10분 미만','10분 이상 20분 미만','20분 이상 30분 미만','30분 이상 40분 미만'],answer:1,why:'10분 이상 20분 미만의 막대가 8명으로 가장 높습니다. 히스토그램은 값이 몰린 구간을 보여 줍니다.'},
  {html:chart('통학 시간이 30분 이상인 학생은 모두 몇 명일까요?',histogram),short:'막대의 높이 더하기',choices:['3명','4명','5명'],answer:1,why:'30분 이상 40분 미만 3명, 50분 이상 60분 미만 1명을 더하면 4명입니다.'},
  {html:chart('같은 자료의 상자그림입니다. 상자 안의 굵은 선은 무엇을 나타낼까요?',boxplot),short:'상자 안의 선',choices:['평균','중앙값','가장 큰 값'],answer:1,why:'상자그림은 중앙값과 퍼짐, 이상치 후보를 보여 줍니다. 이 자료의 중앙값은 17.5분입니다.'},
  {html:chart('상자그림에서 이상치 후보로 먼저 확인할 것은 어느 것일까요?',boxplot),short:'이상치 후보 찾기',choices:['상자의 왼쪽 끝','상자 안의 굵은 선','오른쪽에 따로 찍힌 점'],answer:2,why:'다른 값과 크게 동떨어진 58분의 점입니다. 히스토그램에서는 빈 구간 뒤에 혼자 있던 막대입니다.'},
  {q:'상자그림에서 따로 떨어진 58분의 점을 발견했습니다. 먼저 할 일은 무엇일까요?',short:'이상치 후보를 찾은 뒤 할 일',columns:1,choices:['이상한 값이므로 바로 삭제한다','원인을 확인한 뒤 수정, 삭제, 유지 중 하나를 정한다','평균값으로 바꾸어 넣는다'],answer:1,why:'이상치 후보는 원인을 확인한 뒤 수정, 삭제, 유지 중 하나를 정합니다.'}]});

 // A toy model: a photo is two numbers, and a new photo takes the majority label of its three nearest training photos.
 const BGY={white:9,desk:5,dark:1},SEEDS=[23,2026,7,99,31],KIND={glue:'풀',eraser:'지우개'};
 const CONDS=[{id:'base',name:'기준',glue:'30장, 배경 3종',eraser:'30장, 배경 3종',change:'없음'},{id:'few',name:'조건 1 데이터 양',glue:'5장, 배경 3종',eraser:'5장, 배경 3종',change:'사진 수'},
  {id:'bg',name:'조건 2 배경 다양성',glue:'30장, 흰 종이만',eraser:'30장, 어두운 천만',change:'배경과 클래스가 겹침'},{id:'skew',name:'조건 3 클래스 불균형',glue:'30장, 배경 3종',eraser:'5장, 배경 3종',change:'클래스별 사진 수'},
  {id:'noise',name:'조건 4 잘못된 레이블',glue:'30장 중 9장은 지우개',eraser:'30장 중 9장은 풀',change:'레이블 30% 오류'}];
 const rng=seed=>{let s=seed;return()=>(s=s*48271%2147483647)/2147483647};
 function shoot(seed,only){ // 30 photos of each object, taken in turn on a white, a middle and a dark background unless one background is given
  const r=rng(seed),out=[];
  for(const cls of ['glue','eraser']){const bgs=only?[only[cls]]:['white','desk','dark'];
   for(let i=0;i<30;i++){const bg=bgs[i%bgs.length];out.push({cls,label:cls,x:(cls==='glue'?7:3)+(r()-.5)*3.6,y:BGY[bg]+(r()-.5)*1.2})}}
  return out;
 }
 function training(cond,seed){
  const base=shoot(seed);
  if(cond==='few')return base.filter((p,i)=>i%30<5);
  if(cond==='bg')return shoot(seed,{glue:'white',eraser:'dark'});
  if(cond==='skew')return base.filter((p,i)=>p.cls==='glue'||i%30<5);
  if(cond==='noise')return base.map((p,i)=>i%30<9?{...p,label:p.cls==='glue'?'eraser':'glue'}:p);
  return base;
 }
 const testing=y=>[...[5.8,6.5,7.2,7.9,8.6].map(x=>({cls:'glue',x,y})),...[1.4,2.1,2.8,3.5,4.2].map(x=>({cls:'eraser',x,y}))];
 const nearest=(set,t)=>set.map(p=>({p,d:(p.x-t.x)**2+(p.y-t.y)**2})).sort((a,b)=>a.d-b.d).slice(0,3).map(o=>o.p);
 const guess=(set,t)=>nearest(set,t).filter(p=>p.label==='glue').length>=2?'glue':'eraser';
 const score=(set,tests)=>({glue:tests.filter(t=>t.cls==='glue'&&guess(set,t)==='glue').length,eraser:tests.filter(t=>t.cls==='eraser'&&guess(set,t)==='eraser').length});
 function scatter(set,tests,sel,newY){
  const X=x=>76+x*54,Y=y=>296-y*28,band=(y,fill,stroke,label,dash)=>`<rect x="76" y="${Y(y+.85)}" width="540" height="${28*1.7}" fill="${fill}" stroke="${stroke}" ${dash?'stroke-dasharray="6 4" stroke-width="1.6"':''}/><text x="70" y="${Y(y)+4.5}" text-anchor="end" font-size="12.5" font-weight="${dash?800:400}" fill="${dash?'#8a5a00':'#3a4a6b'}">${label}</text>`;
  let out=`<rect x="76" y="${Y(10)}" width="540" height="280" fill="#f1f4fb" stroke="#b9c6e6"/>`+band(BGY.white,'#fff','#c9d3ec','흰 종이')+band(BGY.desk,'#efe6d3','#d9caa8','중간 밝기')+band(BGY.dark,'#bfc6d8','#a3adc6','어두운 천')+band(newY,'#fff7df','#f0a202','새 배경',true);
  out+=`<text x="346" y="321" text-anchor="middle" font-size="14.5" fill="#1c2c4c">납작함 ← 사물의 모양 → 길쭉함</text><text transform="translate(13 156) rotate(-90)" text-anchor="middle" font-size="14.5" fill="#1c2c4c">어두움 ← 배경 밝기 → 밝음</text>`;
  const near=sel===null?[]:nearest(set,tests[sel]);
  if(sel!==null)out+=near.map(p=>`<line x1="${X(tests[sel].x)}" y1="${Y(tests[sel].y)}" x2="${X(p.x)}" y2="${Y(p.y)}" stroke="#1c2c4c" stroke-width="1.6"/>`).join('');
  for(const p of set){const ring=near.includes(p)?'stroke="#1c2c4c" stroke-width="2.4"':'stroke="#fff" stroke-width=".8"';
   out+=p.label==='glue'?`<circle cx="${X(p.x)}" cy="${Y(p.y)}" r="5.5" fill="#3f5dae" ${ring}/>`:`<rect x="${X(p.x)-5}" y="${Y(p.y)-5}" width="10" height="10" fill="#f0a202" ${ring}/>`}
  tests.forEach((t,i)=>{const ok=guess(set,t)===t.cls,color=ok?'#1f8a5b':'#c2413b',x=X(t.x),y=Y(t.y),w=sel===i?4:2.6;
   out+=`<g class="s42-hit" data-t="${i}">${t.cls==='glue'?`<circle cx="${x}" cy="${y}" r="12" fill="#fff" stroke="${color}" stroke-width="${w}"/>`:`<rect x="${x-11}" y="${y-11}" width="22" height="22" fill="#fff" stroke="${color}" stroke-width="${w}"/>`}<text x="${x}" y="${y+5}" text-anchor="middle" font-size="14" font-weight="800" fill="${color}">${ok?'○':'×'}</text><circle cx="${x}" cy="${y}" r="20" fill="transparent"/></g>`});
  return out;
 }
 L.add('dataLab','custom',{
  hint:'사진 한 장을 <b>사물의 모양</b>과 <b>배경 밝기</b> 두 숫자로 줄인 장난감 모델입니다. 실제 Teachable Machine의 결과가 아닙니다.',
  body:`<div class="s42-conds">${CONDS.map(c=>`<button type="button" data-c="${c.id}">${c.name}</button>`).join('')}</div>
   <div class="md-split" style="--split:1.5fr 1fr;gap:1em"><div class="md-panel" style="gap:.3em;padding:.5em .7em"><svg class="s42-svg" id="s42-plot" viewBox="0 0 640 330" role="img" aria-label="학습 사진과 평가 사진의 분포"></svg>
   <div class="s42-legend"><span><i style="background:#3f5dae;border-radius:50%"></i>풀 레이블 학습 사진</span><span><i style="background:#f0a202"></i>지우개 레이블 학습 사진</span><span>큰 동그라미와 큰 네모는 새 배경에서 찍은 풀, 지우개 평가 사진</span></div></div>
   <div class="md-panel" style="gap:.45em"><ul class="md-list" style="font-size:.86em;gap:.3em"><li><span>풀 클래스</span><b id="s42-glue"></b></li><li><span>지우개 클래스</span><b id="s42-eraser"></b></li><li><span>바꾼 점</span><b id="s42-change"></b></li></ul>
   <div class="s42-ctl" style="grid-template-columns:6.4em minmax(0,1fr)"><b>평가 사진의 새 배경</b><div class="s42-seg" data-k="newY"><button type="button" data-v="7">밝은 편</button><button type="button" data-v="3">어두운 편</button></div></div>
   <p class="s42-note">모델의 규칙: 새 사진과 가장 가까운 학습 사진 3장의 레이블 가운데 많은 쪽으로 예측합니다.</p><table class="s42-tbl" style="--fs:.92em;--pad:.36em;margin-top:auto"><thead><tr><th>평가 사진</th><th>기준 모델</th><th>조건 모델</th></tr></thead><tbody id="s42-score"></tbody></table></div></div>`,
  state:()=>({cond:'base',shot:0,newY:7,sel:null}),
  render(ui,st,reset){
   ui.action('사진 다시 찍기',()=>{st.shot=(st.shot+1)%SEEDS.length;st.sel=null;draw()});ui.action('처음부터',reset);
   function draw(){
    const cond=CONDS.find(c=>c.id===st.cond),seed=SEEDS[st.shot],set=training(st.cond,seed),tests=testing(st.newY),base=score(training('base',seed),tests),now=score(set,tests),on=st.cond!=='base';
    ui.all('.s42-conds button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.c===st.cond)));ui.all('.s42-seg button').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.v)===st.newY)));
    ui.q('#s42-glue').textContent=cond.glue;ui.q('#s42-eraser').textContent=cond.eraser;ui.q('#s42-change').textContent=cond.change;
    ui.q('#s42-plot').innerHTML=scatter(set,tests,st.sel,st.newY);
    ui.q('#s42-score').innerHTML=[['풀 5장',base.glue,now.glue,5],['지우개 5장',base.eraser,now.eraser,5],['합계 10장',base.glue+base.eraser,now.glue+now.eraser,10]].map(([name,a,b,n])=>`<tr><th scope="row">${name}</th><td>${a} / ${n}</td><td ${on&&b<a?'data-mark="true"':''}>${on?`${b} / ${n}`:''}</td></tr>`).join('');
    if(st.sel!==null){const t=tests[st.sel],near=nearest(set,t),g=near.filter(p=>p.label==='glue').length,pred=guess(set,t);
     ui.say(`이 ${KIND[t.cls]} 사진과 가장 가까운 학습 사진 3장의 레이블은 풀 ${g}장, 지우개 ${3-g}장입니다. 그래서 ${KIND[pred]}로 예측했고 ${pred===t.cls?'맞혔습니다':'틀렸습니다'}.`,pred===t.cls?'good':'bad')}
    else ui.say(on?`${cond.name}: 10장 중 ${now.glue+now.eraser}장(풀 ${now.glue}, 지우개 ${now.eraser}), 기준 모델은 ${base.glue+base.eraser}장입니다. 평가 사진을 누르면 가까운 학습 사진 3장이 보입니다.`
     :`${st.shot+1}번째 촬영입니다. 기준 모델은 새 배경의 평가 사진 10장 중 ${base.glue+base.eraser}장을 맞혔습니다. 위에서 조건을 하나 골라 비교해 보세요.`);
   }
   ui.body.addEventListener('click',e=>{
    const c=e.target.closest('.s42-conds button'),s=e.target.closest('.s42-seg button'),t=e.target.closest('.s42-hit');
    if(c){st.cond=c.dataset.c;st.sel=null}else if(s){st.newY=Number(s.dataset.v);st.sel=null}else if(t){const i=Number(t.dataset.t);st.sel=st.sel===i?null:i}else return;
    draw();
   });draw();
  }});

 L.add('w4BgReview','pick',{review:'w4BgPredict',hint:'조건을 바꾸어 본 지금, <b>나무 책상 위</b>의 풀과 지우개를 어느 모델이 더 잘 맞힐지 다시 골라 봅니다.',options:PREDICT,reasonLabel:'체험에서 본 장면을 근거로 이유를 적어 봅니다.'});

 L.add('safeSort','sort',{hint:'학생과 함께하는 이미지, 소리 실습에 쓸 자료입니다. <b>기본 실습 자료로 쓸 것</b>과 <b>쓰지 않거나 구도를 바꿀 것</b>으로 나눕니다.',
  bins:[{id:'ok',label:'기본 실습 자료로 씀',sub:'개인을 알아보기 어려운 자료'},{id:'no',label:'쓰지 않거나 구도를 바꿈',sub:'개인을 알아볼 수 있는 내용이 담김'}],cards:[
  {id:'a',label:'풀과 지우개 사진',answer:'ok',why:'사물 사진으로도 같은 학습 원리를 배울 수 있습니다.'},
  {id:'b',label:'학생 얼굴 사진',answer:'no',why:'얼굴 사진은 개인을 알아볼 수 있으므로 기본 실습 자료로 쓰지 않습니다.'},
  {id:'c',label:'교실 화분 사진',answer:'ok',why:'식물 사진으로도 같은 학습 원리를 배울 수 있습니다.'},
  {id:'d',label:'발표 목소리 녹음',answer:'no',why:'목소리 녹음은 개인을 알아볼 수 있으므로 기본 실습 자료로 쓰지 않습니다.'},
  {id:'e',label:'이름표가 함께 찍힌 사물 사진',answer:'no',why:'웹캠을 쓸 때는 이름표가 화면에 들어오지 않게 구도를 정합니다.'},
  {id:'f',label:'색연필로 그린 그림 사진',answer:'ok',why:'그림 사진으로도 같은 학습 원리를 배울 수 있습니다.'},
  {id:'g',label:'교실 게시물이 배경에 보이는 사진',answer:'no',why:'웹캠을 쓸 때는 교실 게시물이 화면에 들어오지 않게 구도를 정합니다.'},
  {id:'h',label:'나뭇잎 사진',answer:'ok',why:'식물 사진으로도 같은 학습 원리를 배울 수 있습니다.'}]});
})();
