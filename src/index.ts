import fastGlob from 'fast-glob'
import { isArray, isFunction, isString } from 'is-what'
import * as fs from 'node:fs/promises'

type MaybeArr<T> = T | T[]

export type ReplaceRegexOptions = {
  files: MaybeArr<string>
  from: string | RegExp | string[] | RegExp[] | ((file: string) => string | RegExp)
  to: string | ((match: string, file: string) => string)
  dry?: boolean
  ignore?: string[]
  disableGlobs?: boolean
  fastGlobOptions?: Parameters<typeof fastGlob>[1]
  /**
   * when passing a `string` to `from` you can make it ignore case with this flag.
   * otherwise, you need to embed `i` into your regex
   */
  ignoreCase?: boolean
}

export type ReplaceRegexResult = {
  file: string
  matchCount: number
  replaceCount: number
  changed: boolean
}

/**
 * async use fast-glob to get all files
 */
async function getPathsAsync(
  patterns: MaybeArr<string>,
  options: ReplaceRegexOptions,
): Promise<string[]> {
  const { ignore, disableGlobs, fastGlobOptions } = options

  // disable globs, just ensure file(s) name
  if (disableGlobs) return isString(patterns) ? [patterns] : patterns

  return await fastGlob(patterns, { ignore, ...fastGlobOptions })
}

/**
 * replace main
 */
function replaceFactory(options: {
  contents: string
  file: string
  from: string | RegExp | ((file: string) => string | RegExp)
  to: ReplaceRegexOptions['to']
  ignoreCase?: ReplaceRegexOptions['ignoreCase']
}): {
  result: ReplaceRegexResult
  newContents: string
} {
  const { contents, from, to, file, ignoreCase } = options
  const result: ReplaceRegexResult = {
    file,
    changed: false,
    matchCount: 0,
    replaceCount: 0,
  }

  const _from = isFunction(from) ? from(file) : from
  const flags = ignoreCase ? 'gi' : 'g'
  const fromRegex = isString(_from) ? new RegExp(_from, flags) : _from

  const matches = contents.match(fromRegex)
  if (matches) {
    const replacements = matches.filter((match) => match !== to)
    result.matchCount = matches.length
    result.replaceCount = replacements.length
  }

  const newContents = isFunction(to)
    ? contents.replace(fromRegex, (match: string) => to(match, file))
    : contents.replace(fromRegex, to)

  result.changed = newContents !== contents

  return {
    result,
    newContents,
  }
}

/**
 * async replace string in single file
 */
async function replaceFileAsync(options: {
  file: string
  from: string | RegExp | ((file: string) => string | RegExp)
  to: ReplaceRegexOptions['to']
  dry: ReplaceRegexOptions['dry']
  ignoreCase?: ReplaceRegexOptions['ignoreCase']
}): Promise<ReplaceRegexResult> {
  const { file, from, to, dry, ignoreCase } = options

  const contents = await fs.readFile(file)

  // replace action
  const { result, newContents } = replaceFactory({
    contents: contents.toString(),
    from,
    to,
    file,
    ignoreCase,
  })

  if (!result.changed || dry) return result

  // write action
  await fs.writeFile(file, newContents)
  return result
}

/**
 * Uses fast-glob to find and replace text in files. Supports RegExp.
 */
export async function replaceRegex(options: ReplaceRegexOptions): Promise<ReplaceRegexResult[]> {
  const { files, from, dry, to, ignoreCase } = options
  // dry mode, do not replace
  if (dry) console.log('[dry mode] no files will be overwritten')

  const foundFiles = await getPathsAsync(files, options)
  const fromClauses: (string | RegExp | ((file: string) => string | RegExp))[] = isArray(from)
    ? from
    : [from]
  const results: Promise<ReplaceRegexResult>[] = []

  for (const from of fromClauses) {
    for (const file of foundFiles) {
      results.push(replaceFileAsync({ file, from, to, dry, ignoreCase }))
    }
  }

  return await Promise.all(results)
}
