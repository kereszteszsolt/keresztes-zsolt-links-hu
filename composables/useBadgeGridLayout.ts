/*
 * Profile Link Starter - useBadgeGridLayout.ts
 * Measures badge content and computes responsive badge grid layouts.
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

import { computed, nextTick, onBeforeUnmount, onMounted, ref, toValue, watch } from 'vue'
import type { MaybeRefOrGetter } from 'vue'
import type { LinkEntry } from '~/types/config'

type BadgeGridLayoutMode = 'stretch' | 'fixed'

type UseBadgeGridLayoutOptions = {
  columns?: MaybeRefOrGetter<number | undefined>
  layoutMode?: BadgeGridLayoutMode
}

const BADGE_GAP_PX = 8
const MIN_BADGE_COLUMN_WIDTH_PX = 184

export const useBadgeGridLayout = (
  links: MaybeRefOrGetter<LinkEntry[]>,
  options: UseBadgeGridLayoutOptions = {}
) => {
  const linkSurface = ref<HTMLElement | null>(null)
  const badgeMeasure = ref<HTMLElement | null>(null)
  const badgeLeftWidths = ref<Record<string, number>>({})
  const badgeRightWidths = ref<Record<string, number>>({})
  const linkSurfaceWidth = ref(0)

  const requestedColumns = computed(() => {
    const raw = toValue(options.columns)

    if (typeof raw !== 'number' || !Number.isFinite(raw)) {
      return undefined
    }

    return Math.max(1, Math.floor(raw))
  })

  const layoutMode = computed<BadgeGridLayoutMode>(() => options.layoutMode ?? 'stretch')
  const linkSignature = computed(() =>
    toValue(links)
      .map((entry) => `${entry.id}:${entry.url}`)
      .join('|')
  )

  const widestBadgeLeftWidth = computed(() => {
    const resolvedLinks = toValue(links)

    if (!resolvedLinks.length) {
      return 0
    }

    return Math.max(0, ...resolvedLinks.map((entry) => badgeLeftWidths.value[entry.url] ?? 0))
  })

  const widestBadgeRightWidth = computed(() => {
    const resolvedLinks = toValue(links)

    if (!resolvedLinks.length) {
      return 0
    }

    return Math.max(0, ...resolvedLinks.map((entry) => badgeRightWidths.value[entry.url] ?? 0))
  })

  const badgeColumnWidth = computed(() =>
    Math.max(MIN_BADGE_COLUMN_WIDTH_PX, Math.ceil(widestBadgeLeftWidth.value + widestBadgeRightWidth.value))
  )

  const gridLayoutStyle = computed(() => {
    const columnWidth = badgeColumnWidth.value
    const availableWidth = Math.max(columnWidth, Math.floor(linkSurfaceWidth.value) || columnWidth)
    const maxFitColumns = Math.max(
      1,
      Math.floor((availableWidth + BADGE_GAP_PX) / (columnWidth + BADGE_GAP_PX))
    )
    const columnCount = requestedColumns.value
      ? Math.max(1, Math.min(requestedColumns.value, maxFitColumns))
      : maxFitColumns

    if (layoutMode.value === 'fixed') {
      const gridWidth = columnCount * columnWidth + Math.max(0, columnCount - 1) * BADGE_GAP_PX

      return {
        gridTemplateColumns: `repeat(${columnCount}, minmax(0, ${columnWidth}px))`,
        width: `${gridWidth}px`
      }
    }

    return {
      gridTemplateColumns: `repeat(${columnCount}, minmax(${columnWidth}px, 1fr))`,
      width: '100%'
    }
  })

  const measureBadgeLayout = async () => {
    await nextTick()

    if (linkSurface.value) {
      linkSurfaceWidth.value = Math.floor(linkSurface.value.getBoundingClientRect().width)
    }

    if (!badgeMeasure.value) {
      return
    }

    const nextLeftWidths: Record<string, number> = {}
    const nextRightWidths: Record<string, number> = {}

    badgeMeasure.value.querySelectorAll<HTMLElement>('[data-link]').forEach((element) => {
      const link = element.dataset.link

      if (!link) {
        return
      }

      const left = element.querySelector<HTMLElement>('.link-badge-left')
      const right = element.querySelector<HTMLElement>('.link-badge-right')

      if (left) {
        nextLeftWidths[link] = Math.ceil(left.getBoundingClientRect().width)
      }

      if (right) {
        nextRightWidths[link] = Math.ceil(right.getBoundingClientRect().width)
      }
    })

    badgeLeftWidths.value = nextLeftWidths
    badgeRightWidths.value = nextRightWidths
  }

  let resizeObserver: ResizeObserver | null = null

  onMounted(async () => {
    await measureBadgeLayout()

    if (typeof ResizeObserver === 'undefined') {
      return
    }

    resizeObserver = new ResizeObserver(() => {
      void measureBadgeLayout()
    })

    if (linkSurface.value) {
      resizeObserver.observe(linkSurface.value)
    }

    if (badgeMeasure.value) {
      resizeObserver.observe(badgeMeasure.value)
    }
  })

  onBeforeUnmount(() => {
    resizeObserver?.disconnect()
  })

  watch([linkSignature, requestedColumns], async () => {
    await measureBadgeLayout()
  })

  return {
    linkSurface,
    badgeMeasure,
    widestBadgeLeftWidth,
    widestBadgeRightWidth,
    gridLayoutStyle,
    measureBadgeLayout
  }
}
