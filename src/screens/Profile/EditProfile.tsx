import React, { useState } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux';
import i18n from '../../i18n';
import { updateProfile } from '../../redux/actions';
import {
  ActivityIndicator,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import {
  BORDER_RADIUS,
  Button,
  colors,
  ImageUpload,
  Input,
  PADDING,
  Text,
} from '../../components';
import { sports } from '../Home/components/SportFilters';
import { MEDIA_URL } from '../../../env';
import { ScrollView } from 'react-native-gesture-handler';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/Ionicons';

const profileSchema = Yup.object().shape({
  email: Yup.string()
    .email(i18n.t('errors.invalid_email'))
    .required(i18n.t('errors.required_field')),
  name: Yup.string()
    .min(2, i18n.t('errors.value_too_short'))
    .max(50, i18n.t('errors.value_too_short'))
    .required(i18n.t('errors.required_field')),
  lastname: Yup.string()
    .min(2, i18n.t('errors.value_too_short'))
    .max(50, i18n.t('errors.value_too_short'))
    .required(i18n.t('errors.required_field')),
  birthday: Yup.date(),
  location: Yup.string(),
  image: Yup.mixed(),
  preferable: Yup.array().of(Yup.string()),
  undesirable: Yup.array().of(Yup.string()),
});

const EditProfile = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state: typeof RootState) => state.user);
  const dispatch = useDispatch();
  const [image, setImage] = useState<{ imgURI: string; image: any }>({
    imgURI: '',
    image: null,
  });

  const saveProfile = async (values: {
    [key: string]: any;
    email: string;
    name: string;
    lastname: string;
    image: string;
    preferable: string[];
    undesirable: string[];
    birthday: string;
    location: string;
  }) => {
    let body = Object.keys(values)
      .filter(v => v !== 'email' && values[v] !== user[v])
      .reduce(
        (obj, key) => ({ ...obj, ...(values[key] && { [key]: values[key] }) }),
        {},
      );
    console.log(values.image);

    if (Object.keys(body).length) {
      setLoading(true);
      await dispatch(updateProfile(body));
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: PADDING }}>
      <Formik
        initialValues={{
          email: user.email,
          name: user.name,
          lastname: user.lastname,
          image: user?.image ?? '',
          preferable: user?.preferable ?? [],
          undesirable: user?.undesirable ?? [],
          birthday: user?.birthday ?? '',
          location: user?.location ?? '',
        }}
        validationSchema={profileSchema}
        onSubmit={saveProfile}>
        {({ handleSubmit, values, errors, setFieldValue }) => (
          <>
            <View>
              {console.log(errors)}
              <View style={styles.imageContainer}>
                <View style={styles.image}>
                  <ImageUpload
                    img={{
                      uri: image.imgURI
                        ? image.imgURI
                        : values.image
                        ? `${MEDIA_URL}${values.image}`
                        : '',
                    }}
                    setImg={image => {
                      setImage({ imgURI: image.uri, image });
                      setFieldValue('image', image);
                    }}
                  />
                </View>
              </View>

              <View>
                <View>
                  <Text variant="medium16" color={colors.darkGrey}>
                    {t('profile.first_name')}
                  </Text>
                  <Input
                    value={values.name}
                    onChangeText={(e: string) => setFieldValue('name', e)}
                  />
                </View>
                <View>
                  <Text variant="medium16" color={colors.darkGrey}>
                    {t('profile.last_name')}
                  </Text>
                  <Input
                    value={values.lastname}
                    onChangeText={(e: string) => setFieldValue('lastname', e)}
                  />
                </View>
                <View>
                  <Text variant="medium16" color={colors.darkGrey}>
                    {t('profile.email')}
                  </Text>
                  <Input
                    value={values.email}
                    editable={false}
                    onChangeText={_ => {}}
                  />
                </View>
                <View>
                  <Text variant="medium16" color={colors.darkGrey}>
                    {t('profile.location')}
                  </Text>
                  <Input
                    value={values.location}
                    onChangeText={e => setFieldValue('location', e)}
                  />
                </View>
                <View>
                  {Object.entries(sports).filter(
                    item => !values.preferable?.includes(item[0]),
                  ).length > 0 && (
                    <>
                      <Text variant="semibold20" align="center">
                        {t('profile.select_preferable')}
                      </Text>
                      <View style={styles.sports}>
                        {Object.entries(sports)
                          .filter(item => !values.undesirable.includes(item[0]))
                          .map(item => {
                            let color = values.preferable.includes(item[0])
                              ? colors.primary
                              : colors.grey;
                            return (
                              <TouchableOpacity
                                key={item[0]}
                                style={styles.sport}
                                onPress={() => {
                                  if (values.preferable.includes(item[0])) {
                                    setFieldValue(
                                      'preferable',
                                      values.preferable.filter(
                                        v => v !== item[0],
                                      ),
                                    );
                                  } else {
                                    setFieldValue('preferable', [
                                      ...values.preferable,
                                      item[0],
                                    ]);
                                  }
                                }}>
                                <Icon name={item[1]} size={20} color={color} />
                                <Text variant="semibold16" color={color}>
                                  {item[0]}
                                </Text>
                              </TouchableOpacity>
                            );
                          })}
                      </View>
                    </>
                  )}
                  {Object.entries(sports).filter(
                    item => !values.undesirable.includes(item[0]),
                  ).length > 0 && (
                    <>
                      <Text variant="semibold20" align="center">
                        {t('profile.select_undesirable')}
                      </Text>
                      <View style={styles.sports}>
                        {Object.entries(sports)
                          .filter(item => !values.preferable.includes(item[0]))
                          .map(item => {
                            let color = values.undesirable.includes(item[0])
                              ? colors.error
                              : colors.grey;
                            return (
                              <TouchableOpacity
                                key={item[0]}
                                style={styles.sport}
                                onPress={() => {
                                  if (values.undesirable.includes(item[0])) {
                                    setFieldValue(
                                      'undesirable',
                                      values.undesirable.filter(
                                        v => v !== item[0],
                                      ),
                                    );
                                  } else {
                                    setFieldValue('undesirable', [
                                      ...values.undesirable,
                                      item[0],
                                    ]);
                                  }
                                }}>
                                <Icon name={item[1]} size={20} color={color} />
                                <Text variant="semibold16" color={color}>
                                  {item[0]}
                                </Text>
                              </TouchableOpacity>
                            );
                          })}
                      </View>
                    </>
                  )}
                </View>
              </View>
            </View>
            <View>
              <Button disabled={loading} onPress={() => handleSubmit()}>
                {loading ? (
                  <ActivityIndicator size="small" color={colors.white} />
                ) : (
                  <Text color={colors.white} variant="semibold16">
                    Save Profile
                  </Text>
                )}
              </Button>
            </View>
          </>
        )}
      </Formik>
    </ScrollView>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: {},
  sports: {
    justifyContent: 'center',
    flexDirection: 'row',
    paddingVertical: 8,
    flexWrap: 'wrap',
  },
  sport: {
    flexDirection: 'row',
    padding: 8,
    marginEnd: 6,
    marginBottom: 4,
    borderRadius: BORDER_RADIUS.med,
  },
  row: { paddingVertical: 4, flexDirection: 'row', justifyContent: 'center' },
  imageContainer: { flex: 1, alignItems: 'center', paddingBottom: PADDING },
  image: {
    width: 150,
    height: 150,
  },
});
