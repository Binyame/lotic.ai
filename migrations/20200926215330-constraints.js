'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addConstraint('ReviewSubmission', {
      fields: ['patientId'],
      type: 'FOREIGN KEY',
      name: 'ReviewSubmission_patientId_fkey',
      references: {
        //Required field
        table: 'Patient',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    await queryInterface.addConstraint('DataPrint', {
      fields: ['patientId'],
      type: 'FOREIGN KEY',
      name: 'DataPrint_patientId_fkey',
      references: {
        //Required field
        table: 'Patient',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    await queryInterface.addConstraint('Moment', {
      fields: ['patientId'],
      type: 'FOREIGN KEY',
      name: 'Moment_patientId_fkey',
      references: {
        //Required field
        table: 'Patient',
        field: 'id',
      },
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE',
    });

    await queryInterface.addConstraint('Moment', {
      fields: ['assessmentId'],
      type: 'FOREIGN KEY',
      name: 'Moment_assessmentId_fkey',
      references: {
        //Required field
        table: 'Assessment',
        field: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeConstraint(
      'ReviewSubmission',
      'ReviewSubmission_patientId_fkey'
    );

    await queryInterface.removeConstraint(
      'DataPrint',
      'DataPrint_patientId_fkey'
    );

    await queryInterface.removeConstraint('Moment', 'Moment_patientId_fkey');
    await queryInterface.removeConstraint('Moment', 'Moment_assessmentId_fkey');
  },
};
