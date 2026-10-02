# Solid 2 lazy/Loading hydration reproduction

Requires Node 22.12 or newer. No router or backend.

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:4100/ and focus/type into the input within five seconds. The client entry is delayed only to give time to focus the SSR input. Hydration loses focus; the value and the same input survive. The counter works after hydration.

Controls: http://127.0.0.1:4100/?mode=no-loading and http://127.0.0.1:4100/?mode=no-lazy. Both retain focus. The static import exists for the second control; the failing case also reproduces with just `lazy` and `Loading` (see the App code in the issue).

With the server running, automate all three cases (three fresh browser pages per case):

```sh
npx playwright install chromium   # once, if Chromium is not installed
npm run check
```

A successful check means the reported bug and both controls matched the observations, not that Solid is fixed. It also checks the working counter.
