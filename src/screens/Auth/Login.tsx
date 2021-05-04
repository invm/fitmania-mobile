import React from 'react';
import { View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

import { AuthRoutes, StackNavigationProps } from '../../navigation';

export const assets = [require('../../../assets/images/logo.png')];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const Login = ({}: StackNavigationProps<AuthRoutes, 'Login'>) => {
  return (
    <View style={styles.container}>
      <View style={{ width: 200, height: 200 }}>
        <LottieView
          source={require('../../../assets/images/animations/animation.json')}
          autoPlay
          loop
        />
      </View>
    </View>
  );
};

export default Login;
