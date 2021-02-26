'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('CareTeamCode', 'usedOn', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('CareTeamCode', 'usedOn', {
      type: Sequelize.DATE,
      allowNull: false,
    });
  },
};
