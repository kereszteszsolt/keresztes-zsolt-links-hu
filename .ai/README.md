# .ai

Internal working memory for the implementation.

- `agents/` keeps canonical reusable sub-agent files and the `subagents.md` index.
- `notes/` keeps design and architecture notes.
- `plans/` keeps the human step-by-step execution plan.
- `notes/tool-mirror-pattern.md` explains how to add future AI tool mirrors without moving canonical content out of `.ai/`.

Use `.ai/` for project memory.

- plans
- architecture notes
- design audits
- reusable role definitions

Use `.codex/`, `.github/`, and any future tool-specific folders only as optional thin reference layers that point back to `.ai/` files.
Verify each tool's official repo-level file or folder convention before adding it.

These files are short on purpose so the project state stays easy to review.

## Workflow

1. Inspect the repo context and the relevant `.ai/` notes first.
2. Write or confirm a short plan before implementation starts.
3. Use multiple subagents for distinct analysis, planning, implementation, and verification work when the task can be split cleanly.
4. Implement the change.
5. Proactively fix obvious type, import, lint, and editor errors in touched files before handing work back.
6. Verify results, or clearly call out blockers such as missing tools or broken local environments.

## File Conventions

- When adding a new non-config source or documentation file, use the Apache 2.0 header pattern already used across the repository.
- Keep config files declarative, comment-free, and fork-friendly.
- Put fork-owner identity, visible copyright-like text, and other editable site metadata in config values such as `config/site.json`, `config/profile.json`, `config/ui.json`, and `config/legal/*.json`.
