# Northstar — Roadmap

This tracks phase-by-phase progress toward v0.2 and beyond. For the
enduring product vision, see [PRODUCT_SPEC.md](PRODUCT_SPEC.md). For
how it's actually built, see [ARCHITECTURE.md](ARCHITECTURE.md).

---

## Current Status

**v0.1** — Shipped (foundation: dashboard, mission tracking, local
storage, professional dark UI).

**v0.2** — ✅ Shipped (2026-07-23). All five phases complete.

**v0.3** — In progress (theme: *Context*). v0.3.1, v0.3.2, and v0.3.3
complete — v0.3 is now fully shipped. v0.4 (Knowledge Layer) isn't
planned yet; see the note below the Explicit Non-Goals section.

**v0.2.5** — ✅ Shipped (2026-07-24). "Identity Foundation" — trimmed
from a much larger original proposal. Character + Values only;
Principles/Interests/Experiences deliberately deferred.

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

### Phase 5 — Polish & Hardening — ✅ Complete (2026-07-23)

- "Today's Focus" and "Observatory" placeholder widgets replaced with
  a single **Daily Briefing** card. It's the shell only — a
  placeholder explaining what's coming, not yet curating anything
  (that's v0.3 Phase 2)
- Observatory doesn't survive as a separate concept. The Daily
  Briefing placeholder says why: weather/astronomy is Imported
  Context, and Northstar doesn't reach outside itself yet
- Dashboard is down to three cards (Tracked Mission, Tracked Project,
  Daily Briefing) instead of four — comfortably inside the 1920×1080
  no-scroll budget from Phase 3, with room to spare
- Vitest added (`npm test`) — the project's first automated tests.
  Chose it over Jest for zero extra config with an existing Vite
  project; no `jsdom`/`happy-dom` dependency added since the storage
  layer only touches `localStorage`'s handful of methods, which a
  15-line in-memory stub covers
- 8 tests covering `src/services/storage.ts`: collection/value
  round-trips, seed persistence on first read (direct regression test
  for the Phase 3 bug), legacy bare-array upgrade, `normalize`
  application, and corrupt-JSON fallback
- **Storage key rename**: `northstar-dashboard-tracked` →
  `northstar-spotlight`, agreed during v0.3 planning — the old name
  described who happened to read it (the Dashboard) rather than what
  it is (Missions/Projects pages write to it too). Includes a
  one-time migration so nobody's current tracked selection is lost
  silently
- Documentation updated to close out v0.2 (this entry)

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

### v0.3.1 — Contextual Navigation — ✅ Complete (2026-07-23)

- New `/missions/:id` and `/projects/:id` detail routes — the app was
  list-only before this; there was no way to open a single Mission and
  see what's linked to it
- Mission detail: linked Projects, linked Notes
- Project detail: parent Mission, linked Notes, task checklist (the
  full `ProjectCard`, not a read-only summary — editable in place)
- Notes didn't get their own detail route — a Note's full body is
  already visible in its list card, so there was nothing a detail page
  would add. Instead, a Note's Mission/Project labels became clickable
  links to *their* detail pages
- `src/utils/relations.ts`: the shared relation-query layer
  (`getProjectsForMission`, `getNotesForMission`, `getNotesForProject`,
  `getMissionForProject`) — small pure functions, not a query engine.
  6 tests. This is what v0.3.2's derived recommendations will reuse
- Every Mission/Project card gained a "View details →" link, and every
  Mission label shown elsewhere (Project cards, Notes) is now a link
  to that Mission's detail page, same for Project labels

---

## v0.2.5 — Identity Foundation — ✅ Complete (2026-07-24)

Originally proposed as a much larger "Personal Context Layer"
(Character, Values, Principles, Interests, Experiences, a Dashboard
widget, a UX polish pass — six phases, bigger than all of v0.2
combined). Trimmed after review to just the two phases below;
Principles, Interests, and Experiences were deliberately deferred
rather than modeled before Character and Values had been used for
real. See PRODUCT_SPEC.md Section 6 for the reasoning behind each
deferred concept.

### Phase 1 — Character Foundation

- New `/character` page: a singleton `Character` profile — name,
  current chapter, short description — via `loadValue`/`saveValue`
  (same primitive as `useTrackedItems`), not `useCollection`, since
  there's exactly one
- Seeded empty, not with placeholder content; the page shows a setup
  prompt until filled in
- Core Values shipped as an empty-state placeholder in this phase, not
  a throwaway field on `Character` — avoided building something
  Phase 2 would immediately discard
- `preferences` dropped entirely — no concrete use case, so nothing
  was built to guess at one

### Phase 2 — Values Expansion

- `Value` as a real collection (`id`, `title`, `description`,
  `importance`, timestamps) — a peer of Mission/Project/Note, not
  nested inside Character
- Full add/edit/delete on the Character page, replacing the Phase 1
  placeholder
- `importance` is a two-tier `Core | Supporting` scale — the original
  spec only ever gave one example ("Priority: Core"), so a longer
  taxonomy would have been guessing

### v0.3.2 — Daily Briefing — ✅ Complete (2026-07-24)

- Dashboard's Daily Briefing card fills the shell Phase 5 built, with
  real deterministic curation: Focus (the spotlighted Mission),
  Suggested (one recommendation), Recent Growth (most recently
  completed Mission)
- `src/utils/briefing.ts`: `getSuggestion` returns one recommendation
  in priority order — revisit the focus Mission if it's gone stale
  (7+ days untouched), else a linked Project with open tasks, else any
  other stalled Mission, else `null` ("nothing stalled"). `getRecentGrowth`
  finds the most recently completed Mission. 9 tests
- Built entirely from **Owned Context** (Mission/Project data) and
  **Derived Context** (staleness, open-task counts — local, deterministic).
  No **Imported Context** — no weather, no calendar, nothing external
- **Bug found and fixed while building this**: `useCollection`'s
  `updateItem` never stamped `updatedAt` unless a caller explicitly
  included it — Notes and Values did, Missions and Projects didn't, so
  Increase Progress / task toggles / Mark Complete left `updatedAt`
  frozen at creation time. Since staleness is entirely computed from
  `updatedAt`, this would have made every recommendation wrong. Fixed
  centrally in the hook (auto-stamps on every update, unless the
  caller already provided one) rather than patching each call site
- Recent Growth deliberately doesn't include Projects — `Project` has
  no `completedAt` field yet, and approximating one from `updatedAt`
  would be guessing. Small, real future enhancement, not done here

### v0.3.3 — Information Hierarchy & UX Polish — ✅ Complete (2026-07-24)

Confirmed (not "Knowledge Connections" — the app doesn't have enough
data density yet for graph-style connection browsing to be more than
a line between three boxes). Knowledge Connections becomes a future
**v0.4 — Knowledge Layer** milestone instead, once Character → Values
→ Missions → Projects → Notes has more real data in it to connect.

Goal: **make Northstar feel like an application, not a collection of
pages.**

- **Richer entity pages** — surfaced `Mission.description` and
  `Mission.nextAction`, both modeled since Phase 1 and never shown or
  editable anywhere until now. `Project.description` was deliberately
  left alone: `Project.notes` already covers the same "free text about
  this project" role, so adding a second overlapping field would have
  been redundant, not richer. Both new Mission fields are gated behind
  `!readOnly` (same convention as `Project.notes`), so the Dashboard's
  compact tracked-item spotlight doesn't grow
- **Timeline** — Created/Last Updated (and Completed, if set) on both
  detail pages, via a small `formatDate` helper. Nothing before this
  showed either timestamp anywhere in the UI
- **Breadcrumb navigation** — `Dashboard › Missions › Build Northstar`
  on both detail pages, replacing the plain "← back to list" link
- **Universal linking** — Notes' "Linked Notes" entries on Mission/
  Project detail pages now deep-link to the specific note
  (`/knowledge#note-<id>`) instead of the general Knowledge list, via
  a hash-anchor scroll + 2-second highlight. Closes the loop v0.3.1
  started (Notes linking out to Missions/Projects, but not the reverse)
- **Basic search** — new `/search` page, matches substrings across
  Mission (title/category/description/nextAction), Project (title/
  notes), and Note (title/body), grouped results, links straight to
  the right detail page or highlighted note. 7 tests
  (`src/utils/search.ts`)

Every screen still answers a clear question:

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

## v0.4 — Knowledge Layer (not planned yet)

A name, not a plan: once v0.3 ships and Character → Values → Missions
→ Projects → Notes has real data density from actual use, "how are
these connected" becomes a question worth building a graph-style
answer to. Deliberately not scoped further than that — per Working
Agreements below, this gets planned when it's next, not now.

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
