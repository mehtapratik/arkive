---
publish: true
id: decision.technical.mentions-and-link-lifetime
created: 2026-10-30
kind: decision
version: 1.0.0
tags:
   - decision
   - technical
   - architecture-decision
   - synergy
status: accepted
applies_to:
   - "[[02-prd/03-features/01-synergy/02.prd.features.synergy.relationships]]"
   - "[[02-prd/03-features/01-synergy/05.prd.features.synergy.rich-live-link]]"
---

## What

**Terms** (Pratik, 2026-10-30):

- **Link** (relationship): the stored connection from a source to one target, or to several ordered targets (a list link). Its **kind** comes from its type: reference or association; untyped is a reference. Its **target** is a whole entity or a passage ([[06-decisions/technical/anchors-in-content|Anchors in content]]).
- **Mention:** a place in the source or the target that shows a link. Either side may mention a link any number of times.
   - **Direct mention:** shows the link itself, as minimal, inline, card or preview. Without a label, a minimal direct mention shows the target's title.
   - **Alias mention:** the author's own words carry the link.
   - **Cited mention:** the link is held outside the content, in a field (such as `related-to`) or a links panel. A field is a view of the source's cited links of that type.

**Rules:**

- **Display type belongs to the mention, not the link.** The source and the target can show the same link in different ways. This overrides the PRD, where the author picked one display type per link.
- **A link lives while its source mentions it in any way.** It is soft-deleted (tombstone with actor and reason) when the source drops its last direct, alias or cited mention. Target mentions never keep a link alive. Synergy tracks this with two booleans on the link: `cited` (set and cleared by a field, the links panel or the API) and `mentioned` (at least one direct or alias mention in the source's content, maintained by the provider's save call). A link created through the API without a content mention is a cited one.
- **Only references carry the rules about change.** Staleness dots, the delete block, passage protection and the cycle check apply to references. Associations never show a dot, never block, may cycle, and are removed with a passage they point into. Lifetime, anchors, locked and deleted states and backlinks work the same for both kinds.
- **Roll-up on the source.** An entity's title shows a dot when any of its outgoing references needs attention (red for changed, deprecated, superseded or deleted; standard for edited), with the links as the reason. It is computed on read, one indexed query, and ships in the Phase 3 API.

## Why

- Without the cited kind, a link held only by a field would be deleted when the last content mention went, or would linger as an orphan when every mention was gone. One rule over three kinds of mention covers both.
- Per-mention display types let each side of a link show it the way its own text needs.
- A link held only in a field would otherwise never tell its source that the target moved.
