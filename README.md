# Cafetería App — API REST + Frontend

Proyecto individual. API REST + Frontend para la gestión de ventas de una cafetería.

## 🌐 URLs de Producción

- **API:** `https://TU-APP.railway.app`
- **Frontend:** `https://TU-FRONT.railway.app`

> ⚠️ Actualiza estas URLs una vez que hagas el deploy en Railway.

## Stack tecnológico

- **Runtime:** Node.js v20
- **Framework:** Express 5
- **ORM:** Sequelize 6
- **Base de datos:** PostgreSQL 16
- **Frontend:** Nuxt 3 + Vue 3
- **Herramientas:** nodemon, dotenv, cors, sequelize-cli, bcryptjs, jsonwebtoken

## Estructura del proyecto
cafeteria.app/ 
├── src/ │ 
├── config/ # Configuración de la base de datos (Sequelize)
│ ├── controllers/ # Controladores HTTP (reciben req, llaman al servicio) │ ├── services/ # Lógica de negocio (transacciones, validaciones) 
│ ├── models/ # Modelos Sequelize (Producto, Venta, LineaVenta, User) 
│ ├── routes/ # Definición de rutas de la API 
│ ├── middlewares/ # JWT authentication, manejo de errores 
│ └── app.js # Express app (middlewares globales, rutas) 
├── cafeteria-front/ # Frontend Nuxt 3 
├── migrations/ # Migraciones versionadas con Sequelize CLI 
├── postman/ # Colección Postman exportada 
├── index.js # Punto de entrada del servidor 
├── .env.example # Variables de entorno requeridas 
└── package.json

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

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de PostgreSQL

# 4. Ejecutar migraciones
npx sequelize-cli db:migrate

# 5. Iniciar el servidor
npm run dev

#El servidor quedará disponible en: http://localhost:3000

# Frontend (en otra terminal)
cd cafeteria-front
npm install
npm run dev

#El frontend quedará disponible en: http://localhost:3001

#Variables de entorno (.env)
DATABASE_URL=postgres://usuario:contraseña@localhost:5432/cafeteria_db
DB_USER=usuario
DB_PASS=contraseña
DB_NAME=cafeteria_db
DB_HOST=localhost
DB_PORT=5432
PORT=3000
JWT_SECRET=tu_secreto_seguro

#Endpoints disponibles
Auth
Método	Ruta	                      Descripción	                     Auth
POST	  /api/auth/register	        Registrar usuario	                No
POST	  /api/auth/login	            Login — retorna JWT	              No
POST	  /api/auth/forgot-password	  Solicitar reset de contraseña	    No
POST	  /api/auth/reset-password	  Resetear contraseña con token	    No

Productos
Método	Ruta	                     Descripción	                     Auth
GET	    /api/productos	            Listar productos activos	        No
GET	    /api/productos/:id	        Obtener producto por ID	          No
POST	  /api/productos	            Crear nuevo producto	            Sí
PUT	    /api/productos/:id	        Actualizar producto	              Sí
DELETE	/api/productos/:id	        Desactivar producto (soft-delete)	Sí

Ventas
Método	Ruta	                  Descripción	                         Auth
GET	    /api/ventas	            Listar ventas (filtros: desde/hasta)  Sí
GET	    /api/ventas/:id	        Obtener venta con líneas	            Sí
POST	  /api/ventas	            Crear venta (descuenta stock)	        Sí
PATCH	  /api/ventas/:id         Actualizar estado de venta	          Sí
DELETE	/api/ventas/:id	        Eliminar venta y restaurar stock	    Sí