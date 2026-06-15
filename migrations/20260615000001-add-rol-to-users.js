'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'rol', {
      type: Sequelize.STRING(20),
      allowNull: false,
      defaultValue: 'usuario',
    });
  },
  down: async (queryInterface) => {
    await queryInterface.removeColumn('Users', 'rol');
  },
};
