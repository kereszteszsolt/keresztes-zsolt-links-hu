# .codex

OpenAI Codex-specific reference files for this repository.

- `AGENTS.md` is a local helper file for work inside `.codex/`.
- `agents/` keeps thin Codex-facing duplicate agent files that point to `.ai/agents/`.
- `agents/subagents.md` points back to the canonical `.ai` agent index.
- `notes/` points Codex back to the canonical architecture and design notes.
- `plans/` points Codex back to the canonical persistent plan.

Purpose split:

- `.ai/` is project memory: plans, notes, audits, and canonical reusable role definitions.
- Mirror the canonical workflow in `.ai/`: plan first, use multiple subagents for distinct subtasks, clean obvious type/lint/editor errors before handoff, keep new non-config source/docs on the Apache 2.0 header pattern, and keep config files comment-free with editable ownership/name metadata.
- `.codex/` is a thin Codex reference layer in this repo.
- The root `AGENTS.md` remains the main Codex entrypoint for this repository.

Avoid duplicating full role definitions here when `.ai/agents/` already owns them.
Point back to `.ai/` instead.
