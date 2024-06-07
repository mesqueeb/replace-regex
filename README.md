# replace-regex 📂

<a href="https://www.npmjs.com/package/replace-regex"><img src="https://img.shields.io/npm/v/replace-regex.svg" alt="Total Downloads"></a>
<a href="https://www.npmjs.com/package/replace-regex"><img src="https://img.shields.io/npm/dw/replace-regex.svg" alt="Latest Stable Version"></a>

📂 TS compatible modern nodeJS find-and-replace in files with Regex & Glob support.

```
npm i replace-regex
```

## Features

- **Glob Support**: Use glob patterns to specify files.
- **Regex Support**: Replace text using regular expressions.
- **Dry Run**: Preview changes without modifying files.
- **Count**: Count matches and replacements.
- **Customizable**: Pass custom options to fine-tune behavior.

## Usage

### Basic Usage

```ts
import { replaceRegex } from 'replace-regex'

const results = await replaceRegex({
  files: 'src/**/*.js',
  from: /foo/g,
  to: 'bar',
  dry: false,
})

console.log(results)
```

### CLI Usage

You can use the `replace-regex` CLI to find and replace text in files using regular expressions right from the terminal.

```sh
Usage
  $ replace-regex <files…>

Options
  --from            Regex pattern or string to find (Can be set multiple times)
  --to              Replacement string or function (Required)
  --dry             Dry run (do not actually replace, just show what would be replaced)
  --no-glob         Disable globbing
  --ignore          Ignore files matching this pattern (Can be set multiple times)
  --ignore-case     Search case-insensitively

Examples
  $ replace-regex --from='fox' --to='🦊' foo.md
  $ replace-regex --from='v\\d+\\.\\d+\\.\\d+' --to='v$npm_package_version' foo.css
  $ replace-regex --from='blob' --to='blog' 'some/**/[gb]lob/*' '!some/glob/foo'
```

### Options

- `files` (string or string[]): Glob patterns or file paths to process.
- `from` (string | RegExp | (file: string) => string | RegExp): The pattern to search for.
- `to` (string | (match: string, file: string) => string): The replacement string or function.
- `dry` (boolean, optional): If true, no files will be overwritten. Default is `false`.
- `ignore` (string[], optional): An array of glob patterns to exclude matches.
- `disableGlobs` (boolean, optional): If true, disables glob pattern matching. Default is `false`.
- `fastGlobOptions` (object, optional): Options to pass to fast-glob.

### CLI Examples

To replace all occurrences of the word `fox` with `🦊` in the file `foo.md`:

```sh
replace-regex --from='fox' --to='🦊' foo.md
```

To replace version numbers in a CSS file with the version from your `package.json`:

```sh
replace-regex --from='v\\d+\\.\\d+\\.\\d+' --to='v$npm_package_version' foo.css
```

To replace the word `blob` with `blog` in files matching a glob pattern, while ignoring certain files:

```sh
replace-regex --from='blob' --to='blog' 'some/**/[gb]lob/*' '!some/glob/foo'
```

To perform a dry run (no files will be overwritten):

```sh
replace-regex --from='fox' --to='🦊' --dry foo.md
```

To perform a case-insensitive search and replace:

```sh
replace-regex --from='fox' --to='🦊' --ignore-case foo.md
```

### API Examples

**Replace text in JavaScript files**

```ts
replaceRegex({
  files: 'src/**/*.js',
  from: /console\.log/g,
  to: 'logger.log',
  dry: false,
})
```

**Dry Run**

```ts
const result = await replaceRegex({
  files: 'src/**/*.js',
  from: /foo/g,
  to: 'bar',
  dry: true, // No files will be overwritten
})

console.log(`result → `, result)
```

**Custom Replacement Function**

```ts
replaceRegex({
  files: 'src/**/*.js',
  from: /foo/g,
  to: (match, file) => `${match.toUpperCase()} in ${file}`,
  dry: false,
})
```
