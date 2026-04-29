import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/auth': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/api/clients': {
        target: 'http://localhost:8081',
        changeOrigin: true,
      },
      '/api/projects': {
        target: 'http://localhost:8081',
        changeOrigin: true,
      },
      '/api/phases': {
        target: 'http://localhost:8081',
        changeOrigin: true,
      },
      '/api/tasks': {
        target: 'http://localhost:8081',
        changeOrigin: true,
      },
    },
  },
})