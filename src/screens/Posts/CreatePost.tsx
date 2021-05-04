import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface CreatePostProps {}

const CreatePost = ({}: CreatePostProps) => {
  return (
    <View style={styles.container}>
      <Text>CreatePost </Text>
    </View>
  );
};

export default CreatePost;

const styles = StyleSheet.create({
  container: {},
});
