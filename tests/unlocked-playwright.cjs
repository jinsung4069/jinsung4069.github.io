// Playwright with the lecture date gate already passed, so journeys start on the lecture itself.
// tests/lecture-gate.browser.cjs uses plain Playwright to test the gate.
const playwright = require(process.env.PLAYWRIGHT_MODULE || 'playwright');

const pass = () => {
  try { localStorage.setItem('lecture-gate', new Date(Date.now() + 9 * 36e5).toISOString().slice(0, 10).replace(/-/g, '')); } catch {}
};

const chromium = {
  async launch(options) {
    const browser = await playwright.chromium.launch(options);
    const newContext = browser.newContext.bind(browser);
    browser.newContext = async (contextOptions) => {
      const context = await newContext(contextOptions);
      await context.addInitScript(pass);
      return context;
    };
    browser.newPage = async (contextOptions) => (await browser.newContext(contextOptions)).newPage();
    return browser;
  },
};

module.exports = { ...playwright, chromium };
