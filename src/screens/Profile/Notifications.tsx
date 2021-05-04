import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface NotificationsProps {}

const Notifications = ({}: NotificationsProps) => {
  return (
    <View style={styles.container}>
      <Text>Notifications </Text>
    </View>
  );
};

export default Notifications;

const styles = StyleSheet.create({
 container: {  },
});
