import React, { useState } from 'react';
import { View, ActivityIndicator, Keyboard } from 'react-native';
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
    name: Yup.string()
      .min(2, t('errors.value_too_short'))
      .max(50, t('errors.value_too_long'))
      .required(t('errors.required_field')),
    lastname: Yup.string()
      .min(2, t('errors.value_too_short'))
      .max(50, t('errors.value_too_long'))
      .required(t('errors.required_field')),
    email: Yup.string()
      .email(t('errors.invalid_email'))
      .required(t('errors.required_field')),
  });

  const registrationHandler = async ({
    email,
    name,
    lastname,
  }: {
    email: string;
    name: string;
    lastname: string;
  }) => {
    setLoading(true);
    Keyboard.dismiss();
    await sendOTPorLogin({
      sendEmail: register,
      data: { email: email.toLowerCase(), name, lastname },
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
          name: '',
          lastname: '',
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
                  <View>
                    <Input
                      testID="email"
                      placeholder={t('auth.email')}
                      returnKeyType="next"
                      keyboardType="email-address"
                      onChangeText={e => setFieldValue('email', e)}
                      onBlur={() => setFieldTouched('email')}
                      value={values.email}
                      touched={touched.email}
                      valid={!errors.email}
                      error={errors.email}
                      style={{
                        textAlign: 'left',
                        fontSize: 18,
                        marginBottom: 8,
                        flex: 0,
                      }}
                    />
                    {values.email?.length >= 5 && errors.email && (
                      <View
                        style={{
                          width: '100%',
                          flexDirection: 'row',
                          alignItems: 'flex-start',
                        }}>
                        <Text
                          align="left"
                          variant="semibold16"
                          color={colors.error}>
                          {errors.email}
                        </Text>
                      </View>
                    )}
                    <Input
                      testID="name"
                      placeholder={t('auth.name')}
                      returnKeyType="next"
                      onChangeText={e => setFieldValue('name', e)}
                      onBlur={() => setFieldTouched('name')}
                      value={values.name}
                      touched={touched.name}
                      valid={!errors.name}
                      error={errors.name}
                      style={{
                        textAlign: 'left',
                        fontSize: 18,
                        marginBottom: 8,
                        flex: 0,
                      }}
                    />
                    {touched.name && errors.name && (
                      <View
                        style={{
                          width: '100%',
                          flexDirection: 'row',
                          alignItems: 'flex-start',
                        }}>
                        <Text
                          align="left"
                          variant="semibold16"
                          color={colors.error}>
                          {errors.name}
                        </Text>
                      </View>
                    )}
                    <Input
                      testID="lastname"
                      placeholder={t('auth.lastname')}
                      returnKeyType="next"
                      onChangeText={e => setFieldValue('lastname', e)}
                      onBlur={() => setFieldTouched('lastname')}
                      value={values.lastname}
                      touched={touched.lastname}
                      valid={!errors.lastname}
                      error={errors.lastname}
                      style={{
                        textAlign: 'left',
                        fontSize: 18,
                        marginBottom: 8,
                        flex: 0,
                      }}
                    />
                    {touched.lastname && errors.lastname && (
                      <View
                        style={{
                          width: '100%',
                          flexDirection: 'row',
                          alignItems: 'flex-start',
                        }}>
                        <Text
                          align="left"
                          variant="semibold16"
                          color={colors.error}>
                          {errors.lastname}
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

export default Register;
