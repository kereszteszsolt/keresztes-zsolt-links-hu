---
name: eslint-typescript
description: Use when enforcing TypeScript quality, linting rules, typing strategy, and maintainable frontend code standards.
---

# ESLint TypeScript

Use this skill for type-safe, lint-clean frontend work.

## Default Approach

1. Prefer accurate types over loose escape hatches.
2. Avoid `any` unless there is a documented short-term reason.
3. Keep types close to where they are owned.
4. Treat lint warnings as design feedback, not just formatting cleanup.

## Project Defaults

- favor readable types and inference where it stays clear
- keep public component, composable, and config contracts typed
- keep config loaders, SEO helpers, and generator scripts typed and easy to audit
- use ESLint and TypeScript together to prevent drift in code quality
