'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('AssessmentPrompt', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      assessmentId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      promptId: {
        type: Sequelize.INTEGER,
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

    await queryInterface.addConstraint('AssessmentPrompt', {
      fields: ['assessmentId'],
      type: 'FOREIGN KEY',
      name: 'AssessmentPrompt_assessmentId_fkey',
      references: {
        table: 'Assessment',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    await queryInterface.addConstraint('AssessmentPrompt', {
      fields: ['promptId'],
      type: 'FOREIGN KEY',
      name: 'AssessmentPrompt_promptId_fkey',
      references: {
        table: 'Prompt',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    await queryInterface.addConstraint('AssessmentPrompt', {
      fields: ['assessmentId', 'promptId'],
      type: 'unique',
      name: 'AssessmentPrompt_assessmentId_promptId_key',

      primary: false,
      unique: true,
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('AssessmentPrompts');
  },
};
