'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('MomentShare', {
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
      uri: {
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

    await queryInterface.addConstraint('MomentShare', {
      fields: ['momentUuid'],
      type: 'FOREIGN KEY',
      name: 'MomentShare_momentUuid_fkey',
      references: {
        //Required field
        table: 'Moment',
        field: 'uuid',
      },
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE',
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('MomentShare');
  },
};
