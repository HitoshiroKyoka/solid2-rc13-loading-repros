import assert from 'node:assert/strict';
import { createMemo, createComponent as h, Loading, Errored, Show, createContext } from 'solid-js';
import { renderToStream } from '@solidjs/web';

const errors = [];
const logError = console.error;
console.error = (...args) => { errors.push(args.join(' ')); logError(...args); };
const Context = createContext();
const sessionPromise = new Promise(resolve => setTimeout(() => resolve('SESSION_READY'), 30));
function Page() {
  const session = createMemo(() => sessionPromise);
  return h(Loading, { fallback: 'pending', get children() { return h(Show, { get when() { return session(); }, children: () => 'SESSION_READY' }); } });
}
function Shell() {
  return h(Errored, { fallback: error => error().message, get children() { return h(Page, {}); } });
}
const html = await renderToStream(() => {
  const later = createMemo(() => new Promise(resolve => setTimeout(() => resolve('LATER'), 10)));
  return h(Context, { value: true, get children() {
    return [process.argv.includes('--outer')
      ? h(Loading, { fallback: 'outer', get children() { return h(Shell, {}); } })
      : h(Shell, {}), () => later()];
  } });
});
console.log(html);
await new Promise(resolve => setTimeout(resolve, 20));
console.error = logError;
assert.equal(errors.some(error => error.includes('did not converge')), false);
