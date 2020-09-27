'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Songs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      youtube_link: {
        type: Sequelize.STRING
      },
      length: {
        type: Sequelize.TIME
      },
      lyrics: {
        type: Sequelize.STRING
      },
      album_id: {
        type: Sequelize.INTEGER
      },
      artist_id: {
        type: Sequelize.INTEGER
      },
      uploaded_at: {
        type: Sequelize.DATE
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Songs');
  }
};