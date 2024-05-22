import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'SimulatorRenderer',
      fileName: () => 'vue-simulator-renderer.js',
      formats: ['umd']
    },
    sourcemap: true,
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue'
        }
      },
      assetFileNames: 'vue-simulator-renderer.css'
    }
  },
  plugins: [
    nodePolyfills(),
    vue(), 
    vueJsx()
  ]
})