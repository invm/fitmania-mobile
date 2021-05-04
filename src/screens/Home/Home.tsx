import React from 'react';
import { StyleSheet, View } from 'react-native';
import { HomeRoutes, StackNavigationProps } from '../../navigation';

const Home = ({}: StackNavigationProps<HomeRoutes, 'Home'>) => {
  return (
    <>
      <View style={styles.wrapper}></View>
    </>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#fff',
    flex: 1,
  },
});

export default Home;
