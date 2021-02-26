'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn('PatientAssessment', 'bookmarked', {
      allowNull: true,
      type: Sequelize.BOOLEAN,
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('PatientAssessment', 'bookmarked');
  },
};
