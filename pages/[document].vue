<!--
  Profile Link Starter - [document].vue
  Renders direct legal document routes from the shared config content.

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
const route = useRoute()
const { legalDocuments, site } = useSiteData()
const { toAbsoluteUrl } = useSiteSeo()

const documentId = String(route.params.document ?? '').trim().toLowerCase()
const legalDocument = legalDocuments.find((entry) => entry.id === documentId) ?? null

if (!legalDocument) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Legal document not found.'
  })
}

const { resolvedActions: resolvedLegalActions } = useResolvedLegalActions(legalDocument.actions ?? [])

const pageTitle = `${legalDocument.title} | ${site.siteTitle}`
const pageDescription = `${legalDocument.title} a(z) ${site.siteName} webhelyhez.`
const pageUrl = toAbsoluteUrl(`/${legalDocument.id}`)

useHead({
  link: [
    {
      rel: 'canonical',
      href: pageUrl
    }
  ]
})

useSeoMeta({
  title: pageTitle,
  description: pageDescription,
  ogTitle: pageTitle,
  ogDescription: pageDescription,
  ogType: 'article',
  ogUrl: pageUrl,
  robots: site.discovery.robots
})
</script>

<template>
  <div class="page-shell">
    <div class="ambient ambient-one"></div>
    <div class="ambient ambient-two"></div>
    <SiteAnnouncement v-if="site.announcement" :announcement="site.announcement" />
    <main class="layout legal-layout">
      <section class="panel legal-page-panel">
        <NuxtLink class="legal-back-link" to="/">
          Vissza a linkgyűjteményhez
        </NuxtLink>
        <div class="legal-page-header">
          <div>
            <p class="eyebrow">{{ legalDocument.buttonLabel }}</p>
            <h1>{{ legalDocument.title }}</h1>
          </div>
          <p v-if="legalDocument.updatedAtLabel && legalDocument.updatedAt" class="legal-modal-updated">
            {{ legalDocument.updatedAtLabel }}: {{ legalDocument.updatedAt }}
          </p>
        </div>

        <div class="legal-modal-body">
          <section
            v-for="section in legalDocument.sections"
            :key="section.heading"
            class="legal-modal-section"
          >
            <h2 v-if="section.heading">{{ section.heading }}</h2>
            <p v-for="paragraph in section.paragraphs" :key="paragraph">
              {{ paragraph }}
            </p>
          </section>
        </div>

        <div v-if="resolvedLegalActions.length" class="legal-modal-actions">
          <template v-for="action in resolvedLegalActions" :key="`${legalDocument.id}-${action.key}`">
            <a
              v-if="action.href"
              class="legal-modal-action"
              :href="action.href"
              :target="action.target"
              :rel="action.rel"
            >
              {{ action.label }}
            </a>
            <span v-else class="legal-modal-action legal-modal-action-disabled" aria-disabled="true">
              {{ action.label }}
            </span>
          </template>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped src="../assets/styles/pages/legal.css"></style>
