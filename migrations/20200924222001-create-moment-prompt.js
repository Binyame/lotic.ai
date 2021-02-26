'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('MomentPrompt', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      momentUuid: {
        allowNull: false,
        type: Sequelize.UUID,
      },
      promptId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      startTimeMs: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      endTimeMs: {
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

    await queryInterface.addConstraint('MomentPrompt', {
      fields: ['momentUuid'],
      type: 'FOREIGN KEY',
      name: 'MomentPrompt_momentUuid_fkey',
      references: {
        //Required field
        table: 'Moment',
        field: 'uuid',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    await queryInterface.addConstraint('MomentPrompt', {
      fields: ['promptId'],
      type: 'FOREIGN KEY',
      name: 'MomentPrompt_promptId_fkey',
      references: {
        //Required field
        table: 'Prompt',
        field: 'id',
      },
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE',
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('MomentPrompt');
  },
};
