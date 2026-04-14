<!--
  Profile Link Starter - index.vue
  Renders the homepage profile layout, directory views, and legal modal flow.

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
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { filterLinksByFilter, sortLinksForAllView } from '~/composables/useLinkCollection'
import type { LegalAction } from '~/types/config'

const { filters, legalDocuments, links, profile, site, ui } = useSiteData()
const {
  keywords,
  sameAs,
  shareImage,
  shareImageAlt,
  siteDescription,
  siteTitle,
  toAbsoluteUrl,
  twitterHandle
} = useSiteSeo()

const nameParts = profile.name.split(' ')
const viewMode = ref<'list' | 'badges'>('list')
const activeFilter = ref(filters[0]?.id ?? 'all')
const activeLegalDocId = ref<string | null>(null)

type HeroOverviewItem = {
  key: string
  label: string
  value: string
  kind: 'fact' | 'bio'
}

const heroOverviewItems = computed<HeroOverviewItem[]>(() => {
  const items: HeroOverviewItem[] = profile.facts.slice(0, 2).map((fact) => ({
    key: fact.id,
    label: fact.label,
    value: fact.value,
    kind: 'fact' as const
  }))

  if (profile.bio.trim()) {
    items.push({
      key: 'bio',
      label: profile.bioLabel,
      value: profile.bio,
      kind: 'bio' as const
    })
  }

  return items
})

const activeLegalDocument = computed(
  () => legalDocuments.find((document) => document.id === activeLegalDocId.value) ?? null
)

const activeLegalActions = computed<LegalAction[]>(() => activeLegalDocument.value?.actions ?? [])
const activeLegalRoute = computed(() =>
  activeLegalDocument.value ? `/${activeLegalDocument.value.id}` : '/'
)
const placeStandaloneActionLast = computed(() => activeLegalDocument.value?.id === 'contact')
const { resolvedActions: activeResolvedLegalActions } = useResolvedLegalActions(activeLegalActions)

const filteredLinks = computed(() => {
  const selectedFilter = filters.find((entry) => entry.id === activeFilter.value)
  const matchingLinks = filterLinksByFilter(links, selectedFilter)

  if (!selectedFilter || selectedFilter.type === 'all') {
    return sortLinksForAllView(matchingLinks)
  }

  return matchingLinks
})
const {
  linkSurface,
  badgeMeasure,
  widestBadgeLeftWidth,
  widestBadgeRightWidth,
  gridLayoutStyle,
  measureBadgeLayout
} = useBadgeGridLayout(filteredLinks)

const openLegalDocument = (documentId: string) => {
  activeLegalDocId.value = documentId
}

const closeLegalDocument = () => {
  activeLegalDocId.value = null
}

watch(viewMode, async () => {
  await measureBadgeLayout()
})

watch(activeLegalDocId, (value) => {
  if (typeof document === 'undefined') {
    return
  }

  document.body.style.overflow = value ? 'hidden' : ''
})

onBeforeUnmount(() => {
  if (typeof document !== 'undefined') {
    document.body.style.overflow = ''
  }
})

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: profile.name,
  url: toAbsoluteUrl(site.canonicalPath),
  image: shareImage,
  description: profile.bio,
  jobTitle: profile.roleLineText,
  sameAs,
  knowsAbout: site.discovery.intents
}

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: site.siteName,
  url: toAbsoluteUrl(site.canonicalPath),
  description: siteDescription,
  inLanguage: site.language.code
}

const linkCollectionJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: `${profile.name} link collection`,
  itemListElement: links.map((entry, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: entry.title || entry.provider,
    url: entry.url,
    description: entry.description
  }))
}

const faqJsonLd = site.discovery.faq.length
  ? {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: site.discovery.faq.map((entry) => ({
        '@type': 'Question',
        name: entry.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: entry.answer
        }
      }))
    }
  : null

useHead({
  link: [
    {
      rel: 'canonical',
      href: toAbsoluteUrl(site.canonicalPath)
    }
  ],
  meta: [
    {
      name: 'author',
      content: site.author
    },
    {
      name: 'theme-color',
      content: site.themeColor
    },
    {
      name: 'application-name',
      content: site.siteName
    },
    {
      name: 'googlebot',
      content: site.discovery.robots
    }
  ],
  script: [
    {
      key: 'person-jsonld',
      type: 'application/ld+json',
      textContent: JSON.stringify(personJsonLd)
    },
    {
      key: 'website-jsonld',
      type: 'application/ld+json',
      textContent: JSON.stringify(websiteJsonLd)
    },
    {
      key: 'link-collection-jsonld',
      type: 'application/ld+json',
      textContent: JSON.stringify(linkCollectionJsonLd)
    },
    ...(faqJsonLd
      ? [
          {
            key: 'faq-jsonld',
            type: 'application/ld+json',
            textContent: JSON.stringify(faqJsonLd)
          }
        ]
      : [])
  ]
})

useSeoMeta({
  title: siteTitle,
  description: siteDescription,
  ogTitle: siteTitle,
  ogDescription: siteDescription,
  ogType: 'website',
  ogSiteName: site.siteName,
  ogUrl: toAbsoluteUrl(site.canonicalPath),
  ogImage: shareImage,
  ogImageAlt: shareImageAlt,
  ogLocale: site.language.locale.replace('_', '-'),
  twitterCard: site.socialPreview.mode === 'custom' ? 'summary_large_image' : 'summary',
  twitterTitle: siteTitle,
  twitterDescription: siteDescription,
  twitterImage: shareImage,
  twitterImageAlt: shareImageAlt,
  twitterCreator: twitterHandle,
  twitterSite: twitterHandle,
  keywords,
  robots: site.discovery.robots
})
</script>

<template>
  <div class="page-shell">
    <div class="ambient ambient-one"></div>
    <div class="ambient ambient-two"></div>
    <SiteAnnouncement v-if="site.announcement" :announcement="site.announcement" />
    <main class="layout">
      <section class="hero panel">
        <div class="hero-grid">
          <div class="hero-copy-block">
            <div class="profile-badge">
              <a
                class="profile-avatar"
                :href="profile.avatarLink"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img :src="profile.avatarUrl" :alt="profile.avatar.alt" class="profile-avatar-img">
              </a>
              <div class="profile-badge-copy">
                <span class="profile-badge-label">{{ profile.domainLabel }}</span>
                <span class="profile-badge-meta">
                  <span
                    v-for="(line, index) in profile.roleLine"
                    :key="`role-line-${index}`"
                    class="profile-badge-meta-line"
                  >
                    {{ line }}
                  </span>
                </span>
              </div>
            </div>
            <h1 class="hero-name">
              <span>{{ nameParts[0] }}</span>
              <span>{{ nameParts.slice(1).join(' ') }}</span>
            </h1>
          </div>

          <div class="hero-card">
            <div class="hero-card-header">
              <p class="hero-card-label">{{ ui.heroCardLabel }}</p>
            </div>
            <div class="hero-facts">
              <div
                v-for="item in heroOverviewItems"
                :key="item.key"
                class="hero-fact"
                :class="{
                  'hero-fact-wide': item.kind === 'bio',
                  'hero-fact-bio': item.kind === 'bio'
                }"
              >
                <span class="hero-fact-label">{{ item.label }}</span>
                <p v-if="item.kind === 'bio'" class="hero-fact-copy">{{ item.value }}</p>
                <strong v-else>{{ item.value }}</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="directory panel">
        <div class="section-heading" :class="{ 'section-heading-compact': !ui.directoryTitle }">
          <div>
            <p class="eyebrow">{{ ui.directoryEyebrow }}</p>
            <h2 v-if="ui.directoryTitle">{{ ui.directoryTitle }}</h2>
          </div>

          <div class="section-controls">
            <div class="view-toggle" role="tablist" :aria-label="ui.directoryViewModeAriaLabel">
              <button :class="{ active: viewMode === 'list' }" type="button" @click="viewMode = 'list'">
                {{ ui.viewModes.list }}
              </button>
              <button :class="{ active: viewMode === 'badges' }" type="button" @click="viewMode = 'badges'">
                {{ ui.viewModes.badges }}
              </button>
            </div>

            <div class="view-toggle filter-toggle" role="group" :aria-label="ui.directoryFilterAriaLabel">
              <button
                v-for="filter in filters"
                :key="filter.id"
                :class="{ active: activeFilter === filter.id }"
                type="button"
                @click="activeFilter = filter.id"
              >
                {{ filter.label }}
              </button>
            </div>
          </div>
        </div>

        <div ref="linkSurface" class="directory-content">
          <div v-if="viewMode === 'list'" class="compact-list">
            <LinkDirectoryRow
              v-for="(entry, index) in filteredLinks"
              :key="entry.id"
              :entry="entry"
              :index="index"
              :featured-label="ui.featuredLabel"
            />
          </div>

          <div v-else class="badge-link-grid" :style="gridLayoutStyle">
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
      </section>

      <section class="footer-tile panel" :aria-label="ui.footerNavigationLabel">
        <nav class="footer-tile-actions" :aria-label="ui.footerNavigationLabel">
          <button
            v-for="document in legalDocuments"
            :key="document.id"
            class="footer-action footer-action-button"
            type="button"
            :aria-haspopup="'dialog'"
            :aria-expanded="activeLegalDocId === document.id"
            @click="openLegalDocument(document.id)"
          >
            {{ document.buttonLabel }}
          </button>
        </nav>
        <div class="footer-tile-bottom">
          <span class="footer-copyright">{{ ui.footerCopyright }}</span>
        </div>
      </section>
    </main>

    <Teleport to="body">
      <div v-if="activeLegalDocument" class="legal-modal-backdrop">
        <div
          class="legal-modal"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="`legal-modal-title-${activeLegalDocument.id}`"
        >
          <div class="legal-modal-header">
            <div>
              <p class="eyebrow">{{ activeLegalDocument.buttonLabel }}</p>
              <h2 :id="`legal-modal-title-${activeLegalDocument.id}`">{{ activeLegalDocument.title }}</h2>
            </div>
            <button
              class="legal-modal-close"
              type="button"
              :aria-label="ui.footerModalCloseLabel"
              @click="closeLegalDocument"
            >
              {{ ui.footerModalCloseLabel }}
            </button>
          </div>

          <p v-if="activeLegalDocument.updatedAtLabel && activeLegalDocument.updatedAt" class="legal-modal-updated">
            {{ activeLegalDocument.updatedAtLabel }}: {{ activeLegalDocument.updatedAt }}
          </p>

          <div class="legal-modal-body">
            <section
              v-for="section in activeLegalDocument.sections"
              :key="section.heading"
              class="legal-modal-section"
            >
              <h3 v-if="section.heading">{{ section.heading }}</h3>
              <p v-for="paragraph in section.paragraphs" :key="paragraph">
                {{ paragraph }}
              </p>
            </section>
          </div>

          <div v-if="activeResolvedLegalActions.length" class="legal-modal-actions">
            <NuxtLink v-if="!placeStandaloneActionLast" class="legal-modal-action" :to="activeLegalRoute">
              Open standalone page
            </NuxtLink>
            <template v-for="action in activeResolvedLegalActions" :key="`${activeLegalDocument?.id}-${action.key}`">
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
            <NuxtLink v-if="placeStandaloneActionLast" class="legal-modal-action" :to="activeLegalRoute">
              Open standalone page
            </NuxtLink>
          </div>
          <div v-else class="legal-modal-actions">
            <NuxtLink class="legal-modal-action" :to="activeLegalRoute">
              Open standalone page
            </NuxtLink>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped src="../assets/styles/pages/home.css"></style>
