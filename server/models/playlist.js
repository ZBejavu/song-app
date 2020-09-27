'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class playlist extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.songs_in_playlist, {
        foreignKey: 'playlistId'
      })
    }
  };
  playlist.init({
    name: DataTypes.STRING,
    coverImg: {
      type: DataTypes.STRING,
      field: 'cover_img'
    },
    uploadedAt: {
      type: DataTypes.DATE,
      field: 'uploaded_at',
      defaultValue: sequelize.NOW
    },
    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at',
      defaultValue: sequelize.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: 'updated_at',
      defaultValue: sequelize.NOW
    },
    deletedAt: {
      type: DataTypes.DATE,
      field: 'deleted_at'
    }
  }, {
    sequelize,
    modelName: 'Playlist',
    paranoid: true
  });
  return playlist;
};