import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { BORDER_RADIUS, colors, PADDING } from './Theme';

const styles = StyleSheet.create({
  card: {
    padding: PADDING,
    borderRadius: BORDER_RADIUS.small,
    backgroundColor: colors.white,
    shadowColor: colors.dark,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.22,
    shadowRadius: 5.22,
    elevation: 4,
  },
});
interface CardProps {
  children: any;
  style?: ViewStyle | ViewStyle[];
}

const Card = ({ children, style }: CardProps) => {
  return <View style={[styles.card, style]}>{children}</View>;
};

export default Card;
