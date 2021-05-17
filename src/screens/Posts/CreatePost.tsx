import React, { useState } from 'react';
import * as Yup from 'yup';
import {
  Keyboard,
  StyleSheet,
  View,
  ActivityIndicator,
  Image,
} from 'react-native';
import { Button, Card, colors, Input, PADDING, Text } from '../../components';
import { HomeRoutes, StackNavigationProps } from '../../navigation';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Formik } from 'formik';
import { createPost } from '../../redux/actions/posts';
import * as ImagePicker from 'expo-image-picker';

const CreatePost = ({}: StackNavigationProps<HomeRoutes, 'CreatePost'>) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState('');

  const PostSchema = Yup.object().shape({
    text: Yup.string()
      .min(2, t('errors.value_too_shot'))
      .max(280, t('errors.value_too_long'))
      .required(t('errors.required_field')),
    display: Yup.string(),
  });

  const createPostHandler = async ({
    display,
    text,
  }: {
    text: string;
    display: 'all' | 'friends';
  }) => {
    setLoading(true);
    Keyboard.dismiss();
    await dispatch(createPost({ display, text, image }));
  };

  const openGallery = async () => {

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.6,
    });

    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  const openCamera = async () => {
    await ImagePicker.requestCameraPermissionsAsync()

    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.6,
    });

    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="semibold16">{t('create_post.title')}</Text>
      <Formik
        initialValues={{
          text: '',
          display: 'all',
        }}
        validationSchema={PostSchema}
        onSubmit={createPostHandler}>
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
                flex: 1,
                paddingTop: 20,
                justifyContent: 'space-between',
              }}>
              <View style={{ flex: 1 }}>
                <Card
                  style={{
                    paddingVertical: 10,
                    height: 120,
                  }}>
                  <Input
                    returnKeyType="next"
                    accessibilityLabel="text"
                    keyboardType="default"
                    onChangeText={e => setFieldValue('text', e)}
                    onBlur={() => setFieldTouched('text')}
                    value={values.text}
                    touched={touched.text}
                    valid={!errors.text}
                    error={errors.text}
                    multiline
                    autoFocus
                    maxLength={280}
                    style={{ textAlign: 'left', fontSize: 18 }}
                  />
                  {values.text.length >= 5 && errors.text && (
                    <View
                      style={{
                        width: '100%',
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                      }}>
                      <Text
                        align="left"
                        variant="semibold16"
                        color={colors.error}>
                        {errors.text}
                      </Text>
                    </View>
                  )}
                </Card>

                {!!image && (
                  <Image
                    source={{ uri: image }}
                    style={{ width: 200, height: 200 }}
                  />
                )}

                <View
                  style={{
                    paddingVertical: PADDING * 2,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Button
                    variant="secondary"
                    width={'45%'}
                    onPress={openCamera}>
                    {loading ? (
                      <ActivityIndicator size="small" color={colors.white} />
                    ) : (
                      <Text variant="semibold16" color={colors.white}>
                        {t('create_post.open_camera')}
                      </Text>
                    )}
                  </Button>
                  <Button
                    variant="secondary"
                    width={'45%'}
                    onPress={openGallery}>
                    {loading ? (
                      <ActivityIndicator size="small" color={colors.white} />
                    ) : (
                      <Text variant="semibold16" color={colors.white}>
                        {t('create_post.open_gallery')}
                      </Text>
                    )}
                  </Button>
                </View>
                <View style={{ paddingVertical: PADDING }}>
                  <Button
                    testID="continue_button"
                    disabled={!isValid || !dirty || loading}
                    variant="primary"
                    width={'100%'}
                    onPress={handleSubmit}>
                    {loading ? (
                      <ActivityIndicator size="small" color={colors.white} />
                    ) : (
                      <Text variant="semibold16" color={colors.white}>
                        {t('create_post.create_post')}
                      </Text>
                    )}
                  </Button>
                </View>
              </View>
            </View>
          </>
        )}
      </Formik>
    </View>
  );
};

export default CreatePost;

const styles = StyleSheet.create({
  container: {
    padding: PADDING,
    flex: 1,
  },
});
