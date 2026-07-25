# Verification Report

This report records the release checks performed for the source archive.

## Automated checks

The following commands completed successfully:

```bash
npm install
npm ci
npm run typecheck
npm run lint
npm run test
VITE_BASE_PATH=/nexus-code/ npm run build
```

Vitest completed 11 test files and 34 tests. The production build transformed
1,667 modules without TypeScript, lint, test, or build errors.

## Runtime startup

Both runtime entry points were started successfully and then stopped after the
server reported ready:

```bash
npm run dev
npm run preview
```

## GitHub Pages audit

The production build was generated with a repository subpath and inspected for:

- prefixed HTML asset references;
- relative lazy-route chunks;
- a generated CodeMirror bundle;
- a generated Pyodide worker bundle;
- a pinned Pyodide CDN resource URL;
- missing referenced files;
- unexpected root-relative application assets.

The application uses `HashRouter`, so lesson, track, profile, and fallback routes
remain refresh-safe on static GitHub Pages hosting.

## Manual QA

The detailed browser checklist is in
[`docs/QA_CHECKLIST.md`](./QA_CHECKLIST.md). A managed cloud-browser session
could not reach the otherwise healthy local preview server in the build
environment, so viewport and interaction checks remain documented release
checks rather than automated browser assertions. Responsive rules explicitly
cover 1,440 px, 1,024 px, 768 px, and 390 px layouts.

