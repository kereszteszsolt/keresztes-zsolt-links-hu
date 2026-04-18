# Tasks

## Setup
- Create the Nuxt starter structure and keep `Your Name` as the example profile.
- Keep the app single-language and drive the language setting from `config/site.json`.
- Confirm the project base path works for both root hosting and GitHub Pages hosting.

## Content
- Move all visible copy into config files.
- Keep profile, links, contact, and legal content in separate JSON files.
- Keep richer `llms.txt` structure in its own JSON file while reusing existing profile and link data.
- Replace placeholder values with fork-friendly examples that are easy to edit.

## UI
- Reuse the reference layout and styling approach for the hero, link list, and footer.
- Keep reusable `/embed/tiles`, `/embed/list`, and `/embed/badges` routes working.
- Support tag filtering across all embed routes and color query overrides for `/embed/tiles` and `/embed/list`.
- Keep the implementation simple and config-driven.
- Make sure the page still looks correct on mobile and desktop.

## SEO And Crawlability
- Add canonical, Open Graph, Twitter, and structured data settings from config.
- Add search-facing metadata plus optional AI-facing summary text and `llms.txt` output from config.
- Generate or prerender the static SEO files and legal routes.

## Legal
- Create direct routes for `contact`, `gtc`, `privacy`, `license`, and `impressum`.
- Keep each legal page backed by its own JSON config.
- Support protected legal email actions instead of plain server-rendered `mailto:` values when needed.

## Release
- Add `gh-pages` to the deployment flow.
- Honor `config/site.json > deploy.cname` in the deploy flow.
- Document the fork-and-deploy path for GitHub Pages.
- Check the production build, generated output, and embed routes before release.
