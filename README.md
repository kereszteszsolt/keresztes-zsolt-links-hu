# links-hu

This repository contains the live, site-specific implementation of my personal links website.
It is built from my **Profile Links Starter** template, which I created as a reusable starting point for myself and for others who want to build a similar profile or link collection site.

[profile-links-starter](https://github.com/kereszteszsolt/profile-links-starter)

## Recommended starting point

If you want to create your own version, use the **Profile Links Starter** template repository as your starting point instead of copying or forking this repository directly.

Unlike this repository, the template is intentionally prepared for reuse and includes placeholder content designed to be replaced during customization.

This repository should be understood as a real, live project built from that template, not as a general-purpose starter or example project.

## Embeds

This repo exposes three reusable embed routes:

- `/embed/tiles` supports `with`, `col`, `tags`, plus color overrides `accent`, `itemBg`, `itemBorder`, `text`, `muted`, and `iconBg`
- `/embed/list` supports `with`, `tags`, plus the same color overrides
- `/embed/badges` supports `with`, `col`, and `tags`

Color values can be passed either as plain hex like `ff6b2c` or URL-encoded with `#` like `%23ff6b2c`.

Examples:

```text
/embed/tiles?with=36&col=2&tags=dev,code&accent=ff6b2c&itemBg=fff4ec&itemBorder=ffc39e&text=22160c&muted=8a5a35&iconBg=ff6b2c
/embed/list?with=40&tags=social-media&accent=%23007a5a&itemBg=%23eefcf7&itemBorder=%23b6ead7&text=%230f2d24&muted=%23506f66&iconBg=%23007a5a
/embed/badges?with=32&col=2&tags=projects
```

## License and reuse

**Code license: Apache License 2.0**

The source code of this website is available under the Apache License 2.0, and you may reuse the code in accordance with that license.

If you study or reuse parts of this repository, replace or adapt any site-specific content, data, branding, identifiers, and assets so that your version does not misrepresent, copy, or appear affiliated with the original project.

## Icons and visual assets

Most of the generic icons used in this project come from **UXWing** or other third-party sources and remain subject to their respective license terms.

This repository may also include custom application or project icons that represent the identity and branding of specific projects. Those project-specific icons are not intended for general reuse in unrelated projects or branding. They should only be used when referring to the specific project they belong to, and not in any way that suggests ownership, identity, endorsement, or affiliation.
