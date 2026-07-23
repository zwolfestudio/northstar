# Northstar — Roadmap

This tracks phase-by-phase progress toward v0.2 and beyond. For the
enduring product vision, see [PRODUCT_SPEC.md](PRODUCT_SPEC.md). For
how it's actually built, see [ARCHITECTURE.md](ARCHITECTURE.md).

---

## Current Status

**v0.1** — Shipped (foundation: dashboard, mission tracking, local
storage, professional dark UI).

**v0.2** — In progress. Phases 1–4 complete. Phase 5 next — the last
phase before v0.2 is done.

---

## v0.2 — Data Foundation & Navigation

### Phase 1 — Data Foundation — ✅ Complete (2026-07-23)

- Real `Mission` and `Project` models with stable ids and timestamps
  (`src/models/`)
- Versioned storage service (`src/services/storage.ts`) that upgrades
  old v0.1 localStorage data in place instead of discarding it
- `useCollection` hook (add/update/remove) replacing direct
  `localStorage` access
- Mission actions: add, edit, mark complete
- v0.1's separate "Objectives" concept folded into `Project`, linked
  to a `Mission` via `missionId`
- Fixed a pre-existing build break (`sidebar.tsx` vs. `Sidebar` import
  casing) discovered while verifying this phase

**Decisions made:**

- Tailwind CSS adoption deferred — prioritized data-layer stability
  over a styling migration with no user-visible benefit; revisit in
  Phase 3
- Existing v0.1 localStorage data preserved and upgraded, not wiped

### Phase 2 — Navigation & Modules — ✅ Complete (2026-07-23)

- Added client-side routing (`react-router-dom`)
- Dashboard is now a summary view (top 3 active Missions/Projects,
  read-only, with "View all" links) instead of the full management UI
- New `/missions` page: the full add/edit/complete flow that used to
  live on the Dashboard
- New `/projects` page: full Project list
- New `/finished` page: completed Missions and completed Projects,
  reachable from the sidebar
- New `/knowledge` and `/settings` pages: minimal placeholders (no
  real functionality yet — Knowledge's real build-out is Phase 4;
  Settings has no defined scope)
- Sidebar nav links are functional with active-route highlighting;
  "Assets" now reads "Future" (disabled, matching the "AI — Coming
  Soon" treatment) since it has no model or scope yet

**Decisions made:**

- Dashboard is a snapshot, not a duplicate management surface — full
  CRUD lives on dedicated pages
- Knowledge/Settings got minimal real pages rather than staying dead
  links, even though there's no feature behind them yet
- Finished page covers both completed Missions and completed Projects

### Phase 3 — Theme System — ✅ Complete (2026-07-23)

**Dashboard tracking & layout**

- Dashboard now shows exactly one Mission and one Project — whichever
  is manually "tracked" — instead of a top-3 summary
- "Track on Dashboard" button added to Mission and Project cards on
  their full list pages (`/missions`, `/projects`); tracking is
  interchangeable — tracking a different item swaps the Dashboard's
  spotlight, one at a time per collection
- Until something is manually tracked, the Dashboard defaults to the
  first active Mission/Project
- Tracked selection persists via a new small single-value slot in the
  storage service (`loadValue`/`saveValue`, `src/hooks/useTrackedItems.ts`)
- Dashboard cards/headings tightened so the page fits a 1920×1080
  window without scrolling
- **Bug fix**: seed data (`src/data/missions.ts`, `src/data/projects.ts`)
  generates fresh random ids on every module load. `loadCollection`
  previously only persisted a collection after its first write, so an
  untouched collection's ids silently changed on every page reload —
  breaking anything that stored a reference to one (like a tracked
  mission). Fixed by persisting the seed on first read, not first
  write, in `src/services/storage.ts`.

**Theme tokens**

- All colors, border-radius, and font-family in `index.css` now read
  from CSS custom properties defined in
  `src/themes/operator-observatory.css`, instead of being hardcoded
  inline
- Spacing (padding/margin/gap) was deliberately left as literal
  values — it's a layout concern, not a theme dimension per
  ARCHITECTURE.md Section 10, and tokenizing it would've been a much
  larger change for no real payoff
- Warning/Success colors and Shadows are documented as reserved
  categories but not defined — nothing in the UI needs them yet;
  adding unused tokens now would be guessing at values
- Consolidated a few duplicate/dead CSS rules found while doing this
  (`.mission-card`, `.progress-fill`, `.priority` were each defined
  twice, and `.northstar`/`.header`/`.dashboard` were unused leftovers
  from before routing existed); deleted the never-imported `App.css`
  Vite boilerplate
- Zero visual change — verified via screenshot comparison across every
  route
- **Decision**: Tailwind adoption skipped for good (not just
  deferred) — the CSS-variable token system achieves the theming goal
  with less migration risk and fewer moving parts for a solo,
  non-technical-owner project
- No new themes yet — a second theme is now just a new file in
  `src/themes/` with the same variable names and different values

### Phase 4 — Projects & Knowledge Modules — ✅ Complete (2026-07-23)

- Projects reached full parity with Missions: add, edit (title,
  linked Mission, status, notes), increase progress, mark complete —
  none of that existed before this phase
- Inline task list on each Project card — add a task, check it off,
  remove it. Tasks live on the Project record itself (`tasks[]`,
  already in the data model since Phase 1); no separate task
  collection
- New `Note` model (`src/models/note.ts`): title, body, optional links
  to a Mission and/or Project, timestamps. Seeded empty — no
  placeholder content invented for a feature that didn't exist before
- Knowledge page is real now: add/edit/delete notes, newest first,
  optionally tagged to a Mission/Project
- Dashboard's tracked Project stays read-only (no task list, no
  actions) — consistent with how the tracked Mission already worked,
  and keeps the compact/no-scroll layout from Phase 3 intact
- Reaches full v0.1 product scope: Dashboard + Missions + Projects +
  Notes
- No search/filter on Knowledge yet — deferred; a handful of notes
  don't need it, and search is really a "Librarian"-stage AI feature
  per the product spec's AI roadmap, not a Phase 4 concern

### Phase 5 — Polish & Hardening

- Decide real scope for the "Today's Focus" and "Observatory"
  placeholder widgets, or explicitly defer to v0.3
- Add tests around the storage layer, given how much depends on it

---

## Working Agreements

- **One phase at a time.** Each phase is built, verified working in a
  real browser, and reviewed before the next one starts.
- **Non-programmer owner.** Implementation details (library choices,
  file structure, refactors) default to Claude's judgment.
  Product/UX/creative decisions and anything affecting real saved data
  wait for explicit approval — see CLAUDE.md.
- **Real data lives here.** This is a daily-use personal tool, not a
  demo. Never reset or restructure localStorage without confirming
  first.
