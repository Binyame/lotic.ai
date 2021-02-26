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
      'Moment',
      'Moment_assessmentId_patientId_key'
    );

    await queryInterface.removeIndex(
      'Moment',
      'Moment_assessmentId_patientId_key'
    );
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.addConstraint('Moment', {
      fields: ['assessmentId', 'patientId'],
      type: 'unique',
      name: 'Moment_assessmentId_patientId_key',
      primary: false,
      unique: true,
    });
  },
};
