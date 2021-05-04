import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface FriendsProps {}

const Friends = ({}: FriendsProps) => {
  return (
    <View style={styles.container}>
      <Text>Friends </Text>
    </View>
  );
};

export default Friends;

const styles = StyleSheet.create({
  container: {},
});
