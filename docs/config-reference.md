# Config Reference

This project is designed so most forks can stay inside `config/` and `public/images/`.
Use this page as a quick map of what each editable file controls.

## Core Files

| File | Responsibility |
| --- | --- |
| `config/site.json` | Site identity, language, canonical URL, theme color, discovery metadata, social preview settings, announcement banner, template-preview mode, and deploy settings |
| `config/profile.json` | Profile name, role line, bio, avatar settings, hero facts, and `sameAs` links |
| `config/links.json` | Directory filters and link entries shown on the homepage and embed routes |
| `config/ui.json` | Shared interface labels for view modes, filters, footer navigation, and empty states |
| `config/llms.json` | Optional extra sections used to enrich `llms.txt` output |
| `config/legal/*.json` | Contact, privacy, license, impressum, and terms content for both modal and direct legal routes |

## Supporting Assets

| Path | Responsibility |
| --- | --- |
| `public/images/` | Uploaded avatar files and any other public image assets referenced by config |

## First Files Most Forks Change

1. `config/site.json`
2. `config/profile.json`
3. `config/links.json`
4. `config/ui.json`
5. `public/images/`

## Notes

- Treat `config/site.json` as the source of truth for identity, language, canonical behavior, and discovery settings.
- Treat `config/profile.json` and `config/links.json` as the source of truth for the public homepage and embed content.
- Treat `config/legal/*.json` as production content, not placeholder text that should ship unchanged.
- When adding a new editable field, update `types/config.ts` and the relevant docs in the same change.
