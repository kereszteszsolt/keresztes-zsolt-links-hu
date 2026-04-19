/*
 * Profile Link Starter - sync-static-seo.mjs
 * Generates static SEO and AI discovery files from project config.
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

import { existsSync, mkdirSync, readFileSync, readdirSync, unlinkSync, writeFileSync } from 'node:fs'
import { basename, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  parseLegalRouteSurfaces,
  resolveAppBasePath,
  resolvePublicSiteUrl
} from '../utils/site-config-contract.mjs'

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const configDir = resolve(rootDir, 'config')
const publicDir = resolve(rootDir, 'public')

const loadJson = (path) =>
  JSON.parse(readFileSync(resolve(configDir, path), 'utf8'))

const loadOptionalJson = (path, fallback = {}) => {
  const filePath = resolve(configDir, path)

  if (!existsSync(filePath)) {
    return fallback
  }

  return JSON.parse(readFileSync(filePath, 'utf8'))
}

const resolveRepositorySegment = () => {
  const repository = process.env.GITHUB_REPOSITORY?.trim()
  const repositoryName = repository?.split('/')[1]?.trim()

  if (repositoryName) {
    return repositoryName
  }

  return basename(rootDir.replace(/[\\/]+$/, ''))
}

const routeSurfaceEntries = parseLegalRouteSurfaces(loadJson('route-surfaces.json'))
const legalDocumentIndex = new Map()
const legalDocumentFiles = readdirSync(resolve(configDir, 'legal')).filter((entry) => entry.endsWith('.json'))

for (const legalFile of legalDocumentFiles) {
  const path = `legal/${legalFile}`
  const rawLegalDocument = loadJson(path)
  const legalId = String(rawLegalDocument?.id ?? '').trim().toLowerCase()

  if (!legalId) {
    throw new Error(`[config] Missing id in config/${path}`)
  }

  if (legalDocumentIndex.has(legalId)) {
    throw new Error(`[config] Duplicate legal document id "${legalId}" in config/legal/*.json`)
  }

  legalDocumentIndex.set(legalId, rawLegalDocument)
}

const legalPrerenderRoutes = []
const legalSitemapRoutes = []
const legalSurfaceIds = new Set()

for (const entry of routeSurfaceEntries) {
  const legalId = entry.id
  const legalDocument = legalDocumentIndex.get(legalId)

  if (!legalDocument) {
    throw new Error(
      `[config] Missing legal document file for route "${entry.path}" in config/legal/${legalId}.json`
    )
  }

  const documentId = String(legalDocument.id ?? '').trim().toLowerCase()
  if (documentId !== legalId) {
    throw new Error(
      `[config] config/legal/${legalId}.json must use id "${legalId}" but has "${documentId}"`
    )
  }

  legalSurfaceIds.add(legalId)

  if (entry.prerender) {
    legalPrerenderRoutes.push(entry.path)
  }

  if (entry.sitemap) {
    legalSitemapRoutes.push(entry.path)
  }
}

for (const legalId of legalDocumentIndex.keys()) {
  if (!legalSurfaceIds.has(legalId)) {
    throw new Error(
      `[config] config/legal/${legalId}.json exists but no corresponding route is declared in config/route-surfaces.json`
    )
  }
}
const toTrimmedString = (value) => (typeof value === 'string' ? value.trim() : '')
const toTextList = (value) =>
  Array.isArray(value)
    ? value.map((entry) => toTrimmedString(entry)).filter(Boolean)
    : []
const toQuestionAnswerList = (value) =>
  Array.isArray(value)
    ? value
        .map((entry) => ({
          question: toTrimmedString(entry?.question),
          answer: toTrimmedString(entry?.answer)
        }))
        .filter((entry) => entry.question && entry.answer)
    : []
const toBodyParagraphs = (value) =>
  Array.isArray(value)
    ? value
        .map((entry) => ({
          title: toTrimmedString(entry?.title),
          text: toTrimmedString(entry?.text)
        }))
        .filter((entry) => entry.text)
    : []

const renderBulletList = (items) => items.map((entry) => `- ${entry}`).join('\n')
const renderQnaList = (items) => items.map((entry) => `- K: ${entry.question}\n  V: ${entry.answer}`).join('\n')
const renderSection = (title, blocks) => {
  const content = blocks.filter(Boolean)

  if (!content.length) {
    return ''
  }

  return [`## ${title}`, ...content].join('\n\n')
}

const site = loadJson('site.json')
const links = loadJson('links.json')
const profile = loadJson('profile.json')
const llms = loadOptionalJson('llms.json', {})
const appBaseUrl = resolveAppBasePath({
  siteUrl: site.siteUrl,
  configuredBaseUrl: process.env.NUXT_APP_BASE_URL,
  repository: resolveRepositorySegment(),
  isProduction: process.env.NODE_ENV === 'production'
})
const siteUrl = resolvePublicSiteUrl(site.siteUrl, appBaseUrl)
const legalPrerenderPaths = Array.from(new Set(legalPrerenderRoutes))
const legalSitemapPaths = Array.from(new Set(legalSitemapRoutes))
const routes = ['/', ...legalPrerenderPaths]
const sitemapRoutes = Array.from(new Set([
  ...routes,
  ...legalSitemapPaths,
  ...(site.discovery?.includeLlmsTxtInSitemap ? ['/llms.txt'] : [])
]))

const roleLines = Array.isArray(profile.roleLine)
  ? profile.roleLine.map((entry) => toTrimmedString(entry)).filter(Boolean)
  : [toTrimmedString(profile.roleLine)].filter(Boolean)
const profileRoleText = roleLines.join(' | ')

const categoryLabelMap = new Map(
  Array.isArray(links.filters)
    ? links.filters
        .filter((entry) => entry.type === 'category' && Array.isArray(entry.categories) && entry.categories.length === 1)
        .map((entry) => [entry.categories[0], toTrimmedString(entry.label)])
        .filter((entry) => entry[0] && entry[1])
    : []
)

const getLinkLine = (entry) => {
  const provider = toTrimmedString(entry.provider)
  const providerExtra = toTrimmedString(entry.providerExtra)
  const title = toTrimmedString(entry.title)
  const url = toTrimmedString(entry.url)
  const label = providerExtra ? `${provider} (${providerExtra})` : provider

  return title ? `- ${label}: ${title} - ${url}` : `- ${label}: ${url}`
}

const renderLinksFlat = (title) => {
  const lines = Array.isArray(links.items)
    ? links.items.map((entry) => getLinkLine(entry)).filter(Boolean)
    : []

  return renderSection(title, [lines.length ? lines.join('\n') : ''])
}

const renderLinksByCategory = (title) => {
  if (!Array.isArray(links.items) || !links.items.length) {
    return ''
  }

  const groupedEntries = new Map()

  for (const entry of links.items) {
    const categoryId = toTrimmedString(entry.category) || 'other'
    const categoryLabel = categoryLabelMap.get(categoryId) || categoryId

    if (!groupedEntries.has(categoryId)) {
      groupedEntries.set(categoryId, {
        label: categoryLabel,
        lines: []
      })
    }

    groupedEntries.get(categoryId).lines.push(getLinkLine(entry))
  }

  const blocks = Array.from(groupedEntries.values()).map(
    (entry) => `### ${entry.label}\n${entry.lines.join('\n')}`
  )

  return renderSection(title, [blocks.length ? blocks.join('\n\n') : ''])
}

const renderProfileSection = (title) => {
  const lines = [
    `- Név: ${profile.name}`,
    profile.domainLabel ? `- Domain: ${profile.domainLabel}` : '',
    profileRoleText ? `- Szerep: ${profileRoleText}` : '',
    profile.bio ? `- Bemutatkozás: ${profile.bio}` : ''
  ].filter(Boolean)

  return renderSection(title, [lines.join('\n')])
}

const renderProfileFactsSection = (title) => {
  const lines = Array.isArray(profile.facts)
    ? profile.facts
        .map((entry) => {
          const label = toTrimmedString(entry?.label)
          const value = toTrimmedString(entry?.value)
          return label && value ? `- ${label}: ${value}` : ''
        })
        .filter(Boolean)
    : []

  return renderSection(title, [lines.length ? lines.join('\n') : ''])
}

const renderAudiencesSection = (title) => {
  const items = toTextList(site.discovery?.audiences)
  return renderSection(title, [items.length ? renderBulletList(items) : ''])
}

const renderIntentsSection = (title) => {
  const items = toTextList(site.discovery?.intents)
  return renderSection(title, [items.length ? renderBulletList(items) : ''])
}

const renderFaqSection = (title) => {
  const items = toQuestionAnswerList(site.discovery?.faq)
  return renderSection(title, [items.length ? renderQnaList(items) : ''])
}

const renderExtraQnaSection = (title, qna) => {
  const items = toQuestionAnswerList(qna)
  return renderSection(title, [items.length ? renderQnaList(items) : ''])
}

const renderChapterSection = (title, section) => {
  const text = toTrimmedString(section?.text)
  const items = toTextList(section?.items)
  const body = toBodyParagraphs(section?.body).map((entry) =>
    entry.title ? `- ${entry.title}: ${entry.text}` : `- ${entry.text}`
  )

  return renderSection(title, [
    text,
    items.length ? renderBulletList(items) : '',
    body.length ? body.join('\n') : ''
  ])
}

const defaultLlmsSections = [
  { type: 'profile', title: 'Profil' },
  { type: 'profileFacts', title: 'Profiladatok' },
  { type: 'audiences', title: 'Célcsoportok' },
  { type: 'intents', title: 'Keresési szándékok' },
  { type: 'links', title: 'Elsődleges linkek', groupBy: 'flat' },
  { type: 'faq', title: 'GYIK' }
]

const llmsSections = Array.isArray(llms.sections) && llms.sections.length
  ? llms.sections
  : defaultLlmsSections

const renderedLlmsSections = llmsSections
  .map((section) => {
    const title = toTrimmedString(section?.title)

    if (!title) {
      return ''
    }

    switch (section.type) {
      case 'profile':
        return renderProfileSection(title)
      case 'profileFacts':
        return renderProfileFactsSection(title)
      case 'audiences':
        return renderAudiencesSection(title)
      case 'intents':
        return renderIntentsSection(title)
      case 'links':
        return section.groupBy === 'category'
          ? renderLinksByCategory(title)
          : renderLinksFlat(title)
      case 'faq':
        return renderFaqSection(title)
      case 'qna':
        return renderExtraQnaSection(title, section.qna)
      case 'chapter':
        return renderChapterSection(title, section)
      default:
        return ''
    }
  })
  .filter(Boolean)

mkdirSync(publicDir, { recursive: true })

const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapRoutes
  .map((route) => `  <url>\n    <loc>${route === '/' ? `${siteUrl}/` : `${siteUrl}${route}`}</loc>\n  </url>`)
  .join('\n')}
</urlset>
`

const llmsTxt = `# ${site.siteTitle}

> ${site.discovery.llmSummary}

Oldal: ${siteUrl}
Nyelv: ${site.language.code}
Szerző: ${site.author}
Kategória: ${site.discovery.category}

${renderedLlmsSections.join('\n\n')}
`

writeFileSync(resolve(publicDir, 'robots.txt'), robotsTxt)
writeFileSync(resolve(publicDir, 'sitemap.xml'), sitemapXml)
writeFileSync(resolve(publicDir, 'llms.txt'), llmsTxt)

if (site.deploy?.cname?.trim()) {
  writeFileSync(resolve(publicDir, 'CNAME'), `${site.deploy.cname.trim()}\n`)
} else {
  const cnamePath = resolve(publicDir, 'CNAME')

  if (existsSync(cnamePath)) {
    unlinkSync(cnamePath)
  }
}
