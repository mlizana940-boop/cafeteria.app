require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const app     = express();

app.use(cors());
app.use(express.json());

app.use('/api/productos', require('./routes/productos'));
app.use('/api/ventas',    require('./routes/ventas'));

app.get('/', (req, res) => {
  res.json({ mensaje: 'Vienvenido a Cafetería API' });
});

module.exports = app;