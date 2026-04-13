/*
 * Profile Link Starter - nuxt-app-manifest.ts
 * Provides a stable local fallback for Nuxt's virtual app manifest import.
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

const appManifest = {
  id: 'local-stub',
  timestamp: 0,
  prerendered: [] as string[]
}

export default appManifest
