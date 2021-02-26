'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Profile', {
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
      avatarUri: {
        type: Sequelize.STRING,
      },
      lat: {
        type: Sequelize.FLOAT,
      },
      lng: {
        type: Sequelize.FLOAT,
      },
      shortDescription: {
        type: Sequelize.TEXT,
      },
      longDescription: {
        type: Sequelize.TEXT,
      },
      title: {
        type: Sequelize.STRING,
      },
      name: {
        type: Sequelize.STRING,
      },
      githubUser: {
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
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Profile');
  },
};
