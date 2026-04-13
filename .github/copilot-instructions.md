Keep this repository config-first and fork-friendly.

The canonical AI memory lives in `.ai/`.

The canonical workflow rule lives in `.ai/`: plan first, use multiple subagents when a task has distinct subtasks, proactively clean up obvious type/lint/editor errors introduced by generated code, and keep new non-config source/docs on the repo's Apache 2.0 header pattern.

Config files should stay comment-free and fork-friendly, with visible ownership and name metadata living in editable config values.

When editing `AGENTS.md`, `.ai/**`, `.codex/**`, or `.github/**`, start from:

- `.ai/README.md`
- `.ai/agents/subagents.md`
- `.ai/notes/architecture.md`
- `.ai/notes/design-audit.md`
- `.ai/plans/project-plan.md`

Treat `.codex/` and `.github/` as thin integration layers that point back to `.ai/`.
Do not create competing copies of the real AI memory.
Never commit automatically.
