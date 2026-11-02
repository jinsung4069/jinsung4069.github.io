/* Chapter 8 lab: one small grayscale image goes through a convolution layer, a recurrent layer and a diffusion process.
   Everything runs in the browser; an uploaded image is never sent anywhere. */
(() => {
  'use strict';
  const N = 32, BANDS = 8, STEPS = 50, INPUT_WEIGHT = 1.5;
  const SAMPLES = [['seven', '숫자 7'], ['house', '집'], ['face', '웃는 얼굴'], ['heart', '하트']];
  const KERNELS = {
    vertical: ['세로 경계', [-1, 0, 1, -2, 0, 2, -1, 0, 1], '왼쪽보다 오른쪽이 밝은 세로 경계에서 큰 양수가, 반대 방향 경계에서 큰 음수가 나옵니다.'],
    horizontal: ['가로 경계', [-1, -2, -1, 0, 0, 0, 1, 2, 1], '위보다 아래가 밝은 가로 경계에서 큰 양수가 나옵니다. 세로 경계 필터와 결과를 비교해 보세요.'],
    blur: ['흐리게', [1, 1, 1, 1, 1, 1, 1, 1, 1], '주변 9칸을 모두 더하므로 가는 선과 잡음이 퍼지고 큰 덩어리가 남습니다.'],
    sharpen: ['선명하게', [0, -1, 0, -1, 5, -1, 0, -1, 0], '가운데 칸을 키우고 이웃을 빼서 경계가 또렷해집니다.'],
    outline: ['윤곽', [-1, -1, -1, -1, 8, -1, -1, -1, -1], '주변과 밝기가 같은 곳은 0이 되고, 모양의 테두리만 남습니다.']
  };
  const fmt = (v, d = 2) => (Math.abs(v) < 0.005 && d > 0 ? 0 : v).toFixed(d);
  const clamp = v => v < 0 ? 0 : v > 1 ? 1 : v;

  // Small seeded random numbers so a "new noise" button gives a different but repeatable run.
  function rng(seed) {
    let a = seed >>> 0;
    const uniform = () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; };
    return () => { let u = 0; while (!u) u = uniform(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * uniform()); };
  }
  const noise = seed => { const g = rng(seed), out = new Float32Array(N * N); for (let i = 0; i < out.length; i++) out[i] = g(); return out; };

  // Cosine noise schedule: alphaBar[t] is how much of the original picture is left after t noise steps.
  const alphaBar = [1], beta = [0];
  for (let t = 1; t <= STEPS; t++) {
    const f = s => Math.cos((s / STEPS + 0.008) / 1.008 * Math.PI / 2) ** 2;
    beta[t] = Math.min(0.999, 1 - f(t) / f(t - 1));
    alphaBar[t] = alphaBar[t - 1] * (1 - beta[t]);
  }

  function toGray(source, sw, sh) {
    const c = document.createElement('canvas'); c.width = c.height = N;
    const x = c.getContext('2d', {willReadFrequently: true});
    x.fillStyle = '#000'; x.fillRect(0, 0, N, N); x.imageSmoothingEnabled = true; x.imageSmoothingQuality = 'high';
    const side = Math.min(sw, sh);
    x.drawImage(source, (sw - side) / 2, (sh - side) / 2, side, side, 0, 0, N, N);
    const d = x.getImageData(0, 0, N, N).data, out = new Float32Array(N * N);
    for (let i = 0; i < out.length; i++) out[i] = (0.2126 * d[i * 4] + 0.7152 * d[i * 4 + 1] + 0.0722 * d[i * 4 + 2]) / 255;
    return out;
  }
  function sample(id) {
    const c = document.createElement('canvas'); c.width = c.height = 128;
    const x = c.getContext('2d');
    x.fillStyle = '#000'; x.fillRect(0, 0, 128, 128); x.fillStyle = x.strokeStyle = '#fff'; x.lineCap = x.lineJoin = 'round';
    if (id === 'seven') { x.lineWidth = 15; x.beginPath(); x.moveTo(30, 28); x.lineTo(98, 28); x.lineTo(54, 108); x.stroke(); }
    if (id === 'house') { x.beginPath(); x.moveTo(20, 64); x.lineTo(64, 20); x.lineTo(108, 64); x.closePath(); x.fill(); x.fillRect(32, 62, 64, 48); x.fillStyle = '#000'; x.fillRect(56, 82, 18, 28); x.fillRect(40, 72, 12, 12); }
    if (id === 'face') { x.lineWidth = 9; x.beginPath(); x.arc(64, 64, 46, 0, Math.PI * 2); x.stroke(); x.beginPath(); x.arc(47, 52, 8, 0, Math.PI * 2); x.arc(81, 52, 8, 0, Math.PI * 2); x.fill(); x.beginPath(); x.arc(64, 68, 26, 0.15 * Math.PI, 0.85 * Math.PI); x.stroke(); }
    if (id === 'heart') { x.beginPath(); x.moveTo(64, 110); x.bezierCurveTo(6, 70, 16, 12, 64, 42); x.bezierCurveTo(112, 12, 122, 70, 64, 110); x.fill(); }
    return toGray(c, 128, 128);
  }

  // Draws a w by h grid of values onto a canvas with sharp, enlarged cells.
  const scratch = {};
  function paint(canvas, values, w, h, color) {
    const key = `${w}x${h}`;
    const off = scratch[key] || (scratch[key] = Object.assign(document.createElement('canvas'), {width: w, height: h}));
    const o = off.getContext('2d'), img = o.createImageData(w, h);
    for (let i = 0; i < w * h; i++) { const [r, g, b] = color(values[i]); img.data[i * 4] = r; img.data[i * 4 + 1] = g; img.data[i * 4 + 2] = b; img.data[i * 4 + 3] = 255; }
    o.putImageData(img, 0, 0);
    const ctx = canvas.getContext('2d'); ctx.imageSmoothingEnabled = false; ctx.drawImage(off, 0, 0, canvas.width, canvas.height);
    return ctx;
  }
  const mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
  const gray = v => { const g = Math.round(clamp(v) * 255); return [g, g, g]; };
  const DARK = [17, 24, 39], WARM = [251, 146, 60], COOL = [96, 165, 250], TEAL = [45, 212, 191];
  const diverging = max => v => mix(DARK, v >= 0 ? WARM : COOL, Math.min(1, Math.abs(v) / max));
  const sequential = (max, hue = WARM) => v => mix(DARK, hue, Math.min(1, Math.max(0, v) / max));
  const box = (ctx, cell, x, y, w, h, color = '#f97316', width = 2) => { ctx.lineWidth = width; ctx.strokeStyle = color; ctx.strokeRect(x * cell + width / 2, y * cell + width / 2, w * cell - width, h * cell - width); };

  function mount(root, feedback) {
    const figure = (id, caption, size, cls = '') => `<figure class="ml-figure ${cls}"><canvas id="${id}" width="${size[0]}" height="${size[1]}" role="img"></canvas><figcaption>${caption}</figcaption></figure>`;
    root.innerHTML = `<div class="ml-layout">
<section class="cg-card ml-input" aria-labelledby="ml-input-title"><h3 id="ml-input-title">입력 이미지</h3>
<div class="ml-samples" role="group" aria-label="샘플 이미지">${SAMPLES.map(([id, label]) => `<button type="button" data-sample="${id}" aria-pressed="false">${label}</button>`).join('')}</div>
<canvas id="ml-source" class="ml-draw" width="256" height="256" role="img" aria-label="32×32 입력 이미지, 끌어서 그릴 수 있음"></canvas>
<p class="cg-note">캔버스를 끌면 흰 선이 그려집니다. 밝을수록 값이 1에 가깝습니다.</p>
<div class="ml-tools"><button type="button" id="ml-clear">지우기</button><button type="button" id="ml-invert">밝기 반전</button><label class="ml-upload">내 이미지 올리기<input type="file" id="ml-file" accept="image/*"></label></div>
<p class="cg-note">올린 이미지는 이 브라우저 안에서 32×32 흑백으로 줄여 처리하며, 어디에도 전송하지 않습니다.</p></section>
<section class="cg-card ml-models"><div class="ml-tabs" role="tablist" aria-label="모델 선택">
<button type="button" role="tab" id="ml-tab-cnn" aria-controls="ml-cnn" aria-selected="true">CNN 합성곱</button><button type="button" role="tab" id="ml-tab-rnn" aria-controls="ml-rnn" aria-selected="false" tabindex="-1">RNN 순환 기억</button><button type="button" role="tab" id="ml-tab-diffusion" aria-controls="ml-diffusion" aria-selected="false" tabindex="-1">확산 모델</button></div>

<div id="ml-cnn" role="tabpanel" aria-labelledby="ml-tab-cnn">
<p>합성곱 신경망(CNN)은 작은 필터를 이미지 위에서 한 칸씩 옮기며, 겹친 9칸을 곱해서 더합니다. 필터와 닮은 무늬가 있는 곳에서 큰 값이 나옵니다. 이 값을 ReLU로 거르고 최대 풀링으로 줄이면 다음 층이 볼 특징 지도가 됩니다.</p>
<div class="ml-presets" role="group" aria-label="필터 예시">${Object.entries(KERNELS).map(([id, [label]]) => `<button type="button" data-kernel="${id}" aria-pressed="false">${label}</button>`).join('')}</div>
<div class="ml-calc"><div><span class="ml-label">입력 조각</span><div class="ml-grid3" id="ml-patch"></div></div><span class="ml-op" aria-hidden="true">×</span><div><span class="ml-label">필터(직접 고칠 수 있음)</span><div class="ml-grid3">${Array.from({length: 9}, (_, i) => `<input type="number" step="1" min="-9" max="9" value="0" data-k="${i}" aria-label="필터 ${Math.floor(i / 3) + 1}행 ${i % 3 + 1}열">`).join('')}</div></div><span class="ml-op" aria-hidden="true">=</span><div><span class="ml-label">곱의 합</span><output id="ml-sum" class="ml-sum">0</output></div></div>
<label>필터 위치 <output id="ml-pos-text"></output><input type="range" id="ml-pos" min="0" max="899" value="300"></label>
<div class="cg-actions"><button type="button" id="ml-scan" class="ml-primary">자동으로 훑기</button></div>
<div class="ml-maps">${figure('ml-cnn-in', '입력 32×32', [256, 256])}${figure('ml-conv', '합성곱 30×30', [240, 240])}${figure('ml-relu', 'ReLU 30×30', [240, 240])}${figure('ml-pool', '최대 풀링 15×15', [120, 120], 'ml-small')}</div>
<p class="cg-note">주황은 양수, 파랑은 음수, 검정은 0에 가까운 값입니다. ReLU는 음수를 0으로 바꾸고, 최대 풀링은 2×2칸에서 가장 큰 값 하나만 남깁니다. 실제 CNN은 필터 값을 학습으로 정하고, 한 층에서 필터를 수십 개 씁니다.</p>
</div>

<div id="ml-rnn" role="tabpanel" aria-labelledby="ml-tab-rnn" hidden>
<p>순환 신경망(RNN)은 자료를 순서대로 하나씩 읽고, 읽을 때마다 기억(은닉 상태)을 새로 계산합니다. 여기서는 이미지를 위에서 아래로 한 줄씩 32번 읽습니다. 한 줄을 4칸씩 묶어 8개 값으로 넣고, 새 기억 = tanh(1.5 × 이번 입력 + 유지율 × 이전 기억)으로 계산합니다.</p>
<div class="ml-row-controls"><label>읽은 줄 수 <output id="ml-step-text"></output><input type="range" id="ml-step" min="0" max="32" value="0"></label><label>기억 유지율 <output id="ml-keep-text"></output><input type="range" id="ml-keep" min="0" max="1" step="0.05" value="0.8"></label></div>
<div class="cg-actions"><button type="button" id="ml-read" class="ml-primary">자동으로 읽기</button><button type="button" id="ml-next-row">한 줄 읽기</button><button type="button" id="ml-rnn-reset">처음부터</button></div>
<div class="ml-rnn-view">${figure('ml-rnn-in', '읽는 중인 줄', [256, 256])}${figure('ml-history', '줄마다 남긴 기억', [128, 256])}<div class="ml-rnn-side">${figure('ml-x', '이번 줄 입력 x (8칸)', [256, 32], 'ml-strip')}${figure('ml-h', '현재 기억 h (8칸)', [256, 120], 'ml-strip')}<p id="ml-rnn-calc" class="cg-formula"></p></div></div>
<p class="cg-note">실제 RNN은 기억 칸끼리도 연결되어 있고 가중치를 학습으로 정합니다. 여기서는 원리를 보이려고 칸마다 따로 계산합니다.</p>
</div>

<div id="ml-diffusion" role="tabpanel" aria-labelledby="ml-tab-diffusion" hidden>
<p>확산 모델은 학습할 때 그림에 잡음을 조금씩 더해 완전히 망가뜨리고, 잡음을 걷어내는 법을 배웁니다. 그림을 만들 때는 순수한 잡음에서 시작해 ${STEPS}번에 걸쳐 잡음을 조금씩 걷어냅니다.</p>
<h4>1단계, 학습: 잡음 더하기</h4>
<label>잡음 단계 t <output id="ml-t-text"></output><input type="range" id="ml-t" min="0" max="${STEPS}" value="15"></label>
<div class="ml-forward">${figure('ml-noisy', '잡음을 더한 그림', [256, 256])}<div>${figure('ml-strip-forward', 't = 0, 10, 20, 30, 40, 50', [384, 64], 'ml-strip')}<p id="ml-forward-calc" class="cg-formula"></p></div></div>
<h4>2단계, 생성: 잡음 걷어내기</h4>
<div class="cg-actions"><button type="button" id="ml-generate" class="ml-primary">잡음에서 생성</button><button type="button" id="ml-denoise-step">한 단계</button><button type="button" id="ml-new-noise">새 잡음으로 다시</button></div>
<div class="ml-reverse">${figure('ml-xt', '지금 그림', [256, 256])}${figure('ml-x0', '예측한 원래 그림', [256, 256])}<div class="ml-weights"><span class="ml-label">학습 이미지와 닮은 정도</span><ol id="ml-weights"></ol></div></div>
<p class="cg-note">실제 확산 모델은 수많은 이미지로 학습한 신경망이 잡음을 예측합니다. 이 실습의 잡음 예측기는 샘플 4장과 지금 입력만 학습 이미지로 아는 이상적인 계산식이라, 학습 이미지와 거의 같은 그림을 다시 만듭니다. 학습 자료를 그대로 외워 내는 현상도 함께 관찰하세요.</p>
</div>
</section></div>`;

    const $ = s => root.querySelector(s), $$ = s => [...root.querySelectorAll(s)];
    let image = sample('seven'), kernel = KERNELS.vertical[1].slice(), kernelName = 'vertical', active = 'cnn', timer = null, timerKind = '';
    let conv, relu, pool, maxConv, maxPool, hidden, step = 0, seed = 7, eps = noise(seed), gen = null;
    const tabs = ['cnn', 'rnn', 'diffusion'];

    function stop() {
      if (timer) clearInterval(timer);
      timer = null; timerKind = '';
      $('#ml-scan').textContent = '자동으로 훑기'; $('#ml-read').textContent = '자동으로 읽기'; $('#ml-generate').textContent = gen && gen.t < STEPS && gen.t > 0 ? '이어서 생성' : '잡음에서 생성';
    }
    function run(kind, fn, ms) {
      const again = timerKind === kind; stop(); if (again) return;
      timerKind = kind; timer = setInterval(() => { if (!fn()) stop(); }, ms);
      $(`#${{scan: 'ml-scan', read: 'ml-read', generate: 'ml-generate'}[kind]}`).textContent = '멈춤';
    }

    // ---------- CNN ----------
    function computeCnn() {
      const W = N - 2; conv = new Float32Array(W * W); maxConv = 1e-6;
      for (let y = 0; y < W; y++) for (let x = 0; x < W; x++) {
        let s = 0; for (let j = 0; j < 3; j++) for (let i = 0; i < 3; i++) s += kernel[j * 3 + i] * image[(y + j) * N + x + i];
        conv[y * W + x] = s; maxConv = Math.max(maxConv, Math.abs(s));
      }
      relu = conv.map(v => Math.max(0, v));
      pool = new Float32Array(15 * 15); maxPool = 1e-6;
      for (let y = 0; y < 15; y++) for (let x = 0; x < 15; x++) {
        const v = Math.max(relu[2 * y * W + 2 * x], relu[2 * y * W + 2 * x + 1], relu[(2 * y + 1) * W + 2 * x], relu[(2 * y + 1) * W + 2 * x + 1]);
        pool[y * 15 + x] = v; maxPool = Math.max(maxPool, v);
      }
    }
    function drawCnn() {
      const pos = Number($('#ml-pos').value), r = Math.floor(pos / 30), c = pos % 30;
      box(paint($('#ml-cnn-in'), image, N, N, gray), 8, c, r, 3, 3, '#f97316', 3);
      box(paint($('#ml-conv'), conv, 30, 30, diverging(maxConv)), 8, c, r, 1, 1, '#fff', 2);
      box(paint($('#ml-relu'), relu, 30, 30, sequential(maxConv)), 8, c, r, 1, 1, '#fff', 2);
      box(paint($('#ml-pool'), pool, 15, 15, sequential(maxPool)), 8, Math.floor(c / 2), Math.floor(r / 2), 1, 1, '#fff', 2);
      const patch = [0, 1, 2].flatMap(j => [0, 1, 2].map(i => image[(r + j) * N + c + i]));
      $('#ml-patch').innerHTML = patch.map(v => `<span style="background:rgb(${gray(v).join()});color:${v > 0.55 ? '#111' : '#fff'}">${fmt(v, 1)}</span>`).join('');
      const s = conv[r * 30 + c];
      $('#ml-sum').textContent = fmt(s);
      $('#ml-pos-text').textContent = `${r + 1}행 ${c + 1}열`;
      $('#ml-cnn-in').setAttribute('aria-label', `입력 이미지, 필터가 ${r + 1}행 ${c + 1}열부터 3×3칸을 덮고 있음`);
      $('#ml-conv').setAttribute('aria-label', `합성곱 결과 30×30, 가장 큰 크기 ${fmt(maxConv)}`);
      $('#ml-relu').setAttribute('aria-label', 'ReLU를 적용한 30×30 특징 지도');
      $('#ml-pool').setAttribute('aria-label', '최대 풀링을 적용한 15×15 특징 지도');
      return {r, c, s, patch};
    }
    function cnnMessage() {
      const {r, c, s, patch} = drawCnn();
      const terms = patch.map((v, i) => `${fmt(v, 1)}×(${kernel[i]})`).join(' + ');
      const tip = KERNELS[kernelName] ? KERNELS[kernelName][2] : '직접 만든 필터입니다. 어떤 무늬에서 값이 커지는지 예측한 뒤 확인하세요.';
      feedback(`${r + 1}행 ${c + 1}열: ${terms} = ${fmt(s)}. ReLU 후 ${fmt(Math.max(0, s))}. ${tip}`);
    }
    function setKernel(id) {
      if (id) { kernelName = id; kernel = KERNELS[id][1].slice(); $$('[data-k]').forEach((el, i) => el.value = kernel[i]); }
      $$('[data-kernel]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.kernel === kernelName)));
      computeCnn(); cnnMessage();
    }
    $$('[data-kernel]').forEach(b => b.onclick = () => setKernel(b.dataset.kernel));
    // The calculation uses whole numbers from -9 to 9. The cell shows that value once the edit is
    // finished, so "-" can still be typed on the way to a negative number.
    $$('[data-k]').forEach(el => {
      const value = () => Math.max(-9, Math.min(9, Math.round(Number(el.value) || 0)));
      el.addEventListener('input', () => {
        kernel[Number(el.dataset.k)] = value();
        kernelName = Object.keys(KERNELS).find(id => KERNELS[id][1].every((k, i) => k === kernel[i])) || 'custom';
        setKernel();
      });
      el.addEventListener('change', () => { el.value = value(); });
    });
    $('#ml-pos').addEventListener('input', () => { stop(); cnnMessage(); });
    $('#ml-scan').onclick = () => run('scan', () => { const el = $('#ml-pos'); el.value = (Number(el.value) + 1) % 900; cnnMessage(); return true; }, 45);

    // ---------- RNN ----------
    const rowInput = t => Array.from({length: BANDS}, (_, b) => { let s = 0; for (let i = 0; i < 4; i++) s += image[t * N + b * 4 + i]; return s / 4; });
    function computeRnn() {
      const keep = Number($('#ml-keep').value); hidden = [];
      let h = new Array(BANDS).fill(0);
      for (let t = 0; t < N; t++) { const x = rowInput(t); h = h.map((v, i) => Math.tanh(INPUT_WEIGHT * x[i] + keep * v)); hidden.push(h); }
    }
    function drawRnn() {
      const keep = Number($('#ml-keep').value), t = step - 1;
      $('#ml-step-text').textContent = `${step} / ${N}`;
      $('#ml-keep-text').textContent = keep.toFixed(2);
      const ctx = paint($('#ml-rnn-in'), image, N, N, gray);
      ctx.fillStyle = 'rgba(17,24,39,.55)'; if (step < N) ctx.fillRect(0, step * 8, 256, 256 - step * 8);
      ctx.strokeStyle = 'rgba(148,163,184,.45)'; ctx.lineWidth = 1;
      for (let b = 1; b < BANDS; b++) { ctx.beginPath(); ctx.moveTo(b * 32 + 0.5, 0); ctx.lineTo(b * 32 + 0.5, 256); ctx.stroke(); }
      if (t >= 0) box(ctx, 8, 0, t, N, 1, '#f97316', 2);
      const history = new Float32Array(BANDS * N).fill(-1);
      for (let r = 0; r < step; r++) for (let b = 0; b < BANDS; b++) history[r * BANDS + b] = hidden[r][b];
      const hctx = paint($('#ml-history'), history, BANDS, N, v => v < 0 ? [226, 232, 240] : mix(DARK, TEAL, v));
      if (t >= 0) { hctx.lineWidth = 2; hctx.strokeStyle = '#f97316'; hctx.strokeRect(1, t * 8 + 1, 126, 6); }
      const x = t >= 0 ? rowInput(t) : new Array(BANDS).fill(0), h = t >= 0 ? hidden[t] : new Array(BANDS).fill(0);
      paint($('#ml-x'), x, BANDS, 1, gray);
      const bars = $('#ml-h').getContext('2d'); bars.fillStyle = '#111827'; bars.fillRect(0, 0, 256, 120);
      h.forEach((v, b) => { bars.fillStyle = `rgb(${mix(DARK, TEAL, Math.max(0.25, v)).join()})`; bars.fillRect(b * 32 + 4, 116 - v * 108, 24, v * 108); bars.fillStyle = '#e2e8f0'; bars.font = '12px sans-serif'; bars.textAlign = 'center'; bars.fillText(v.toFixed(2), b * 32 + 16, Math.max(12, 112 - v * 108)); });
      $('#ml-rnn-in').setAttribute('aria-label', step ? `입력 이미지, ${step}번째 줄을 읽는 중` : '입력 이미지, 아직 읽지 않음');
      $('#ml-history').setAttribute('aria-label', `줄마다 계산한 기억 기록, ${step}줄까지`);
      $('#ml-x').setAttribute('aria-label', `이번 줄 입력 ${x.map(v => v.toFixed(2)).join(', ')}`);
      $('#ml-h').setAttribute('aria-label', `현재 기억 ${h.map(v => v.toFixed(2)).join(', ')}`);
      if (t < 0) { $('#ml-rnn-calc').textContent = '아직 읽은 줄이 없어서 기억이 모두 0입니다.'; return; }
      const k = x.some(v => v > 0.02) ? x.indexOf(Math.max(...x)) : h.indexOf(Math.max(...h)), before = t ? hidden[t - 1][k] : 0;
      $('#ml-rnn-calc').textContent = `기억 칸 ${k + 1}: h = tanh(1.5 × ${x[k].toFixed(2)} + ${keep.toFixed(2)} × ${before.toFixed(2)}) = ${h[k].toFixed(2)}`;
    }
    function rnnMessage() {
      drawRnn();
      const keep = Number($('#ml-keep').value);
      if (!step) return feedback('한 줄 읽기를 눌러 첫 줄을 넣어 보세요. 아래 줄은 아직 가려져 있습니다.');
      if (step < N) return feedback(`${step}번째 줄을 읽었습니다. 입력이 없는 줄에서는 이전 기억에 유지율을 곱하고 tanh를 거치므로 기억이 줄어듭니다.`);
      // Measure the fade with the same recurrence: a full input row, then 20 blank rows.
      const start = Math.tanh(INPUT_WEIGHT); let h = start;
      for (let i = 0; i < 20; i++) h = Math.tanh(keep * h);
      feedback(`32줄을 모두 읽었습니다. 기억 유지율 ${keep.toFixed(2)}에서 꽉 찬 줄을 읽은 기억 ${start.toFixed(2)}은 입력이 없는 줄 20개를 지나면 ${h.toFixed(3)}까지 줄어듭니다. 유지율을 바꿔 마지막 기억에 윗부분 정보가 얼마나 남는지 비교하세요.`);
    }
    const advance = () => { if (step >= N) return false; step++; rnnMessage(); return step < N; };
    $('#ml-step').addEventListener('input', () => { stop(); step = Number($('#ml-step').value); rnnMessage(); });
    $('#ml-keep').addEventListener('input', () => { computeRnn(); rnnMessage(); });
    $('#ml-next-row').onclick = () => { stop(); advance(); $('#ml-step').value = step; };
    $('#ml-rnn-reset').onclick = () => { stop(); step = 0; $('#ml-step').value = 0; rnnMessage(); };
    $('#ml-read').onclick = () => { if (step >= N && timerKind !== 'read') { step = 0; } run('read', () => { const more = advance(); $('#ml-step').value = step; return more; }, 260); };

    // ---------- Diffusion ----------
    const known = () => {
      const list = SAMPLES.map(([id, label]) => ({label, data: sample(id)}));
      const same = list.find(item => item.data.every((v, i) => Math.abs(v - image[i]) < 1e-3));
      if (!same) list.push({label: '지금 입력', data: image}); else same.label += '(지금 입력)';
      return list.map(item => ({...item, signed: item.data.map(v => v * 2 - 1)}));
    };
    let training = [];
    const toPixel = v => (v + 1) / 2;
    function noisy(x0, t, e) { const a = Math.sqrt(alphaBar[t]), b = Math.sqrt(1 - alphaBar[t]); return x0.map((v, i) => a * v + b * e[i]); }
    function drawForward() {
      const t = Number($('#ml-t').value), x0 = image.map(v => v * 2 - 1);
      $('#ml-t-text').textContent = `${t} / ${STEPS}`;
      paint($('#ml-noisy'), noisy(x0, t, eps).map(toPixel), N, N, gray);
      const strip = $('#ml-strip-forward').getContext('2d');
      [0, 10, 20, 30, 40, 50].forEach((s, i) => { const tmp = Object.assign(document.createElement('canvas'), {width: 64, height: 64}); paint(tmp, noisy(x0, s, eps).map(toPixel), N, N, gray); strip.drawImage(tmp, i * 64, 0); });
      const a = Math.sqrt(alphaBar[t]), b = Math.sqrt(1 - alphaBar[t]);
      $('#ml-forward-calc').textContent = `잡음 낀 그림 = ${a.toFixed(2)} × 원래 그림 + ${b.toFixed(2)} × 잡음. 원래 그림의 몫은 ${Math.round(a * a * 100)}%입니다.`;
      $('#ml-noisy').setAttribute('aria-label', `잡음 단계 ${t}의 그림, 원래 그림 몫 ${Math.round(a * a * 100)}%`);
      $('#ml-strip-forward').setAttribute('aria-label', '잡음 단계 0, 10, 20, 30, 40, 50의 그림을 차례로 나열');
    }
    // The ideal noise predictor for a handful of known images: their average, weighted by how likely each one is to have become x_t.
    function predict(x, t) {
      const a = Math.sqrt(alphaBar[t]), varT = 1 - alphaBar[t];
      const logs = training.map(item => { let d = 0; for (let i = 0; i < x.length; i++) { const r = x[i] - a * item.signed[i]; d += r * r; } return -d / (2 * varT); });
      const top = Math.max(...logs), w = logs.map(v => Math.exp(v - top)), sum = w.reduce((p, v) => p + v, 0);
      const weights = w.map(v => v / sum), x0 = new Float32Array(x.length);
      training.forEach((item, k) => { for (let i = 0; i < x.length; i++) x0[i] += weights[k] * item.signed[i]; });
      return {x0, weights};
    }
    function resetGen() { stop(); gen = {t: STEPS, x: noise(seed + 1000), g: rng(seed + 2000), x0: null, weights: training.map(() => 1 / training.length)}; drawReverse(); }
    function denoise() {
      if (!gen || gen.t === 0) return false;
      const t = gen.t, p = predict(gen.x, t), ab = alphaBar[t], abPrev = alphaBar[t - 1];
      const c0 = Math.sqrt(abPrev) * beta[t] / (1 - ab), ct = Math.sqrt(1 - beta[t]) * (1 - abPrev) / (1 - ab), sd = Math.sqrt(beta[t] * (1 - abPrev) / (1 - ab));
      gen.x = gen.x.map((v, i) => c0 * p.x0[i] + ct * v + (t > 1 ? sd * gen.g() : 0));
      gen.x0 = p.x0; gen.weights = p.weights; gen.t = t - 1;
      drawReverse();
      return gen.t > 0;
    }
    function drawReverse() {
      paint($('#ml-xt'), gen.x.map(toPixel), N, N, gray);
      const x0c = $('#ml-x0');
      if (gen.x0) paint(x0c, gen.x0.map(toPixel), N, N, gray); else { const c = x0c.getContext('2d'); c.fillStyle = '#e2e8f0'; c.fillRect(0, 0, 256, 256); }
      $('#ml-weights').innerHTML = training.map((item, k) => `<li><canvas width="32" height="32" data-thumb="${k}" aria-hidden="true"></canvas><span>${item.label}</span><span class="ml-bar"><span style="width:${(gen.weights[k] * 100).toFixed(1)}%"></span></span><b>${Math.round(gen.weights[k] * 100)}%</b></li>`).join('');
      $$('[data-thumb]').forEach(c => paint(c, training[Number(c.dataset.thumb)].data, N, N, gray));
      $('#ml-xt').setAttribute('aria-label', `생성 중인 그림, 남은 잡음 단계 ${gen.t}`);
      x0c.setAttribute('aria-label', gen.x0 ? '잡음 예측기가 추측한 원래 그림' : '아직 예측하지 않음');
      const best = gen.weights.indexOf(Math.max(...gen.weights));
      if (gen.t === STEPS) feedback(`순수한 잡음에서 시작합니다. 남은 단계 ${STEPS}. 처음에는 모든 학습 이미지가 비슷하게 그럴듯합니다.`);
      else if (gen.t > 0) feedback(`남은 단계 ${gen.t}. 지금은 ${training[best].label}에 ${Math.round(gen.weights[best] * 100)}% 가깝다고 추측합니다. 잡음이 줄수록 추측이 한쪽으로 모입니다.`);
      else feedback(`생성 완료. 결과와 가장 닮은 학습 이미지는 ${training[best].label}입니다. 학습 이미지가 적으면 모델이 새 그림 대신 외운 그림을 내놓습니다. 새 잡음으로 다시 만들어 결과가 바뀌는지 보세요.`, true);
    }
    $('#ml-t').addEventListener('input', drawForward);
    $('#ml-generate').onclick = () => { if (gen.t === 0 && timerKind !== 'generate') resetGen(); run('generate', denoise, 110); };
    $('#ml-denoise-step').onclick = () => { stop(); if (gen.t === 0) resetGen(); else denoise(); };
    $('#ml-new-noise').onclick = () => { seed++; eps = noise(seed); drawForward(); resetGen(); };

    // ---------- Input image ----------
    function refresh() {
      stop(); computeCnn(); computeRnn(); training = known(); resetGen();
      show(active);
    }
    // A new image starts the filter where it responds most, so the first calculation is not all zeros.
    function useImage(data, pressed) {
      image = data; $$('[data-sample]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.sample === pressed)));
      computeCnn(); let best = 0; conv.forEach((v, i) => { if (Math.abs(v) > Math.abs(conv[best])) best = i; }); $('#ml-pos').value = best;
      refresh();
    }
    $$('[data-sample]').forEach(b => b.onclick = () => useImage(sample(b.dataset.sample), b.dataset.sample));
    $('#ml-clear').onclick = () => useImage(new Float32Array(N * N), null);
    $('#ml-invert').onclick = () => useImage(image.map(v => 1 - v), null);
    $('#ml-file').addEventListener('change', e => {
      const file = e.target.files[0]; if (!file) return;
      const url = URL.createObjectURL(file), img = new Image();
      img.onload = () => { useImage(toGray(img, img.naturalWidth, img.naturalHeight), null); URL.revokeObjectURL(url); feedback('이미지를 32×32 흑백으로 줄였습니다. 배경이 밝으면 밝기 반전을 눌러 보세요.'); };
      img.onerror = () => { URL.revokeObjectURL(url); feedback('이미지를 읽지 못했습니다. PNG나 JPG 파일로 다시 시도하세요.'); };
      img.src = url; e.target.value = '';
    });
    const source = $('#ml-source');
    let drawing = false, pending = false;
    function drawSource() { paint(source, image, N, N, gray); }
    function brush(e) {
      const rect = source.getBoundingClientRect(), x = (e.clientX - rect.left) / rect.width * N, y = (e.clientY - rect.top) / rect.height * N;
      for (let j = Math.floor(y - 2); j <= y + 2; j++) for (let i = Math.floor(x - 2); i <= x + 2; i++) {
        if (i < 0 || j < 0 || i >= N || j >= N) continue;
        const d = Math.hypot(i + 0.5 - x, j + 0.5 - y); image[j * N + i] = Math.max(image[j * N + i], clamp(1.6 - d));
      }
      drawSource();
      if (!pending) { pending = true; requestAnimationFrame(() => { pending = false; computeCnn(); computeRnn(); show(active); }); }
    }
    source.addEventListener('pointerdown', e => { drawing = true; source.setPointerCapture(e.pointerId); $$('[data-sample]').forEach(b => b.setAttribute('aria-pressed', 'false')); stop(); brush(e); });
    source.addEventListener('pointermove', e => { if (drawing) brush(e); });
    const end = () => { if (!drawing) return; drawing = false; image = image.slice(); training = known(); resetGen(); show(active); };
    source.addEventListener('pointerup', end); source.addEventListener('pointercancel', end);

    // ---------- Tabs ----------
    function show(id) {
      if (id !== active) stop();
      active = id; drawSource();
      tabs.forEach(t => { const tab = $(`#ml-tab-${t}`), on = t === id; tab.setAttribute('aria-selected', String(on)); tab.tabIndex = on ? 0 : -1; $(`#ml-${t}`).hidden = !on; });
      if (id === 'cnn') cnnMessage();
      if (id === 'rnn') rnnMessage();
      if (id === 'diffusion') { drawForward(); drawReverse(); }
    }
    tabs.forEach((t, i) => {
      const tab = $(`#ml-tab-${t}`);
      tab.onclick = () => show(t);
      tab.addEventListener('keydown', e => {
        const move = {ArrowRight: 1, ArrowLeft: -1}[e.key]; if (!move && e.key !== 'Home' && e.key !== 'End') return;
        e.preventDefault(); const next = e.key === 'Home' ? 0 : e.key === 'End' ? tabs.length - 1 : (i + move + tabs.length) % tabs.length;
        show(tabs[next]); $(`#ml-tab-${tabs[next]}`).focus();
      });
    });
    document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); });

    $$('[data-k]').forEach((el, i) => el.value = kernel[i]);
    $('[data-kernel="vertical"]').setAttribute('aria-pressed', 'true');
    useImage(image, 'seven');
    return stop;
  }
  window.ceModelLab = {mount};
})();
