import React, { ReactElement } from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Props {
  children: any | any[];
}

const ScreenWrapper = ({ children }: Props): ReactElement => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      {Platform.OS === 'ios' ? (
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          keyboardVerticalOffset={80}
          behavior="padding">
          {children}
        </KeyboardAvoidingView>
      ) : (
        <>{children}</>
      )}
    </SafeAreaView>
  );
};

export default ScreenWrapper;
