import { IObject } from './src/interfaces/Common';

type Env = {
  ENV: string;
  API_URL: IObject;
  VERSION: string;
};

const config: Env = {
  ENV: 'development',
  API_URL: {
    development: 'https://3ebf-2a10-800c-bda2-0-d8cc-f37-7e14-2fc3.eu.ngrok.io',
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
