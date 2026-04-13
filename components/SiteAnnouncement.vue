<!--
  Profile Link Starter - SiteAnnouncement.vue
  Displays the optional site-wide announcement banner and dismiss state.

  Copyright 2026 Keresztes Zsolt

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
-->

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { ResolvedAnnouncement } from '~/types/config'

const props = defineProps<{
  announcement: ResolvedAnnouncement
}>()

const dismissed = ref(false)

const storageKey = computed(() => `site-announcement:${props.announcement.id}`)
const actionHref = computed(() => props.announcement.action?.href?.trim() ?? '')
const hasAction = computed(() => Boolean(props.announcement.action?.label && actionHref.value))
const actionIsExternal = computed(() => /^(https?:)?\/\//i.test(actionHref.value))
const isVisible = computed(() => !dismissed.value)

const loadDismissedState = () => {
  if (typeof window === 'undefined' || !props.announcement.dismissible) {
    return
  }

  try {
    dismissed.value = window.localStorage.getItem(storageKey.value) === 'dismissed'
  } catch {
    dismissed.value = false
  }
}

const dismissAnnouncement = () => {
  dismissed.value = true

  if (typeof window === 'undefined' || !props.announcement.dismissible) {
    return
  }

  try {
    window.localStorage.setItem(storageKey.value, 'dismissed')
  } catch {
    // Ignore storage failures and still hide the banner for the current render.
  }
}

onMounted(() => {
  loadDismissedState()
})
</script>

<template>
  <div
    v-if="isVisible"
    class="site-announcement-shell"
    :class="[
      `site-announcement-shell-${announcement.tone}`,
      { 'site-announcement-shell-sticky': announcement.sticky }
    ]"
  >
    <div class="site-announcement-inner">
      <div class="site-announcement-copy">
        <p v-if="announcement.eyebrow" class="site-announcement-eyebrow">
          {{ announcement.eyebrow }}
        </p>
        <div class="site-announcement-text">
          <strong class="site-announcement-title">{{ announcement.title }}</strong>
          <p class="site-announcement-message">{{ announcement.message }}</p>
        </div>
      </div>

      <div class="site-announcement-actions">
        <NuxtLink
          v-if="hasAction && !actionIsExternal"
          class="site-announcement-link"
          :to="actionHref"
        >
          {{ announcement.action?.label }}
        </NuxtLink>
        <a
          v-else-if="hasAction"
          class="site-announcement-link"
          :href="actionHref"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{ announcement.action?.label }}
        </a>
        <button
          v-if="announcement.dismissible"
          type="button"
          class="site-announcement-dismiss"
          :aria-label="announcement.closeLabel"
          @click="dismissAnnouncement"
        >
          {{ announcement.closeLabel }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.site-announcement-shell {
  border-bottom: 1px solid rgba(54, 30, 18, 0.1);
  box-shadow: 0 18px 32px rgba(75, 43, 29, 0.08);
  position: relative;
  z-index: 3;
}

.site-announcement-shell-sticky {
  position: sticky;
  top: 0;
}

.site-announcement-shell-warning {
  background:
    linear-gradient(135deg, rgba(255, 247, 228, 0.96), rgba(247, 219, 180, 0.92)),
    linear-gradient(120deg, rgba(186, 92, 61, 0.14), rgba(255, 255, 255, 0.1));
}

.site-announcement-shell-info {
  background:
    linear-gradient(135deg, rgba(235, 247, 250, 0.96), rgba(206, 232, 239, 0.92)),
    linear-gradient(120deg, rgba(54, 118, 142, 0.14), rgba(255, 255, 255, 0.1));
}

.site-announcement-shell-success {
  background:
    linear-gradient(135deg, rgba(239, 249, 240, 0.96), rgba(210, 235, 213, 0.92)),
    linear-gradient(120deg, rgba(67, 124, 88, 0.14), rgba(255, 255, 255, 0.1));
}

.site-announcement-inner {
  align-items: center;
  display: flex;
  gap: 1rem;
  justify-content: space-between;
  margin: 0 auto;
  padding: 0.95rem 0;
  width: min(1160px, calc(100% - 2rem));
}

.site-announcement-copy {
  display: grid;
  gap: 0.35rem;
}

.site-announcement-eyebrow {
  color: rgba(106, 52, 31, 0.92);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.16em;
  margin: 0;
  text-transform: uppercase;
}

.site-announcement-text {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem 0.7rem;
}

.site-announcement-title {
  color: var(--text);
  font-family: var(--font-display);
  font-size: 1rem;
  line-height: 1.2;
}

.site-announcement-message {
  color: rgba(36, 23, 18, 0.78);
  line-height: 1.5;
  margin: 0;
  max-width: 72ch;
}

.site-announcement-actions {
  align-items: center;
  display: flex;
  flex-shrink: 0;
  flex-wrap: wrap;
  gap: 0.65rem;
  justify-content: flex-end;
}

.site-announcement-link,
.site-announcement-dismiss {
  align-items: center;
  background: rgba(255, 255, 255, 0.68);
  border: 1px solid rgba(54, 30, 18, 0.12);
  border-radius: 999px;
  color: var(--text);
  display: inline-flex;
  font-weight: 700;
  justify-content: center;
  min-height: 2.5rem;
  padding: 0.5rem 0.9rem;
  text-decoration: none;
  transition:
    transform var(--transition-fast),
    border-color var(--transition-fast),
    background var(--transition-fast);
}

.site-announcement-dismiss {
  cursor: pointer;
}

.site-announcement-link:hover,
.site-announcement-link:focus-visible,
.site-announcement-dismiss:hover,
.site-announcement-dismiss:focus-visible {
  background: rgba(255, 255, 255, 0.86);
  border-color: rgba(54, 30, 18, 0.2);
  outline: none;
  transform: translateY(-1px);
}

@media (max-width: 720px) {
  .site-announcement-inner {
    align-items: start;
    flex-direction: column;
    padding: 0.85rem 0;
  }

  .site-announcement-actions {
    justify-content: start;
    width: 100%;
  }
}
</style>
