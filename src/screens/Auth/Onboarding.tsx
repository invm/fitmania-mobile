import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  I18nManager,
  Animated,
  FlatList,
  Keyboard,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { AuthRoutes, StackNavigationProps } from '../../navigation';
import { FocusAwareStatusBar, Text } from '../../components/';
import { SafeAreaView } from 'react-native-safe-area-context';
import Slide from './components/Slide';
import { BORDER_RADIUS, colors, height, width } from '../../components/Theme';
import Icon from '../../components/Icon';

export const assets = [
  require('../../../assets/images/onboarding1.png'),
  require('../../../assets/images/onboarding2.png'),
  require('../../../assets/images/onboarding3.png'),
];

const Onboarding = ({
  navigation,
}: StackNavigationProps<AuthRoutes, 'Onboarding'>) => {
  const { t } = useTranslation();
  const flatListRef = useRef<FlatList>(null);
  let scrollX = new Animated.Value(0);
  let position = Animated.divide(scrollX, width);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    navigation.addListener('beforeRemove', (e) => {
      // Prevent default behavior of leaving the screen
      if (e.data.action.type === 'GO_BACK') {
        e.preventDefault();
      }
    });
    Keyboard.dismiss();
    return () => {
      navigation.removeListener('beforeRemove', () => {});
    };
  }, [navigation]);

  useEffect(() => {
    scrollX.addListener(({ value }) => {
      return setIndex(Math.round(value / width));
    });
    return () => {
      scrollX.removeAllListeners();
    };
  }, []);

  const slides = [
    {
      title: t('onboarding.first.title'),
      subtext: t('onboarding.first.subtext'),
      image: {
        width: width * 0.9,
        height: width * 0.9,
        uri: assets[0],
      },
    },
    {
      title: t('onboarding.second.title'),
      subtext: t('onboarding.second.subtext'),
      image: {
        width: width * 0.9,
        height: width * 0.9, // original image aspect ratio
        uri: assets[1],
      },
    },
    {
      title: t('onboarding.third.title'),
      subtext: t('onboarding.third.subtext'),
      image: {
        width: width * 0.9,
        height: width * 0.9,
        uri: assets[2],
      },
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1 }}>
        <FocusAwareStatusBar
        barStyle="dark-content"
        backgroundColor={colors.white}
      />
      <View>
        <FlatList
          snapToInterval={width}
          decelerationRate="fast"
          horizontal
          pagingEnabled
          scrollEnabled
          data={slides}
          ref={flatListRef}
          keyExtractor={(_, index) => `${index}`}
          renderItem={({ item }) => {
            return <Slide slide={item} />;
          }}
          showsHorizontalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            {
              useNativeDriver: false,
            },
          )}
          style={styles.slider}
        />

        <View style={styles.navigationContainer}>
          <View style={styles.navigation}>
            {index < slides?.length - 1 ? (
              <TouchableOpacity
                style={{ width: 50 }}
                onPress={() => navigation.navigate('CreateProfile')}>
                <Text variant="semi18" color={colors.primary}>
                  {t('common.skip')}
                </Text>
              </TouchableOpacity>
            ) : (
              <View style={{ width: 50 }}></View>
            )}
            <View style={styles.dots}>
              {slides.map((_, i) => {
                let opacity = position.interpolate({
                  inputRange: [i - 1, i, i + 1],
                  outputRange: [0.5, 1, 0.5],
                  extrapolate: 'clamp',
                });
                let backgroundColor = position.interpolate({
                  inputRange: [i - 1, i, i + 1],
                  outputRange: ['grey', 'red', 'grey'],
                  extrapolate: 'clamp',
                });
                return (
                  <Animated.View
                    key={i}
                    style={[
                      {
                        height: 10,
                        width: 10,
                        margin: 8,
                        borderRadius: BORDER_RADIUS.small,
                      },
                      { opacity, backgroundColor },
                    ]}
                  />
                );
              })}
            </View>
            <TouchableOpacity
              onPress={() => {
                if (!I18nManager.isRTL && index < slides?.length - 1) {
                  flatListRef.current?.scrollToIndex({
                    animated: true,
                    index: index + 1,
                  });
                  setIndex(index + 1);
                } else if (I18nManager.isRTL && index < slides?.length - 1) {
                  const trueIndex =
                    slides?.length - index - 1 > 0
                      ? slides?.length - index - 1
                      : 1; // Snap carousel module doesn't really support RTL so we employ this hack.. (The inner sorting is reversed)
                  flatListRef.current?.scrollToIndex({
                    animated: true,
                    index: trueIndex - 1,
                  });
                  setIndex(trueIndex);
                } else if (index == slides?.length - 1) {
                  navigation.navigate('CreateProfile');
                }
              }}
              style={styles.roundButton}>
              <Icon
                name={`arrow-${I18nManager.isRTL ? 'back' : 'forward'}`}
                color={colors.white}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Onboarding;

const styles = StyleSheet.create({
  dots: {
    flexDirection: 'row',
  },
  roundButton: {
    height: 50,
    width: 50,
    borderRadius: 50,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slider: {
    width: width,
    height: height * 0.85,
  },
  navigationContainer: {
    width: width,
    height: height * 0.15,
    alignItems: 'center',
  },
  navigation: {
    width: width * 0.8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
