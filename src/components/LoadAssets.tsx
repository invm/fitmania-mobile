import React, {
  ReactElement,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  InitialState,
  NavigationContainer,
  NavigationContainerRef,
} from '@react-navigation/native';
import SplashScreen from 'react-native-splash-screen';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import analytics from '@react-native-firebase/analytics';

const NAVIGATION_STATE_KEY = `NAVIGATION_STATE_KEY-${1}`;

export type FontSource = Parameters<typeof Font.loadAsync>[0];

const usePromiseAll = (
  promises: Promise<void | void[] | Asset[]>[],
  cb: () => void,
) =>
  useEffect(() => {
    (async () => {
      await Promise.all(promises);
      cb();
    })();
  });

const useLoadAssets = (assets: number[], fonts: FontSource): boolean => {
  const [ready, setReady] = useState(false);
  usePromiseAll(
    [Font.loadAsync(fonts), ...assets.map(asset => Asset.loadAsync(asset))],
    () => setReady(true),
  );
  return ready;
};

interface LoadAssetsProps {
  fonts?: FontSource;
  assets?: number[];
  children: ReactElement | ReactElement[];
}

const LoadAssets = ({
  assets,
  fonts,
  children,
}: LoadAssetsProps): ReactElement => {
  const navigationRef: React.RefObject<NavigationContainerRef> = useRef(null);
  const routeNameRef = useRef<string | undefined>();
  const [isNavigationReady, setIsNavigationReady] = useState(!__DEV__);
  const [initialState, setInitialState] = useState<InitialState | undefined>();
  const ready = useLoadAssets(assets || [], fonts || {});

  useEffect(() => {
    const restoreState = async () => {
      try {
        const savedStateString = await AsyncStorage.getItem(
          NAVIGATION_STATE_KEY,
        );
        const state = savedStateString
          ? JSON.parse(savedStateString)
          : undefined;
        setInitialState(state);
      } finally {
        setIsNavigationReady(true);
        SplashScreen.hide();
      }
    };

    if (!isNavigationReady) {
      restoreState();
    }
  }, [isNavigationReady]);

  const onStateChange = useCallback(async state => {
    AsyncStorage.setItem(NAVIGATION_STATE_KEY, JSON.stringify(state));
    const previousRouteName = routeNameRef.current;
    const currentRouteName = navigationRef?.current?.getCurrentRoute()?.name;

    if (previousRouteName !== currentRouteName) {
      // The line below uses the expo-firebase-analytics tracker
      // https://docs.expo.io/versions/latest/sdk/firebase-analytics/
      // Change this line to use another Mobile analytics SDK

      // Firebase Analytics only available in standalone apps
      await analytics().logScreenView({
        screen_name: currentRouteName,
        screen_class: currentRouteName,
      });
    }
    // Save the current route name for later comparison
    routeNameRef.current = currentRouteName;
  }, []);

  if (!ready || !isNavigationReady) {
    return <></>;
  }

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() =>
        (routeNameRef.current = navigationRef?.current?.getCurrentRoute()?.name)
      }
      {...{ onStateChange, initialState }}>
      {children}
    </NavigationContainer>
  );
};

export default LoadAssets;
