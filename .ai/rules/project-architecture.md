# Project Architecture Rule

Status: Active

This document is the architecture guardrail for this live profile links site.

## Current Assumptions

- the project uses Nuxt, Vue, TypeScript, ESLint, and Vanilla CSS
- the primary output is a single-language personal links website built from the profile-links starter
- the project is config-first, static-friendly, and optimized for GitHub Pages deployment
- performance, accessibility, maintainability, and discoverability all matter

## Core Structure

- `config/`
  Fork-owner content, UI labels, legal content, and discovery settings live here.
- `composables/useSiteData.ts`
  Single typed loader that normalizes config into runtime-ready site, profile, link, and legal data.
- `composables/useSiteSeo.ts`
  Derived metadata, canonical URLs, share image resolution, and structured-data helpers.
- `pages/index.vue`
  Homepage with profile hero, directory modes, and homepage legal modal flow.
- `pages/[document].vue`
  Crawlable direct routes for legal documents.
- `pages/embed/badges.vue`
  Lightweight badge embed route.
- `pages/embed/list.vue`
  Lightweight list embed route.
- `pages/embed/tiles.vue`
  Lightweight tile embed route.
- `scripts/sync-static-seo.mjs`
  Generates `robots.txt`, `sitemap.xml`, `llms.txt`, and optional `CNAME`.
- `public/images/`
  Fork-owner assets such as avatar and social preview images.

## Starter Rules

1. Keep public identity, ownership-like text, and editable copy in config, not in hardcoded component strings.
2. Keep page and component logic thin. Put cross-cutting data shaping in composables and config loaders.
3. Preserve single-language and static-friendly defaults unless a user explicitly asks for broader runtime complexity.
4. Keep legal content in `config/legal/*.json` and keep the direct legal routes crawlable.
5. Keep embed routes lightweight, query-driven, and reusable.
6. Treat `config/site.json` and `config/llms.json` as the main SEO, AEO, GEO, and `llms.txt` source of truth.
7. Treat generated files in `public/` as outputs of config and scripts, not hand-edited source files.
8. Respect base-path and GitHub Pages deployment constraints when introducing routes, assets, or generated paths.
9. Document structural decisions when they change how future work should be done.

## Visual Defaults

- keep the warm paper backdrop, oversized split hero, rounded glass-like panels, and profile chip feel
- preserve list, tile, and badge link-directory modes as first-class surfaces
- keep hover, focus, and reduced-motion behavior intentional across homepage and embed views
- treat visual changes as site-level decisions, not incidental styling drift

## Avoid

- hardcoding fork-owner identity into source files when config can own it
- adding runtime i18n or app-like complexity without a clear product need
- duplicating SEO, legal, or discovery logic across multiple unrelated files
- introducing CMS, database, or server complexity into a site that is meant to stay static-friendly
