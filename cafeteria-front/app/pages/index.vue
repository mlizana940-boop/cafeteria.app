<script setup>
onMounted(() => {
  if (localStorage.getItem('token')) {
    navigateTo('/productos')
  } else {
    navigateTo('/login')
  }
})
</script>

<template>
  <div>Cargando...</div>
</template>