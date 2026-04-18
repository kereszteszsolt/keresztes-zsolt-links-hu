# Tool Mirror Pattern

Use this rule for any future AI tool integration in this repository.

## Core Rule

- Keep `.ai/` as the only canonical AI memory layer.
- Add a tool-specific folder only when the tool officially supports repo-level files or the user or developer explicitly asks for it.
- Before adding the folder, verify the current official docs for the exact repo file or folder convention. If the convention is unclear, ask the user or developer before implementing it.

## Mirror Rule

- Write the canonical instruction, plan, note, or agent content in `.ai/` first.
- Duplicate only the minimum tool-recognized files needed for discovery.
- Keep duplicated tool files short and add a clear link back to the original `.ai/` file.
- Do not let a tool-specific folder become a second source of truth.

## Current Examples

- OpenAI Codex uses the root `AGENTS.md` entrypoint in this repository.
- GitHub Copilot uses `.github/copilot-instructions.md`, `.github/instructions/*.instructions.md`, and `.github/agents/*.agent.md`.

## Future Examples

- Claude Code currently documents project settings in `CLAUDE.md`, `.claude/` ( e.g. `~/.claude/rules`, `~/.claude/agents`, `~/.claude/plans`, `~/.claude/skills`, etc.).
- Cursor currently documents project rules in `.cursor/rules`, with `AGENTS.md` as a simple alternative.
- For Antigravity or any other future AI tool, verify the official docs at the time you add support instead of guessing the folder layout.
