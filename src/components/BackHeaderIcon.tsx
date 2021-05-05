import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { I18nManager, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from './Icon';
import { colors } from './Theme';

const BackHeaderIcon = () => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => (navigation.canGoBack() ? navigation.goBack() : {})}
      style={styles.container}>
      <Icon
        name={`arrow-${I18nManager.isRTL ? 'forward' : 'back'}`}
        color={colors.dark}
      />
    </TouchableOpacity>
  );
};
export default BackHeaderIcon;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    backgroundColor: colors.white,
    borderRadius: 40,
    width: 40,
    height: 40,
  },
});
