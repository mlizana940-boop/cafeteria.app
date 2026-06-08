<template>
  <div>
    <div v-if="cargando" class="loading-state">
      <span>☕ Cargando...</span>
    </div>

    <div v-else>
      <h1 class="page-title">Introducción</h1>
      <p class="page-subtitle">Resumen general de la cafetería</p>

      <!-- Tarjetas de métricas -->
      <div class="metrics-grid">
        <div class="metric-card">
          <span class="metric-icon">🧁</span>
          <div class="metric-value">{{ datos.totalProductos ?? 0 }}</div>
          <div class="metric-label">Productos</div>
        </div>
        <div class="metric-card metric-danger">
          <span class="metric-icon">⚠️</span>
          <div class="metric-value danger">{{ datos.stockBajo ?? 0 }}</div>
          <div class="metric-label">Stock bajo (&lt;10)</div>
        </div>
        <div class="metric-card">
          <span class="metric-icon">🛒</span>
          <div class="metric-value">{{ datos.totalVentas ?? 0 }}</div>
          <div class="metric-label">Ventas totales</div>
        </div>
        <div class="metric-card">
          <span class="metric-icon">📅</span>
          <div class="metric-value">{{ datos.ventasHoy ?? 0 }}</div>
          <div class="metric-label">Ventas hoy</div>
        </div>
        <div class="metric-card">
          <span class="metric-icon">💰</span>
          <div class="metric-value accent">${{ formatNum(datos.ingresosTotales) }}</div>
          <div class="metric-label">Ingresos totales</div>
        </div>
        <div class="metric-card">
          <span class="metric-icon">✨</span>
          <div class="metric-value accent">${{ formatNum(datos.ingresosHoy) }}</div>
          <div class="metric-label">Ingresos hoy</div>
        </div>
      </div>

      <!-- Últimas ventas -->
      <h2 class="section-title">Últimas 5 Ventas</h2>
      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="!datos.ultimasVentas?.length">
              <td colspan="4" class="empty">Sin ventas registradas</td>
            </tr>
            <tr v-for="venta in datos.ultimasVentas" :key="venta.id">
              <td class="mono">#{{ venta.id }}</td>
              <td class="accent">${{ formatNum(venta.total) }}</td>
              <td>
                <span class="badge" :class="venta.estado === 'completada' ? 'badge-success' : 'badge-default'">
                  {{ venta.estado ?? '—' }}
                </span>
              </td>
              <td class="text2">{{ formatDate(venta.createdAt) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Top productos -->
      <h2 class="section-title">🏆 Más Vendidos</h2>
      <div class="top-list">
        <div v-if="!datos.topProductos?.length" class="empty">Sin datos</div>
        <div
          v-for="(p, i) in datos.topProductos"
          :key="p.ProductoId"
          class="top-item"
        >
          <span class="top-rank">{{ i + 1 }}</span>
          <span class="top-name">{{ p.nombre }}</span>
          <span class="top-qty">{{ p.total }} uds.</span>
        </div>
      </div>

      <!-- Accesos rápidos -->
      <h2 class="section-title">⚡ Acceso Rápido</h2>
      <div class="quick-links">
        <NuxtLink to="/productos" class="quick-btn">🧁 Ver Productos</NuxtLink>
        <NuxtLink to="/ventas" class="quick-btn">🛒 Nueva Venta</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
const { apiFetch } = useApi()
const route = useRoute()
const datos = ref({})
const cargando = ref(true)

const cargarDatos = async () => {
  try {
    datos.value = await apiFetch('/dashboard')
  } catch (e) {
    console.error('Error al cargar dashboard', e)
  } finally {
    cargando.value = false
  }
}

// Carga inicial
onMounted(cargarDatos)

// Recarga cada vez que navegas de vuelta a esta página
watch(() => route.path, (path) => {
  if (path === '/') cargarDatos()
})

// Refresco automático cada 30 segundos
let intervalo
onMounted(() => { intervalo = setInterval(cargarDatos, 30000) })
onUnmounted(() => clearInterval(intervalo))

// Helpers
const formatNum = (n) => Number(n ?? 0).toLocaleString('es-CL')
const formatDate = (d) => {
  if (!d) return '—'
  const date = new Date(d)
  return `${String(date.getDate()).padStart(2,'0')}-${String(date.getMonth()+1).padStart(2,'0')}-${date.getFullYear()}`
}
</script>

<style scoped>
.loading-state {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60vh;
  color: var(--text2);
  font-size: 18px;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 16px;
  margin-bottom: 40px;
}

.metric-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 24px 20px;
  text-align: center;
  transition: border-color 0.15s;
}
.metric-card:hover { border-color: var(--text3); }
.metric-card.metric-danger { border-color: rgba(232,92,58,0.3); }

.metric-icon { font-size: 28px; display: block; margin-bottom: 10px; }
.metric-value { font-size: 32px; font-weight: 700; color: var(--text); line-height: 1; margin-bottom: 6px; }
.metric-value.accent { color: var(--accent); }
.metric-value.danger { color: var(--danger); }
.metric-label { font-size: 13px; color: var(--text2); }

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 16px;
}

.table-wrap {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
  margin-bottom: 40px;
}

.data-table { width: 100%; border-collapse: collapse; }
.data-table th {
  padding: 12px 16px;
  text-align: left;
  font-size: 12px;
  font-weight: 600;
  color: var(--text2);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid var(--border);
}
.data-table td {
  padding: 14px 16px;
  font-size: 14px;
  border-bottom: 1px solid var(--border);
  color: var(--text);
}
.data-table tr:last-child td { border-bottom: none; }
.data-table tr:hover td { background: var(--surface2); }

.mono { font-family: var(--mono); color: var(--text2); }
.accent { color: var(--accent); font-weight: 600; }
.text2 { color: var(--text2); }
.empty { color: var(--text3); font-size: 13px; text-align: center; padding: 20px !important; }

.badge {
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: capitalize;
}
.badge-success { background: rgba(90,171,110,0.15); color: var(--success); }
.badge-default { background: var(--surface2); color: var(--text2); }

.top-list { display: flex; flex-direction: column; gap: 8px; margin-bottom: 40px; }
.top-item {
  display: flex;
  align-items: center;
  gap: 16px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 14px 16px;
}
.top-rank { font-size: 18px; font-weight: 700; color: var(--accent); width: 24px; }
.top-name { flex: 1; font-size: 14px; font-weight: 500; }
.top-qty { font-size: 13px; color: var(--text2); font-family: var(--mono); }

.quick-links { display: flex; gap: 12px; flex-wrap: wrap; }
.quick-btn {
  padding: 12px 20px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  color: var(--text);
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.15s;
}
.quick-btn:hover { border-color: var(--accent); color: var(--accent); }
</style>