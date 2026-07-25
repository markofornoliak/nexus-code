# NEXUS CODE

**Recover the logic. Rebuild the signal.**

NEXUS is a portfolio-grade, static programming learning platform built with React,
TypeScript, Vite, CodeMirror 6, and Pyodide. Its complete Python beginner expedition
contains 15 instructional fragments across three visual world maps. JavaScript,
HTML/CSS, Java, and C++ use the same content model and ship with dedicated preview
tracks.

The product runs without a backend, stores progress locally, and deploys safely to a
GitHub Pages repository subpath.

## Screenshots

Add release screenshots here after deployment:

- `docs/screenshots/landing-1440.png` — hero and Living Code Archive orrery.
- `docs/screenshots/python-map-1440.png` — connected Python expedition map.
- `docs/screenshots/lesson-1440.png` — theory plus CodeMirror/Pyodide workspace.
- `docs/screenshots/profile-390.png` — mobile operator profile and relic vault.

The application itself contains no required raster artwork; its identity is created
with CSS, semantic HTML, small inline SVG map paths, and open-source icons.

## Visual concept

### The Living Code Archive

Programming knowledge is framed as a vast bio-digital archive discovered inside an
ancient computational organism. Languages are **Expeditions**, worlds are **Archive
Sectors**, lessons are **Fragments**, XP is **Signal Energy**, streaks are **Pulse
Chains**, and achievements are collectible **Relics**.

The name NEXUS refers to a junction where dormant logic fragments reconnect into a
working neural pathway. The visual system combines scientific instruments, data
archaeology, specimen labels, ancient diagrams, observatory orbits, field notes, and
restrained signal motion. It intentionally avoids cartoon mascots, generic gradient
cards, and conventional developer-dashboard composition.

Design principles:

1. **Instrument, not decoration** — labels, grids, readouts, paths, and states explain
   the interface.
2. **Controlled contrast** — dark research surfaces alternate with a pale manuscript
   band; lime, amber, and cyan carry semantic signal states.
3. **Recognizable geometry** — diamond seals, circular orreries, clipped archive
   housings, and precise 1 px borders recur throughout the product.
4. **Motion with purpose** — slow orbits and signal pulses suggest a living system and
   disappear under `prefers-reduced-motion`.
5. **Content remains primary** — visual narrative never obscures theory, code, output,
   focus, or validation.

## Main features

- Five language tracks backed by one typed domain architecture.
- Complete Python curriculum: 3 worlds, 15 substantial lessons, 30 standard tasks,
  and 15 bonus tasks.
- Reusable lesson-section renderer for theory, syntax, examples, callouts, warnings,
  mistakes, and tasks.
- CodeMirror 6 editor with a custom NEXUS theme and adjustable font size.
- Lazy Pyodide initialization inside a Web Worker.
- Multiline standard-input queue for Python `input()`.
- stdout/stderr capture, syntax/runtime feedback, repeatable runs, and six-second
  runaway-code interruption.
- Seven validation modes: exact, trimmed exact, regex, substring, multiple variants,
  code pattern, and registered custom validators.
- Duplicate-XP prevention and explicit lesson completion conditions.
- Signal Energy, calculated levels, daily Pulse Chains, and nine thematic Relics.
- Connected, responsive, keyboard-accessible Python map nodes.
- Versioned local storage with safe parsing, migration, corruption recovery, export,
  import, and reset confirmation.
- Hash-based routing, route-level lazy loading, 404 state, and rendering error boundary.
- Responsive layouts designed around 1440, 1024, 768, and 390 px.
- Practical WCAG 2.1 AA semantics, focus states, live announcements, and reduced motion.
- Unit and component coverage for domain calculations, persistence, registry behavior,
  navigation, feedback, lock rules, and lesson runtime loading.

## Technology stack

| Area        | Technology                                                           |
| ----------- | -------------------------------------------------------------------- |
| UI          | React 19, TypeScript, Tailwind CSS 4, semantic custom CSS            |
| Build       | Vite 6                                                               |
| Navigation  | React Router with `HashRouter`                                       |
| Editor      | CodeMirror 6                                                         |
| Python      | Pyodide 0.27.7 loaded lazily from the official jsDelivr package path |
| Persistence | Browser `localStorage`                                               |
| Tests       | Vitest, React Testing Library, jest-dom, jsdom                       |
| Quality     | ESLint flat config, typescript-eslint, Prettier, strict TypeScript   |
| Deployment  | Official GitHub Pages Actions                                        |

## Architecture overview

The application separates build-time curriculum, persistent user progress, ephemeral
editor state, execution state, and presentation state. Generic pages never contain
lesson-specific validation branches. Content additions flow through registries and
typed data files.

```text
Content files ──> content registry ──> generic track/lesson renderers
                                        │
CodeMirror ──> Pyodide Worker ──> structured execution result
                                        │
                                 task validator
                                        │
Progress UI <── selectors <── versioned reducer ──> localStorage
```

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for state ownership, content
discovery, progress transactions, execution isolation, and base-path behavior.

## Folder structure

```text
src/
  app/
    App.tsx
    config/
  components/
    achievements/
    common/
    feedback/
    layout/
    lessons/
    tracks/
  content/
    _shared/
    _templates/
    python/worlds/*/lessons/
    javascript/
    html-css/
    java/
    cpp/
    achievements.ts
    registry.ts
  design-system/
  features/
    code-runner/
    progress/
  lib/
  pages/
  services/
    pyodide/
    storage/
  styles/
  test/
  types/
docs/
.github/workflows/deploy.yml
```

## Installation

Requirements:

- Node.js 20.19 or newer (Node 22 LTS is used in CI).
- npm 10 or newer.
- A modern browser with Web Workers and WebAssembly.

```bash
npm install
```

No environment variables or private API keys are required.

## Local development

```bash
npm run dev
```

Vite prints the local URL. The landing page does not fetch Pyodide. The first Python
execution downloads the pinned runtime from jsDelivr, so that action requires network
access.

## Required commands

```bash
npm run dev
npm run typecheck
npm run lint
npm run test
npm run build
npm run preview
```

`npm run build` performs strict type checking before the production Vite build.

## Production build

For a root deployment:

```bash
npm run build
npm run preview
```

For a repository named `nexus-code`:

```bash
VITE_BASE_PATH=/nexus-code/ npm run build
npm run preview
```

`vite.config.ts` normalizes missing leading/trailing slashes. Do not hardcode the
repository name in source files.

## Testing

```bash
npm run test
```

The unit suite does **not** download Pyodide. The execution hook and editor are mocked
where runtime loading state is tested. Manual Pyodide, responsiveness, keyboard, and
deployment checks are documented in [docs/QA_CHECKLIST.md](docs/QA_CHECKLIST.md).
The release command results and production-path audit are recorded in
[docs/VERIFICATION.md](docs/VERIFICATION.md).

## GitHub Pages deployment

1. Create a GitHub repository and push this project to its `main` branch.
2. Open **Repository → Settings → Pages**.
3. Under **Build and deployment**, set **Source** to **GitHub Actions**.
4. Push to `main`, or run the workflow manually from the Actions tab.
5. Wait for **Deploy NEXUS to GitHub Pages** to finish.

The workflow:

1. checks out the repository;
2. installs with `npm ci`;
3. runs type checking;
4. runs linting;
5. runs all automated tests;
6. derives `VITE_BASE_PATH` from `${{ github.event.repository.name }}`;
7. builds;
8. uploads `dist`;
9. deploys through the official Pages action.

The generated `dist` directory is intentionally not committed.

### Repository name configuration

No source edit is required in the included GitHub workflow. It automatically turns a
repository called `repository-name` into `/repository-name/`.

Only a manual production build needs the variable:

```bash
VITE_BASE_PATH=/repository-name/ npm run build
```

If the project is served from a custom domain root, build with `VITE_BASE_PATH=/`.

## Why routing survives static hosting

NEXUS uses `HashRouter`. Routes therefore appear after `#` and are resolved entirely in
the browser. A direct refresh always requests the single deployed `index.html`, so
GitHub Pages does not need a custom 404 fallback. Vite applies the same base path to
hashed chunks and the emitted Pyodide Worker.

## Adding a new lesson

1. Copy `src/content/_templates/lesson.template.ts`.
2. Place the new file in:
   `src/content/python/worlds/<world-folder>/lessons/<order>-<slug>.ts`.
3. Give the lesson, tasks, and bonus globally unique IDs.
4. Set `worldId` to an existing world and choose its local `order`.
5. Add real theory, examples, mistakes, starter code, hints, and validations.
6. Add prerequisites using lesson IDs.
7. Run typecheck, tests, and build.

The Python module uses `import.meta.glob` and discovers the file automatically. Route,
track, lesson, progress, and navigation components require no edit.

## Adding a new world

1. Copy `src/content/_templates/world.template.ts` into the new world folder as
   `world.ts`.
2. Give it a unique ID, local order, landmark, semantic accent, and complete copy.
3. Add a `lessons` directory with typed lesson files.
4. Import the world definition once in `src/content/python/index.ts` and include it in
   the ordered world array.

This is the only language-local index edit required.

## Adding a programming language

1. Copy `src/content/_templates/track.template.ts` into
   `src/content/<language-id>/index.ts`.
2. Replace the IDs, name, archive identity, status, metadata, and world modules.
3. Reuse the Python `index.ts` pattern if lesson files should be discovered
   automatically.
4. Implement or register an execution adapter before changing the track to `available`.
5. Add language-specific syntax highlighting to `CodeEditor`.
6. Add tests for registry discovery, task validation, and runtime failure states.

The root registry discovers the new `index.ts`; no global switch statement or route
edit is needed.

## Adding an achievement

Add one typed object to `src/content/achievements.ts`. Supported declarative conditions:

- `task-count`
- `lesson-count`
- `bonus-count`
- `total-xp`
- `streak`
- `lesson-completed`
- `world-completed`
- `track-completed`

The progress reducer evaluates newly satisfied conditions after every XP-bearing
transaction and records the unlock only once.

## Extending task validation

For a declarative strategy:

1. Add a new discriminated-union member to `TaskValidation` in
   `src/types/content.ts`.
2. Add an exhaustive `case` in `src/lib/validation.ts`.
3. Return a complete `ValidationResult`.
4. Add success and failure unit tests.
5. Document authoring syntax in the lesson template.

For a selected advanced task, register a named custom validator in the
`customValidators` map and reference only its inert `validatorId` from content. Imported
progress never carries executable functions.

## Local storage schema

Key: `nexus-code:state`

```ts
interface StoredApplicationState {
  version: number;
  progress: {
    displayName: string;
    totalXp: number;
    lessons: Record<string, LessonProgress>;
    unlockedAchievementIds: string[];
    achievementDates: Record<string, string>;
    streak: StreakState;
    activity: LearningActivity[];
  };
  preferences: {
    reducedMotion: boolean;
    editorFontSize: number;
    hintsExpanded: boolean;
  };
}
```

Current version: `2`. Reads use guarded JSON parsing, runtime shape validation, value
limits, defaults, and a version-1 migration. Invalid state falls back to a clean
profile and raises a visible recovery notice.

## Pyodide and input notes

- Runtime version is pinned to Pyodide `0.27.7`.
- It loads only after the learner runs Python for the first time.
- The runtime operates in a dedicated Worker, not the React main thread.
- Runs are serialized.
- `sys.stdin` becomes an `io.StringIO` built from the Standard Input panel.
- Each `input()` consumes one line; multiple calls require multiple lines.
- stdout and stderr are captured separately and rendered as plain text.
- A six-second watchdog terminates the Worker to recover from common infinite loops.
- After a timeout, the next run creates a fresh runtime and must load it again.

## Known browser limitations

- First Python execution downloads a comparatively large WebAssembly runtime. Duration
  depends on network and browser cache.
- Pyodide CDN unavailability prevents Python execution but not theory, maps, profile, or
  local progress.
- Terminating a Worker is the safest broadly supported interruption strategy; it
  discards that runtime instance.
- Browser Python execution is not a hardened server sandbox. Do not adapt this design
  to process untrusted secrets.
- Progress is device/browser-profile local unless exported manually.
- Private browsing, storage quotas, or aggressive cleanup may remove local progress.
- Local calendar changes can affect date-based streak semantics.

## Performance notes

- Every page route is lazy-loaded.
- Pyodide is absent from the JavaScript bundle and from landing-page requests.
- CodeMirror is isolated in its own production chunk.
- Curriculum data is split with the lesson route.
- SVG paths are small and raster/base64 assets are not bundled.
- Memoization is limited to stable content-derived structures and context values.

The unavoidable large download is the external Pyodide runtime and Python standard
library. It is deferred until real execution is requested.

## Accessibility

- Semantic landmarks, headings, navigation, buttons, links, labels, lists, and progress
  elements.
- Skip link and high-contrast keyboard focus ring.
- Map nodes are links or disabled buttons, never clickable `div` elements.
- Runtime and validation feedback uses live regions.
- Success and failure include icons, labels, and text—not color alone.
- Output is text inside `pre`; learner content is never injected as HTML.
- Responsive lesson stacking preserves actions before lengthy theory on smaller screens.
- Continuous visual motion respects `prefers-reduced-motion`.

## Content security

The project contains no API keys or application secrets. Learner output uses React text
nodes and `pre`, never `dangerouslySetInnerHTML`. Imported progress is length-limited,
parsed as JSON, validated against a fixed data shape, and cannot register code or
validation functions.

## Future roadmap

- Complete production curricula for JavaScript, HTML/CSS, Java, and C++.
- Language-specific execution adapters and editors.
- Optional service-worker caching for the Pyodide distribution.
- Curriculum search and objective filters.
- Instructor-authored content validation CLI.
- Shareable, signed progress snapshots without a central account system.
- Internationalized learning content.
- Automated accessibility and screenshot regression checks in CI.

## Third-party licenses

- React, React DOM — MIT.
- React Router — MIT.
- Vite — MIT.
- Tailwind CSS — MIT.
- CodeMirror packages — MIT.
- Lucide icons — ISC.
- Pyodide — Mozilla Public License 2.0; includes Python and compatible packaged
  components. Runtime files are loaded from the pinned jsDelivr package path and are not
  redistributed in this repository.
- TypeScript, ESLint, Prettier, Vitest, Testing Library — their respective permissive
  open-source licenses.

All NEXUS layout, product copy, CSS artwork, archive terminology, course structure, and
application source in this repository are original. See [LICENSE](LICENSE) for project
licensing.
