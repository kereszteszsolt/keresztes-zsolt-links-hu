# Subagents

This file is the canonical index for reusable agent roles in this repository.
Repo-level Codex guidance lives in `AGENTS.md`.

Canonical agent files:

- [Product Planner](./product-planner.md)
- [UX Design Analyst](./ux-design-analyst.md)
- [SEO And Content Architect](./seo-and-content-architect.md)
- [Documentation And Release Engineer](./documentation-and-release-engineer.md)
- [QA Reviewer](./qa-reviewer.md)
- [AI Memory And Agent Files Specialist](./ai-memory-and-agent-files-specialist.md)

Mirror layers:

- `.codex/agents/` keeps thin duplicate reference files for Codex-facing discovery.
- `.github/agents/` keeps thin duplicate reference files and GitHub custom agent profiles.

## Orchestration

- Use multiple subagents when a task naturally breaks into separate analysis, planning, implementation, or verification work.
- For medium or larger tasks, prefer a planning-oriented pass, an implementation pass, and a review or QA pass when those responsibilities can be split cleanly.
- Keep trivial edits lightweight and avoid extra agent overhead when parallel work would add more ceremony than value.
- Use [Product Planner](./product-planner.md) for sequencing and [QA Reviewer](./qa-reviewer.md) for cleanup and verification when those roles fit the task.
