---
publish: true
id: system-design.functional-design.synergy.overview
title: "Synergy: system design"
created: 2026-10-30
kind: spec
version: 1.0.0
tags:
   - system-design
   - synergy
applies_to:
   - "[[02-prd/03-features/01-synergy/spec]]"
   - "[[04-plans/phase-3-graph-store-metadata-service]]"
---

How Synergy is built. The PRD and [[02-prd/03-features/01-synergy/spec|spec]] say what it does; this page and the decisions it links say where each piece lives and how the pieces meet. Terms follow [[06-decisions/technical/mentions-and-link-lifetime|Mentions and link lifetime]].

## Packages

| Package                                        | Holds                                                                                                                                                                    |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `packages/core` (foundation)                   | DB client and RLS (`withRLS`), auth (`resolveApiCaller`), `withApiGuard`, entitlements, logging. Unchanged by Synergy.                                                   |
| `packages/platform/synergy` (platform)         | Synergy's tables and migrations, its repository (the only access path), the rules, the resolver and renderer contracts, the save call, and the Rich Live Link component. |
| `packages/ui` (foundation)                     | Design-system primitives the component builds on; later the editor and the Lexicon matcher.                                                                              |
| Providers (`packages/ops` now, features later) | Their own entity tables, plus one registration per linkable type.                                                                                                        |
| `packages/features-registry` or the app        | Assembles every provider's registrations into the map Synergy receives as data.                                                                                          |
| `apps/web`                                     | Guarded API routes and the playground.                                                                                                                                   |

See [[06-decisions/technical/platform-layer|Platform layer]] and [[03-system-design/non-functional/monorepo/dependency-flow|Dependency flow]].

## Type registration

Each linkable type is registered by the package that provides it, never listed in Synergy:

```ts
interface LinkableTypeRegistration {
   provider: string; // the registering package, e.g. 'ops', 'taxila'
   type: string; // e.g. 'note', 'datum', 'tweet'
   entitlement: string; // feature key whose entitlement gates it, e.g. 'sandbox'
   resolve: Resolver; // batched, async
   render: Renderer; // batched, async: render(links) => Promise<ReactNode>
}
```

The registry or the app builds the map and passes it to Synergy, so neither `core` nor Synergy imports a provider ([[02-prd/03-features/01-synergy/research/05-resolver-contract-home|research 05]], option A). Feature flags are separate and come later.

## Tables (Synergy's migrations)

Every table: client-generated UUIDs, `user_id`, `created_at`, `updated_at`, soft delete, provenance (actor kind: person, system, agent or API key; actor id; reason), and RLS comparing `user_id = nullif(current_setting('app.current_user_id', true), '')::uuid`.

- **`entity_index`**: id, provider, type, display name, optional title, status (`active`, `deprecated`, `superseded`, `deleted`), version, revision, `edited_at`, `deleted_at`. No external-reference columns ([[06-decisions/technical/capture-external-content|Capture external content]]).
- **`version_log`**: entity, version, optional change note, actor, time.
- **`relationships`**: from, to (empty on a list header), parent and position (list members), optional label, optional type, version and revision snapshot, `to_anchor_id` and `to_anchor_quote` (empty for a whole-entity target), `cited`, `mentioned`, tombstone (actor and reason). Composite FK `(parent_id, from_id) → (id, from_id)`; `from` never changes ([[06-decisions/technical/synergy-store-choices|Store choices]]).
- **`relation_types`**: name, inverse name, kind (reference or association), status, system flag; seeded with the starter vocabulary.
- **`tags`** and **`tag_applications`**: as in the spec, with the format check constraint.
- **`outbox`**: event type, subject, actor, payload, time; 90-day retention after every reader has processed it.
- **Idempotency keys** for creates.

Indexes: `to_id` (backlinks), `(to_id, to_anchor_id)` (passage check), `from_id`, `(parent_id, position)`, tag applications by tag, index rows by owner and status, trigram and `simple` full-text on display names.

## Write path

A provider saves inside one `withRLS` transaction: it writes its own row, then calls Synergy in the same transaction.

- **Create:** register the entity's index row (id, provider, type, display name).
- **Save content:** base revision, revision or version, optional change note, plus three lists the provider gets by comparing ids in the old and new content: anchors removed, links newly mentioned, links no longer mentioned. Synergy checks the revision (`stale_revision`), refuses `passage_referenced`, removes associations into removed passages, sets `mentioned`, tombstones links with neither `cited` nor `mentioned`, bumps the counters and `edited_at`, and writes the outbox event ([[06-decisions/technical/anchors-in-content|Anchors in content]]).
- **Link:** create a relationship with a snapshot of the target's counters; a reference takes the per-user lock and runs the cycle check; a passage target asks the target's provider to add the anchor; `supersedes` marks the target after the confirmation step.
- **Status, tags, cite and uncite:** metadata writes that bump no counter.
- **Delete:** refused with `delete_blocked` while a reference points at the entity; otherwise soft-delete, which tombstones its outgoing links. Erasure overrides.

## Read path

1. The guarded route reads the caller's relationships joined to the target index rows: one query per page, cursor-paged.
2. For each link it decides the state on the server, before any renderer runs: locked (the type's `entitlement` isn't enabled for the caller), deleted, redacted (later), then the marks (edited, changed) from the snapshot.
3. Inline and minimal mentions need nothing more. Card and preview mentions are grouped by provider and resolved with one batched call each, through the render cache keyed by (entity, revision, display type).
4. The response is the resolved link of the spec: relationship, target index fields, state, marks, and render data when asked for. An entity's read response also carries the roll-up of its outgoing references.

## Rich Live Link

Lives in Synergy and builds on `ui` primitives. It takes the resolved links and the caller's credentials as inputs, owns the frame and every state, and calls the registered renderers in batches. The display type belongs to each mention.

## Testing

Integration tests through the guarded API are the main seam; the component is tested in Vitest browser mode with MSW ([[03-system-design/non-functional/testing/testing-layers|Testing layers]]).
