/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import KeepDescriptions from 'prepare-for-vale/KeepDescriptions'
import fs from 'fs'
import fg from 'fast-glob'
import tmp from 'tmp'
import path from 'path'

describe('KeepDescriptions', () => {
  var temp: tmp.DirResult
  var fixture_path: string = './tools/tests/prepare-for-vale/fixtures'
  var fixtures = fg.globSync(`${fixture_path}/**/*.{yaml,yml}`, { dot: true })

  describe('defaults', () => {
    beforeAll(() => {
      temp = tmp.dirSync()
      fs.cpSync(fixture_path, temp.name, { recursive: true })
      new KeepDescriptions(temp.name).process()
    })

    afterAll(() => {
      temp.removeCallback()
    })

    describe('converts files to text in-place', () => {
      fixtures.forEach((filename) => {
        test(filename, () => {
          const processed_yaml = filename.replace(fixture_path, temp.name)
          const basename = path.basename(processed_yaml, path.extname(processed_yaml))
          const filename_txt = path.join(path.dirname(processed_yaml), basename + '.txt')
          expect(fs.readFileSync(processed_yaml, 'utf8')).toEqual(fs.readFileSync(filename_txt, 'utf8'))
          fs.rmSync(processed_yaml)
          fs.rmSync(filename_txt)
        })
      })
    })
  })
})