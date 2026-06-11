<template>
  <div class="app-shell">
    <nav class="sidebar">
      <div class="sidebar-logo">
        <span class="logo-icon">☕</span>
        <span class="logo-text">Cafetería</span>
      </div>
      <div class="sidebar-links">
        <NuxtLink to="/productos" class="nav-link">
          <span class="nav-icon">🧁</span>
          <span>Productos</span>
        </NuxtLink>
        <NuxtLink to="/ventas" class="nav-link">
          <span class="nav-icon">🛒</span>
          <span>Mostrador</span>
        </NuxtLink>
        <NuxtLink to="/" class="nav-link">
        <span class="nav-icon">📊</span>
        <span>Introducción</span>
        </NuxtLink>
      </div>
      <button class="logout-btn" @click="logout">
        <span>⎋</span> Cerrar sesión
      </button>
    </nav>
    <main class="main-content">
      <slot />
    </main>
  </div>
</template>

<script setup>
const logout = () => {
  localStorage.removeItem('token')
  navigateTo('/login')
}
definePageMeta({
  middleware: 'auth'
})
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700&family=JetBrains+Mono:wght@400;600&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg: #0f0e0c;
  --surface: #1a1814;
  --surface2: #242018;
  --border: #2e2a22;
  --accent: #e8a838;
  --accent2: #c47f1a;
  --text: #f0ead8;
  --text2: #9a9080;
  --text3: #5a5248;
  --danger: #e85c3a;
  --success: #5aab6e;
  --font: 'Sora', sans-serif;
  --mono: 'JetBrains Mono', monospace;
  --radius: 12px;
  --radius-sm: 8px;
}

body {
  font-family: var(--font);
  background: var(--bg);
  color: var(--text);
  min-height: 100vh;
}

.app-shell { display: flex; min-height: 100vh; }

.sidebar {
  width: 220px;
  background: var(--surface);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  padding: 24px 16px;
  position: fixed;
  top: 0; left: 0; bottom: 0;
}

.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 8px 28px;
  border-bottom: 1px solid var(--border);
  margin-bottom: 24px;
}

.logo-icon { font-size: 24px; }
.logo-text { font-size: 18px; font-weight: 700; color: var(--accent); letter-spacing: -0.5px; }

.sidebar-links { display: flex; flex-direction: column; gap: 4px; flex: 1; }

.nav-link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: var(--radius-sm);
  color: var(--text2);
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.15s;
}
.nav-link:hover { background: var(--surface2); color: var(--text); }
.nav-link.router-link-active { background: rgba(232,168,56,0.12); color: var(--accent); }
.nav-icon { font-size: 16px; }

.logout-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  background: none;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  color: var(--text3);
  font-family: var(--font);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.15s;
  width: 100%;
}
.logout-btn:hover { border-color: var(--danger); color: var(--danger); }

.main-content { margin-left: 220px; flex: 1; padding: 40px; min-height: 100vh; }

.btn {
  padding: 10px 20px;
  border-radius: var(--radius-sm);
  font-family: var(--font);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.15s;
}
.btn-primary { background: var(--accent); color: #0f0e0c; }
.btn-primary:hover { background: #f0b840; transform: translateY(-1px); }
.btn-primary:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }
.btn-danger { background: rgba(232,92,58,0.12); color: var(--danger); border: 1px solid rgba(232,92,58,0.3); }
.btn-danger:hover { background: rgba(232,92,58,0.2); }
.btn-ghost { background: var(--surface2); color: var(--text2); border: 1px solid var(--border); }
.btn-ghost:hover { color: var(--text); border-color: var(--text3); }

.input {
  width: 100%;
  padding: 10px 14px;
  background: var(--surface2);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  color: var(--text);
  font-family: var(--font);
  font-size: 14px;
  outline: none;
  transition: border 0.15s;
}
.input:focus { border-color: var(--accent); }
.input::placeholder { color: var(--text3); }
select.input option { background: var(--surface2); }

.alert { padding: 10px 14px; border-radius: var(--radius-sm); font-size: 13px; margin-top: 8px; }
.alert-error { background: rgba(232,92,58,0.1); color: var(--danger); border: 1px solid rgba(232,92,58,0.2); }
.alert-success { background: rgba(90,171,110,0.1); color: var(--success); border: 1px solid rgba(90,171,110,0.2); }

.page-title { font-size: 26px; font-weight: 700; color: var(--text); letter-spacing: -0.5px; margin-bottom: 4px; }
.page-subtitle { font-size: 14px; color: var(--text2); margin-bottom: 32px; }
</style>