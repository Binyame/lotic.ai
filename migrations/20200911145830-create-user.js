'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Patient', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      provider: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      providerId: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      providerKey: {
        allowNull: false,
        type: Sequelize.STRING,
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

    await queryInterface.addConstraint('Patient', {
      fields: ['provider', 'providerId'],
      type: 'unique',
      name: 'patient_provider_providerId',
      primary: false,
      unique: true,
    });

    await queryInterface.createTable('Clinician', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      provider: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      providerId: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      providerKey: {
        allowNull: false,
        type: Sequelize.STRING,
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

    await queryInterface.addConstraint('Clinician', {
      fields: ['provider', 'providerId'],
      type: 'unique',
      name: 'clinician_provider_providerId',
      primary: false,
      unique: true,
    });

    await queryInterface.createTable('LoticUser', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      provider: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      providerId: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      providerKey: {
        allowNull: false,
        type: Sequelize.STRING,
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

    await queryInterface.addConstraint('LoticUser', {
      fields: ['provider', 'providerId'],
      type: 'unique',
      name: 'loticUser_provider_providerId',
      primary: false,
      unique: true,
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Patient');
    await queryInterface.dropTable('Clinician');
  },
};
