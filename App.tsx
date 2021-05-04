import 'react-native-gesture-handler';
import React from 'react';
import codePush from 'react-native-code-push';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { enableScreens } from 'react-native-screens';
import { LoadAssets } from './src/components';
import MainNavigator from './src/navigation/MainNavigator';
import store from './src/redux';
import './src/i18n';
import { assets as AuthAssets } from './src/screens/Auth';

import { toastConfig } from './src/utils/ToastConfig';

require('./src/utils/initFirebase');

const fonts = {
  Ayuthaya: require('./assets/fonts/Ayuthaya.ttf'),
};

const assets = [...AuthAssets];

enableScreens();

const App = () => {
  return (
    <Provider {...{ store }}>
      <LoadAssets {...{ fonts, assets }}>
        <SafeAreaProvider>
          <MainNavigator />
        </SafeAreaProvider>
        <Toast
          height={300}
          config={toastConfig}
          ref={(ref) => Toast.setRef(ref)}
        />
      </LoadAssets>
    </Provider>
  );
};

export default codePush(App);
