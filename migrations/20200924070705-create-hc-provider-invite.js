'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('HCProviderInvite', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      code: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      providerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      clinicians: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      expiresAt: {
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

    await queryInterface.addConstraint('HCProviderInvite', {
      fields: ['providerId'],
      type: 'FOREIGN KEY',
      name: 'HCProviderInvite_providerId_fkey',
      references: {
        table: 'HCProvider',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    await queryInterface.addConstraint('HCProviderInvite', {
      fields: ['providerId'],
      type: 'unique',
      name: 'HCProviderInvite_providerId_key',
      primary: false,
      unique: true,
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('HCProviderInvite');
  },
};
