import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface FriendRequestsProps {}

const FriendRequests = ({}: FriendRequestsProps) => {
  return (
    <View style={styles.container}>
      <Text>FriendRequests </Text>
    </View>
  );
};

export default FriendRequests;

const styles = StyleSheet.create({
  container: {},
});
