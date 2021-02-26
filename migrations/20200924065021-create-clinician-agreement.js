'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ClinicianAgreement', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      clinicianId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: false,
      },
      agreementId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: false,
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

    await queryInterface.addConstraint('ClinicianAgreement', {
      fields: ['agreementId'],
      type: 'FOREIGN KEY',
      name: 'ClinicianAgreement_agreementId_fkey',
      references: {
        table: 'Agreement',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    await queryInterface.addConstraint('ClinicianAgreement', {
      fields: ['clinicianId'],
      type: 'FOREIGN KEY',
      name: 'ClinicianAgreement_clinicianId_fkey',
      references: {
        table: 'Clinician',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    await queryInterface.addConstraint('ClinicianAgreement', {
      fields: ['clinicianId', 'agreementId'],
      type: 'unique',
      name: 'ClinicianAgreement_clinicianId_agreementId_key',
      primary: false,
      unique: true,
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('ClinicianAgreement');
  },
};
