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

const allViewOrder = [
  'youtube-hu',
  'youtube-en',
  'tiktok-hu',
  'tiktok-en',
  'linkedin',
  'x',
  'support',
  'github',
  'project-collection',
  'website-hu',
  'website-en',
  'link-collection-hu',
  'link-collection-en',
  'facebook',
  'instagram',
  'focus-guard'
] as const

const duplicateAllViewAliases = new Map<string, string>([['project-collection-links', 'project-collection']])

const readQueryValues = (query: LocationQuery, key: string) => {
  const value = query[key]
  return Array.isArray(value) ? value : [value]
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

export const readTagQuery = (query: LocationQuery, key = 'tags') =>
  readQueryValues(query, key)
    .flatMap((entry) => (typeof entry === 'string' ? entry.split(',') : []))
    .map(normalizeCollectionValue)
    .filter(Boolean)

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
