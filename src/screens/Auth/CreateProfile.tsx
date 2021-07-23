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
    name: Yup.string()
      .trim()
      .min(2, t('errors.invalid_client_name'))
      .max(40, t('errors.invalid_client_name'))
      .required(t('errors.required_field')),
    lastname: Yup.string()
      .trim()
      .min(2, t('errors.invalid_client_name'))
      .max(40, t('errors.invalid_client_name'))
      .required(t('errors.required_field')),
  });

  const createProfileHandler = async ({
    name,
    lastname,
  }: {
    name: string;
    lastname: string;
  }) => {
    setLoading(true);

    if (!name || !lastname) {
      showMessage(t('errors.all_fields_are_required'), 'error');
    }

    try {
      let profileData = {
        name,
        lastname,
      };
      Keyboard.dismiss();
      await dispatch(createProfile(profileData));
      setLoading(false);
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
          name: '',
          lastname: '',
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
                paddingTop: 20,
                justifyContent: 'space-between',
              }}>
              <View>
                <View style={{ marginBottom: 20 }}>
                  <Text variant="semibold16" lines={2}>
                    {t('create_profile.title')}
                  </Text>
                </View>
                <Card
                  style={{
                    width: CONTENT_WIDTH,
                  }}>
                  <View>
                    <Input
                      returnKeyType="next"
                      onChangeText={value =>
                        setFieldValue('name', clearName(value))
                      }
                      placeHolderTextColor="#000"
                      placeholder={t('create_profile.first_name')}
                      onBlur={() => setFieldTouched('name')}
                      value={values.name}
                      touched={touched.name}
                      valid={!errors.name}
                      error={errors.name}
                      maxLength={40}
                      style={{ textAlign: 'left', fontSize: 18, flex: 0 }}
                    />
                    {values.name?.length >= 2 && errors.name && (
                      <View
                        style={{
                          width: '100%',
                          alignItems: 'flex-start',
                          paddingVertical: 5,
                        }}>
                        <Text
                          align="left"
                          variant="semibold16"
                          color={colors.error}>
                          {errors.name}
                        </Text>
                      </View>
                    )}
                  </View>
                  <View>
                    <Input
                      returnKeyType="next"
                      onChangeText={value =>
                        setFieldValue('lastname', clearName(value))
                      }
                      placeholder={t('create_profile.last_name')}
                      onBlur={() => setFieldTouched('lastname')}
                      value={values.lastname}
                      touched={touched.lastname}
                      valid={!errors.lastname}
                      error={errors.lastname}
                      maxLength={40}
                      style={{ textAlign: 'left', fontSize: 18, flex: 0 }}
                    />
                    {values.lastname?.length >= 2 && errors.lastname && (
                      <View
                        style={{
                          width: '100%',
                          alignItems: 'flex-start',
                          paddingVertical: 5,
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
                    <ActivityIndicator color={colors.white} />
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

export default CreateProfile;
