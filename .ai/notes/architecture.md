# Architecture

## Goal

Rebuild the reference site as a simpler starter without changing the overall visual feel.

## Chosen structure

- `config/`
  All fork-owner content and SEO settings live here.
- `composables/useSiteData.ts`
  Single typed loader that normalizes config and asset paths.
- `composables/useSiteSeo.ts`
  Derived metadata and JSON-LD helpers.
- `pages/index.vue`
  Homepage with the same hero, directory, and footer rhythm.
- `pages/[document].vue`
  Crawlable direct routes for legal pages.
- `pages/embed/badges.vue`
  Lightweight badge embed route with tag filtering, width, and column controls.
- `pages/embed/list.vue`
  Lightweight list embed route with tag filtering and width control.
- `scripts/sync-static-seo.mjs`
  Generates `robots.txt`, `sitemap.xml`, `llms.txt`, and optional `CNAME`.

## Why this is easier

- one language only
- no i18n key indirection
- small embed surface only for list and badge reuse
- separate legal files are obvious to edit
- static SEO files are generated from the same config source

## Main tradeoff

The starter keeps some copied CSS from the reference project so the look stays close. The architecture is cleaner than the original, but not fully redesigned from zero.
