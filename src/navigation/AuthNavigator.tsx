import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { Login, Register } from '../screens/Auth';
import { AuthRoutes } from '.';

const AuthStack = createStackNavigator<AuthRoutes>();

const AuthNavigator = () => {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={Login} />
      <AuthStack.Screen name="Register" component={Register} />
    </AuthStack.Navigator>
  );
};

export default AuthNavigator;
