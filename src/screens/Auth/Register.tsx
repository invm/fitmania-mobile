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
import { register, sendOTPorLogin } from '../../redux/actions';

const Register = ({
  navigation,
}: StackNavigationProps<AuthRoutes, 'Register'>) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const registrationSchema = Yup.object().shape({
    email: Yup.string().email().required(t('errors.required_field')),
  });

  const registrationHandler = async ({ email }: { email: string }) => {
    setLoading(true);
    Keyboard.dismiss();
    await sendOTPorLogin({
      sendEmail: register,
      email,
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
        validationSchema={registrationSchema}
        onSubmit={registrationHandler}>
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
                paddingTop: 40,
                justifyContent: 'space-between',
              }}>
              <View>
                <View style={{ width: width * 0.6, paddingBottom: 60 }}>
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
                  <View>
                    <Input
                      testID="email"
                      returnKeyType="next"
                      onChangeText={e =>
                        setFieldValue('email', e.replace(/\D/, ''))
                      }
                      onBlur={() => setFieldTouched('email')}
                      value={values.email}
                      touched={touched.email}
                      valid={!errors.email}
                      error={errors.email}
                      maxLength={10}
                      style={{ textAlign: 'left', fontSize: 18, flex: 0 }}
                    />
                    {values.email?.length >= 5 && errors.email && (
                      <View
                        style={{
                          width: '100%',
                          flexDirection: 'row',
                          alignItems: I18nManager.isRTL
                            ? 'flex-end'
                            : 'flex-start',
                        }}>
                        <Text align="left" variant="error">
                          {errors.email}
                        </Text>
                      </View>
                    )}
                  </View>
                </Card>
              </View>
              <View style={{ alignItems: 'center', marginBottom: 50 }}>
                <Button
                  disabled={!isValid || !dirty || loading}
                  variant="primary"
                  onPress={handleSubmit}>
                  {loading ? (
                    <ActivityIndicator size="small" color={colors.white} />
                  ) : (
                    <Text variant="white">{t('common.continue')}</Text>
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

export default Register;
