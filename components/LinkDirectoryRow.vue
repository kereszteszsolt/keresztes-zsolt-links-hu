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
import { useLinkPresentation } from '~/composables/useLinkPresentation'
import { resolveSafeHref } from '~/utils/safe-url'

const props = defineProps<{
  entry: LinkEntry
  index: number
  featuredLabel: string
}>()

const {
  providerMarks,
  toProviderKey,
  getEntryIcon,
  getProviderLabel,
  getHighlightedUrlParts
} = useLinkPresentation()

const rowNumber = computed(() => String(props.index + 1).padStart(2, '0'))
const isFeatured = computed(() => props.entry.featured === true || props.entry.tags.includes('featured'))
const providerLabel = computed(() =>
  getProviderLabel(props.entry.provider, props.entry.providerExtra)
)
const providerKey = computed(() => toProviderKey(props.entry.provider))
const providerIcon = computed(() => getEntryIcon(props.entry))
const providerMark = computed(() => {
  return (
    providerMarks[providerKey.value] ??
    props.entry.provider.slice(0, 2).toUpperCase()
  )
})

const rowUrlParts = computed(() => getHighlightedUrlParts(props.entry))
const rowStyle = computed(() => {
  const iconScale = props.entry.styles?.iconScale ?? 1

  return {
    '--icon-scale': String(iconScale),
    '--table-icon-scale': String(iconScale)
  }
})

const linkTarget = computed(() => {
  const safeLink = resolveSafeHref(props.entry.url)

  return {
    href: safeLink?.href ?? '#',
    target: safeLink?.target,
    rel: safeLink?.rel,
    disabled: safeLink?.disabled || safeLink?.href == null
  }
})
</script>

<template>
  <a
    :href="linkTarget.href"
    class="compact-row"
    :class="{ 'compact-row-disabled': linkTarget.disabled }"
    :aria-disabled="linkTarget.disabled ? 'true' : 'false'"
    :target="linkTarget.target"
    :rel="linkTarget.rel"
    :tabindex="linkTarget.disabled ? -1 : undefined"
    :style="rowStyle"
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
