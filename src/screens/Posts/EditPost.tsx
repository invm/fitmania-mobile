import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface EditPostProps {}

const EditPost = ({}: EditPostProps) => {
  return (
    <View style={styles.container}>
      <Text>EditPost </Text>
    </View>
  );
};

export default EditPost;

const styles = StyleSheet.create({
  container: {},
});
