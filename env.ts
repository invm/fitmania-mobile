import { IObject } from './src/interfaces/Common';

type Env = {
  ENV: string;
  API_URL: IObject;
  VERSION: string;
};

const config: Env = {
  ENV: 'production',
  API_URL: {
    development: 'https://f50e-2a10-800c-e7b7-0-dfce-13d1-8688-2ea2.eu.ngrok.io',
    production: 'https://api.fitmania.tk',
  },
  VERSION: require('./package.json').version,
};

export const API_URL = config.API_URL[config.ENV];
export const MEDIA_URL = config.API_URL[config.ENV] + '/media/';
export const VERSION = config.VERSION;
export const ENV = config.ENV;
export const APP_LINK = '';

export default config;
