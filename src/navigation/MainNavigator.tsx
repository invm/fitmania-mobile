import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import AuthNavigator from './AuthNavigator';
import HomeNavigator from './HomeNavigator';

const MainNavigatorStack = createStackNavigator();

const MainNavigator = () => (
  <MainNavigatorStack.Navigator
    initialRouteName="Auth"
    screenOptions={{ headerBackTitleVisible: false, headerShown: false }}>
    <MainNavigatorStack.Screen name="Auth" component={AuthNavigator} />
    <MainNavigatorStack.Screen name="Home" component={HomeNavigator} />
  </MainNavigatorStack.Navigator>
);

export default MainNavigator;
