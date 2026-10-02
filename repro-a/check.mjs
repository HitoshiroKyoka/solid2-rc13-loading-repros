import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const browser = await chromium.launch();
console.log(JSON.stringify({ browser: browser.version(), platform: process.platform, node: process.version }));
try {
  for (const mode of ['bug', 'no-loading', 'no-lazy']) for (let run = 1; run <= 3; run++) {
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    let release;
    const gate = new Promise(resolve => { release = resolve; });
    await page.route('**/*solid-ssr-entry-client*', async route => { await gate; await route.continue(); });
    await page.goto(`http://127.0.0.1:4100/?mode=${mode}`, { waitUntil: 'commit' });
    await page.locator('input').waitFor();
    await page.evaluate(() => {
      window.ssrInput = document.querySelector('input');
      window.ssrMain = document.querySelector('main');
      window.moves = [];
      const insert = Node.prototype.insertBefore;
      Node.prototype.insertBefore = function (node, anchor) {
        if (node === window.ssrMain) window.moves.push({ connected: node.isConnected, stack: new Error().stack });
        return insert.call(this, node, anchor);
      };
      window.ssrInput.focus();
    });
    await page.keyboard.type('before-hydration');
    release();
    await page.waitForLoadState('networkidle');
    const state = await page.evaluate(() => ({
      sameInput: window.ssrInput === document.querySelector('input'),
      sameMain: window.ssrMain === document.querySelector('main'),
      value: window.ssrInput.value,
      focused: document.activeElement === window.ssrInput,
      moves: window.moves,
    }));
    await page.getByRole('button').click();
    await page.getByRole('button', { name: 'Count: 1', exact: true }).waitFor();
    console.log(JSON.stringify({ mode, run, ...state, errors, counter: 'Count: 1' }));
    assert.deepEqual(errors, []);
    assert.equal(state.sameInput, true);
    assert.equal(state.sameMain, true);
    assert.equal(state.value, 'before-hydration');
    assert.equal(state.focused, mode !== 'bug');
    assert.equal(state.moves.length, mode === 'bug' ? 1 : 0);
    if (mode === 'bug') assert.equal(state.moves[0].connected, true);
    await page.close();
  }
} finally {
  await browser.close();
}
