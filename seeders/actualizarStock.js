'use strict';

require('dotenv').config();
const { Sequelize, DataTypes, Op } = require('sequelize');
const config = require('../src/config/config.js');

const sequelize = new Sequelize(
  config.development.database,
  config.development.username,
  config.development.password,
  {
    host:    config.development.host,
    port:    config.development.port,
    dialect: config.development.dialect,
    logging: false,
  }
);

const Producto = sequelize.define('Producto', {
  nombre: { type: DataTypes.STRING },
  stock:  { type: DataTypes.INTEGER }
}, {
  tableName: 'Productos',
  timestamps: false
});

async function actualizarStock() {
  await sequelize.authenticate();
  console.log('📦 Conexión OK...');

  // Trae todos los productos con stock 0 o null
  const productos = await Producto.findAll({
    where: { stock: { [Op.or]: [null, 0] } }
  });

  if (productos.length === 0) {
    console.log('✅ Todos los productos ya tienen stock asignado');
  } else {
    for (const p of productos) {
      await p.update({ stock: 20 });
      console.log(`🔄 ${p.nombre} → stock: 20`);
    }
    console.log(`✅ ${productos.length} producto(s) actualizado(s)`);
  }

  await sequelize.close();
}

actualizarStock().catch(console.error);