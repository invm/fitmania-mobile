import { ParamListBase, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

export interface StackNavigationProps<
  ParamsList extends ParamListBase,
  RouteName extends keyof ParamsList = string,
> {
  navigation: StackNavigationProp<ParamsList, RouteName>;
  route: RouteProp<ParamsList, RouteName>;
}

export type AuthRoutes = {
  Welcome: undefined;
  Register: undefined;
  Login: undefined;
  Onboarding: undefined;
  OtpConfirmation: { email: string; otp?: string };
  Home: undefined;
  CreateProfile: undefined;
};

export type HomeRoutes = {
  HomeTabsNavigator: undefined;
  Home: undefined;
  Search: undefined;
  Profile: undefined;
  Groups: undefined;
  GroupDetails: { groupId: string };
  CreateGroup: undefined;
  Friends: undefined;
  PostScreen: { postId: string };
  CreateEvent: undefined;
  CreatePost: undefined;
  EditProfile: undefined;
  UserProfile: { userId: string };
};

export type AppRoutes = AuthRoutes & HomeRoutes & {};

export { default } from './MainNavigator';
