'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('PatientAssessment', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      patientId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      assessmentId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      completed: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      type: {
        type: Sequelize.TEXT,
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

    await queryInterface.addConstraint('PatientAssessment', {
      fields: ['patientId'],
      type: 'FOREIGN KEY',
      name: 'PatientAssessment_patientId_fkey',
      references: {
        table: 'Patient',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    await queryInterface.addConstraint('PatientAssessment', {
      fields: ['assessmentId'],
      type: 'FOREIGN KEY',
      name: 'PatientAssessment_assessmentId_fkey',
      references: {
        table: 'Assessment',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    await queryInterface.addConstraint('PatientAssessment', {
      fields: ['patientId', 'assessmentId'],
      type: 'unique',
      name: 'PatientAssessment_patientId_assessmentId_key',
      primary: false,
      unique: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('PatientAssessments');
  },
};
