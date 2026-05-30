# Cafetería App — API REST

Proyecto individual desarrollado. API REST para la gestión de una cafetería: productos y ventas.

## Stack tecnológico

- **Runtime:** Node.js v20
- **Framework:** Express 5
- **ORM:** Sequelize 6
- **Base de datos:** MySQL
- **Herramientas:** nodemon, dotenv, cors, sequelize-cli

## Estructura del proyecto
cafeteria.app/
├── src/
│   ├── config/         # Configuración de la base de datos
│   ├── controllers/    # Lógica de negocio (productoController, ventaController)
│   ├── models/         # Modelos Sequelize (Producto, Venta, LineaVenta)
│   └── routes/         # Rutas de la API (productos, ventas)
├── migrations/         # Migraciones de base de datos
├── index.js            # Punto de entrada del servidor
├── .env.example        # Variables de entorno requeridas
└── package.json

## Requisitos previos

- Node.js >= 18
- MySQL >= 8

## Instalación y configuración local

```bash
# 1. Clonar el repositorio
git clone <url-del-repo>
cd cafeteria.app

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de MySQL

# 4. Ejecutar migraciones
npx sequelize-cli db:migrate

# 5. Iniciar el servidor
npm run dev
```

El servidor quedará disponible en: `http://localhost:3000`

## Variables de entorno (.env)
DB_USER=tu_usuario
DB_PASS=tu_contraseña
DB_NAME=cafeteria_db
DB_HOST=localhost
DB_PORT=3306
PORT=3000

## Endpoints disponibles

### Productos

| Método | Ruta               | Descripción              |
|--------|--------------------|--------------------------|
| GET    | /api/productos     | Listar productos activos |
| GET    | /api/productos/:id | Obtener producto por ID  |
| POST   | /api/productos     | Crear nuevo producto     |
| PUT    | /api/productos/:id | Actualizar producto      |
| DELETE | /api/productos/:id | Desactivar producto      |

### Ventas

| Método | Ruta            | Descripción                |
|--------|-----------------|----------------------------|
| GET    | /api/ventas     | Listar todas las ventas    |
| GET    | /api/ventas/:id | Obtener venta con detalle  |
| POST   | /api/ventas     | Crear venta con líneas     |
| PATCH  | /api/ventas/:id | Actualizar estado de venta |

### Ejemplo — Crear producto

```json
POST /api/productos
{
  "nombre": "Café Americano",
  "precio": 2500,
  "categoria": "bebida",
  "activo": true
}
```

Categorías válidas: `bebida`, `comida`, `postre`, `otro`

### Ejemplo — Crear venta

```json
POST /api/ventas
{
  "lineas": [
    { "ProductoId": 1, "cantidad": 2 },
    { "ProductoId": 2, "cantidad": 1 }
  ]
}
```

El total se calcula automáticamente a partir del precio de cada producto.

## Estado del proyecto — Hito 1 (20%)

| ID     | Requisito                             | Estado      |
|--------|---------------------------------------|-------------|
| GEN-01 | Repositorio con estructura organizada |   Completo  |
| GEN-02 | `.env.example` documentado            |   Completo  |
| GEN-03 | Migraciones con Sequelize CLI         |   Completo  |
| rq-01  | CRUD de productos vía API             |   Completo  |
| rq-02  | Creación y consulta de ventas vía API |   Completo  |
