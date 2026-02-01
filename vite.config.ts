import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(() => {
  return {
    /**
     * IMPORTANT for GitHub Pages (project repo)
     * Must match the repository name exactly
     */
    base: '/Auranitis-Civic-Academy-/',

    plugins: [react()],

    /**
     * Dev server (used only locally or by GitHub Actions preview)
     */
    server: {
      port: 3000,
      host: '0.0.0.0',
    },

    /**
     * Path aliases
     */
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },

    /**
     * Build settings (safe defaults)
     */
    build: {
      outDir: 'dist',
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks: undefined,
        },
      },
    },
  }
})
