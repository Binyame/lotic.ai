'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('PatientReview', 'deletedAt', {
      allowNull: true,
      type: Sequelize.DATE,
    });

    await queryInterface.addConstraint('PatientReview', {
      fields: ['patientId', 'reviewId'],
      type: 'unique',
      name: 'PatientReview_patientId_reviewId_key',
      primary: false,
      unique: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('PatientReview', 'deletedAt');
  },
};
