import { IObject } from './src/interfaces/Common';

type Env = {
  ENV: string;
  API_URL: IObject;
  VERSION: string;
};

const config: Env = {
  ENV: 'production',
  API_URL: {
    development: '',
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
