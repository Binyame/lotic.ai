'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('MomentShareClinician', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      momentShareId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      clinicianId: {
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

    await queryInterface.addConstraint('MomentShareClinician', {
      fields: ['momentShareId'],
      type: 'FOREIGN KEY',
      name: 'MomentShareClinician_momentShareId_fkey',
      references: {
        //Required field
        table: 'MomentShare',
        field: 'id',
      },
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE',
    });

    await queryInterface.addConstraint('MomentShareClinician', {
      fields: ['clinicianId'],
      type: 'FOREIGN KEY',
      name: 'MomentShareClinician_clinicianId_fkey',
      references: {
        //Required field
        table: 'Clinician',
        field: 'id',
      },
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE',
    });

    await queryInterface.addConstraint('MomentShareClinician', {
      fields: ['momentShareId', 'clinicianId'],
      type: 'unique',
      name: 'MomentShareClinician_momentShareId_clinicianId_key',
      primary: false,
      unique: true,
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('MomentShareClinician');
  },
};
