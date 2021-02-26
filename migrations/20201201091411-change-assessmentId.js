'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint(
      'SignalQuestion',
      'SignalQuestion_assessmentId_fkey'
    );

    await queryInterface.changeColumn('SignalQuestion', 'assessmentId', {
      allowNull: true,
      type: Sequelize.INTEGER,
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
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint(
      'SignalQuestion',
      'SignalQuestion_assessmentId_fkey'
    );

    await queryInterface.changeColumn('SignalQuestion', 'assessmentId', {
      allowNull: false,
      type: Sequelize.INTEGER,
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
};
