# Adding New Feature Rule

Status: Active

Use this rule as the default workflow for introducing new work in this repository.

## Starter Workflow

1. Clarify the user problem, expected outcome, and whether the request is a site-wide pattern change or a site-specific content or behavior change.
2. Check whether the feature belongs in config, components, composables, pages, or generator scripts.
3. Review architecture, UI/UX, SEO or AI discoverability, legal, and deployment impact before coding.
4. Prefer config changes first when the request is about visible identity, links, labels, legal content, SEO copy, or discovery text.
5. Implement the smallest useful slice first.
6. Keep naming, structure, and styling aligned with existing patterns.
7. Verify functionality, accessibility, static generation, and discoverability before closing.
8. Update project guidance when the feature introduces a new stable pattern.

## Definition Of Done Expectations

- fork-owner content remains editable through config where practical
- generated files are produced from source config or scripts, not hand-edited
- direct legal routes, embed routes, and homepage behavior still work
- GitHub Pages and base-path assumptions are not broken by the change
