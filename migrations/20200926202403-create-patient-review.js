'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('PatientReview', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      reviewId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      patientId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    await queryInterface.addConstraint('PatientReview', {
      fields: ['reviewId'],
      type: 'FOREIGN KEY',
      name: 'PatientReview_reviewId_fkey',
      references: {
        //Required field
        table: 'Review',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    await queryInterface.addConstraint('PatientReview', {
      fields: ['patientId'],
      type: 'FOREIGN KEY',
      name: 'PatientReview_patientId_fkey',
      references: {
        //Required field
        table: 'Patient',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    await queryInterface.addConstraint('PatientReview', {
      fields: ['reviewId', 'patientId'],
      type: 'unique',
      name: 'PatientReview_reviewId_patientId_key',
      primary: false,
      unique: true,
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('PatientReview');
  },
};
