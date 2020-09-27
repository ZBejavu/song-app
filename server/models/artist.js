'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class artist extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.Song, {
        foreignKey: 'artistId',
        as:'songs'
      });// define association here
      this.hasMany(models.Album, {
        foreignKey: 'artistId',
        as: 'albums'
      });// define association here
    }
  };
  artist.init({
    name: DataTypes.STRING,
    coverImg: {
      type: DataTypes.STRING,
      field: 'cover_img'
    },
    createdAt: {
      type: DataTypes.DATE,
      field:'created_at',
      defaultValue: sequelize.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      field:'updated_at',
      defaultValue: sequelize.NOW
    },
    uploadedAt: {
      type: DataTypes.DATE,
      field:'uploaded_at'
    },
    deletedAt: {
      type: DataTypes.DATE,
      field: 'deleted_at'
    }
  }, {
    sequelize,
    modelName: 'Artist',
    paranoid: true
  });
  return artist;
};