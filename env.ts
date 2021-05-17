type Env = {
  ENV: string;
  API_URL: {
    [key: string]: string;
  };
  VERSION: string;
};

const config: Env = {
  ENV: 'development',
  API_URL: {
    development: 'https://c3818d183f20.eu.ngrok.io',
    production: '',
  },
  VERSION: require('./package.json').version,
};

export const API_URL = config.API_URL[config.ENV] + '/api';
export const MEDIA_URL = config.API_URL[config.ENV] + '/media/';
export const VERSION = config.VERSION;
export const GOOGLE_API_KEY = '';
export const ENV = config.ENV;
export const APP_LINK = '';

export default config;
