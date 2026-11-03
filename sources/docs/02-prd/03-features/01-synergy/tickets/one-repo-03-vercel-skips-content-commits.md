---
publish: true
id: prd.synergy.one-repo.ticket-03
title: Vercel Skips Content-Only Commits
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

Once docs live beside the code, most commits touch only `content/`. How does Vercel skip building `apps/web` for them (Ignored Build Step, `turbo-ignore`, or project settings), and does it still build when a shared package the app depends on changes?
