<template>
  <div>
    <div class="page-header">
      <div>
        <h1 class="page-title">Productos</h1>
        <p class="page-subtitle">Gestiona el catálogo de la cafetería</p>
      </div>
      <button class="btn btn-primary" @click="mostrarForm = !mostrarForm">
        {{ mostrarForm ? '✕ Cancelar' : '+ Nuevo producto' }}
      </button>
    </div>
    <div v-if="mostrarForm" class="card form-card">
      <h3 class="card-title">Nuevo producto</h3>
      <div class="form-grid">
        <div class="form-group">
          <label>Nombre</label>
          <input v-model="form.nombre" class="input" type="text" placeholder="Ej: Café Americano" />
        </div>
        <div class="form-group">
          <label>Precio ($)</label>
          <input v-model="form.precio" class="input" type="number" placeholder="0" step="0.01" />
        </div>
        <div class="form-group">
          <label>Stock</label>
          <input v-model="form.stock" class="input" type="number" placeholder="0" />
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
      </div>
      <div v-if="error" class="alert alert-error">{{ error }}</div>
      <button class="btn btn-primary" @click="crear">Agregar producto</button>
    </div>
    <div class="filters">
      <button v-for="cat in categorias" :key="cat.value" class="filter-btn" :class="{ active: filtro === cat.value }" @click="filtro = cat.value">
        {{ cat.label }}
      </button>
    </div>
    <div class="productos-grid">
      <div v-for="p in productosFiltrados" :key="p.id" class="producto-card">
        <div class="producto-cat-badge">{{ catEmoji(p.categoria) }}</div>
        <div class="producto-info">
          <h4>{{ p.nombre }}</h4>
          <span class="producto-cat-label">{{ p.categoria }}</span>
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
        <button class="btn btn-danger btn-sm" @click="desactivar(p.id)">Desactivar</button>
      </div>
      <div v-if="productosFiltrados.length === 0" class="empty-state">
        <span>📭</span><p>No hay productos en esta categoría</p>
      </div>
    </div>
  </div>
</template>

<script setup>
const { apiFetch } = useApi()
const productos = ref([]); const error = ref(''); const mostrarForm = ref(false); const filtro = ref('todos')
const form = reactive({ nombre: '', precio: '', stock: '', categoria: 'bebida' })
const categorias = [{ value:'todos', label:'🍽 Todos' },{ value:'bebida', label:'☕ Bebidas' },{ value:'comida', label:'🥪 Comidas' },{ value:'postre', label:'🧁 Postres' },{ value:'otro', label:'📦 Otros' }]
const catEmoji = (cat) => ({ bebida:'☕', comida:'🥪', postre:'🧁', otro:'📦' }[cat] || '📦')
const productosFiltrados = computed(() => filtro.value === 'todos' ? productos.value : productos.value.filter(p => p.categoria === filtro.value))
onMounted(() => { if (!localStorage.getItem('token')) navigateTo('/login'); cargar() })
const cargar = async () => { productos.value = await apiFetch('/productos') }
const crear = async () => {
  error.value = ''
  try {
    await apiFetch('/productos', { method: 'POST', body: JSON.stringify(form) })
    Object.assign(form, { nombre:'', precio:'', stock:'', categoria:'bebida' })
    mostrarForm.value = false; cargar()
  } catch (e) { error.value = e.message }
}
const desactivar = async (id) => {
  if (!confirm('¿Desactivar este producto?')) return
  await apiFetch(`/productos/${id}`, { method: 'DELETE' }); cargar()
}
</script>

<style scoped>
.page-header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:28px; }
.card { background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); padding:24px; margin-bottom:24px; }
.card-title { font-size:15px; font-weight:600; color:var(--text2); text-transform:uppercase; letter-spacing:0.5px; margin-bottom:20px; }
.form-grid { display:grid; grid-template-columns:1fr 1fr; gap:14px; margin-bottom:16px; }
.form-group label { display:block; font-size:12px; font-weight:600; color:var(--text2); text-transform:uppercase; letter-spacing:0.5px; margin-bottom:6px; }
.filters { display:flex; gap:8px; margin-bottom:24px; flex-wrap:wrap; }
.filter-btn { padding:7px 14px; border-radius:20px; border:1px solid var(--border); background:none; color:var(--text2); font-family:var(--font); font-size:13px; cursor:pointer; transition:all 0.15s; }
.filter-btn:hover { border-color:var(--text3); color:var(--text); }
.filter-btn.active { background:rgba(232,168,56,0.12); border-color:rgba(232,168,56,0.4); color:var(--accent); }
.productos-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(240px,1fr)); gap:14px; }
.producto-card { background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); padding:18px; display:flex; flex-direction:column; gap:12px; transition:border-color 0.15s; }
.producto-card:hover { border-color:var(--text3); }
.producto-cat-badge { width:40px; height:40px; border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:20px; background:var(--surface2); }
.producto-info h4 { font-size:15px; font-weight:600; color:var(--text); }
.producto-cat-label { font-size:12px; color:var(--text3); text-transform:capitalize; }
.producto-datos { display:flex; gap:16px; }
.dato { display:flex; flex-direction:column; gap:2px; }
.dato-label { font-size:11px; color:var(--text3); text-transform:uppercase; letter-spacing:0.5px; }
.dato-valor { font-size:14px; font-weight:600; }
.precio { color:var(--accent); font-family:var(--mono); }
.sin-stock { color:var(--danger); }
.con-stock { color:var(--success); }
.btn-sm { padding:6px 12px; font-size:12px; }
.empty-state { grid-column:1/-1; text-align:center; padding:48px; color:var(--text3); }
.empty-state span { font-size:32px; display:block; margin-bottom:8px; }
</style>