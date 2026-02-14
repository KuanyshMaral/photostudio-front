import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
    proxy: {
      '/api': {
        target: 'http://89.35.125.136:8090',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          calendar: ['@fullcalendar/core', '@fullcalendar/react'],
          query: ['@tanstack/react-query']
        }
      }
    }
  },
  esbuild: {
    target: 'es2015'
  }
})
