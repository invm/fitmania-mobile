import React, { useEffect, useState } from 'react';
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
import { colors, CONTENT_WIDTH, PADDING } from '../../components/Theme';
import { useDispatch } from 'react-redux';
import { createProfile, getProfile } from '../../redux/actions';
import { clearName } from '../../utils/formatters';
import { showMessage } from '../../utils/utils';

const CreateProfile = ({
  navigation,
}: StackNavigationProps<AuthRoutes, 'CreateProfile'>) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    navigation.addListener('beforeRemove', e => {
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

  const createProfileSchema = Yup.object().shape({
    firstName: Yup.string()
      .trim()
      .min(2, t('errors.invalid_client_name'))
      .max(40, t('errors.invalid_client_name'))
      .required(t('errors.required_field')),
    lastName: Yup.string()
      .trim()
      .min(2, t('errors.invalid_client_name'))
      .max(40, t('errors.invalid_client_name'))
      .required(t('errors.required_field')),
  });

  const createProfileHandler = async ({
    firstName,
    lastName,
  }: {
    firstName: string;
    lastName: string;
  }) => {
    setLoading(true);

    if (!firstName || !lastName) {
      showMessage(t('errors.all_fields_are_required'));
    }

    try {
      let profileData = {
        firstName,
        lastName,
      };
      Keyboard.dismiss();
      dispatch(createProfile(profileData));
    } catch (err) {
      setLoading(false);
      if (!err.data?.connectionAborted) {
        if (err.display) {
          showMessage(
            t('common.error'),
            'info',
            err.message, // The message is expected to already be translated by this point
          );
        }
      } else if (err.code === 'A16') {
        // In case the user somehow already created his profile - fetch it and send him automatically through the nav container to the home screen
        dispatch(getProfile());
      }
    }
  };

  return (
    <ScreenWrapper>
      <FocusAwareStatusBar
        barStyle="dark-content"
        backgroundColor={colors.white}
      />
      <Formik
        initialValues={{
          firstName: '',
          lastName: '',
        }}
        validationSchema={createProfileSchema}
        onSubmit={createProfileHandler}>
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
                paddingTop: 50,
                justifyContent: 'space-between',
              }}>
              <View>
                <Card
                  style={{
                    width: CONTENT_WIDTH,
                  }}>
                  <View>
                    <Input
                      returnKeyType="next"
                      onChangeText={value =>
                        setFieldValue('firstName', clearName(value))
                      }
                      placeholder={t('create_profile.first_name')}
                      onBlur={() => setFieldTouched('firstName')}
                      value={values.firstName}
                      touched={touched.firstName}
                      valid={!errors.firstName}
                      error={errors.firstName}
                      maxLength={40}
                      style={{ textAlign: 'left', fontSize: 18, flex: 0 }}
                    />
                    {values.firstName?.length >= 2 && errors.firstName && (
                      <View
                        style={{
                          width: '100%',
                          alignItems: 'flex-start',
                          paddingVertical: 5,
                        }}>
                        <Text align="left" variant="error">
                          {errors.firstName}
                        </Text>
                      </View>
                    )}
                  </View>
                  <View>
                    <Input
                      returnKeyType="next"
                      onChangeText={value =>
                        setFieldValue('lastName', clearName(value))
                      }
                      placeholder={t('create_profile.last_name')}
                      onBlur={() => setFieldTouched('lastName')}
                      value={values.lastName}
                      touched={touched.lastName}
                      valid={!errors.lastName}
                      error={errors.lastName}
                      maxLength={40}
                      style={{ textAlign: 'left', fontSize: 18, flex: 0 }}
                    />
                    {values.lastName?.length >= 2 && errors.lastName && (
                      <View
                        style={{
                          width: '100%',
                          alignItems: 'flex-start',
                          paddingVertical: 5,
                        }}>
                        <Text align="left" variant="error">
                          {errors.lastName}
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
                    <ActivityIndicator />
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

export default CreateProfile;
