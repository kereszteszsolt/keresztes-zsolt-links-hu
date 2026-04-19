---
name: vue
description: Use when building or reviewing Vue components, Composition API logic, templates, props, emits, and component structure.
---

# Vue

Use this skill for Vue component implementation and review.

## Default Approach

1. Prefer clear single-file components with focused responsibilities.
2. Keep props and emits explicit and typed.
3. Choose simple Composition API patterns over over-engineered abstractions.
4. Make templates semantic, accessible, and easy to scan.

## Project Defaults

- favor components that are easy to reuse across homepage and embed surfaces
- keep homepage, legal-route, and embed component responsibilities obvious and separate
- keep state minimal and local unless sharing is clearly needed
- align component APIs with TypeScript and ESLint rules
