/*
 * Profile Link Starter - site-config-contract.mjs
 * Shared validation and route-contract helpers for config-driven runtime and scripts.
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

const isObject = (value) =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const ensureObject = (value, path) => {
  if (!isObject(value)) {
    throw new Error(`[config] ${path} must be an object.`)
  }

  return value
}

const ensureArray = (value, path) => {
  if (!Array.isArray(value)) {
    throw new Error(`[config] ${path} must be an array.`)
  }

  return value
}

const ensureString = (value, path) => {
  if (typeof value !== 'string') {
    throw new Error(`[config] ${path} must be a string.`)
  }

  return value.trim()
}

const requiredString = (value, path) => {
  const normalized = ensureString(value, path)

  if (!normalized) {
    throw new Error(`[config] ${path} is required.`)
  }

  return normalized
}

const normalizeManifestPath = (pathValue) => {
  const normalized = requiredString(pathValue, 'config/route-surfaces').toLowerCase().replace(/^\/+|\/+$/g, '')

  if (!normalized) {
    throw new Error('[config] config/route-surfaces item path is required.')
  }

  if (normalized.includes('/')) {
    throw new Error(
      `[config] config/route-surfaces item path "${pathValue}" is invalid. Use one route segment only.`
    )
  }

  return `/${normalized}`
}

const parseBooleanFlag = (value, fallback, path) => {
  if (value === undefined) {
    return fallback
  }

  if (typeof value !== 'boolean') {
    throw new Error(`[config] ${path} must be a boolean.`)
  }

  return value
}

export const parseLegalRouteSurfaces = (raw) => {
  const contract = ensureObject(raw, 'config/route-surfaces.json')
  const legal = ensureArray(contract.legal, 'config/route-surfaces.json.legal')
  const result = []
  const seenIds = new Set()
  const seenPaths = new Set()

  for (let index = 0; index < legal.length; index += 1) {
    const surface = legal[index]
    const path = `config/route-surfaces.json.legal[${index}]`
    const entry = ensureObject(surface, path)

    const rawId = requiredString(entry.id, `${path}.id`)
    const normalizedId = rawId.toLowerCase().replace(/^\/+|\/+$/g, '')

    if (!normalizedId || normalizedId.includes('/')) {
      throw new Error(`[config] ${path}.id must be a single non-empty segment.`)
    }

    const normalizedPath = normalizeManifestPath(entry.path == null ? `/${rawId}` : entry.path)
    const pathId = normalizedPath.slice(1)
    if (normalizedId !== pathId) {
      throw new Error(
        `[config] ${path}.id "${rawId}" must match path segment "${pathId}" (path "${entry.path ?? `/${rawId}`}")`
      )
    }

    if (seenIds.has(pathId)) {
      throw new Error(`[config] Duplicate legal route id "${pathId}" in config/route-surfaces.json`)
    }

    if (seenPaths.has(normalizedPath)) {
      throw new Error(`[config] Duplicate legal route path "${normalizedPath}" in config/route-surfaces.json`)
    }

    seenIds.add(pathId)
    seenPaths.add(normalizedPath)

    result.push({
      id: normalizedId,
      path: normalizedPath,
      inFooter: parseBooleanFlag(entry.inFooter, true, `${path}.inFooter`),
      prerender: parseBooleanFlag(entry.prerender, true, `${path}.prerender`),
      sitemap: parseBooleanFlag(entry.sitemap, true, `${path}.sitemap`)
    })
  }

  return result
}

const stripTrailingSlash = (value) => value.replace(/\/+$/, '')

const parseAbsoluteOrHostUrl = (value) => {
  const trimmed = requiredString(value, 'config/site.json.siteUrl')
  const candidates = trimmed.includes('://') ? [trimmed] : [trimmed, `https://${trimmed.replace(/^\/+/, '')}`]

  for (const candidate of candidates) {
    try {
      return new URL(candidate)
    } catch {
      continue
    }
  }

  throw new Error('[config] config/site.json.siteUrl must be a valid absolute or host value.')
}

export const normalizeAppBasePath = (value) => {
  if (typeof value !== 'string') {
    throw new Error('[config] NUXT_APP_BASE_URL must be a path value.')
  }

  const trimmed = value.trim()

  if (!trimmed || trimmed === '/') {
    return '/'
  }

  if (trimmed.includes('://')) {
    throw new Error('[config] NUXT_APP_BASE_PATH must not be an URL.')
  }

  return `/${trimmed.replace(/^\/+|\/+$/g, '')}/`
}

export const resolveAppBasePath = ({ siteUrl, configuredBaseUrl, repository, isProduction = false }) => {
  if (configuredBaseUrl && configuredBaseUrl.trim()) {
    return normalizeAppBasePath(configuredBaseUrl)
  }

  const parsedSiteUrl = parseAbsoluteOrHostUrl(siteUrl)
  const sitePath = stripTrailingSlash(parsedSiteUrl.pathname)

  if (sitePath && sitePath !== '/') {
    return `/${sitePath.replace(/^\/+|\/+$/g, '')}/`
  }

  if (isProduction && repository) {
    return normalizeAppBasePath(repository)
  }

  return '/'
}

export const resolvePublicSiteUrl = (siteUrl, appBaseUrl) => {
  const parsedSiteUrl = parseAbsoluteOrHostUrl(siteUrl)
  const normalizedAppBase = normalizeAppBasePath(appBaseUrl)
  const sitePath = stripTrailingSlash(parsedSiteUrl.pathname)
  const resolvedPath = sitePath && sitePath !== '/' ? sitePath : stripTrailingSlash(normalizedAppBase)

  return `${parsedSiteUrl.origin}${resolvedPath || ''}`
}
