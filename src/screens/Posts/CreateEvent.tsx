import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface CreateEventProps {}

const CreateEvent = ({}: CreateEventProps) => {
  return (
    <View style={styles.container}>
      <Text>CreateEvent </Text>
    </View>
  );
};

export default CreateEvent;

const styles = StyleSheet.create({
  container: {},
});
