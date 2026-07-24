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

**v0.3** — Planned (theme: *Context*). Not started; begins after v0.2
Phase 5 ships and gets some real daily use.

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

- Replace the "Today's Focus" and "Observatory" placeholder widgets
  with a single **Daily Briefing** panel — the container only, not
  yet curating anything (see v0.3 Phase 2 below)
- Decide Observatory's fate: it doesn't survive as a separate concept.
  Live weather/astronomy is Imported Context (external data) and is
  out of scope here — see v0.3's Explicit Non-Goals
- Add tests around the storage layer, given how much depends on it
- Finish documentation updates for v0.2 as a whole

**Note on Daily Briefing spanning two phases:** Phase 5 builds the
shell — it exists, it shows the spotlighted Mission/Project, it has a
place for recommendations. It does not curate anything yet. v0.3
Phase 2 is what makes it actually derive and surface insights. This
is a deliberate split, not two attempts at the same thing.

---

## v0.3 — Context

Not AI. Not automation. Not integrations. **Context.**

The objective of v0.3 is to make Northstar understand the
relationships that already exist inside the user's information. See
[ARCHITECTURE.md](ARCHITECTURE.md) Section 2 ("Context Over Recall")
for the principle this theme is built on.

**Product goal:** by the end of v0.3, opening any Mission, Project, or
Note should naturally answer "what else is related to this?" The
emphasis is on exposing relationships that already exist in the data
model (Project→Mission, Note→Mission/Project) — not on inventing new
entity types.

### Phase 1 — Contextual Navigation

- Detail views for Missions, Projects, and Notes — the app is
  currently list-only; there's no route to open a single Mission and
  see what's linked to it
- Mission detail: linked Projects, linked Notes
- Project detail: parent Mission, linked Notes, task checklist
- Note detail (or inline expansion): linked Mission, linked Project
- This phase establishes the shared relation-query layer ("everything
  linked to X") that Phase 2's derived recommendations reuse — that's
  the technical reason this phase comes first, not just narrative
  ordering

### Phase 2 — Daily Briefing

- Fills the container Phase 5 built with actual curation: spotlighted
  Mission/Project, derived recommendations, recent progress, recent
  activity
- Recommendations are deterministic — no LLM, no external services.
  Examples: a stalled Mission, an inactive Project, recently updated
  work, unfinished tasks
- Built entirely from **Owned Context** (data Northstar holds — Mission,
  Project, Notes) and **Derived Context** (local, deterministic
  inferences over that data — "untouched for 12 days", "three Projects
  point to this Mission"). No **Imported Context** (weather, calendar,
  or any external service) — see Explicit Non-Goals

### Phase 3 — Information Hierarchy & UX Polish

Improve presentation without increasing complexity. Every screen
should answer a clear question:

- Dashboard → What deserves my attention today?
- Mission → Why does this matter?
- Project → What should I do next?
- Knowledge → What do I already know?
- Finished → What have I accomplished?
- Settings → How do I configure Northstar?

If a page can't answer its question clearly, it's either carrying too
much responsibility or doesn't need to exist yet.

### Explicit Non-Goals

v0.3 will intentionally not include:

- LLM integration
- External APIs — weather, calendar sync, email, GitHub, etc.
- Speculative entity types (Assets, People, Places) that don't yet
  solve a real, current problem

These remain future possibilities, not v0.3 objectives. When an
external integration is actually built, its boundary should be
designed around that real integration — not guessed at generically
ahead of time.

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
- **Documentation Convergence.** Docs get periodically tightened, not
  just expanded. When a decision changes or a section goes stale,
  prefer editing what exists over adding a new document.
