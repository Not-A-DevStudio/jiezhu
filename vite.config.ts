import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { blogManifestPlugin } from './blog.config'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), blogManifestPlugin()],
  base: '/jiezhu/',
})
