import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// The old WordPress clone lives in this folder as reference material.
// Keep Vite from crawling or watching its ~600 HTML files.
const OLD_SITE = 'Meena IVF Old Site Clone'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: { entries: ['index.html'] },
  server: { watch: { ignored: [`**/${OLD_SITE}/**`] } },
})
