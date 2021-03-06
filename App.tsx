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
import { assets as AuthAssets } from './src/screens/Auth';
import './src/i18n/index';

import { toastConfig } from './src/utils/ToastConfig';
import { LogBox } from 'react-native';

require('./src/utils/initFirebase');

const fonts = {
  'Assistant-Bold': require('./assets/fonts/Assistant-Bold.ttf'),
  'Assistant-Medium': require('./assets/fonts/Assistant-Medium.ttf'),
  'Assistant-Regular': require('./assets/fonts/Assistant-Regular.ttf'),
  'Assistant-SemiBold': require('./assets/fonts/Assistant-SemiBold.ttf'),
};
const assets = [...AuthAssets];

enableScreens();

LogBox.ignoreLogs(['VirtualizedLists should never be nested']);

const App = () => {
  return (
    <Provider {...{ store }}>
      <LoadAssets {...{ fonts, assets }}>
        <SafeAreaProvider>
          <MainNavigator />
        </SafeAreaProvider>
        <Toast
          height={100}
          config={toastConfig}
          ref={ref => Toast.setRef(ref)}
        />
      </LoadAssets>
    </Provider>
  );
};

export default codePush(App);
