'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('HCProviderClinician', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      hcProviderId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      clinicianId: {
        allowNull: false,
        type: Sequelize.INTEGER,
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

    await queryInterface.addConstraint('HCProviderClinician', {
      fields: ['hcProviderId'],
      type: 'FOREIGN KEY',
      name: 'HCProviderClinician_hcProviderId_fkey',
      references: {
        //Required field
        table: 'HCProvider',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    await queryInterface.addConstraint('HCProviderClinician', {
      fields: ['clinicianId'],
      type: 'FOREIGN KEY',
      name: 'HCProviderClinician_clinicianId_fkey',
      references: {
        //Required field
        table: 'Clinician',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    await queryInterface.addConstraint('HCProviderClinician', {
      fields: ['hcProviderId', 'clinicianId'],
      type: 'unique',
      name: 'HCProviderClinician_hcProviderId_clinicianId_key',
      primary: false,
      unique: true,
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('HCProviderClinician');
  },
};
