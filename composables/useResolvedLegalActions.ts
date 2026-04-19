/*
 * Profile Link Starter - useResolvedLegalActions.ts
 * Builds legal action links, including client-only protected email actions.
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

import { computed, onMounted, ref, toValue } from 'vue'
import type { MaybeRefOrGetter } from 'vue'
import type { LegalAction, ResolvedLegalAction } from '~/types/config'
import { resolveSafeHref } from '~/utils/safe-url'

const EMAIL_LABEL_TOKEN = '{{email}}'

const reconstructEmail = (emailParts?: string[], emailOrder?: number[]) => {
  if (!Array.isArray(emailParts) || !Array.isArray(emailOrder)) {
    return ''
  }

  const normalizedOrder = emailOrder
    .map((entry) => Number(entry))
    .filter((entry) => Number.isInteger(entry))

  if (!emailParts.length || normalizedOrder.length !== emailParts.length) {
    return ''
  }

  if (normalizedOrder.some((entry) => entry < 0 || entry >= emailParts.length)) {
    return ''
  }

  if (new Set(normalizedOrder).size !== normalizedOrder.length) {
    return ''
  }

  return normalizedOrder.map((entry) => emailParts[entry] ?? '').join('')
}

const resolveEmailLabel = (label: string, email: string) => {
  const template = label.trim() || `Email ${EMAIL_LABEL_TOKEN}`

  if (!template.includes(EMAIL_LABEL_TOKEN)) {
    return template
  }

  return template.replaceAll(EMAIL_LABEL_TOKEN, email).replace(/\s{2,}/g, ' ').trim() || 'Email'
}

const resolveEmailHref = (action: LegalAction, isClientReady: boolean) => {
  if (!action.email || !isClientReady) {
    return undefined
  }

  const email = reconstructEmail(action.emailParts, action.emailOrder).trim()
  return email ? `mailto:${email}` : undefined
}

const resolveStandardAction = (action: LegalAction, index: number): ResolvedLegalAction => {
  const safeHref = resolveSafeHref(action.href?.trim())

  return {
    key: `legal-action-${index}`,
    label: action.label.trim(),
    href: safeHref?.href,
    target: safeHref?.target,
    rel: safeHref?.rel,
    disabled: safeHref?.disabled || safeHref?.href == null
  }
}

const resolveEmailAction = (
  action: LegalAction,
  index: number,
  isClientReady: boolean
): ResolvedLegalAction => {
  const href = resolveEmailHref(action, isClientReady)
  const email = href?.replace(/^mailto:/, '') ?? ''

  return {
    key: `legal-action-${index}`,
    label: resolveEmailLabel(action.label, email),
    href,
    disabled: !href
  }
}

export const useResolvedLegalActions = (actions: MaybeRefOrGetter<LegalAction[] | undefined>) => {
  const isClientReady = ref(false)

  onMounted(() => {
    isClientReady.value = true
  })

  const resolvedActions = computed(() =>
    (toValue(actions) ?? []).map((action, index) =>
      action.email
        ? resolveEmailAction(action, index, isClientReady.value)
        : resolveStandardAction(action, index)
    )
  )

  return {
    resolvedActions
  }
}
