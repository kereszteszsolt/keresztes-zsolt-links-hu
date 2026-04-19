# Guidance Structure Rule

Status: Active

Use this rule whenever you add, remove, rename, or edit files inside `.ai/`, `.codex/`, `.claude/`, `.github/`, or the scaffold files inside `.aiplan/`.

## Purpose

Keep one canonical source of truth for project guidance while preserving tool-specific entrypoints for Codex, Claude, and GitHub Copilot.

## Source Of Truth

- `.ai/` is canonical.
- `.codex/` is a thin adapter layer.
- `.claude/` is a thin adapter layer.
- `.github/` is the GitHub Copilot adapter layer.
- `.aiplan/` is a temporary execution workspace.

Do not maintain duplicate full-content copies across these folders.

Within `.ai/`, keep canonical content only under:

- `agents/`
- `rules/`
- `skills/`

## Required Structure

1. Keep the full canonical content in the matching `.ai/` file.
2. Create matching thin bridge files in `.codex/` and `.claude/` only when a file should be discoverable there.
3. Keep filenames and role names aligned across adapter paths when a file exists for multiple tools.
4. Put project-specific delivery, structure, and tool-mirroring guidance into `.ai/rules/` instead of reintroducing `.ai/README.md`, `.ai/notes/`, or `.ai/plans/`.
5. Put stack and presentation guidance into `.ai/skills/` instead of creating extra canonical note files.
6. Do not mirror `.aiplan/` into `.codex/` or `.claude/`.

## GitHub Copilot Structure

Use `.github/` as the GitHub Copilot-specific adapter:

1. Keep `.github/copilot-instructions.md` as the repository-wide entrypoint.
2. Store rules and skills in `.github/instructions/` as `*.instructions.md` files.
3. Store GitHub Copilot custom agents in `.github/agents/*.agent.md`.
4. Keep `.github/` content linked back to `.ai/` instead of copying full canonical documents there.

## Adding A New Rule

1. Create the full file in `.ai/rules/`.
2. Create matching thin files in `.codex/rules/` and `.claude/rules/`.
3. Create or update the relevant `.github/instructions/rules/*.instructions.md` adapter file.
4. Point each adapter file back to the canonical `.ai/` path.
5. Update relevant indexes or README files if the new rule should be discoverable by default.

## Adding A New Agent

1. Create the full file in `.ai/agents/`.
2. Create matching thin files in `.codex/agents/` and `.claude/agents/`.
3. Create or update the matching `.github/agents/<role>.agent.md` profile.
4. Keep agent frontmatter or profile metadata aligned in the adapter files when it affects discovery or labeling.
5. Update `.ai/agents/subagents.md` and the matching adapter index files.

## Adding A New Skill

1. Create the full skill file in `.ai/skills/<skill-name>/SKILL.md`.
2. Create matching thin files in `.codex/skills/<skill-name>/SKILL.md` and `.claude/skills/<skill-name>/SKILL.md`.
3. Create or update the matching `.github/instructions/skills/<skill-name>.instructions.md` adapter file.
4. Keep skill frontmatter or labels aligned in the adapter files when it affects discovery or labeling.
5. Keep any future skill-specific assets, references, or scripts canonical in `.ai/` unless a tool requires a local adapter file.

## Editing Existing Files

1. Edit the canonical `.ai/` file first.
2. Update the thin `.codex/` and `.claude/` bridge files only if their target path, title, or frontmatter must change.
3. Update `.github/` adapter files only if their entrypoint text, path mapping, frontmatter, or agent profile metadata must change.
4. Do not copy full body content from `.ai/` into the adapter folders.

## Bridge File Pattern

Thin adapter files should stay short and explicit:

- identify themselves as thin bridge files
- point to the canonical `.ai/` path
- say that `.ai/` should be updated first

## Avoid

- duplicated full guidance in `.codex/` or `.claude/`
- duplicated full canonical guidance in `.github/`
- mismatched filenames across mirrored paths
- stale references to removed routes, components, or agent taxonomies
- reintroducing `.ai/README.md`, `.ai/notes/`, or `.ai/plans/`
- treating `.aiplan/` as a permanent documentation tree
- using symlinks as the default approach for this repo
