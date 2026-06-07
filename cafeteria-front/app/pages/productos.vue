<template>
  <div>
    <h1>Gestión de productos</h1>

    <h2>Nuevo producto</h2>
    <form @submit.prevent="crear">
      <input v-model="form.nombre"    type="text"   placeholder="Nombre"  required /><br>
      <input v-model="form.precio"    type="number" placeholder="Precio"  required step="0.01" /><br>
      <input v-model="form.stock"     type="number" placeholder="Stock"   required /><br>
      <select v-model="form.categoria">
        <option value="bebida">Bebida</option>
        <option value="comida">Comida</option>
        <option value="postre">Postre</option>
        <option value="otro">Otro</option>
      </select><br><br>
      <button type="submit">Agregar producto</button>
    </form>
    <p v-if="error" style="color:red">{{ error }}</p>

    <h2>Lista de productos</h2>
    <div v-for="p in productos" :key="p.id">
      <strong>{{ p.nombre }}</strong> —
      ${{ p.precio }} —
      Stock: {{ p.stock }} —
      {{ p.categoria }}
      <button @click="desactivar(p.id)">Desactivar</button>
    </div>
  </div>
</template>

<script setup>
const { apiFetch } = useApi()
const productos = ref([])
const error     = ref('')
const form      = reactive({ nombre: '', precio: '', stock: '', categoria: 'bebida' })

onMounted(() => {
  if (!localStorage.getItem('token')) navigateTo('/login')
  cargar()
})

const cargar = async () => {
  productos.value = await apiFetch('/productos')
}

const crear = async () => {
  try {
    await apiFetch('/productos', {
      method: 'POST',
      body: JSON.stringify(form),
    })
    Object.assign(form, { nombre: '', precio: '', stock: '', categoria: 'bebida' })
    cargar()
  } catch (e) {
    error.value = e.message
  }
}

const desactivar = async (id) => {
  if (!confirm('¿Desactivar este producto?')) return
  await apiFetch(`/productos/${id}`, { method: 'DELETE' })
  cargar()
}
</script>