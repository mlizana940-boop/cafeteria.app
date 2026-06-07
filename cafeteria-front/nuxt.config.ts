export default defineNuxtConfig({
  devServer: {
    port: 3001
  },
  runtimeConfig: {
    public: {
      apiUrl: 'http://localhost:3000/api'
    }
  }
})
