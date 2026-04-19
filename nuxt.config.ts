import rawSiteConfig from './config/site.json'
import routeSurfacesConfig from './config/route-surfaces.json'
import { basename } from 'node:path'
import { parseLegalRouteSurfaces, resolveAppBasePath } from './utils/site-config-contract.mjs'
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

const resolveRepositorySegment = () => {
  const repository = runtimeEnvironment.process?.env?.GITHUB_REPOSITORY?.trim()
  const repositoryName = repository?.split('/')[1]?.trim()

  if (repositoryName) {
    return repositoryName
  }

  return basename(rootDir.replace(/[\\/]+$/, ''))
}

const configuredAppBaseUrl = runtimeEnvironment.process?.env?.NUXT_APP_BASE_URL
const appBaseUrl = resolveAppBasePath({
  siteUrl: siteConfig.siteUrl,
  configuredBaseUrl: configuredAppBaseUrl,
  repository: resolveRepositorySegment(),
  isProduction: runtimeEnvironment.process?.env?.NODE_ENV === 'production'
})
const legalRouteSurfaces = parseLegalRouteSurfaces(routeSurfacesConfig as unknown)
const legalPrerenderRoutes = legalRouteSurfaces
  .filter((entry) => entry.prerender)
  .map((entry) => entry.path)

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
    '~/assets/styles/shared/tile-grid.css'
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
      routes: ['/', ...legalPrerenderRoutes, '/embed/tiles', '/embed/list']
    }
  }
})
