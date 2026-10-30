---
publish: true
id: decision.technical.synergy-store-choices
created: 2026-10-30
kind: decision
version: 1.0.0
tags:
   - decision
   - technical
   - architecture-decision
   - synergy
   - postgresql
status: accepted
applies_to:
   - "[[02-prd/03-features/01-synergy/07.prd.features.synergy.foundations]]"
   - "[[02-prd/03-features/01-synergy/06.prd.features.synergy.search-and-backlinks]]"
---

Four smaller choices about Synergy's store (Pratik, 2026-10-30).

## List links stay in the one `relationships` table

A list header has no `to`; each member has `parent_id`, its own `to`, a position and its own snapshot, and repeats the header's `from` (held equal by the composite foreign key `(parent_id, from_id) → (id, from_id)`). Every member is therefore a complete source-to-target edge, so backlinks, staleness, the delete block and the cycle check are one query each with no list-specific branch. A mention of a list points at its header. **Revisit** if more than one or two queries need a list-specific branch.

## Cycle check: a recursive query under a per-user lock

Creating a reference runs one recursive query over reference links from the new target, looking for the source, after taking `pg_advisory_xact_lock` on the user inside the write's transaction. There is no depth cap, because a cap would let longer loops through. The link picker runs the same query in reverse to grey out targets that would close a loop. A closure table only if a test on a large synthetic graph (a Phase 3 task) shows the query is too slow.

## Search: one central index until body search

MVP search covers titles and metadata, which all live in the entity index, so a per-provider search model adds nothing yet. Full-text search with the `simple` configuration plus `pg_trgm` on the display name (typos and partial words), and exact tag matches through the tag tables ([[02-prd/03-features/01-synergy/research/07-search-across-modules|research 07]]). Revisit when body-text search or the Phase 6 embeddings arrive.

## Outbox: 90-day retention, no cold storage

The outbox carries change events for later readers (notifications, Factory automations, cache warming, reindexing). Lasting history lives in the version log and the actor and reason fields, so an event is deleted 90 days after every reader has processed it. Nothing reads the outbox in Phase 3 and one user's rows are small, so the pruning job arrives with the first reader.
