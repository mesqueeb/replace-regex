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
  countMatches: true,
})

console.log(results)
```

### Options

- `files` (string or string[]): Glob patterns or file paths to process.
- `from` (string | RegExp | (file: string) => string | RegExp): The pattern to search for.
- `to` (string | (match: string, file: string) => string): The replacement string or function.
- `dry` (boolean, optional): If true, no files will be overwritten. Default is `false`.
- `ignore` (string[], optional): An array of glob patterns to exclude matches.
- `disableGlobs` (boolean, optional): If true, disables glob pattern matching. Default is `false`.
- `fastGlobOptions` (object, optional): Options to pass to fast-glob.
- `countMatches` (boolean, optional): If true, counts the number of matches and replacements. Default is `false`.

### Examples

**Replace text in JavaScript files**

```ts
replaceRegex({
  files: 'src/**/*.js',
  from: /console\.log/g,
  to: 'logger.log',
  dry: false,
  countMatches: true,
})
```

**Dry Run**

```ts
const result = await replaceRegex({
  files: 'src/**/*.js',
  from: /foo/g,
  to: 'bar',
  dry: true, // No files will be overwritten
  countMatches: true,
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
  countMatches: true,
})
```
