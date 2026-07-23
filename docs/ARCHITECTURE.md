# Northstar — Architecture Specification

## Version

v0.1 — Foundation Architecture (updated in v0.2 Phase 1 — see Section 15)

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
- Hand-written CSS (Tailwind was originally planned here; adoption is
  deferred — see ROADMAP.md Phase 3. Styling is being incrementally
  prepared for a token-based theme system instead of being migrated to
  a new framework mid-foundation.)

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

## Current (as of v0.2 Phase 1)

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
│   │   └── Dashboard.tsx  (single page; no routing yet)
│   │
│   ├── models/      (Mission, Project — typed data shapes)
│   ├── services/    (storage.ts — versioned localStorage layer)
│   ├── hooks/        (useCollection — CRUD over a model collection)
│   ├── utils/         (id.ts)
│   └── data/           (seed data used on first run)
│
├── package.json
└── README.md
```

## Target (once Phase 2 — Navigation & Modules — lands)

```
northstar/
├── src/
│   ├── components/
│   │   ├── common/
│   │   ├── layout/
│   │   ├── navigation/
│   │   └── widgets/
│   │
│   ├── pages/
│   │   ├── Dashboard/
│   │   ├── Missions/
│   │   ├── Projects/
│   │   ├── Knowledge/
│   │   └── Settings/
│   │
│   ├── models/
│   ├── services/
│   ├── themes/
│   ├── utils/
│   └── data/
```

Themes (`src/themes/`) arrive with Phase 3.

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

Each theme should define:

- Background
- Surface Colors
- Text Colors
- Accent Colors
- Warning Colors
- Success Colors
- Typography
- Border Radius
- Shadows

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

# 15. v0.2 Phase 1 — Implementation Notes

Phase 1 (data foundation) is complete. This section records what was
actually built, as a concrete first instance of Section 11's Data
Migration Strategy and Section 6's data model.

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

## Known Gaps Going Into Phase 2

- No routing — `Dashboard.tsx` is the only page.
- Completed missions currently live in a "Recently Completed" section
  on the Dashboard, not a dedicated route — the sidebar's "Missions" /
  "Projects" / "Knowledge" links are still non-functional placeholders.
- `Project.tasks` exists in the data model with no editing UI yet.
- Styling is unchanged hand-written CSS; no theme tokens yet.
