---
applyTo: "AGENTS.md,.ai/**,.codex/**,.github/**"
description: "Maintain the GitHub Copilot adapter as a thin mirror of canonical .ai guidance."
---

Canonical AI guidance lives in `.ai/`.

When editing AI guidance, planning workspace files, or GitHub Copilot config:

- follow `.ai/rules/guidance-structure.md`
- follow `.ai/rules/multi-agent-execution.md`
- keep `.github/copilot-instructions.md` as the GitHub Copilot entrypoint
- keep `.github/instructions/**` thin and linked back to `.ai/rules/*` or `.ai/skills/*`
- keep `.github/agents/*.agent.md` aligned with matching `.ai/agents/*.md`
- keep canonical `.ai/` content inside `.ai/agents/`, `.ai/rules/`, and `.ai/skills/` only
- treat `.aiplan/` as temporary and clean up active task artifacts after execution
- do not rebuild `.github/notes/`, `.github/plans/`, `.ai/notes/`, or `.ai/plans/`
- leave `.github/workflows/deploy-gh-pages.yml` alone unless the task is explicitly about the workflow
