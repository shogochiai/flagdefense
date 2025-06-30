import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 3001,
    fs: {
      allow: ['../..']
    }
  },
  build: {
    outDir: 'dist'
  },
  publicDir: '../../',
  assetsInclude: ['**/*.yaml']
});