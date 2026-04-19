<!--
  Profile Link Starter - LinkTile.vue
  Renders the tile-card link view used across directory and embed views.

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
  featuredLabel: string
}>()

const {
  providerMarks,
  toProviderKey,
  getEntryIcon,
  getProviderColor,
  getProviderLabel,
  getProfileId,
  getHighlightedUrlParts
} = useLinkPresentation()

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
const tileUrlParts = computed(() => getHighlightedUrlParts(props.entry))
const displayTitle = computed(() => props.entry.title?.trim() || providerLabel.value)
const displayIdentity = computed(() => {
  const profileId = getProfileId(props.entry.url, props.entry.profileId)?.trim()

  if (!profileId || profileId === displayTitle.value) {
    return ''
  }

  return profileId
})
const tileStyle = computed(() => {
  const tileScale = props.entry.styles?.tileScale ?? props.entry.styles?.iconScale ?? 1

  return {
    '--tile-accent': `var(--embed-item-accent, ${getProviderColor(props.entry.provider)})`,
    '--table-icon-scale': String(tileScale)
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
    class="link-tile"
    :class="{ 'link-tile-disabled': linkTarget.disabled }"
    :aria-disabled="linkTarget.disabled ? 'true' : 'false'"
    :target="linkTarget.target"
    :rel="linkTarget.rel"
    :tabindex="linkTarget.disabled ? -1 : undefined"
    :style="tileStyle"
  >
    <div class="link-tile-top">
      <span class="table-icon link-tile-icon">
        <img
          v-if="providerIcon"
          :src="providerIcon"
          :alt="entry.provider"
          class="provider-icon-img"
        >
        <span v-else class="provider-mark">{{ providerMark }}</span>
      </span>

      <div class="link-tile-heading">
        <div class="link-tile-providerline">
          <span class="link-tile-provider">{{ providerLabel }}</span>
          <span v-if="isFeatured" class="row-featured">{{ featuredLabel }}</span>
        </div>
        <strong class="link-tile-title">{{ displayTitle }}</strong>
      </div>
    </div>

    <p class="link-tile-description">{{ entry.description }}</p>

    <div class="link-tile-footer">
      <div v-if="displayIdentity" class="link-tile-meta-row">
        <span class="link-tile-meta-label">ID:</span>
        <span class="link-tile-identity">{{ displayIdentity }}</span>
      </div>

      <div class="link-tile-meta-row">
        <span class="link-tile-meta-label">Link:</span>
        <span class="row-url link-tile-url">
          <span class="link-tile-url-prefix">{{ tileUrlParts.prefix }}</span>
          <span
            v-if="tileUrlParts.hasIdentifier"
            class="link-tile-url-identifier row-url-identifier"
          >
            {{ tileUrlParts.identifier }}
          </span>
        </span>
      </div>
    </div>
  </a>
</template>

<style scoped src="../assets/styles/components/link-tile.css"></style>
