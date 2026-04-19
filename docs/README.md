# Docs

This folder keeps lightweight project notes for the live `links-hu` site.
The root `README.md` gives the short public overview, and the embed route contract below documents the current reusable embed surface in this repo.

## Embed Route Contract

- `/embed/tiles`: `with`, `col`, `tags`, `accent`, `itemBg`, `itemBorder`, `text`, `muted`, `iconBg`
- `/embed/list`: `with`, `tags`, `accent`, `itemBg`, `itemBorder`, `text`, `muted`, `iconBg`
- `/embed/badges`: `with`, `col`, `tags`

Hex colors can be passed as plain hex like `ff6b2c` or URL-encoded with `#` like `%23ff6b2c`.

Examples:

```text
/embed/tiles?with=36&col=2&tags=dev,code&accent=ff6b2c&itemBg=fff4ec&itemBorder=ffc39e&text=22160c&muted=8a5a35&iconBg=ff6b2c
/embed/list?with=40&tags=social-media&accent=%23007a5a&itemBg=%23eefcf7&itemBorder=%23b6ead7&text=%230f2d24&muted=%23506f66&iconBg=%23007a5a
/embed/badges?with=32&col=2&tags=projects
```

The planning docs below still reflect the upstream starter build-out, so treat them as project notes rather than a strict source of truth for every current implementation detail.

Current deploy shape:

- GitHub Pages serves the `gh-pages` branch
- the published branch content comes from `.output/public`
- `.nojekyll` is included in the generated static output
- the repo workflow deploys automatically on pushes to `main`

- [implementation-plan.md](./implementation-plan.md) - step-by-step build plan from setup to release
- [user-stories.md](./user-stories.md) - short 80/20 stories for the public and fork-owner surface
- [tasks.md](./tasks.md) - practical task checklist

Internal maintainer docs:

- [../AGENTS.md](../AGENTS.md) - repo-level OpenAI Codex instructions
- [../.ai/README.md](../.ai/README.md) - project memory layout
- [../.ai/notes/tool-mirror-pattern.md](../.ai/notes/tool-mirror-pattern.md) - how to add future AI tool mirrors while keeping `.ai` canonical
- [../.codex/README.md](../.codex/README.md) - Codex-specific folder purpose
- [../.github/OVERVIEW.md](../.github/OVERVIEW.md) - GitHub-facing reference layer
- [../.github/copilot-instructions.md](../.github/copilot-instructions.md) - GitHub Copilot repository instructions

Future AI tool folders should be added only after checking the tool's official repo-level convention.
When added, they should stay thin and should point back to `.ai/` instead of becoming a second memory store.
