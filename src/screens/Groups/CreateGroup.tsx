import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface CreateGroupProps {}

const CreateGroup = ({}: CreateGroupProps) => {
  return (
    <View style={styles.container}>
      <Text>CreateGroup </Text>
    </View>
  );
};

export default CreateGroup;

const styles = StyleSheet.create({
  container: {},
});
