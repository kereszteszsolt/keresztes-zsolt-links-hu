<!--
  Profile Link Starter - tiles.vue
  Renders the embeddable tile grid filtered by query parameters.

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
  '--embed-gap': '0.75rem',
  '--embed-padding': '0.75rem',
  '--embed-container-width': requestedWidth.value ? `${requestedWidth.value}rem` : '100%'
}))
const tileGridStyle = computed(() =>
  requestedColumns.value
    ? {
        gridTemplateColumns: `repeat(${requestedColumns.value}, minmax(0, 1fr))`
      }
    : undefined
)

useSeoMeta({
  title: `${ui.viewModes.tiles} embed | ${site.siteTitle}`,
  description: `${ui.viewModes.tiles} embed view for ${site.siteName}.`,
  robots: 'noindex, nofollow'
})
</script>

<template>
  <main class="embed-page" :style="pageStyle">
    <div class="embed-frame">
      <div v-if="filteredLinks.length" class="tile-link-grid" :style="tileGridStyle">
        <LinkTile
          v-for="entry in filteredLinks"
          :key="entry.id"
          :entry="entry"
          :featured-label="ui.featuredLabel"
          class="tile-item-grid"
        />
      </div>
      <p v-else class="embed-empty">{{ ui.embedEmptyState }}</p>
    </div>
  </main>
</template>
