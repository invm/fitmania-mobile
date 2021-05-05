import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export { width, height };

export const colors = {
  primary: '#0068ff',
  secondary: '#3ec21d',
  light: '#00acff',
  black: '#011627',
  white: '#fff',
  grey: '#ccc',
  error: 'rgba(255, 50, 50, 1)',
  info: 'rgba(50, 50, 255, 1)',
  success: 'rgba(50, 255, 50, 1)',
  dark: '#554E4E',
  darkGrey: '#A3A3A3',
  lightGrey: '#d3d3d3',
  nativeRippleColor: 'rgba(0,0,0,0.05)',
  overlay: 'rgba(0,0,0,0.3)',
};

export const PADDING = 16;

export const CONTENT_WIDTH = width - PADDING * 2;

export const BORDER_RADIUS = {
  small: 10,
  med: 20,
};
