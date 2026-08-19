import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { getMacroDefines, DEFAULT_BUILD_FEATURES } from './defines.ts'

const DIST = resolve(import.meta.dir, '..', 'dist')
const OUTFILE = resolve(DIST, 'claude-bundle.js')

const result = await Bun.build({
  entrypoints: [resolve(import.meta.dir, '..', 'src/entrypoints/cli.tsx')],
  outfile: '/dev/stdout',
  target: 'bun',
  splitting: false,
  sourcemap: 'none',
  minify: true,
  define: {
    ...getMacroDefines(),
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
  features: DEFAULT_BUILD_FEATURES,
})

if (!result.success) {
  for (const log of result.logs) console.error(log)
  process.exit(1)
}

const text = await result.outputs[0].text()
await mkdir(DIST, { recursive: true })
await writeFile(OUTFILE, text, 'utf-8')
console.log(
  `Bundled: ${OUTFILE} (${(text.length / 1024 / 1024).toFixed(1)} MB)`,
)
