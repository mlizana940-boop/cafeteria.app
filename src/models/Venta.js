'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Venta extends Model {
    static associate(models) {
      Venta.hasMany(models.LineaVenta, { foreignKey: 'VentaId' });
    }
  }

  Venta.init({
    total:       { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    estado:      { type: DataTypes.ENUM('pendiente','completada','cancelada'), defaultValue: 'completada' },
    metodo_pago: { type: DataTypes.ENUM('efectivo','tarjeta','transferencia'), allowNull: false, defaultValue: 'efectivo' },
    fecha:       { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  }, {
    sequelize,
    modelName: 'Venta',
    tableName: 'Ventas',
  });

  return Venta;
};