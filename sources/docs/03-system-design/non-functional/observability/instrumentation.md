---
publish: true
id: system-design.non-functional.observability.instrumentation
title: Instrumentation
created: 2026-09-19
kind: spec
version: 1.0.0
tags:
   - system-design
   - observability
   - vercel
   - embedding
---

## MVP: structured JSON logs via Vercel dashboard

Primitive but sufficient for a single-developer MVP. Vercel streams function logs to a dashboard in real time. Application code does not call `console.*` (ESLint `no-console` is an error). It calls `logEvent`, which writes one JSON line per typed event (`api.request`, `api.denied`, and so on) to the console, so Vercel shows it. New event types are added to the `LogEvent` union in `packages/core/src/observability/log.ts`.

Log structured objects rather than concatenated strings: they are easier to filter and grep, and will migrate cleanly to a proper logging service later.

---

## Post-MVP: Sentry or equivalent

After MVP ships, integrate a structured error tracking service (Sentry is the most common). Benefits over `console.*`:

- Error deduplication (one alert for 1000 identical errors, not 1000 alerts)
- Stack trace capture with source maps
- User context attached to errors
- Alert routing and on-call integrations
- Performance monitoring
  The transition from `console.*` to Sentry is low-friction — it's an additive change, not a rewrite.
