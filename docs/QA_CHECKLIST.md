# NEXUS manual QA checklist

Use this checklist after any major layout, learning-engine, or deployment change.

## Viewports

- [ ] 1440 px: hero uses two balanced columns; no clipped orrery labels.
- [ ] 1024 px: cards reflow cleanly and the learning workspace remains readable.
- [ ] 768 px: navigation collapses; editor appears before long theory content.
- [ ] 390 px: no page-level horizontal overflow; code can scroll inside the editor.
- [ ] Touch targets remain at least approximately 44 × 44 px where practical.

## Navigation and routes

- [ ] Every header link works from every route.
- [ ] All five track cards open a dedicated track page.
- [ ] Python map nodes follow the correct locked / active / completed sequence.
- [ ] Both preview lessons per future language open without dead controls.
- [ ] An unknown hash route renders the themed 404 screen.
- [ ] Refresh a nested hash route in a repository-subpath production preview.

## Lesson workspace

- [ ] The first Python run shows a clear runtime initialization state.
- [ ] Starter code resets to the selected task version.
- [ ] Standard input consumes one line for each `input()` call.
- [ ] stdout and stderr are rendered as plain text.
- [ ] Syntax errors and runtime errors are visible and understandable.
- [ ] `while True: pass` is stopped by the six-second worker timeout.
- [ ] Repeated valid runs do not add duplicate XP.
- [ ] Wrong output does not complete a task.
- [ ] Every standard task can be completed with concepts already taught.
- [ ] Bonus completion is optional for lesson completion.
- [ ] Completing all standard tasks enables “Restore fragment.”
- [ ] Completing a fragment unlocks the next map node.

## Progress

- [ ] Task, bonus, lesson, XP, and achievement state survives refresh.
- [ ] Multiple activities on one local date increment the streak once.
- [ ] A consecutive local date increments the streak.
- [ ] A missed local date resets current streak but preserves longest streak.
- [ ] Profile totals agree with map and lesson progress.
- [ ] Exported JSON imports into a clean browser.
- [ ] Invalid or oversized JSON shows a failure message and changes nothing.
- [ ] Reset requires confirmation and clears all progress.
- [ ] Corrupted local storage produces a recovery notice rather than a blank page.

## Accessibility

- [ ] “Skip to main content” appears on keyboard focus.
- [ ] Header, cards, map nodes, task tabs, editor actions, and lesson navigation are keyboard reachable.
- [ ] Focus indicators remain visible against every surface.
- [ ] Heading order is logical on landing, track, lesson, and profile pages.
- [ ] Validation success and failure are not conveyed by color alone.
- [ ] Runtime and validation updates are announced by a screen reader.
- [ ] Reduced-motion mode removes continuous orbit and pulse motion.
- [ ] Important text passes practical WCAG 2.1 AA contrast review.

## GitHub Pages

- [ ] Repository Settings → Pages → Source is “GitHub Actions.”
- [ ] Workflow derives `VITE_BASE_PATH` from the actual repository name.
- [ ] Built `index.html` uses repository-prefixed hashed assets.
- [ ] Dynamic route chunks and the Pyodide worker load from the same base.
- [ ] No built URL points to `localhost` or assumes the domain root.
- [ ] The landing page does not download Pyodide before a Python run.
- [ ] Pyodide loads over HTTPS from the documented pinned CDN version.
