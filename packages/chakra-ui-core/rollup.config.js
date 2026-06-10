import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'

import { babel } from '@rollup/plugin-babel'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import scss from 'rollup-plugin-scss'
import vue from 'rollup-plugin-vue'

const require = createRequire(import.meta.url)
const pkg = require('./package.json')

// Babel
const babelConfig = babel({
  exclude: /node_modules/,
  babelHelpers: 'bundled',
  presets: [
    [
      '@babel/preset-env',
      {
        modules: false
      }
    ]
  ]
})

const vueConfig = vue({
  template: {
    isProduction: true
  }
})

// Externals
const externals = [
  ...Object.keys(pkg.peerDependencies || {})
]

const commons = {
  external: externals,
  plugins: [
    nodeResolve({
      extensions: ['.vue', '.js']
    }),
    scss({
      output: false
    }),
    vueConfig,
    babelConfig,
    commonjs({
      include: /node_modules/
    })
  ]
}

const bannerTxt = `
/*
 * ! @chakra-ui/vue v${pkg.version} by Jonathan Bakebwa @codebender828
 * MIT License
 * https://github.com/chakra-ui/chakra-ui-vue
 */
`

const baseFolder = './src/'

const components = fs.readdirSync(baseFolder)
  .filter(f => fs.statSync(path.join(baseFolder, f)).isDirectory())

const entries = {
  index: './src/index.js',
  ...components.reduce((obj, name) => {
    obj[name] = (baseFolder + name + '/index.js')
    return obj
  }, {})
}

/**
 * Configurations
 */
export default () => {
  const config = [
    {
      input: entries,
      output: {
        dir: 'dist/esm/',
        format: 'esm',
        banner: bannerTxt
      },
      ...commons
    },
    {
      input: entries,
      output: {
        dir: 'dist/cjs/',
        format: 'cjs',
        exports: 'named',
        banner: bannerTxt
      },
      ...commons
    }
  ]
  return config
}
