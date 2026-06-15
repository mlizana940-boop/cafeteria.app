export default defineNuxtConfig({
  ssr: false,  // ← FIX: app SPA, usa localStorage para auth
  devServer: {
    port: 3000  // ← frontend siempre en 3000
  },
  runtimeConfig: {
    public: {
      apiUrl: process.env.NUXT_PUBLIC_API_URL || 'http://localhost:3001/api'  // ← backend en 3001
    }
  }
})