import dotenv from 'dotenv';
dotenv.config();

import merge from 'lodash.merge';

if (!process.env.DB_URL || !process.env.JWT_SECRET) {
  throw new Error('Enviroment variables are not defined.');
}

process.env.PORT = process.env.PORT ?? '3000';

type Config = {
  port: string;
  logging: boolean;
  env: string;
  rpID: string;
  applicationName: string;
  origin: string;
  secret: {
    dbUrl: string;
    jwt: string;
  };
};

const defaultConfig: Config = {
  port: process.env.PORT,
  applicationName: 'My Med Identity',
  rpID: 'localhost',
  origin: `http://localhost:5500`,
  logging: true,
  env: 'development',
  secret: {
    dbUrl: process.env.DB_URL,
    jwt: process.env.JWT_SECRET,
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
