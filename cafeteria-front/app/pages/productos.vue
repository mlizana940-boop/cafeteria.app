<template>
  <div>
    <div class="page-header">
      <div>
        <h1 class="page-title">Productos</h1>
        <p class="page-subtitle">Gestiona el catálogo de la cafetería</p>
      </div>
      <button v-if="esAdmin" class="btn btn-primary" @click="abrirNuevo">
        {{ mostrarForm ? '✕ Cancelar' : '+ Nuevo producto' }}
      </button>
    </div>

    <!-- Formulario Crear / Editar -->
    <div v-if="mostrarForm" class="card form-card">
      <h3 class="card-title">{{ editando ? '✏️ Editar producto' : 'Nuevo producto' }}</h3>
      <div class="form-grid">
        <div class="form-group">
          <label>Nombre</label>
          <input v-model="form.nombre" class="input" type="text" placeholder="Ej: Café Americano" />
        </div>
        <div class="form-group">
          <label>Precio ($)</label>
            <input v-model="form.precio" class="input" type="number" placeholder="0" step="0.01" min="0" />
          </div>
          <div class="form-group">
            <label>Stock</label>
            <input v-model="form.stock" class="input" type="number" placeholder="0" min="0" />
        </div>
        <div class="form-group">
          <label>Categoría</label>
          <select v-model="form.categoria" class="input">
            <option value="bebida">☕ Bebida</option>
            <option value="comida">🥪 Comida</option>
            <option value="postre">🧁 Postre</option>
            <option value="otro">📦 Otro</option>
          </select>
        </div>
        <div class="form-group span-2">
          <label>Descripción (opcional)</label>
          <input v-model="form.descripcion" class="input" type="text" placeholder="Breve descripción del producto" />
        </div>
      </div>
      <div v-if="error" class="alert alert-error">{{ error }}</div>
      <div class="form-actions">
        <button class="btn btn-primary" @click="guardar">
          {{ editando ? '💾 Guardar cambios' : 'Agregar producto' }}
        </button>
        <button class="btn btn-ghost" @click="cerrarForm">Cancelar</button>
      </div>
    </div>

    <!-- Filtros -->
    <div class="filters">
      <button v-for="cat in categorias" :key="cat.value" class="filter-btn"
        :class="{ active: filtro === cat.value }" @click="filtro = cat.value">
        {{ cat.label }}
      </button>
    </div>

    <!-- Grid de productos -->
    <div class="productos-grid">
      <div v-for="p in productosFiltrados" :key="p.id" class="producto-card">
        <div class="producto-cat-badge">{{ catEmoji(p.categoria) }}</div>
        <div class="producto-info">
          <h4>{{ p.nombre }}</h4>
          <span class="producto-cat-label">{{ p.categoria }}</span>
          <span v-if="p.descripcion" class="producto-desc">{{ p.descripcion }}</span>
        </div>
        <div class="producto-datos">
          <div class="dato">
            <span class="dato-label">Precio</span>
            <span class="dato-valor precio">${{ Number(p.precio).toLocaleString() }}</span>
          </div>
          <div class="dato">
            <span class="dato-label">Stock</span>
            <span class="dato-valor" :class="p.stock === 0 ? 'sin-stock' : 'con-stock'">
              {{ p.stock === 0 ? 'Agotado' : p.stock + ' uds' }}
            </span>
          </div>
        </div>
        <div class="card-actions">
          <button v-if="esAdmin" class="btn btn-secondary btn-sm" @click="abrirEditar(p)">✏️ Editar</button>
          <button v-if="esAdmin" class="btn btn-danger btn-sm" @click="eliminar(p.id)">🗑 Eliminar</button>
        </div>
      </div>
      <div v-if="productosFiltrados.length === 0" class="empty-state">
        <span>📭</span><p>No hay productos en esta categoría</p>
      </div>
    </div>
  </div>
</template>

<script setup>
const { apiFetch } = useApi()
const esAdmin = computed(() => {
  if (!import.meta.client) return false
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    return user.rol === 'admin'
  } catch { return false }
})
const productos  = ref([])
const error      = ref('')
const mostrarForm = ref(false)
const editando   = ref(null)   // null = crear, objeto = editar

const form = reactive({ nombre: '', precio: '', stock: '', categoria: 'bebida', descripcion: '' })
const filtro = ref('todos')

const categorias = [
  { value: 'todos',   label: '🍽 Todos'   },
  { value: 'bebida',  label: '☕ Bebidas'  },
  { value: 'comida',  label: '🥪 Comidas' },
  { value: 'postre',  label: '🧁 Postres' },
  { value: 'otro',    label: '📦 Otros'   },
]

const catEmoji = (cat) => ({ bebida: '☕', comida: '🥪', postre: '🧁', otro: '📦' }[cat] || '📦')

const productosFiltrados = computed(() =>
  filtro.value === 'todos'
    ? productos.value
    : productos.value.filter(p => p.categoria === filtro.value)
)

onMounted(() => {
  if (!localStorage.getItem('token')) navigateTo('/login')
  cargar()
})

const cargar = async () => {
  productos.value = await apiFetch('/productos')
}

const limpiarForm = () => {
  Object.assign(form, { nombre: '', precio: '', stock: '', categoria: 'bebida', descripcion: '' })
  error.value = ''
}

const abrirNuevo = () => {
  if (mostrarForm.value && !editando.value) { cerrarForm(); return }
  editando.value = null
  limpiarForm()
  mostrarForm.value = true
}

const abrirEditar = (p) => {
  editando.value = p
  Object.assign(form, {
    nombre:      p.nombre,
    precio:      p.precio,
    stock:       p.stock,
    categoria:   p.categoria,
    descripcion: p.descripcion || '',
  })
  mostrarForm.value = true
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const cerrarForm = () => {
  mostrarForm.value = false
  editando.value = null
  limpiarForm()
}

const guardar = async () => {
  error.value = ''

  const stock = Number(form.stock)
  const precio = Number(form.precio)

  if (stock < 0) {
    error.value = 'El stock no puede ser negativo'
    return
  }
  if (precio < 0) {
    error.value = 'El precio no puede ser negativo'
    return
  }

  try {
    if (editando.value) {
      await apiFetch(`/productos/${editando.value.id}`, {
        method: 'PUT',
        body: JSON.stringify(form),
      })
    } else {
      await apiFetch('/productos', { method: 'POST', body: JSON.stringify(form) })
    }
    cerrarForm()
    cargar()
  } catch (e) {
    error.value = e.message
  }
}

const eliminar = async (id) => {
  if (!confirm('¿Eliminar este producto? Esta acción lo desactivará del catálogo.')) return
  try {
    await apiFetch(`/productos/${id}`, { method: 'DELETE' })
    cargar()
  } catch (e) {
    alert(e.message)
  }
}
</script>

<style scoped>
.page-header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:28px; }
.card { background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); padding:24px; margin-bottom:24px; }
.card-title { font-size:15px; font-weight:600; color:var(--text2); text-transform:uppercase; letter-spacing:0.5px; margin-bottom:20px; }
.form-grid { display:grid; grid-template-columns:1fr 1fr; gap:14px; margin-bottom:16px; }
.span-2 { grid-column: span 2; }
.form-group label { display:block; font-size:12px; font-weight:600; color:var(--text2); text-transform:uppercase; letter-spacing:0.5px; margin-bottom:6px; }
.form-actions { display:flex; gap:10px; margin-top:4px; }
.filters { display:flex; gap:8px; margin-bottom:24px; flex-wrap:wrap; }
.filter-btn { padding:7px 14px; border-radius:20px; border:1px solid var(--border); background:none; color:var(--text2); font-family:var(--font); font-size:13px; cursor:pointer; transition:all 0.15s; }
.filter-btn:hover { border-color:var(--text3); color:var(--text); }
.filter-btn.active { background:rgba(232,168,56,0.12); border-color:rgba(232,168,56,0.4); color:var(--accent); }
.productos-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(240px,1fr)); gap:14px; }
.producto-card { background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); padding:18px; display:flex; flex-direction:column; gap:12px; transition:border-color 0.15s; }
.producto-card:hover { border-color:var(--text3); }
.producto-cat-badge { width:40px; height:40px; border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:20px; background:var(--surface2); }
.producto-info h4 { font-size:15px; font-weight:600; color:var(--text); }
.producto-cat-label { font-size:12px; color:var(--text3); text-transform:capitalize; display:block; }
.producto-desc { font-size:12px; color:var(--text2); margin-top:2px; display:block; }
.producto-datos { display:flex; gap:16px; }
.dato { display:flex; flex-direction:column; gap:2px; }
.dato-label { font-size:11px; color:var(--text3); text-transform:uppercase; letter-spacing:0.5px; }
.dato-valor { font-size:14px; font-weight:600; }
.precio { color:var(--accent); font-family:var(--mono); }
.sin-stock { color:var(--danger); }
.con-stock { color:var(--success); }
.card-actions { display:flex; gap:8px; }
.btn-sm { padding:6px 12px; font-size:12px; }
.btn-secondary { background:var(--surface2); border:1px solid var(--border); color:var(--text); }
.btn-secondary:hover { border-color:var(--accent); color:var(--accent); }
.empty-state { grid-column:1/-1; text-align:center; padding:48px; color:var(--text3); }
.empty-state span { font-size:32px; display:block; margin-bottom:8px; }
</style>