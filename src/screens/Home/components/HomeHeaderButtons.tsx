import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, colors, PADDING, Text } from '../../../components';
import { HomeRoutes } from '../../../navigation';

interface HomeHeaderButtonsProps {
  navigation: StackNavigationProp<HomeRoutes, 'Home'>;
}

const HomeHeaderButtons = ({ navigation }: HomeHeaderButtonsProps) => {
  return (
    <View style={styles.buttonsContainer}>
      <Button
        onPress={() => {
          navigation.navigate('CreatePost');
        }}
        width={'45%'}
        style={{ paddingVertical: PADDING / 2 }}>
        <Text variant="semibold16" color={colors.white}>
          Create Post
        </Text>
      </Button>
      <Button
        onPress={() => {
          navigation.navigate('CreateEvent');
        }}
        width={'45%'}
        variant="secondary"
        style={{ paddingVertical: PADDING / 2 }}>
        <Text variant="semibold16" color={colors.white}>
          Create Event
        </Text>
      </Button>
    </View>
  );
};

export default HomeHeaderButtons;

const styles = StyleSheet.create({
  buttonsContainer: {
    paddingVertical: PADDING / 2,
    paddingHorizontal: PADDING,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
