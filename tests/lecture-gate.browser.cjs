// Lecture pages stay hidden until today's Seoul date is entered; course lists stay open.
const {chromium} = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');

(async () => {
  const browser = await chromium.launch({headless:true, ...(process.env.PW_CHANNEL==='none'?{}:{channel:process.env.PW_CHANNEL||'msedge'})});
  const base = process.argv[2] || 'http://127.0.0.1:8765';
  const lecture = `${base}/lectures/computer-education2/10/#slide-7`;
  const visibleOutsideGate = page => page.evaluate(() => [...document.body.children].filter(el => el.id !== 'lecture-gate' && el.getClientRects().length).length);
  try {
    // 2026-11-17 23:59:30 in Seoul; the browser itself runs in another time zone.
    const context = await browser.newContext({viewport:{width:390,height:844}, timezoneId:'America/New_York'});
    const page = await context.newPage(), errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.clock.install({time:new Date('2026-11-17T14:59:30Z')});

    await page.goto(`${base}/lectures/computer-education2/`);
    assert.equal(await page.locator('#lecture-gate').count(), 0, 'course list stays open');

    await page.goto(lecture);
    await page.waitForSelector('#lecture-gate');
    assert.equal(await visibleOutsideGate(page), 0, 'lecture is hidden while locked');
    assert.equal(await page.locator('meta[name=robots]').getAttribute('content'), 'noindex');
    assert.equal(await page.evaluate(() => document.activeElement.id), 'lecture-gate-input');
    assert.equal(await page.locator('#lecture-gate input').getAttribute('inputmode'), 'numeric');

    await page.emulateMedia({media:'print'});
    assert.equal(await visibleOutsideGate(page), 0, 'lecture is hidden in print while locked');
    await page.emulateMedia({media:'screen'});

    for (const wrong of ['', '20261116', '20261118', '2026-11-17']) {
      await page.locator('#lecture-gate input').fill(wrong);
      await page.locator('#lecture-gate button').click();
      assert.equal(await page.locator('#lecture-gate-error').innerText(), '비밀번호가 올바르지 않습니다.');
      assert.equal(await visibleOutsideGate(page), 0);
    }

    await page.locator('#lecture-gate input').fill('20261117');
    await page.locator('#lecture-gate input').press('Enter');
    await page.waitForSelector('[data-ready=true]');
    assert.equal(await page.locator('#lecture-gate').count(), 0);
    assert.equal(new URL(page.url()).hash, '#slide-7', 'requested slide is kept');
    assert.equal(await page.locator('#ce-page').inputValue(), '7');

    await page.goto(`${base}/lectures/ai-algorithm/week2/`);
    await page.waitForSelector('.slide:not([hidden])');
    assert.equal(await page.locator('#lecture-gate').count(), 0, 'one entry opens every lecture that day');

    // After midnight in Seoul the next date is required.
    await page.clock.setFixedTime(new Date('2026-11-17T15:00:30Z'));
    await page.goto(lecture);
    await page.waitForSelector('#lecture-gate');
    await page.locator('#lecture-gate input').fill('20261117');
    await page.locator('#lecture-gate button').click();
    assert.equal(await page.locator('#lecture-gate-error').innerText(), '비밀번호가 올바르지 않습니다.');
    await page.locator('#lecture-gate input').fill('20261118');
    await page.locator('#lecture-gate button').click();
    await page.waitForSelector('[data-ready=true]');
    assert.deepStrictEqual(errors, []);
    await context.close();

    // When storage is blocked the lecture opens in place instead of reloading into the gate again.
    const blocked = await browser.newContext({viewport:{width:1280,height:900}});
    await blocked.addInitScript(() => { Storage.prototype.setItem = () => { throw new Error('blocked'); }; });
    const p = await blocked.newPage();
    await p.clock.install({time:new Date('2026-11-17T03:00:00Z')});
    await p.goto(lecture);
    await p.locator('#lecture-gate input').fill('20261117');
    await p.locator('#lecture-gate button').click();
    await p.waitForSelector('#lecture-gate', {state:'detached'});
    assert((await visibleOutsideGate(p)) > 0, 'lecture is shown without storage');
    await blocked.close();

    console.log('lecture gate: locked on direct slide links and in print, opens with the Seoul date, renews at midnight');
  } finally {
    await browser.close();
  }
})().catch(e => { console.error(e); process.exit(1); });
