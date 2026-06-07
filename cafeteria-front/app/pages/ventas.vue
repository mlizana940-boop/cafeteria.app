<template>
  <div class="ventas-layout">
    <div class="catalogo-panel">
      <div class="page-header">
        <div>
          <h1 class="page-title">Mostrador</h1>
          <p class="page-subtitle">Selecciona productos para la venta</p>
        </div>
      </div>
      <input v-model="busqueda" class="input search-input" placeholder="🔍  Buscar producto..." />
      <div class="categorias-tabs">
        <button v-for="cat in categorias" :key="cat.value" class="cat-tab" :class="{ active: filtro === cat.value }" @click="filtro = cat.value">{{ cat.label }}</button>
      </div>
      <div class="productos-catalogo">
        <button v-for="p in productosFiltrados" :key="p.id" class="producto-btn" :class="{ agotado: p.stock === 0 }" :disabled="p.stock === 0" @click="agregar(p)">
          <span class="prod-emoji">{{ catEmoji(p.categoria) }}</span>
          <span class="prod-nombre">{{ p.nombre }}</span>
          <span class="prod-precio">${{ Number(p.precio).toLocaleString() }}</span>
          <span class="prod-stock" :class="p.stock === 0 ? 'agot' : ''">{{ p.stock === 0 ? 'Agotado' : 'Stock: ' + p.stock }}</span>
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
      <div v-if="error" class="alert alert-error">{{ error }}</div>
      <div v-if="exito" class="alert alert-success">{{ exito }}</div>
      <button class="btn btn-primary confirmar-btn" :disabled="!carrito.length || loading" @click="confirmar">
        {{ loading ? 'Procesando...' : '✓ Confirmar venta' }}
      </button>
      <button v-if="carrito.length" class="btn btn-ghost limpiar-btn" @click="carrito = []">Limpiar carrito</button>
    </div>
  </div>
</template>

<script setup>
const { apiFetch } = useApi()
const productos = ref([]); const carrito = ref([]); const error = ref(''); const exito = ref(''); const loading = ref(false); const busqueda = ref(''); const filtro = ref('todos')
const categorias = [{ value:'todos', label:'Todos' },{ value:'bebida', label:'☕ Bebidas' },{ value:'comida', label:'🥪 Comidas' },{ value:'postre', label:'🧁 Postres' }]
const catEmoji = (cat) => ({ bebida:'☕', comida:'🥪', postre:'🧁', otro:'📦' }[cat] || '📦')
const productosFiltrados = computed(() => {
  let lista = productos.value
  if (filtro.value !== 'todos') lista = lista.filter(p => p.categoria === filtro.value)
  if (busqueda.value) lista = lista.filter(p => p.nombre.toLowerCase().includes(busqueda.value.toLowerCase()))
  return lista
})
const total = computed(() => carrito.value.reduce((s, i) => s + i.precio * i.cantidad, 0).toLocaleString())
onMounted(() => { if (!localStorage.getItem('token')) navigateTo('/login'); cargar() })
const cargar = async () => { productos.value = await apiFetch('/productos') }
const agregar = (p) => {
  const existe = carrito.value.find(i => i.ProductoId === p.id)
  if (existe) { existe.cantidad++ } else { carrito.value.push({ ProductoId: p.id, nombre: p.nombre, precio: Number(p.precio), cantidad: 1, categoria: p.categoria }) }
}
const decrementar = (i) => { if (carrito.value[i].cantidad > 1) { carrito.value[i].cantidad-- } else { carrito.value.splice(i, 1) } }
const confirmar = async () => {
  error.value = ''; exito.value = ''; loading.value = true
  try {
    await apiFetch('/ventas', { method: 'POST', body: JSON.stringify({ lineas: carrito.value.map(i => ({ ProductoId: i.ProductoId, cantidad: i.cantidad })) }) })
    exito.value = '✓ Venta registrada correctamente'; carrito.value = []; cargar()
  } catch (e) { error.value = e.message }
  finally { loading.value = false }
}
</script>

<style scoped>
.ventas-layout { display:grid; grid-template-columns:1fr 360px; gap:24px; }
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
</style>