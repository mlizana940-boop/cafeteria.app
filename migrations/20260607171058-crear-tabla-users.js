'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
      id:            { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      nombre:        { type: Sequelize.STRING(100), allowNull: false },
      email:         { type: Sequelize.STRING(150), allowNull: false, unique: true },
      password_hash: { type: Sequelize.STRING, allowNull: false },
      createdAt:     { type: Sequelize.DATE, allowNull: false },
      updatedAt:     { type: Sequelize.DATE, allowNull: false },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('Users');
  },
};