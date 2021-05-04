import React from 'react';
import { Text, View } from 'react-native';

const Register = (): JSX.Element => {
  return (
    <View style={{ flex: 1 }}>
      <Text>Register Page</Text>
      <Text testID="Welcome">Welcome test</Text>
    </View>
  );
};

export default Register;
