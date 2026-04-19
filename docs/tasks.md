# Tasks

Use this checklist when changing the starter or preparing a release.
It is meant to protect the project contract, not to capture one-time implementation history.

## Product Integrity

- Confirm the homepage still presents one clear profile identity, hero summary, and primary link directory.
- Confirm the starter remains single-language and that language metadata still comes from `config/site.json`.
- Confirm the public experience still works as a config-first starter rather than a hard-coded site.

## Content Model

- Confirm new user-facing content is added to `config/` and typed in `types/config.ts`.
- Confirm `config/site.json` remains the source of truth for language, canonical behavior, announcement state, and template-preview mode.
- Confirm placeholder content stays fork-friendly and does not imply real ownership or production-ready legal text.
- Confirm UI labels, profile content, links, legal content, and AI-facing copy remain separated by responsibility.

## Routes And Presentation

- Confirm `/`, `/embed/list`, `/embed/tiles`, and direct legal routes still render correctly.
- Confirm embed filtering and styling parameters continue to match the documented route contract.
- Confirm homepage and legal pages still behave correctly on mobile and desktop layouts.

## SEO, Discovery, And Legal

- Confirm canonical URLs, share metadata, and structured data still derive from resolved site config.
- Confirm `robots.txt`, `sitemap.xml`, and `llms.txt` stay aligned with the current content model.
- Confirm each legal document remains directly routable and not modal-only.
- Confirm protected legal email actions still avoid exposing plain addresses in static markup.

## Deployment Readiness

- Confirm base-path handling still works for both root hosting and GitHub Pages project hosting.
- Confirm generated output remains suitable for publishing from `.output/public`.
- Confirm `.nojekyll` and optional `deploy.cname` behavior still match the deploy flow.

## Documentation Hygiene

- Update [user-stories.md](./user-stories.md) if public behavior or intended audience changes.
- Update [architecture.md](./architecture.md) if config responsibilities, routes, or composable boundaries change.
- Update the root [README](../README.md) when onboarding, editing, or deployment steps change.
