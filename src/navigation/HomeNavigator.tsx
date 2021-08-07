import React from 'react';
import {
  createStackNavigator,
  StackHeaderProps,
} from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import * as SCREENS from '../screens';
import { useTranslation } from 'react-i18next';
import { colors, Text, Header } from '../components';
import { AppRoutes, HomeRoutes } from '.';
import { TAB_BAR_HEIGHT } from '../screens/Home/Home';
import Icon from 'react-native-vector-icons/Ionicons';

const ProfileScreenStack = createStackNavigator<HomeRoutes>();
const HomeScreenStack = createStackNavigator<HomeRoutes>();
const SearchScreenStack = createStackNavigator<HomeRoutes>();
const GroupsScreenStack = createStackNavigator<HomeRoutes>();
const FriendsScreenStack = createStackNavigator<HomeRoutes>();
const HomeStack = createStackNavigator<HomeRoutes>();
const HomeTab = createBottomTabNavigator<AppRoutes>();
const FriendsTabs = createMaterialTopTabNavigator<HomeRoutes>();

const HomeNavigator = () => {
  const { t } = useTranslation();

  return (
    <HomeStack.Navigator
      mode="modal"
      screenOptions={{
        headerBackTitleVisible: false,
        gestureEnabled: false,
        headerShown: false,
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
        component={SCREENS.PostScreen}
      />
      <HomeStack.Screen
        name="GroupDetails"
        options={{
          headerShown: true,
          header: () => <Header canGoBack={true} />,
        }}
        component={SCREENS.GroupDetails}
      />
      <HomeStack.Screen
        name="CreateGroup"
        options={{
          headerShown: true,
          // TODO:
          header: () => <Header canGoBack={true} title="Create group" />,
        }}
        component={SCREENS.CreateGroup}
      />
      <HomeStack.Screen
        name="CreatePost"
        options={{
          headerShown: true,
          header: () => (
            <Header canGoBack={true} title={t('screens.create_post')} />
          ),
        }}
        component={SCREENS.CreatePost}
      />
      <HomeStack.Screen
        name="CreateEvent"
        options={{
          headerShown: true,
          header: () => (
            <Header canGoBack={true} title={t('screens.create_event')} />
          ),
        }}
        component={SCREENS.CreateEvent}
      />
      <HomeStack.Screen
        name="EditProfile"
        options={{
          headerShown: true,
          header: () => (
            <Header canGoBack={true} title={t('screens.edit_profile')} />
          ),
        }}
        component={SCREENS.EditProfile}
      />
      <HomeStack.Screen
        name="UserProfile"
        options={{
          headerShown: true,
          header: () => null,
        }}
        component={SCREENS.UserProfile}
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
        component={SCREENS.Profile}
        options={{
          header: ({ navigation }: StackHeaderProps) => (
            <Header
              color="white"
              title={t('screens.profile')}
              rightIcons={[
                {
                  action: () => {
                    navigation.navigate('EditProfile');
                  },
                  icon: 'create-outline',
                },
              ]}
            />
          ),
        }}
      />
    </ProfileScreenStack.Navigator>
  );
}

function HomeStackScreen() {
  return (
    <HomeScreenStack.Navigator headerMode="screen">
      <HomeScreenStack.Screen
        name="Home"
        component={SCREENS.Home}
        options={
          {
            // header: () => <Header color="white" title={t('screens.home')} />,
          }
        }
      />
    </HomeScreenStack.Navigator>
  );
}

function SearchStackScreen() {
  return (
    <SearchScreenStack.Navigator>
      <SearchScreenStack.Screen
        name="Search"
        component={SCREENS.Search}
        options={{
          header: () => <Header searchBar />,
        }}
      />
    </SearchScreenStack.Navigator>
  );
}

function GroupsStackScreen() {
  const { t } = useTranslation();
  return (
    <GroupsScreenStack.Navigator>
      <GroupsScreenStack.Screen
        name="Groups"
        component={SCREENS.Groups}
        options={{
          header: () => <Header title={t('screens.groups')} />,
        }}
      />
    </GroupsScreenStack.Navigator>
  );
}

function FriendsStackScreen() {
  const { t } = useTranslation();
  return (
    <FriendsScreenStack.Navigator>
      <FriendsScreenStack.Screen
        name="Friends"
        component={FriendsTabsNavigator}
        options={{
          header: () => <Header title={t('screens.friends')} />,
        }}
      />
    </FriendsScreenStack.Navigator>
  );
}

const FriendsTabsNavigator = () => {
  // TODO: move texts into i18n
  return (
    <FriendsTabs.Navigator>
      <FriendsTabs.Screen name="Friends" component={SCREENS.Friends} />
      <FriendsTabs.Screen
        name="FriendsRequests"
        options={{ title: 'requests' }}
        component={SCREENS.FriendRequests}
      />
      <FriendsTabs.Screen
        name="FriendsSuggestions"
        options={{ title: 'suggestions' }}
        component={SCREENS.FriendsSuggestions}
      />
    </FriendsTabs.Navigator>
  );
};

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
        name="Groups"
        options={{
          tabBarIcon: ({ focused }) => (
            <Icon
              size={25}
              name={'earth-outline'}
              color={focused ? colors.primary : colors.dark}
            />
          ),
          tabBarLabel: ({ focused }) => (
            <Text
              variant="medium12"
              color={focused ? colors.primary : colors.dark}>
              {t('screens.groups')}
            </Text>
          ),
        }}
        component={GroupsStackScreen}
      />
      <HomeTab.Screen
        name="Friends"
        options={{
          tabBarIcon: ({ focused }) => (
            <Icon
              size={25}
              name={'people-outline'}
              color={focused ? colors.primary : colors.dark}
            />
          ),
          tabBarLabel: ({ focused }) => (
            <Text
              variant="medium12"
              color={focused ? colors.primary : colors.dark}>
              {t('screens.friends')}
            </Text>
          ),
        }}
        component={FriendsStackScreen}
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
