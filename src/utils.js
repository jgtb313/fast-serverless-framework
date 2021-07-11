import fs from 'fs'
import normalizePath from 'normalize-path'
import { resolve } from 'path'

const safeTryCatch = (callback, fallback, file) => {
  try {
    return callback()
  } catch (err) {
    console.log({ err, file })
    return fallback
  }
}

const readModules = () => safeTryCatch(() => fs.readdirSync(`${__dirname}/../../../src/modules`), [])
const getConfig = async () => {
  console.log({
    resolve: resolve('src/config'),
    cwd: process.cwd(),
    configDirname: `../../../src/config`
  })
  const config = await import('../../../src/config')
  return config
}

const getContext = () => {
  const trace = normalizePath(Error().stack.split('Object.<anonymous>')[1].split('.js')[0]).split('modules')[1].split('/').filter(st => st)
  const [module, service, a = '', b = ''] = trace

  const [file] = service === 'endpoints'
    ? b.split('.js')
    : a.split('.js')
  const version = service === 'endpoints'
    ? a
    : undefined
  const path = service === 'endpoints'
    ? `src/modules/${module}/${service}/${version}/${file}`
    : `src/modules/${module}/${service}/${file}`

  return {
    module,
    version,
    service,
    file,
    path
  }
}

const capitalize = (value) => value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()

const uniq = (array, prop) => [...new Set(array.map(item => prop ? item[prop] : item))]

const kebabize = (value) => value.replace(/[A-Z]+(?![a-z])|[A-Z]/g, ($, ofs) => (ofs ? '-' : '') + $.toLowerCase())

const asyncPipe = (...fns) => (...args) => fns.reduce((p, f) => p.then(f), Promise.resolve(...args))

export {
  safeTryCatch,
  readModules,
  getConfig,
  getContext,
  capitalize,
  uniq,
  kebabize,
  asyncPipe
}
