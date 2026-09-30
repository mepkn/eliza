import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss()],
  // elizabot is CommonJS. Pre-bundle the engine and its data file together so
  // dev and build share ONE instance of the data module (we mutate it at startup).
  optimizeDeps: {
    include: ['elizabot', 'elizabot/elizadata.js'],
  },
  test: {
    environment: 'node',
  },
})
