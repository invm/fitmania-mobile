import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface PostScreenProps {}

const PostScreen = ({}: PostScreenProps) => {
  return (
    <View style={styles.container}>
      <Text>PostScreen </Text>
    </View>
  );
};

export default PostScreen;

const styles = StyleSheet.create({
  container: {},
});
