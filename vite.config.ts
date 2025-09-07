import { defineConfig, loadEnv } from 'vite'

import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
  base: '/customer-success-audit/',
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
      },
    },
  },
  server: {
    host: true,
    port: 5173,
    open: true,
    cors: true,
    strictPort: false,
    allowedHosts: ['localhost', '127.0.0.1', 'customer_success_audit_lcl'],
  },
  preview: {
    port: 4173,
    open: true,
  },
  plugins: [
    react(),
    tailwindcss(),
  ],
  define: {
    'process.env': Object.keys(env).reduce((acc: Record<string, string>, key): Record<string, string> => {
      if (key.startsWith('VITE_APP_')) {
        acc[key] = JSON.stringify(env[key]);
      }
      return acc;
    }, {})
  }
}})
