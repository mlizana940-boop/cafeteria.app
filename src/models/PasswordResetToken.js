'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PasswordResetToken extends Model {}

  PasswordResetToken.init({
    userId:    { type: DataTypes.INTEGER, allowNull: false },
    token:     { type: DataTypes.STRING(64), allowNull: false, unique: true },
    expiresAt: { type: DataTypes.DATE, allowNull: false },
  }, {
    sequelize,
    modelName: 'PasswordResetToken',
    tableName: 'PasswordResetTokens',
  });

  return PasswordResetToken;
};