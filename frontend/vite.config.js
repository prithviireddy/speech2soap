import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  root: 'src',
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    open: true
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true
  }
})
