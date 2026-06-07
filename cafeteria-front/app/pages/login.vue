<template>
  <div>
    <h1>Iniciar sesión</h1>
    <form @submit.prevent="login">
      <input v-model="email"    type="email"    placeholder="Email"      required /><br>
      <input v-model="password" type="password" placeholder="Contraseña" required /><br>
      <button type="submit">Entrar</button>
    </form>
    <p v-if="error" style="color:red">{{ error }}</p>
    <NuxtLink to="/register">¿No tienes cuenta? Regístrate</NuxtLink>
  </div>
</template>

<script setup>
definePageMeta({ layout: false })

const email    = ref('')
const password = ref('')
const error    = ref('')
const { apiFetch } = useApi()

const login = async () => {
  try {
    const data = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: email.value, password: password.value }),
    })
    localStorage.setItem('token', data.token)
    navigateTo('/productos')
  } catch (e) {
    error.value = e.message
  }
}
</script>