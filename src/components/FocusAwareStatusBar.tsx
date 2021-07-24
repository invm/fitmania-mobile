import * as React from 'react';
import { StatusBar } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { colors } from './Theme';

interface FocusAwareStatusBar {
  barStyle?: 'default' | 'light-content' | 'dark-content';
  backgroundColor?: string;
  translucent?: boolean;
}

function FocusAwareStatusBar({
  backgroundColor = colors.white,
  ...props
}: FocusAwareStatusBar) {
  const isFocused = useIsFocused();

  return isFocused ? <StatusBar {...{ backgroundColor }} {...props} /> : null;
}

export default FocusAwareStatusBar;
