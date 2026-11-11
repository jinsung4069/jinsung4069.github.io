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
  // Lecture 10 is all text, so it grows with the screen instead of staying at a fixed size.
  if (chapter === 10) game.classList.add('cg-fluid');
  panel.append(legacy, game);
  const q = selector => game.querySelector(selector);
  const all = selector => [...game.querySelectorAll(selector)];
  const button = (id, label, extra = '') => `<button type="button" id="${id}" ${extra}>${label}</button>`;
  const titles = {
    8: 'CNN, RNN, 확산 모델 체험실', 9: '우주 광물 분류소',
    10: '교무실 저작권 상담소', 11: '센서 로봇 구조 미션'
  };
  const goals = {
    8: '같은 이미지를 세 모델에 넣고 이미지가 어떻게 바뀌는지 비교하세요. 샘플을 고르거나, 직접 그리거나, 내 이미지를 올릴 수 있습니다.',
    9: '학습 카드 네 장으로 1-최근접 이웃 분류기를 만들고 새 광물 8개 중 7개 이상을 분류하세요.',
    10: '동료 선생님 여섯 분이 고민을 들고 왔습니다. 사연을 읽고 알맞은 답을 골라 주세요. 다섯 개 넘게 맞히면 성공입니다.',
    11: '센서 조건에 맞는 행동을 연결해 로봇을 출발점에서 구조 지점까지 보내세요.'
  };
  const reflections = {
    8: 'CNN의 필터를 바꿨을 때 어떤 무늬가 밝게 남았나요? RNN의 기억 유지율을 낮추면 마지막 기억에서 윗부분 정보는 어떻게 되나요? 확산 모델은 왜 학습 이미지와 비슷한 그림을 만들었을까요? 이 실습은 학습을 실행하지 않고 원리만 보여 주는 작은 모형입니다.',
    9: '같은 수의 학습 카드라도 어떤 위치의 사례를 골랐을 때 성능이 좋아졌나요? 여기서는 두 특성을 같은 척도로 비교합니다. 반복해서 본 검증 자료와 별도로, 최종 성능을 평가할 새로운 시험 자료가 필요합니다.',
    10: '틀린 사연은 어디에서 헷갈렸나요? 수업에 쓰는 것과 수업 밖에서 나눠 주는 것은 무엇이 다른지, 출처만 밝히면 되는 때와 허락을 받아야 하는 때는 언제인지 짝과 말해 보세요.',
    11: '입력인 센서 값, 처리인 조건문, 출력인 모터 행동을 연결해 설명해 보세요. 실제 로봇에서는 센서 오차와 회전 시간도 보정해야 합니다. 이 활동은 하드웨어에 연결되지 않는 격자 모형입니다.'
  };
  function shell(body) {
    game.innerHTML = `<div class="cg-heading"><span class="cg-eyebrow">${chapter}강 ${chapter === 8 ? '체험 실습, 2인 1조, 10~15분' : '게임 실습, 2인 1조, 8~12분'}</span><h2>${titles[chapter]}</h2><p>${goals[chapter]}</p></div>${body}<details class="cg-reflection"><summary>활동 후 함께 생각하기</summary><p>${reflections[chapter]}</p><p>${chapter === 10 ? '한 사람은 답을 고르고, 다른 사람은 까닭을 먼저 말합니다. 사연마다 역할을 바꾸세요.' : '한 사람은 조작, 한 사람은 결과 예측을 맡고 역할을 바꿔 한 번 더 도전하세요.'}</p></details>`;
  }
  function feedback(message, success = false) {
    q('#cg-feedback').textContent = message;
    q('#cg-feedback').classList.toggle('cg-success', success);
  }
  const status = '<p id="cg-feedback" class="cg-feedback" role="status" aria-live="polite"></p>';
  let pause = () => {};

  // Chapter 8 runs the CNN, RNN and diffusion lab from computer-education2-model-lab.js.
  function modelLab() {
    shell(`<div id="ml-root"></div>${status}`);
    pause = window.ceModelLab.mount(q('#ml-root'), feedback);
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

  function counselGame() {
    const cases = [
      { title: '문제집 한 단원', who: '3학년 김 선생님', story: '시중 수학 문제집 한 단원을 통째로 스캔해서 학급 온라인 방에 올리고 숙제로 내려고 해요.', options: ['수업에 쓰는 거니까 그대로 올려도 됩니다.', '출처만 적으면 올려도 됩니다.', '올리지 마세요. 꼭 필요한 몇 문제만 수업 시간에 다루거나 문제를 직접 만드세요.'], answer: 2, why: '수업에 쓰더라도 공표된 저작물의 일부분만 쓸 수 있습니다(저작권법 제25조 제3항). 문제집은 학생이 사서 쓰라고 만든 책이라, 한 단원을 통째로 나눠 주면 책을 살 까닭이 없어집니다. 출처를 적어도 마찬가지입니다.' },
      { title: '유튜브 실험 영상', who: '5학년 박 선생님', story: '과학 시간에 유튜브에 공개된 화산 실험 영상을 교실 텔레비전으로 3분쯤 보여 주려고 해요.', options: ['보여 주셔도 됩니다.', '영상을 올린 사람에게 먼저 허락을 받아야 합니다.', '교실에서는 남이 만든 영상을 틀 수 없습니다.'], answer: 0, why: '수업에 필요한 만큼 공표된 저작물을 보여 주는 일은 허락 없이 할 수 있습니다(저작권법 제25조 제3항). 다만 영상을 내려받아 학급 누리집에 다시 올리는 일은 따로 따져 봐야 합니다.' },
      { title: '졸업 영상 배경음악', who: '6학년 이 선생님', story: '졸업 영상에 요즘 인기 있는 가요를 배경음악으로 넣어 학부모 단체방에 파일로 보내려고 해요.', options: ['졸업 기념이니 괜찮습니다.', '30초만 넣으면 괜찮습니다.', '음악 저작권자에게 허락을 받거나, 자유롭게 쓸 수 있는 음원으로 바꾸세요.'], answer: 2, why: '졸업 영상을 나눠 주는 일은 수업이 아니어서 제25조가 적용되지 않습니다. 음악을 영상에 넣고 단체방에 보내려면 저작권자의 허락이 있어야 합니다. 30초면 괜찮다는 말은 근거가 없습니다. 공유마당 같은 곳의 자유 이용 음원을 쓰면 됩니다.' },
      { title: '체험 학습 사진', who: '2학년 최 선생님', story: '현장 체험 학습 사진을 학교 누리집에 올리려는데, 아이들 얼굴이 또렷이 보여요.', options: ['학교 행사 사진이니 그냥 올리셔도 됩니다.', '보호자가 동의한 아이만 올리고, 나머지는 얼굴이 안 보이는 사진으로 고르세요.', '아이에게 물어보고 좋다고 하면 올리세요.'], answer: 1, why: '얼굴 사진은 누구인지 알아볼 수 있는 개인정보입니다. 만 14세 미만 아동의 개인정보를 동의받아 처리할 때는 법정대리인의 동의가 있어야 합니다(개인정보 보호법 제22조의2).' },
      { title: '무료 글꼴', who: '행정실 정 주무관', story: '인터넷에서 받은 ‘개인 사용 무료’ 글꼴로 학교 현수막과 가정통신문을 만들려고 해요.', options: ['무료 글꼴이니 어디에 써도 됩니다.', '사용 범위를 확인하고, 학교에서 쓸 수 없으면 다른 글꼴로 바꾸세요.', '글꼴은 저작권과 상관없습니다.'], answer: 1, why: '글꼴 파일은 컴퓨터프로그램저작물로 보호받습니다. ‘개인 사용 무료’는 학교나 기관에서 쓰는 것까지 허락한 것이 아닐 수 있으니, 내려받은 곳에서 사용 범위를 먼저 확인해야 합니다.' },
      { title: 'AI가 그린 주인공', who: '4학년 한 선생님', story: '학생이 생성형 AI로 만든 그림을 학급 신문에 실으려는데, 유명한 만화 주인공과 거의 똑같아요.', options: ['AI가 만들었으니 저작권 문제가 없습니다.', '학생 이름만 적으면 됩니다.', '싣지 마세요. 기존 캐릭터와 닮지 않게 다시 만들고, AI로 만들었다고 밝히세요.'], answer: 2, why: 'AI가 만든 그림이라도 기존 저작물과 비슷하면 저작권 침해가 될 수 있습니다. 누가 만들었는지 적는다고 달라지지 않습니다.' }
    ];
    let now = 0, results = [], checked = false;
    shell(`<div class="cg-score" id="cg-score"></div><div class="cg-columns"><section class="cg-card"><h3 id="cg-mission"></h3><p id="cg-brief"></p><fieldset id="cg-edit"><legend>어떻게 답할까요?</legend><div id="cg-fields" class="cg-fields"></div></fieldset><div class="cg-actions">${button('cg-run', '답 확인')}${button('cg-next', '다음 사연', 'disabled')}${button('cg-reset', '처음부터')}</div></section><section class="cg-card"><h3>상담 기록</h3><ol id="cg-log" class="cg-post"></ol></section></div>${status}`);
    function draw() {
      q('#cg-score').textContent = `사연 ${now + 1} / ${cases.length}, 맞힌 사연 ${results.filter(Boolean).length}개`;
      q('#cg-log').innerHTML = cases.map((c, i) => `<li>${c.title}: ${i < results.length ? results[i] ? '○ 맞힘' : '× 틀림' : i === now ? '상담 중' : '기다리는 중'}</li>`).join('');
    }
    function start() {
      const c = cases[now];
      checked = false;
      q('#cg-mission').textContent = `${now + 1}. ${c.title}`;
      q('#cg-brief').textContent = `${c.who}: “${c.story}”`;
      q('#cg-fields').innerHTML = c.options.map((text, i) => `<label class="cg-check"><input type="radio" name="cg-answer" value="${i}"> ${text}</label>`).join('');
      q('#cg-edit').disabled = false;
      q('#cg-run').disabled = false;
      q('#cg-next').disabled = true;
      q('#cg-next').textContent = now === cases.length - 1 ? '상담 끝' : '다음 사연';
      draw();
      feedback('답을 고르기 전에 그렇게 생각한 까닭을 짝에게 먼저 말해 보세요.');
    }
    q('#cg-run').onclick = () => {
      if (checked) return;
      const picked = q('input[name="cg-answer"]:checked');
      if (!picked) { feedback('답을 하나 골라 주세요.'); return; }
      const c = cases[now], right = Number(picked.value) === c.answer;
      checked = true;
      results.push(right);
      q('#cg-edit').disabled = true;
      q('#cg-run').disabled = true;
      const last = now === cases.length - 1, score = results.filter(Boolean).length;
      q('#cg-next').disabled = last;
      draw();
      feedback(`${right ? '맞았습니다.' : `아쉽습니다. 알맞은 답은 “${c.options[c.answer]}”`} ${c.why}${last ? ` 상담을 마쳤습니다. 여섯 사연 가운데 ${score}개를 맞혔습니다. ${score >= 5 ? '상담소를 맡겨도 되겠습니다.' : '틀린 사연의 까닭을 다시 읽고 처음부터 한 번 더 해 보세요.'}` : ''}`, right);
    };
    q('#cg-next').onclick = () => { if (checked && now < cases.length - 1) { now++; start(); } };
    q('#cg-reset').onclick = () => { now = 0; results = []; start(); };
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
    8: ['세로 경계 필터와 가로 경계 필터를 적용하고, 특징 지도에서 밝게 남은 곳을 표시하세요.', 'RNN 기억 유지율을 0.3과 0.9로 바꿔 32줄을 읽은 뒤, 마지막 기억에 남은 정보를 비교하세요.', '확산 모델에서 잡음 단계 t가 커질 때 그림의 변화를 적고, 생성 결과가 어느 학습 이미지에 가까웠는지 기록하세요.'],
    9: ['밝기와 질량의 분포를 보며 충전용, 냉각용 학습 사례 네 장을 고르세요.', '새 광물과 가장 가까운 학습 카드의 이름으로 분류하고 정답과 비교하세요.', '오배송을 줄이도록 사례를 바꾼 뒤, 별도 시험 자료가 필요한 이유를 쓰세요.'],
    10: ['사연을 읽고 답을 고르기 전에, 그렇게 생각한 까닭을 한 줄로 적으세요.', '수업에 쓰는 일(저작권법 제25조)에 해당하는 사연과 그렇지 않은 사연을 나누세요.', '학교에서 겪을 만한 사연을 하나 지어 짝에게 물어보세요.'],
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
        shell(`<section class="cg-worksheet"><h3>실습 활동지</h3><ol>${worksheets[chapter].map(text => `<li>${text}</li>`).join('')}</ol><p>${chapter === 10 ? '내 생각:' : '예측:'}</p><div class="cg-write-space"></div><p>${chapter === 10 ? '확인한 답과 까닭:' : '실행 결과와 수정한 점:'}</p><div class="cg-write-space"></div><p>온라인 교안의 마지막 슬라이드에서 직접 실행할 수 있습니다.</p></section>`);
        q('.cg-reflection').open = true;
      } else ({8: modelLab, 9: mineralGame, 10: counselGame, 11: robotGame}[chapter])();
    }
  };
})();
