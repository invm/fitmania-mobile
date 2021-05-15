import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import {
  Login,
  Register,
  Onboarding,
  OtpConfirmation,
  CreateProfile,
  Welcome,
} from '../screens/Auth';
import { AuthRoutes } from '.';
import { Header } from '../components';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/actions';
import { RootState } from '../redux';
const AuthStack = createStackNavigator<AuthRoutes>();

const options = {
  headerShown: false,
};

const AuthNavigator = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { user, authenticated } = useSelector(
    (state: typeof RootState) => state.user,
  );

  return (
    <AuthStack.Navigator
      screenOptions={{
        headerBackTitleVisible: false,
        gestureEnabled: false,
      }}
      headerMode="screen"
      initialRouteName={
        authenticated && user?.profileLoaded && !user?.profileCreated
          ? 'CreateProfile'
          : 'Welcome'
      }>
      <AuthStack.Screen
        name="Welcome"
        {...{ options, gestureEnabled: false }}
        component={Welcome}
      />
      <AuthStack.Screen
        name="Login"
        options={{
          header: () => <Header title={t('screens.login')} canGoBack />,
        }}
        component={Login}
      />
      <AuthStack.Screen
        name="Register"
        options={{
          header: () => <Header title={t('screens.register')} canGoBack />,
        }}
        component={Register}
      />
      <AuthStack.Screen
        name="Onboarding"
        {...{ options }}
        component={Onboarding}
      />
      <AuthStack.Screen
        name="OtpConfirmation"
        options={{
          header: () => <Header title={t('screens.confirmation')} canGoBack />,
        }}
        component={OtpConfirmation}
      />
      <AuthStack.Screen
        name="CreateProfile"
        options={{
          gestureEnabled: false,
          header: ({ navigation }) => (
            <Header
              title={t('screens.create_profile')}
              canGoBack
              icon={'logout'}
              action={() => {
                dispatch(logout());
                navigation.navigate('Welcome');
              }}
            />
          ),
        }}
        component={CreateProfile}
      />
    </AuthStack.Navigator>
  );
};

export default AuthNavigator;
