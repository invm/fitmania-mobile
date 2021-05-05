import { TFunctionResult } from 'i18next';
import React from 'react';
import { StyleSheet, Text as RNText, TextStyle } from 'react-native';
import { colors } from './Theme';

type TextProps = {
  variant?:
    | 'default'
    | 'error'
    | 'welcomeHeader'
    | 'smallRegular'
    | 'white'
    | 'semi14'
    | 'semi16'
    | 'semi18'
    | 'semi20'
    | 'regular16'
    | 'headerTitle'
    | 'welcomeSubtext'
    | 'smallBold'
    | 'bold16'
    | 'bold18'
    | 'bold20'
    | 'bottomTabLabel'
    | 'title'
    | 'link';
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
            : colors.dark,
        },
      ]}
      {...{ props, onPress, ellipsizeMode }}>
      {children}
    </RNText>
  );
};

export default Text;

const dark = { color: colors.dark };

export const sizes = {
  small: {
    fontSize: 14,
    lineHeight: 18,
  },
  medium18: {
    fontSize: 18,
    lineHeight: 23,
  },
  large: {
    fontSize: 20,
    lineHeight: 26,
  },
  regular16: {
    fontSize: 16,
    lineHeight: 22,
  },
};

export const font = {
  assistant: {
    regular: {
      fontFamily: 'Assistant-Regular',
    },
    semi: {
      fontFamily: 'Assistant-SemiBold',
    },
    bold: {
      fontFamily: 'Assistant-Bold',
    },
  },
  ubuntu: {
    light: {
      fontFamily: 'Ubuntu-Light',
    },
    bold: {
      fontFamily: 'Ubuntu-Bold',
    },
  },
};

const textStyles = StyleSheet.create({
  default: {
    ...sizes.medium18,
    ...dark,
    ...font.assistant.regular,
  },
  welcomeHeader: {
    fontSize: 26,
    lineHeight: 39,
    ...dark,
    ...font.ubuntu.bold,
  },
  welcomeSubtext: {
    fontSize: 20,
    lineHeight: 24,
    ...dark,
    ...font.ubuntu.light,
  },
  error: {
    ...font.assistant.regular,
    ...sizes.small,
    color: colors.error,
  },
  white: {
    ...font.assistant.semi,
    ...sizes.medium18,
    color: colors.white,
  },
  semi14: {
    ...font.assistant.semi,
    ...sizes.small,
    ...dark,
  },
  semi16: {
    ...font.assistant.semi,
    ...sizes.regular16,
    ...dark,
  },
  semi18: {
    ...font.assistant.semi,
    ...sizes.medium18,
    ...dark,
  },
  semi20: {
    ...font.assistant.semi,
    ...sizes.large,
    ...dark,
  },
  smallBold: {
    ...font.assistant.bold,
    ...sizes.small,
    ...dark,
  },
  bold16: {
    ...font.assistant.bold,
    ...sizes.regular16,
    ...dark,
  },
  bold18: {
    ...font.assistant.bold,
    ...sizes.medium18,
    ...dark,
  },
  bold20: {
    ...font.assistant.bold,
    fontSize: 20,
    lineHeight: 24,
    ...dark,
  },
  smallRegular: {
    ...font.assistant.regular,
    ...sizes.small,
    ...dark,
  },
  regular16: {
    ...font.assistant.regular,
    ...sizes.regular16,
    color: colors.dark,
  },
  link: {
    ...font.assistant.bold,
    ...sizes.small,
    textDecorationLine: 'underline',
    ...dark,
  },
  headerTitle: {
    ...font.assistant.bold,
    fontSize: 26,
    lineHeight: 34,
    ...dark,
  },
  bottomTabLabel: {
    ...font.assistant.regular,
    fontSize: 12,
    lineHeight: 15,
    color: colors.dark,
  },
  title: {
    fontSize: 32,
    lineHeight: 42,
    ...font.assistant.bold,
    ...dark,
  },
});
