import rawSiteConfig from './config/site.json'
import { basename } from 'node:path'
import { fileURLToPath } from 'node:url'

type SiteConfig = {
  siteUrl: string
  siteTitle: string
  siteDescription: string
  language: {
    code: string
    direction?: 'ltr' | 'rtl'
  }
}

const siteConfig = rawSiteConfig as SiteConfig
const rootDir = fileURLToPath(new URL('.', import.meta.url))
const appManifestStubPath = fileURLToPath(new URL('./utils/nuxt-app-manifest.ts', import.meta.url))
const runtimeEnvironment = globalThis as typeof globalThis & {
  process?: {
    env?: Record<string, string | undefined>
  }
}

const normalizeBaseUrl = (value?: string | null) => {
  const trimmed = value?.trim()

  if (!trimmed || trimmed === '/') {
    return '/'
  }

  return `/${trimmed.replace(/^\/+|\/+$/g, '')}/`
}

const parseSiteUrl = (value: string) => {
  const trimmed = value.trim()
  const candidates = trimmed.includes('://') ? [trimmed] : [trimmed, `https://${trimmed.replace(/^\/+/, '')}`]

  for (const candidate of candidates) {
    try {
      return new URL(candidate)
    } catch {
      continue
    }
  }

  return null
}

const resolveRepositorySegment = () => {
  const repository = runtimeEnvironment.process?.env?.GITHUB_REPOSITORY?.trim()
  const repositoryName = repository?.split('/')[1]?.trim()

  if (repositoryName) {
    return repositoryName
  }

  return basename(rootDir.replace(/[\\/]+$/, ''))
}

const inferBaseUrlFromSiteUrl = (siteUrl: string) => {
  const parsedSiteUrl = parseSiteUrl(siteUrl)

  if (!parsedSiteUrl) {
    return '/'
  }

  const pathname = parsedSiteUrl.pathname.replace(/\/+$/, '')

  if (pathname && pathname !== '/') {
    return normalizeBaseUrl(pathname)
  }

  const isProductionBuild = runtimeEnvironment.process?.env?.NODE_ENV === 'production'

  if (isProductionBuild && parsedSiteUrl.hostname === 'example.com') {
    return normalizeBaseUrl(resolveRepositorySegment())
  }

  return '/'
}

const configuredAppBaseUrl = runtimeEnvironment.process?.env?.NUXT_APP_BASE_URL
const appBaseUrl = configuredAppBaseUrl?.trim()
  ? normalizeBaseUrl(configuredAppBaseUrl)
  : inferBaseUrlFromSiteUrl(siteConfig.siteUrl)

const publicAppConfig = {
  appBaseUrl
}

export default defineNuxtConfig({
  compatibilityDate: '2026-04-10',
  devtools: { enabled: false },
  experimental: {
    appManifest: false
  },
  alias: {
    '#app-manifest': appManifestStubPath
  },
  css: [
    '~/assets/styles/tokens.css',
    '~/assets/styles/base.css',
    '~/assets/styles/shared/badge-grid.css'
  ],
  runtimeConfig: {
    public: publicAppConfig
  },
  app: {
    baseURL: appBaseUrl,
    head: {
      htmlAttrs: {
        lang: siteConfig.language.code,
        dir: siteConfig.language.direction ?? 'ltr'
      },
      title: siteConfig.siteTitle,
      link: [
        {
          rel: 'icon',
          type: 'image/svg+xml',
          href: `${appBaseUrl}favicon.svg`
        },
        {
          rel: 'shortcut icon',
          href: `${appBaseUrl}favicon.svg`
        }
      ],
      meta: [
        {
          name: 'description',
          content: siteConfig.siteDescription
        }
      ]
    }
  },
  nitro: {
    prerender: {
      routes: ['/', '/contact', '/gtc', '/privacy', '/license', '/impressum', '/embed/badges', '/embed/list']
    }
  }
})
