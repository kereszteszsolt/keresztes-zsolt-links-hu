# Design Audit

Reference: `zsoltkeresztes.com`

## Keep

- warm paper background and terracotta accent
- large rounded glass panels
- oversized split hero name
- profile chip with circular avatar
- list and badge link directory modes
- soft hover lifts and short transitions
- footer/legal area as the third major panel

## Essential reference files

- `assets/styles/tokens.css`
- `assets/styles/base.css`
- `assets/styles/pages/home.css`
- `assets/styles/shared/badge-grid.css`
- `assets/styles/components/link-badge.css`
- `components/LinkBadge.vue`
- `components/LinkDirectoryRow.vue`
- `composables/useBadgePresentation.ts`

## Removed from the starter

- locale switcher
- translation-key indirection
- extra multi-locale runtime logic

## Added back deliberately

- lightweight embed pages for `badges` and `list`
- simplified embed query contract for reuse without the larger docs surface

## Simplification rule

Keep the visual result recognizable, but move all fork-owner content into plain JSON configs.
