# Solid 2 Errored/Loading SSR reproduction

Requires Node 22.12 or newer. No router, JSX compiler, browser, or HTTP server.

```sh
npm ci
npm run repro       # expected exit 1: assertion catches the convergence diagnostic
npm run control     # expected exit 0: adds Loading around Shell
npm run check       # verifies both observations three times in fresh processes
```

The stable session promise resolves, and both cases return HTML containing `SESSION_READY`. The failing case additionally reports `SSR_BOUNDARY_WATERFALL` and `SSR_RENDER_ERROR_CONTAINED` with `did not converge after 10001 passes`. The final 20 ms wait lets diagnostics from abandoned pending work arrive before checking them.

A successful `check` means the reported bug and its control matched the observations, not that Solid is fixed.
