import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from '../../components';
import { HomeRoutes, StackNavigationProps } from '../../navigation';

const Home = ({}: StackNavigationProps<HomeRoutes, 'Home'>) => {
  return (
    <>
      <View style={styles.wrapper}>
        <Text variant="semibold16">Home</Text>
      </View>
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
