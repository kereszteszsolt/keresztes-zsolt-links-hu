/*
 * Profile Link Starter - clean-output.mjs
 * Removes generated Nuxt build output directories before fresh builds.
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

import { existsSync, rmSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const outputPaths = ['.nuxt', '.output'].map((path) => resolve(rootDir, path))

for (const outputPath of outputPaths) {
  if (!existsSync(outputPath)) {
    continue
  }

  rmSync(outputPath, {
    force: true,
    recursive: true
  })
}
