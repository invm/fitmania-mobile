import { IObject } from './src/interfaces/Common';
import { ENV } from './env';

type Env = {
  API_KEY: IObject;
};

const config: Env = {
  API_KEY: {
    development: '',
    production: '',
  },
};

export const API_KEY = config.API_KEY[ENV];
export const GOOGLE_API_KEY = '';
