'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('PasswordResetTokens', {
      id:        { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      userId:    { type: Sequelize.INTEGER, allowNull: false,
                   references: { model: 'Users', key: 'id' }, onDelete: 'CASCADE' },
      token:     { type: Sequelize.STRING(64), allowNull: false, unique: true },
      expiresAt: { type: Sequelize.DATE, allowNull: false },
      createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('PasswordResetTokens');
  }
};