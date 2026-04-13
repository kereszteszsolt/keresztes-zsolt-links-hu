<!--
  Profile Link Starter - LinkDirectoryRow.vue
  Renders the compact list row for a single directory link.

  Copyright 2026 Keresztes Zsolt

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
-->

<script setup lang="ts">
import { computed } from 'vue'
import type { LinkEntry } from '~/types/config'
import { useBadgePresentation } from '~/composables/useBadgePresentation'

const props = defineProps<{
  entry: LinkEntry
  index: number
  featuredLabel: string
}>()

const { providerMarks, toProviderKey, getEntryIcon, getBadgeMessage } = useBadgePresentation()

const rowNumber = computed(() => String(props.index + 1).padStart(2, '0'))
const isFeatured = computed(() => props.entry.featured === true || props.entry.tags.includes('featured'))
const shouldHighlightUrlIdentifier = computed(() => props.entry.highlightUrlIdentifier === true)
const providerLabel = computed(() =>
  getBadgeMessage(props.entry.provider, props.entry.providerExtra)
)
const providerKey = computed(() => toProviderKey(props.entry.provider))
const providerIcon = computed(() => getEntryIcon(props.entry))
const providerMark = computed(() => {
  return (
    providerMarks[providerKey.value] ??
    props.entry.provider.slice(0, 2).toUpperCase()
  )
})

const getUrlHighlightCandidates = (profileId?: string) => {
  const trimmedProfileId = profileId?.trim()

  if (!trimmedProfileId) {
    return []
  }

  return Array.from(
    new Set([
      trimmedProfileId,
      trimmedProfileId.replace(/^@+/, '')
    ].filter(Boolean))
  ).sort((left, right) => right.length - left.length)
}

const normalizeSegmentMark = (value?: number | string) => {
  const parsedValue =
    typeof value === 'number'
      ? value
      : typeof value === 'string' && value.trim()
        ? Number(value)
        : 1

  if (!Number.isFinite(parsedValue) || parsedValue < 1) {
    return 1
  }

  return Math.floor(parsedValue)
}

const rowUrlParts = computed(() => {
  if (!shouldHighlightUrlIdentifier.value) {
    return {
      prefix: props.entry.url,
      identifier: '',
      hasIdentifier: false
    }
  }

  const normalizedUrl = props.entry.url.replace(/\/+$/, '')
  const candidates = getUrlHighlightCandidates(props.entry.profileId)
  const matchingSuffix = candidates.find((candidate) => normalizedUrl.endsWith(candidate))

  if (!matchingSuffix) {
    return {
      prefix: props.entry.url,
      identifier: '',
      hasIdentifier: false
    }
  }

  const segmentMark = normalizeSegmentMark(props.entry.segmentMark)

  if (segmentMark > 1) {
    try {
      const parsedUrl = new URL(normalizedUrl)
      const pathSegments = parsedUrl.pathname.replace(/\/+$/, '').split('/').filter(Boolean)
      const matchedPathSegment = matchingSuffix.replace(/^@+/, '')
      const lastPathSegment = pathSegments[pathSegments.length - 1]

      if (
        pathSegments.length &&
        (lastPathSegment === matchedPathSegment || lastPathSegment === matchingSuffix)
      ) {
        const highlightedSegmentCount = Math.min(segmentMark, pathSegments.length)
        const highlightedPath = pathSegments.slice(-highlightedSegmentCount).join('/')
        const prefixPath = pathSegments.slice(0, -highlightedSegmentCount).join('/')

        return {
          prefix: `${parsedUrl.origin}${prefixPath ? `/${prefixPath}/` : '/'}`,
          identifier: highlightedPath,
          hasIdentifier: true
        }
      }
    } catch {
      // Fall back to the default single-suffix highlight below.
    }
  }

  return {
    prefix: normalizedUrl.slice(0, normalizedUrl.length - matchingSuffix.length),
    identifier: matchingSuffix,
    hasIdentifier: true
  }
})
const rowStyle = computed(() => {
  const iconScale = props.entry.styles?.iconScale ?? 1

  return {
    '--icon-scale': String(iconScale),
    '--table-icon-scale': String(iconScale)
  }
})
</script>

<template>
  <a
    :href="entry.url"
    class="compact-row"
    :style="rowStyle"
    target="_blank"
    rel="noreferrer noopener"
  >
    <span class="row-index">{{ rowNumber }}</span>
    <div class="row-shield">
      <span class="table-icon">
        <img
          v-if="providerIcon"
          :src="providerIcon"
          :alt="entry.provider"
          class="provider-icon-img"
        >
        <span v-else class="provider-mark">{{ providerMark }}</span>
      </span>
    </div>
    <div class="row-main">
      <div class="row-titleline">
        <strong>{{ providerLabel }}</strong>
        <span v-if="isFeatured" class="row-featured">{{ featuredLabel }}</span>
      </div>
      <p>{{ entry.description }}</p>
    </div>
    <div class="row-meta">
      <span class="row-provider">{{ entry.title || providerLabel }}</span>
      <span class="row-url">
        <span>{{ rowUrlParts.prefix }}</span>
        <span v-if="rowUrlParts.hasIdentifier" class="row-url-identifier">{{ rowUrlParts.identifier }}</span>
      </span>
    </div>
  </a>
</template>

<style scoped src="../assets/styles/components/link-directory-row.css"></style>
