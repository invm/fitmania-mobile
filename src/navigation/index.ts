import { ParamListBase, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

export interface StackNavigationProps<
  ParamsList extends ParamListBase,
  RouteName extends keyof ParamsList = string
> {
  navigation: StackNavigationProp<ParamsList, RouteName>;
  route: RouteProp<ParamsList, RouteName>;
}

export type AuthRoutes = {
  Register: undefined;
  Login: undefined;
  TermsOfUse: undefined;
  PrivacyPolicy: undefined;
};

export type HomeRoutes = {
  TermsOfUse: undefined;
  PrivacyPolicy: undefined;
  Home: undefined;
};

export { default } from './MainNavigator';
