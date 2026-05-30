'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class LineaVenta extends Model {
    static associate(models) {
      LineaVenta.belongsTo(models.Venta,    { foreignKey: 'VentaId' });
      LineaVenta.belongsTo(models.Producto, { foreignKey: 'ProductoId' });
    }
  }

  LineaVenta.init({
    cantidad:        { type: DataTypes.INTEGER, allowNull: false },
    precio_unitario: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    subtotal:        { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    VentaId:         { type: DataTypes.INTEGER },
    ProductoId:      { type: DataTypes.INTEGER },
  }, {
    sequelize,
    modelName: 'LineaVenta',
    tableName: 'LineasVenta',
  });

  return LineaVenta;
};