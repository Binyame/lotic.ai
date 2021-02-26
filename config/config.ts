if (process.env.NODE_ENV !== 'production') {
  require('dotenv-safe').config({
    allowEmptyValues: true,
  });
}

import parseDbUrl from 'parse-database-url';

let postgresPrimary = {
  username: process.env.SQL_USERNAME || '',
  password: process.env.SQL_PASSWORD || '',
  database: process.env.SQL_DATABASE || '',
  host: process.env.SQL_HOST || '',
  port: parseInt(process.env.SQL_PORT || '', 10),
  ssl: !!process.env.SQL_SSL_REQUIRE,
  dialect: process.env.SQL_DIALECT || 'postgres',
};

if (process.env.DATABASE_URL) {
  const parsed = parseDbUrl(process.env.DATABASE_URL);
  postgresPrimary = {
    username: parsed.user || '',
    password: parsed.password || '',
    database: parsed.database || '',
    host: parsed.host || '',
    port: parseInt(parsed.port || '', 10),
    ssl: !!(parsed.ssl || process.env.SQL_SSL_REQUIRE),
    dialect: parsed.driver || '',
  };
}

const config = {
  environment: process.env.NODE_ENV,
  port: process.env.PORT || 3000,
  api: {
    host: process.env.API_HOST,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  redirects: {
    uri: process.env.REDIRECT_URI_WEB,
    protocolUri: process.env.REDIRECT_URI_PROTOCOL,
  },
  github: {
    clientId: process.env.GITHUB_CLIENT_ID || 'xxxxxxxxx',
    clientSecret: process.env.GITHUB_CLIENT_SECRET || 'xxxxxxxxx',
  },
  aws: {
    accessKey: process.env.AWS_ACCESS_KEY_ID,
    secret: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_DEFAULT_REGION,
    momentsBucket: process.env.AWS_S3_MOMENTS_BUCKET,
  },
  db: {
    primary: {
      ...postgresPrimary,
      logging: () => process.env.LOG_SQL,
    },
    test: {
      username: process.env.SQL_USERNAME_TEST || '',
      password: process.env.SQL_PASSWORD_TEST || '',
      database: process.env.SQL_DATABASE_TEST || '',
      host: process.env.SQL_HOST_TEST || '',
      port: parseInt(process.env.SQL_PORT_TEST || '', 10),
      dialect: process.env.SQL_DIALECT_TEST || 'postgres',
      ssl: false,
      logging: () => process.env.LOG_SQL,
    },
  },
  email: {
    sendGrid: {
      apiKey: process.env.SENDGRID_API_KEY,
    },
  },
  redis: {
    default: {
      url: process.env.REDIS_URL,
      host: process.env.DEFAULT_REDIS_HOST,
      port: process.env.DEFAULT_REDIS_PORT,
      password: process.env.DEFAULT_REDIS_PASSWORD,
    },
  },
};

export default config;
