'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn('PatientAssessment', 'deletedAt', {
      allowNull: true,
      type: Sequelize.DATE,
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('PatientAssessment', 'deletedAt');
  },
};
