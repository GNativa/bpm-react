import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/bpm-react',
  plugins: [react()],
  build: {
    minify: false
  },
})
