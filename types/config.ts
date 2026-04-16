/*
 * Profile Link Starter - config.ts
 * Defines the typed shape of the starter's config-driven content model.
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

export interface AvatarConfig {
  mode: 'github' | 'upload'
  githubUsername?: string
  src: string
  linkUrl?: string
  alt: string
}

export interface ProfileFact {
  id: string
  label: string
  value: string
}

export interface ProfileConfig {
  name: string
  domainLabel: string
  roleLine: string | string[]
  bioLabel: string
  bio: string
  avatar: AvatarConfig
  facts: ProfileFact[]
  sameAs?: string[]
}

export interface ResolvedProfile extends Omit<ProfileConfig, 'roleLine'> {
  roleLine: string[]
  roleLineText: string
  avatarUrl: string
  avatarLink: string
  sameAs: string[]
}

export interface SocialPreviewConfig {
  mode: 'avatar' | 'custom'
  src: string
  alt: string
}

export interface SiteLanguageConfig {
  code: string
  locale: string
  name: string
  direction?: 'ltr' | 'rtl'
}

export interface DiscoveryFaqItem {
  question: string
  answer: string
}

export interface LlmsQuestionAnswer {
  question: string
  answer: string
}

export interface LlmsBodyParagraph {
  title?: string
  text: string
}

export interface LlmsSection {
  type: 'profile' | 'profileFacts' | 'audiences' | 'intents' | 'links' | 'faq' | 'qna' | 'chapter'
  title: string
  groupBy?: 'flat' | 'category'
  text?: string
  items?: string[]
  qna?: LlmsQuestionAnswer[]
  body?: LlmsBodyParagraph[]
}

export interface LlmsConfig {
  sections: LlmsSection[]
}

export interface DiscoveryConfig {
  keywords: string[]
  category: string
  robots: string
  includeLlmsTxtInSitemap?: boolean
  llmSummary: string
  audiences: string[]
  intents: string[]
  faq: DiscoveryFaqItem[]
}

export interface AnnouncementAction {
  label: string
  href: string
}

export interface AnnouncementConfig {
  enabled?: boolean
  id: string
  tone?: 'info' | 'success' | 'warning'
  sticky?: boolean
  dismissible?: boolean
  eyebrow?: string
  title: string
  message: string
  closeLabel?: string
  action?: AnnouncementAction
}

export interface ResolvedAnnouncement {
  enabled: true
  id: string
  tone: 'info' | 'success' | 'warning'
  sticky: boolean
  dismissible: boolean
  eyebrow: string
  title: string
  message: string
  closeLabel: string
  action?: AnnouncementAction
}

export interface SiteConfig {
  siteName: string
  siteTitle: string
  siteDescription: string
  siteUrl: string
  language: SiteLanguageConfig
  themeColor: string
  author: string
  canonicalPath: string
  socialPreview: SocialPreviewConfig
  announcement?: AnnouncementConfig
  discovery: DiscoveryConfig
  deploy?: {
    cname?: string
  }
}

export interface ResolvedSite extends Omit<SiteConfig, 'announcement'> {
  announcement: ResolvedAnnouncement | null
  shareImageUrl: string
}

export interface LinkStyles {
  badgeColor?: string
  badge2Color?: string
  badge1Color?: string
  iconScale?: number
  tileScale?: number
}

export interface LinkFilter {
  id: string
  label: string
  type: 'all' | 'category'
  categories?: string[]
}

export interface LinkEntry {
  id: string
  url: string
  provider: string
  providerExtra?: string
  category: string
  tags: string[]
  title: string
  description: string
  profileId?: string
  segmentMark?: number | string
  icon?: string
  featured?: boolean
  highlightUrlIdentifier?: boolean
  styles?: LinkStyles
}

export interface LinkCollectionConfig {
  filters: LinkFilter[]
  items: LinkEntry[]
}

export interface LegalSection {
  heading: string
  paragraphs: string[]
}

export interface LegalAction {
  label: string
  href?: string
  email?: boolean
  emailParts?: string[]
  emailOrder?: number[]
}

export interface LegalDocument {
  id: string
  buttonLabel: string
  title: string
  updatedAtLabel: string
  updatedAt: string
  sections: LegalSection[]
  actions?: LegalAction[]
}

export interface ResolvedLegalAction {
  key: string
  label: string
  href?: string
  target?: string
  rel?: string
  disabled: boolean
}

export interface UiConfig {
  heroCardLabel: string
  directoryEyebrow: string
  directoryTitle: string
  directoryViewModeAriaLabel: string
  directoryFilterAriaLabel: string
  embedEmptyState: string
  viewModes: {
    list: string
    tiles: string
    badges?: string
  }
  featuredLabel: string
  footerNavigationLabel: string
  footerModalCloseLabel: string
  footerCopyright: string
}
