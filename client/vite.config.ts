import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@shared': path.resolve(__dirname, '../shared'),
    },
  },
  server: {
    port: 5173,
    host: true, // Важно для доступа с внешних хостов
    allowedHosts: [
      'all', // Разрешает все хосты
      '.ngrok-free.app', // Все поддомены ngrok
      'localhost'
    ],
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false, // Для HTTPS-проксирования
      },
    },
    headers: {
      "Access-Control-Allow-Origin": "*", // CORS заголовки
      "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,PATCH,OPTIONS"
    }
  },
})