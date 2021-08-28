import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  Animated,
  View,
  ViewStyle,
  TextInputSubmitEditingEventData,
  NativeSyntheticEvent,
	Keyboard,
} from 'react-native';
import {
  CodeField,
  Cursor,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import { BORDER_RADIUS, colors } from '../../../components/Theme';

const { Value, Text: AnimatedText } = Animated;
export const CELL_SIZE = 52;

interface CodeInputProps {
  value: string;
  onChangeText: (e: string) => void;
  onSubmitEditing: (
    e: NativeSyntheticEvent<TextInputSubmitEditingEventData>,
  ) => void;
  style: ViewStyle;
  focused: boolean;
  testID?: string;
}

const CodeInput = ({
  value,
  onChangeText,
  style,
  onSubmitEditing,
  focused,
  testID,
}: CodeInputProps) => {
  const ref = useRef<any>();
  const setValue = onChangeText;
  const CELL_COUNT = 6;

  const getCellOnLayoutHandler = useClearByFocusCell({
    value,
    setValue,
  })[1];
  const animationsColor = [...new Array(CELL_COUNT)].map(() => new Value(0));
  const animationsScale = [...new Array(CELL_COUNT)].map(() => new Value(1));
  const animateCell = ({
    hasValue,
    index,
    isFocused,
  }: {
    hasValue: boolean;
    index: number;
    isFocused: boolean;
  }) => {
    Animated.parallel([
      Animated.timing(animationsColor[index], {
        useNativeDriver: false,
        toValue: isFocused ? 1 : 0,
        duration: 250,
      }),
      Animated.spring(animationsScale[index], {
        useNativeDriver: false,
        toValue: hasValue ? 0 : 1,
      }),
    ]).start();
  };

  const renderCell = ({
    index,
    symbol,
    isFocused,
  }: {
    index: number;
    symbol: string;
    isFocused: boolean;
  }) => {
    const hasValue = Boolean(symbol);
    const animatedCellStyle = {
      // Add color to the border of a cell with a value in it
      borderColor: hasValue ? colors.primary : '',
      borderWidth: hasValue ? 2 : 0,
    };

    setTimeout(() => {
      animateCell({ hasValue, index, isFocused });
    }, 0);

    return (
      <View
        key={index}
        onLayout={getCellOnLayoutHandler(index)}
        style={[styles.cellWrapper, animatedCellStyle]}>
        <AnimatedText style={styles.cellText}>
          {symbol || (isFocused ? <Cursor /> : null)}
        </AnimatedText>
      </View>
    );
  };

  useEffect(() => {
    Keyboard.addListener('keyboardDidHide', () => {
      ref.current?.blur();
    });
  }, []);

  return (
    <CodeField
      ref={ref}
      value={value}
      accessibilityLabel="otp"
      {...{ testID }}
      autoFocus={focused}
      onChangeText={setValue}
      cellCount={CELL_COUNT}
      rootStyle={{ ...style, ...styles.codeFiledRoot }}
      textContentType="oneTimeCode"
      renderCell={renderCell}
      keyboardType="numeric"
      onSubmitEditing={onSubmitEditing}
    />
  );
};

const styles = StyleSheet.create({
  codeFiledRoot: {
    height: CELL_SIZE,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  cellWrapper: {
    marginHorizontal: 4,
    height: CELL_SIZE,
    width: CELL_SIZE,
    borderRadius: BORDER_RADIUS.small,
    borderWidth: 0.5,
    borderColor: colors.black,
    backgroundColor: colors.white,
    // IOS
    // shadowColor: `rgba(0, 0, 0, 0.19)`,
    // shadowOffset: {
    //   width: 0,
    //   height: 10,
    // },
    // shadowOpacity: 1,
    // shadowRadius: 20,
    // Android
    elevation: 3,
  },
  cellText: {
    lineHeight: CELL_SIZE - 5,
    fontSize: 23,
    textAlign: 'center',
    color: colors.primary,
    backgroundColor: 'transparent',
  },
});

export default CodeInput;
