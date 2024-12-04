#!/usr/bin/env node

// Copyright 2024 omasakun <omasakun@o137.net>.
//
// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { Command } from 'commander'
import { globby } from 'globby'
import { createHash } from 'node:crypto'
import { readFileSync, statSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'
import stripJsonComments from 'strip-json-comments'

const program = new Command()
program
  .option('-c, --config <path>', 'Path to the configuration file', 'notice.json')
  .option('-r, --root <path>', 'Path to the root directory', process.cwd())
  .argument('[files...]')
  .parse(process.argv)

const options = program.opts()
const ROOT = resolve(process.cwd(), options.root)

// Load configuration
const configPath = resolve(ROOT, options.config)
const configContent = readFileSync(configPath, 'utf8')
const config = JSON.parse(stripJsonComments(configContent))

const LICENSE_HASH: string = config.licenseHash ?? ''
const NOTICE: string[] = config.notice
const EXCLUDED_PREFIX: string[] = config.excludedPrefix ?? []
const EXCLUDED_SUFFIX: string[] = config.excludedSuffix ?? []
const EXCLUDED: string[] = config.excluded ?? []

if (!statSync(join(ROOT, 'LICENSE')).isFile()) {
  console.log('LICENSE is missing in the root directory')
  process.exit(1)
}

const licenseContent = readFileSync(join(ROOT, 'LICENSE'))
const licenseHash = createHash('sha256').update(licenseContent).digest('hex')
if (licenseHash !== LICENSE_HASH) {
  console.log('LICENSE has been modified. Please update the license hash in the configuration file')
  console.log(`Current hash: ${licenseHash}`)
  process.exit(1)
}

let ok = true
let files: string[]

if (program.args.length > 0) {
  files = program.args
} else {
  files = await globby('**/*', { cwd: ROOT, dot: true, gitignore: true })
}

files.forEach((file) => {
  file = relative(ROOT, resolve(ROOT, file))

  if (EXCLUDED_PREFIX.some((prefix) => file.startsWith(prefix))) return
  if (EXCLUDED_SUFFIX.some((suffix) => file.endsWith(suffix))) return
  if (EXCLUDED.includes(file)) return

  if (!statSync(resolve(ROOT, file)).isFile()) {
    console.log(`Not a file: ${file}`)
    ok = false
    return
  }

  const contents = readFileSync(resolve(ROOT, file), 'utf8')
  if (NOTICE.every((line) => contents.includes(line))) return

  console.log(`Fix: ${file}`)
  ok = false
})

if (!ok) {
  console.log(`Please add the notice to the files above or update the configuration file`)
  process.exit(1)
}
