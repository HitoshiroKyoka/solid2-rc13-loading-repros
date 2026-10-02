import { lazy, Loading } from 'solid-js';
import { getRequestEvent, isServer } from '@solidjs/web';
import Page from './Page';

const LazyPage = lazy(() => import('./Page'), undefined, 'src/Page.tsx');
export default function App() {
  const mode = new URL(isServer ? getRequestEvent()!.request.url : location.href).searchParams.get('mode');
  if (mode === 'no-loading') return <LazyPage />;
  return <Loading fallback="Loading...">{mode === 'no-lazy' ? <Page /> : <LazyPage />}</Loading>;
}
