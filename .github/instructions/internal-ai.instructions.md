---
applyTo: "AGENTS.md,.ai/**/*.md,.codex/**/*.md,.github/**/*.md"
---

Keep `.ai/` as the source of truth for AI memory in this repository.

- Follow the canonical workflow in `.ai/`: plan first, use multiple subagents when the work breaks into distinct subtasks, clean up obvious type/lint/editor errors caused by generated code, keep new non-config source/docs on the repo's Apache 2.0 header pattern, and keep config files comment-free and fork-friendly with ownership/name data in editable config values.

- Start from `.ai/README.md`.
- Keep `.ai/agents/subagents.md` as the canonical role index.
- Keep the individual files in `.ai/agents/` as the canonical full agent definitions.
- Keep `.codex/` and `.github/` files short and aligned with the matching originals in `.ai/`.
- When duplicating agent, note, or plan files into `.codex/` or `.github/`, include a clear link back to the original `.ai/` file.
