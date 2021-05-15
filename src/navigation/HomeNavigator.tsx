import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { Home, Profile, PostScreen, Search } from '../screens';
import { useTranslation } from 'react-i18next';
import { colors, Text, Header } from '../components';
import { AppRoutes, HomeRoutes } from '.';
import { TAB_BAR_HEIGHT } from '../screens/Home/Home';
import Icon from 'react-native-vector-icons/Ionicons';

const ProfileScreenStack = createStackNavigator<HomeRoutes>();
const HomeScreenStack = createStackNavigator<HomeRoutes>();
const SearchScreenStack = createStackNavigator<HomeRoutes>();
const HomeStack = createStackNavigator<HomeRoutes>();
const HomeTab = createBottomTabNavigator<AppRoutes>();

const HomeNavigator = () => {
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerBackTitleVisible: false,
        gestureEnabled: false,
      }}
      headerMode="screen"
      initialRouteName="HomeTabsNavigator">
      <HomeStack.Screen
        name="HomeTabsNavigator"
        options={{
          header: () => null,
        }}
        component={HomeTabsNavigator}
      />
      <HomeStack.Screen
        name="PostScreen"
        options={{
          header: () => <Header canGoBack={true} />,
        }}
        component={PostScreen}
      />
    </HomeStack.Navigator>
  );
};

function ProfileStackScreen() {
  const { t } = useTranslation();
  return (
    <ProfileScreenStack.Navigator>
      <ProfileScreenStack.Screen
        name="Profile"
        component={Profile}
        options={{
          header: () => <Header color="white" title={t('screens.profile')} />,
        }}
      />
    </ProfileScreenStack.Navigator>
  );
}

function HomeStackScreen() {
  const { t } = useTranslation();
  return (
    <HomeScreenStack.Navigator>
      <HomeScreenStack.Screen
        name="Home"
        component={Home}
        options={{
          header: () => <Header color="white" title={t('screens.home')} />,
        }}
      />
    </HomeScreenStack.Navigator>
  );
}
function SearchStackScreen() {
  return (
    <SearchScreenStack.Navigator>
      <SearchScreenStack.Screen
        name="Search"
        component={Search}
        options={{
          header: () => <Header searchBar />,
        }}
      />
    </SearchScreenStack.Navigator>
  );
}

const HomeTabsNavigator = () => {
  const { t } = useTranslation();
  return (
    <HomeTab.Navigator
      tabBarOptions={{
        // keyboardHidesTabBar: Platform.OS == 'ios' ? false : true,
        tabStyle: { overflow: 'hidden' },
        style: {
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          backgroundColor: colors.white,
          shadowColor: '#000',
          borderWidth: 0.5,
          borderColor: colors.lightGrey,
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: 0.32,
          shadowRadius: 5.46,
          elevation: 9,
          position: 'absolute',
          zIndex: 999,
          height: TAB_BAR_HEIGHT,
        },
      }}
      //   screenOptions={{
      //     tabBarVisible: authenticated && !verifyingSession,
      //   }}
      initialRouteName="Home">
      <HomeTab.Screen
        name="Home"
        options={{
          tabBarIcon: ({ focused }) => (
            <Icon
              size={25}
              name={'home'}
              color={focused ? colors.primary : colors.dark}
            />
          ),
          tabBarLabel: ({ focused }) => (
            <Text
              variant="medium12"
              color={focused ? colors.primary : colors.dark}>
              {t('screens.home')}
            </Text>
          ),
        }}
        component={HomeStackScreen}
      />
      <HomeTab.Screen
        name="Search"
        options={{
          tabBarIcon: ({ focused }) => (
            <Icon
              size={25}
              name={'search'}
              color={focused ? colors.primary : colors.dark}
            />
          ),
          tabBarLabel: ({ focused }) => (
            <Text
              variant="medium12"
              color={focused ? colors.primary : colors.dark}>
              {t('screens.search')}
            </Text>
          ),
        }}
        component={SearchStackScreen}
      />
      <HomeTab.Screen
        name="Profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <Icon
              size={25}
              name={'person'}
              color={focused ? colors.primary : colors.dark}
            />
          ),
          tabBarLabel: ({ focused }) => (
            <Text
              variant="medium12"
              color={focused ? colors.primary : colors.dark}>
              {t('screens.profile')}
            </Text>
          ),
        }}
        component={ProfileStackScreen}
      />
    </HomeTab.Navigator>
  );
};

export default HomeNavigator;
