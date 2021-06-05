import React, { useEffect, useState } from 'react';
import {
  View,
  TouchableWithoutFeedback,
  I18nManager,
  Keyboard,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { AuthRoutes, StackNavigationProps } from '../../navigation';
import {
  Text,
  Button,
  FocusAwareStatusBar,
  ScreenWrapper,
} from '../../components';
import { useTranslation } from 'react-i18next';
import { colors, PADDING, width } from '../../components/Theme';
import CodeInput from './components/CodeInput';
import AppError from '../../utils/AppError';
import { login, sendOTPorLogin, verifyOTP } from '../../redux/actions';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/index';
import { useIsFocused } from '@react-navigation/native';
import { showMessage } from '../../utils/utils';

const OtpConfirmation = ({
  route,
  navigation,
}: StackNavigationProps<AuthRoutes, 'OtpConfirmation'>) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [OTPExpired, setOTPExpired] = useState(false);
  const [OTP, setOTP] = useState('');
  const [OTPValid, setOTPValid] = useState(false);
  const { email, otp } = route.params!;
  const dispatch = useDispatch();
  const focused = useIsFocused();

  const user = useSelector((state: typeof RootState) => state.user.user);
  const authenticated = useSelector(
    (state: typeof RootState) => state.user.authenticated,
  );

  useEffect(() => {
    if (focused) {
      if (authenticated && user?.profileLoaded && !user?.['profileCreated']) {
        Keyboard.dismiss();
        navigation.navigate('Onboarding');
      }
    }
  }, [user, authenticated]);

  useEffect(() => {
    otp && setOTP(otp);
  }, [otp]);

  const resendOTPHandler = async () => {
    setOTPExpired(false);
    await sendOTPorLogin({
      sendEmail: login,
      data: { email },
      setLoading,
      navigation,
      dispatch,
    });
    setOTP('');
  };

  const loginHandler = async () => {
    if (!OTPValid) {
      showMessage('Invalid password', undefined, 'Please try again');
      return;
    }
    Keyboard.dismiss();
    setLoading(true);
    let result = await sendOTPorLogin({
      sendCreds: verifyOTP,
      data: { email },
      setLoading,
      navigation,
      dispatch,
      OTP,
    });

    if (result instanceof AppError) {
      switch (result.code) {
        case 'A20':
        case 'A19':
          setOTPExpired(true);
          break;
      }
    }
  };

  useEffect(() => {
    // Validate the OTP
    const result = !isNaN(+OTP);

    setOTPValid(result);
  }, [OTP]);

  /**
   * Updates the OTP field only if the value is valid
   * @param text
   */
  const updateOTPHandler = (text: string) => {
    if (text === '') {
      setOTP(text);
    } else {
      const inputValid = !isNaN(+text);

      if (inputValid) {
        setOTP(text);
      }
    }
  };

  return (
    <ScreenWrapper>
      <FocusAwareStatusBar
        barStyle="dark-content"
        backgroundColor={colors.white}
      />
      <View style={styles.container}>
        <View>
          <View
            testID="otp_text"
            style={{ width: width * 0.7, paddingBottom: 40 }}>
            <Text lines={3} align="left" variant="regular16">
              {t('auth.provide_otp')}
            </Text>
            <Text align="left" variant="semibold16">
              {email}
            </Text>
          </View>
          <CodeInput
            testID="otp_input"
            style={{
              marginTop: loading ? 15 : 30,
              flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
            }}
            focused={focused}
            onSubmitEditing={loginHandler}
            value={OTP}
            onChangeText={updateOTPHandler}
          />
          <View style={{ alignItems: 'center', marginTop: 20 }}>
            {OTPExpired && (
              <TouchableWithoutFeedback onPress={resendOTPHandler}>
                <View>
                  <Text variant="semibold16">{t('auth.resendOTP')}</Text>
                </View>
              </TouchableWithoutFeedback>
            )}
          </View>
        </View>
        <View style={{ alignItems: 'center', marginBottom: 50 }}>
          <Button
            testID="otp_continue_button"
            variant="primary"
            disabled={loading || OTP?.length < 4}
            onPress={loginHandler}>
            {loading ? (
              <ActivityIndicator size="small" color={colors.white} />
            ) : (
              <Text variant="semibold16" color={colors.white}>
                {t('common.continue')}
              </Text>
            )}
          </Button>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default OtpConfirmation;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: PADDING,
    flex: 1,
    paddingTop: 20,
    justifyContent: 'space-between',
  },
});
