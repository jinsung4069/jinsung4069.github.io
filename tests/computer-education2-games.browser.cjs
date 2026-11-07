// Usage: PLAYWRIGHT_MODULE=<installed module> node tests/computer-education2-games.browser.cjs [base URL]
const {chromium} = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const base = process.argv[2] || 'http://127.0.0.1:8771';
const last = {8:84, 9:30, 10:60, 11:44}, legacy = {9:26, 10:25, 11:10};
(async () => {
  const browser = await chromium.launch({headless:true, ...(process.env.PW_CHANNEL==='none'?{}:{channel:process.env.PW_CHANNEL||'msedge'})});
  try {
    const page = await browser.newPage({viewport:{width:1440,height:1080}}), errors = [];
    page.on('pageerror', e => errors.push(e.message));
    const go = async chapter => { await page.goto(`${base}/lectures/computer-education2/${chapter}/#slide-${last[chapter]}`); await page.waitForSelector('.ce-game h2'); };
    const click = id => page.locator(`#cg-${id}`).click();
    const message = () => page.locator('#cg-feedback').innerText();
    const range = async (id, value) => { const el = page.locator(`#cg-${id}`); await el.press('Home'); for(let i=0;i<(value+3)*2;i++) await el.press('ArrowRight'); };
    const hash = async n => { await page.evaluate(n => location.hash=`slide-${n}`, n); await page.waitForFunction(n => document.querySelector('#ce-page').value===String(n), n); };
    await go(8);
    assert.match(await page.locator('.ce-game h2').innerText(), /CNN, RNN, 확산 모델/);
    assert.notEqual(await page.locator('#ml-sum').innerText(), '0.00', 'the filter starts where it responds');
    await page.locator('[data-kernel="horizontal"]').click(); assert.match(await message(), /가로 경계/);
    const cell = page.locator('[data-k="0"]'); await cell.fill('20'); await cell.blur();
    assert.equal(await cell.inputValue(), '9', 'a filter cell shows the value the calculation uses');
    assert.match(await message(), /×\(9\)/);
    await page.locator('#ml-pos').press('ArrowRight'); assert.match(page.url(), /#slide-84$/, 'slider arrow keys must not change slides');
    await page.locator('#ml-tab-rnn').click(); assert.equal(await page.locator('#ml-rnn').isVisible(), true);
    for(let i=0;i<32;i++) await page.locator('#ml-next-row').click();
    assert.match(await message(), /32줄을 모두 읽었습니다.*입력이 없는 줄 20개를 지나면 0\.007까지/); assert.equal(await page.locator('#ml-next-row').isEnabled(), true);
    await page.locator('#ml-tab-diffusion').focus(); await page.keyboard.press('ArrowLeft');
    assert.equal(await page.locator('#ml-tab-rnn').getAttribute('aria-selected'), 'true'); assert.match(page.url(), /#slide-84$/, 'tab arrow keys must not change slides');
    await page.locator('#ml-tab-diffusion').click();
    for(let i=0;i<50;i++) await page.locator('#ml-denoise-step').click();
    assert.match(await message(), /생성 완료/); assert.equal(await page.locator('#ml-weights li').count(), 4);
    await page.locator('#ml-clear').click(); assert.equal(await page.locator('#ml-weights li').count(), 5, 'a new input joins the known images');
    console.log('8: CNN filter calculation, RNN row reading, tab keyboard isolation, diffusion generation and known images');

    await go(9);
    assert.equal(await page.locator('#cg-run').isDisabled(),true);
    for(const i of [0,1,2,3]) await page.locator(`[data-sample="${i}"]`).click();
    assert.equal(await page.locator('[data-sample="4"]').isDisabled(),true);
    await click('run'); assert.match(await message(), /4 \/ 8/);
    await click('reset');
    for(const i of [0,2,4,6]) await page.locator(`[data-sample="${i}"]`).click();
    await click('run'); assert.match(await message(), /8 \/ 8.*100%/); assert.match(await message(), /임무 성공/);
    assert.equal(await page.locator('.cg-mineral.cg-correct').count(),8);
    const mineralResult = await message(); await hash(legacy[9]); assert.equal(await page.locator('#threshold').isVisible(),true); await hash(last[9]); assert.equal(await message(),mineralResult);
    await page.locator('[data-sample="0"]').click(); assert.equal(await page.locator('#cg-run').isDisabled(),true); assert.doesNotMatch(await message(),/임무 성공/);
    console.log('9: biased examples fail, representative examples win, budget limit, navigation preserves state');

    await go(10);
    await click('run'); assert.match(await message(),/이름표.*연락처/);
    await page.locator('#cg-name').check(); await page.locator('#cg-contact').check();
    assert.match(await page.locator('#cg-preview').innerText(),/익명 학생/);
    await click('run'); await click('next'); await click('run'); assert.match(await message(),/허락.*표시/);
    await page.locator('#cg-asset').selectOption('allowed'); await page.locator('#cg-credit').check(); await click('run'); await click('next');
    await click('run'); assert.match(await message(),/얼굴.*존중/);
    await page.locator('#cg-face').check(); await page.locator('#cg-comment').selectOption('kind'); await click('run');
    assert.match(await message(),/임무 성공/); assert.equal(await page.locator('#cg-run').isDisabled(),true); assert.match(await page.locator('#cg-score').innerText(),/3 \/ 3/);
    await click('reset'); assert.match(await page.locator('#cg-score').innerText(),/0 \/ 3/); assert.equal(await page.locator('#cg-name').isChecked(),false);
    console.log('10: privacy, permission and respectful feedback gates, preview, three stamps and reset');

    await go(11);
    await click('step'); assert.match(await message(),/벽 충돌/); assert.equal(await page.locator('#cg-step').isDisabled(),true);
    await page.locator('#cg-right').selectOption('rightForward'); await page.locator('#cg-front').selectOption('forward'); await page.locator('#cg-blocked').selectOption('left');
    let steps = 0;
    while(await page.locator('#cg-step').isEnabled() && steps++<33) await click('step');
    assert.match(await message(),/구조 성공/); assert.match(await page.locator('#cg-maze').getAttribute('aria-label'),/2행 6열/);
    await click('reset'); await page.locator('#cg-right').selectOption('left'); await page.locator('#cg-blocked').selectOption('left');
    for(let i=0;i<32;i++) await click('step');
    assert.match(await message(),/에너지 소진/);
    await page.locator('#cg-right').selectOption('rightForward'); await click('run');
    await page.waitForFunction(()=>document.querySelector('#cg-score').textContent.includes('1 / 32'));
    await click('pause'); const paused = await page.locator('#cg-score').innerText(); await page.waitForTimeout(650); assert.equal(await page.locator('#cg-score').innerText(),paused);
    await click('run'); await hash(43); const stopped = await page.locator('#cg-score').innerText(); await page.waitForTimeout(650); await hash(44); assert.equal(await page.locator('#cg-score').innerText(),stopped); assert.equal(await page.locator('#cg-pause').isDisabled(),true);
    await click('run'); await page.waitForFunction(()=>document.querySelector('#cg-feedback').textContent.includes('구조 성공'),null,{timeout:20000});
    console.log('11: collision, corrected program wins, energy exhaustion, pause/resume and slide-leave cleanup');

    for(const viewport of [{width:390,height:844},{width:820,height:1180},{width:1440,height:1080}]) {
      await page.setViewportSize(viewport);
      for(const n of [8,9,10,11]) {
        await go(n);
        assert.equal(await page.locator('.ce-game').isVisible(),true);
        const widths = await page.evaluate(()=>({page:document.documentElement.scrollWidth,viewport:innerWidth,lab:document.querySelector('#ce-lab').clientWidth,content:document.querySelector('#ce-lab').scrollWidth}));
        assert(widths.page<=widths.viewport+1 && widths.content<=widths.lab+1,`${n}: overflow at ${viewport.width}: ${JSON.stringify(widths)}`);
        const control = n===8?'#ml-scan':'#cg-run'; await page.locator(control).scrollIntoViewIfNeeded(); assert.equal(await page.locator(control).isVisible(),true);
        await page.locator('#ce-open-toc').click(); await page.locator('#ce-search').fill(n===8?'체험 실습':'게임 실습');
        assert.equal(await page.locator('#ce-toc button:not([hidden])').count(),1);
        await page.locator('#ce-toc button:not([hidden])').click();
        if(legacy[n]){ await hash(legacy[n]); assert.equal(await page.locator('.ce-game').isVisible(),false); assert.equal(await page.locator('#ce-lab').isVisible(),true);}
      }
    }
    console.log('All four decks: desktop/tablet/mobile overflow, controls, searchable TOC and legacy activity');

    // Full print preparation is isolated from the active game, including cancellation cleanup.
    const printPage = await browser.newPage({viewport:{width:390,height:844}});
    printPage.on('pageerror',e=>errors.push(e.message));
    await printPage.addInitScript(()=>{window.print=()=>{window.__printReady=true;};});
    for(const n of [8,9,10,11]) {
      await printPage.goto(`${base}/lectures/computer-education2/${n}/#slide-${last[n]}`); await printPage.waitForSelector('.ce-game h2');
      const before = await printPage.locator('#ce-lab').innerText();
      await printPage.locator('#ce-print').click();await printPage.locator('#lecture-print-kind').selectOption('all');await printPage.getByRole('button',{name:'인쇄 준비'}).click();
      await printPage.waitForFunction(()=>document.querySelector('.lecture-print-frame')?.contentWindow.__printReady,null,{timeout:180000});
      const result = await printPage.evaluate(()=>{const doc=document.querySelector('.lecture-print-frame').contentDocument;return {sheets:doc.querySelectorAll('.lecture-print-sheet').length,worksheets:doc.querySelectorAll('#lecture-print-deck .cg-worksheet').length,body:doc.querySelector('#lecture-print-deck .cg-worksheet')?.textContent};});
      assert.equal(result.sheets,last[n]); assert.equal(result.worksheets,1); assert.match(result.body,/실습 활동지/);
      assert.equal(await printPage.locator('#ce-lab').innerText(),before);
      await printPage.evaluate(()=>document.querySelector('.lecture-print-frame').contentWindow.dispatchEvent(new Event('afterprint')));
      await printPage.waitForSelector('.lecture-print-frame',{state:'detached'});
      console.log(`${n}: ${result.sheets} A4 sheets, printable worksheet, live game preserved`);
    }
    assert.deepEqual(errors,[]);
    console.log('PASS: all game journeys and print checks; no uncaught browser errors');
  } finally { await browser.close(); }
})().catch(e=>{console.error(e);process.exitCode=1;});
