import configs from '../config/config';
import { Sequelize } from 'sequelize';

const config =
  process.env.NODE_ENV === 'test' ? configs.db.test : configs.db.primary;

// Set up a new Sequelize instance
export const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    dialect: 'postgres',
    host: config.host,
    port: config.port || 5432,
    // native: POSTGRES_NATIVE ? POSTGRES_NATIVE : false,
    // ssl: POSTGRES_SSL ? POSTGRES_SSL : false,
    dialectOptions: {
      ssl: config.ssl,
    },
    define: {
      freezeTableName: true,
    },
    logging: false,
  }
);

export default sequelize;
