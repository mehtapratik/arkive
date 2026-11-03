---
publish: true
id: prd.synergy.one-repo.ticket-01
title: Cloudflare Pages for a Monorepo
created: 2026-11-03
kind: plan
type: research
blocked_by: []
status: open
assignee:
tags:
   - prd
   - synergy
   - one-repo
   - wayfinder
---

## Question

What does Cloudflare Pages need to build `apps/site/` from the Sidekick monorepo? Can the existing `arkive` Pages project switch its Git repository, or must a new project be created and the custom domain moved? How do the root directory and build watch paths work so only `apps/site/`, `content/` and the lockfile trigger a build? Does the build image run pnpm 12 from `packageManager` (Corepack), and how does `NODE_VERSION` interact with `.nvmrc`? The current project sets `NODE_VERSION=22.12.0` and `SIDEKICK_BRANCH=main`.
