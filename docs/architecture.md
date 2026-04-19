# Architecture

## Intent

`profile-links-starter` is a config-first Nuxt starter for publishing a single profile links site with:

- one primary landing page with a hero and filterable directory
- reusable embed routes
- crawlable legal pages
- optional announcement and template-preview chrome
- static-friendly SEO and AI-facing discovery output
- a low-friction GitHub Pages deployment path

The architecture favors predictable customization over feature depth.
Fork owners should be able to replace content without rewriting the application layer.

## Core Principles

- Content lives in `config/`, not in Vue components.
- Pages stay thin and consume resolved data from composables.
- Derived metadata and URLs are centralized so deployment rules stay consistent.
- Public routes are static-friendly and easy to host on GitHub Pages.
- The starter remains intentionally single-language.

## System Overview

| Area | Responsibility |
| --- | --- |
| `config/site.json` | Site identity, language, canonical behavior, discovery metadata, announcement state, template-preview mode, and deploy settings |
| `config/profile.json` | Profile identity, bio, avatar behavior, and hero facts |
| `config/links.json` | Directory filters and link inventory for the homepage and embeds |
| `config/ui.json` | Shared labels and view-mode copy |
| `config/legal/*.json` | Direct legal page and modal content |
| `config/llms.json` | Optional AI-facing enrichment for `llms.txt` |
| `types/config.ts` | Typed contract for the editable JSON model |
| `composables/useSiteData.ts` | Normalizes config, resolves base-path and avatar behavior, and derives runtime-ready site data |
| `composables/useSiteSeo.ts` | Builds canonical URLs, share image URLs, and social metadata inputs |
| `composables/useLinkCollection.ts` | Handles filtering, embed query parsing, and color overrides |
| `composables/useResolvedLegalActions.ts` | Resolves legal action links, including client-only protected email actions |
| `components/LinkDirectoryRow.vue` and `components/LinkTile.vue` | Presentational building blocks for the list and tile views |
| `components/SiteAnnouncement.vue` and `components/TemplateModeBackButton.vue` | Optional shell chrome driven by `config/site.json` |
| `pages/index.vue` | Composition layer for the homepage, directory view toggle, structured data, and legal modal flow |
| `pages/embed/*.vue` | Embeddable list and tile surfaces with query-driven filtering and styling |
| `pages/[document].vue` | Direct legal document routes backed by shared legal config |

## Runtime Flow

1. JSON files from `config/` are loaded into the application through typed imports.
2. `useSiteData()` normalizes values such as URLs, avatar sources, announcement state, template mode, and legal document structure.
3. Route components consume the resolved data and focus on presentation.
4. `useSiteSeo()` derives canonical URLs, social preview values, keywords, and structured metadata inputs from the resolved site state.
5. Specialized composables handle route-specific behavior such as embed filtering and protected legal contact actions.

## Route Model

| Route | Purpose |
| --- | --- |
| `/` | Primary profile and link directory experience |
| `/embed/list` | Embeddable compact list view |
| `/embed/tiles` | Embeddable tile grid view |
| `/:document` | Direct legal pages for `contact`, `gtc`, `privacy`, `license`, and `impressum` |

The embed routes are intentionally `noindex, nofollow`.
They are distribution surfaces, not canonical destination pages.

## Embed Contract

The current embed implementation reads query parameters directly from the route:

- `tags` filters links by tag values
- `with` controls container width in `rem`
- `col` controls tile column count on `/embed/tiles`
- `accent`, `itemBg`, `itemBorder`, `text`, `muted`, and `iconBg` override embed color tokens

This contract should stay backward compatible unless there is a strong reason to break it.
If the query surface changes, the docs and examples must be updated in the same change.

## SEO And Legal Model

- Site-level SEO settings originate in `config/site.json`.
- Profile and link data contribute to homepage JSON-LD for `Person`, `WebSite`, `ItemList`, and optional `FAQPage`.
- `config/llms.json` adds optional AI-facing sections for `llms.txt`.
- Public discovery artifacts include `robots.txt`, `sitemap.xml`, and `llms.txt`.
- Legal content is stored as separate JSON documents so each page can be linked and indexed directly.
- Protected legal email actions are resolved client-side to avoid publishing plain addresses in static markup.

## Change Guidelines

- Add new editable content to `config/` and `types/config.ts` before wiring it into pages.
- Prefer expanding composables over adding page-local transformation logic.
- Keep route components presentation-oriented.
- Treat deployment, canonical URL logic, and SEO output as architecture concerns, not page-level details.
- Update `docs/user-stories.md` and `docs/tasks.md` when a change adds or alters a public capability.
