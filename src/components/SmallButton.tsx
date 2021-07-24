import React from 'react';
import { GestureResponderEvent } from 'react-native';
import { colors } from '.';
import Text from './Text';
import Icon from 'react-native-vector-icons/Ionicons';
import Touchable from './Touchable';

interface SmallButtonProps {
  onPress: (event: GestureResponderEvent) => void;
  color?: 'transparent' | 'dark' | 'light' | 'secondary' | undefined;
  title?: string;
  icon?: string;
  style?: any;
}

const SmallButton = ({
  onPress,
  color,
  title,
  icon,
  style,
}: SmallButtonProps) => {
  let textColor;
  let buttonColor;
  let buttonBorderColor;

  switch (color) {
    case 'transparent':
      textColor = colors.primary;
      buttonBorderColor = colors.primary;
      break;
    case 'dark':
      textColor = colors.dark;
      buttonBorderColor = colors.dark;
      break;
    case 'light':
      textColor = colors.light;
      buttonBorderColor = colors.light;
      break;
    case 'secondary':
      textColor = colors.secondary;
      buttonBorderColor = colors.secondary;
      break;
    default:
      textColor = colors.white;
      buttonColor = colors.primary;
      buttonBorderColor = colors.primary;
  }

  return (
    <Touchable
      {...{ onPress }}
      style={[
        {
          paddingVertical: 8,
          paddingHorizontal: 8,
          backgroundColor: buttonColor,
          borderColor: buttonBorderColor,
          borderRadius: 10,
          borderWidth: 1,
          flexDirection: 'row',
          alignItems: 'center',
        },
        style,
      ]}>
      {icon && <Icon name={icon} size={14} color={textColor} />}
      {title && (
        <Text variant="semibold16" color={textColor}>
          {title}
        </Text>
      )}
    </Touchable>
  );
};

export default SmallButton;
