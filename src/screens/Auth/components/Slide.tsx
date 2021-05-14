import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text } from '../../../components';
import { colors, height, width } from '../../../components/Theme';

type SlideProps = {
  slide: {
    title: string;
    subtext: string;
    image: {
      width: number;
      height: number;
      uri: number;
    };
  };
};

const Slide = ({
  slide: {
    title,
    subtext,
    image: { uri, width, height },
  },
}: SlideProps) => {
  return (
    <View style={styles.slide}>
      <View style={styles.innerSlide}>
        <Image
          source={uri}
          style={{
            borderRadius: width / 2,
            width: width,
            height: height,
            aspectRatio: width / height,
          }}
        />
        <View style={styles.text}>
          <Text
            align="center"
            style={styles.header}
            lines={2}
            color={colors.primary}
            variant="bold24">
            {title}
          </Text>
          <Text
            align="center"
            variant="semibold20"
            color={colors.primary}
            lines={2}>
            {subtext}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default Slide;

const styles = StyleSheet.create({
  innerSlide: {
    width: width,
    height: height * 0.6,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  slide: {
    flex: 1,
    width: width,
    justifyContent: 'center',
  },
  text: {
    paddingHorizontal: 20,
  },
  header: {
    marginTop: 70,
    marginBottom: 20,
  },
});
