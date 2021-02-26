'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('PatientAgreement', {
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
      agreementId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      agreed: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      agreedAt: {
        type: Sequelize.DATE,
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

    await queryInterface.addConstraint('PatientAgreement', {
      fields: ['patientId'],
      type: 'FOREIGN KEY',
      name: 'PatientAgreement_patientId_fkey',
      references: {
        table: 'Patient',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    await queryInterface.addConstraint('PatientAgreement', {
      fields: ['agreementId'],
      type: 'FOREIGN KEY',
      name: 'PatientAgreement_agreementId_fkey',
      references: {
        table: 'Agreement',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    await queryInterface.addConstraint('PatientAgreement', {
      fields: ['patientId', 'agreementId'],
      type: 'unique',
      name: 'PatientAgreement_patientId_agreementId_key',
      primary: false,
      // unique: true,
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('PatientAgreements');
  },
};
