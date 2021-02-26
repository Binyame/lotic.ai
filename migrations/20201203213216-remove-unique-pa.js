'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.removeConstraint(
      'PatientAssessment',
      'PatientAssessment_patientId_assessmentId_key'
    );

    await queryInterface.removeIndex(
      'PatientAssessment',
      'PatientAssessment_patientId_assessmentId_key'
    );
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.addConstraint('PatientAssessment', {
      fields: ['patientId', 'assessmentId'],
      type: 'unique',
      name: 'PatientAssessment_patientId_assessmentId_key',
      primary: false,
      unique: true,
    });
  },
};
