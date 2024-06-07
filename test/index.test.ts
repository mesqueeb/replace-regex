import * as fs from 'node:fs/promises'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { ReplaceRegexOptions, replaceRegex } from '../src/index.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PATH_REPO_ROOT = path.join(__dirname, '..')
const PATH_TEST_FILES = path.join(PATH_REPO_ROOT, './test/testfiles')

const resetTestFiles = async () => {
  await fs.writeFile(path.join(PATH_TEST_FILES, 'file1.txt'), 'This is a test file content.')
  await fs.writeFile(path.join(PATH_TEST_FILES, 'file2.txt'), 'This is a test file content.')
}

describe('replaceRegex', () => {
  beforeEach(async () => {
    await resetTestFiles()
  })

  afterEach(async () => {
    await resetTestFiles()
  })

  it('should replace text in files using regex', async () => {
    const options: ReplaceRegexOptions = {
      files: path.join(PATH_TEST_FILES, '*.txt'),
      from: /test/g,
      to: 'TEST',
      disableGlobs: false,
      dry: false,
      countMatches: true,
    }

    const results = await replaceRegex(options)

    expect(results).toEqual([
      {
        file: path.join(PATH_TEST_FILES, 'file1.txt'),
        matchCounts: 1,
        replaceCounts: 1,
        changed: true,
      },
      {
        file: path.join(PATH_TEST_FILES, 'file2.txt'),
        matchCounts: 1,
        replaceCounts: 1,
        changed: true,
      },
    ])

    const file1Content = await fs.readFile(path.join(PATH_TEST_FILES, 'file1.txt'), 'utf8')
    const file2Content = await fs.readFile(path.join(PATH_TEST_FILES, 'file2.txt'), 'utf8')

    expect(file1Content).toBe('This is a TEST file content.')
    expect(file2Content).toBe('This is a TEST file content.')
  })

  it('should support dry mode', async () => {
    const options: ReplaceRegexOptions = {
      files: path.join(PATH_TEST_FILES, '*.txt'),
      from: /test/g,
      to: 'TEST',
      disableGlobs: false,
      dry: true,
      countMatches: true,
    }

    const results = await replaceRegex(options)

    expect(results).toEqual([
      {
        file: path.join(PATH_TEST_FILES, 'file1.txt'),
        matchCounts: 1,
        replaceCounts: 1,
        changed: true,
      },
      {
        file: path.join(PATH_TEST_FILES, 'file2.txt'),
        matchCounts: 1,
        replaceCounts: 1,
        changed: true,
      },
    ])

    const file1Content = await fs.readFile(path.join(PATH_TEST_FILES, 'file1.txt'), 'utf8')
    const file2Content = await fs.readFile(path.join(PATH_TEST_FILES, 'file2.txt'), 'utf8')

    // Ensure the content has not changed in dry mode
    expect(file1Content).toBe('This is a test file content.')
    expect(file2Content).toBe('This is a test file content.')
  })

  it('should handle no matches', async () => {
    const options: ReplaceRegexOptions = {
      files: path.join(PATH_TEST_FILES, '*.txt'),
      from: /nonexistent/g,
      to: 'TEST',
      disableGlobs: false,
      dry: false,
      countMatches: true,
    }

    const results = await replaceRegex(options)

    expect(results).toEqual([
      {
        file: path.join(PATH_TEST_FILES, 'file1.txt'),
        matchCounts: 0,
        replaceCounts: 0,
        changed: false,
      },
      {
        file: path.join(PATH_TEST_FILES, 'file2.txt'),
        matchCounts: 0,
        replaceCounts: 0,
        changed: false,
      },
    ])

    const file1Content = await fs.readFile(path.join(PATH_TEST_FILES, 'file1.txt'), 'utf8')
    const file2Content = await fs.readFile(path.join(PATH_TEST_FILES, 'file2.txt'), 'utf8')

    expect(file1Content).toBe('This is a test file content.')
    expect(file2Content).toBe('This is a test file content.')
  })
})
