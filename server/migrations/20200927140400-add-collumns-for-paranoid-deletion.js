'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn(
      'artists', // table name
      'deleted_at', // new field name
      {
        type: Sequelize.DATE,
        allowNull: true,
      },
    )
    await queryInterface.addColumn(
      'albums', // table name
      'deleted_at', // new field name
      {
        type: Sequelize.DATE,
        allowNull: true,
      },
    )
    await queryInterface.addColumn(
      'songs', // table name
      'deleted_at', // new field name
      {
        type: Sequelize.DATE,
        allowNull: true,
      },
    )
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn(
      'Artists', // table name
      'deleted_at', // new field name
    )
    await queryInterface.removeColumn(
      'Albums', // table name
      'deleted_at', // new field name
    )
    await queryInterface.removeColumn(
      'Songs', // table name
      'deleted_at', // new field name
    )
  }
};
