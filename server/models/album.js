'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class album extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.Song, {
        foreignKey:'albumId',
        as: 'songs'
      });
      this.belongsTo(models.Artist, {
        foreignKey: 'artistId'
      });
      // define association here
    }
  };
  album.init({
    name: DataTypes.STRING,
    coverImg: {
      type:DataTypes.STRING,
      field:'cover_img'
    },
    artistId: { 
      type: DataTypes.INTEGER,
      field: 'artist_id'
    },
    uploadedAt: {
      type:DataTypes.DATE,
      field: 'uploaded_at',
      defaultValue: sequelize.NOW
    },
    createdAt: {
      type:DataTypes.DATE,
      field: 'created_at',
      defaultValue: sequelize.NOW
    },
    updatedAt: {
      type:DataTypes.DATE,
      field: 'updated_at',
      defaultValue: sequelize.NOW
    },
    deletedAt: {
      type: DataTypes.DATE,
      field: 'deleted_at'
    }
  }, {
    sequelize,
    modelName: 'Album',
    paranoid: true
  });
  return album;
};