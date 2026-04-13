# .github

GitHub-facing reference layer for this repository.

- `AGENTS.md` is a local helper file for work inside `.github/`.
- `copilot-instructions.md` is the repository-wide GitHub Copilot instructions file.
- `instructions/` keeps GitHub-recognized path-specific instruction files.
- `agents/` keeps thin GitHub custom agent profiles that point to `.ai/agents/`.
- `agents/subagents.md` points back to the canonical `.ai` agent index.
- `notes/` points to the canonical architecture and design notes in `.ai/notes/`.
- `plans/` points to the canonical project plan in `.ai/plans/`.

Purpose split:

- `.ai/` is the main AI memory and source of truth.
- `.github/` should stay thin and should reference `.ai/` files instead of copying them.
- GitHub-recognized instruction and agent files live in `copilot-instructions.md`, `instructions/*.instructions.md`, and `agents/*.agent.md`.
