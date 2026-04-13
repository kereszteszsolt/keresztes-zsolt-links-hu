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

import { existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

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

const trimTrailingSlash = (value) => value.replace(/\/+$/, '')
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
const renderQnaList = (items) => items.map((entry) => `- Q: ${entry.question}\n  A: ${entry.answer}`).join('\n')
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
const siteUrl = trimTrailingSlash(site.siteUrl)
const routes = ['/', '/contact', '/gtc', '/privacy', '/license', '/impressum']
const sitemapRoutes = [
  ...routes,
  ...(site.discovery?.includeLlmsTxtInSitemap ? ['/llms.txt'] : [])
]

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

  return renderSection(title, blocks)
}

const renderProfileSection = (title) => {
  const lines = [
    `- Name: ${profile.name}`,
    profile.domainLabel ? `- Domain Label: ${profile.domainLabel}` : '',
    profileRoleText ? `- Role: ${profileRoleText}` : '',
    profile.bio ? `- Bio: ${profile.bio}` : ''
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
  { type: 'profile', title: 'Profile' },
  { type: 'profileFacts', title: 'Profile Facts' },
  { type: 'audiences', title: 'Audiences' },
  { type: 'intents', title: 'Search Intents' },
  { type: 'links', title: 'Primary Links', groupBy: 'flat' },
  { type: 'faq', title: 'FAQ' }
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

Site: ${siteUrl}
Language: ${site.language.code}
Author: ${site.author}
Category: ${site.discovery.category}

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
