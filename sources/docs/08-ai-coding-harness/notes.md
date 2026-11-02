---
publish: true
id: harness.notes
title: Notes
created: 2026-09-19
kind: guidance
version: 1.0.0
tags:
   - ai-coding-harness
   - agent-guidance
   - nextjs
   - eslint
   - pnpm
   - css
---

## 1. pnpm approve-build exceptions

pnpm approve-builds exceptions

Three packages in Sidekick run install scripts (native compilation or binary download):

1. **`esbuild`**: platform binary used by `tsx` and `tsup`.
2. **`sharp`**: Next.js image optimization. Compiles C++ bindings for fast image processing.
3. **`unrs-resolver`**: used internally by ESLint plugins. Also compiles native code.

All are legitimate, widely-used packages. Approving them is safe. The allowlist is `allowBuilds` in `pnpm-workspace.yaml`:

```yaml
allowBuilds:
   esbuild: true
   sharp: true
   unrs-resolver: true
```

Run `pnpm approve-builds` at the repo root to add a new package. The workspace has one install context, so there is nothing to approve inside `apps/web`.

## Copies

- Never hardcode a user-visible string in a source file. Always import from `packages/copy`.
- Strings that are purely structural (HTML, CSS class names, internal identifiers) are not "copy" and do not need to live here.
- Technical error messages logged to the server console (not shown to users) are not copy.
