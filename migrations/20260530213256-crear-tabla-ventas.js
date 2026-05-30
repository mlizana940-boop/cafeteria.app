'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Ventas', {
      id:        { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      total:     { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      estado:    { type: Sequelize.ENUM('pendiente','completada','cancelada'), defaultValue: 'pendiente' },
      fecha:     { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('Ventas');
  },
};