import React, { useState } from 'react';
import { View, I18nManager, ActivityIndicator, Keyboard } from 'react-native';
import { AuthRoutes, StackNavigationProps } from '../../navigation';
import { Formik } from 'formik';
import * as Yup from 'yup';
import {
  Text,
  Button,
  Card,
  Input,
  FocusAwareStatusBar,
  ScreenWrapper,
} from '../../components';
import { useTranslation } from 'react-i18next';
import { colors, CONTENT_WIDTH, PADDING, width } from '../../components/Theme';
import { useDispatch } from 'react-redux';
import { login, sendOTPorLogin } from '../../redux/actions';

const Login = ({ navigation }: StackNavigationProps<AuthRoutes, 'Login'>) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const loginSchema = Yup.object().shape({
    email: Yup.string()
      .email(t('errors.invalid_email'))
      .required(t('errors.required_field')),
  });

  const loginHandler = async ({ email }: { email: string }) => {
    setLoading(true);
    Keyboard.dismiss();
    await sendOTPorLogin({
      sendEmail: login,
      data: { email },
      setLoading,
      navigation,
      dispatch,
    });
  };

  return (
    <ScreenWrapper>
      <FocusAwareStatusBar
        barStyle="dark-content"
        backgroundColor={colors.white}
      />
      <Formik
        initialValues={{
          email: '',
        }}
        validationSchema={loginSchema}
        onSubmit={loginHandler}>
        {({
          touched,
          handleSubmit,
          values,
          errors,
          setFieldTouched,
          isValid,
          dirty,
          setFieldValue,
        }) => (
          <>
            <View
              style={{
                paddingHorizontal: PADDING,
                flex: 1,
                paddingTop: 20,
                justifyContent: 'space-between',
              }}>
              <View>
                <View style={{ width: width * 0.6, paddingBottom: 40 }}>
                  <Text lines={2} align="left" variant="regular16">
                    {t('auth.provide_email')}
                  </Text>
                </View>
                <Card
                  style={{
                    width: CONTENT_WIDTH,
                    flex: 0,
                    paddingVertical: 10,
                  }}>
                  <Input
                    testID="email"
                    returnKeyType="next"
                    accessibilityLabel="email"
                    keyboardType="email-address"
                    onChangeText={e => setFieldValue('email', e)}
                    onBlur={() => setFieldTouched('email')}
                    value={values.email}
                    touched={touched.email}
                    valid={!errors.email}
                    error={errors.email}
                    maxLength={100}
                    style={{ textAlign: 'left', fontSize: 18, flex: 0 }}
                  />
                  {values.email.length >= 7 && errors.email && (
                    <View
                      style={{
                        width: '100%',
                        flexDirection: 'row',
                        justifyContent: I18nManager.isRTL
                          ? 'flex-end'
                          : 'flex-start',
                      }}>
                      <Text
                        align="left"
                        variant="semibold16"
                        color={colors.error}>
                        {errors.email}
                      </Text>
                    </View>
                  )}
                </Card>
              </View>
              <View style={{ alignItems: 'center', marginBottom: 50 }}>
                <Button
                  testID="continue_button"
                  disabled={!isValid || !dirty || loading}
                  variant="primary"
                  onPress={handleSubmit}>
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
          </>
        )}
      </Formik>
    </ScreenWrapper>
  );
};

export default Login;
