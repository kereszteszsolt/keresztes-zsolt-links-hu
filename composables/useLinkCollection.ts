/*
 * Profile Link Starter - useLinkCollection.ts
 * Filters link collections and reads embed query parameters.
 *
 * Copyright 2026 Keresztes Zsolt
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import type { LocationQuery } from 'vue-router'
import type { LinkEntry, LinkFilter } from '~/types/config'

export const normalizeCollectionValue = (value: string) => value.trim().toLowerCase()

const HEX_COLOR_PATTERN = /^#?(?:[0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i

const allViewOrder = [
  'youtube-en',
  'youtube-hu',
  'tiktok-en',
  'tiktok-hu',
  'linkedin',
  'x',
  'support',
  'github',
  'project-collection',
  'website-en',
  'website-hu',
  'link-collection-en',
  'link-collection-hu',
  'facebook',
  'instagram',
  'focus-guard'
] as const

const duplicateAllViewAliases = new Map<string, string>([['project-collection-links', 'project-collection']])

const readQueryValues = (query: LocationQuery, key: string) => {
  const value = query[key]
  return Array.isArray(value) ? value : [value]
}

const expandShortHexColor = (value: string) =>
  value.length === 3 || value.length === 4
    ? value.split('').map((segment) => `${segment}${segment}`).join('')
    : value

export const normalizeHexColor = (value?: string | null) => {
  const trimmed = value?.trim()

  if (!trimmed || !HEX_COLOR_PATTERN.test(trimmed)) {
    return undefined
  }

  const compactHex = trimmed.startsWith('#') ? trimmed.slice(1) : trimmed
  return `#${expandShortHexColor(compactHex).toLowerCase()}`
}

const hexColorToRgb = (value: string) => {
  const normalizedColor = normalizeHexColor(value)

  if (!normalizedColor) {
    return undefined
  }

  const compactHex = normalizedColor.slice(1)
  const opaqueHex = compactHex.length === 6 ? `${compactHex}ff` : compactHex
  const alphaChannel = Number.parseInt(opaqueHex.slice(6, 8), 16) / 255

  return {
    red: Number.parseInt(opaqueHex.slice(0, 2), 16),
    green: Number.parseInt(opaqueHex.slice(2, 4), 16),
    blue: Number.parseInt(opaqueHex.slice(4, 6), 16),
    alpha: Number.isFinite(alphaChannel) ? alphaChannel : 1
  }
}

const applyHexOpacity = (value: string, opacity: number) => {
  const parsedColor = hexColorToRgb(value)

  if (!parsedColor) {
    return undefined
  }

  const normalizedOpacity = Math.max(0, Math.min(1, opacity))
  const alpha = Number((parsedColor.alpha * normalizedOpacity).toFixed(3))

  return `rgba(${parsedColor.red}, ${parsedColor.green}, ${parsedColor.blue}, ${alpha})`
}

export const readQueryNumber = (query: LocationQuery, key: string) => {
  const [raw] = readQueryValues(query, key)

  if (typeof raw === 'string' && raw.trim()) {
    const parsed = Number(raw)

    if (Number.isFinite(parsed)) {
      return parsed
    }
  }

  return undefined
}

export const clampQueryNumber = (
  value: number | undefined,
  options: {
    min?: number
    max?: number
    allowDecimal?: boolean
  } = {}
) => {
  if (!Number.isFinite(value)) {
    return undefined
  }

  const normalized = options.allowDecimal ? value : Math.floor(value)
  const boundedMin = Number.isFinite(options.min) ? options.min : Number.NEGATIVE_INFINITY
  const boundedMax = Number.isFinite(options.max) ? options.max : Number.POSITIVE_INFINITY

  if (normalized < boundedMin) {
    return boundedMin
  }

  if (normalized > boundedMax) {
    return boundedMax
  }

  return normalized
}

export const readClampedQueryNumber = (
  query: LocationQuery,
  key: string,
  options: {
    min?: number
    max?: number
    allowDecimal?: boolean
  } = {}
) => {
  const value = readQueryNumber(query, key)

  return value == null ? undefined : clampQueryNumber(value, options)
}

export const readHexColorQuery = (query: LocationQuery, key: string) => {
  const [raw] = readQueryValues(query, key)
  return typeof raw === 'string' ? normalizeHexColor(raw) : undefined
}

export const readTagQuery = (query: LocationQuery, key = 'tags') =>
  readQueryValues(query, key)
    .flatMap((entry) => (typeof entry === 'string' ? entry.split(',') : []))
    .map(normalizeCollectionValue)
    .filter(Boolean)

export const readEmbedColorStyle = (query: LocationQuery) => {
  const accent = readHexColorQuery(query, 'accent')
  const itemBackground = readHexColorQuery(query, 'itemBg')
  const itemBorder = readHexColorQuery(query, 'itemBorder')
  const text = readHexColorQuery(query, 'text')
  const muted = readHexColorQuery(query, 'muted')
  const iconBackground = readHexColorQuery(query, 'iconBg')
  const style: Record<string, string> = {}

  if (accent) {
    style['--accent'] = accent
    style['--accent-strong'] = accent
    style['--accent-soft'] = applyHexOpacity(accent, 0.14) ?? accent
    style['--embed-accent-muted'] = applyHexOpacity(accent, 0.72) ?? accent
    style['--embed-featured-background'] = applyHexOpacity(accent, 0.1) ?? accent
    style['--embed-featured-color'] = applyHexOpacity(accent, 0.9) ?? accent
    style['--embed-item-accent'] = accent

    if (!iconBackground) {
      style['--icon-square'] = accent
    }
  }

  if (itemBackground) {
    style['--embed-item-background'] = itemBackground
    style['--embed-item-background-top'] = itemBackground
    style['--embed-item-background-bottom'] = itemBackground
  }

  if (itemBorder) {
    style['--embed-item-border'] = itemBorder
  }

  if (text) {
    style['--text'] = text
  }

  if (muted) {
    style['--muted'] = muted
  }

  if (iconBackground) {
    style['--icon-square'] = iconBackground
  }

  return style
}

export const filterLinksByFilter = (
  links: LinkEntry[],
  activeFilter: LinkFilter | undefined
) => {
  if (!activeFilter || activeFilter.type === 'all') {
    return links
  }

  const categories = new Set((activeFilter.categories ?? []).map(normalizeCollectionValue))

  return links.filter((entry) => categories.has(normalizeCollectionValue(entry.category)))
}

export const filterLinksByTags = (links: LinkEntry[], activeTags: string[]) => {
  if (!activeTags.length) {
    return links
  }

  const normalizedTags = new Set(activeTags.map(normalizeCollectionValue))

  return links.filter((entry) =>
    entry.tags.some((tag) => normalizedTags.has(normalizeCollectionValue(tag)))
  )
}

const resolveAllViewId = (entry: LinkEntry) => duplicateAllViewAliases.get(entry.id) ?? entry.id

export const sortLinksForAllView = (links: LinkEntry[]) => {
  const order = allViewOrder
  const orderIndex = new Map(order.map((id, index) => [id, index]))
  const sourceIndex = new Map(links.map((entry, index) => [entry.id, index]))
  const seenIds = new Set<string>()

  return links
    .filter((entry) => {
      const resolvedId = resolveAllViewId(entry)

      if (seenIds.has(resolvedId)) {
        return false
      }

      seenIds.add(resolvedId)
      return true
    })
    .slice()
    .sort((left, right) => {
      const leftOrder = orderIndex.get(resolveAllViewId(left)) ?? Number.MAX_SAFE_INTEGER
      const rightOrder = orderIndex.get(resolveAllViewId(right)) ?? Number.MAX_SAFE_INTEGER

      if (leftOrder !== rightOrder) {
        return leftOrder - rightOrder
      }

      return (sourceIndex.get(left.id) ?? Number.MAX_SAFE_INTEGER) - (sourceIndex.get(right.id) ?? Number.MAX_SAFE_INTEGER)
    })
}
