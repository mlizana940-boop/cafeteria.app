<template>
  <div>
    <h1>Nueva venta — Mostrador</h1>

    <h2>Catálogo</h2>
    <div v-for="p in productos" :key="p.id">
      <strong>{{ p.nombre }}</strong> —
      ${{ p.precio }} —
      Stock: {{ p.stock }}
      <button @click="agregar(p)">+ Agregar</button>
    </div>

    <h2>Carrito</h2>
    <p v-if="!carrito.length">Sin productos aún.</p>
    <div v-for="(item, i) in carrito" :key="i">
      {{ item.nombre }} x{{ item.cantidad }} =
      ${{ (item.precio * item.cantidad).toFixed(2) }}
      <button @click="carrito.splice(i, 1)">Quitar</button>
    </div>

    <p><strong>Total: ${{ total }}</strong></p>
    <button @click="confirmar" :disabled="!carrito.length">Confirmar venta</button>

    <p v-if="error" style="color:red">{{ error }}</p>
    <p v-if="exito" style="color:green">{{ exito }}</p>
  </div>
</template>

<script setup>
const { apiFetch } = useApi()
const productos = ref([])
const carrito   = ref([])
const error     = ref('')
const exito     = ref('')

const total = computed(() =>
  carrito.value.reduce((s, i) => s + i.precio * i.cantidad, 0).toFixed(2)
)

onMounted(() => {
  if (!localStorage.getItem('token')) navigateTo('/login')
  cargar()
})

const cargar = async () => {
  productos.value = await apiFetch('/productos')
}

const agregar = (p) => {
  const existe = carrito.value.find(i => i.ProductoId === p.id)
  if (existe) {
    existe.cantidad++
  } else {
    carrito.value.push({
      ProductoId: p.id,
      nombre:     p.nombre,
      precio:     Number(p.precio),
      cantidad:   1,
    })
  }
}

const confirmar = async () => {
  error.value = ''
  exito.value = ''
  try {
    await apiFetch('/ventas', {
      method: 'POST',
      body: JSON.stringify({
        lineas: carrito.value.map(i => ({
          ProductoId: i.ProductoId,
          cantidad:   i.cantidad,
        })),
      }),
    })
    exito.value = 'Venta registrada correctamente'
    carrito.value = []
    cargar()
  } catch (e) {
    error.value = e.message
  }
}
</script>