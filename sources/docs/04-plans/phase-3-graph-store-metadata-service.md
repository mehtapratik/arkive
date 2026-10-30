---
publish: true
id: plan.phase-3-graph-store-metadata-service
created: 2026-09-19
updated: 2026-10-24
kind: plan
version: 1.0.1
tags:
   - plan
   - living-plan
   - phase-3
   - api-guard
   - rls
   - postgresql
   - api
   - offline
   - graph
status: planned
depends_on:
   - "[[04-plans/phase-1-1-db-level-rls-soft-delete-enforcement-complete]]"
   - "[[04-plans/phase-2-core-infrastructure-api-guard-feature-system-complete]]"
---

> **Milestone:** The cross-feature relationship and metadata layer is live (architecture §5.3). Any entity can be linked to any other entity and tagged — the "power of synergies" substrate every module builds on. This is also the proof-of-architecture vertical: schema → migration → RLS → repository → guarded API.
> **Learning payoff:** Graph modeling in relational databases, recursive CTEs, polymorphic references, designing a core service that stays feature-agnostic.

| #   | Task                                                                                                                                      | Complexity | Learning |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------- | ---------- | -------- |
| 3.1 | Add `entityType` registration to `FeatureManifest` in `packages/features-registry` — the registry becomes the entity-type ledger          | 🟡         | 📦       |
| 3.2 | Define `edges` schema in `packages/core` — `id`, `userId`, `fromId`, `fromType`, `toId`, `toType`, `relation`, timestamps (syncable)      | 🔴         | 🗄️       |
| 3.3 | Define `tags` and `entity_tags` schemas in `packages/core` (syncable)                                                                     | 🟡         | 🗄️       |
| 3.4 | Migration: RLS (combined user-isolation + soft-delete pattern from Phase 1.1) + trigger bindings on all three tables                      | 🔴         | 🔐 🗄️    |
| 3.5 | Implement `GraphRepository` in `packages/core` — the ONLY access path: `link()`, `unlink()`, `neighbors()`, `tag()`, `untag()`, `byTag()` | 🔴         | 🗄️       |
| 3.6 | Implement traversal query with a recursive CTE — e.g., `related(entityId, depth)`                                                         | 🔴         | 🗄️       |
| 3.7 | API routes `/api/graph/*` and `/api/tags/*` using `withApiGuard`                                                                          | 🟡         | 🧩 🔐    |
| 3.8 | Validate `fromType`/`toType` against registered entity types at the repository boundary                                                   | 🟡         | 📦       |
| 3.9 | Manually test: create edges/tags via API, verify RLS isolation and soft-delete behavior                                                   | 🟢         |          |

**Phase 3 Exit Criteria:** Entities can be linked and tagged through guarded APIs. `GraphRepository` is the sole access path. Entity types are registered in the feature registry. All graph data is user-isolated and soft-deletable.

> [!note]
> **No graph database.** This is a graph _pattern_ on plain Postgres — sufficient at MVP scale. If Sidekick grows to hundreds/thousands of users, `GraphRepository` is the swap boundary for a dedicated graph engine. See architecture §5.3.

---

## Handover from system design

> [!note]
> The task table above predates the Synergy PRD and is rewritten as lessons after the system-design session. These items come out of that session and must become tasks.

- **Platform layer** ([[06-decisions/technical/platform-layer|decision]], [[03-system-design/non-functional/monorepo/dependency-flow|dependency flow]] 1.2.0). Create `packages/platform/synergy`. Add `packages/platform/*` to `pnpm-workspace.yaml`. Add the `platform` element type to `eslint.config.js` above the `packages/*` catch-all, with policies: app, registry, feature and ops may import platform; platform may import only foundation; platform packages may not import each other. Prove the rule through `pnpm lint` inside a package, with one allowed and one refused import.
- **Per-package migrations.** `pnpm db:migrate` runs `core`, then platform, then features and ops, each with its own Drizzle config and migrations table.
- **`provider`, not `module`,** in the entity index schema and every API field.
