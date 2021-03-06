import React, { createRef, useEffect, useRef, useState } from 'react';
import DropDownPicker, { ValueType } from 'react-native-dropdown-picker';
import * as Yup from 'yup';
import {
  Keyboard,
  StyleSheet,
  View,
  ActivityIndicator,
  Image,
  ScrollView,
} from 'react-native';
import {
  Button,
  Card,
  colors,
  FocusAwareStatusBar,
  Input,
  PADDING,
  Text,
} from '../../components';
import { HomeRoutes, StackNavigationProps } from '../../navigation';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Formik, FormikProps } from 'formik';
import { createPost, getPosts, resetPosts } from '../../redux/actions/posts';
import * as ImagePicker from 'expo-image-picker';
import { BORDER_RADIUS, width } from '../../components/Theme';
import { DATE_TIME_FORMAT, showMessage } from '../../utils/utils';
import { GOOGLE_API_KEY } from '../../../sensitive';
import {
  GooglePlaceData,
  GooglePlaceDetail,
  GooglePlacesAutocomplete,
} from 'react-native-google-places-autocomplete';
import DateTimePicker from '../../components/DateTimePicker';
import ActionSheet from 'react-native-actions-sheet';
import moment from 'moment';
import Checkbox from '../../components/Checkbox';

const startDateActionSheetRef = createRef<ActionSheet>();

const CreateEvent = ({
  navigation,
}: StackNavigationProps<HomeRoutes, 'CreateEvent'>) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const ref = useRef<FormikProps<any>>(null);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState({
    uri: '',
    type: '',
    name: '',
  });

  const [sportOpen, setSportOpen] = useState(false);
  const [sport, setSport] = useState<ValueType | ValueType[] | null>('Running');
  const [sportItems, setSportItems] = useState([
    { label: 'Running', value: 'Running' },
    { label: 'Biking', value: 'Biking' },
    { label: 'Soccer', value: 'Soccer' },
    { label: 'Basketball', value: 'Basketball' },
    { label: 'Rugby', value: 'Rugby' },
    { label: 'Hiking', value: 'Hiking' },
    { label: 'Tennis', value: 'Tennis' },
  ]);
  const [displayOpen, setDisplayOpen] = useState(false);
  const [display, setDisplay] = useState<ValueType | ValueType[] | null>('all');
  const [displayItems, setDisplayItems] = useState([
    { label: 'All', value: 'all' },
    { label: 'Friends only', value: 'friends' },
  ]);

  const [limitOpen, setLimitOpen] = useState(false);
  const [limit, setLimit] = useState<ValueType | ValueType[] | null>(2);
  const [limitItems, setLimitItems] = useState([
    ...Array(50)
      .fill('')
      .map((_, i) => ({ value: i + 2, label: `${i + 2}` })),
  ]);

  const [paceOpen, setPaceOpen] = useState(false);
  const [pace, setPace] = useState<ValueType | ValueType[] | null>('Easy');
  const [paceItems, setPaceItems] = useState([
    { value: 'Easy', label: 'Easy' },
    { value: 'Medium', label: 'Medium' },
    { value: 'Fast', label: 'Fast' },
  ]);

  useEffect(() => {
    ref?.current?.values?.sport !== sport &&
      ref.current?.setFieldValue('sport', sport);
    ref?.current?.values?.limitParticipants !== limit &&
      ref.current?.setFieldValue('limitParticipants', limit);
  }, [sport, limit]);

  const PostSchema = Yup.object().shape({
    text: Yup.string()
      .min(2, t('errors.value_too_short'))
      .max(280, t('errors.value_too_long'))
      .required(t('errors.required_field')),
    // display: Yup.string(),
    // eventType: Yup.string().required(t('errors.required_field')),
    startDate: Yup.string().required(t('errors.required_field')),
    // limitParticipants: Yup.number()
    //   .min(2)
    //   .max(50)
    //   .required(t('errors.required_field')),
    // pace: Yup.string().required(t('errors.required_field')),
    address: Yup.string().required(t('errors.required_field')),
    openEvent: Yup.boolean().required(t('errors.required_field')),
    coordinates: Yup.array()
      .of(Yup.number())
      .required(t('errors.required_field')),
  });

  const handleGoogleAutocompletePress = (
    _: GooglePlaceData,
    details: GooglePlaceDetail | null,
    setFieldValue: (
      field: string,
      value: any,
      shouldValidate?: boolean | undefined,
    ) => void,
  ) => {
    let locality =
      details?.address_components?.find(
        v => v?.types?.includes('locality') || v?.types?.includes('political'),
      )?.long_name ?? '';

    let coords = details?.geometry?.location
      ? [details?.geometry?.location.lng, details?.geometry?.location.lat]
      : [];

    if (locality && coords?.length) {
      ref?.current?.setFieldValue('address', details?.formatted_address);
      setFieldValue('coordinates', coords);
    }
  };

  const createEventHandler = async ({
    text,
    startDate,
    coordinates,
    address,
    openEvent,
  }: {
    text: string;
    startDate: Date;
    coordinates: number[];
    address: string;
    openEvent: boolean;
  }) => {
    setLoading(true);
    Keyboard.dismiss();
    try {
      await createPost({
        text,
        startDate,
        coordinates,
        address,
        openEvent,
        display: (display ?? 'all').toString(),
        eventType: sport?.toString(),
        pace: pace?.toString(),
        limitParticipants: Number(limit),
        ...(image.uri && { image }),
      });
      await dispatch(resetPosts());
      await dispatch(getPosts());
      setLoading(false);
      image.uri && setImage({ uri: '', type: 'image/jpg', name: 'image.jpg' });
      navigation.navigate('Home');
    } catch (error) {
      showMessage(t('common.error'), 'error', error?.message);
      setLoading(false);
    }
  };

  const openGallery = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      base64: false,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
      allowsMultipleSelection: false,
    });

    if (!result.cancelled) {
      setImage({ uri: result.uri, type: 'image/jpg', name: 'image.jpg' });
    }
  };

  const openCamera = async () => {
    await ImagePicker.requestCameraPermissionsAsync();

    let result = await ImagePicker.launchCameraAsync({
      base64: false,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
      allowsMultipleSelection: false,
    });

    if (!result.cancelled) {
      setImage({ uri: result.uri, type: 'image/jpg', name: 'image.jpg' });
    }
  };

  useEffect(() => {
    if (loading) {
      navigation.addListener('beforeRemove', e => {
        // Prevent default behavior of leaving the screen
        if (e.data.action.type === 'GO_BACK') {
          e.preventDefault();
        }
      });
      Keyboard.dismiss();
    }
    return () => {
      navigation.removeListener('beforeRemove', () => {});
    };
  }, [navigation, loading]);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <Text variant="semibold16" lines={3}>
          {t('create_event.title')}
        </Text>
        <FocusAwareStatusBar
          backgroundColor={colors.white}
          barStyle="dark-content"
        />
        <Formik
          innerRef={ref}
          initialValues={{
            text: '',
            startDate: new Date(moment().add(2, 'days').format()),
            coordinates: [],
            address: '',
            openEvent: true,
          }}
          validationSchema={PostSchema}
          onSubmit={createEventHandler}>
          {({
            touched,
            handleSubmit,
            values,
            errors,
            setFieldTouched,
            setFieldValue,
            isValid,
            dirty,
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
                    }}>
                    <View>
                      <View>
                        <Text variant="semibold16" color={colors.darkGrey}>
                          {t('create_event.start_date')}
                        </Text>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                          }}>
                          <Text>
                            {moment(values.startDate).format(DATE_TIME_FORMAT)}
                          </Text>
                          <DateTimePicker
                            label={t('common.change')}
                            date={values.startDate}
                            setDate={date => setFieldValue('startDate', date)}
                            actionSheetRef={startDateActionSheetRef}
                          />
                        </View>
                      </View>

                      <View style={{ flexDirection: 'row' }}>
                        <View style={{ flex: 1, paddingEnd: 4 }}>
                          <Text variant="semibold16" color={colors.darkGrey}>
                            {t('create_event.sport')}
                          </Text>
                          <DropDownPicker
                            open={sportOpen}
                            value={sport}
                            items={sportItems}
                            setOpen={setSportOpen}
                            setValue={setSport}
                            setItems={setSportItems}
                            modalProps={{
                              animationType: 'slide',
                            }}
                            showArrowIcon
                            listMode="MODAL"
                          />
                        </View>
                        <View style={{ flex: 1, paddingStart: 4 }}>
                          <Text variant="semibold16" color={colors.darkGrey}>
                            {t('create_event.display')}
                          </Text>
                          <DropDownPicker
                            open={displayOpen}
                            value={display}
                            items={displayItems}
                            setOpen={setDisplayOpen}
                            setValue={setDisplay}
                            setItems={setDisplayItems}
                            modalProps={{
                              animationType: 'slide',
                            }}
                            showArrowIcon
                            listMode="MODAL"
                          />
                        </View>
                      </View>
                      <View style={{ flexDirection: 'row' }}>
                        <View style={{ flex: 1, paddingEnd: 4 }}>
                          <Text variant="semibold16" color={colors.darkGrey}>
                            {t('create_event.pace')}
                          </Text>
                          <DropDownPicker
                            open={paceOpen}
                            value={pace}
                            items={paceItems}
                            setOpen={setPaceOpen}
                            setValue={setPace}
                            setItems={setPaceItems}
                            modalProps={{
                              animationType: 'slide',
                            }}
                            showArrowIcon
                            listMode="MODAL"
                          />
                        </View>
                        <View style={{ flex: 1, paddingStart: 4 }}>
                          <Text variant="semibold16" color={colors.darkGrey}>
                            {t('create_event.limit_participants')}
                          </Text>
                          <DropDownPicker
                            open={limitOpen}
                            value={limit}
                            items={limitItems}
                            setOpen={setLimitOpen}
                            setValue={setLimit}
                            setItems={setLimitItems}
                            modalProps={{
                              animationType: 'slide',
                            }}
                            showArrowIcon
                            listMode="MODAL"
                          />
                        </View>
                      </View>
                    </View>
                    <View style={{ paddingTop: 8 }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}>
                        <Text variant="semibold16" color={colors.darkGrey}>
                          {t('create_event.everybody_can_join')}
                        </Text>
                        <Checkbox
                          onPress={e => {
                            setFieldValue('openEvent', e);
                          }}
                          selected={values.openEvent}
                        />
                      </View>

                      {!values.openEvent && (
                        <Text
                          variant="medium14"
                          lines={3}
                          color={colors.darkGrey}>
                          {t('create_event.close_event_details')}
                        </Text>
                      )}
                    </View>
                    <View style={{ height: 100 }}>
                      <GooglePlacesAutocomplete
                        placeholder={t('create_event.location')}
                        GooglePlacesDetailsQuery={{
                          fields:
                            'address_components,formatted_address,geometry',
                          types: 'address',
                        }}
                        fetchDetails
                        keyboardShouldPersistTaps="handled"
                        enablePoweredByContainer={false}
                        debounce={300}
                        listViewDisplayed={'auto'}
                        textInputProps={{
                          numberOfLines: 1,
                          maxLength: 70,
                          placeholderTextColor: colors.darkGrey,
                          selectionColor: colors.primary,
                          style: {
                            width: '100%',
                            textAlignVertical: 'center',
                            textAlign: 'left',
                            borderBottomWidth: 1,
                            color: colors.black,
                            borderBottomColor: colors.primary,
                          },
                        }}
                        onPress={(data: any, details: any) =>
                          handleGoogleAutocompletePress(
                            data,
                            details,
                            setFieldValue,
                          )
                        }
                        styles={{
                          listView: {
                            position: 'absolute',
                            top: 50,
                            zIndex: 9999,
                            borderBottomStartRadius: BORDER_RADIUS.small,
                            borderBottomEndRadius: BORDER_RADIUS.small,
                          },
                        }}
                        query={{
                          key: GOOGLE_API_KEY,
                          language: 'en',
                          components: 'country:il',
                          types: 'geocode',
                        }}
                      />
                    </View>
                    <View style={{ height: 100 }}>
                      <Input
                        returnKeyType="next"
                        accessibilityLabel="text"
                        placeholder="Text"
                        keyboardType="default"
                        onChangeText={e => setFieldValue('text', e)}
                        onBlur={() => setFieldTouched('text')}
                        value={values.text}
                        touched={touched.text}
                        valid={!errors.text}
                        error={errors.text}
                        multiline
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
                    </View>
                  </Card>

                  {!!image.uri && (
                    <View style={styles.imageContainer}>
                      <Image source={{ uri: image.uri }} style={styles.image} />
                    </View>
                  )}
                  {!loading && (
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
                        <Text variant="semibold16" color={colors.white}>
                          {t('create_post.open_camera')}
                        </Text>
                      </Button>
                      <Button
                        variant="secondary"
                        width={'45%'}
                        onPress={openGallery}>
                        <Text variant="semibold16" color={colors.white}>
                          {t('create_post.open_gallery')}
                        </Text>
                      </Button>
                    </View>
                  )}

                  <View style={{ paddingVertical: PADDING }}>
                    <Button
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
      </ScrollView>
    </View>
  );
};

export default CreateEvent;

const styles = StyleSheet.create({
  container: {
    padding: PADDING,
  },
  imageContainer: {
    marginTop: PADDING,
    borderRadius: BORDER_RADIUS.small,
    overflow: 'hidden',
  },
  image: {
    width: width - PADDING * 2,
    height: ((width - PADDING * 2) * 3) / 4,
    borderRadius: BORDER_RADIUS.small,
  },
});
