export default defineNuxtRouteMiddleware((to) => {
  const publicRoutes = ['/login', '/register', '/forgot-password', '/reset-password']
  if (publicRoutes.includes(to.path)) return

  if (import.meta.client) {
    const token = localStorage.getItem('token')
    if (!token) return navigateTo('/login')
  }
})