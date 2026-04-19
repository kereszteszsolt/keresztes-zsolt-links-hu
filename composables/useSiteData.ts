/*
 * Profile Link Starter - useSiteData.ts
 * Loads JSON config and resolves runtime-ready site, profile, and legal data.
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

import routeSurfacesConfig from '~/config/route-surfaces.json'
import linksJson from '~/config/links.json'
import profileJson from '~/config/profile.json'
import siteJson from '~/config/site.json'
import uiJson from '~/config/ui.json'
import { parseLegalRouteSurfaces } from '~/utils/site-config-contract.mjs'
import { resolveSafeHref } from '~/utils/safe-url'
import type {
  AnnouncementConfig,
  AvatarConfig,
  LegalDocument,
  LegalRouteSurface,
  LegalAction,
  LinkCollectionConfig,
  ProfileConfig,
  ResolvedAnnouncement,
  ResolvedProfile,
  ResolvedSite,
  SiteConfig,
  UiConfig
} from '~/types/config'

const isAbsoluteUrl = (value: string) => /^(https?:)?\/\//i.test(value)
const trimTrailingSlash = (value: string) => value.replace(/\/+$/, '')
const DEFAULT_AVATAR_SRC = '/images/your-name-avatar.svg'
const normalizeDocumentKey = (value?: string) => value?.trim().toLowerCase()

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)
const ensureString = (value: unknown, path: string) => {
  if (typeof value !== 'string') {
    throw new Error(`[config] ${path} must be a string.`)
  }

  return value.trim()
}
const ensureRequiredString = (value: unknown, path: string) => {
  const normalized = ensureString(value, path)

  if (!normalized) {
    throw new Error(`[config] ${path} is required and must not be empty.`)
  }

  return normalized
}
const ensureObject = (value: unknown, path: string) => {
  if (!isObject(value)) {
    throw new Error(`[config] ${path} must be an object.`)
  }

  return value
}
const ensureArray = <T>(value: unknown, path: string): T[] => {
  if (!Array.isArray(value)) {
    throw new Error(`[config] ${path} must be an array.`)
  }

  return value as T[]
}

const parseOptionalString = (value: unknown): string => (typeof value === 'string' ? value.trim() : '')
const parseOptionalStringArray = (value: unknown, path: string) => {
  if (value == null) {
    return []
  }

  if (!Array.isArray(value)) {
    throw new Error(`[config] ${path} must be an array.`)
  }

  return value.map((entry, index) => ensureRequiredString(entry, `${path}[${index}]`))
}
const parseStringArray = (value: unknown, path: string) => {
  if (!Array.isArray(value)) {
    throw new Error(`[config] ${path} must be an array.`)
  }

  return value.map((entry, index) => ensureRequiredString(entry, `${path}[${index}]`))
}
const parseObjectArray = (value: unknown, path: string) => {
  if (!Array.isArray(value)) {
    throw new Error(`[config] ${path} must be an array.`)
  }

  return value.map((entry, index) => {
    if (!isObject(entry)) {
      throw new Error(`[config] ${path}[${index}] must be an object.`)
    }

    return entry
  })
}

const normalizeBaseUrl = (value?: string | null) => {
  const trimmed = value?.trim()

  if (!trimmed || trimmed === '/') {
    return '/'
  }

  return `/${trimmed.replace(/^\/+|\/+$/g, '')}/`
}
const normalizeSiteUrl = (value: string) => {
  const trimmed = trimTrailingSlash(ensureRequiredString(value, 'config/site.json.siteUrl'))
  const candidates = trimmed.includes('://')
    ? [trimmed]
    : [trimmed, `https://${trimmed.replace(/^\/+/, '')}`]

  for (const candidate of candidates) {
    try {
      return trimTrailingSlash(new URL(candidate).toString())
    } catch {
      continue
    }
  }

  throw new Error('[config] config/site.json.siteUrl must be a valid absolute or host value.')
}

const normalizeBase = (value?: string | null) => {
  const trimmed = value?.trim()

  if (!trimmed || trimmed === '/') {
    return '/'
  }

  return `/${trimmed.replace(/^\/+|\/+$/g, '')}/`
}

const resolvePublicAsset = (value: string, baseUrl: string) => {
  const trimmed = value.trim()

  if (!trimmed || isAbsoluteUrl(trimmed) || !trimmed.startsWith('/')) {
    return trimmed
  }

  if (baseUrl === '/') {
    return trimmed
  }

  return `${baseUrl.replace(/\/+$/, '')}${trimmed}`
}

const parseSiteConfig = (raw: unknown): SiteConfig => {
  const value = ensureObject(raw, 'config/site.json')
  const language = ensureObject(value.language, 'config/site.json.language')
  const discovery = ensureObject(value.discovery, 'config/site.json.discovery')
  const socialPreview = ensureObject(value.socialPreview, 'config/site.json.socialPreview')

  const languageDirection = parseOptionalString(language.direction)

  if (languageDirection && languageDirection !== 'ltr' && languageDirection !== 'rtl') {
    throw new Error('[config] config/site.json.language.direction must be "ltr" or "rtl".')
  }

  const socialPreviewMode = parseOptionalString(socialPreview.mode)
  if (socialPreviewMode !== 'avatar' && socialPreviewMode !== 'custom') {
    throw new Error('[config] config/site.json.socialPreview.mode must be "avatar" or "custom".')
  }

  const socialPreviewSrc = parseOptionalString(socialPreview.src)
  if (socialPreviewMode === 'custom' && !socialPreviewSrc) {
    throw new Error('[config] config/site.json.socialPreview.src is required when mode is "custom".')
  }

  const canonicalPath = ensureRequiredString(value.canonicalPath, 'config/site.json.canonicalPath')
  if (!canonicalPath.startsWith('/')) {
    throw new Error('[config] config/site.json.canonicalPath must begin with "/".')
  }

  return {
    siteName: ensureRequiredString(value.siteName, 'config/site.json.siteName'),
    siteTitle: ensureRequiredString(value.siteTitle, 'config/site.json.siteTitle'),
    siteDescription: ensureRequiredString(value.siteDescription, 'config/site.json.siteDescription'),
    siteUrl: normalizeSiteUrl(value.siteUrl as string),
    language: {
      code: ensureRequiredString(language.code, 'config/site.json.language.code'),
      locale: ensureRequiredString(language.locale, 'config/site.json.language.locale'),
      name: parseOptionalString(language.name) || ensureRequiredString(language.code, 'config/site.json.language.code'),
      direction: languageDirection === 'rtl' ? 'rtl' : 'ltr'
    },
    themeColor: ensureRequiredString(value.themeColor, 'config/site.json.themeColor'),
    author: ensureRequiredString(value.author, 'config/site.json.author'),
    canonicalPath: canonicalPath,
    socialPreview: {
      mode: socialPreviewMode as 'avatar' | 'custom',
      src: socialPreviewSrc,
      alt: ensureRequiredString(socialPreview.alt, 'config/site.json.socialPreview.alt')
    },
    announcement: isObject(value.announcement, 'config/site.json.announcement')
      ? (value.announcement as AnnouncementConfig)
      : undefined,
    discovery: {
      keywords: parseStringArray(discovery.keywords, 'config/site.json.discovery.keywords'),
      category: ensureRequiredString(discovery.category, 'config/site.json.discovery.category'),
      robots: ensureRequiredString(discovery.robots, 'config/site.json.discovery.robots'),
      includeLlmsTxtInSitemap: typeof discovery.includeLlmsTxtInSitemap === 'boolean'
        ? discovery.includeLlmsTxtInSitemap
        : false,
      llmSummary: ensureRequiredString(discovery.llmSummary, 'config/site.json.discovery.llmSummary'),
      audiences: parseStringArray(discovery.audiences, 'config/site.json.discovery.audiences'),
      intents: parseStringArray(discovery.intents, 'config/site.json.discovery.intents'),
      faq: parseObjectArray(discovery.faq, 'config/site.json.discovery.faq').map((entry, index) =>
        normalizeFaqSection(entry, `config/site.json.discovery.faq[${index}]`)
      )
    },
    deploy: isObject(value.deploy, 'config/site.json.deploy')
      ? { cname: parseOptionalString((value.deploy as { cname?: string }).cname) }
      : undefined
  }
}

const normalizeFaqSection = (value: unknown, path: string) => {
  const section = ensureObject(value, path)

  return {
    question: ensureRequiredString(section.question, `${path}.question`),
    answer: ensureRequiredString(section.answer, `${path}.answer`)
  }
}

const parseProfileConfig = (raw: unknown): ProfileConfig => {
  const value = ensureObject(raw, 'config/profile.json')
  const avatar = ensureObject(value.avatar, 'config/profile.json.avatar')

  const avatarMode = parseOptionalString(avatar.mode)
  if (avatarMode !== 'github' && avatarMode !== 'upload') {
    throw new Error('[config] config/profile.json.avatar.mode must be "github" or "upload".')
  }

  const roleLineEntries = Array.isArray(value.roleLine)
    ? parseOptionalStringArray(value.roleLine, 'config/profile.json.roleLine')
    : [ensureRequiredString(value.roleLine, 'config/profile.json.roleLine')]

  const roleLine = roleLineEntries.filter(Boolean)
  if (!roleLine.length) {
    throw new Error('[config] config/profile.json.roleLine must contain at least one non-empty line.')
  }

  return {
    name: ensureRequiredString(value.name, 'config/profile.json.name'),
    domainLabel: ensureRequiredString(value.domainLabel, 'config/profile.json.domainLabel'),
    roleLine,
    bioLabel: ensureRequiredString(value.bioLabel, 'config/profile.json.bioLabel'),
    bio: ensureRequiredString(value.bio, 'config/profile.json.bio'),
    avatar: {
      mode: avatarMode,
      githubUsername: parseOptionalString(avatar.githubUsername),
      src: ensureRequiredString(avatar.src, 'config/profile.json.avatar.src'),
      linkUrl: parseOptionalString(avatar.linkUrl),
      alt: ensureRequiredString(avatar.alt, 'config/profile.json.avatar.alt')
    },
    facts: parseObjectArray(value.facts, 'config/profile.json.facts').map((entry, index) => ({
      id: ensureRequiredString(entry.id, `config/profile.json.facts[${index}].id`),
      label: ensureRequiredString(entry.label, `config/profile.json.facts[${index}].label`),
      value: ensureRequiredString(entry.value, `config/profile.json.facts[${index}].value`)
    })),
    sameAs: parseOptionalStringArray(value.sameAs, 'config/profile.json.sameAs')
  }
}

const parseLinkCollectionConfig = (raw: unknown): LinkCollectionConfig => {
  const value = ensureObject(raw, 'config/links.json')
  const filterEntries = parseObjectArray(value.filters, 'config/links.json.filters').map((entry, index) => {
    const filterType = parseOptionalString(entry.type)
    if (filterType !== 'all' && filterType !== 'category') {
      throw new Error(`[config] config/links.json.filters[${index}].type must be "all" or "category".`)
    }

    return {
      id: ensureRequiredString(entry.id, `config/links.json.filters[${index}].id`),
      label: ensureRequiredString(entry.label, `config/links.json.filters[${index}].label`),
      type: filterType,
      categories: parseOptionalStringArray(entry.categories, `config/links.json.filters[${index}].categories`)
    }
  })
  const seenFilterIds = new Set<string>()

  filterEntries.forEach((entry, index) => {
    if (seenFilterIds.has(entry.id)) {
      throw new Error(`[config] Duplicate filter id "${entry.id}" in config/links.json.filters[${index}]`)
    }

    seenFilterIds.add(entry.id)
  })

  return {
    filters: filterEntries,
    items: (() => {
      const items = parseObjectArray(value.items, 'config/links.json.items').map((entry, index) => {
        const linkUrl = ensureRequiredString(entry.url, `config/links.json.items[${index}].url`)

        if (!resolveSafeHref(linkUrl)) {
          throw new Error(`[config] config/links.json.items[${index}].url must be a safe link target.`)
        }

        return {
          id: ensureRequiredString(entry.id, `config/links.json.items[${index}].id`),
          url: linkUrl,
          provider: ensureRequiredString(entry.provider, `config/links.json.items[${index}].provider`),
          providerExtra: parseOptionalString(entry.providerExtra),
          category: ensureRequiredString(entry.category, `config/links.json.items[${index}].category`),
          tags: parseStringArray(entry.tags, `config/links.json.items[${index}].tags`),
          title: ensureRequiredString(entry.title, `config/links.json.items[${index}].title`),
          description: ensureRequiredString(entry.description, `config/links.json.items[${index}].description`),
          profileId: parseOptionalString(entry.profileId),
          segmentMark: typeof entry.segmentMark === 'number' ? entry.segmentMark : entry.segmentMark,
          icon: parseOptionalString(entry.icon),
          featured: typeof entry.featured === 'boolean' ? entry.featured : false,
          highlightUrlIdentifier:
            typeof entry.highlightUrlIdentifier === 'boolean' ? entry.highlightUrlIdentifier : false,
          styles: isObject(entry.styles, `${`config/links.json.items[${index}].styles`}`)
            ? {
                badgeColor:
                  typeof (entry.styles as { badgeColor?: unknown }).badgeColor === 'string'
                    ? (entry.styles as { badgeColor?: string }).badgeColor
                    : undefined,
                badge2Color:
                  typeof (entry.styles as { badge2Color?: unknown }).badge2Color === 'string'
                    ? (entry.styles as { badge2Color?: string }).badge2Color
                    : undefined,
                badge1Color:
                  typeof (entry.styles as { badge1Color?: unknown }).badge1Color === 'string'
                    ? (entry.styles as { badge1Color?: string }).badge1Color
                    : undefined,
                iconScale:
                  typeof (entry.styles as { iconScale?: unknown }).iconScale === 'number'
                    ? (entry.styles as { iconScale?: number }).iconScale
                    : undefined,
                tileScale:
                  typeof (entry.styles as { tileScale?: unknown }).tileScale === 'number'
                    ? (entry.styles as { tileScale?: number }).tileScale
                    : undefined
            }
            : undefined
        }
      })
      const seenItemIds = new Set<string>()

      items.forEach((entry, index) => {
        if (seenItemIds.has(entry.id)) {
          throw new Error(`[config] Duplicate link id "${entry.id}" in config/links.json.items[${index}]`)
        }

        seenItemIds.add(entry.id)
      })

      return items
    })()
  }
}

const parseUiConfig = (raw: unknown): UiConfig => {
  const value = ensureObject(raw, 'config/ui.json')
  const viewModes = ensureObject(value.viewModes, 'config/ui.json.viewModes')

  return {
    heroCardLabel: ensureRequiredString(value.heroCardLabel, 'config/ui.json.heroCardLabel'),
    directoryEyebrow: ensureRequiredString(value.directoryEyebrow, 'config/ui.json.directoryEyebrow'),
    directoryTitle: parseOptionalString(value.directoryTitle),
    directoryViewModeAriaLabel: ensureRequiredString(
      value.directoryViewModeAriaLabel,
      'config/ui.json.directoryViewModeAriaLabel'
    ),
    directoryFilterAriaLabel: ensureRequiredString(
      value.directoryFilterAriaLabel,
      'config/ui.json.directoryFilterAriaLabel'
    ),
    embedEmptyState: ensureRequiredString(value.embedEmptyState, 'config/ui.json.embedEmptyState'),
    viewModes: {
      list: ensureRequiredString(viewModes.list, 'config/ui.json.viewModes.list'),
      tiles: ensureRequiredString(viewModes.tiles, 'config/ui.json.viewModes.tiles'),
      badges: typeof viewModes.badges === 'string' ? viewModes.badges : undefined
    },
    featuredLabel: ensureRequiredString(value.featuredLabel, 'config/ui.json.featuredLabel'),
    footerNavigationLabel: ensureRequiredString(
      value.footerNavigationLabel,
      'config/ui.json.footerNavigationLabel'
    ),
    footerModalCloseLabel: ensureRequiredString(
      value.footerModalCloseLabel,
      'config/ui.json.footerModalCloseLabel'
    ),
    footerCopyright: ensureRequiredString(value.footerCopyright, 'config/ui.json.footerCopyright')
  }
}

const parseEmailOrder = (parts: string[], value: unknown, path: string) => {
  const raw = ensureArray(value, path)
  const order = raw.map((entry, index) => {
    const normalized = Number.parseInt(String(entry), 10)

    if (!Number.isInteger(normalized) || String(normalized) !== String(entry).trim()) {
      throw new Error(`[config] ${path}[${index}] must be an integer index number.`)
    }

    return normalized
  })

  if (order.length !== new Set(order).size) {
    throw new Error(`[config] ${path} must not contain duplicate indexes.`)
  }

  if (order.some((entry) => entry < 0 || entry >= parts.length)) {
    throw new Error(`[config] ${path} must only contain indexes between 0 and emailParts.length - 1.`)
  }

  return order
}

const parseLegalAction = (value: unknown, path: string): LegalAction => {
  const action = ensureObject(value, path)
  const label = ensureRequiredString(action.label, `${path}.label`)
  const isEmail = action.email === true

  if (isEmail) {
    if (!Array.isArray(action.emailParts)) {
      throw new Error(`[config] ${path}.emailParts is required when email is true.`)
    }

    if (!Array.isArray(action.emailOrder)) {
      throw new Error(`[config] ${path}.emailOrder is required when email is true.`)
    }
  }

  return {
    label,
    href: (() => {
      const rawHref = parseOptionalString(action.href)

      if (!rawHref) {
        return undefined
      }

      if (!resolveSafeHref(rawHref)) {
        throw new Error(`[config] ${path}.href must be a safe link.`)
      }

      return rawHref
    })(),
    email: isEmail,
    emailParts: isEmail ? parseStringArray(action.emailParts, `${path}.emailParts`) : undefined,
    emailOrder: isEmail
      ? parseEmailOrder(
          parseStringArray(action.emailParts, `${path}.emailParts`),
          action.emailOrder,
          `${path}.emailOrder`
        )
      : undefined
  }
}

const parseLegalDocument = (raw: unknown): LegalDocument => {
  const value = ensureObject(raw, 'config/legal/*.json')
  const sections = parseObjectArray(value.sections, 'config/legal/*.json.sections')
  const actions = value.actions == null
    ? undefined
    : parseObjectArray(value.actions, 'config/legal/*.json.actions').map((action, index) =>
      parseLegalAction(action, `config/legal/*.json.actions[${index}]`)
    )

  return {
    id: ensureRequiredString(value.id, 'config/legal/*.json.id'),
    buttonLabel: ensureRequiredString(value.buttonLabel, 'config/legal/*.json.buttonLabel'),
    title: ensureRequiredString(value.title, 'config/legal/*.json.title'),
    updatedAtLabel: ensureRequiredString(
      value.updatedAtLabel,
      'config/legal/*.json.updatedAtLabel'
    ),
    updatedAt: ensureRequiredString(value.updatedAt, 'config/legal/*.json.updatedAt'),
    intro: parseOptionalStringArray(value.intro, 'config/legal/*.json.intro'),
    sections: sections.map((entry, index) => ({
      heading: ensureRequiredString(entry.heading, `config/legal/*.json.sections[${index}].heading`),
      paragraphs: parseStringArray(entry.paragraphs, `config/legal/*.json.sections[${index}].paragraphs`)
    })),
    actions
  }
}

const legalRouteSurfaces = parseLegalRouteSurfaces(routeSurfacesConfig as unknown)

const legalDocumentModules = import.meta.glob<unknown>('~/config/legal/*.json', {
  eager: true
})

interface LegalSurfaceManifestEntry {
  path: string
  id: string
  inFooter: boolean
  prerender: boolean
  sitemap: boolean
  document: LegalDocument
}

const resolveLegalDocumentModules = () => {
  const map = new Map<string, LegalDocument>()

  for (const moduleValue of Object.values(legalDocumentModules)) {
    const rawDocument = 'default' in moduleValue
      ? (moduleValue.default as unknown)
      : (moduleValue as unknown)

    const document = parseLegalDocument(rawDocument)
    const documentId = normalizeDocumentKey(document.id)

    if (!documentId) {
      continue
    }

    if (map.has(documentId)) {
      throw new Error(`[config] Duplicate legal document id "${documentId}" in config/legal/*.json`)
    }

    map.set(documentId, document)
  }

  return map
}

const legalDocumentMap = resolveLegalDocumentModules()

const resolveLegalDocumentsFromSurface = (surfaces: LegalRouteSurface[]) => {
  const seenIds = new Set<string>()
  const documents: LegalSurfaceManifestEntry[] = []

  for (const entry of surfaces) {
    const entryId = normalizeDocumentKey(entry.id)

    if (!entryId) {
      continue
    }

    if (seenIds.has(entryId)) {
      throw new Error(
        `[config] Duplicate legal route surface id "${entryId}" in config/route-surfaces.json`
      )
    }

    const legalDocument = legalDocumentMap.get(entryId)
    if (!legalDocument) {
      throw new Error(`[config] Missing legal document content for id "${entryId}" in config/route-surfaces.json`)
    }

    seenIds.add(entryId)
    documents.push({
      path: entry.path,
      id: entryId,
      inFooter: entry.inFooter,
      prerender: entry.prerender,
      sitemap: entry.sitemap,
      document: legalDocument
    })
  }

  return documents
}

const YEAR_TOKEN_PATTERN = /\{\{\s*year\s*\}\}|\{year\}/gi
const STANDALONE_YEAR_PATTERN = /\b(?:19|20)\d{2}\b/g
const COPYRIGHT_MARKER_PATTERN = /(©|copyright\b)/i

const replaceLastStandaloneYear = (value: string, currentYear: number) => {
  STANDALONE_YEAR_PATTERN.lastIndex = 0
  const matches = Array.from(value.matchAll(STANDALONE_YEAR_PATTERN))

  if (!matches.length) {
    return value
  }

  const lastMatch = matches[matches.length - 1]

  if (!lastMatch || typeof lastMatch.index !== 'number') {
    return value
  }

  return `${value.slice(0, lastMatch.index)}${currentYear}${value.slice(lastMatch.index + lastMatch[0].length)}`
}

const resolveFooterCopyright = (value: string, currentYear: number) => {
  const trimmed = value.trim()

  if (!trimmed) {
    return trimmed
  }

  YEAR_TOKEN_PATTERN.lastIndex = 0
  if (YEAR_TOKEN_PATTERN.test(trimmed)) {
    YEAR_TOKEN_PATTERN.lastIndex = 0
    return trimmed.replace(YEAR_TOKEN_PATTERN, String(currentYear))
  }

  STANDALONE_YEAR_PATTERN.lastIndex = 0
  if (STANDALONE_YEAR_PATTERN.test(trimmed)) {
    STANDALONE_YEAR_PATTERN.lastIndex = 0
    return replaceLastStandaloneYear(trimmed, currentYear)
  }

  if (COPYRIGHT_MARKER_PATTERN.test(trimmed)) {
    return trimmed.replace(COPYRIGHT_MARKER_PATTERN, (match) => `${match} ${currentYear}`)
  }

  return trimmed
}

const normalizeAnnouncement = (value?: AnnouncementConfig): ResolvedAnnouncement | null => {
  if (!value?.enabled) {
    return null
  }

  const id = value.id?.trim()
  const title = value.title?.trim()
  const message = value.message?.trim()

  if (!id) {
    throw new Error('[config] site.announcement.id is required when site.announcement.enabled is true.')
  }

  if (!title) {
    throw new Error('[config] site.announcement.title is required when site.announcement.enabled is true.')
  }

  if (!message) {
    throw new Error('[config] site.announcement.message is required when site.announcement.enabled is true.')
  }

  const tone = value.tone === 'info' || value.tone === 'success' || value.tone === 'warning'
    ? value.tone
    : 'warning'

  const actionLabel = value.action?.label?.trim()
  const actionHref = value.action?.href?.trim()
  const action =
    actionLabel && actionHref && resolveSafeHref(actionHref)
      ? {
          label: actionLabel,
          href: actionHref
        }
      : undefined

  return {
    enabled: true,
    id,
    tone,
    sticky: Boolean(value.sticky),
    dismissible: Boolean(value.dismissible),
    eyebrow: value.eyebrow?.trim() ?? '',
    title,
    message,
    closeLabel: value.closeLabel?.trim() || 'Dismiss announcement',
    action
  }
}

const resolveAvatarUrl = (avatar: AvatarConfig, baseUrl: string) => {
  const avatarSrc = avatar.src?.trim() ?? ''
  const githubUsername = avatar.githubUsername?.trim() ?? ''
  const shouldUseConfiguredSrc = Boolean(avatarSrc && avatarSrc !== DEFAULT_AVATAR_SRC)

  if (shouldUseConfiguredSrc) {
    return resolvePublicAsset(avatarSrc, baseUrl)
  }

  if (githubUsername) {
    return `https://github.com/${githubUsername}.png?size=240`
  }

  return resolvePublicAsset(avatarSrc || DEFAULT_AVATAR_SRC, baseUrl)
}

const resolveAvatarLink = (avatar: AvatarConfig, siteUrl: string) => {
  const customLink = avatar.linkUrl?.trim()
  return customLink || siteUrl
}

const normalizeRoleLines = (value: string | string[]) => {
  const lines = (Array.isArray(value) ? value : [value])
    .map((entry) => entry.trim())
    .filter(Boolean)

  if (!lines.length) {
    throw new Error('[config] profile.roleLine must contain at least one non-empty line.')
  }

  return lines
}

const site = parseSiteConfig(siteJson as unknown)
const profile = parseProfileConfig(profileJson as unknown)
const linkCollection = parseLinkCollectionConfig(linksJson as unknown)
const ui = parseUiConfig(uiJson as unknown)
const legalDocumentManifest = resolveLegalDocumentsFromSurface(legalRouteSurfaces)
const legalDocuments = legalDocumentManifest.map((entry) => entry.document)
const legalFooterDocuments = legalDocumentManifest
  .filter((entry) => entry.inFooter)
  .map((entry) => entry.document)

export const useSiteData = () => {
  const runtimeConfig = useRuntimeConfig()
  const currentYear = new Date().getFullYear()
  const appBaseUrl = normalizeBaseUrl(runtimeConfig.public.appBaseUrl as string | undefined)
  const siteUrl = normalizeSiteUrl(site.siteUrl)
  const avatarUrl = resolveAvatarUrl(profile.avatar, appBaseUrl)
  const shareImageUrl =
    site.socialPreview.mode === 'custom' && site.socialPreview.src.trim()
      ? resolvePublicAsset(site.socialPreview.src, appBaseUrl)
      : avatarUrl
  const announcement = normalizeAnnouncement(site.announcement)
  const resolvedUi: UiConfig = {
    ...ui,
    footerCopyright: resolveFooterCopyright(ui.footerCopyright, currentYear)
  }

  const sameAs = Array.from(
    new Set(
      [
        ...(profile.sameAs ?? []),
        ...linkCollection.items.map((entry) => entry.url).filter((entry) => isAbsoluteUrl(entry))
      ].filter(Boolean)
    )
  )

  const roleLine = normalizeRoleLines(profile.roleLine)

  const resolvedProfile: ResolvedProfile = {
    ...profile,
    roleLine,
    roleLineText: roleLine.join(' | '),
    avatarUrl,
    avatarLink: resolveAvatarLink(profile.avatar, siteUrl),
    sameAs
  }

  const resolvedSite: ResolvedSite = {
    ...site,
    announcement,
    siteUrl,
    shareImageUrl
  }

  return {
    site: resolvedSite,
    profile: resolvedProfile,
    ui: resolvedUi,
    links: linkCollection.items,
    filters: linkCollection.filters,
    legalDocuments,
    legalFooterDocuments,
    legalDocumentManifest
  }
}
