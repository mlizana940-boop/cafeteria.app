'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {}

  User.init({
    nombre:        { type: DataTypes.STRING(100), allowNull: false },
    email:         { type: DataTypes.STRING(150), allowNull: false, unique: true },
    password_hash: { type: DataTypes.STRING, allowNull: false },
    rol:           { type: DataTypes.STRING(20), allowNull: false, defaultValue: 'cajero' },
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users',
  });

  return User;
};