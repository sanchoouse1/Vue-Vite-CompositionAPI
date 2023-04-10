import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import type { ProxyOptions } from 'vite';
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 5173, // порт клиента
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // порт сервера
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        } as Record<string, string>,
      } as ProxyOptions,
    } as Record<string, string | ProxyOptions>,
  }
})
