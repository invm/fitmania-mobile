import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface ProfileProps {}

const Profile = ({}: ProfileProps) => {
  return (
    <View style={styles.container}>
      <Text>Profile </Text>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
 container: {  },
});
