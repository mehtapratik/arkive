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

### Option A: Git integration (recommended)

1. Push this repo to GitHub (or GitLab).
2. In [Cloudflare Dashboard](https://dash.cloudflare.com) → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
3. Select the repo and configure:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Root directory:** leave empty (project root)
   - **Environment variables:** add any needed (e.g. `NODE_VERSION = 20` if you want a specific Node version).
4. Deploy. Your site will be live at `https://<project-name>.pages.dev`.
5. **Custom domain:** In the Pages project → **Custom domains** → **Set up a custom domain** → enter `arkive.blog` (and optionally `www.arkive.blog`). Since the domain is on Cloudflare, DNS is managed there; Cloudflare will add the required records for you. SSL is automatic.

### Option B: Wrangler CLI

1. Install Wrangler: `npm install -g wrangler` (or use `npx wrangler`).
2. Log in: `npx wrangler login`.
3. Build and deploy:
   ```bash
   npm run build
   npx wrangler pages deploy dist --project-name=arkive
   ```
4. Attach the custom domain in the dashboard: **Workers & Pages** → **arkive** → **Custom domains** → add `arkive.blog`.

### Custom domain (arkive.blog) checklist

- Domain is registered with Cloudflare (you’re already set).
- In the Pages project, add **arkive.blog** (and **www.arkive.blog** if you want).
- Cloudflare will create the DNS records; no manual DNS changes needed if the domain is on the same Cloudflare account.
- HTTPS is provisioned automatically.

## Project layout

- `src/pages/` — Astro pages and routes
- `src/content/blog/` — Blog posts (MD/MDX)
- `src/layouts/` — Layouts
- `src/components/` — Shared components
- `public/` — Static assets
- `wrangler.toml` — Cloudflare Pages config (build output: `dist`)
