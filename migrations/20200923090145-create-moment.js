'use strict';
const { UUIDV4 } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Moment', {
      uuid: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        default: UUIDV4,
      },
      type: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      patientId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      assessmentId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      durationMs: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      uri: {
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

    await queryInterface.addConstraint('Moment', {
      fields: ['assessmentId', 'patientId'],
      type: 'unique',
      name: 'Moment_assessmentId_patientId_key',
      primary: false,
      unique: true,
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Moment');
  },
};
