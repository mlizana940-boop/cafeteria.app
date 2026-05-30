'use strict';
const { sequelize, Sequelize } = require('../config/database');

const Producto   = require('./Producto')(sequelize, Sequelize.DataTypes);
const Venta      = require('./Venta')(sequelize, Sequelize.DataTypes);
const LineaVenta = require('./LineaVenta')(sequelize, Sequelize.DataTypes);

const models = { Producto, Venta, LineaVenta };

// Ejecutar asociaciones
Object.values(models).forEach(model => {
  if (model.associate) model.associate(models);
});

module.exports = { sequelize, Sequelize, ...models };