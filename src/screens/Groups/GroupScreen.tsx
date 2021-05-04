import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface GroupScreenProps {}

const GroupScreen = ({}: GroupScreenProps) => {
  return (
    <View style={styles.container}>
      <Text>GroupScreen </Text>
    </View>
  );
};

export default GroupScreen;

const styles = StyleSheet.create({
  container: {},
});
