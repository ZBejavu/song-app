'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class song extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Artist, {
        foreignKey: 'artistId'
      });
      this.belongsTo(models.Album, {
        foreignKey: 'albumId'
      });
      this.hasMany(models.songs_in_playlist, {
        foreignKey: 'songId',
        as: 'Playlist'
      })
    }
  };
  song.init({
    name: DataTypes.STRING,
    youtubeLink: {
      type: DataTypes.STRING,
      field: 'youtube_link'
    },
    length: DataTypes.TIME,
    lyrics: DataTypes.TEXT,
    albumId:{
      type: DataTypes.INTEGER,
      field: 'album_id'
    },
    artistId:{
      type: DataTypes.INTEGER,
      field: 'artist_id'
    },
    uploadedAt:{
      type: DataTypes.DATE,
      field: 'uploaded_at',
      defaultValue: sequelize.NOW
    },
    updatedAt:{
      type: DataTypes.DATE,
      field: 'updated_at',
      defaultValue: sequelize.NOW
    },
    createdAt:{
      type: DataTypes.DATE,
      field: 'created_at',
      defaultValue: sequelize.NOW
    },
    deletedAt: {
      type: DataTypes.DATE,
      field: 'deleted_at'
    }
  }, {
    sequelize,
    modelName: 'Song',
    paranoid: true
  });
  return song;
};