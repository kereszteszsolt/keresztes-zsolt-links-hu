/*
 * Profile Link Starter - deploy-gh-pages.mjs
 * Publishes the generated static site to the gh-pages branch without the gh-pages package.
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

import { execFileSync } from 'node:child_process'
import { cpSync, existsSync, mkdtempSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const publishDir = resolve(rootDir, '.output/public')
const branchName = process.env.DEPLOY_BRANCH?.trim() || 'gh-pages'
const gitUserName = process.env.DEPLOY_GIT_USER_NAME?.trim() || 'github-actions[bot]'
const gitUserEmail =
  process.env.DEPLOY_GIT_USER_EMAIL?.trim() || '41898282+github-actions[bot]@users.noreply.github.com'

const run = (command, args, cwd) => {
  execFileSync(command, args, {
    cwd,
    stdio: 'inherit'
  })
}

const read = (command, args, cwd) =>
  execFileSync(command, args, {
    cwd,
    encoding: 'utf8'
  }).trim()

const resolveRemoteUrl = () => {
  const explicitRemote = process.env.DEPLOY_REMOTE_URL?.trim()

  if (explicitRemote) {
    return explicitRemote
  }

  const repository = process.env.GITHUB_REPOSITORY?.trim()
  const token = process.env.GITHUB_TOKEN?.trim()

  if (repository && token) {
    return `https://x-access-token:${token}@github.com/${repository}.git`
  }

  try {
    return read('git', ['remote', 'get-url', 'origin'], rootDir)
  } catch {
    throw new Error(
      'Unable to resolve the git remote. Set DEPLOY_REMOTE_URL or configure an origin remote before deploying.'
    )
  }
}

if (!existsSync(publishDir)) {
  throw new Error('Missing .output/public. Run "npm run generate" before deploying.')
}

writeFileSync(resolve(publishDir, '.nojekyll'), '', 'utf8')

const deployDir = mkdtempSync(resolve(tmpdir(), 'links-hu-gh-pages-'))

try {
  for (const entry of readdirSync(publishDir)) {
    cpSync(resolve(publishDir, entry), resolve(deployDir, entry), {
      recursive: true
    })
  }

  run('git', ['init'], deployDir)
  run('git', ['checkout', '-b', branchName], deployDir)
  run('git', ['config', 'user.name', gitUserName], deployDir)
  run('git', ['config', 'user.email', gitUserEmail], deployDir)
  run('git', ['add', '--all'], deployDir)
  run(
    'git',
    [
      'commit',
      '--message',
      `Deploy ${process.env.GITHUB_SHA?.slice(0, 7) || new Date().toISOString()}`
    ],
    deployDir
  )
  run('git', ['remote', 'add', 'origin', resolveRemoteUrl()], deployDir)
  run('git', ['push', '--force', 'origin', `HEAD:${branchName}`], deployDir)
} finally {
  rmSync(deployDir, {
    recursive: true,
    force: true
  })
}
