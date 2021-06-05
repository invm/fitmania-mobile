import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';

import { PADDING, width as wWidth } from './Theme';

import { BORDER_RADIUS, colors } from './Theme';
import Touchable from './Touchable';

type ButtonProps = {
  variant?: 'primary' | 'white' | 'transparent' | 'bordered' | 'secondary';
  props?: any | any[];
  children?: React.ReactElement | string;
  testID?: string;
  style?: ViewStyle;
  disabled?: boolean;
  onPress: () => void;
  width?: number | string;
};

const Button = ({
  variant,
  props,
  children,
  style,
  onPress,
  disabled,
  width,
  testID,
}: ButtonProps) => {
  let buttonStyle;
  switch (variant) {
    default:
      buttonStyle = buttonStyles[variant || 'primary'];
      break;
  }
  return (
    <Touchable
      style={[
        buttonStyles.button,
        buttonStyle,
        style,
        { opacity: disabled ? 0.6 : 1, width: width || wWidth - PADDING * 2 },
      ]}
      {...{ props, onPress, disabled, testID }}>
      {children}
    </Touchable>
  );
};

export default Button;

const shadow = {
  shadowColor: '#ccc',
  shadowOffset: {
    width: 0,
    height: 3,
  },
  shadowOpacity: 0.29,
  shadowRadius: 4.65,
  elevation: 1,
};

const buttonStyles = StyleSheet.create({
  button: {
    padding: PADDING,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primary: {
    backgroundColor: colors.primary,
    borderRadius: BORDER_RADIUS.small,
    ...shadow,
  },
  secondary: {
    backgroundColor: colors.secondary,
    borderRadius: BORDER_RADIUS.small,
    ...shadow,
  },
  transparent: {
    backgroundColor: colors.white,
    borderRadius: BORDER_RADIUS.small,
  },
  white: {
    backgroundColor: colors.white,
    borderColor: colors.primary,
    borderWidth: 2,
    borderRadius: BORDER_RADIUS.small,
    ...shadow,
  },
  bordered: {
    backgroundColor: colors.white,
    borderColor: colors.darkGrey,
    borderWidth: 2,
    borderRadius: BORDER_RADIUS.small,
    ...shadow,
  },
});
