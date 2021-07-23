import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from './Theme';

interface CheckboxProps {
  selected: boolean;
  onPress: (string: any) => void; // id of selected item
}

const Checkbox = ({ selected, onPress }: CheckboxProps) => {
  return (
    <TouchableOpacity
      style={[
        styles.circle,
        {
          backgroundColor: selected ? colors.primary : colors.white,
          borderColor: selected ? colors.primary : colors.lightGrey,
        },
      ]}
      onPress={() => onPress(!selected)}>
      <Icon size={14} name="checkmark" color={colors.white} />
    </TouchableOpacity>
  );
};

export default Checkbox;

const styles = StyleSheet.create({
  circle: {
    width: 20,
    height: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.lightGrey,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
