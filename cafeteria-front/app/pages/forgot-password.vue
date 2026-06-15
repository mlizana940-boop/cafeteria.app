<template>
  <div class="login-page">
    <div class="login-left">
      <div class="brand">
        <span class="brand-icon">☕</span>
        <h1>Cafetería</h1>
        <p>Recuperar acceso</p>
      </div>
    </div>
    <div class="login-right">
      <div class="login-card">
        <h2>Olvidé mi contraseña</h2>
        <p class="login-sub">Ingresa tu email y te enviaremos instrucciones</p>
        <form @submit.prevent="submit">
          <div class="form-group">
            <label>Correo electrónico</label>
            <input v-model="email" type="email" class="input" placeholder="tu@correo.com" required />
          </div>
          <div v-if="msg"   class="alert alert-success">{{ msg }}</div>
          <div v-if="error" class="alert alert-error">{{ error }}</div>
          <button type="submit" class="btn btn-primary w-full" :disabled="loading">
            {{ loading ? 'Enviando...' : 'Enviar instrucciones' }}
          </button>
        </form>
        <p class="register-link">
          <NuxtLink to="/login">← Volver al login</NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: false })
const { apiFetch } = useApi()
const email   = ref('')
const msg     = ref('')
const error   = ref('')
const loading = ref(false)

async function submit() {
  loading.value = true
  msg.value = ''
  error.value = ''
  try {
    const data = await apiFetch('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email: email.value }),
    })
    if (data.token) {
      navigateTo('/reset-password?token=' + data.token)
    } else {
      msg.value = 'Si el email existe, recibirás el enlace de recuperación.'
    }
  } catch (e) {
    error.value = 'Error al procesar la solicitud.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700&display=swap');
* { box-sizing: border-box; margin: 0; padding: 0; }
:root { --bg:#0f0e0c; --surface:#1a1814; --border:#2e2a22; --accent:#e8a838; --text:#f0ead8; --text2:#9a9080; --danger:#e85c3a; --font:'Sora',sans-serif; }
.login-page { display:flex; min-height:100vh; font-family:var(--font); background:var(--bg); color:var(--text); }
.login-left { flex:1; background:var(--surface); border-right:1px solid var(--border); display:flex; flex-direction:column; align-items:center; justify-content:center; }
.brand { text-align:center; }
.brand-icon { font-size:56px; display:block; margin-bottom:16px; }
.brand h1 { font-size:42px; font-weight:700; color:var(--accent); }
.brand p { font-size:15px; color:var(--text2); margin-top:8px; letter-spacing:2px; text-transform:uppercase; }
.login-right { width:460px; display:flex; align-items:center; justify-content:center; padding:40px; }
.login-card { width:100%; }
.login-card h2 { font-size:26px; font-weight:700; margin-bottom:6px; }
.login-sub { color:var(--text2); font-size:14px; margin-bottom:32px; }
.form-group { margin-bottom:16px; }
.form-group label { display:block; font-size:12px; font-weight:600; color:var(--text2); text-transform:uppercase; letter-spacing:0.5px; margin-bottom:6px; }
.input { width:100%; padding:12px 14px; background:#1a1814; border:1px solid #2e2a22; border-radius:8px; color:#f0ead8; font-family:var(--font); font-size:14px; outline:none; transition:border 0.15s; }
.input:focus { border-color:var(--accent); }
.alert { padding:10px 14px; border-radius:8px; font-size:13px; margin-bottom:12px; }
.alert-error   { background:rgba(232,92,58,0.1); color:#e85c3a; border:1px solid rgba(232,92,58,0.2); }
.alert-success { background:rgba(90,171,110,0.1); color:#5aab6e; border:1px solid rgba(90,171,110,0.2); }
.btn { padding:12px 20px; border-radius:8px; font-family:var(--font); font-size:15px; font-weight:600; cursor:pointer; border:none; transition:all 0.15s; }
.btn-primary { background:var(--accent); color:#0f0e0c; }
.btn-primary:hover { background:#f0b840; }
.btn-primary:disabled { opacity:0.4; cursor:not-allowed; }
.w-full { width:100%; }
.register-link { text-align:center; margin-top:20px; font-size:13px; color:var(--text2); }
.register-link a { color:var(--accent); text-decoration:none; font-weight:600; }
</style>