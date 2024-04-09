import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineConfig({
  define: {
    'process.env': {},
    VERSION_PLACEHOLDER: JSON.stringify('1.0.0')
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: 'CCLowcodeEngine',
      fileName: 'index',
      formats: ['esm', 'umd']
    },
    sourcemap: true,
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue'
        }
      }
    }
  },
  plugins: [nodePolyfills(), vue(), vueJsx()]
})