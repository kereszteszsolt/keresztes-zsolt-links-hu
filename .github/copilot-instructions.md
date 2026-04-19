Canonical project guidance lives in `.ai/`.

Use this file as the GitHub Copilot repository-wide entrypoint.

For non-trivial work:

1. Read `.ai/rules/multi-agent-execution.md` and `.ai/rules/project-architecture.md`.
2. Read `.ai/rules/adding-new-feature.md` for delivery flow.
3. Use `.aiplan/` for plan, argument, and consensus while the task is active.
4. Choose the best-fit role from `.ai/agents/subagents.md` or the matching `.github/agents/*.agent.md` profile.
5. Apply the matching rule and skill instructions from `.github/instructions/`.

When editing AI guidance or Copilot configuration:

- use `.ai/rules/guidance-structure.md`
- keep `.ai/` canonical
- keep only `.ai/agents/`, `.ai/rules/`, and `.ai/skills/` as canonical `.ai` folders
- keep `.github/instructions/` and `.github/agents/` aligned with `.ai/`
- keep `.github/` as a thin GitHub Copilot adapter layer
- clean up temporary `.aiplan/` files when the task is fully executed

Current project defaults:

- Nuxt
- Vue
- TypeScript
- ESLint
- Vanilla CSS
- config-first content in `config/*.json`
- single-language live profile links site
- static-friendly output for GitHub Pages
- direct legal routes plus `robots.txt`, `sitemap.xml`, and `llms.txt` discovery assets
