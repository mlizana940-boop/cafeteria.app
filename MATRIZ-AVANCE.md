# Matriz de Avance — cafeteria.app

Proyecto: **#8 — Ventas de cafetería**
Alumno: Daniel Lizana

---

## Requisitos Generales (GEN)

| ID | Título | Estado | Evidencia |
|----|--------|--------|-----------|
| GEN-01 | Estructura del repositorio y README ejecutable | ✅ Completo | `README.md` con instrucciones de instalación, variables y endpoints |
| GEN-02 | Variables de entorno y `.env.example` | ✅ Completo | `.env.example` y `cafeteria-front/.env.example` con todas las variables comentadas |
| GEN-03 | Conexión a BD y migraciones Sequelize iniciales | ✅ Completo | `src/config/database.js` + migraciones en `/migrations/` |
| GEN-04 | Registro de usuario (sign up) | ✅ Completo | `POST /api/auth/register` con email único, bcrypt y validación. UI en `/register` |
| GEN-05 | Login y emisión JWT | ✅ Completo | `POST /api/auth/login` retorna JWT. UI en `/login` con logout |
| GEN-06 | Middleware de autenticación en rutas protegidas | ✅ Completo | `middlewares/auth.js` aplicado en rutas de productos (escritura) y ventas |
| GEN-07 | Restablecer contraseña | ✅ Completo | `POST /api/auth/forgot-password` y `POST /api/auth/reset-password` con token con expiración. UI en `/forgot-password` y `/reset-password`. Nota: envío de token simulado (sin SMTP) |
| GEN-08 | Manejo centralizado de errores y respuestas JSON | ✅ Completo | Middleware de error en `app.js`, respuestas JSON uniformes con `error` y `message` |
| GEN-09 | CRUD REST y pantallas web de gestión del dominio | ✅ Completo | CRUD Productos y Ventas vía API + páginas `/productos`, `/ventas` en Nuxt 3 |
| GEN-10 | Validaciones de entrada y reglas HTTP | ✅ Completo | 400 en campos faltantes, 409 en stock insuficiente, 404 en recurso inexistente |
| GEN-11 | Colección Postman con auth y casos de error | ✅ Completo | Archivo exportado en `/postman/` |
| GEN-12 | Evolución de esquema (cambio AC/EC/AV/MT) | ✅ Completo | Migración `add-metodo-pago` agrega columna `metodo_pago` a la tabla `ventas` |
| GEN-13 | Despliegue: API+BD Railway y front público | ⏳ Pendiente | Deploy en Railway pendiente. URLs se actualizarán en README una vez publicado |

---

## Requisitos del Dominio (rq)

| ID | Título | Estado | Evidencia |
|----|--------|--------|-----------|
| rq-01 | Modelar entidad principal del dominio | ✅ Completo | Modelo `Producto` (`id`, `nombre`, `precio`, `stock`, `activo`) en `models/Producto.js` |
| rq-02 | Modelar entidad secundaria o relación | ✅ Completo | Modelos `Venta` y `LineaVenta` con relaciones `hasMany`/`belongsTo` en Sequelize |
| rq-03 | CRUD del recurso principal de gestión | ✅ Completo | `GET/POST/PUT/DELETE /api/productos` + página de gestión en frontend |
| rq-04 | CRUD del recurso secundario | ✅ Completo | `GET/POST/PATCH/DELETE /api/ventas` + página de ventas en frontend |
| rq-05 | Regla de negocio principal (stock) | ✅ Completo | `ventaService.js` valida stock antes de crear venta, responde 409 y hace rollback si es insuficiente. UI muestra el error |
| rq-06 | Regla de negocio complementaria (total coherente) | ✅ Completo | Total calculado en `ventaService.js` como suma de `precio × cantidad` por línea, nunca desde el cliente |
| rq-07 | Consultas con filtros y búsqueda | ✅ Completo | `GET /api/ventas?desde=YYYY-MM-DD&hasta=YYYY-MM-DD` con filtro por rango de fechas. UI con inputs de fecha |
| rq-08 | Panel o listado principal del dominio | ✅ Completo | Dashboard en `/dashboard` con catálogo de productos y registro rápido de venta. Refresh automático cada 30s |
| rq-09 | Flujo transaccional clave del dominio | ✅ Completo | Flujo POS en `/pos`: selección de ítems → carrito → método de pago → confirmación → descuento de stock |
| rq-10 | Funcionalidad avanzada del dominio | ✅ Completo | Dashboard muestra top 3 productos más vendidos y alerta de stock bajo. Endpoint `GET /api/dashboard` con cierre de caja del día |

---

## Resumen

| Categoría | Completados | Total |
|-----------|:-----------:|:-----:|
| Requisitos Generales | 12 | 13 |
| Requisitos del Dominio | 10 | 10 |
| **TOTAL** | **22** | **23** |

> ⏳ Único pendiente: **GEN-13** — Deploy en Railway (en proceso).
