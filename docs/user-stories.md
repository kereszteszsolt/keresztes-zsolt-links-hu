# User Stories

## Product Positioning

`profile-links-starter` is a reusable starter for people or small brands who want to publish a single, trustworthy profile links site without turning the project into a CMS.

The product promise is simple:

- content updates should happen through `config/` and `public/images/`
- the public site should stay clear and fast
- embeds should be easy to reuse
- SEO, legal pages, and AI-facing discovery should work without extra wiring

## Primary Audiences

### Visitors

Visitors arrive to discover a person, brand, or creator and choose the right next link quickly.

- As a visitor, I can land on a single profile page with a clear hero, short bio, profile facts, and a filterable link directory.
- As a visitor, I can scan the most important links without navigating multiple pages.
- As a visitor, I can switch between list and tile presentations when that helps me browse faster on the homepage.
- As a visitor, I can open legal and contact information from the homepage or direct document routes.

### Fork Owners

Fork owners reuse the starter and replace the sample identity with their own.

- As a fork owner, I can replace the placeholder identity, links, legal copy, and images by editing `config/*.json` and `public/images/`.
- As a fork owner, I can keep the app single-language and have metadata stay aligned with that choice.
- As a fork owner, I can control language, canonical URL, announcement copy, and template-preview mode from `config/site.json`.
- As a fork owner, I can publish to GitHub Pages without redesigning the routing or build flow.
- As a fork owner, I can preserve the starter architecture while changing the content, branding, and link priorities.

### Embed Integrators

Embed integrators want a lightweight way to reuse the project outside the homepage context.

- As an integrator, I can embed the list or tile presentation through dedicated routes.
- As an integrator, I can filter embedded links by tag so I only expose the subset I need.
- As an integrator, I can adjust basic embed presentation through query parameters instead of forking components.

### Search, Discovery, And Compliance Consumers

Machine consumers need stable, explicit signals rather than hidden UI-only context.

- As a search engine, I can read canonical metadata, language, and JSON-LD derived from config.
- As a retrieval or AI consumer, I can discover profile context, link intent, `robots.txt`, `sitemap.xml`, and optional `llms.txt` guidance.
- As a compliance or legal consumer, I can access contact and policy pages through direct routes.

## Product Boundaries

The starter is intentionally opinionated.
These constraints are part of the design, not missing features.

- It is a single-language starter, not a multilingual framework.
- It is config-first, not a CMS or admin dashboard.
- It is optimized for one profile identity, not multi-tenant publishing.
- It supports embed reuse, but the homepage remains the canonical experience.

## Acceptance Signals

The starter is meeting its goals when the following remain true:

- a fork owner can complete most personalization work inside `config/` and `public/images/`
- the homepage, embed routes, and legal routes render from the same content model
- the homepage still supports the hero, filterable directory, view toggle, and legal access without custom code changes
- canonical metadata and discovery output stay consistent with `config/site.json`
- the generated site is suitable for static hosting on GitHub Pages
- legal pages are directly routable and do not depend on modal-only access
