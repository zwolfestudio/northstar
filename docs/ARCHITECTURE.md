# Northstar — Architecture Specification

## Version

v0.1 — Foundation Architecture (updated through v0.2 Phase 3 — see Section 15)

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

## Current (as of v0.2 Phase 3)

```
northstar/

├── docs/
│
├── public/
│
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── cards/      (MissionCard, ProjectCard)
│   │   └── layout/      (Sidebar)
│   │
│   ├── pages/
│   │   ├── Dashboard.tsx    (summary view)
│   │   ├── Missions.tsx     (full Mission add/edit/complete)
│   │   ├── Projects.tsx
│   │   ├── Finished.tsx     (completed Missions + Projects)
│   │   ├── Knowledge.tsx    (placeholder)
│   │   └── Settings.tsx     (placeholder)
│   │
│   ├── models/      (Mission, Project — typed data shapes)
│   ├── services/    (storage.ts — versioned localStorage layer)
│   ├── hooks/        (useCollection, useMissions, useProjects, useTrackedItems)
│   ├── themes/        (operator-observatory.css — CSS custom properties)
│   ├── utils/         (id.ts)
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

## User

Represents the owner of the system.

Future versions may support multiple users.

---

## Mission

Represents a meaningful long-term objective.

Implemented in `src/models/mission.ts`. Fields:

- `id` — stable identifier, generated once, never reused
- `title`
- `category`
- `description` (optional)
- `status` — `Planning | Active | On Hold | Completed`
- `progress` — 0-100
- `priority` — `Low | Medium | High | Critical`
- `nextAction` (optional)
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

## Known Gaps Going Into Phase 4

- `Project.tasks` exists in the data model with no editing UI yet.
- Knowledge and Settings are placeholders with no real data model or
  functionality.
- Warning/Success colors and Shadows are documented theme categories
  with no values yet — add them when a feature needs them.
