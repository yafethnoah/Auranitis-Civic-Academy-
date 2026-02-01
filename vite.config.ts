import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // اجعل التحميل من جذر المشروع حتى يقرأ .env بشكل صحيح محليًا
  const env = loadEnv(mode, process.cwd(), '')

  return {
    // ✅ هذا هو المفتاح الأساسي لـ GitHub Pages (Project Pages)
    base: '/Auranitis-Civic-Academy-/',

    plugins: [react()],

    server: {
      port: 3000,
      host: '0.0.0.0',
    },

    // ملاحظة: لا تعتمد على env في GitHub Pages إلا إذا كنت تضعه وقت الـ build عبر Actions/Secrets
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY || ''),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY || ''),
    },

    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
  }
})
