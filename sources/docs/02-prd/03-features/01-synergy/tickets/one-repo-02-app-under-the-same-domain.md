---
publish: true
id: prd.synergy.one-repo.ticket-02
title: The App Under the Same Domain
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

The design handover puts the App at `ossidekick.com/app`, served by Next.js on Vercel while the public site is static on Cloudflare. What are the ways to route `/app/*` to Vercel (a Cloudflare Worker or redirect rule proxying to Vercel, Vercel serving both, others), and what does each cost in latency, money, caching, cookies and auth redirects? Compare them with `app.ossidekick.com`, which needs only DNS. Next.js `basePath: '/app'` and the Supabase redirect URLs change with the choice.
