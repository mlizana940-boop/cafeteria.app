<template>
  <div>
    <!-- Tabs -->
    <div class="tabs">
      <button class="tab" :class="{ active: tab === 'mostrador' }" @click="tab = 'mostrador'">
        🛒 Mostrador
      </button>
      <button v-if="esAdmin" class="tab" :class="{ active: tab === 'historial' }" @click="tab = 'historial'; cargarHistorial()">
        📋 Historial de ventas
      </button>
    </div>

    <!-- ────────────────── MOSTRADOR ────────────────── -->
    <div v-if="tab === 'mostrador'" class="ventas-layout">
      <div class="catalogo-panel">
        <div class="page-header">
          <div>
            <h1 class="page-title">Mostrador</h1>
            <p class="page-subtitle">Selecciona productos para la venta</p>
          </div>
        </div>
        <input v-model="busqueda" class="input search-input" placeholder="🔍  Buscar producto..." />
        <div class="categorias-tabs">
          <button v-for="cat in categorias" :key="cat.value" class="cat-tab"
            :class="{ active: filtro === cat.value }" @click="filtro = cat.value">
            {{ cat.label }}
          </button>
        </div>
        <div class="productos-catalogo">
          <button v-for="p in productosFiltrados" :key="p.id" class="producto-btn"
            :class="{ agotado: p.stock === 0 }" :disabled="p.stock === 0" @click="agregar(p)">
            <span class="prod-emoji">{{ catEmoji(p.categoria) }}</span>
            <span class="prod-nombre">{{ p.nombre }}</span>
            <span class="prod-precio">${{ Number(p.precio).toLocaleString() }}</span>
            <span class="prod-stock" :class="p.stock === 0 ? 'agot' : ''">
              {{ p.stock === 0 ? 'Agotado' : 'Stock: ' + p.stock }}
            </span>
          </button>
        </div>
      </div>

      <div class="carrito-panel">
        <div class="carrito-header">
          <h2>🛒 Carrito</h2>
          <span class="carrito-count">{{ carrito.length }} items</span>
        </div>
        <div class="carrito-items">
          <p v-if="!carrito.length" class="carrito-empty">Sin productos aún</p>
          <div v-for="(item, i) in carrito" :key="i" class="carrito-item">
            <div class="item-info">
              <span class="item-emoji">{{ catEmoji(item.categoria) }}</span>
              <span class="item-nombre">{{ item.nombre }}</span>
            </div>
            <div class="item-controles">
              <button class="qty-btn" @click="decrementar(i)">−</button>
              <span class="qty-num">{{ item.cantidad }}</span>
              <button class="qty-btn" @click="item.cantidad++">+</button>
            </div>
            <div class="item-subtotal">${{ (item.precio * item.cantidad).toLocaleString() }}</div>
            <button class="quitar-btn" @click="carrito.splice(i, 1)">✕</button>
          </div>
        </div>
        <div class="carrito-total">
          <div class="total-row destacado">
            <span>Total</span>
            <span class="total-monto">${{ total }}</span>
          </div>
        </div>
        <div v-if="errorVenta" class="alert alert-error">{{ errorVenta }}</div>
        <div v-if="exito" class="alert alert-success">{{ exito }}</div>
                <div class="form-group" style="margin-bottom:12px">
          <label style="display:block;font-size:12px;font-weight:600;color:var(--text2);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px">Método de pago</label>
          <select v-model="metodoPago" class="input" style="padding:10px 14px">
            <option value="efectivo">💵 Efectivo</option>
            <option value="tarjeta">💳 Tarjeta</option>
            <option value="transferencia">📱 Transferencia</option>
          </select>
        </div>
        <button class="btn btn-primary confirmar-btn" :disabled="!carrito.length || loading" @click="confirmar">
          {{ loading ? 'Procesando...' : '✓ Confirmar venta' }}
        </button>
        <button v-if="carrito.length" class="btn btn-ghost limpiar-btn" @click="carrito = []">
          Limpiar carrito
        </button>
      </div>
    </div>

    <!-- ────────────────── HISTORIAL ────────────────── -->
    <div v-if="tab === 'historial'">
      <div class="page-header" style="margin-top:20px">
        <div>
          <h1 class="page-title">Historial de ventas</h1>
          <p class="page-subtitle">Consulta, edita y elimina ventas registradas</p>
        </div>
        <button class="btn btn-ghost" @click="cargarHistorial">🔄 Actualizar</button>
      </div>

      <!-- Filtro por fechas -->
      <div style="display:flex;gap:12px;margin-bottom:16px;flex-wrap:wrap;align-items:flex-end">
        <div>
          <label style="display:block;font-size:11px;color:var(--text2);margin-bottom:4px">Desde</label>
          <input v-model="filtroFecha.desde" type="date" class="input" style="padding:8px 12px;font-size:13px" />
        </div>
        <div>
          <label style="display:block;font-size:11px;color:var(--text2);margin-bottom:4px">Hasta</label>
          <input v-model="filtroFecha.hasta" type="date" class="input" style="padding:8px 12px;font-size:13px" />
        </div>
        <button @click="cargarHistorial" class="btn btn-primary" style="padding:8px 16px;font-size:13px">Filtrar</button>
        <button @click="limpiarFiltro"   class="btn btn-ghost"   style="padding:8px 16px;font-size:13px">Limpiar</button>
      </div>

      <!-- Filtro por estado -->
      <div class="filters">
        <button v-for="e in estados" :key="e.value" class="filter-btn"
          :class="{ active: filtroEstado === e.value }" @click="filtroEstado = e.value">
          {{ e.label }}
        </button>
      </div>

      <div v-if="loadingHistorial" class="empty-state"><span>⏳</span><p>Cargando ventas...</p></div>

      <div v-else-if="ventasFiltradas.length === 0" class="empty-state">
        <span>📭</span><p>No hay ventas en este estado</p>
      </div>

      <div v-else class="historial-list">
        <div v-for="v in ventasFiltradas" :key="v.id" class="venta-card">
          <div class="venta-header">
            <div class="venta-id">#{{ v.id }}</div>
            <span class="badge" :class="badgeClass(v.estado)">{{ v.estado }}</span>
            <div class="venta-fecha">{{ formatDate(v.createdAt) }}</div>
            <div class="venta-total">${{ Number(v.total).toLocaleString() }}</div>
          </div>

          <!-- Líneas de la venta -->
          <div v-if="v.LineaVenta && v.LineaVenta.length" class="lineas">
            <div v-for="l in v.LineaVenta" :key="l.id" class="linea">
              <span class="linea-nombre">{{ l.Producto?.nombre || 'Producto eliminado' }}</span>
              <span class="linea-qty">x{{ l.cantidad }}</span>
              <span class="linea-subtotal">${{ Number(l.subtotal).toLocaleString() }}</span>
            </div>
          </div>

          <!-- Acciones -->
          <div class="venta-actions">
            <div v-if="esAdmin" class="estado-select-wrap">
              <label>Estado:</label>
              <select class="input input-sm" :value="v.estado" @change="cambiarEstado(v, $event.target.value)">
                <option value="pendiente">⏳ Pendiente</option>
                <option value="completada">✅ Completada</option>
                <option value="cancelada">❌ Cancelada</option>
              </select>
            </div>
            <button v-if="esAdmin" class="btn btn-danger btn-sm" @click="eliminarVenta(v.id)">🗑 Eliminar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { apiFetch } = useApi()
const route = useRoute()
const esAdmin = computed(() => {
  if (!import.meta.client) return false
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    return user.rol === 'admin'
  } catch { return false }
})

// ── Tab ──
const tab = ref('mostrador')

// ── Mostrador ──
const productos   = ref([])
const carrito     = ref([])
const errorVenta  = ref('')
const exito       = ref('')
const loading     = ref(false)
const metodoPago  = ref('efectivo')
const busqueda    = ref('')
const filtro      = ref('todos')

const categorias = [
  { value: 'todos',   label: 'Todos'       },
  { value: 'bebida',  label: '☕ Bebidas'  },
  { value: 'comida',  label: '🥪 Comidas'  },
  { value: 'postre',  label: '🧁 Postres'  },
]
const catEmoji = (cat) => ({ bebida: '☕', comida: '🥪', postre: '🧁', otro: '📦' }[cat] || '📦')

const productosFiltrados = computed(() => {
  let lista = productos.value
  if (filtro.value !== 'todos') lista = lista.filter(p => p.categoria === filtro.value)
  if (busqueda.value) lista = lista.filter(p => p.nombre.toLowerCase().includes(busqueda.value.toLowerCase()))
  return lista
})

const total = computed(() =>
  carrito.value.reduce((s, i) => s + i.precio * i.cantidad, 0).toLocaleString()
)

onMounted(() => {
  if (!localStorage.getItem('token')) navigateTo('/login')
  if (route.query.tab === 'historial' && esAdmin.value) {
    tab.value = 'historial'
    cargarHistorial()
  }
  cargar()
})

const cargar = async () => { productos.value = await apiFetch('/productos') }

const agregar = (p) => {
  const existe = carrito.value.find(i => i.ProductoId === p.id)
  if (existe) { existe.cantidad++ }
  else { carrito.value.push({ ProductoId: p.id, nombre: p.nombre, precio: Number(p.precio), cantidad: 1, categoria: p.categoria }) }
}
const decrementar = (i) => {
  if (carrito.value[i].cantidad > 1) { carrito.value[i].cantidad-- }
  else { carrito.value.splice(i, 1) }
}
const confirmar = async () => {
  errorVenta.value = ''; exito.value = ''; loading.value = true
  try {
      await apiFetch('/ventas', {
        method: 'POST',
        body: JSON.stringify({
          lineas: carrito.value.map(i => ({ ProductoId: i.ProductoId, cantidad: i.cantidad })),
          metodo_pago: metodoPago.value,
        }),
    })
    exito.value = '✓ Venta registrada correctamente'
    carrito.value = []
    cargar()
  } catch (e) {
    errorVenta.value = e.message
  } finally {
    loading.value = false
  }
}

// ── Historial ──
const ventas           = ref([])
const loadingHistorial = ref(false)
const filtroEstado     = ref('todos')
const filtroFecha      = ref({ desde: '', hasta: '' })

const estados = [
  { value: 'todos',      label: '📋 Todas'      },
  { value: 'pendiente',  label: '⏳ Pendientes'  },
  { value: 'completada', label: '✅ Completadas'  },
  { value: 'cancelada',  label: '❌ Canceladas'   },
]

const ventasFiltradas = computed(() =>
  filtroEstado.value === 'todos'
    ? ventas.value
    : ventas.value.filter(v => v.estado === filtroEstado.value)
)

const cargarHistorial = async () => {
  loadingHistorial.value = true
  try {
    const params = new URLSearchParams()
    if (filtroFecha.value.desde) params.set('desde', filtroFecha.value.desde)
    if (filtroFecha.value.hasta) params.set('hasta', filtroFecha.value.hasta)
    const query = params.toString() ? `?${params}` : ''
    ventas.value = await apiFetch(`/ventas${query}`)
  } finally {
    loadingHistorial.value = false
  }
}

const limpiarFiltro = () => {
  filtroFecha.value = { desde: '', hasta: '' }
  cargarHistorial()
}

const cambiarEstado = async (venta, nuevoEstado) => {
  try {
    const actualizada = await apiFetch(`/ventas/${venta.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ estado: nuevoEstado }),
    })
    venta.estado = actualizada.estado
  } catch (e) {
    alert(e.message)
  }
}

const eliminarVenta = async (id) => {
  if (!confirm('¿Eliminar esta venta? El stock de los productos será restaurado.')) return
  try {
    await apiFetch(`/ventas/${id}`, { method: 'DELETE' })
    ventas.value = ventas.value.filter(v => v.id !== id)
  } catch (e) {
    alert(e.message)
  }
}

const badgeClass = (estado) => ({
  pendiente:  'badge-warning',
  completada: 'badge-success',
  cancelada:  'badge-danger',
}[estado] || 'badge-default')

const formatDate = (d) => {
  if (!d) return '—'
  const date = new Date(d)
  return `${String(date.getDate()).padStart(2,'0')}-${String(date.getMonth()+1).padStart(2,'0')}-${date.getFullYear()} ${String(date.getHours()).padStart(2,'0')}:${String(date.getMinutes()).padStart(2,'0')}`
}
</script>

<style scoped>
/* ── Tabs ── */
.tabs { display:flex; gap:4px; margin-bottom:0; border-bottom:1px solid var(--border); }
.tab { padding:10px 20px; background:none; border:none; border-bottom:2px solid transparent; color:var(--text2); font-family:var(--font); font-size:14px; font-weight:500; cursor:pointer; transition:all 0.15s; margin-bottom:-1px; }
.tab:hover { color:var(--text); }
.tab.active { color:var(--accent); border-bottom-color:var(--accent); }

/* ── Mostrador ── */
.ventas-layout { display:grid; grid-template-columns:1fr 360px; gap:24px; margin-top:24px; }
.catalogo-panel { overflow-y:auto; }
.page-header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:20px; }
.search-input { margin-bottom:16px; }
.categorias-tabs { display:flex; gap:8px; margin-bottom:20px; flex-wrap:wrap; }
.cat-tab { padding:6px 14px; border-radius:20px; border:1px solid var(--border); background:none; color:var(--text2); font-family:var(--font); font-size:13px; cursor:pointer; transition:all 0.15s; }
.cat-tab:hover { color:var(--text); border-color:var(--text3); }
.cat-tab.active { background:rgba(232,168,56,0.12); border-color:rgba(232,168,56,0.4); color:var(--accent); }
.productos-catalogo { display:grid; grid-template-columns:repeat(auto-fill,minmax(160px,1fr)); gap:12px; }
.producto-btn { background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); padding:16px; cursor:pointer; text-align:left; display:flex; flex-direction:column; gap:6px; transition:all 0.15s; font-family:var(--font); }
.producto-btn:hover:not(:disabled) { border-color:var(--accent); transform:translateY(-2px); }
.producto-btn.agotado { opacity:0.4; cursor:not-allowed; }
.prod-emoji { font-size:24px; }
.prod-nombre { font-size:13px; font-weight:600; color:var(--text); line-height:1.3; }
.prod-precio { font-size:15px; font-weight:700; color:var(--accent); font-family:var(--mono); }
.prod-stock { font-size:11px; color:var(--text3); }
.prod-stock.agot { color:var(--danger); }
.carrito-panel { background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); padding:20px; display:flex; flex-direction:column; gap:16px; position:sticky; top:0; }
.carrito-header { display:flex; justify-content:space-between; align-items:center; }
.carrito-header h2 { font-size:16px; font-weight:700; }
.carrito-count { background:var(--surface2); border:1px solid var(--border); border-radius:20px; padding:2px 10px; font-size:12px; color:var(--text2); }
.carrito-items { display:flex; flex-direction:column; gap:10px; min-height:80px; }
.carrito-empty { color:var(--text3); font-size:13px; text-align:center; padding:20px 0; }
.carrito-item { display:flex; align-items:center; gap:8px; padding:8px 0; border-bottom:1px solid var(--border); }
.item-info { flex:1; display:flex; align-items:center; gap:8px; min-width:0; }
.item-emoji { font-size:16px; flex-shrink:0; }
.item-nombre { font-size:13px; font-weight:500; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.item-controles { display:flex; align-items:center; gap:6px; }
.qty-btn { width:24px; height:24px; border-radius:6px; border:1px solid var(--border); background:var(--surface2); color:var(--text); font-size:14px; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all 0.1s; }
.qty-btn:hover { border-color:var(--accent); color:var(--accent); }
.qty-num { font-size:13px; font-weight:600; min-width:16px; text-align:center; }
.item-subtotal { font-size:13px; font-weight:600; color:var(--accent); font-family:var(--mono); min-width:60px; text-align:right; }
.quitar-btn { background:none; border:none; color:var(--text3); cursor:pointer; font-size:12px; padding:4px; transition:color 0.15s; }
.quitar-btn:hover { color:var(--danger); }
.carrito-total { border-top:1px solid var(--border); padding-top:12px; }
.total-row { display:flex; justify-content:space-between; font-size:13px; color:var(--text2); }
.total-row.destacado { font-size:16px; font-weight:700; color:var(--text); }
.total-monto { color:var(--accent); font-family:var(--mono); }
.confirmar-btn { width:100%; padding:12px; font-size:15px; }
.limpiar-btn { width:100%; font-size:13px; }

/* ── Historial ── */
.filters { display:flex; gap:8px; margin-bottom:20px; flex-wrap:wrap; }
.filter-btn { padding:7px 14px; border-radius:20px; border:1px solid var(--border); background:none; color:var(--text2); font-family:var(--font); font-size:13px; cursor:pointer; transition:all 0.15s; }
.filter-btn:hover { border-color:var(--text3); color:var(--text); }
.filter-btn.active { background:rgba(232,168,56,0.12); border-color:rgba(232,168,56,0.4); color:var(--accent); }
.historial-list { display:flex; flex-direction:column; gap:12px; }
.venta-card { background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); padding:18px; }
.venta-header { display:flex; align-items:center; gap:14px; margin-bottom:12px; }
.venta-id { font-family:var(--mono); font-size:15px; font-weight:700; color:var(--text2); }
.venta-fecha { font-size:12px; color:var(--text3); flex:1; }
.venta-total { font-size:16px; font-weight:700; color:var(--accent); font-family:var(--mono); }
.badge { padding:3px 10px; border-radius:20px; font-size:12px; font-weight:600; text-transform:capitalize; }
.badge-success { background:rgba(90,171,110,0.15); color:var(--success); }
.badge-warning { background:rgba(232,168,56,0.15); color:var(--accent); }
.badge-danger  { background:rgba(232,92,58,0.15); color:var(--danger); }
.badge-default { background:var(--surface2); color:var(--text2); }
.lineas { display:flex; flex-direction:column; gap:6px; margin-bottom:14px; padding:12px; background:var(--surface2); border-radius:var(--radius-sm); }
.linea { display:flex; gap:10px; align-items:center; font-size:13px; }
.linea-nombre { flex:1; color:var(--text); }
.linea-qty { color:var(--text2); font-family:var(--mono); }
.linea-subtotal { color:var(--accent); font-family:var(--mono); font-weight:600; }
.venta-actions { display:flex; align-items:center; gap:12px; flex-wrap:wrap; }
.estado-select-wrap { display:flex; align-items:center; gap:8px; font-size:13px; color:var(--text2); flex:1; }
.input-sm { padding:5px 10px; font-size:13px; }
.btn-sm { padding:6px 12px; font-size:12px; }
.empty-state { text-align:center; padding:48px; color:var(--text3); }
.empty-state span { font-size:32px; display:block; margin-bottom:8px; }
</style>