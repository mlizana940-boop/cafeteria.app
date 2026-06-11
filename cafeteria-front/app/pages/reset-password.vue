<template>
  <div class="login-page">
    <div class="login-left">
      <div class="brand">
        <span class="brand-icon">☕</span>
        <h1>Cafetería</h1>
        <p>Nueva contraseña</p>
      </div>
    </div>
    <div class="login-right">
      <div class="login-card">
        <h2>Nueva contraseña</h2>
        <p class="login-sub">Ingresa tu nueva contraseña</p>
        <form @submit.prevent="submit">
          <div class="form-group">
            <label>Nueva contraseña</label>
            <input v-model="newPassword" type="password" class="input"
                   placeholder="Mínimo 6 caracteres" minlength="6" required />
          </div>
          <div v-if="msg"   class="alert alert-success">{{ msg }}</div>
          <div v-if="error" class="alert alert-error">{{ error }}</div>
          <button type="submit" class="btn btn-primary w-full" :disabled="loading">
            {{ loading ? 'Guardando...' : 'Cambiar contraseña' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: false })
const { apiFetch } = useApi()
const route       = useRoute()
const newPassword = ref('')
const msg         = ref('')
const error       = ref('')
const loading     = ref(false)

async function submit() {
  loading.value = true
  msg.value = ''
  error.value = ''
  try {
    await apiFetch('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token: route.query.token, newPassword: newPassword.value }),
    })
    msg.value = 'Contraseña cambiada. Redirigiendo al login...'
    setTimeout(() => navigateTo('/login'), 2000)
  } catch (e) {
    error.value = e.message || 'Token inválido o expirado.'
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
</style>