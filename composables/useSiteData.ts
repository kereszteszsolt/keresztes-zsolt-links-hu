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

import contactJson from '~/config/legal/contact.json'
import gtcJson from '~/config/legal/gtc.json'
import impressumJson from '~/config/legal/impressum.json'
import licenseJson from '~/config/legal/license.json'
import privacyJson from '~/config/legal/privacy.json'
import linksJson from '~/config/links.json'
import profileJson from '~/config/profile.json'
import siteJson from '~/config/site.json'
import uiJson from '~/config/ui.json'
import type {
  AnnouncementConfig,
  AvatarConfig,
  LegalDocument,
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

const normalizeBaseUrl = (value?: string | null) => {
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

const normalizeSiteUrl = (value: string) => {
  const trimmed = trimTrailingSlash(value.trim())

  if (!trimmed) {
    return 'https://example.com'
  }

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

  return 'https://example.com'
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

const normalizeRoleLines = (value: ProfileConfig['roleLine']) => {
  const lines = (Array.isArray(value) ? value : [value])
    .map((entry) => entry.trim())
    .filter(Boolean)

  if (!lines.length) {
    throw new Error('[config] profile.roleLine must contain at least one non-empty line.')
  }

  return lines
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
    actionLabel && actionHref
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

const site = siteJson as SiteConfig
const profile = profileJson as ProfileConfig
const linkCollection = linksJson as LinkCollectionConfig
const ui = uiJson as UiConfig
const legalDocuments = [
  contactJson,
  gtcJson,
  privacyJson,
  licenseJson,
  impressumJson
] as LegalDocument[]

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
    legalDocuments
  }
}
