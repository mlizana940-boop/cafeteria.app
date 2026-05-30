'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Productos', {
      id:          { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      nombre:      { type: Sequelize.STRING(100), allowNull: false },
      descripcion: { type: Sequelize.TEXT, allowNull: true },
      precio:      { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      stock:       { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      categoria:   { type: Sequelize.ENUM('bebida','comida','postre','otro'), allowNull: false },
      imagen_url:  { type: Sequelize.STRING, allowNull: true },
      activo:      { type: Sequelize.BOOLEAN, defaultValue: true },
      createdAt:   { type: Sequelize.DATE, allowNull: false },
      updatedAt:   { type: Sequelize.DATE, allowNull: false },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('Productos');
  },
};