import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n, {
  LanguageDetectorAsyncModule,
  Services,
  InitOptions,
} from 'i18next';
import { initReactI18next } from 'react-i18next';
import { resources } from './resources';

export const appLangs = ['en'];

const languageDetector: LanguageDetectorAsyncModule = {
  type: 'languageDetector',
  // If this is set to true, your detect function receives a callback function that you should call with your language,
  //useful to retrieve your language stored in AsyncStorage for example
  async: true,
  init: (
    _services: Services,
    _detectorOptions: object,
    _i18nextOptions: InitOptions,
  ) => {
    /* use services and options */
  },
  detect: (callback: (lng: string) => void) => {
    AsyncStorage.getItem('locale', (err, lng) => {
      // Error fetching stored data or no language was stored
      if (err || !lng) {
        callback('en');
        return;
      }
      callback(lng);
    });
  },
  cacheUserLanguage: (lng: string) => {
    AsyncStorage.setItem('locale', lng);
  },
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .use(languageDetector)
  .init({
    resources,

    keySeparator: '.',

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
