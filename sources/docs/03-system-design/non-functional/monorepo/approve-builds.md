---
publish: true
id: system-design.non-functional.monorepo.approve-builds
title: Approve Builds
created: 2026-09-19
kind: spec
version: 1.0.0
tags:
   - system-design
   - monorepo
   - nextjs
   - pnpm
---

Sidekick to maintain an `allowBuilds` allowlist in `pnpm-workspace.yaml` to prevent any package from running a rogue script during or after installation. (pnpm 11 and later ignore the old `onlyBuiltDependencies` field in `package.json`.)

As of this writing, three packages genuinely need script execution after install: `esbuild`, `sharp` and `unrs-resolver`. All are legitimate, widely-used packages, so approving them is safe:

```yaml
allowBuilds:
   esbuild: true
   sharp: true
   unrs-resolver: true
```

The workspace has one install context (the root `node_modules`), so this single allowlist covers `apps/web` too. Run `pnpm approve-builds` at the root when a new package needs approval.
