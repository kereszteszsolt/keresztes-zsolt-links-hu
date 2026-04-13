# profile-links-starter

This repository is a minimal starter for personal link pages. It uses placeholder data, simple JSON configuration files, and a single-language setup so you can fork it, replace the content, and reuse it without carrying over the original author's personal data. If this starter helps your project, feel free to fork it, adapt the content, and star the repository.

If you're interested in the author's other projects, posts, or videos, you can find links on the author's GitHub profile. [https://github.com/kereszteszsolt](https://github.com/kereszteszsolt)

## What this starter includes

- content, labels, SEO, and legal pages driven by JSON files in `config/`
- example `Your Name` profile data ready to replace with your own brand, links, and copy
- Nuxt 3 with vanilla CSS
- one homepage with hero, link directory, and legal footer
- homepage legal modals plus direct routes for `contact`, `gtc`, `privacy`, `license`, and `impressum`
- standalone `/embed/badges` and `/embed/list` routes for reuse
- config-driven SEO plus optional AI-facing discovery files and summaries
- generated `robots.txt`, `sitemap.xml`, and `llms.txt`
- `gh-pages` CLI deploy command for GitHub Pages

## Quick start

1. Fork this repository.
2. Clone your fork.
3. Copy `.env.example` to `.env`.
4. Set `NUXT_APP_BASE_URL` only if you need to override the base path inferred from `config/site.json > siteUrl`.
5. Install dependencies and start the dev server.
6. Replace the example JSON content in `config/` and swap the placeholder images in `public/images/`.

```bash
cp .env.example .env
npm install
npm run dev
```

## Base path setup

`NUXT_APP_BASE_URL` is optional.

If it is left blank, the app uses the path part of `config/site.json > siteUrl`.

Set it in `.env` only when you want to override that inferred value:

- use `/` for a custom domain or a root deployment
- use `/<repo-name>/` for a project site on GitHub Pages

Examples:

```bash
NUXT_APP_BASE_URL=/
```

```bash
NUXT_APP_BASE_URL=/your-repo-name/
```

## Most forks only edit these files

If you are reusing the starter as-is, you will usually stay inside `config/` and `public/images/`.

- `config/site.json`
  Site identity, language, optional announcement banner, SEO, canonical URL, llms summary, and deploy settings like `deploy.cname`.
- `config/profile.json`
  Name, bio, avatar, and hero facts.
- `config/links.json`
  Filters and example social or portfolio links.
- `config/llms.json`
  Optional extra `llms.txt` sections and AI-facing Q&A.
- `config/ui.json`
  Shared visible labels for the homepage, including the footer copyright text.
- `config/legal/contact.json`
  Contact page and modal content.
- `config/legal/gtc.json`
  Terms placeholder.
- `config/legal/privacy.json`
  Privacy placeholder.
- `config/legal/license.json`
  License copy and action links.
- `config/legal/impressum.json`
  Impressum placeholder.
- `public/images/`
  Your own uploaded avatar or preview images.

## Identity, ownership, and license

When you fork this starter, most public identity and ownership-like text should be changed in `config/`, not in source comments.

- `config/site.json`
  Update `siteName`, `siteTitle`, `author`, `siteUrl`, `socialPreview.alt`, and `discovery.*` for your public branding and SEO-visible metadata.
- `config/profile.json`
  Update `name`, `domainLabel`, `roleLine`, `bio`, `avatar.alt`, and `sameAs` for the visible person or brand identity.
- `config/ui.json`
  Update `footerCopyright` for the copyright-like footer text shown on the site.
- `config/legal/contact.json` and `config/legal/impressum.json`
  Replace the contact, publisher, address, email, and legal-responsibility details with your own.
- `config/legal/license.json`
  Replace the on-site license page copy if your published site needs different license information. This is separate from the repository software license in `LICENSE`.

## File Headers Vs Config Identity

Source files and documentation files in the repository use the Apache 2.0 header pattern already present across the codebase. New non-config files should follow that same header pattern.

JSON config files are different: they stay comment-free and act as the runtime source of truth for the fork owner's visible name, branding, footer copyright text, and legal identity. In most forks, you update both:

- config values for the public site identity
- Apache headers in any new non-config files you add to the repository

## Make it yours

- Brand: use `config/site.json` for site-wide identity, SEO, language, theme color, social preview settings, and the optional announcement banner.
- Profile: use `config/profile.json` for the homepage name, avatar, role line, bio, facts, and `sameAs` links.
- Links: use `config/links.json` for the actual destinations people should click, grouped by filters, categories, and tags.
- LLM extras: use `config/llms.json` for extra `llms.txt` chapters and AI-facing Q&A that do not belong in the visible page UI.
- Labels: use `config/ui.json` for small visible interface text such as hero labels, view mode labels, and footer copy.
- Legal: use `config/legal/*.json` for contact, privacy, license, terms, and impressum content with the same shared JSON structure.

## Reuse ideas

You can adapt this starter into a:

- personal link hub for a designer, developer, or consultant
- creator page with social, video, and newsletter links
- freelancer or studio profile with contact and service links
- speaker, teacher, or coach profile with platform links and legal pages
- lightweight portfolio landing page that stays mostly static

## How to customize the data

For a typical fork, this is the whole setup: replace the example content, keep the structure, and publish.

1. Edit `config/site.json`.
   Use this file for your site name, public URL, language, author name, browser theme color, share image settings, and SEO/discovery copy.
   The optional site-wide announcement bar also lives here. You can keep the default template warning, rewrite it for your own notice, or disable it entirely.
   The `discovery.includeLlmsTxtInSitemap` flag controls whether `/llms.txt` is included in `sitemap.xml`.
   Replace the example keywords, LLM summary, audiences, intents, and FAQ with text that matches your real profile or business. `site.json` still owns the base llms metadata.
2. Edit `config/profile.json`.
   Use this file for the visible identity card: your name, domain label, role line, short bio, avatar settings, facts, and `sameAs` links.
   `roleLine` can be one string or an array of lines if you want a stacked presentation in the avatar tile.
   For a GitHub profile picture, you can point `avatar.src` directly to `https://github.com/username.png`.
   Example: `"src": "https://github.com/your-user-id.png"`.
   You can also leave the default local SVG in `avatar.src` and set `avatar.githubUsername` to switch to the GitHub avatar automatically.
3. Edit `config/links.json`.
   This is the main link collection. Replace the example items with your real platforms, portfolio links, storefronts, booking pages, or community links.
   Keep every `id` unique. Keep `filters` and item `category` values aligned. Use `tags` for embed filtering and reuse.
   `title` and `description` are the visible copy people read. `profileId` is optional and is only used for URL-end highlighting. `segmentMark` is optional and lets you highlight more than the last matching URL segment.
4. Edit `config/llms.json`.
   `llms.txt` already reuses your site, profile, and link data automatically.
   Use this file only for extra AI-facing structure such as ordered sections, grouped link output, extra Q&A, and custom chapter text that should not appear in the visible page UI.
   The section model supports generated sections like `profile`, `profileFacts`, `links`, and `faq`, plus custom `chapter` and `qna` sections.
5. Edit `config/ui.json`.
   Use this for small visible labels such as the hero label, directory eyebrow, footer labels, view mode labels, and embed empty-state text.
   `footerCopyright` supports `{{year}}` and automatically resolves to the current year at runtime.
   If you change the site language in `config/site.json`, translate these labels too so the site stays consistent.
6. Edit every file in `config/legal/`.
   Replace all placeholder legal text with your real contact, privacy, terms, license, and impressum content.
   Each file follows the same general pattern: labels, `sections[]`, and optional `actions[]`.
   Replace placeholder names, addresses, emails, and `updatedAt` values before publishing.
   Use action links for external legal references. If you want to keep an email out of the server-rendered HTML, use the protected email action format documented below.
7. Replace files in `public/images/`.
   Swap the example avatar or preview assets with your own images and update the matching `src` and `alt` text in the JSON files.
   If you prefer a remote GitHub avatar instead of a local file, set `config/profile.json > avatar.src` to `https://github.com/username.png`.

## Data editing tips

- Keep the starter single-language by setting `config/site.json > language` once and writing all visible copy in that same language.
- Treat `config/site.json` as the SEO source of truth and `config/profile.json` plus `config/links.json` as the visible content source of truth.
- Treat `config/llms.json` as optional AI-facing enrichment for `llms.txt`, not as a replacement for the core site, profile, or link data.
- Use `config/site.json > announcement` for short, important site-wide notices such as maintenance updates, launch notes, or template warnings.
- Keep `filters[]` aligned with the `category` values used by `config/links.json > items[]`.
- Write short, specific link descriptions. They help visitors decide where to click and also improve metadata quality.
- Use `tags` in `config/links.json` even if you do not need them today. They already power the embed routes and make future filtering easier.
- Use `featured` only for your highest-priority links, and treat `styles.badgeColor` as optional brand styling rather than required data.
- Update legal `buttonLabel`, `title`, `updatedAtLabel`, and `updatedAt` values so the footer modals and legal pages reflect your real content and language.
- For `config/ui.json > footerCopyright`, the recommended format is `Copyright {{year}} Your Name`. If you hard-code a year instead, the last standalone year in the text is normalized to the current year automatically.
- Keep legal content honest and minimal. Placeholder text should never ship to production.
- If you are making a simple personal fork, you usually do not need to edit `pages/`, `components/`, or `composables/`.

## Language setup

This starter is intentionally single-language. Set the language once in `config/site.json`:

```json
{
  "language": {
    "code": "en",
    "locale": "en_US",
    "name": "English",
    "direction": "ltr"
  }
}
```

That value is used for the HTML language, metadata, and structured data.

## Announcement banner

The starter includes an optional full-width announcement banner powered by `config/site.json > announcement`.

Use it for:

- the default template warning about placeholder example data
- maintenance or outage notices
- launch or release announcements
- temporary policy or availability changes

To disable it, set:

```json
{
  "announcement": {
    "enabled": false
  }
}
```

Example:

```json
{
  "announcement": {
    "enabled": true,
    "id": "template-placeholder-data",
    "tone": "warning",
    "sticky": false,
    "dismissible": true,
    "eyebrow": "Template notice",
    "title": "Placeholder example data",
    "message": "This starter uses fictional example personas and placeholder profile links. Replace all content before publishing your own site.",
    "closeLabel": "Dismiss notice"
  }
}
```

Supported fields:

- `enabled`: turns the banner on or off
- `id`: used for the dismiss state key when `dismissible` is enabled
- `tone`: `warning`, `info`, or `success`
- `sticky`: makes the banner stick to the top while scrolling
- `dismissible`: shows a dismiss button
- `eyebrow`: optional short label above the main text
- `title`: short headline
- `message`: the main notice copy
- `closeLabel`: dismiss button text
- `action`: optional `{ "label": "...", "href": "..." }` link

## SEO and discovery

SEO and discovery settings come from `config/site.json`, so most forks only need copy changes here, not code changes.
In this starter, `SEO` means the classic search-facing basics like title, description, canonical URL, Open Graph, JSON-LD, `robots.txt`, and `sitemap.xml`. `GEO/AEO` here just means the optional answer-engine and AI-facing helpers such as clearer summaries, FAQ content, structured data, and `llms.txt`. For most forks, you just update `config/site.json` and optionally `config/llms.json`. If you do not need the extra AI-facing sections, keep `config/llms.json` minimal and set `discovery.includeLlmsTxtInSitemap` to `false`. If you do not want to publish `llms.txt` at all, remove `public/llms.txt` and remove its write step from `scripts/sync-static-seo.mjs`.
The project uses that file for:

- canonical URL
- title and description
- Open Graph and Twitter cards
- `Person`, `WebSite`, `ItemList`, and `FAQPage` JSON-LD
- generated `robots.txt`
- generated `sitemap.xml`
- generated `llms.txt`
- optional `/llms.txt` inclusion in `sitemap.xml` through `config/site.json > discovery.includeLlmsTxtInSitemap`
- `llms.txt` uses `config/site.json`, `config/profile.json`, and `config/links.json` automatically, and can be extended with ordered sections from `config/llms.json`

Before publishing, update:

- `siteUrl`
- `siteTitle`
- `siteDescription`
- `language`
- `discovery.keywords`
- `discovery.includeLlmsTxtInSitemap`
- `discovery.llmSummary`
- `discovery.faq`

## Fork checklist: replace content, not code

For a typical fork, this is the whole setup.

1. Update `config/site.json` with your real public URL and language.
2. Replace the example identity and SEO copy in `config/site.json`.
3. Replace `Your Name` in `config/profile.json`.
4. Replace the links, categories, tags, and titles in `config/links.json`.
5. Adjust or replace the ordered `llms.txt` sections in `config/llms.json` if you want richer AI-facing output.
6. Translate `config/ui.json` if you changed the site language.
7. Replace the example legal text and legal metadata in every file under `config/legal/`.
8. Swap the placeholder avatar in `public/images/`.
9. Review the generated files in `public/robots.txt`, `public/sitemap.xml`, and `public/llms.txt` after running the app once.

## Protected email actions

If you want to keep a legal email action out of the server-rendered HTML, use an action like this in any `config/legal/*.json` action list:

```json
{
  "label": "Email {{email}}",
  "email": true,
  "emailParts": ["ple.c", "our-u", "om", "id@ex", "y", "ser-", "am"],
  "emailOrder": [4, 1, 5, 3, 6, 0, 2]
}
```

- `email: true` marks the action as client-only email output.
- `{{email}}` is optional. If you include it in the label, the decoded email is inserted only after hydration.
- `emailParts` should contain random-looking chunks of the address.
- `emailOrder` should list the indexes in the order needed to rebuild the real email.

## Embed routes

The starter ships with two reusable embed routes:

- `/embed/badges`
- `/embed/list`

Supported query params:

- `/embed/badges`
  - `with`: optional width in `rem` for the embed surface
  - `col`: optional maximum number of badge columns
  - `tags`: optional comma-separated tag filter
- `/embed/list`
  - `with`: optional width in `rem` for the embed surface
  - `tags`: optional comma-separated tag filter

Examples:

```text
/embed/badges?with=32&col=2&tags=dev,code
/embed/list?with=40&tags=social-media
```

Width behavior:

- badge embeds keep the real minimum badge width even if `with` is smaller
- list embeds let the row layout decide the practical minimum width

## GitHub Pages deploy

1. Set `config/site.json > siteUrl` to the exact final public URL where the site will be served.
2. Set `NUXT_APP_BASE_URL` in `.env` only if you need to override the base path inferred from `siteUrl`.
3. If you use a custom domain on GitHub Pages, set `config/site.json > deploy.cname` to that domain name.
4. Install dependencies.
5. Generate and deploy:

```bash
npm run deploy
```

6. In your GitHub repository Pages settings, make sure GitHub Pages serves the `gh-pages` branch.

GitHub Pages settings location:

- open `https://github.com/<your-username>/<your-repo>/settings/pages`
- example for this starter: `https://github.com/your-username/profile-links-starter/settings/pages`
- if you use a custom domain, add it in the `Custom domain` field on that same GitHub Pages settings page

`config/site.json > siteUrl`:

- use this for the full public URL where visitors will open the site
- this drives canonical URLs, sitemap entries, Open Graph URLs, and app base-path inference

`config/site.json > deploy.cname`:

- use this only for a custom GitHub Pages domain
- this writes the `CNAME` file during the static SEO sync step
- example: `"cname": "links.yourdomain.com"`
- this should match the value you enter in GitHub at `Settings -> Pages -> Custom domain`

For a project site, `siteUrl` should include the repo path. Example:

```json
{
  "siteUrl": "https://your-user.github.io/your-repo-name"
}
```

That means the site will be served at:

```text
https://your-user.github.io/your-repo-name
```

For a custom domain:

- keep `NUXT_APP_BASE_URL=/`
- set `config/site.json > siteUrl` to the custom domain
- set `config/site.json > deploy.cname` to the same custom domain

Example:

```json
{
  "siteUrl": "https://links.yourdomain.com",
  "deploy": {
    "cname": "links.yourdomain.com"
  }
}
```

That means the site will be served at:

```text
https://links.yourdomain.com
```

## Docs

Short project notes live in `docs/`:

- `docs/implementation-plan.md`
- `docs/user-stories.md`
- `docs/tasks.md`

Canonical internal maintainer memory lives in `.ai/`.
Tool-specific folders, when present, are thin reference entrypoints only and should point back to `.ai/`.

Current maintainer entrypoints:

- `AGENTS.md`
- `.ai/README.md`
- `.ai/notes/tool-mirror-pattern.md`
- `.codex/README.md`
- `.github/OVERVIEW.md`
- `.github/copilot-instructions.md`

If you later add support for Claude, Cursor, Antigravity, or any other AI tool:

- verify the tool's current official repo-level file or folder convention first
- keep the canonical content in `.ai/`
- add only the minimum tool-recognized files needed for discovery
- keep those duplicated files short and link them back to the original `.ai/` files

## Important note

The included legal and contact content is placeholder example text only. Replace it before publishing a real site.
