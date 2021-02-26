'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('PatientClinician', {
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
      clinicianId: {
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

    await queryInterface.addConstraint('PatientClinician', {
      fields: ['patientId'],
      type: 'FOREIGN KEY',
      name: 'PatientClinician_patientId_fkey',
      references: {
        table: 'Patient',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    await queryInterface.addConstraint('PatientClinician', {
      fields: ['clinicianId'],
      type: 'FOREIGN KEY',
      name: 'PatientClinician_clinicianId_fkey',
      references: {
        table: 'Clinician',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    await queryInterface.addConstraint('PatientClinician', {
      fields: ['patientId', 'clinicianId'],
      type: 'unique',
      name: 'PatientClinician_patientId_clinicianId_key',

      primary: false,
      unique: true,
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('PatientClinicians');
  },
};
