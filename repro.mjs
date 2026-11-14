import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import webpack from 'webpack'
import {rspack} from '@rspack/core'

const work = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'repro-')))
const project = path.join(work, 'project')
const entry = path.join(project, 'src', 'a.js')

for (const file of [entry, path.join(project, entry)]) {
  fs.mkdirSync(path.dirname(file), {recursive: true})
  fs.writeFileSync(file, '')
}

// the entry is an absolute path that also exists below `resolve.roots`.
// with `preferAbsolute: true` the absolute path should win
function resolvedEntry(bundler, name) {
  const compiler = bundler({
    mode: 'development',
    context: project,
    entry,
    output: {path: path.join(work, name)},
    resolve: {roots: [project], preferAbsolute: true}
  })

  return new Promise((resolve, reject) => {
    compiler.run((error, stats) => {
      if (error) return reject(error)

      const entryModule = [...stats.compilation.modules].find((module) => module.resource?.endsWith('a.js'))
      compiler.close(() => resolve(entryModule.resource.replaceAll(work, '<tmp>')))
    })
  })
}

console.log('webpack:', await resolvedEntry(webpack, 'webpack'))
console.log('rspack: ', await resolvedEntry(rspack, 'rspack'))

fs.rmSync(work, {recursive: true, force: true})
