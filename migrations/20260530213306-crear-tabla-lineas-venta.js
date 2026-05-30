'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('LineasVenta', {
      id:              { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      cantidad:        { type: Sequelize.INTEGER, allowNull: false },
      precio_unitario: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      subtotal:        { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      VentaId: {
        type: Sequelize.INTEGER,
        references: { model: 'Ventas', key: 'id' },
        onDelete: 'CASCADE',
      },
      ProductoId: {
        type: Sequelize.INTEGER,
        references: { model: 'Productos', key: 'id' },
        onDelete: 'RESTRICT',
      },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('LineasVenta');
  },
};