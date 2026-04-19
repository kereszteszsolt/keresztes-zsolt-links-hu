/*
 * Profile Link Starter - safe-url.ts
 * Shared URL validation and target/rel resolution helpers.
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

export type SafeHref = {
  href: string
  target?: '_blank'
  rel?: string
  external: boolean
  disabled: boolean
}

const SCHEME_PREFIX = /^[a-z][a-z\d+.-]*:/i
const ALLOWED_SCHEMES = new Set(['http', 'https', 'mailto'])
const SAFE_RELATIVE_URL = /^[A-Za-z0-9._~!$&'()*+,;=:@%/?&=-]+$/

const buildSafeHref = (
  href: string,
  options: {
    external?: boolean
    target?: '_blank'
    rel?: string
    disabled?: boolean
  } = {}
): SafeHref => ({
  href,
  external: Boolean(options.external),
  target: options.target,
  rel: options.rel,
  disabled: Boolean(options.disabled)
})

const normalizeWhitespace = (value: string) => value.trim()

export const resolveSafeHref = (value?: string): SafeHref | null => {
  if (!value || typeof value !== 'string') {
    return null
  }

  const trimmed = normalizeWhitespace(value)

  if (!trimmed) {
    return null
  }

  if (/\s/.test(trimmed)) {
    return null
  }

  if (trimmed.startsWith('//')) {
    return buildSafeHref(trimmed, {
      external: true,
      target: '_blank',
      rel: 'noreferrer noopener'
    })
  }

  if (SCHEME_PREFIX.test(trimmed)) {
    const scheme = trimmed.split(':', 1)[0]?.toLowerCase() ?? ''

    if (!ALLOWED_SCHEMES.has(scheme)) {
      return null
    }

    if (scheme === 'mailto') {
      return buildSafeHref(trimmed)
    }

    return buildSafeHref(trimmed, {
      external: true,
      target: '_blank',
      rel: 'noreferrer noopener'
    })
  }

  if (
    trimmed.startsWith('/') ||
    trimmed.startsWith('./') ||
    trimmed.startsWith('../') ||
    trimmed.startsWith('#') ||
    trimmed.startsWith('?') ||
    SAFE_RELATIVE_URL.test(trimmed)
  ) {
    return buildSafeHref(trimmed)
  }

  return null
}

export const resolveSafeHrefOrHash = (value?: string, fallback = '#'): SafeHref => {
  return resolveSafeHref(value) ?? buildSafeHref(fallback, { disabled: true })
}
