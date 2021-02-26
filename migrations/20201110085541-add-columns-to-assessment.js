'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Assessment', 'ownerId', {
      allowNull: true,
      type: Sequelize.INTEGER,
    });

    await queryInterface.addColumn('Assessment', 'ownerType', {
      allowNull: true,
      type: Sequelize.STRING,
    });

    await queryInterface.sequelize.query(
      `UPDATE "Assessment" SET "ownerId" = 1;`
    );
    await queryInterface.sequelize.query(
      `UPDATE "Assessment" SET "ownerType" = 'lotic';`
    );

    await queryInterface.changeColumn('Assessment', 'ownerId', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });

    await queryInterface.changeColumn('Assessment', 'ownerType', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Assessment', 'ownerId');
    await queryInterface.removeColumn('Assessment', 'ownerType');
  },
};
