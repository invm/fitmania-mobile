import React from 'react';
import { TouchableOpacity } from 'react-native';

/**
 * This component serves as a container for items of lists that are touchable
 */

const Touchable = ({ style, children, onPress, ...rest }: any) => {
  return (
    <TouchableOpacity {...{ ...rest, onPress, style }} style={[style]}>
      {children}
    </TouchableOpacity>
  );
};

export default Touchable;
