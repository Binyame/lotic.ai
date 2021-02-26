import Umzug from 'umzug';
import Sequelize from 'sequelize';
import sequelizeInstance from '../models/sequelize';

class Migration {
  umzug: any;

  constructor(options = <any>{}) {
    this.umzug = new Umzug({
      storage: 'sequelize',
      storageOptions: {
        sequelize: sequelizeInstance,
      },
      migrations: {
        params: [(sequelizeInstance as any).queryInterface, Sequelize],
        path: 'migrations',
      },
      logging: options.logging || false,
    });
  }

  async up(options) {
    return this.umzug.up(options);
  }

  async down(options) {
    return this.umzug.down(options);
  }
}

export default Migration;
