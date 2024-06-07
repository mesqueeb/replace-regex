import * as path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const PATH_REPO_ROOT = path.join(__dirname, '../..')
export const PATH_TEST_HELPERS = path.join(PATH_REPO_ROOT, './test/helpers')
