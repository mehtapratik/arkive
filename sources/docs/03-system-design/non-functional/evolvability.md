---
publish: true
id: system-design.non-functional.evolvability
title: Evolvability
created: 2026-09-19
kind: spec
version: 1.0.0
tags:
   - system-design
   - rls
   - offline
---

Requirements will keep evolving as clarity grows. To keep technical architecture and implementation plan flexible…

1. **`02-prd/` is product truth** — the high-level PRD plus per-feature PRDs written before each feature starts.
2. **`03-system-design` describes mechanisms and invariants, not feature lists.** Implementation changes based on feature specs should only affect `03-system-design/functional-design` (system design translation of product requirements) — never the security, RLS, repository, or offline sections.
3. Changes flow one way: PRD → `03-system-design/functional-design` → the phase plans in `04-phases`.
