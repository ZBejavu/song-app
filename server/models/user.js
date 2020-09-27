'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  user.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    preferences: DataTypes.TEXT,
    isAdmin: {
      type: DataTypes.BOOLEAN,
      field: 'is_admin'
    },
    rememberToken: {
      type: DataTypes.STRING,
      field: 'remember_token'
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: sequelize.NOW,
      field: 'created_at'
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: 'updated_at',
      defaultValue: sequelize.NOW,
    },
    deletedAt: {
      type: DataTypes.DATE,
      field: 'deleted_at'
    }
  }, {
    sequelize,
    modelName: 'User',
    paranoid: true
  });
  return user;
};