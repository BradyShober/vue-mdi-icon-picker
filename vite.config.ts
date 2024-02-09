import path from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

const ASSET_PATH = process.env.ASSET_PATH || './dist/';

export default defineConfig({
  build: {
    outDir: path.resolve(__dirname, 'dist'),
    assetsDir: ASSET_PATH,
    minify: 'terser',
    lib: {
      entry: path.resolve(__dirname, 'src/index.js'),
      name: 'MdiIconPicker',
      formats: ['umd'],
      fileName: 'vue-mdi-icon-picker.min.js'
    },
    sourcemap: true
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': path.resolve(__dirname, 'src')
    }
  },
  plugins: [
    vue()
  ],
  server: {
    port: 3000 // Adjust the port as needed
  }
});