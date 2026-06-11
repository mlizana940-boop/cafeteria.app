'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Ventas', 'metodo_pago', {
      type: Sequelize.ENUM('efectivo', 'tarjeta', 'transferencia'),
      allowNull: false,
      defaultValue: 'efectivo',
    });
  },
  down: async (queryInterface) => {
    await queryInterface.removeColumn('Ventas', 'metodo_pago');
  }
};