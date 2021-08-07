import React from 'react';
import { View } from 'react-native';
import { colors } from './Theme';

const ItemSeparatorComponent = () => (
  <View
    style={{
      height: 2,
      marginVertical: 10,
      borderRadius: 2,
      backgroundColor: colors.darkGrey,
    }}
  />
);

export default ItemSeparatorComponent;
