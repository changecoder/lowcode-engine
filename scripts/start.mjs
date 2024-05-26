import path, { resolve } from 'path'
import { fileURLToPath } from 'url'

import { build } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import express from 'express'
// 启动静态资源服务
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PORT = 5099

const app = express()
app.use(express.static(resolve(__dirname, '../dist')))
app.listen(PORT, 'localhost', () => {
  console.log(`Starting the development server at: \n - Local : http://localhost:${PORT}`)
})

// 构建engine和simulator
const libraries = [
  {
    entry: resolve(__dirname, '../packages/engine/src/index.ts'),
    name: 'CCLowCodeEngine',
    fileName: () => 'js/lowcode-engine.js',
    assetFileNames: 'css/lowcode-engine.css'
  },
  {
    entry: resolve(__dirname, '../packages/vue-simulator-renderer/src/index.ts'),
    name: 'SimulatorRenderer',
    fileName: () => 'js/vue-simulator-renderer.js',
    assetFileNames: 'css/vue-simulator-renderer.css'
  }
]

libraries.forEach(item => {
  const { assetFileNames, ...lib } = item
  build({
    define: {
      'process.env': {},
      VERSION_PLACEHOLDER: JSON.stringify('1.0.0')
    },
    build: {
      watch: true,
      outDir: './dist',
      sourcemap: true,
      target: 'ESNext',
      lib: {
        ...lib,
        formats: ['umd']
      },
      rollupOptions: {
        external: ['vue'],
        output: {
          exports: 'named',
          globals: {
            vue: 'Vue'
          },
          assetFileNames
        }
      },
      emptyOutDir: false
    },
    plugins: [
      nodePolyfills(),
      vue(), 
      vueJsx()
    ]
  })
})
