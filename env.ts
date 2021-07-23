import { IObject } from './src/interfaces/Common';

type Env = {
  ENV: string;
  API_URL: IObject;
  VERSION: string;
};

const config: Env = {
  ENV: 'development',
  API_URL: {
    development: 'https://c2c0d88d6e62.eu.ngrok.io',
    production: '',
  },
  VERSION: require('./package.json').version,
};

export const API_URL = config.API_URL[config.ENV];
export const MEDIA_URL = config.API_URL[config.ENV] + '/media/';
export const VERSION = config.VERSION;
export const ENV = config.ENV;
export const APP_LINK = '';

export default config;
