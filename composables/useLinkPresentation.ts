/*
 * Profile Link Starter - useLinkPresentation.ts
 * Resolves shared icon, label, color, and URL display helpers for link entries.
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

import youtubeIcon from '~/assets/icons/uxwing/youtube-icon.svg?url'
import githubIcon from '~/assets/icons/uxwing/github-icon.svg?url'
import linkedinIcon from '~/assets/icons/uxwing/linkedin-square-icon.svg?url'
import xIcon from '~/assets/icons/uxwing/x-social-media-logo-icon.svg?url'
import tiktokIcon from '~/assets/icons/uxwing/tiktok-simplified-black-icon.svg?url'
import facebookIcon from '~/assets/icons/uxwing/facebook-square-black-icon.svg?url'
import instagramIcon from '~/assets/icons/uxwing/black-instagram-icon.svg?url'
import supportIcon from '~/assets/icons/uxwing/plastic-takeaway-coffee-icon.svg?url'
import linktreeIcon from '~/assets/icons/uxwing/linktree-white-icon.svg?url'
import webIcon from '~/assets/icons/uxwing/web-icon.svg?url'
import affiliateIcon from '~/assets/icons/uxwing/affiliate-icon.svg?url'
import type { LinkEntry } from '~/types/config'

const providerIcons: Record<string, string> = {
  youtube: youtubeIcon,
  github: githubIcon,
  linkedin: linkedinIcon,
  x: xIcon,
  tiktok: tiktokIcon,
  facebook: facebookIcon,
  instagram: instagramIcon,
  linktree: linktreeIcon,
  support: supportIcon,
  web: webIcon,
  website: webIcon,
  affiliate: affiliateIcon
}

const providerColors: Record<string, string> = {
  website: '#3d2a21',
  github: '#181717',
  linkedin: '#0a66c2',
  x: '#111111',
  youtube: '#ff0000',
  email: '#7a4a35',
  support: '#ff813f',
  tiktok: '#111111',
  linktree: '#2bb673',
  facebook: '#1877F2',
  instagram: '#E4405F'
}

const providerMarks: Record<string, string> = {
  website: 'WWW',
  github: 'GH',
  linkedin: 'in',
  x: 'X',
  youtube: 'YT',
  instagram: 'IG'
}

type HighlightedUrlParts = {
  prefix: string
  identifier: string
  hasIdentifier: boolean
}

const toProviderKey = (provider: string) => provider.trim().toLowerCase()

const isAbsoluteUrl = (value: string) => /^(https?:)?\/\//i.test(value)

const normalizeBaseUrl = (value?: string | null) => {
  const trimmed = value?.trim()

  if (!trimmed || trimmed === '/') {
    return '/'
  }

  return `/${trimmed.replace(/^\/+|\/+$/g, '')}/`
}

const resolveConfiguredIcon = (value: string, baseUrl: string) => {
  if (isAbsoluteUrl(value) || !value.startsWith('/')) {
    return value
  }

  if (baseUrl === '/') {
    return value
  }

  return `${baseUrl.replace(/\/+$/, '')}${value}`
}

const extractProfileId = (url: string) => {
  if (url.startsWith('mailto:')) {
    return url.replace('mailto:', '')
  }

  try {
    const parsedUrl = new URL(url)
    const host = parsedUrl.hostname.replace(/^www\./, '')
    const segments = parsedUrl.pathname.split('/').filter(Boolean)
    const first = segments[0]
    const second = segments[1]

    if (first?.startsWith('@')) {
      return first
    }

    if (host.includes('youtube.com') && first) {
      return first.startsWith('@') ? first : `@${first}`
    }

    if (host.includes('tiktok.com') && first) {
      return first.startsWith('@') ? first : `@${first}`
    }

    if (host.includes('x.com') && first) {
      return first.startsWith('@') ? first : `@${first}`
    }

    if (host.includes('github.com') && first) {
      return first.startsWith('@') ? first : `@${first}`
    }

    if (host.includes('linktr.ee') && first) {
      return first.startsWith('@') ? first : `@${first}`
    }

    if (host.includes('linkedin.com') && second) {
      return second.startsWith('@') ? second : `@${second}`
    }

    return host
  } catch {
    return url
  }
}

const getProviderLabel = (provider: string, providerExtra?: string) => {
  const normalizedExtra = providerExtra?.trim()
  return normalizedExtra
    ? `${provider} (${normalizedExtra})`
    : provider
}

const getProfileId = (link: string, customProfileId?: string) =>
  customProfileId ?? extractProfileId(link)

const getProviderColor = (provider: string) => {
  const key = toProviderKey(provider)
  return providerColors[key] ?? '#8f3f26'
}

const getUrlHighlightCandidates = (profileId?: string) => {
  const trimmedProfileId = profileId?.trim()

  if (!trimmedProfileId) {
    return []
  }

  return Array.from(
    new Set([
      trimmedProfileId,
      trimmedProfileId.replace(/^@+/, '')
    ].filter(Boolean))
  ).sort((left, right) => right.length - left.length)
}

const normalizeSegmentMark = (value?: number | string) => {
  const parsedValue =
    typeof value === 'number'
      ? value
      : typeof value === 'string' && value.trim()
        ? Number(value)
        : 1

  if (!Number.isFinite(parsedValue) || parsedValue < 1) {
    return 1
  }

  return Math.floor(parsedValue)
}

const getHighlightedUrlParts = (entry: LinkEntry): HighlightedUrlParts => {
  if (entry.highlightUrlIdentifier !== true) {
    return {
      prefix: entry.url,
      identifier: '',
      hasIdentifier: false
    }
  }

  const normalizedUrl = entry.url.replace(/\/+$/, '')
  const candidates = getUrlHighlightCandidates(entry.profileId)
  const matchingSuffix = candidates.find((candidate) => normalizedUrl.endsWith(candidate))

  if (!matchingSuffix) {
    return {
      prefix: entry.url,
      identifier: '',
      hasIdentifier: false
    }
  }

  const segmentMark = normalizeSegmentMark(entry.segmentMark)

  if (segmentMark > 1) {
    try {
      const parsedUrl = new URL(normalizedUrl)
      const pathSegments = parsedUrl.pathname.replace(/\/+$/, '').split('/').filter(Boolean)
      const matchedPathSegment = matchingSuffix.replace(/^@+/, '')
      const lastPathSegment = pathSegments[pathSegments.length - 1]

      if (
        pathSegments.length &&
        (lastPathSegment === matchedPathSegment || lastPathSegment === matchingSuffix)
      ) {
        const highlightedSegmentCount = Math.min(segmentMark, pathSegments.length)
        const highlightedPath = pathSegments.slice(-highlightedSegmentCount).join('/')
        const prefixPath = pathSegments.slice(0, -highlightedSegmentCount).join('/')

        return {
          prefix: `${parsedUrl.origin}${prefixPath ? `/${prefixPath}/` : '/'}`,
          identifier: highlightedPath,
          hasIdentifier: true
        }
      }
    } catch {
      // Fall back to the default single-suffix highlight below.
    }
  }

  return {
    prefix: normalizedUrl.slice(0, normalizedUrl.length - matchingSuffix.length),
    identifier: matchingSuffix,
    hasIdentifier: true
  }
}

export const useLinkPresentation = () => {
  const runtimeConfig = useRuntimeConfig()
  const appBaseUrl = normalizeBaseUrl(runtimeConfig.public.appBaseUrl as string | undefined)

  const getEntryIcon = (entry: LinkEntry) => {
    const configuredIcon = entry.icon?.trim()

    if (configuredIcon) {
      const normalizedIcon = configuredIcon.toLowerCase()

      if (providerIcons[normalizedIcon]) {
        return providerIcons[normalizedIcon]
      }

      return resolveConfiguredIcon(configuredIcon, appBaseUrl)
    }

    return providerIcons[toProviderKey(entry.provider)]
  }

  return {
    providerIcons,
    providerMarks,
    toProviderKey,
    getEntryIcon,
    getProviderColor,
    getProviderLabel,
    getProfileId,
    getHighlightedUrlParts
  }
}
