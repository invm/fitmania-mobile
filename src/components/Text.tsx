import { TFunctionResult } from 'i18next';
import React from 'react';
import { StyleSheet, Text as RNText, TextStyle } from 'react-native';
import { colors } from './Theme';

type TextProps = {
  variant?: 'default' | 'error' | 'regular16';
  props?: any | any[];
  children?: React.ReactElement | string | string[] | number | TFunctionResult;
  testID?: string;
  style?: TextStyle;
  color?: string;
  key?: string | number;
  align?: 'center' | 'right' | 'left';
  lines?: number;
  onPress?: () => void;
  ellipsizeMode?: 'head' | 'middle' | 'tail' | 'clip';
};

const Text = ({
  variant,
  props,
  children,
  style,
  onPress,
  align,
  lines,
  color,
  ellipsizeMode,
}: TextProps) => {
  let textStyle = textStyles?.[variant || 'default'];
  return (
    <RNText
      numberOfLines={lines}
      style={[
        textStyle,
        style,
        {
          textAlign: align,
          color: color
            ? color
            : textStyle.color
            ? textStyle.color
            : colors.black,
        },
      ]}
      {...{ props, onPress, ellipsizeMode }}>
      {children}
    </RNText>
  );
};

export default Text;

const black = { color: colors.black };

export const sizes = {
  14: {
    fontSize: 14,
    lineHeight: 18,
  },
  16: {
    fontSize: 16,
    lineHeight: 22,
  },
  18: {
    fontSize: 18,
    lineHeight: 23,
  },
  20: {
    fontSize: 20,
    lineHeight: 26,
  },
};

export const font = {
  Ayuthaya: {
    regular: {
      fontFamily: 'Ayuthaya',
    },
  },
};

const textStyles = StyleSheet.create({
  default: {
    ...sizes[18],
    ...black,
    ...font.Ayuthaya.regular,
  },
  error: {
    ...font.Ayuthaya.regular,
    ...sizes[16],
    color: colors.error,
  },
  regular16: {
    ...font.Ayuthaya.regular,
    ...sizes[16],
    color: colors.black,
  },
});
