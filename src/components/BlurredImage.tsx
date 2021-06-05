import React, { useRef } from 'react';
import { Animated, View, StyleSheet } from 'react-native';
import { Blurhash } from 'react-native-blurhash';

interface BlurredImageProps {
  uri: string | undefined;
  width: number;
  height: number;
}

const DEFAULT_BLURHASH = 'L7EWeA~p22,a0|ws$$J.0mla-ab{';

const BlurredImage = ({ uri, width, height }: BlurredImageProps) => {
  const blurhashOpacity = useRef(new Animated.Value(1)).current;
  const imageOpacity = useRef(new Animated.Value(0)).current;

  const fadeOut = () => {
    Animated.timing(blurhashOpacity, {
      toValue: 0,
      duration: 700,
      useNativeDriver: true,
    }).start();
  };

  const fadeIn = () => {
    Animated.timing(imageOpacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const onLoad = () => {
    fadeOut();
    fadeIn();
  };

  return (
    <View>
      <View>
        <Animated.View
          style={[
            {
              opacity: blurhashOpacity,
            },
          ]}>
          <Blurhash
            blurhash={DEFAULT_BLURHASH}
            resizeMode="cover"
            style={[
              StyleSheet.absoluteFillObject,
              {
                justifyContent: 'center',
                alignItems: 'center',
                width: width,
                height: height,
                aspectRatio: width / height,
              },
            ]}
          />
        </Animated.View>
      </View>
      <Animated.Image
        onLoad={onLoad}
        style={[
          {
            width: width,
            height: height,
            aspectRatio: width / height,
            resizeMode: 'cover',
          },
          {
            opacity: imageOpacity,
          },
        ]}
        source={{ uri }}
      />
    </View>
  );
};

export default BlurredImage;
