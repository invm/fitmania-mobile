import { TFunctionResult } from 'i18next';
import React from 'react';
import { StyleSheet, Text as RNText, TextStyle } from 'react-native';
import { colors } from './Theme';

type TextProps = {
  variant?:
    | 'regular14'
    | 'regular16'
    | 'medium12'
    | 'medium14'
    | 'medium16'
    | 'semibold14'
    | 'semibold16'
    | 'semibold20'
    | 'semibold22'
    | 'semibold24'
    | 'bold16'
    | 'bold24';
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
  variant = "regular16",
  props,
  children,
  style,
  onPress,
  align,
  lines = 1,
  color,
  ellipsizeMode,
}: TextProps) => {
  let textStyle = styles?.[variant];
  return (
    <RNText
      numberOfLines={lines}
      style={[
        textStyle,
        style,
        {
          textAlign: align,
          color: color ?? colors.black,
        },
      ]}
      {...{ props, onPress, ellipsizeMode }}>
      {children}
    </RNText>
  );
};

export default Text;

export const sizes = {
  12: {
    fontSize: 12,
    lineHeight: 16,
  },
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
    lineHeight: 24,
  },
  20: {
    fontSize: 20,
    lineHeight: 26,
  },
  22: {
    fontSize: 22,
    lineHeight: 28,
  },
  24: {
    fontSize: 24,
    lineHeight: 30,
  },
};

export const font = {
  Assistant: {
    regular: {
      fontFamily: 'Assistant-Regular',
    },
    bold: {
      fontFamily: 'Assistant-Bold',
    },
    semibold: {
      fontFamily: 'Assistant-SemiBold',
    },
    medium: {
      fontFamily: 'Assistant-Medium',
    },
  },
};

const textStyles = {
  regular14: {
    ...font.Assistant.regular,
    ...sizes[14],
  },
  regular16: {
    ...font.Assistant.regular,
    ...sizes[16],
  },
  medium12: {
    ...font.Assistant.medium,
    ...sizes[12],
  },
  medium14: {
    ...font.Assistant.medium,
    ...sizes[14],
  },
  medium16: {
    ...font.Assistant.medium,
    ...sizes[16],
  },
  semibold14: {
    ...font.Assistant.semibold,
    ...sizes[14],
  },
  semibold16: {
    ...font.Assistant.semibold,
    ...sizes[16],
  },
  semibold20: {
    ...font.Assistant.semibold,
    ...sizes[20],
  },
  semibold22: {
    ...font.Assistant.semibold,
    ...sizes[22],
  },
  semibold24: {
    ...font.Assistant.semibold,
    ...sizes[24],
  },
  bold16: {
    ...font.Assistant.bold,
    ...sizes[16],
  },
  bold24: {
    ...font.Assistant.bold,
    ...sizes[24],
  },
};

const styles = StyleSheet.create(textStyles);
