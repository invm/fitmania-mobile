import React from 'react';
import {
  StyleSheet,
  TextInput,
  NativeSyntheticEvent,
  TextInputFocusEventData,
  TextStyle,
} from 'react-native';
import { colors } from './Theme';

const styles = StyleSheet.create({
  input: {
    borderColor: colors.light,
    borderWidth: 1,
    borderRadius: 8,
    padding: 4,
    height: 50,
    color: colors.black,
    textAlign: 'left',
  },
});

interface InputProps {
  onChangeText: (e: string) => void;
  value: string;
  placeholder?: string;
  [key: string]: any;
  onBlur?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  returnKeyType?:
    | 'done'
    | 'go'
    | 'next'
    | 'search'
    | 'send'
    | 'none'
    | 'previous'
    | 'default'
    | 'google'
    | 'join'
    | 'route'
    | 'yahoo'
    | 'emergency-call'
    | undefined;
  touched?: boolean | undefined;
  valid?: boolean;
  error?: any;
  maxLength?: number;
  style?: TextStyle;
  testID?: string;
  accessibilityLabel?: string;
  multiline?: boolean;
  autoFocus?: boolean;
  keyboardType?:
    | 'default'
    | 'email-address'
    | 'numeric'
    | 'phone-pad'
    | 'number-pad'
    | 'decimal-pad'
    | 'visible-password'
    | 'ascii-capable'
    | 'numbers-and-punctuation'
    | 'url'
    | 'name-phone-pad'
    | 'twitter'
    | 'web-search'
    | undefined;
}

const Input = ({
  placeholder,
  onChangeText,
  maxLength,
  valid,
  touched,
  value,
  returnKeyType = 'go',
  onBlur,
  error,
  style,
  accessibilityLabel,
  testID,
  keyboardType,
  multiline,
  autoFocus,
}: InputProps) => {
  return (
    <TextInput
      placeholder={placeholder}
      placeholderTextColor={colors.darkGrey}
      {...{
        onChangeText,
        value,
        returnKeyType,
        onBlur,
        maxLength,
        valid,
        touched,
        error,
        accessibilityLabel,
        testID,
        multiline,
        keyboardType,
        autoFocus,
      }}
      selectionColor={colors.primary}
      caretHidden={false}
      style={[styles.input, style, {}]}
    />
  );
};

export default Input;
