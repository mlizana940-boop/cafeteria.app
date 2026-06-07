require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const auth    = require('./middlewares/authenticate');
const app     = express();

app.use(cors({ origin: 'http://localhost:3001' }));
app.use(express.json());

app.use('/api/auth',      require('./routes/auth'));
app.use('/api/productos', require('./routes/productos'));
app.use('/api/ventas',    auth, require('./routes/ventas'));

app.get('/', (req, res) => {
  res.json({ mensaje: 'Bienvenido a Cafetería API' });
});

module.exports = app;