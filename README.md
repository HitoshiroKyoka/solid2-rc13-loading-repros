# Solid 2 rc.13 Loading reproductions

Two minimal reproductions for Solid 2.0.0-rc.13 (`solid-js` and `@solidjs/web`), each with its own README.

- `repro-a/`: hydrating `Loading` around a `lazy()` component re-inserts the server-rendered nodes and the focused input loses focus.
- `repro-b/`: during SSR, `Errored` around a pending `Loading` reports `<Loading> boundary discovery did not converge after 10001 passes`.
