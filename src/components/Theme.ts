import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export { width, height };

export const colors = {
  black: '#000',
  white: '#fff',
  grey: '#ccc',
  error: 'rgba(255, 50, 50, 1)',
  info: 'rgba(50, 50, 255, 1)',
  success: 'rgba(50, 255, 50, 1)',
};

export const PADDING = 16;

export const BORDER_RADIUS = {
  small: 10,
  med: 20,
};
