import React from 'react';
import { BORDER_RADIUS, colors, PADDING } from '../components/Theme';
import { View, StyleSheet } from 'react-native';
import { Text } from '../components';

export const toastConfig = {
  success: (props: any) => (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <View style={[styles.row]}>
          <Text style={styles.emojiContainer}>👍</Text>
        </View>
        <View style={styles.dataContainer}>
          <View style={styles.textContainer}>
            <View style={styles.text}>
              <Text align="left" variant="regular16">
                {props.text1}
              </Text>
            </View>
            <View style={styles.text}>
              <Text align="left" variant="regular16" lines={2}>
                {props.text2}
              </Text>
            </View>
          </View>
          <View style={[styles.line, { backgroundColor: colors.success }]} />
        </View>
      </View>
    </View>
  ),
  error: (props: any) => (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <View style={[styles.row]}>
          <Text style={styles.emojiContainer}>🤷‍♂️</Text>
        </View>
        <View style={styles.dataContainer}>
          <View style={styles.textContainer}>
            <View style={styles.text}>
              <Text align="left" variant="regular16">
                {props.text1}
              </Text>
            </View>
            <View style={styles.text}>
              <Text align="left" variant="regular16" lines={2}>
                {props.text2}
              </Text>
            </View>
          </View>
          <View style={[styles.line, { backgroundColor: colors.error }]} />
        </View>
      </View>
    </View>
  ),
  info: (props: any) => (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <View style={[styles.row]}>
          <Text style={styles.emojiContainer}>❗</Text>
        </View>
        <View style={styles.dataContainer}>
          <View style={styles.textContainer}>
            <View style={styles.text}>
              <Text align="left" variant="regular16">
                {props.text1}
              </Text>
            </View>
            <View style={styles.text}>
              <Text align="left" variant="regular16" lines={2}>
                {props.text2}
              </Text>
            </View>
          </View>
          <View style={[styles.line, { backgroundColor: colors.info }]} />
        </View>
      </View>
    </View>
  ),
};

const styles = StyleSheet.create({
  container: {
    height: 80,
    width: '90%',
    backgroundColor: colors.white,
    borderRadius: BORDER_RADIUS.small,
    borderWidth: 0.5,
    borderColor: colors.grey,
    overflow: 'hidden',
  },
  innerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  row: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 80,
    width: 80,
    borderTopStartRadius: BORDER_RADIUS.small,
    borderBottomStartRadius: BORDER_RADIUS.small,
  },
  line: {
    height: 80,
    width: 6,
    borderTopEndRadius: BORDER_RADIUS.small,
    borderBottomEndRadius: BORDER_RADIUS.small,
  },
  emojiContainer: { fontSize: 30, lineHeight: 50 },
  dataContainer: { flexDirection: 'row', flex: 1 },
  textContainer: { flex: 1, justifyContent: 'center' },
  text: { flexDirection: 'row', paddingHorizontal: PADDING },
});
