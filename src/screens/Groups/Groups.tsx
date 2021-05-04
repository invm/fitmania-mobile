import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface GroupsProps {}

const Groups = ({}: GroupsProps) => {
  return (
    <View style={styles.container}>
      <Text>Groups </Text>
    </View>
  );
};

export default Groups;

const styles = StyleSheet.create({
  container: {},
});
