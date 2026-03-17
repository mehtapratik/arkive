# The Arkive

A static blog built with [Astro](https://astro.build), deployed on [Cloudflare Pages](https://pages.cloudflare.com) at **arkive.blog**.

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Output is in `dist/` (used by Cloudflare Pages).

## Deploy to Cloudflare Pages (arkive.blog)

Deploys automatically through Github actions when pushed on `main` branch.

## Project layout

- `src/pages/` — Astro pages and routes
- `src/content/blog/` — Blog posts (MD/MDX)
- `src/layouts/` — Layouts
- `src/components/` — Shared components
- `public/` — Static assets
