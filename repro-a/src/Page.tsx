import { createSignal } from 'solid-js';
export default function Page() {
  const [count, setCount] = createSignal(0);
  return <><header>Header</header><main><input aria-label="Type before hydration" placeholder="Type here within 5 seconds" /><button onClick={() => setCount(count() + 1)}>Count: {count()}</button></main></>;
}
