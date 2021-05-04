import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface SearchProps {}

const Search = ({}: SearchProps) => {
  return (
    <View style={styles.container}>
      <Text>Search </Text>
    </View>
  );
};

export default Search;

const styles = StyleSheet.create({
  container: {},
});
