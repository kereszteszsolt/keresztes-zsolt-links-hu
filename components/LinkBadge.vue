<!--
  Profile Link Starter - LinkBadge.vue
  Renders the badge-style link card used across directory and embed views.

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
  badgeLeftWmin?: number
  badgeTextWmin?: number
  badgeGap?: number
  badgeHeight?: number
}>()

const {
  providerMarks,
  toProviderKey,
  getEntryIcon,
  getBadgeMessage,
  getProfileId,
  getBadgeColor,
  getBadge1Color
} = useBadgePresentation()

const toPixelValue = (value: number | undefined, allowZero = false) => {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return undefined
  }

  if (!allowZero && value <= 0) {
    return undefined
  }

  if (allowZero && value < 0) {
    return undefined
  }

  return `${value}px`
}

const badgeStyle = computed(() => {
  const leftMinWidth = toPixelValue(props.badgeLeftWmin)
  const textMinWidth = toPixelValue(props.badgeTextWmin)
  const badgeGap = toPixelValue(props.badgeGap, true)
  const badgeHeight = toPixelValue(props.badgeHeight)
  const style: Record<string, string> = {
    '--badge-color': getBadgeColor(
      props.entry.provider,
      props.entry.styles?.badge2Color ?? props.entry.styles?.badgeColor
    ),
    '--badge1-color': getBadge1Color(
      props.entry.provider,
      props.entry.styles?.badge1Color
    ),
    '--icon-scale': String(props.entry.styles?.iconScale ?? 1)
  }

  if (leftMinWidth) {
    style['--link-badge-left-min-width'] = leftMinWidth
  }

  if (textMinWidth) {
    style['--link-badge-text-min-width'] = textMinWidth
  }

  if (badgeGap) {
    style['--link-badge-inner-gap'] = badgeGap
  }

  if (badgeHeight) {
    style['--link-badge-height'] = badgeHeight
  }

  return style
})

const badgeMessage = computed(() =>
  getBadgeMessage(props.entry.provider, props.entry.providerExtra)
)
const tooltipTitle = computed(() => props.entry.title?.trim() || badgeMessage.value)
const tooltipDescription = computed(() => props.entry.description?.trim() || '')
const hasTooltip = computed(() => Boolean(tooltipTitle.value || tooltipDescription.value))

const providerKey = computed(() => toProviderKey(props.entry.provider))
const providerIcon = computed(() => getEntryIcon(props.entry))
const providerMark = computed(() => {
  return (
    providerMarks[providerKey.value] ??
    props.entry.provider.slice(0, 2).toUpperCase()
  )
})
</script>

<template>
  <div class="link-badge" :style="badgeStyle">
    <span class="link-badge-left">
      <span class="link-badge-icon badge-icon-frame">
        <img
          v-if="providerIcon"
          :src="providerIcon"
          :alt="entry.provider"
          class="provider-icon-img badge-provider-icon-img"
        >
        <span v-else>{{ providerMark }}</span>
      </span>
      <span class="link-badge-id">{{ getProfileId(entry.url, entry.profileId) }}</span>
    </span>
    <span class="link-badge-right">{{ badgeMessage }}</span>
    <span v-if="hasTooltip" class="link-badge-tooltip" aria-hidden="true">
      <strong class="link-badge-tooltip-title">{{ tooltipTitle }}</strong>
      <span v-if="tooltipDescription" class="link-badge-tooltip-copy">{{ tooltipDescription }}</span>
    </span>
  </div>
</template>

<style scoped src="../assets/styles/components/link-badge.css"></style>
