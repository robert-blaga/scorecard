import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api": "http://localhost:3000", // Adjust based on Vercel's local API port
    },
    historyApiFallback: true
  },
  plugins: [
    tailwindcss({
      applyBaseStyles: false,
    }),
    react(),
  ],
})
