'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Review', 'ownerId', {
      allowNull: true,
      type: Sequelize.INTEGER,
    });

    await queryInterface.addColumn('Review', 'ownerType', {
      allowNull: true,
      type: Sequelize.STRING,
    });

    await queryInterface.sequelize.query(`UPDATE "Review" SET "ownerId" = 1;`);
    await queryInterface.sequelize.query(
      `UPDATE "Review" SET "ownerType" = 'lotic';`
    );

    await queryInterface.changeColumn('Review', 'ownerId', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });

    await queryInterface.changeColumn('Review', 'ownerType', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Review', 'ownerId');
    await queryInterface.removeColumn('Review', 'ownerType');
  },
};
