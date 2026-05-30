'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Producto extends Model {
    static associate(models) {
      Producto.hasMany(models.LineaVenta, { foreignKey: 'ProductoId' });
    }
  }

  Producto.init({
    nombre:      { type: DataTypes.STRING(100), allowNull: false },
    descripcion: { type: DataTypes.TEXT },
    precio:      { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    stock:       { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    categoria:   { type: DataTypes.ENUM('bebida','comida','postre','otro'), allowNull: false },
    imagen_url:  { type: DataTypes.STRING },
    activo:      { type: DataTypes.BOOLEAN, defaultValue: true },
  }, {
    sequelize,
    modelName: 'Producto',
    tableName: 'Productos',
  });

  return Producto;
};