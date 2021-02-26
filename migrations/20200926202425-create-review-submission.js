'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ReviewSubmission', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      patientId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      reviewId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      body: {
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

    await queryInterface.addConstraint('ReviewSubmission', {
      fields: ['reviewId'],
      type: 'FOREIGN KEY',
      name: 'ReviewSubmission_reviewId_fkey',
      references: {
        table: 'Review',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('ReviewSubmission');
  },
};
