import { defineConfig } from 'vite';
import solid from '@solidjs/vite-plugin';

export default defineConfig({ plugins: [
  solid({ ssr: true, start: { renderMode: 'async' } }),
  { name: 'delay-hydration', configureServer(server) {
    server.middlewares.use((req, _res, next) => {
      // Give the user time to focus the server-rendered input.
      if (req.url?.includes('solid-ssr-entry-client')) setTimeout(next, 5000);
      else next();
    });
  } },
] });
