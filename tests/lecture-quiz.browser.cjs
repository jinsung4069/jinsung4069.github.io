// Usage: PLAYWRIGHT_MODULE=<installed module> node tests/lecture-quiz.browser.cjs [base URL] [screenshot folder]
// Quiz slides of computer education lecture 10 show the question first and the answer on the next step.
const {chromium} = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const base = process.argv[2] || 'http://127.0.0.1:8771', shots = process.argv[3];
(async () => {
  const browser = await chromium.launch({headless:true, ...(process.env.PW_CHANNEL==='none'?{}:{channel:process.env.PW_CHANNEL||'msedge'})});
  try {
    const page = await browser.newPage({viewport:{width:1440,height:1000}}), errors = [];
    page.on('pageerror', e => errors.push(e.message));
    const data = await (await page.request.get(`${base}/data/lectures/computer-education2/10.json`)).json();
    const quiz = data.slides.map((s, i) => s.question ? i + 1 : 0).filter(Boolean);
    assert.equal(quiz.length, 18);
    for (const n of quiz) assert.equal((await page.request.get(base + data.slides[n - 1].question)).ok(), true, `question image of slide ${n}`);
    const first = quiz[0], src = () => page.locator('#ce-image').getAttribute('src'), number = () => page.locator('#ce-page').inputValue();
    await page.goto(`${base}/lectures/computer-education2/10/#slide-${first}`); await page.waitForSelector('[data-ready=true]');
    assert.match(await src(), /\/question\//); assert.equal(await page.locator('.ce-answer').isVisible(), true);
    assert.equal(await page.locator('.ce-text span').count(), 0, 'answer text is not selectable before it is shown');
    if (shots) await page.locator('#ce-stage').screenshot({path:`${shots}/quiz-question.png`});
    await page.keyboard.press('ArrowRight');
    assert.equal(await number(), String(first)); assert.doesNotMatch(await src(), /\/question\//); assert.equal(await page.locator('.ce-answer').count(), 0);
    assert.notEqual(await page.locator('.ce-text span').count(), 0);
    if (shots) await page.locator('#ce-stage').screenshot({path:`${shots}/quiz-answer.png`});
    await page.keyboard.press('ArrowRight'); assert.equal(await number(), String(first + 1));
    await page.keyboard.press('ArrowLeft'); assert.equal(await number(), String(first)); assert.match(await src(), /\/question\//, 'coming back shows the question again');
    await page.locator('.ce-answer').click(); assert.doesNotMatch(await src(), /\/question\//); assert.equal(await number(), String(first));
    await page.locator('#ce-stage').hover(); await page.locator('#ce-next').click(); assert.equal(await number(), String(first + 1));
    // The last quiz slide is the last image slide; its next button still reveals the answer.
    const last = quiz.at(-1);
    await page.evaluate(n => location.hash = `slide-${n}`, last); await page.waitForFunction(n => document.querySelector('#ce-page').value === String(n), last);
    assert.match(await src(), /\/question\//); await page.keyboard.press('d'); assert.doesNotMatch(await src(), /\/question\//); assert.equal(await number(), String(last));
    assert.deepEqual(errors, []);
    console.log(`PASS: ${quiz.length} quiz slides, question first, answer on the next step, by key and by button`);
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
