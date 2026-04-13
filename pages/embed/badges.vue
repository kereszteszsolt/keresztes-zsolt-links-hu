<!--
  Profile Link Starter - badges.vue
  Renders the embeddable badge grid filtered by query parameters.

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
import { computed, watch } from 'vue'
import {
  filterLinksByTags,
  readQueryNumber,
  readTagQuery
} from '~/composables/useLinkCollection'

const route = useRoute()
const { links, site, ui } = useSiteData()

const requestedColumns = computed(() => {
  const raw = readQueryNumber(route.query, 'col')
  return raw ? Math.max(1, Math.floor(raw)) : undefined
})
const requestedWidth = computed(() => readQueryNumber(route.query, 'with'))
const activeTags = computed(() => readTagQuery(route.query))
const filteredLinks = computed(() => filterLinksByTags(links, activeTags.value))
const pageStyle = computed(() => ({
  '--embed-gap': '8px',
  '--embed-padding': '0.75rem',
  '--embed-container-width': requestedWidth.value ? `${requestedWidth.value}rem` : '100%'
}))
const {
  linkSurface,
  badgeMeasure,
  widestBadgeLeftWidth,
  widestBadgeRightWidth,
  gridLayoutStyle,
  measureBadgeLayout
} = useBadgeGridLayout(filteredLinks, {
  columns: requestedColumns,
  layoutMode: 'fixed'
})

watch(
  () => route.fullPath,
  async () => {
    await measureBadgeLayout()
  }
)

useSeoMeta({
  title: `${ui.viewModes.badges} embed | ${site.siteTitle}`,
  description: `${ui.viewModes.badges} embed view for ${site.siteName}.`,
  robots: 'noindex, nofollow'
})
</script>

<template>
  <main class="embed-page" :style="pageStyle">
    <div class="embed-frame">
      <div ref="linkSurface" class="directory-content">
        <div v-if="filteredLinks.length" class="badge-link-grid" :style="gridLayoutStyle">
          <a
            v-for="entry in filteredLinks"
            :key="entry.id"
            :href="entry.url"
            class="badge-item badge-item-grid"
            target="_blank"
            rel="noreferrer noopener"
          >
            <LinkBadge
              :entry="entry"
              :badge-left-wmin="widestBadgeLeftWidth"
              :badge-text-wmin="widestBadgeRightWidth"
            />
          </a>
        </div>
        <p v-else class="embed-empty">{{ ui.embedEmptyState }}</p>

        <div ref="badgeMeasure" class="badge-measure" aria-hidden="true">
          <div
            v-for="entry in filteredLinks"
            :key="`measure-${entry.id}`"
            :data-link="entry.url"
            class="badge-measure-item"
          >
            <LinkBadge :entry="entry" />
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
