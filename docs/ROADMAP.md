# Northstar — Roadmap

This tracks phase-by-phase progress toward v0.2 and beyond. For the
enduring product vision, see [PRODUCT_SPEC.md](PRODUCT_SPEC.md). For
how it's actually built, see [ARCHITECTURE.md](ARCHITECTURE.md).

---

## Current Status

**v0.1** — Shipped (foundation: dashboard, mission tracking, local
storage, professional dark UI).

**v0.2** — In progress. Phase 1 complete, Phase 2 next.

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

### Phase 2 — Navigation & Modules — Next

- Add client-side routing
- Build Missions / Projects / Knowledge / Settings as real pages, per
  the target structure in ARCHITECTURE.md
- Make the Sidebar's nav links functional, with active-route styling
- Ship a dedicated "Finished" page for completed missions (currently a
  temporary section on the Dashboard)

### Phase 3 — Theme System

- Extract hardcoded colors/spacing from `index.css` into theme
  tokens / CSS variables
- Revisit the Tailwind decision now that there's a token system to
  migrate onto (or not)
- No new themes yet — just make "Operator Observatory" swappable in
  principle

### Phase 4 — Projects & Knowledge Modules

- Task-list UI for Projects (`tasks[]` already exists in the data
  model, unexposed)
- Build the Knowledge/Notes module (not yet started)
- Reaches full v0.1 product scope: Dashboard + Missions + Projects +
  Notes

### Phase 5 — Polish & Hardening

- Decide real scope for the "Today's Focus" and "Observatory"
  placeholder widgets, or explicitly defer to v0.3
- Add tests around the storage layer, given how much depends on it
- Resolve the Tailwind question for good; update ARCHITECTURE.md to
  match reality

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
