'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('SignalQuestion', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      reviewId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      assessmentId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      content: {
        allowNull: false,
        type: Sequelize.TEXT,
      },
      type: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      trigger: {
        allowNull: false,
        type: Sequelize.JSONB,
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

    await queryInterface.addConstraint('SignalQuestion', {
      fields: ['reviewId'],
      type: 'FOREIGN KEY',
      name: 'SignalQuestion_reviewId_fkey',
      references: {
        //Required field
        table: 'Review',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    await queryInterface.addConstraint('SignalQuestion', {
      fields: ['assessmentId'],
      type: 'FOREIGN KEY',
      name: 'SignalQuestion_assessmentId_fkey',
      references: {
        //Required field
        table: 'Assessment',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('SignalQuestion');
  },
};
