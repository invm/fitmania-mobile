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

require('./src/utils/initFirebase');

const fonts = {
  'Assistant-Bold': require('./assets/fonts/Assistant-Bold.ttf'),
  'Assistant-ExtraBold': require('./assets/fonts/Assistant-ExtraBold.ttf'),
  'Assistant-ExtraLight': require('./assets/fonts/Assistant-ExtraLight.ttf'),
  'Assistant-Light': require('./assets/fonts/Assistant-Light.ttf'),
  'Assistant-Medium': require('./assets/fonts/Assistant-Medium.ttf'),
  'Assistant-Regular': require('./assets/fonts/Assistant-Regular.ttf'),
  'Assistant-SemiBold': require('./assets/fonts/Assistant-SemiBold.ttf'),
  'Ubuntu-Bold': require('./assets/fonts/Ubuntu-Bold.ttf'),
  'Ubuntu-Light': require('./assets/fonts/Ubuntu-Light.ttf'),
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
          ref={ref => Toast.setRef(ref)}
        />
      </LoadAssets>
    </Provider>
  );
};

export default codePush(App);
