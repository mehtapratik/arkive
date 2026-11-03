---
publish: true
id: prd.synergy.one-repo.ticket-04
title: "Lesson 0: the Import"
created: 2026-11-03
kind: plan
type: grilling
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

What exactly does Lesson 0 do, in what order, and what does Pratik learn from each step? It covers rewriting Arkive's history with `git filter-repo` (`sources/docs` to `content/docs`, `sources/writings` to `content/writings`, the rest to `apps/site`), merging it into Sidekick with unrelated histories, and the root config commits that keep CI green: lockfile, `.prettierignore`, the `AGENTS.md` symlink, removing `setup-docs`, and rewriting the written `docs/` paths. It also turns the site into a workspace app (`@sidekick/site`, pnpm instead of npm, Turbo) and runs the privacy and datum gates in CI. Which of these belong in Lesson 0, and which wait for a later lesson? What check ends the lesson?
