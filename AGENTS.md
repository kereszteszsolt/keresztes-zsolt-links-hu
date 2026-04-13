# AGENTS

OpenAI Codex entrypoint for `profile-links-starter`.

Keep the main AI memory in `.ai/`.

Start here:

- `.ai/README.md`
- `.ai/agents/subagents.md`
- `.ai/notes/architecture.md`
- `.ai/notes/design-audit.md`
- `.ai/notes/tool-mirror-pattern.md`
- `.ai/plans/project-plan.md`
- `.github/copilot-instructions.md`
- `.github/instructions/internal-ai.instructions.md`

## Core Rules

- Keep this starter fork-friendly and config-first.
- Never commit automatically.
- Never replace user changes unless explicitly asked.
- Before implementation, create a short plan and follow it. Keep the plan lightweight for trivial edits, but do not skip planning for non-trivial work.
- Use multiple subagents by default for non-trivial tasks when analysis, planning, implementation, or verification can be split cleanly.
- Use multiple subagents when the task benefits from parallel analysis or split responsibility.
- After generating code, proactively clean up obvious type, import, lint, and editor errors in changed files before handing work back.
- Do not leave known errors in changed code unless they are pre-existing, unrelated, or blocked by missing tooling, and call out those blockers clearly.
- New non-config source and documentation files must include the repo's Apache 2.0 header pattern used elsewhere in the repository.
- Keep config files fork-friendly and comment-free. Put fork-owner identity, visible ownership text, and editable site metadata in config values instead of hardcoded source comments.
- Keep `.ai/agents/subagents.md` as the canonical role index and `.ai/agents/*.md` as the canonical full role definitions.
- Keep `.codex/`, `.github/`, and any future tool-specific folders as thin reference layers that point back to `.ai/`.
- Verify the current official repo-level file or folder convention for each new AI tool before adding it. If the convention is unclear, ask the user or developer.
- Keep `.github/agents/*.agent.md` as thin GitHub custom agent profiles that link back to `.ai/agents/*.md`.
