/* Playable, local-only activities for computer education chapters 8–11. */
(() => {
  'use strict';
  const panel = document.getElementById('ce-lab');
  const chapter = Number(document.querySelector('.ce-viewer')?.dataset.chapter);
  if (!panel || chapter < 8 || chapter > 11) return;
  const stage = document.getElementById('ce-stage');
  const legacy = document.createElement('div');
  legacy.append(...panel.childNodes);
  const game = document.createElement('div');
  game.className = 'ce-game';
  game.hidden = true;
  panel.append(legacy, game);
  const q = selector => game.querySelector(selector);
  const all = selector => [...game.querySelectorAll(selector)];
  const button = (id, label, extra = '') => `<button type="button" id="${id}" ${extra}>${label}</button>`;
  const titles = {
    8: '신경망 게이트 수리대', 9: '우주 광물 분류소',
    10: '디지털 시민 편집국', 11: '센서 로봇 구조 미션'
  };
  const goals = {
    8: '가중치와 편향을 조절해 AND, OR, XOR 게이트 세 개를 복구하세요.',
    9: '학습 카드 네 장으로 1-최근접 이웃 분류기를 만들고 새 광물 8개 중 7개 이상을 분류하세요.',
    10: '게시물의 위험 요소를 직접 고쳐 세 번의 공유 준비 심사를 통과하세요.',
    11: '센서 조건에 맞는 행동을 연결해 로봇을 출발점에서 구조 지점까지 보내세요.'
  };
  const reflections = {
    8: 'AND와 OR를 푼 가중치는 무엇인가요? XOR에서 은닉층을 연결하자 입력의 표현이 어떻게 달라졌나요? 이 활동은 직접 가중치를 정하는 모형이며 자동 학습을 실행하지 않습니다.',
    9: '같은 수의 학습 카드라도 어떤 위치의 사례를 골랐을 때 성능이 좋아졌나요? 여기서는 두 특성을 같은 척도로 비교합니다. 반복해서 본 검증 자료와 별도로, 최종 성능을 평가할 새로운 시험 자료가 필요합니다.',
    10: '정보를 가리는 것, 사용 조건을 확인하는 것, 상대를 존중하는 행동은 각각 어떤 위험을 줄이나요? 모든 인물과 자료는 게임용 가상 사례입니다. 실제 게시나 신고는 실행되지 않습니다.',
    11: '입력인 센서 값, 처리인 조건문, 출력인 모터 행동을 연결해 설명해 보세요. 실제 로봇에서는 센서 오차와 회전 시간도 보정해야 합니다. 이 활동은 하드웨어에 연결되지 않는 격자 모형입니다.'
  };
  function shell(body) {
    game.innerHTML = `<div class="cg-heading"><span class="cg-eyebrow">${chapter}강 게임 실습, 2인 1조, 8~12분</span><h2>${titles[chapter]}</h2><p>${goals[chapter]}</p></div>${body}<details class="cg-reflection"><summary>활동 후 함께 생각하기</summary><p>${reflections[chapter]}</p><p>한 사람은 조작, 한 사람은 결과 예측을 맡고 역할을 바꿔 한 번 더 도전하세요.</p></details>`;
  }
  function feedback(message, success = false) {
    q('#cg-feedback').textContent = message;
    q('#cg-feedback').classList.toggle('cg-success', success);
  }
  const status = '<p id="cg-feedback" class="cg-feedback" role="status" aria-live="polite"></p>';
  let pause = () => {};

  function gateGame() {
    let level = 0, tries = 0, cleared = false;
    const names = ['AND', 'OR', 'XOR'];
    const inputs = [[0, 0], [0, 1], [1, 0], [1, 1]];
    shell(`<div class="cg-score" id="cg-score"></div><div class="cg-columns"><section class="cg-card"><h3>제어실</h3><p>출력 = 가중합이 0 이상이면 1, 아니면 0</p><div class="cg-fields">${['w1', 'w2', 'bias'].map((id, i) => `<label>${['가중치 w1', '가중치 w2', '편향 b'][i]}<input id="cg-${id}" type="range" min="-3" max="3" step="0.5" value="0"><output id="cg-${id}-value">0</output></label>`).join('')}</div><label class="cg-check"><input id="cg-hidden" type="checkbox"> 은닉층 연결, OR와 NAND 뉴런 사용</label><p id="cg-formula" class="cg-formula"></p><div class="cg-actions">${button('cg-run', '네 개의 입력 시험')}${button('cg-next', '다음 게이트', 'disabled')}${button('cg-reset', '처음부터')}</div><details><summary>수리 힌트</summary><p>AND는 두 입력이 모두 1일 때만, OR는 하나라도 1일 때 문을 엽니다. w1과 w2를 1로 놓고 편향을 바꿔 보세요. XOR는 원래 입력을 받는 단층 퍼셉트론으로 네 경우를 모두 맞힐 수 없습니다. 은닉층을 연결하면 OR와 NAND의 결과가 새 입력이 됩니다.</p></details></section><section class="cg-card"><h3>화물 게이트</h3><p>각 입력의 목표 신호를 모두 맞히면 다음 구역이 열립니다.</p><div id="cg-gates" class="cg-gates"></div></section></div>${status}`);
    const target = (a, b) => level === 0 ? a & b : level === 1 ? a | b : a ^ b;
    const board = results => {
      q('#cg-gates').innerHTML = inputs.map(([a, b], i) => `<div class="cg-gate ${results ? results[i] === target(a, b) ? 'cg-correct' : 'cg-wrong' : ''}"><b>입력 ${a}, ${b}</b><span>목표 ${target(a, b)}</span><strong>${results ? `출력 ${results[i]} ${results[i] === target(a, b) ? '✓ 통과' : '× 수리 필요'}` : '시험 대기'}</strong></div>`).join('');
    };
    function change() {
      cleared = false;
      q('#cg-next').disabled = true;
      ['w1', 'w2', 'bias'].forEach(id => q(`#cg-${id}-value`).textContent = q(`#cg-${id}`).value);
      const hidden = q('#cg-hidden').checked;
      q('#cg-formula').textContent = hidden ? 'h1 = OR(A, B), h2 = NAND(A, B), 가중합 = w1 × h1 + w2 × h2 + b' : '가중합 = w1 × A + w2 × B + b';
      board();
      feedback('설정한 값으로 네 입력의 출력을 예측한 뒤 시험하세요.');
    }
    function start() {
      q('#cg-score').textContent = `${level + 1} / 3 구역, ${names[level]} 게이트`;
      ['w1', 'w2', 'bias'].forEach(id => q(`#cg-${id}`).value = 0);
      q('#cg-hidden').checked = false;
      q('#cg-hidden').disabled = level !== 2;
      q('#cg-next').textContent = level === 2 ? '모든 게이트 복구 완료' : '다음 게이트';
      tries = 0;
      change();
    }
    all('input').forEach(input => input.addEventListener('input', change));
    q('#cg-run').onclick = () => {
      const [w1, w2, bias] = ['w1', 'w2', 'bias'].map(id => Number(q(`#cg-${id}`).value));
      const results = inputs.map(([a, b]) => {
        const [x, y] = q('#cg-hidden').checked ? [a | b, 1 - (a & b)] : [a, b];
        return Number(w1 * x + w2 * y + bias >= 0);
      });
      const hits = results.filter((v, i) => v === target(...inputs[i])).length;
      tries++;
      cleared = hits === 4;
      board(results);
      q('#cg-next').disabled = !cleared || level === 2;
      feedback(`${names[level]} ${hits} / 4 통과, ${tries}회 시험. ${cleared ? level === 2 ? '임무 성공! 세 게이트를 모두 복구했습니다. 은닉층의 역할을 설명해 보세요.' : '구역 복구 성공! 다음 게이트로 이동하세요.' : level === 2 && !q('#cg-hidden').checked ? 'XOR는 단층으로 완성할 수 없습니다. 은닉층을 연결해 다시 도전하세요.' : '틀린 입력을 확인하고 가중치나 편향을 수정하세요.'}`, cleared);
    };
    q('#cg-next').onclick = () => { if (cleared && level < 2) { level++; start(); } };
    q('#cg-reset').onclick = () => { level = 0; start(); };
    start();
  }

  function mineralGame() {
    const training = [[1, 1, '충전'], [2, 2, '충전'], [8, 8, '충전'], [9, 9, '충전'], [1, 8, '냉각'], [2, 9, '냉각'], [8, 1, '냉각'], [9, 2, '냉각']];
    const validation = [[1, 2, '충전'], [2, 1, '충전'], [8, 9, '충전'], [9, 8, '충전'], [1, 9, '냉각'], [2, 8, '냉각'], [8, 2, '냉각'], [9, 1, '냉각']];
    const chosen = new Set();
    let tries = 0;
    shell(`<div class="cg-score" id="cg-score">학습 카드 0 / 4, 검증 전</div><div class="cg-columns"><section class="cg-card"><h3>학습 카드 선택</h3><p>밝기와 질량은 모두 0~10 척도입니다. 충전용과 냉각용 사례를 골고루 골라 주세요. 선택한 카드를 다시 누르면 반환합니다.</p><div class="cg-samples">${training.map(([x, y, label], i) => `<button type="button" data-sample="${i}" aria-pressed="false"><b>${i + 1}번 ${label}</b><span>밝기 ${x}, 질량 ${y}</span></button>`).join('')}</div><div class="cg-actions">${button('cg-run', '분류기 실행', 'disabled')}${button('cg-reset', '선택 초기화')}</div><p>규칙: 두 특성의 직선거리가 가장 가까운 학습 카드의 이름을 붙입니다. 거리가 같으면 번호가 작은 카드를 사용합니다.</p></section><section class="cg-card"><h3>광물 탐사 지도</h3><svg id="cg-map" viewBox="0 0 300 260" role="img" aria-label="가로축 밝기, 세로축 질량. 학습 카드의 분포"></svg><p>원은 충전용, 사각형은 냉각용. 테두리가 굵은 표식은 선택한 학습 카드입니다.</p></section></div>${status}<section class="cg-card"><h3>새 광물 8개의 검증 결과</h3><div id="cg-minerals" class="cg-minerals">아직 분류하지 않았습니다. 정답이 붙은 학습 카드 네 장을 선택하세요.</div></section>`);
    function draw() {
      q('#cg-score').textContent = `학습 카드 ${chosen.size} / 4, 검증 시도 ${tries}회`;
      all('[data-sample]').forEach(el => { const selected = chosen.has(Number(el.dataset.sample)); el.setAttribute('aria-pressed', String(selected)); el.disabled = !selected && chosen.size === 4; });
      q('#cg-run').disabled = chosen.size !== 4;
      q('#cg-map').innerHTML = `<path d="M30 10V220H285" fill="none" stroke="#7083a0"/><text x="125" y="251">밝기 →</text><text x="4" y="15">질량</text>${[0, 5, 10].map(n => `<text x="${28 + n * 24}" y="237">${n}</text><text x="8" y="${224 - n * 20}">${n}</text>`).join('')}${training.map(([x, y, label], i) => { const cx = 30 + x * 24, cy = 220 - y * 20; return `<g fill="${label === '충전' ? '#2368ab' : '#975118'}" stroke="${chosen.has(i) ? '#142644' : '#fff'}" stroke-width="${chosen.has(i) ? 4 : 1}">${label === '충전' ? `<circle cx="${cx}" cy="${cy}" r="9"/>` : `<rect x="${cx - 9}" y="${cy - 9}" width="18" height="18"/>`}</g><text x="${cx + 11}" y="${cy + 4}">${i + 1}</text>`; }).join('')}`;
    }
    all('[data-sample]').forEach(el => el.onclick = () => {
      const id = Number(el.dataset.sample);
      if (chosen.has(id)) chosen.delete(id); else if (chosen.size < 4) chosen.add(id);
      draw();
      q('#cg-minerals').textContent = '학습 카드가 변경되었습니다. 분류기를 다시 실행하세요.';
      feedback(`${chosen.size}장 선택. ${chosen.size === 4 ? '새 광물을 분류할 준비가 되었습니다.' : '네 장을 모두 선택하세요.'}`);
    });
    q('#cg-run').onclick = () => {
      if (chosen.size !== 4) return;
      tries++;
      let hits = 0;
      q('#cg-minerals').innerHTML = validation.map(([x, y, label], i) => {
        const nearest = [...chosen].sort((a, b) => ((training[a][0] - x) ** 2 + (training[a][1] - y) ** 2) - ((training[b][0] - x) ** 2 + (training[b][1] - y) ** 2) || a - b)[0];
        const predicted = training[nearest][2], correct = predicted === label;
        if (correct) hits++;
        return `<div class="cg-mineral ${correct ? 'cg-correct' : 'cg-wrong'}"><b>광물 ${i + 1}, ${correct ? '✓ 배송 성공' : '× 오배송'}</b><span>밝기 ${x}, 질량 ${y}</span><span>${nearest + 1}번 카드 → ${predicted}</span><span>실제 용도: ${label}</span></div>`;
      }).join('');
      draw();
      feedback(`${hits} / 8 배송 성공, 정확도 ${Math.round(hits / 8 * 100)}%. ${hits >= 7 ? '임무 성공! 지도의 여러 구역을 대표하는 사례가 왜 필요한지 설명해 보세요.' : '목표는 7개 이상입니다. 오배송 광물 근처의 학습 사례를 보충해 다시 도전하세요.'}`, hits >= 7);
    };
    q('#cg-reset').onclick = () => { chosen.clear(); tries = 0; draw(); q('#cg-minerals').textContent = '아직 분류하지 않았습니다.'; feedback('새 탐사 시작! 대표 사례 네 장을 골라 주세요.'); };
    draw();
    feedback('같은 이름의 카드만 고르면 어떤 일이 생길까요? 예상한 뒤 실행해 보세요.');
  }

  function editorGame() {
    let mission = 0, attempts = 0, complete = false;
    const missions = [
      { title: '1. 작품 사진의 이름표', brief: '공개할 작품 사진에 가상 학생의 이름과 연락처가 보입니다. 작품 설명은 살리고 두 정보를 가려 주세요.', fields: '<label class="cg-check"><input id="cg-name" type="checkbox"> 이름 가리기</label><label class="cg-check"><input id="cg-contact" type="checkbox"> 연락처 가리기</label>', preview: () => `<b>우리 반 발명품 전시</b><p>제작자: ${q('#cg-name').checked ? '익명 학생' : '가상 학생 나별'}</p><p>연락처: ${q('#cg-contact').checked ? '비공개' : '별빛반 내부 연락처'}</p><p>종이로 만든 태양광 자동차를 소개합니다.</p>`, check: () => [q('#cg-name').checked ? '' : '이름표를 가려 주세요.', q('#cg-contact').checked ? '' : '연락처를 가려 주세요.'] },
      { title: '2. 허락받은 별 그림', brief: '작가가 “이 활동의 게시물에 사용 가능, 작가 이름 표시”라는 조건으로 별 그림을 제공했습니다. 허락된 파일을 고르고 조건을 지켜 주세요.', fields: '<label>사용할 그림<select id="cg-asset"><option value="unknown">인터넷에서 찾은 출처 불명 그림</option><option value="allowed">가상 작가 하늘의 허락받은 별 그림</option></select></label><label class="cg-check"><input id="cg-credit" type="checkbox"> 작가 이름과 제공 사실 표시</label>', preview: () => `<b>우주 탐사 안내</b><div class="cg-art" aria-label="선택한 그림">${q('#cg-asset').value === 'allowed' ? '☆ ☆ ☆' : '? ? ?'}</div><p>${q('#cg-credit').checked ? '그림: 가상 작가 하늘, 작가 제공' : '그림 정보가 표시되지 않았습니다.'}</p>`, check: () => [q('#cg-asset').value === 'allowed' ? '' : '사용 허락이 확인된 파일로 바꿔 주세요.', q('#cg-credit').checked ? '' : '작가가 요청한 표시 조건을 지켜 주세요.'] },
      { title: '3. 친구를 존중하는 전시', brief: '친구는 얼굴 공개에 동의하지 않았습니다. 얼굴을 가리고 작품에 대한 구체적이고 존중하는 댓글을 선택하세요.', fields: '<label class="cg-check"><input id="cg-face" type="checkbox"> 동의하지 않은 친구 얼굴 가리기</label><label>전시 댓글<select id="cg-comment"><option value="tease">이것도 작품이야? 다 같이 놀리자.</option><option value="kind">바퀴를 연결한 아이디어가 좋아. 더 잘 굴러가게 함께 고쳐 볼까?</option><option value="forward">웃긴 사진이니까 다른 단체방에도 퍼뜨리자.</option></select></label>', preview: () => `<b>친구의 작품을 소개합니다</b><p>사진: ${q('#cg-face').checked ? '작품과 가려진 얼굴' : '작품과 동의하지 않은 친구 얼굴'}</p><blockquote>${q('#cg-comment').selectedOptions[0].textContent}</blockquote>`, check: () => [q('#cg-face').checked ? '' : '공개에 동의하지 않은 얼굴을 가려 주세요.', q('#cg-comment').value === 'kind' ? '' : '조롱과 무단 확산 대신 존중하는 피드백을 선택하세요.'] }
    ];
    shell(`<div class="cg-score" id="cg-score"></div><div class="cg-columns"><section class="cg-card"><h3 id="cg-mission"></h3><p id="cg-brief"></p><fieldset id="cg-edit"><legend>게시물 수정</legend><div id="cg-fields" class="cg-fields"></div></fieldset><div class="cg-actions">${button('cg-run', '공유 준비 심사')}${button('cg-next', '다음 미션', 'disabled')}${button('cg-reset', '처음부터')}</div></section><section class="cg-card"><h3>게시물 미리보기</h3><div id="cg-preview" class="cg-post"></div><p class="cg-note">연습용 미리보기입니다. 외부에 게시되지 않습니다.</p></section></div>${status}`);
    function start() {
      const m = missions[mission];
      complete = false;
      q('#cg-score').textContent = `공유 준비 도장 ${mission} / 3`;
      q('#cg-mission').textContent = m.title;
      q('#cg-brief').textContent = m.brief;
      q('#cg-fields').innerHTML = m.fields;
      q('#cg-edit').disabled = false;
      q('#cg-run').disabled = false;
      q('#cg-next').disabled = true;
      q('#cg-next').textContent = mission === 2 ? '편집국 임무 완료' : '다음 미션';
      const preview = () => { q('#cg-preview').innerHTML = m.preview(); feedback('미리보기가 바뀌었습니다. 공개할 내용을 확인한 뒤 심사하세요.'); };
      all('#cg-fields input, #cg-fields select').forEach(el => el.onchange = preview);
      preview();
    }
    q('#cg-run').onclick = () => {
      if (complete) return;
      attempts++;
      const issues = missions[mission].check().filter(Boolean);
      complete = issues.length === 0;
      if (complete) {
        q('#cg-score').textContent = `공유 준비 도장 ${mission + 1} / 3, 심사 ${attempts}회`;
        q('#cg-edit').disabled = true;
        q('#cg-run').disabled = true;
        q('#cg-next').disabled = mission === 2;
      }
      feedback(complete ? mission === 2 ? '임무 성공! 세 게시물의 공유 준비를 마쳤습니다. 각 미션에서 줄인 위험을 설명해 보세요.' : '심사 통과! 공유 준비 도장을 받았습니다. 다음 미션으로 이동하세요.' : `수정 후 재심사: ${issues.join(' ')}`, complete);
    };
    q('#cg-next').onclick = () => { if (complete && mission < 2) { mission++; start(); } };
    q('#cg-reset').onclick = () => { mission = 0; attempts = 0; start(); };
    start();
  }

  function robotGame() {
    const map = ['#######', '#S#..G#', '#.#.#.#', '#...#.#', '#####.#', '#.....#', '#######'];
    const directions = [[0, -1], [1, 0], [0, 1], [-1, 0]];
    let x, y, heading, steps, finished, timer = null, visited;
    const options = '<option value="forward">전진</option><option value="rightForward">오른쪽 회전 후 전진</option><option value="left">왼쪽 회전</option><option value="right">오른쪽 회전</option>';
    shell(`<div class="cg-score" id="cg-score"></div><div class="cg-columns"><section class="cg-card"><h3>구조 로봇의 프로그램</h3><p>위에서부터 처음 맞는 조건 하나만 실행합니다. 회전 한 번은 90도입니다. 32회 안에 벽을 피해 G까지 이동하세요.</p><div class="cg-fields"><label>1. 오른쪽 길이 열려 있으면<select id="cg-right">${options}</select></label><label>2. 아니고 앞길이 열려 있으면<select id="cg-front">${options}</select></label><label>3. 둘 다 막혀 있으면<select id="cg-blocked">${options}</select></label></div><div class="cg-actions">${button('cg-step', '한 단계 실행')}${button('cg-run', '자동 실행')}${button('cg-pause', '일시 정지', 'disabled')}${button('cg-reset', '출발점으로')}</div><p>규칙을 바꾸면 로봇이 출발점으로 돌아갑니다. 다른 슬라이드로 이동하면 자동 실행을 멈춥니다.</p><details><summary>구조 힌트</summary><p>오른쪽 길이 열렸으면 오른쪽으로 회전하고 전진, 아니고 앞길이 열렸으면 전진, 둘 다 막혔으면 왼쪽으로 회전해 보세요.</p></details></section><section class="cg-card"><h3>구조 현장</h3><div id="cg-maze" class="cg-maze" role="img" aria-label="벽으로 둘러싸인 7행 7열 미로"></div><p id="cg-sensors"></p><p>■ 벽, S 출발, G 구조 지점, 화살표는 로봇 방향, 옅은 칸은 지나온 길</p></section></div>${status}`);
    q('#cg-front').value = 'forward';
    q('#cg-blocked').value = 'right';
    const open = direction => { const [dx, dy] = directions[direction]; return map[y + dy]?.[x + dx] !== undefined && map[y + dy][x + dx] !== '#'; };
    function controls() {
      q('#cg-run').disabled = finished || timer !== null;
      q('#cg-step').disabled = finished || timer !== null;
      q('#cg-pause').disabled = timer === null;
      all('select').forEach(el => el.disabled = timer !== null);
    }
    function draw() {
      q('#cg-maze').innerHTML = map.flatMap((row, rowIndex) => [...row].map((tile, col) => `<span aria-hidden="true" class="${tile === '#' ? 'cg-wall' : visited.has(`${col},${rowIndex}`) ? 'cg-visited' : ''} ${x === col && y === rowIndex ? 'cg-robot' : ''}">${x === col && y === rowIndex ? ['↑', '→', '↓', '←'][heading] : tile === '#' ? '■' : tile === '.' ? '' : tile}</span>`)).join('');
      q('#cg-maze').setAttribute('aria-label', `7행 7열 미로. 로봇 ${y + 1}행 ${x + 1}열, ${['북', '동', '남', '서'][heading]}쪽. 목표 2행 6열. ${finished && map[y][x] === 'G' ? '구조 성공.' : ''}`);
      q('#cg-sensors').textContent = `센서 입력: 오른쪽 ${open((heading + 1) % 4) ? '열림' : '벽'}, 앞쪽 ${open(heading) ? '열림' : '벽'}`;
      q('#cg-score').textContent = `사용 에너지 ${steps} / 32, 위치 ${y + 1}행 ${x + 1}열`;
      controls();
    }
    function stop(announce = false) {
      const wasRunning = timer !== null;
      clearInterval(timer);
      timer = null;
      controls();
      if (announce && wasRunning && !finished) feedback('일시 정지했습니다. 현재 위치에서 계속 실행할 수 있습니다.');
    }
    function reset() {
      stop(); x = 1; y = 1; heading = 1; steps = 0; finished = false;
      visited = new Set(['1,1']);
      draw();
      feedback('센서가 읽을 값과 실행할 행동을 예측한 뒤 한 단계씩 실행해 보세요.');
    }
    function step() {
      if (finished) return;
      const rule = open((heading + 1) % 4) ? 'right' : open(heading) ? 'front' : 'blocked';
      const select = q(`#cg-${rule}`), action = select.value;
      steps++;
      let collision = false;
      if (action === 'right' || action === 'rightForward') heading = (heading + 1) % 4;
      if (action === 'left') heading = (heading + 3) % 4;
      if (action === 'forward' || action === 'rightForward') {
        if (!open(heading)) collision = true;
        else { x += directions[heading][0]; y += directions[heading][1]; visited.add(`${x},${y}`); }
      }
      const won = map[y][x] === 'G';
      finished = collision || won || steps >= 32;
      if (finished) stop();
      draw();
      feedback(`${{right: 1, front: 2, blocked: 3}[rule]}번 조건 → ${select.selectedOptions[0].textContent}. ${won ? `구조 성공! ${steps}회 행동으로 도착했습니다. 센서와 조건문의 역할을 설명해 보세요.` : collision ? '벽 충돌! 선택한 조건의 행동을 수정하고 다시 도전하세요.' : steps >= 32 ? '에너지 소진! 같은 곳을 반복하는 규칙을 찾아 수정하세요.' : '다음 센서 값을 확인하세요.'}`, won);
    }
    q('#cg-step').onclick = step;
    q('#cg-run').onclick = () => { if (!finished && timer === null) { timer = setInterval(step, 500); controls(); feedback('자동 실행 중입니다. 조건과 로봇의 움직임을 관찰하세요.'); } };
    q('#cg-pause').onclick = () => stop(true);
    q('#cg-reset').onclick = reset;
    all('select').forEach(el => el.onchange = reset);
    pause = () => stop(true);
    document.addEventListener('visibilitychange', () => { if (document.hidden) pause(); });
    reset();
  }

  const worksheets = {
    8: ['AND, OR, XOR의 입력 네 쌍과 목표 출력을 적으세요.', '가중치 w1, w2와 편향 b를 정하고 가중합이 0 이상인지 계산하세요.', 'OR, NAND를 은닉층으로 연결한 뒤 XOR의 네 출력을 비교하세요.'],
    9: ['밝기와 질량의 분포를 보며 충전용, 냉각용 학습 사례 네 장을 고르세요.', '새 광물과 가장 가까운 학습 카드의 이름으로 분류하고 정답과 비교하세요.', '오배송을 줄이도록 사례를 바꾼 뒤, 별도 시험 자료가 필요한 이유를 쓰세요.'],
    10: ['작품 사진의 이름과 연락처를 가리고 남길 정보를 정하세요.', '작가가 허락한 파일과 요청한 표시 조건을 확인하세요.', '얼굴 공개 동의를 확인하고 작품에 대한 존중하는 댓글을 작성하세요.'],
    11: ['오른쪽이 열렸을 때, 앞쪽만 열렸을 때, 둘 다 막혔을 때의 행동을 정하세요.', '오른쪽 회전 후 전진, 전진, 왼쪽 회전 규칙을 미로에서 실행하세요.', '센서 입력, 선택한 조건, 모터 행동, 위치를 한 단계씩 기록하세요.']
  };
  let mounted = false;
  window.ceLabs = {
    show(id) {
      const active = id === `ce-game-${chapter}`;
      if (!active) pause();
      legacy.hidden = active;
      game.hidden = !active;
      panel.classList.toggle('ce-games-mode', active);
      stage.classList.toggle('ce-game-stage', active);
      if (!active || mounted) return;
      mounted = true;
      if (window.LecturePrint?.mode) {
        shell(`<section class="cg-worksheet"><h3>실습 활동지</h3><ol>${worksheets[chapter].map(text => `<li>${text}</li>`).join('')}</ol><p>예측:</p><div class="cg-write-space"></div><p>실행 결과와 수정한 점:</p><div class="cg-write-space"></div><p>온라인 교안의 마지막 슬라이드에서 직접 실행할 수 있습니다.</p></section>`);
        q('.cg-reflection').open = true;
      } else ({8: gateGame, 9: mineralGame, 10: editorGame, 11: robotGame}[chapter])();
    }
  };
})();
