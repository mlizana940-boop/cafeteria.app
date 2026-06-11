require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const app     = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:3001' }));
app.use(express.json());

app.use('/api/auth',      require('./routes/auth'));
app.use('/api/productos', require('./routes/productos'));
app.use('/api/ventas',    require('./routes/ventas'));
app.use('/api/dashboard', require('./routes/dashboard'));

app.get('/', (req, res) => {
  res.json({ mensaje: 'Bienvenido a Cafetería API' });
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: true, message: 'Ruta no encontrada', code: 'NOT_FOUND' });
});

// Manejo centralizado de errores (GEN-08)
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    error: true,
    message: err.message || 'Error interno del servidor',
    code:    err.code    || 'INTERNAL_ERROR',
  });
});

module.exports = app;