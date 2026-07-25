# NEXUS architecture

## State boundaries

| State                                             | Owner                            | Persistence              |
| ------------------------------------------------- | -------------------------------- | ------------------------ |
| Track, world, lesson, task, achievement content   | `src/content` registry           | Build-time modules       |
| User XP, task completion, relics, streak, profile | progress reducer                 | Versioned `localStorage` |
| Editor text and selected task                     | `LessonPage`                     | Deliberately ephemeral   |
| Python runtime and execution queue                | `PyodideService`                 | Worker lifetime only     |
| Runtime output and validation result              | `usePythonRunner` / `LessonPage` | Deliberately ephemeral   |
| Navigation and route params                       | React Router                     | URL hash                 |

## Content discovery

The root registry uses `import.meta.glob("./*/index.ts", { eager: true })` to discover
language modules. The Python module independently discovers every file under
`worlds/**/lessons/*.ts`, then groups lessons by their `worldId`. This keeps route and
renderer code independent of curriculum size.

## Progress transaction

1. Python finishes without a runtime error.
2. The selected validation strategy produces a structured result.
3. A successful result dispatches `record-task`.
4. The reducer rejects duplicate task IDs before awarding XP.
5. Streak and achievement conditions are recalculated.
6. The provider persists the versioned state after a short debounce.

Lesson XP is a separate explicit transaction and is available only when every standard
task ID exists in that lesson's progress record.

## Execution isolation

Pyodide is loaded lazily inside a dedicated Web Worker. Runs are serialized. Python
`sys.stdin` is replaced with an in-memory, multiline input queue for each run; stdout
and stderr are redirected into text buffers. A six-second main-thread timer terminates
the worker when code does not return, then the next run creates a fresh runtime.

This is practical UI isolation, not a security boundary equivalent to a server sandbox.
The application contains no secrets and never injects learner output as HTML.

## Deployment

`HashRouter` makes nested navigation refresh-safe on static hosting. Vite's `base` is
normalized from `VITE_BASE_PATH`. GitHub Actions derives that path from
`github.event.repository.name`, so hashed assets, dynamic imports, and the emitted Worker
URL resolve under `https://username.github.io/repository-name/`.
