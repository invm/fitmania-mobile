import React from 'react';
import {
  View,
  StyleSheet,
  Image,
  I18nManager,
  ActivityIndicator,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { AuthRoutes, StackNavigationProps } from '../../navigation';
import { Text, Button, FocusAwareStatusBar } from '../../components/';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const assets = [
  require('../../../assets/images/welcome1.jpg'),
  require('../../../assets/images/welcome2.jpg'),
  require('../../../assets/images/welcome3.jpg'),
  require('../../../assets/images/welcome4.jpg'),
  require('../../../assets/images/welcome5.jpg'),
];
import {
  colors,
  CONTENT_WIDTH,
  PADDING,
  width,
  height,
} from '../../components/Theme';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux';

const Welcome = ({
  navigation,
}: StackNavigationProps<AuthRoutes, 'Welcome'>) => {
  const { t } = useTranslation();
  const { bottom } = useSafeAreaInsets();
  const { verifyingSession, loading } = useSelector(
    (state: typeof RootState) => state.user,
  );

  return (
    <>
      <FocusAwareStatusBar
        backgroundColor={'transparent'}
        translucent
        barStyle="dark-content"
      />
      <Image
        source={assets[Math.floor(Math.random() * 5)]}
        style={styles.heroImage}
      />
      <View style={styles.heroImageOverlay} />
      {verifyingSession || loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      ) : (
        <>
          <View style={{ flex: 1, backgroundColor: 'transparent' }}>
            <View style={styles.textContainer}>
              <View style={styles.sloganText}>
                <Text
                  variant="bold24"
                  align="center"
                  lines={2}
                  color={colors.white}
                  style={{ marginTop: 25, fontSize: 50, lineHeight: 60 }}>
                  {t('welcome_screen.header')}
                </Text>
                <Text
                  variant="semibold20"
                  align="center"
                  color={colors.white}
                  style={{ marginTop: 25 }}>
                  {t('welcome_screen.slogan')}
                </Text>
              </View>
            </View>
            <View
              style={[
                styles.buttonsContainer,
                { paddingBottom: bottom + 100 },
              ]}>
              <View style={styles.buttonsInnerContainer}>
                <Button
                  testID="login_button"
                  variant="secondary"
                  onPress={() => navigation.navigate('Login')}>
                  <Text variant="semibold16" color={colors.white}>
                    {t('welcome_screen.sign_in')}
                  </Text>
                </Button>
                <Button
                  testID="register_button"
                  onPress={() => navigation.navigate('Register')}>
                  <Text variant="semibold16" color={colors.white}>
                    {t('welcome_screen.create_account')}
                  </Text>
                </Button>
              </View>
            </View>
          </View>
        </>
      )}
    </>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  sloganText: {},
  textContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 70,
  },
  heroImageOverlay: {
    resizeMode: 'cover',
    position: 'absolute',
    backgroundColor: colors.overlay,
    width: width + 50,
    height: height + 50,
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
  },
  heroImage: {
    resizeMode: 'cover',
    position: 'absolute',
    width,
    height: height + 50,
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
  },
  buttonsContainer: {
    alignItems: 'center',
  },
  buttonsInnerContainer: {
    height: 120,
    justifyContent: 'space-between',
  },
  header: {
    width: CONTENT_WIDTH,
    marginHorizontal: PADDING,
    height: 50,
    marginTop: 35,
    flexDirection: 'row',
    justifyContent: I18nManager.isRTL ? 'flex-start' : 'flex-end',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
});
