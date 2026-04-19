---
name: nuxt
description: Use when working on Nuxt pages, routing, app configuration, rendering strategy, embeds, or SEO integration for this project.
---

# Nuxt

Use this skill for framework-level Nuxt decisions and implementation work.

## Default Approach

1. Prefer standard Nuxt conventions before adding custom structure.
2. Keep the site static-friendly unless there is a clear runtime need.
3. Put route-level SEO and metadata close to the page or composable that owns them.
4. Keep server-only and client-only behavior explicit.

## Project Defaults

- optimize for a live profile links site, not app-like dashboard complexity
- keep the main route surfaces obvious: homepage, legal documents, `/embed/list`, `/embed/tiles`, and `/embed/badges`
- keep legal routes and embed routes lightweight and easy to prerender
- keep metadata, structured data, and discovery-file generation aligned with GitHub Pages output
- pair with the `vue`, `vanilla-css`, and `eslint-typescript` skills as needed
