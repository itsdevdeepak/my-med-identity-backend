import dotenv from 'dotenv';
dotenv.config();

import merge from 'lodash.merge';

if (!process.env.DB_URL) {
  throw new Error('Enviroment variables are not defined.');
}

process.env.PORT = process.env.PORT ?? '3000';

type Config = {
  port: string;
  logging: boolean;
  env: string;
  secret: {
    dbUrl: string;
  };
};

const defaultConfig: Config = {
  port: process.env.PORT,
  logging: true,
  env: 'development',
  secret: {
    dbUrl: process.env.DB_URL,
  },
};

let envConfig: Config;

switch (process.env.ENV) {
  case 'production':
    envConfig = require('./production');
    break;
  case 'stagging':
    envConfig = require('./staging');
    break;
  default:
    envConfig = require('./local');
}

export default merge(defaultConfig, envConfig);
