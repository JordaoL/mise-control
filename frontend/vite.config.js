import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': 'http://172.30.144.1:8000'
    },
    watch: {
      usePolling: true,
      interval: 300,
    }
  }
})
