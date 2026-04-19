# Claude Guide

Canonical project guidance lives in `.ai/`.

The `.claude/` folder intentionally mirrors the same subfolders and filenames, but only as thin bridge files that point back to `.ai/`. Update `.ai/` first and keep `.claude/` lightweight.

The `.github/` folder is the GitHub Copilot adapter layer. Keep it aligned with `.ai/` and avoid turning it into a second source of truth.

Start here for any non-trivial task:

1. Read `.ai/rules/multi-agent-execution.md` and `.ai/rules/project-architecture.md`.
2. Read `.ai/rules/adding-new-feature.md` for delivery flow and `.ai/rules/guidance-structure.md` when editing AI guidance itself.
3. Pick the best-fit role from `.ai/agents/subagents.md` for each subtask.
4. Use `.aiplan/` for plan, argument, and consensus during active multi-agent work.
5. Apply the matching skill from `.ai/skills/` for stack-specific work.

Current target stack and defaults:

- Nuxt
- Vue
- TypeScript
- ESLint
- Vanilla CSS
- config-first live profile links site
- single-language and static-friendly GitHub Pages deployment
