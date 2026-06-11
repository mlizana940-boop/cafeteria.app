<template>
  <div class="login-page">
    <div class="login-left">
      <div class="brand">
        <span class="brand-icon">☕</span>
        <h1>Cafetería</h1>
        <p>Sistema de ventas</p>
      </div>
      <div class="decorative">
        <div class="deco-circle c1"></div>
        <div class="deco-circle c2"></div>
        <div class="deco-circle c3"></div>
      </div>
    </div>
    <div class="login-right">
      <div class="login-card">
        <h2>Iniciar sesión</h2>
        <p class="login-sub">Ingresa tus credenciales para continuar</p>
        <div class="form-group">
          <label>Correo electrónico</label>
          <input v-model="email" class="input" type="email" placeholder="tu@correo.com" />
        </div>
        <div class="form-group">
          <label>Contraseña</label>
          <div class="input-wrap">
            <input v-model="password" class="input" :type="showPass ? 'text' : 'password'" placeholder="••••••••" />
            <button class="eye-btn" @click="showPass = !showPass" type="button">{{ showPass ? '🙈' : '👁' }}</button>
          </div>
        </div>
        <div v-if="error" class="alert alert-error">{{ error }}</div>
        <button class="btn btn-primary w-full" @click="login" :disabled="loading">
          {{ loading ? 'Ingresando...' : 'Entrar →' }}
        </button>
                <p class="register-link">
          ¿No tienes cuenta? <NuxtLink to="/register">Regístrate aquí</NuxtLink>
        </p>
        <p class="register-link" style="margin-top:8px">
          <NuxtLink to="/forgot-password">¿Olvidaste tu contraseña?</NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: false })
const email = ref(''); const password = ref(''); const error = ref(''); const loading = ref(false); const showPass = ref(false)
const { apiFetch } = useApi()
const login = async () => {
  error.value = ''; loading.value = true
  try {
    const data = await apiFetch('/auth/login', { method: 'POST', body: JSON.stringify({ email: email.value, password: password.value }) })
    localStorage.setItem('token', data.token)
    navigateTo('/productos')
  } catch (e) { error.value = e.message }
  finally { loading.value = false }
}


<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700&display=swap');
* { box-sizing: border-box; margin: 0; padding: 0; }
:root { --bg:#0f0e0c; --surface:#1a1814; --border:#2e2a22; --accent:#e8a838; --text:#f0ead8; --text2:#9a9080; --text3:#5a5248; --danger:#e85c3a; --font:'Sora',sans-serif; }
.login-page { display:flex; min-height:100vh; font-family:var(--font); background:var(--bg); color:var(--text); }
.login-left { flex:1; background:var(--surface); border-right:1px solid var(--border); display:flex; flex-direction:column; align-items:center; justify-content:center; position:relative; overflow:hidden; }
.brand { text-align:center; z-index:1; }
.brand-icon { font-size:56px; display:block; margin-bottom:16px; }
.brand h1 { font-size:42px; font-weight:700; color:var(--accent); letter-spacing:-1px; }
.brand p { font-size:15px; color:var(--text2); margin-top:8px; letter-spacing:2px; text-transform:uppercase; }
.decorative { position:absolute; inset:0; pointer-events:none; }
.deco-circle { position:absolute; border-radius:50%; border:1px solid rgba(232,168,56,0.1); }
.c1 { width:300px; height:300px; top:-80px; left:-80px; }
.c2 { width:200px; height:200px; bottom:40px; right:-60px; border-color:rgba(232,168,56,0.07); }
.c3 { width:500px; height:500px; top:50%; left:50%; transform:translate(-50%,-50%); border-color:rgba(232,168,56,0.04); }
.login-right { width:460px; display:flex; align-items:center; justify-content:center; padding:40px; }
.login-card { width:100%; }
.login-card h2 { font-size:26px; font-weight:700; letter-spacing:-0.5px; margin-bottom:6px; }
.login-sub { color:var(--text2); font-size:14px; margin-bottom:32px; }
.form-group { margin-bottom:16px; }
.form-group label { display:block; font-size:12px; font-weight:600; color:var(--text2); text-transform:uppercase; letter-spacing:0.5px; margin-bottom:6px; }
.input { width:100%; padding:12px 14px; background:#1a1814; border:1px solid #2e2a22; border-radius:8px; color:#f0ead8; font-family:var(--font); font-size:14px; outline:none; transition:border 0.15s; }
.input:focus { border-color:var(--accent); }
.input::placeholder { color:#5a5248; }
.input-wrap { position:relative; }
.input-wrap .input { padding-right:44px; }
.eye-btn { position:absolute; right:12px; top:50%; transform:translateY(-50%); background:none; border:none; cursor:pointer; font-size:16px; padding:0; }
.alert { padding:10px 14px; border-radius:8px; font-size:13px; margin-bottom:12px; }
.alert-error { background:rgba(232,92,58,0.1); color:#e85c3a; border:1px solid rgba(232,92,58,0.2); }
.btn { padding:12px 20px; border-radius:8px; font-family:var(--font); font-size:15px; font-weight:600; cursor:pointer; border:none; transition:all 0.15s; }
.btn-primary { background:var(--accent); color:#0f0e0c; }
.btn-primary:hover { background:#f0b840; transform:translateY(-1px); }
.btn-primary:disabled { opacity:0.4; cursor:not-allowed; transform:none; }
.w-full { width:100%; }
.register-link { text-align:center; margin-top:20px; font-size:13px; color:var(--text2); }
.register-link a { color:var(--accent); text-decoration:none; font-weight:600; }
</style>