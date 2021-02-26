'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Moment', 'mimeType', {
      allowNull: true,
      type: Sequelize.TEXT,
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Moment', 'mimeType');
  },
};
