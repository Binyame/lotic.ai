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
      'PatientReview',
      'PatientReview_patientId_reviewId_key'
    );

    await queryInterface.removeIndex(
      'PatientReview',
      'PatientReview_patientId_reviewId_key'
    );

    await queryInterface.changeColumn('SignalQuestion', 'trigger', {
      allowNull: true,
      type: Sequelize.JSONB,
    });

    await queryInterface.addColumn('PatientReview', 'completed', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.addConstraint('PatientReview', {
      fields: ['patientId', 'reviewId'],
      type: 'unique',
      name: 'PatientReview_patientId_reviewId_key',
      primary: false,
      unique: true,
    });

    await queryInterface.changeColumn('SignalQuestion', 'trigger', {
      allowNull: false,
      type: Sequelize.JSONB,
    });

    await queryInterface.removeColumn('PatientReview', 'completed');
  },
};
