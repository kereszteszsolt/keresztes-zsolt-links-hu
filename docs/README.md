# Docs

This folder keeps the fork-and-reuse guide for `profile-links-starter`.
The root `README.md` also documents the data-editing workflow, the optional announcement banner, the `config/llms.json` AI-facing content flow, the current embed route contract, and the protected email action format.

- [implementation-plan.md](./implementation-plan.md) - step-by-step build plan from setup to release
- [user-stories.md](./user-stories.md) - short 80/20 stories for the starter
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
