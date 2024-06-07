#!/usr/bin/env node
/* eslint-disable no-undef */
import meow from 'meow'
import process from 'node:process'
import { replaceRegex } from './dist/index.js'

const cli = meow(
  `
	Usage
	  $ replace-regex <files…>

	Options
	  --from            Regex pattern or string to find (Can be set multiple times)
	  --to              Replacement string or function (Required)
	  --dry             Dry run (do not actually replace, just show what would be replaced)
	  --no-glob         Disable globbing
	  --count-matches   Count matches and replacements
	  --ignore          Ignore files matching this pattern (Can be set multiple times)
	  --ignore-case     Search case-insensitively

	Examples
	  $ replace-regex --from='fox' --to='🦊' foo.md
	  $ replace-regex --from='v\\d+\\.\\d+\\.\\d+' --to='v$npm_package_version' foo.css
	  $ replace-regex --from='blob' --to='blog' 'some/**/[gb]lob/*' '!some/glob/foo'
`,
  {
    importMeta: import.meta,
    flags: {
      from: {
        type: 'string',
        isMultiple: true,
      },
      to: {
        type: 'string',
        isRequired: true,
      },
      dry: {
        type: 'boolean',
        default: false,
      },
      glob: {
        type: 'boolean',
        default: true,
      },
      countMatches: {
        type: 'boolean',
        default: false,
      },
      ignore: {
        type: 'string',
        isMultiple: true,
      },
      ignoreCase: {
        type: 'boolean',
        default: false,
      },
    },
  },
)

if (cli.input.length === 0) {
  console.error('Specify one or more file paths')
  process.exit(1)
}

if (!cli.flags.from || cli.flags.from.length === 0) {
  console.error('Specify at least `--from`')
  process.exit(1)
}

const replaceOptions = {
  files: cli.input,
  from: cli.flags.from,
  to: cli.flags.to,
  dry: cli.flags.dry,
  disableGlobs: !cli.flags.glob,
  countMatches: cli.flags.countMatches,
  ignore: cli.flags.ignore,
  ignoreCase: cli.flags.ignoreCase,
}

const results = await replaceRegex(replaceOptions)

results.forEach((result) => {
  const { file, replaceCount, matchCount } = result
  console.log(`file: ${file}
replace count: ${replaceCount}
match count: ${matchCount}`)
})
