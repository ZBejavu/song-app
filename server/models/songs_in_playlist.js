'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class songs_in_playlist extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Song, {
        foreignKey: 'songId'
      });
      this.belongsTo(models.Playlist, {
        foreignKey: 'playlistId'
      });
    }
  };
  songs_in_playlist.init({
    playlistId: {
      type: DataTypes.INTEGER,
      field: 'playlist_id',
      allowNull:false
    },
    songId: {
      type: DataTypes.INTEGER,
      field: 'song_id',
      allowNull:false
    }
  }, {
    sequelize,
    modelName: 'songs_in_playlist',
    timestamps: false
  });
  return songs_in_playlist;
};