<!--
  Profile Link Starter - list.vue
  Renders the embeddable compact link list filtered by query parameters.

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
  readEmbedColorStyle,
  readQueryNumber,
  readTagQuery
} from '~/composables/useLinkCollection'

const route = useRoute()
const { links, site, ui } = useSiteData()

const requestedWidth = computed(() => readQueryNumber(route.query, 'with'))
const activeTags = computed(() => readTagQuery(route.query))
const filteredLinks = computed(() => filterLinksByTags(links, activeTags.value))
const embedColorStyle = computed(() => readEmbedColorStyle(route.query))
const pageStyle = computed(() => ({
  '--embed-padding': '0.75rem',
  '--embed-container-width': requestedWidth.value ? `${requestedWidth.value}rem` : '100%',
  ...embedColorStyle.value
}))

useSeoMeta({
  title: `${ui.viewModes.list} embed | ${site.siteTitle}`,
  description: `${ui.viewModes.list} embed view for ${site.siteName}.`,
  robots: 'noindex, nofollow'
})
</script>

<template>
  <main class="embed-page" :style="pageStyle">
    <div class="embed-frame">
      <div v-if="filteredLinks.length" class="compact-list">
        <LinkDirectoryRow
          v-for="(entry, index) in filteredLinks"
          :key="entry.id"
          :entry="entry"
          :index="index"
          :featured-label="ui.featuredLabel"
        />
      </div>
      <p v-else class="embed-empty">{{ ui.embedEmptyState }}</p>
    </div>
  </main>
</template>
