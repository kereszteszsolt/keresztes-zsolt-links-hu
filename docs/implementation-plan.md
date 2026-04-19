# Implementation Plan

## Goal
Build a clean Nuxt profile-links starter that ships with example `Your Name` data, keeps all user-editable content in config files, and deploys easily to GitHub Pages.

## Source Of Truth
- `config/site.json` for site identity, language, SEO, and deploy settings
- `config/profile.json` for the hero/profile section
- `config/links.json` for the social and directory links
- `config/llms.json` for ordered AI-facing `llms.txt` sections
- `config/ui.json` for labels and visible UI copy
- `config/legal/*.json` for `contact`, `gtc`, `privacy`, `license`, and `impressum`

## Step By Step
1. Start from the Nuxt scaffold and confirm the example site renders with one language only.
2. Load all visible content from the config files and keep the page logic thin.
3. Build the home page layout to match the reference style: hero, link list, and legal/footer area.
4. Add reusable embed routes for tile, list, and badge views with a small query contract, including color query overrides for tile and list embeds.
5. Add SEO defaults plus optional AI-facing discovery helpers from config, including language, canonical URL, metadata, structured data, and `llms.txt`.
6. Split legal content into separate routes so each policy page can be indexed and linked directly.
7. Add protected legal email actions that render only on the client.
8. Add GitHub Pages support with static SEO generation, default `gh-pages` branch publishing from `.output/public`, `.nojekyll`, and base-path handling for repo deployments.
9. Write fork instructions that tell the user exactly which config files to edit and how to deploy their copy.
10. Verify the starter with a local build, a generate step, and a quick review of the published output path, including embed routes.

## Finish Line
- One example profile site is working end to end.
- Reusable tile, list, and badge embed routes are working.
- Every user-facing string comes from config.
- SEO and legal pages are static and crawlable.
- A fork owner can publish to GitHub Pages without changing the app structure.
