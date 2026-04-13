/*
 * Profile Link Starter - useSiteSeo.ts
 * Builds derived SEO metadata and absolute URLs from site config.
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

const trimTrailingSlash = (value: string) => value.replace(/\/+$/, '')
const isAbsoluteUrl = (value: string) => /^https?:\/\//i.test(value)

export const useSiteSeo = () => {
  const { links, profile, site } = useSiteData()
  const siteUrl = trimTrailingSlash(site.siteUrl)
  const siteBaseUrl = new URL(`${siteUrl}/`)
  const siteBasePath = trimTrailingSlash(siteBaseUrl.pathname)
  const normalizedSiteBasePath = siteBasePath.replace(/^\/+/, '')

  const toAbsoluteUrl = (input = '/') => {
    if (!input) {
      return siteUrl
    }

    if (isAbsoluteUrl(input)) {
      return input
    }

    const normalizedInput = input.replace(/^\/+/, '')
    const inputAlreadyIncludesBasePath =
      Boolean(normalizedSiteBasePath) &&
      (normalizedInput === normalizedSiteBasePath ||
        normalizedInput.startsWith(`${normalizedSiteBasePath}/`))
    const basePath = inputAlreadyIncludesBasePath
      ? '/'
      : siteBasePath
        ? `${siteBasePath}/`
        : '/'

    return new URL(normalizedInput, `${siteBaseUrl.origin}${basePath}`).toString()
  }

  const shareImage = isAbsoluteUrl(site.shareImageUrl)
    ? site.shareImageUrl
    : toAbsoluteUrl(site.shareImageUrl)

  const xEntry = links.find((entry) => entry.provider.trim().toLowerCase() === 'x')
  const twitterHandle =
    typeof xEntry?.profileId === 'string' && xEntry.profileId.startsWith('@')
      ? xEntry.profileId
      : undefined

  return {
    links,
    profile,
    site,
    siteTitle: site.siteTitle,
    siteDescription: site.siteDescription,
    shareImage,
    shareImageAlt: site.socialPreview.alt,
    sameAs: profile.sameAs,
    keywords: site.discovery.keywords.join(', '),
    twitterHandle,
    toAbsoluteUrl
  }
}
