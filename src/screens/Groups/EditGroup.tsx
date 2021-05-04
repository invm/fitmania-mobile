import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface EditGroupProps {}

const EditGroup = ({}: EditGroupProps) => {
  return (
    <View style={styles.container}>
      <Text>EditGroup </Text>
    </View>
  );
};

export default EditGroup;

const styles = StyleSheet.create({
  container: {},
});
