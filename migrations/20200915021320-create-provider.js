'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Provider', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      targetType: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      targetId: {
        allowNull: false,
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
      accessToken: {
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

    await queryInterface.addConstraint('Provider', {
      fields: ['targetType', 'targetId', 'provider', 'providerId'],
      type: 'unique',
      name: 'provider_targetType_targetId_provider_providerId',
      primary: false,
      unique: true,
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Provider');
  },
};
