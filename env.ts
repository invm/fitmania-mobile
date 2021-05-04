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
    development: '',
    production: '',
  },
  VERSION: require('./package.json').version,
};

export const API_URL = config.API_URL[config.ENV];
export const VERSION = config.VERSION;
export const GOOGLE_API_KEY = '';
export const ENV = config.ENV;
export const APP_LINK = '';

export default config;
