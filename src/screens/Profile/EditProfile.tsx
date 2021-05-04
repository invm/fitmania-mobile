import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface EditProfileProps {}

const EditProfile = ({}: EditProfileProps) => {
  return (
    <View style={styles.container}>
      <Text>EditProfile </Text>
    </View>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: {},
});
