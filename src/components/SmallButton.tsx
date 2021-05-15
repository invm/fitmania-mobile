import React from 'react';
import { GestureResponderEvent, TouchableOpacity } from 'react-native';
import { colors } from '.';
import Text from './Text';
import Icon from 'react-native-vector-icons/Ionicons';

interface SmallButtonProps {
  onPress: (event: GestureResponderEvent) => void;
  color?: 'transparent' | 'dark' | undefined;
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
    default:
      textColor = colors.white;
      buttonColor = colors.primary;
      buttonBorderColor = colors.primary;
  }

  return (
    <TouchableOpacity
      {...{ onPress }}
      style={[
        {
          paddingVertical: 5,
          paddingHorizontal: 5,
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
    </TouchableOpacity>
  );
};

export default SmallButton;
