---
publish: true
id: system-design.non-functional.code-quality-checks.eslint.tsup
title: tsup
created: 2026-09-19
updated: 2026-11-01
kind: spec
version: 1.1.0
tags:
   - system-design
   - code-quality-check
   - eslint
---

**D41** `decision` #eslint #tooling: The ESLint plugin package compiles with `tsup`, because Node must load compiled CommonJS at lint time.

**What we chose:** `tsup` to compile `packages/eslint-plugin-sidekick` instead of running `tsc` directly.

**Why:** ESLint plugins must be loaded by Node.js at lint time. ESLint cannot load `.ts` files — it needs compiled `.js`. `tsup` compiles the plugin to ESM (the package is `"type": "module"`) with declarations in one command (`tsup src/index.ts --format esm --dts`), and doesn't require a separate tsconfig for the emit target. It is simpler and produces the right output format.

**Note:** This is the only place in the repo that uses `tsup`. All other packages are compiled by their consumers (Next.js, or the test runner).

## Decision History

- 2026-09-19 · accepted · ESLint Rules to Use tsup
