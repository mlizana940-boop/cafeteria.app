<template>
  <div>
    <nav>
      <NuxtLink to="/productos">Productos</NuxtLink> |
      <NuxtLink to="/ventas">Ventas</NuxtLink> |
      <button @click="logout">Cerrar sesión</button>
    </nav>
    <main>
      <slot />
    </main>
  </div>
</template>

<script setup>
const logout = () => {
  localStorage.removeItem('token')
  navigateTo('/login')
}
</script>