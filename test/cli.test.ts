import { execa } from 'execa'
import { promises as fs } from 'node:fs'
import path, { join } from 'node:path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { PATH_REPO_ROOT, PATH_TEST_HELPERS } from './helpers/pathHelpers.ts'

const PATH_CLI = join(PATH_REPO_ROOT, './cli.js')

const resetTestFiles = async () => {
  await fs.writeFile(path.join(PATH_TEST_HELPERS, 'cli/file1.txt'), 'This is a test file content.')
  await fs.writeFile(path.join(PATH_TEST_HELPERS, 'cli/file2.txt'), 'This is a test file content.')
}

describe('CLI', () => {
  beforeEach(async () => await resetTestFiles())
  afterEach(async () => await resetTestFiles())

  it('should replace text in files using regex', async () => {
    const { stdout, stderr } = await execa('node', [
      PATH_CLI,
      '--from=test',
      '--to=TEST',
      join(PATH_TEST_HELPERS, 'cli/file1.txt'),
      join(PATH_TEST_HELPERS, 'cli/file2.txt'),
    ])

    const fileContent1 = await fs.readFile(join(PATH_TEST_HELPERS, 'cli/file1.txt'), 'utf-8')
    const fileContent2 = await fs.readFile(join(PATH_TEST_HELPERS, 'cli/file2.txt'), 'utf-8')
    expect(fileContent1).toBe('This is a TEST file content.')
    expect(fileContent2).toBe('This is a TEST file content.')
  })

  it('should support dry mode', async () => {
    const { stdout } = await execa('node', [
      PATH_CLI,
      '--from=test',
      '--to=TEST',
      '--dry',
      join(PATH_TEST_HELPERS, 'cli/file1.txt'),
      join(PATH_TEST_HELPERS, 'cli/file2.txt'),
    ])

    const fileContent1 = await fs.readFile(join(PATH_TEST_HELPERS, 'cli/file1.txt'), 'utf-8')
    const fileContent2 = await fs.readFile(join(PATH_TEST_HELPERS, 'cli/file2.txt'), 'utf-8')
    expect(fileContent1).toBe('This is a test file content.')
    expect(fileContent2).toBe('This is a test file content.')
  })

  it('should handle no matches', async () => {
    const { stdout } = await execa('node', [
      PATH_CLI,
      '--from=nonexistent',
      '--to=TEST',
      join(PATH_TEST_HELPERS, 'cli/file1.txt'),
      join(PATH_TEST_HELPERS, 'cli/file2.txt'),
    ])

    const fileContent1 = await fs.readFile(join(PATH_TEST_HELPERS, 'cli/file1.txt'), 'utf-8')
    const fileContent2 = await fs.readFile(join(PATH_TEST_HELPERS, 'cli/file2.txt'), 'utf-8')
    expect(fileContent1).toBe('This is a test file content.')
    expect(fileContent2).toBe('This is a test file content.')
  })

  it('should handle ignore-case flag', async () => {
    const { stdout } = await execa('node', [
      PATH_CLI,
      '--from=Test',
      '--to=TEST',
      '--ignore-case',
      join(PATH_TEST_HELPERS, 'cli/file1.txt'),
      join(PATH_TEST_HELPERS, 'cli/file2.txt'),
    ])

    const fileContent1 = await fs.readFile(join(PATH_TEST_HELPERS, 'cli/file1.txt'), 'utf-8')
    const fileContent2 = await fs.readFile(join(PATH_TEST_HELPERS, 'cli/file2.txt'), 'utf-8')
    expect(fileContent1).toBe('This is a TEST file content.')
    expect(fileContent2).toBe('This is a TEST file content.')
  })
})
