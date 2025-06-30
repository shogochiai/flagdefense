import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // 相対パスを使用（tiiny.site用）
  server: {
    port: 3000,
    open: true,
    fs: {
      allow: [resolve(__dirname, '../..')] // Allow serving files from parent directory
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  },
  publicDir: resolve(__dirname, '../assets') // Use assets from parent directory
})