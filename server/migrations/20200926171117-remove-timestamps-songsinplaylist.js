'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      'songs_in_playlists', // table name
      'createdAt', // new field name
    );
    await queryInterface.removeColumn(
      'songs_in_playlists', // table name
      'updatedAt', // new field name
    );
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'songs_in_playlists', // table name
      'created_at', // new field name
    );
    await queryInterface.addColumn(
      'songs_in_playlists', // table name
      'updated_at', // new field name
    )
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
