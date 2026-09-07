'use strict';
(() => {
const $=id=>document.getElementById(id);
// Shared theme and site navigation are handled by main.js.
const stepLinks = [...document.querySelectorAll('.lab-steps a')];
function markStep(id) {
    stepLinks.forEach(link => {
        if (link.hash === '#' + id) link.setAttribute('aria-current', 'step');
        else link.removeAttribute('aria-current');
    });
}
markStep(location.hash.slice(1) || 'observe');
stepLinks.forEach(link => link.addEventListener('click', () => markStep(link.hash.slice(1))));
if ('IntersectionObserver' in window) {
    const steps = new IntersectionObserver(entries => {
        entries.forEach(entry => { if (entry.isIntersecting) markStep(entry.target.id); });
    }, { rootMargin: '-15% 0px -55% 0px' });
    document.querySelectorAll('.ai-lab section[id]').forEach(section => steps.observe(section));
}
document.addEventListener('DOMContentLoaded', () => {
    const toggle = $('mobileMenuToggle');
    const nav = $('mobileNav');
    toggle.setAttribute('aria-controls', 'mobileNav');
    toggle.setAttribute('aria-expanded', String(nav.classList.contains('open')));
    new MutationObserver(() => toggle.setAttribute('aria-expanded', String(nav.classList.contains('open'))))
        .observe(nav, { attributes: true, attributeFilter: ['class'] });
});
const make=(rows,prefix)=>rows.map(([color,sweet],i)=>({id:prefix+(i+1),color,sweet,label:sweet>=6?'A':'B'}));
const sets={biased:make([[0,2],[0,3],[0,4],[0,5],[1,6],[1,7],[1,8],[1,9]],'L'),diverse:make([[0,2],[1,3],[0,4],[1,5],[0,6],[1,6],[0,7],[1,7],[0,8],[1,8],[1,9],[0,10]],'D')};
const test=make([[0,7],[1,3],[0,8],[1,4],[1,9],[0,2],[0,6],[1,5]],'T');
const finalSet=make([[0,9],[1,2],[1,7],[0,4]],'F');
let model=null,human=null,revealed=false,finalUsed=false,testEverSeen=false,history=[];
const colorHTML=c=>`<span class="${c?'red':'green'}">${c?'빨강':'초록'}</span>`;
const predict=(m,row)=>row[m.feature]>=m.threshold?m.high:m.low;
const majority=rows=>rows.filter(x=>x.label==='A').length>=rows.length/2?'A':'B';
function fit(rows){let candidates=[{feature:'color',threshold:.5}];const values=[...new Set(rows.map(r=>r.sweet))].sort((a,b)=>a-b);for(let i=0;i<values.length-1;i++)candidates.push({feature:'sweet',threshold:(values[i]+values[i+1])/2});return candidates.map(c=>({...c,low:majority(rows.filter(r=>r[c.feature]<c.threshold)),high:majority(rows.filter(r=>r[c.feature]>=c.threshold))})).map(c=>({...c,errors:rows.filter(r=>predict(c,r)!==r.label).length})).sort((a,b)=>a.errors-b.errors)[0];}
const rule=m=>m.feature==='color'?`빨강이면 ${m.high}, 초록이면 ${m.low}`:`당도 ${m.threshold} 이상이면 ${m.high}, 미만이면 ${m.low}`;
const accuracy=(m,rows)=>rows.filter(r=>predict(m,r)===r.label).length;
function invalidate(){model=null;human=null;revealed=false;$('modelResult').textContent='선택이 바뀌었습니다. 규칙을 확정하고 모델을 다시 학습하세요.';$('scores').textContent='';$('reveal').disabled=true;$('fresh').disabled=true;renderTest();}
function training(){const rows=sets[$('dataset').value];$('trainingRows').innerHTML=rows.map(r=>`<tr><td>${r.id}</td><td>${colorHTML(r.color)}</td><td>${r.sweet}</td><td>${r.label}</td></tr>`).join('');}
function renderTest(){ $('testRows').innerHTML=test.map((r,i)=>`<tr><td>${r.id}</td><td>${colorHTML(r.color)}</td><td>${r.sweet}</td><td><select data-index="${i}" aria-label="${r.id} 나의 예상" ${!model?'disabled':''}><option value="">선택</option><option>A</option><option>B</option></select></td><td class="prediction">평가 후 공개</td><td class="answer">평가 후 공개</td></tr>`).join('');$('progress').textContent=model?'예상 기록 0 / 8':'먼저 모델을 학습하세요.';}
$('dataset').addEventListener('change',()=>{training();invalidate()});
$('humanFeature').addEventListener('change',()=>{$('threshold').disabled=$('humanFeature').value!=='sweet';invalidate()});$('threshold').addEventListener('input',invalidate);
$('learn').addEventListener('click',()=>{const threshold=Number($('threshold').value);if($('humanFeature').value==='sweet'&&(!$('threshold').value||!$('threshold').validity.valid||!Number.isFinite(threshold)||threshold<1||threshold>10)){ $('modelResult').textContent='당도 기준을 1~10 범위에서 0.5 단위로 입력하세요.';return;}const rows=sets[$('dataset').value];human={feature:$('humanFeature').value==='color'?'color':'sweet',threshold:$('humanFeature').value==='color'?.5:threshold,low:'B',high:'A'};model=fit(rows);revealed=false;$('scores').textContent='';$('freshResult').textContent=finalUsed?'최종 자료는 이미 확인했습니다. 이후 점수는 최종 성능의 독립 평가가 아닙니다.':'';$('modelResult').textContent=`나의 규칙: ${rule(human)}. 학습 자료 ${accuracy(human,rows)}/${rows.length}개 일치. 컴퓨터의 규칙: ${rule(model)}. 학습 자료 ${accuracy(model,rows)}/${rows.length}개 일치.`;$('reveal').disabled=true;$('fresh').disabled=true;renderTest();});
$('testRows').addEventListener('change',()=>{const n=[...$('testRows').querySelectorAll('select')].filter(s=>s.value).length;$('progress').textContent=`예상 기록 ${n} / 8`;$('reveal').disabled=n!==8||revealed;});
$('reveal').addEventListener('click',()=>{const inputs=[...$('testRows').querySelectorAll('select')];if(!model||inputs.some(s=>!s.value)||revealed)return;revealed=true;$('reveal').disabled=true;const repeat=testEverSeen;testEverSeen=true;inputs.forEach((s,i)=>{s.disabled=true;const tr=s.closest('tr');tr.querySelector('.prediction').textContent=predict(model,test[i]);tr.querySelector('.answer').textContent=test[i].label;});const manual=inputs.filter((s,i)=>s.value===test[i].label).length;const h=accuracy(human,test),m=accuracy(model,test);const wrong=test.filter(r=>predict(model,r)!==r.label).map(r=>r.id);$('scores').innerHTML=`<div class="results-grid"><div class="result">사람이 정한 규칙<br><span class="score">${h} / 8</span><p>${h/8*100}% 일치, 개별 예상은 ${manual}/8개 일치</p></div><div class="result">컴퓨터가 학습한 규칙<br><span class="score">${m} / 8</span><p>${m/8*100}% 일치</p></div></div><p>모델이 틀린 자료: ${wrong.join(', ')||'없음'}. ${repeat?'이미 확인한 자료에 대한 재평가입니다.':'처음 확인한 평가 자료의 결과입니다.'}</p><p>색만으로 판단하면 초록색의 높은 당도와 빨간색의 낮은 당도를 구분하지 못합니다. 보완 자료를 선택해 다시 학습하고 어떤 특징을 고르는지 비교해 보세요.</p>`;history.push({dataset:$('dataset').selectedOptions[0].text,rule:rule(model),train:`${accuracy(model,sets[$('dataset').value])}/${sets[$('dataset').value].length}`,test:`${m}/8`,human:`${h}/8`,repeat});$('fresh').disabled=finalUsed;$('progress').textContent='평가 완료. 오류가 발생한 자료의 특징을 비교하세요.';});
$('fresh').addEventListener('click',()=>{if(!model||!revealed||finalUsed)return;finalUsed=true;$('fresh').disabled=true;const correct=accuracy(model,finalSet);$('freshResult').innerHTML=`<div class="result"><h3>별도 최종 자료: ${correct} / 4개 일치</h3><p>평가한 규칙: ${rule(model)}. 이 자료의 결과를 보고 다시 조정하면 이후에는 별도의 새 자료가 필요합니다.</p><ul>${finalSet.map(r=>`<li>${r.id}, ${r.color?'빨강':'초록'}, 당도 ${r.sweet}, 예측 ${predict(model,r)}, 정답 ${r.label}</li>`).join('')}</ul></div>`;history.push({finalRule:rule(model),final:`${correct}/4`});});
function report(){return ['AI 이해 개인 실습',...history.map((h,i)=>h.final?`${i+1}. 별도 최종 평가: ${h.finalRule}, ${h.final}`:`${i+1}. ${h.dataset}\n학습 기준: ${h.rule}\n학습 ${h.train}, 평가 ${h.test}, 사람 규칙 ${h.human}${h.repeat?' (기존 평가 자료 재사용)':''}`),'나의 설명:',$('reflection').value||'(미작성)','학습용 가상 데이터에서의 결과입니다.'].join('\n');}
$('copy').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(report());$('copyStatus').textContent='복사했습니다. Zoom 채팅에 필요한 부분을 붙여 넣으세요.';}catch{$('copyStatus').textContent='이 환경에서는 자동 복사를 사용할 수 없습니다. 실습 기록 저장을 이용하세요.'}});
$('download').addEventListener('click',()=>{const url=URL.createObjectURL(new Blob(['\ufeff'+report()],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='AI이해_개인실습_기록.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);$('copyStatus').textContent='실습 기록을 저장했습니다.';});
$('reset').addEventListener('click',()=>{if(!confirm('입력과 기록을 모두 지우고 처음부터 시작할까요? 이미 확인한 평가 자료는 새로운 자료가 되지 않습니다.'))return;history=[];$('dataset').value='biased';$('humanFeature').value='color';$('threshold').value='6';$('threshold').disabled=true;$('reflection').value='';$('copyStatus').textContent='';$('freshResult').textContent=finalUsed?'최종 자료는 이미 확인했으므로 재평가할 수 없습니다.':'';training();invalidate();});training();renderTest();
})();
