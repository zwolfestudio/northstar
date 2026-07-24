# Northstar — Architecture Specification

## Version

v0.1 — Foundation Architecture (v0.2 shipped in full; v0.3 shipped in full; v0.2.5 shipped — see Section 15)

## Status

See [ROADMAP.md](ROADMAP.md) for current phase status. This document
describes the architecture as actually implemented as of the most
recent phase; historical sections that are still aspirational (not yet
built) are marked as such.

---

# 1. Purpose

This document defines the technical foundation of Northstar.

Northstar is designed as a personal command center that connects:

- Projects
- Knowledge
- Goals
- Assets
- Future AI assistance

The initial objective is to build a simple, professional web application with a clean architecture that can grow over time without requiring major redesigns.

The architecture should prioritize maintainability, modularity, and long-term scalability over short-term convenience.

---

# 2. Guiding Principles

## Local First

Northstar begins as a local-first application.

Benefits:

- Free to use
- Offline capable
- Private by default
- No external dependencies
- Simpler development

Future versions should support cloud synchronization without changing the underlying data model.

---

## Modular Design

Every major feature should exist as an independent module.

Examples include:

- Dashboard
- Missions
- Projects
- Knowledge
- Assets
- AI
- Weather
- Astronomy
- Settings

Adding or removing one module should not require rewriting others.

---

## Separation of Concerns

Northstar should clearly separate:

- User Interface
- Business Logic
- Data Management
- External Services
- AI Systems

Each layer should have a well-defined responsibility.

---

## Data Before Intelligence

Northstar's intelligence depends on the quality of its information.

Development order:

1. Store information
2. Organize information
3. Connect information
4. Retrieve information
5. Analyze information
6. Assist the user

AI should consume structured information—not replace it.

---

## Context Over Recall

Northstar should never require the user to remember where information lives. Relationships should surface naturally through context.

Added in v0.3 planning, but it retroactively explains decisions made well before it was written down: why a Project links back to its Mission, why a Note can tag a Mission and a Project at once, why the Dashboard spotlights one tracked item instead of listing everything, and why AI (Sections 8-9) is sequenced to reason over structured context rather than compensate for its absence. When a future feature is unclear, this is the question to ask: does it help the right information surface on its own, or does it just add another place to go looking?

---

# 3. High-Level Architecture

```
                     Northstar

                  User Interface
                         │
                         ▼
               Application Logic
                         │
                         ▼
              Data Management Layer
                         │
                         ▼
                Local Data Storage
                         │
                         ▼
              External Services (Future)
                         │
                         ▼
                  AI Context Layer
                         │
                         ▼
                   AI Integrations
```

---

# 4. Technology Stack

## Frontend

- React
- TypeScript
- Vite
- React Router (`react-router-dom`) — added in v0.2 Phase 2 for
  client-side routing
- Hand-written CSS, driven by CSS custom properties defined in
  `src/themes/` (see Section 10). Tailwind was originally planned here
  but was evaluated and skipped in v0.2 Phase 3 — the token system
  meets the actual goal (swappable themes) without adding a build
  dependency; see ROADMAP.md Phase 3.
- Vitest — added in v0.2 Phase 5 for the storage service test suite.
  No `jsdom`/`happy-dom`; the one module under test only touches
  `localStorage`'s handful of methods, so a small in-memory stub in
  the test file covers it without a DOM-emulation dependency.

Purpose:

- Fast development
- Responsive design
- Component-based architecture
- Maintainable codebase

---

## Version Control

Git

Hosted on GitHub.

Purpose:

- History
- Collaboration
- Backup
- Documentation
- Portfolio

---

## Initial Storage

Browser Local Storage

Future migration path:

Browser Storage → Local Database → Cloud Database

---

# 5. Project Structure

## Current (v0.2 and v0.3 shipped in full; v0.2.5 shipped)

```
northstar/

├── docs/
│
├── public/
│
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── cards/      (MissionCard, ProjectCard, NoteCard, ValueCard)
│   │   └── layout/      (Sidebar)
│   │
│   ├── pages/
│   │   ├── Dashboard.tsx       (summary view + real Daily Briefing)
│   │   ├── Search.tsx          (basic cross-entity search)
│   │   ├── Character.tsx       (identity + Core Values)
│   │   ├── Missions.tsx        (full Mission add/edit/complete)
│   │   ├── MissionDetail.tsx   (linked Projects + Notes, timeline, breadcrumb)
│   │   ├── Projects.tsx        (full Project add/edit/complete + tasks)
│   │   ├── ProjectDetail.tsx   (parent Mission + linked Notes, timeline, breadcrumb)
│   │   ├── Finished.tsx        (completed Missions + Projects)
│   │   ├── Knowledge.tsx       (full Note add/edit/delete, hash-anchor deep links)
│   │   └── Settings.tsx        (placeholder)
│   │
│   ├── models/      (Mission, Project, Note, Character, Value — typed data shapes)
│   ├── services/    (storage.ts + storage.test.ts — versioned localStorage layer)
│   ├── hooks/        (useCollection, useMissions, useProjects, useNotes, useValues,
│   │                  useCharacter, useTrackedItems)
│   ├── themes/        (operator-observatory.css — CSS custom properties)
│   ├── utils/         (id.ts, date.ts, relations.ts, briefing.ts, search.ts — each with a .test.ts)
│   └── data/           (seed data used on first run)
│
├── package.json
└── README.md
```

Routing is handled by `react-router-dom` (`BrowserRouter` in `App.tsx`,
`NavLink` in `Sidebar.tsx` for active-route highlighting).

`pages/` is currently flat files rather than the `Dashboard/`,
`Missions/`, etc. subfolders shown in the original v0.1 target
structure — each page is still a single component, so a subfolder per
page would be empty scaffolding. Revisit if a page grows internal
sub-components.

`src/themes/` now exists (Phase 3). `components/{common,navigation,widgets}/`
remains aspirational, arriving whenever a component actually needs
that categorization.

---

# 6. Core Data Model

Northstar revolves around connected information.

## Character

Represents the owner of the system — this section used to be called
"User" and say nothing more than "represents the owner of the
system." As of v0.2.5, that's implemented for real rather than left
as a stub, so the two concepts were merged into one.

A singleton, not a collection — there is exactly one, always. Backed
by `loadValue`/`saveValue` (the same storage primitive as
`useTrackedItems`), not `useCollection`. Implemented in
`src/models/character.ts`. Fields:

- `name`
- `currentChapter`
- `shortDescription`
- `updatedAt`

Seeded empty (all fields `""`); the Character page shows a setup
prompt rather than placeholder content until filled in.

Future versions may support multiple users — if that ever happens,
Character becomes per-user rather than a global singleton, but that's
a real architecture change, not assumed now.

---

## Value

Represents something the user cares about — not a task or a goal, but
what makes effort feel worthwhile. A peer collection alongside Mission/
Project/Note, not nested inside Character. Implemented in
`src/models/value.ts`. Fields:

- `id`
- `title`
- `description`
- `importance` — `Core | Supporting`
- `createdAt` / `updatedAt`

`importance` is a deliberately narrow two-tier scale. The product spec
only ever gave one example ("Priority: Core"); a longer taxonomy would
have been guessing at a shape nobody asked for.

---

## Mission

Represents a meaningful long-term objective.

Implemented in `src/models/mission.ts`. Fields:

- `id` — stable identifier, generated once, never reused
- `title`
- `category`
- `description` (optional) — editable and shown since v0.3.3; modeled
  since Phase 1 but had no UI until then
- `status` — `Planning | Active | On Hold | Completed`
- `progress` — 0-100
- `priority` — `Low | Medium | High | Critical`
- `nextAction` (optional) — same story as `description`
- `createdAt` / `updatedAt` / `completedAt` (optional) — ISO timestamps

Examples:

- Build Northstar
- Build a Staff Collection
- Learn AI Development

---

## Project

Represents a concrete effort. As of v0.2 Phase 1, the v0.1 code's
separate "Objective" concept was folded into Project — a Project can
optionally link back to the Mission it belongs to.

Implemented in `src/models/project.ts`. Fields:

- `id`
- `title`
- `missionId` (optional) — links to a Mission's `id`
- `description` (optional)
- `tasks` — `Task[]`, each `{ id, title, done }` (data model exists;
  no task-editing UI yet — see ROADMAP.md Phase 4)
- `progress` — 0-100
- `status` — `Planning | Active | On Hold | Completed`
- `notes` (optional)
- `createdAt` / `updatedAt`

Examples:

- Northstar Development
- Maple Staff Batch
- Website Redesign

---

## Note

Represents preserved knowledge.

Implemented in `src/models/note.ts`. Fields:

- `id`
- `title`
- `body` — plain text; no markdown/rich-text yet
- `missionId` (optional) — links to a Mission's `id`
- `projectId` (optional) — links to a Project's `id`
- `createdAt` / `updatedAt`

Unlike Mission and Project, Note has no `status`/`progress` — it's
information, not an objective. Seeded empty (`src/data/notes.ts`);
no placeholder notes were invented for v0.2 Phase 4.

Examples:

- Ideas
- Research
- Tutorials
- Lessons Learned
- Meeting Notes
- AI Conversations

---

## Asset (Future)

Represents a physical or digital object.

Examples:

- Staffs
- Wood Samples
- Photos
- Documents
- Tools
- Images

---

# 7. Knowledge Graph Direction

Long-term, Northstar should become a connected information system.

```
                    User
                      │
     ┌────────────────┼────────────────┐
     │                │                │
  Missions        Projects       Knowledge
     │                │                │
     │                │                │
  Progress         Assets           Notes
     │                │                │
     └────────────────┼────────────────┘
                      │
               AI Context Layer
```

Rather than isolated lists, information should become connected over time.

---

# 8. AI Architecture

AI should interact with Northstar through structured context.

Instead of:

```
User
 │
 ▼
 AI
 │
 ▼
 Answer
```

Northstar should become:

```
Northstar Data
        │
        ▼
 Context Builder
        │
        ▼
 AI Model
        │
        ▼
 Recommendations
```

This allows AI to understand:

- Current projects
- Personal goals
- Related notes
- Physical assets
- Historical decisions

---

# 9. Planned AI Progression

## Phase 1 — Librarian

Retrieve information.

Examples:

- Find notes
- Search projects
- Locate documents

---

## Phase 2 — Consultant

Use context to recommend actions.

Examples:

- Prioritize projects
- Suggest next steps
- Compare options

---

## Phase 3 — Collaborator

Create alongside the user.

Examples:

- Brainstorm ideas
- Design concepts
- Solve problems
- Draft plans

---

## Phase 4 — Assistant

Provide proactive support.

Examples:

- Daily planning
- Reminders
- Weather-aware suggestions
- Project health monitoring

---

# 10. Theme Architecture

Themes should be driven by data rather than hard-coded styles.

**Implemented in v0.2 Phase 3.** `src/themes/operator-observatory.css`
defines a `:root` block of CSS custom properties; `index.css` (the
structural/layout stylesheet) references them via `var(--token-name)`
instead of hardcoding values. A theme is a data file, per the
principle above — swapping themes means pointing at a different file
with the same variable names, not editing layout CSS.

Each theme should define:

- Background — done (`--color-bg`, `--color-bg-gradient-start`)
- Surface Colors — done (the `--color-overlay-*` scale)
- Text Colors — done (`--color-text`, `--color-text-muted`)
- Accent Colors — done (`--color-accent`, `--color-accent-bg`)
- Warning Colors — not yet defined; nothing in the UI has a warning
  state yet
- Success Colors — not yet defined; nothing in the UI has a success
  state yet
- Typography — partially done (`--font-family-base` only; per-element
  font sizes are still literal, since they're closer to a layout
  concern than a theme concern)
- Border Radius — done (`--radius-sm` through `--radius-pill`)
- Shadows — not yet defined; nothing in the UI uses a shadow yet

Spacing (padding/margin/gap) is deliberately **not** tokenized —
it's not in the category list above, and treating it as a theme
concern would conflate visual identity with layout density.

Initial theme:

Operator Observatory

Future themes:

- Solo Leveling
- Workshop
- Forest
- Sci-Fi
- Custom User Themes

---

# 11. Data Migration Strategy

Northstar should evolve without requiring users to recreate data.

Migration path:

```
Browser Storage
        │
        ▼
Local Database
        │
        ▼
Cloud Database
```

The application's data model should remain stable regardless of storage location.

---

# 12. Development Workflow

Each feature follows this process:

1. Define
2. Design
3. Build
4. Test
5. Refine
6. Document

Every significant milestone should be committed to Git with meaningful commit messages.

Documentation should evolve alongside the code.

---

# 13. v0.1 Architecture Goals

Northstar v0.1 establishes:

- Responsive web application
- Clean project structure
- Modular components
- Reusable UI
- Local data storage
- Theme framework
- Mission tracking
- Project tracking
- Notes
- Professional development workflow

It intentionally excludes:

- Cloud synchronization
- AI integrations
- Advanced analytics
- Image recognition
- Automation

These systems should be enabled by the architecture, not implemented prematurely.

---

# 14. Long-Term Vision

Northstar is intended to become a personal operating system.

A place where:

- Goals become missions
- Projects become organized workflows
- Knowledge becomes connected context
- Physical assets become searchable
- AI becomes an intelligent collaborator

The long-term value of Northstar comes from the relationships between information—not from any individual feature.

The architecture should always prioritize clarity, extensibility, and maintainability.

Every new capability should strengthen the foundation rather than complicate it.

## From Dashboard to Context Engine

*Added during v0.3 planning (2026-07-23), refining the vision above in light of what v0.2 actually built.*

Northstar is evolving into a memory and decision system, not merely a productivity application. Its long-term value comes from maintaining structured context and surfacing meaningful relationships between the user's work — future AI should reason over that context rather than replace it.

A shift is worth naming plainly: Northstar was originally conceived as "a dashboard where I organize my life." After v0.2 — the tracked-item spotlight, relational Missions/Projects/Notes, a Dashboard deliberately kept thin — it is closer to "a local-first context engine with a dashboard." The dashboard is the window; the system is the context. That happened as a consequence of individual architectural decisions, not a redesign, which is itself a sign the underlying model is sound.

The intended progression stays:

1. Build reliable data.
2. Make relationships navigable.
3. Surface deterministic insights.
4. Introduce AI as a reasoning layer over an already rich context.

Northstar should earn the ability to make intelligent recommendations through the quality of its data model and relationships, rather than relying on an LLM to compensate for missing structure. That principle should continue guiding architectural decisions beyond v0.3 — see [ROADMAP.md](ROADMAP.md) for what's actually scheduled.

---

# 15. v0.2 Implementation Notes

Phases 1 and 2 are complete. This section records what was actually
built, as a concrete first instance of Section 11's Data Migration
Strategy and Section 6's data model.

## Phase 1 — Data Foundation

## Storage Service

`src/services/storage.ts` wraps every collection saved to
`localStorage` in a `{ version, data }` envelope instead of writing
bare arrays. On load, it also recognizes the old bare-array shape
v0.1 used and transparently upgrades it — no user data was lost when
this shipped, and the same mechanism is the seam for future storage
migrations (Local Database, then Cloud Database) described in Section
11, without changing how the rest of the app reads/writes data.

## Collection Hook

`src/hooks/useCollection.ts` is a generic `add` / `update` / `remove`
hook over any `{ id: string }`-shaped collection, backed by the
storage service. Missions and Projects both use it rather than talking
to `localStorage` directly.

## Legacy Data Normalization

`normalizeMissions` in `src/models/mission.ts` backfills fields
missing on records written by pre-Phase-1 code (no `id`, no
timestamps) the first time they're loaded, then the storage service
re-saves them in the current shape. New collections (e.g. Projects)
don't need this since nothing pre-Phase-1 ever wrote them.

## Phase 2 — Navigation & Modules

Routing was added with `react-router-dom`. The Dashboard, which
previously held the full Mission list (with add/edit/complete) and
full Project list, is now a read-only summary (top 3 of each, via
`MissionCard`'s new `readOnly` prop) that links out to dedicated
`/missions` and `/projects` pages where the full functionality lives.
A `/finished` route replaced the temporary "Recently Completed"
Dashboard section. `/knowledge` and `/settings` exist as real routes
with placeholder content — deliberately minimal rather than empty
scaffolding, since there's no feature behind either yet.

`useMissions` / `useProjects` (`src/hooks/`) wrap `useCollection` with
each model's storage key/seed/normalizer, since three pages now need
the same collection setup. No shared state layer (e.g. Context) was
introduced — each page independently loads from the storage service on
mount, which stays correct because `localStorage` is the single source
of truth, not in-memory state carried across routes.

## Phase 3 (part 1) — Dashboard Tracking & Layout

The Dashboard now shows exactly one Mission and one Project instead of
a top-3 summary. Which one is "tracked" is a manual, interchangeable
choice — a "Track on Dashboard" button on `MissionCard`/`ProjectCard`
(rendered only when an `onTrack` prop is passed, i.e. on `/missions`
and `/projects`) sets it, one at a time per collection. Until
something is manually tracked, the Dashboard falls back to the first
active item.

Tracked state is a single small value, not a collection of records, so
it doesn't fit `loadCollection`/`saveCollection`. `storage.ts` gained a
parallel `loadValue`/`saveValue` pair using the same `{ version, data }`
envelope. `src/hooks/useTrackedItems.ts` wraps that for the
`{ missionId, projectId }` shape under the `northstar-dashboard-tracked`
key.

**Bug found and fixed while building this:** `src/data/missions.ts` and
`src/data/projects.ts` call `createId()` at module load, generating new
random ids every time the module re-evaluates — i.e. every page
reload. `loadCollection` only persisted a collection after its first
write (`if (!raw) return fallback` — never saved), so a collection
nobody had edited yet kept regenerating fresh ids on every reload.
Harmless as long as nothing outside the collection referenced one of
its ids — which stayed true through Phase 2, until tracking gave the
Dashboard a reason to store a mission/project id independently. Fixed
by having `loadCollection` persist the seed on first *read*, not first
write, so ids are stable from the moment a collection is first loaded.

Dashboard-specific CSS (`.dashboard-page` scope in `index.css`) tightens
card padding and heading sizes so the page fits a 1920×1080 window
without scrolling, now that it only renders two cards' worth of live
data instead of six.

## Phase 3 (part 2) — Theme Tokens

`src/themes/operator-observatory.css` defines the swappable part of
the UI as a flat list of CSS custom properties (colors, border radii,
font-family), documented in Section 10. `index.css` was rewritten to
reference `var(--token-name)` everywhere a value used to be hardcoded,
with zero visual change — verified by screenshot comparison across
every route before and after.

Doing this pass surfaced some CSS cruft, cleaned up at the same time
since every value it touched had to be looked at anyway: `.mission-card`,
`.progress-fill`, and `.priority` were each defined twice (later block
silently overriding the earlier one — harmless but confusing);
`.northstar`, `.header`, and a bare `.dashboard` selector were unused
leftovers from before routing existed; `App.css` (default Vite
template boilerplate) was never imported anywhere and was deleted.

**Tailwind**: evaluated per Section 4 and skipped, not just deferred.
The token system meets the actual goal — swappable theme identity —
without adding a build-time dependency for a solo-maintained project.

## Phase 4 — Projects & Knowledge Modules

Projects reached the same CRUD depth Missions have had since Phase 1:
`ProjectCard` gained an edit mode (title, linked Mission via a
`<select>` of all Missions, status, notes textarea), an "Increase
Progress" button, and "Mark Complete" — mirroring `MissionCard`
exactly rather than inventing a different pattern. `Projects.tsx`
gained an add-project form the same way `Missions.tsx` already had
one.

Tasks are edited inline on the card itself: a checklist of
`project.tasks` plus an "Add a task" input. Toggling/adding/removing a
task is just `onUpdate(project.id, { tasks: newArray })` — there's no
separate task collection or storage key, since tasks are embedded in
the Project record (as designed back in Phase 1).

`ProjectCard` gained a `readOnly` prop, same shape as `MissionCard`'s:
the Dashboard's tracked-project spotlight passes it to suppress the
task list and action buttons, keeping the Phase 3 no-scroll layout
intact now that a Project card can render a lot more content.

The Knowledge module is new from scratch: `Note` model, `useNotes`
hook (same `useCollection` pattern as Missions/Projects), `NoteCard`
with its own edit mode, and a real `Knowledge.tsx` replacing the
placeholder. Notes can optionally link to a Mission and/or Project via
the same `<select>` pattern used for Project→Mission linking.

## Phase 5 — Polish & Hardening (v0.2 complete)

The Dashboard's two remaining placeholders — "Today's Focus" and
"Observatory" — were replaced with one **Daily Briefing** card. It's
still a placeholder (explains what's coming, curates nothing), but
it's one card instead of two, which is also why the Dashboard now
clears its no-scroll budget (Section on Phase 3) with room to spare
rather than exactly filling it.

Vitest was added as the project's first test runner, scoped
deliberately narrow: `src/services/storage.ts` only, since that's the
module the most other code depends on and the one that's already
produced one real bug (the Phase 3 seed-id issue). No DOM-emulation
dependency (`jsdom`/`happy-dom`) — the module only calls a few
`localStorage` methods, so the test file defines a ~15-line in-memory
stand-in instead.

The Dashboard/Missions/Projects tracking mechanism was renamed:
`northstar-dashboard-tracked` → `northstar-spotlight`
(`src/hooks/useTrackedItems.ts`). The old name described the one
screen that happened to read it; three different pages write to it.
`loadTracked()` checks the new key first, falls back to the old key
and migrates it forward if found, so an existing tracked selection
isn't silently lost by the rename.

## v0.3.1 — Contextual Navigation

`/missions/:id` and `/projects/:id` are new routes (`MissionDetail.tsx`,
`ProjectDetail.tsx`) rendering the full, editable card plus "linked"
sections built from `src/utils/relations.ts` — small pure functions
(`getProjectsForMission`, `getNotesForMission`, `getNotesForProject`,
`getMissionForProject`) rather than a generic query layer, since only
four concrete lookups exist. Covered by 6 tests, same spirit as the
storage service tests from Phase 5.

Notes did not get a detail route. A Note's full body is already
visible in its list card on `/knowledge`; a detail page would show
the same information again. Instead, `NoteCard`'s Mission/Project
labels became clickable links to those entities' new detail pages —
the "note detail" requirement from the roadmap is satisfied by
linking out rather than duplicating a view.

List pages (`Missions.tsx`, `Projects.tsx`) are unchanged otherwise —
this was purely additive, not a rework of what already worked. Every
`MissionCard`/`ProjectCard` gained a "View details →" link, and every
place a Mission or Project title already appeared as a label (Project
cards showing their Mission, Notes showing their Mission/Project) that
label became a link.

## v0.2.5 — Identity Foundation

Trimmed down from an originally much larger "Personal Context Layer"
proposal (Character, Values, Principles, Interests, Experiences, a
Dashboard widget, a UX polish pass) after a review concluded that was
the largest scope ever proposed for this project — bigger than all of
v0.2. Character and Values shipped; Principles, Interests, and
Experiences were deliberately deferred (see PRODUCT_SPEC.md Section 6)
rather than modeled ahead of any real usage.

**Phase 1 — Character Foundation:** `Character` (Section 6, above) and
its page. The Core Values section shipped as an empty-state
placeholder rather than a throwaway field on `Character` — avoided
building something Phase 2 would immediately discard.

**Phase 2 — Values Expansion:** `Value` (Section 6, above) as a real
collection, replacing the placeholder with full add/edit/delete.

`/character` is a new route and sidebar entry. Section 6's old "User"
stub was folded into "Character" rather than kept as a separate,
never-implemented concept.

## v0.3.2 — Daily Briefing

`src/utils/briefing.ts` holds the recommendation logic: `getSuggestion`
(one deterministic recommendation, priority-ordered — stale focus
Mission, then a linked Project with open tasks, then any other stalled
Mission, then `null`) and `getRecentGrowth` (most recently completed
Mission). Both are plain functions over arrays already in memory — no
new storage, no new model. 9 tests, same pattern as `relations.ts`.

**Bug found and fixed while building this**: `useCollection.updateItem`
only stamped `updatedAt` when a caller's `updates` object included it.
`NoteCard`/`ValueCard` always did; `MissionCard`/`ProjectCard` never
did (Increase Progress, task toggles, Mark Complete all omitted it).
Since every staleness calculation in `briefing.ts` reads `updatedAt`,
this would have made every recommendation wrong — a Mission edited
five minutes ago could still read as "untouched for 30 days." Fixed
centrally: `updateItem` now stamps `updatedAt` on every call unless
the caller already provided one, so this class of bug can't recur at
a new call site. This tightened `useCollection`'s generic constraint
from `T extends { id: string }` to `T extends { id: string; updatedAt: string }`
— true of all four current collections (Mission, Project, Note, Value)
already, just not previously enforced.

## v0.3.3 — Information Hierarchy & UX Polish

Four small, mostly-independent changes rather than one big one:

**Richer entity pages.** `Mission.description` and `Mission.nextAction`
existed in the model since Phase 1 with zero UI. Added to
`MissionCard`'s edit form and (gated behind `!readOnly`, same
convention as `Project.notes`) its read view. `Project.description`
was deliberately *not* surfaced — `Project.notes` already fills that
role, and a second free-text field would have been redundant rather
than richer.

**Timeline.** New `src/utils/date.ts` (`formatDate`) backs a Timeline
section on both detail pages — Created / Last Updated / Completed.
Nothing showed either timestamp anywhere before this.

**Breadcrumbs.** Both detail pages went from a bare "← back to list"
link to a full `Dashboard › Missions › Build Northstar` trail.

**Universal linking.** `NoteCard`'s root element now carries
`id={note-<id>}`. `Knowledge.tsx` watches `location.hash` (via
`useLocation`, not a mount-only effect, since navigating between two
different notes doesn't remount the page) and scrolls to / highlights
the target note for 2 seconds. Mission/Project detail pages' "Linked
Notes" now link to `/knowledge#note-<id>` instead of the bare
`/knowledge` list — closes the loop v0.3.1 started (Notes could link
out to Missions/Projects, but not the reverse, precisely).

**Basic search.** New `/search` page and `src/utils/search.ts` —
plain case-insensitive substring matching across Mission (title/
category/description/nextAction), Project (title/notes), and Note
(title/body), no ranking or fuzzy matching. 7 tests. Intentionally
ahead of any knowledge-graph work: navigation alone stops scaling
once there are dozens of items, independent of whether relationships
are ever visualized as a graph.

## Known Gaps Going Into v0.4

- Settings is still a placeholder with no real functionality.
- Warning/Success colors and Shadows are documented theme categories
  with no values yet — add them when a feature needs them.
- Test coverage is narrow (pure utility functions) — no component or
  integration tests yet.
- Notes still have no detail route of their own — the hash-anchor deep
  link now gets you to the right note, which may be sufficient
  indefinitely; revisit only if it stops being.
- Principles, Interests, and Experiences remain undesigned by intent —
  see PRODUCT_SPEC.md Section 6 for the reasoning behind each.
- `Project` has no `completedAt` field, so `getRecentGrowth` only
  considers Missions. Small, real gap — not filled speculatively.
- v0.4 (Knowledge Layer) is a name, not a plan — see ROADMAP.md.
