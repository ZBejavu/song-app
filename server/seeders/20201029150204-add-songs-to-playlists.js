'use strict';

const songsInPlaylists = require('../copySongsInPlaylist');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('songs_in_playlists', songsInPlaylists, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('songs_in_playlists', null, {});
  },
};
