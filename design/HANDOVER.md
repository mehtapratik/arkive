# Sidekick public site: design handover

**For:** Claude Code, working in the `arkive` repo (Astro).
**Design canvas (owner access):** https://claude.ai/code/artifact/2732ff87-c06f-46c4-8978-aefe4427b9f5
**Status:** design approved for build, except the items under §12 *Open decisions*. Where this file and the canvas disagree, this file wins; where this file is silent, stop and ask the owner.

## What is in this folder

| File | What it is |
| --- | --- |
| `HANDOVER.md` | This spec. Start here. |
| `tokens.css` | Colour, type and theme tokens. Copy into the new stylesheet as-is. |
| `plates.mjs` | Seeded illustration generator (pure JS, no DOM). Build-time only. Exports `motifFor`, `buildPlate` and `renderPlateSVG`, plus the motif maps. Its `buildPlate` body matches the canvas `Plate` artboard exactly. |
| `reference/*.dc.html` | The canvas artboards, one per screen. They use the canvas's template syntax (`{{hole}}`, `<sc-for>`, `<dc-import>`), so treat them as **visual and markup reference**, not as code to ship. Measurements, copy and structure are authoritative. |

---

## 1. Intent

Merge arkive.blog into one public site for **Sidekick**: the home page introduces the project, publishes its Writings and Docs, and hands visitors off to the App. The Arkive name is retired, and arkive.blog will 301 to the new domain (domain not chosen yet; use a config constant).

**Keep:** the content pipeline (`src/lib/vault.mjs`, `entries.ts`, `tree.ts`, `src/plugins/*`), the `publish: true` gate, the privacy check, retired-entry handling, slugs/URLs and "As of" (`updated ?? created`). **Replace:** all chrome, `public/arkive.css`, `public/arkive.js`, fonts and icons, and the Shiki colours. The vocabulary in `CONTEXT.md` (Sidekick, App, Public site, Entry, Writing, Doc, About) still applies.

**`CLAUDE.md` house rules that change** (update the file as part of this work):

- "Ship `arkive.css`, `arkive.js`, fonts, icons and `shiki-themes.mjs` as given" no longer holds. They are replaced.
- "Peacock colours links inside `.prose` only" no longer holds. The accent now also marks the primary button, the current tree item, the "up next" tile and highlights in the plates.
- "No hero images or illustrations in the chrome" no longer holds. Generated plates (§7) are part of the design.
- "No media queries for layout": see §12, open decision 1.
- Redirects: `/writings/`, `/docs/` and `/tags/` are now real pages. Remove their redirects to `/`. `/index/` still redirects to `/`.
- The Index popover and its keyboard shortcuts are gone. The only shortcuts left are `/` to open search and `Esc` to close dialogs.

## 2. Decisions log

| Area | Decision |
| --- | --- |
| Name | The wordmark and logo say only **Sidekick**, set as type in Sentient 700. No glyph. |
| Sections | Writings · Docs · About · App. About opens the Writing *Project Sidekick - A Bird’s Eye View* directly. Nothing to author. |
| App | Lives at `/app` on the same domain. The header link reads **App** with an ↗ icon and goes to `/app`. The app handles sign-in redirects. |
| Docs navigation | A folder tree mirrors the vault. Every folder URL renders a **generated** listing (no hand-written category pages), with breadcrumbs everywhere. |
| Principles, Motivations | Ordinary folders under Docs. |
| Architectural Overview | Stays in Writings. |
| Retired entries | Unchanged: built and keep their URL, but left out of every list. |
| Tags | Tag chips link to generated `/tags/<tag>/` pages. No all-tags index page (not requested). |
| Table of contents | None on any page. |
| Folder descriptions | Optional. Rendered from `_index.md` in the folder when present (§6). |
| Search | Site-wide, client-side. The only kept Arkive interaction. |
| Theme | System / Light / Dark, defaulting to System. Desktop has a three-button control in the header; on phones it lives in the menu. |
| Look | Spartan and text-first, on cool blue-grey neutrals with a single peacock accent. No warm hues. |
| Type | Sentient for body and the wordmark. **SN Pro** for every heading and all interface text. **LXGW WenKai Mono TC** for all monospace. General Sans and IBM Plex Mono are retired. |
| Weights | Nothing below 500. SN Pro looks best at medium. |
| Illustrations | Seeded "scientific plates", one motif per kind, deterministic from the entry `id` (§7). |
| Home progress | "Where things stand" uses **numbered tiles** (option A). |

## 3. Routes

| Route | Page | Reference |
| --- | --- | --- |
| `/` | Home | `Main`, `MobileHome` |
| `/writings/` | Writings index | `Writings` |
| `/writings/<slug>/` | Writing | `Writing` |
| `/docs/` | Docs index (generated) | `Docs` |
| `/docs/<folder>/…/` | Folder listing (generated) | `DocFolder` |
| `/docs/<…>/<slug>/` | Doc | `Doc`, `MobileDoc`, `MobileDocPanel` |
| `/tags/<tag>/` | Tag page (generated) | `Tag` |
| `/app/…` | The App (Next.js); not part of this build | — |
| `/rss.xml`, `/sitemap.xml`, `/404` | Keep, restyled with the tokens | — |

Docs URLs drop the numeric folder prefixes, as they do today (`/docs/decisions/technical/no-utility-styles/`). Keep every existing URL.

## 4. Global chrome

### Header (desktop, `Main` and every page)

- **Container:** `max-width: 1180px`, padding `14px 32px`, bottom hairline `--rule`.
- **Row contents, in order:**
  1. The **Sidekick** wordmark, Sentient 26px/700, linking to `/`.
  2. Nav in SN Pro 15px/600, `gap: 28px`, with `aria-current="page"` underlined (2px, offset .45em): Writings, Docs, About, App ↗.
  3. A **Search** button: 44px tall, 10px radius, hairline border, magnifier icon, label "Search" and a `/` kbd hint. It opens the search dialog.
  4. The **theme control**: a segmented group of three 38×36 icon buttons (system, sun, moon) with `aria-pressed` and `aria-label`s. The pressed button is filled `--text` with `--bg` icon.
- Which section is current: Writing and About pages mark About when the entry is the About essay, otherwise Writings. Docs and Tag pages mark Docs only for docs pages; Tag pages mark nothing.

### Header (phones, `MobileDoc`, `MobileHome`)

- **Row contents:** the wordmark (24px) on the left, then two 44×44 icon buttons: Search, and **Menu** (three lines, `aria-label="Menu"`, no visible caption).
- **Hidden on phones:** the nav links and the theme control. Both move into the menu.
- **Menu (`MobileMenu`):** a full-screen dialog (native `<dialog>` or `popover`).
  - **Top bar:** the wordmark and a Close button (×, 44px).
  - **Links:** large SN Pro 26px/600 links, 60px rows divided by hairlines: Writings, Docs, About, App ↗, Search.
  - **Bottom:** a "Theme" group of three labelled buttons (System / Light / Dark, 44px tall), and the licence line.

### Footer

The hairline top, **Sidekick** (Sentient 19/700) on the left, and on the right "Built in the open. Writings and docs licensed CC BY-NC 4.0." in SN Pro 14, `--muted`.

### Theme control behaviour

- **Storage:** write `data-theme="auto|light|dark"` on `<html>` and persist it in `localStorage["sidekick-theme"]`. A tiny inline `<head>` script applies the stored value before first paint, so there is no flash.
- **Auto:** follows `prefers-color-scheme`, as in `tokens.css`.

### Search (`Search`)

- **Dialog:** native `<dialog>`, top-aligned (72px from the top), 680px wide, over a scrim.
- **Input:** search input with a visually hidden label "Search writings and docs" and a 44px close button.
- **Results:** grouped under "Docs" and "Writings" headings. Each row shows the title (Sentient 18) and a meta line (SN Pro 13 `--muted`): folder path · kind · status, or "tagged <x>" when the match was on a tag.
- **Highlighting:** query matches are highlighted in `--accent` at 600 weight (`<mark>` with a transparent background). The selected row uses the `--tint` background.
- **Footer:** "Enter open · Esc close · Searches titles, tags and kinds".
- **Index:** titles, tags, kinds and folder path for every listed entry, generated at build time. Opened by `/` or the header button.

## 5. Pages

### Home (`Main`, `MobileHome`)

1. **Hero.**
   - **Layout:** a flex row with `flex-wrap: wrap-reverse`, `gap: 40px 56px`, `align-items: center`. Text column `flex: 1 1 420px`, plate column `flex: 1 1 380px`. On desktop the plate sits **right of** the text; when the row wraps, `wrap-reverse` puts the plate **above** the heading. The hero must never show the plate below the copy.
   - **Copy** (approved trim of the Bird’s Eye View definition):
     - H1 (SN Pro 40/1.15/600): "Sidekick is an AI-powered Personal Operating System."
     - Lead (Sentient 20/1.5, `--muted`, max 520px): "Calibrated to my lifestyle and workflows to help me become a better version of myself. Built in the open, written as it happens."
     - Buttons: primary **Read the introduction →** (to the About essay) and secondary **Browse the docs**, both 48px tall. On phones they stack full-width.
   - **Plate:** `Companion orbit`, seed `"sidekick"`, `width` (viewBox) 480, container 300px tall (200px on phones). Caption in mono 12, `--muted`: "Fig. 0 — Sidekick, a companion in orbit".
2. **Where things stand** (hairline above).
   - **Heading:** h2 "Where things stand", with a link "Living implementation plan" on the right.
   - **Sentence:** "{done} of {total} milestones complete. Up next: <link to the next phase's plan>."
   - **Tiles:** `ol.tiles` with `grid-template-columns: repeat(auto-fit, minmax(36px, 1fr))` and `gap: 6px`. That gives one row on desktop and wraps on phones.
     - Each tile is square (`aspect-ratio: 1`), 8px radius, centred mono label at 700 weight.
     - Fills only, no strokes: done = `--text` fill with `--bg` label; up next = `--accent` fill with `--bg` label; planned = `--rule` fill with `--muted` label; deferred = 135° hatch of `--rule` and `--subtle` with `--muted` label.
     - Labels are the phase numbers (`0 1 1.1 P2 2 … 12`). Each tile also carries a visually hidden full label, e.g. "Phase 3 — Graph store and metadata service: Up next".
   - **Legend:** 14px swatches with the words Complete, Up next, Planned, Deferred (optional).
   - **Full list:** a `<details>` "All phases" listing number, title and status.
   - Data rules are in §6.
3. **Latest writings** and **Recently updated docs** side by side: a grid with `repeat(auto-fit, minmax(min(460px,100%),1fr))` and `gap: 48px 64px`.
   - **Writings:** the 3 newest by As of. Each shows an h3 title (22/600), the deck or description (Sentient 17 `--muted`), then the date in mono and reading time. "All writings" link on the right.
   - **Docs:** the 6 newest by As of. Each shows an h3 title (19/600), then the folder path ("PRD › Value proposition"), kind and date in mono. "All docs" link on the right.

### Writings index (`Writings`)

The h1 "Writings", a count line ("3 writings, newest first"), then a list of articles, each with:

- an h2 title (28/600)
- the deck or description (Sentient 18 `--muted`)
- a meta line: date in mono, "kind, for audience", "N words, about M min"

### Writing (`Writing`, shown dark)

- **Column:** a 700px column, centred.
- **Order:**
  1. Plate band (`Margin`, seed = entry `id`, 200px tall).
  2. "Writings" back-link.
  3. h1 (46/1.12/500).
  4. Deck (21 `--muted`).
  5. Meta table (§5.1).
  6. Prose: Sentient 20/1.65, h2 28/600 in SN Pro, blockquote with a 2px left rule in italic 22. Inline code uses `--subtle` and the mono font.
  7. Previous/Next pager by As of.
- **Code block:** `figure.code`.
  - **Header** (`figcaption`): the language label in mono 12 `--muted`, and a **Copy** button (36px tall, icon + label).
  - **Body:** `pre` with `--subtle` background, 10px radius, mono 14.5/1.65 and horizontal scroll.
  - **Colouring:** Shiki with the monochrome token colours in `tokens.css` (`--code-*`): keywords and types in peacock, strings and numbers in a blue-grey, comments in `--muted` italic. Rewrite `src/shiki-themes.mjs` accordingly.

#### 5.1 Meta table (Writings and Docs)

A two-column table in SN Pro 14, with a hairline on each row. Rows appear in this order, and a row is shown only when its data exists:

- **As of:** mono date.
- **Version:** mono.
- **Kind:** `"{kind}, for {audience}"` when `audience` exists, otherwise `"{kind}"`.
- **Status:** Docs only, when `status` exists, prefixed with a check icon for accepted or completed.
- **Length:** "N words, about M min".
- **Tags:** pill chips (`--subtle` fill, hairline border, 12.5px) that link to the tag page.

### Docs index (`Docs`)

- **Layout:** sidebar tree on the left (§5.2) and main content on the right. The row wraps: aside `flex: 1 1 240px; max-width: 272px`, main `flex: 999 1 560px; min-width: 0`.
- **Main:**
  - h1 "Docs", then the count line "{n} entries in {k} sections, straight from the project vault".
  - A list of top-level sections. Each shows its title (h2 23/600, linked), "{count} entries · updated {date}", and its subfolders as inline muted links.

### Folder listing (`DocFolder`)

1. Breadcrumbs.
2. h1 (folder title).
3. Optional description from `_index.md` (Sentient 19 `--muted`).
4. Count line: "{n} entries: {f} folders, {p} pages here".
5. **Folders:** a grid of bordered link tiles (`repeat(auto-fit, minmax(min(200px,100%),1fr))`), each showing the name and a mono count.
6. **Pages:** a table with columns Title, Kind, Status, As of. Show "—" when status is missing. The table scrolls horizontally on phones.

### Doc (`Doc`)

- **Main column:** max 700px.
- **Order:**
  1. Breadcrumbs.
  2. Plate band (motif by kind, seed = entry `id`, 160px tall on desktop, 120px on phones; Element table plates pass the entry title as `label`).
  3. h1 (44/1.12/500).
  4. Meta table.
  5. Prose (Sentient 19/1.65).
  6. "Previous in {folder}" / "Next in {folder}" pager, ordered by title A–Z within the folder.

#### 5.2 Sidebar tree

- **Header:** a small caps label "DOCS" linking to `/docs/`.
- **Rows:** SN Pro 14, 6px radius, a chevron icon (right when collapsed, down when open) and the recursive listed count in mono 11.5 on the right. Nested lists are indented 13px with a hairline on the left.
- **What it shows:**
  - All top-level sections, always.
  - The ancestors of the current page, expanded.
  - **Pages only for the folder that contains the current doc.** Other folders show subfolders only, so System Design does not dump 94 rows.
- **Current page:** `aria-current="page"`, `--tint` background, 600 weight.
- **On phones:** the tree is replaced by a **Contents** button (44px, icon + label) plus the breadcrumb trail, in a bar under the header. The button opens the tree as a **left slide-over** (`MobileDocPanel`): 332px wide, with a scrim, a "Contents" title, a 44px close button and 40px rows. Use `popover` or `<dialog>`; it should work without JS where possible.

### Tag page (`Tag`)

- **Heading:** a breadcrumb "Tags", then the h1 "Tagged `css`" (the tag in mono), then the count line "6 entries: 0 writings, 6 docs".
- **List:** every listed entry with that tag, Writings first, then Docs by As of. Each shows the title (Sentient 20/600) and a meta line: path, kind (· status) and date.

## 6. Generated data rules

- **Folder title:** drop the numeric prefix (`03-system-design` becomes "System Design"). Use title case with the existing acronym dictionary in `vault.mjs` (PRD, AI, UX, MVP, CSS, API, CLI, PWA, RAG …).
- **Counts:** the number of listed entries in the folder and all its subfolders. A folder with 0 listed entries is not shown (today that is `09-notes`).
- **Ordering:**
  - Folders by numeric prefix, then name.
  - Pages within a folder A–Z by title.
  - The Writings index, the home page lists and tag pages by As of, newest first.
- **Breadcrumbs:** Docs › each ancestor folder. The current page is not repeated.
- **Folder description:** if `<folder>/_index.md` exists, render its body under the h1. It is never listed as an entry or included in counts, and it is still subject to the privacy check.
- **Milestones (home tiles):** built from `sources/docs/04-plans/`.
  - **Which files:** every `phase-*.md` and `pre-*.md`, excluding the `-complete` files. Add a milestone for any `*-complete.md` that has no matching plan file (today: `phase-1-1-…-complete`, `pre-2-…-complete`).
  - **Status:**
    - *done*: `status` is `completed` or `complete`, or a `-complete` sibling exists.
    - *deferred*: `status: deferred`.
    - *next*: the first milestone that is neither done nor deferred.
    - *planned*: everything else.
  - **Order:** by phase number. `pre-N` sorts directly before `N`; `1.1` sorts after `1`.
  - **Short label:** the number, with `Pre-2` shown as `P2`. The title comes from frontmatter `title`, or else is derived from the file name.
  - **Expected output today:** 15 milestones, 5 done, Phase 3 (Graph store and metadata service) up next, 11 and 12 deferred. Verify against the files.
- **Reading time and word counts:** as today.

## 7. Plates (seeded illustrations)

- **API:** `renderPlateSVG(motif, seed, { width, label, dots })` returns an inline SVG string. Render it at build time inside `<figure class="plate" aria-hidden="true">`.
- **Figure styling:** `--surface` background, a 1px `--rule` border, 4–10px radius, `overflow: hidden`, and a fixed height (see §5).
- **Colours:** the SVG uses `var(--muted)`, `var(--accent)`, `var(--tint)`, `var(--surface)`, `var(--text)`, `var(--mono)` and `var(--serif)`, so it follows the theme with no extra work.
- **Seed:** the entry's frontmatter `id`; the home hero uses `"sidekick"`. The same id always produces the same drawing.
- **Motif map:**

  | Kind / place | Motif |
  | --- | --- |
  | spec | Exploded view |
  | prd | Phyllotaxis |
  | decision | Bifurcation |
  | plan | Gantt |
  | guidance | Radar |
  | glossary | **Element table** (pass the title as `label`) |
  | opportunity | Scatter |
  | every Writing | **Margin** |
  | home hero | **Companion orbit** (`width: 480`) |
  | any other kind | Drift (fallback) |

- **Reserve motifs:** kept in `plates.mjs` but not mapped: Lexicon (wanted for a future kind; it also takes `label`), Lattice, Contour, Frame stack, Requirement grid, Branch.
- **Rules:** the plates are decorative (`aria-hidden`). No captions on entry bands; only the home hero has a caption.
- **Check:** render every motif once in dev at both widths and both themes. The labels must not clip at the band heights above.

## 8. Tokens and type

Use `tokens.css` as the source of truth: colours (light and dark), families, the type scale table at the bottom, and code token colours.

- **Self-hosting:** self-host all fonts (no third-party requests).
- **LXGW WenKai Mono TC subsetting:** this is a CJK font, so it must be **subset** to Latin plus the symbols the plates use, or it will weigh megabytes.
- **Spacing:** page gutters are 32px on desktop and 16px on phones. Section padding is 56–72px vertical; hairlines separate sections.

## 9. Accessibility

- **Real elements:** use `<a href>` for navigation, `<button>` for actions and `<dialog>`/`popover` for overlays. Icon-only buttons carry an `aria-label`.
- **Targets:** at least 44px for every control on phones.
- **Contrast:** every text pair passes 4.5:1; check the `--muted` and `--accent` values in both themes. `--faint` is for decoration only.
- **Phase tiles:** each tile carries its full label in visually hidden text, because colour plus a short number is not enough.
- **Focus:** a 2px `--accent` outline, offset 2px, everywhere.
- **Motion:** none planned. If any is added, respect `prefers-reduced-motion`.

## 10. JavaScript budget

These are the only client scripts:

- The theme pre-paint snippet and the theme control.
- Search (index plus dialog).
- The code Copy button.
- Opening and closing the menu and the Contents panel, only where `popover` cannot do it alone.

Everything else is static HTML from Astro.

## 11. App integration

The public site (static Astro, today on Cloudflare) and the App (Next.js on Vercel) share one domain, with the App under `/app`. This needs:

- `basePath: '/app'` in the Next.js app.
- Supabase auth redirect URLs updated to `/app/...`.
- A routing layer that sends `/app/*` to the Next deployment.

The routing mechanism is not decided (§12). Until it is, the App link is just `/app`.

## 12. Open decisions (ask the owner before building these)

1. **Phone breakpoint.** Hiding the nav and theme control behind the menu, and swapping the tree for the Contents button, needs one width query. This contradicts the current "no layout media queries" rule. Proposed: allow a single `@media (max-width: 40rem)` (or an equivalent container query on the header). The owner has not confirmed.
2. **`/app` routing** across Cloudflare and Vercel (§11).
3. **Domain** for the merged site, and the arkive.blog → new-domain 301 map.
4. Whether **RSS** stays (it exists today but wasn't discussed).
5. The **phase tiles** list is derived from file names. Confirm the derived titles read well, or add `title:` frontmatter to the plan files.

## 13. Acceptance checklist

- [ ] Every existing published URL still resolves. `/writings/`, `/docs/` and `/tags/<tag>/` are real pages.
- [ ] Header, footer and theme behave as in §4. The theme persists across pages with no flash.
- [ ] The home hero shows the plate right of the text on desktop and above the heading on a 390px screen.
- [ ] Tiles read "5 of 15 complete, up next Phase 3" from real data.
- [ ] Docs tree, breadcrumbs, folder listings and counts are all generated. No folder page is hand-written.
- [ ] Doc and Writing meta tables follow §5.1, with "kind, for audience" when audience exists.
- [ ] The plate for each entry kind matches §7 and is stable across builds. Glossary uses Element table with the entry title.
- [ ] Code blocks use LXGW WenKai Mono TC (including inside `<code>`) with the monochrome token colours and a working Copy button.
- [ ] No General Sans or IBM Plex Mono remains. No font weight is below 500. Headings are SN Pro; body is Sentient.
- [ ] The privacy check still passes. Retired entries are absent from lists but still reachable.
- [ ] Lighthouse accessibility is 100 on Home, Writing, Doc and Folder pages in both themes.

## 14. Reference artboards

| Artboard | Shows |
| --- | --- |
| `Main` / `MobileHome` | Home on desktop and phone |
| `Writings` | Writings index |
| `Writing` | About essay in dark mode, with the Margin plate and a code block |
| `Docs` | Docs index |
| `DocFolder` | Non-functional folder listing |
| `Doc` / `MobileDoc` | A decision page (No utility styles) with the Bifurcation plate |
| `MobileDocPanel` | Phone Contents slide-over |
| `MobileMenu` | Phone menu with the theme control |
| `Tag` | Tagged `css` |
| `Search` | Search dialog with the query "rls" (the results are illustrative) |
| `Illustrations` / `Plate` | Every motif with real seeds; the Plate component |
| `StatusOptions`, `TypeOptions` | Record of the options considered (A tiles chosen; SN Pro headings with Sentient body chosen) |
