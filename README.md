# Cafetería App — API REST + Frontend

Proyecto individual. API REST + Frontend para la gestión de ventas de una cafetería.

## 🌐 URLs de Producción

- **API:** `https://cafeteria-api.railway.app`
- **Frontend:** `https://cafeteria-front.railway.app`

> ⚠️ Deploy pendiente. Actualizar URLs una vez publicado en Railway.

## Stack tecnológico

- **Runtime:** Node.js v20
- **Framework:** Express 5
- **ORM:** Sequelize 6
- **Base de datos:** PostgreSQL 16
- **Frontend:** Nuxt 3 + Vue 3
- **Autenticación:** bcryptjs + jsonwebtoken
- **Herramientas:** nodemon, dotenv, cors, sequelize-cli

## Estructura del proyecto

```
cafeteria.app/
├── src/
│   ├── config/         # Configuración de la base de datos (Sequelize)
│   ├── controllers/    # Controladores HTTP (reciben req, llaman al servicio)
│   ├── services/       # Lógica de negocio (transacciones, validaciones)
│   ├── models/         # Modelos Sequelize (Producto, Venta, LineaVenta, User)
│   ├── routes/         # Definición de rutas de la API
│   ├── middlewares/    # JWT authentication, manejo de errores
│   └── app.js          # Express app (middlewares globales, rutas)
├── cafeteria-front/    # Frontend Nuxt 3
├── migrations/         # Migraciones versionadas con Sequelize CLI
├── postman/            # Colección Postman exportada
├── index.js            # Punto de entrada del servidor
├── .env.example        # Variables de entorno requeridas
└── package.json
```

## Requisitos previos

- Node.js >= 18
- PostgreSQL >= 14

## Instalación y configuración local

```bash
# 1. Clonar el repositorio
git clone https://github.com/mlizana940-boop/cafeteria.app.git
cd cafeteria.app

# 2. Instalar dependencias del backend
npm install

# 3. Configurar variables de entorno del backend
cp .env.example .env
# Editar .env con tus credenciales de PostgreSQL

# 4. Ejecutar migraciones
npx sequelize-cli db:migrate

# 5. Iniciar el servidor backend
npm run dev
# El servidor quedará disponible en: http://localhost:3001

# 6. Frontend (en otra terminal)
cd cafeteria-front
npm install
cp .env.example .env
# Editar .env con la URL del backend
npm run dev
# El frontend quedará disponible en: http://localhost:3000
```

## Variables de entorno

### Backend (`.env`)

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `DATABASE_URL` | URL completa de conexión a PostgreSQL | `postgres://user:pass@localhost:5432/cafeteria_db` |
| `DB_HOST` | Host de la base de datos | `localhost` |
| `DB_PORT` | Puerto de PostgreSQL | `5432` |
| `DB_USER` | Usuario de PostgreSQL | `postgres` |
| `DB_PASSWORD` | Contraseña de PostgreSQL | `mi_contraseña` |
| `DB_NAME` | Nombre de la base de datos | `cafeteria_db` |
| `JWT_SECRET` | Secreto para firmar tokens JWT | `cadena_aleatoria_segura` |
| `PORT` | Puerto del servidor Express | `3001` |
| `NODE_ENV` | Entorno de ejecución | `development` |
| `CORS_ORIGIN` | Origen permitido por CORS | `http://localhost:3000` |

### Frontend (`cafeteria-front/.env`)

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `NUXT_PUBLIC_API_URL` | URL base de la API backend | `http://localhost:3001` |

## Endpoints disponibles

### Auth

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| POST | `/api/auth/register` | Registrar usuario | No |
| POST | `/api/auth/login` | Login — retorna JWT | No |
| POST | `/api/auth/forgot-password` | Solicitar reset de contraseña | No |
| POST | `/api/auth/reset-password` | Resetear contraseña con token | No |

> ℹ️ El reset de contraseña devuelve el token directamente en la respuesta JSON (simulación de email — sin servidor SMTP configurado).

### Productos

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| GET | `/api/productos` | Listar productos activos | No |
| GET | `/api/productos/:id` | Obtener producto por ID | No |
| POST | `/api/productos` | Crear nuevo producto | Sí |
| PUT | `/api/productos/:id` | Actualizar producto | Sí |
| DELETE | `/api/productos/:id` | Desactivar producto (soft-delete) | Sí |

### Ventas

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| GET | `/api/ventas` | Listar ventas (filtros: `desde` / `hasta`) | Sí |
| GET | `/api/ventas/:id` | Obtener venta con líneas | Sí |
| POST | `/api/ventas` | Crear venta (descuenta stock) | Sí |
| PATCH | `/api/ventas/:id` | Actualizar estado de venta | Sí |
| DELETE | `/api/ventas/:id` | Eliminar venta y restaurar stock | Sí |

### Dashboard

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| GET | `/api/dashboard` | Estadísticas: top ventas, stock bajo, cierre de caja | Sí |

## Notas de diseño

- **Soft-delete en productos:** Al eliminar un producto se desactiva (`activo: false`) en vez de borrarlo físicamente, preservando la integridad de las ventas históricas.
- **Stock validado en servidor:** Si el stock es 0 o insuficiente al crear una venta, el servidor responde con `409 Conflict` y hace rollback de toda la transacción.
- **Total calculado en servidor:** El total de cada venta es calculado por el servicio (`ventaService`) sumando `precio × cantidad` de cada línea, nunca desde el cliente.
- **JWT en rutas protegidas:** El middleware `authenticateToken` bloquea con `401 Unauthorized` cualquier ruta de escritura sin token válido.
