<template>
  <div>
    <h1>Crear cuenta</h1>
    <form @submit.prevent="register">
      <input v-model="nombre"   type="text"     placeholder="Nombre"     required /><br>
      <input v-model="email"    type="email"    placeholder="Email"      required /><br>
      <input v-model="password" type="password" placeholder="Contraseña" required /><br>
      <button type="submit">Registrarse</button>
    </form>
    <p v-if="error" style="color:red">{{ error }}</p>
    <p v-if="exito" style="color:green">{{ exito }}</p>
    <NuxtLink to="/login">¿Ya tienes cuenta? Inicia sesión</NuxtLink>
  </div>
</template>

<script setup>
import { useApi } from '~/composables/useApi'
definePageMeta({ layout: false })

const nombre   = ref('')
const email    = ref('')
const password = ref('')
const error    = ref('')
const exito    = ref('')
const { apiFetch } = useApi()

const register = async () => {
  try {
    await apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        nombre:   nombre.value,
        email:    email.value,
        password: password.value,
      }),
    })
    exito.value = 'Cuenta creada. Redirigiendo...'
    setTimeout(() => navigateTo('/login'), 1500)
  } catch (e) {
    error.value = e.message
  }
}
</script>