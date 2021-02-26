'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('Content', 'source', {
        allowNull: true,
        type: Sequelize.STRING,
      }),
      queryInterface.addColumn('Content', 'author', {
        allowNull: false,
        type: Sequelize.STRING,
      }),
      queryInterface.addColumn('Content', 'area', {
        allowNull: false,
        type: Sequelize.STRING,
      }),
      queryInterface.addColumn('Content', 'tags', {
        allowNull: false,
        type: Sequelize.ARRAY(Sequelize.STRING),
      }),
      queryInterface.addColumn('Content', 'preview', {
        allowNull: false,
        type: Sequelize.STRING,
      }),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('Content', 'source'),
      queryInterface.removeColumn('Content', 'author'),
      queryInterface.removeColumn('Content', 'area'),
      queryInterface.removeColumn('Content', 'tags'),
      queryInterface.removeColumn('Content', 'preview'),
    ]);
  },
};
