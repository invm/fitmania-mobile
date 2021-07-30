import Toast from 'react-native-toast-message';
import { Alert, Linking, Platform } from 'react-native';
import { IObject } from '../interfaces/Common';
import * as ImagePicker from 'expo-image-picker';
import i18n from '../i18n';
export const DATE_TIME_FORMAT = 'DD/MM/YYYY HH:mm';
export const DATE_FORMAT = 'DD/MM/YYYY';

export const showMessage = (
  title: string,
  type = 'success',
  subtitle?: string,
  visibilityTime = 5000,
) => {
  Toast.show({
    type,
    position: 'bottom',
    text1: title,
    text2: subtitle,
    visibilityTime,
    autoHide: true,
    topOffset: 30,
    bottomOffset: 100,
    onShow: () => {},
    onHide: () => {},
    onPress: () => {},
  });
};

export const openNavigate = ({
  lat,
  lng,
  label,
}: {
  lat: number;
  lng: number;
  label: string;
}) => {
  const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
  const latLng = `${lat},${lng}`;
  const url =
    Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    }) || '';

  Linking.openURL(url);
};

export const stripObject = (obj: { [any: string]: any }) => {
  Object.keys(obj).forEach(k => !obj[k] && delete obj[k]);
  return obj;
};
export const toFormData = (obj: IObject) => {
  const formData = new FormData();

  Object.keys(obj).forEach(key => {
    if (['postImage', 'image'].includes(key)) {
      if (Array.isArray(obj[key])) {
        obj[key].forEach((img: any, i: number) => {
          formData.append(key, img, `${i}.jpeg`);
        });
      } else {
        formData.append(key, obj[key], `${key}.jpeg`);
      }
    } else if (
      key &&
      typeof obj[key] === 'object' &&
      Object.prototype.toString.call(obj[key]) === '[object Date]'
    ) {
      formData.append(key, `${new Date(obj[key]).valueOf()}`);
    } else if (key && typeof obj[key] === 'object') {
      Object.keys(obj[key]).forEach(k => {
        formData.append(`${key}[${k}]`, obj[key][k]);
      });
    } else if (key && Array.isArray(obj[key])) {
      obj[key].forEach((val: any) => {
        formData.append(key, val);
      });
    } else if (key) {
      formData.append(key, obj[key]);
    }
  });

  return formData;
};

export const openImagePickerAsync = async (
  action: 'OPEN_CAMERA' | 'OPEN_GALLERY' | undefined,
) => {
  let pickerResult;

  if (Platform.OS !== 'web') {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(i18n.t('errors.camera_permissions'));
      return;
    } else {
      switch (action) {
        case 'OPEN_CAMERA':
          pickerResult = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
          });
          break;
        case 'OPEN_GALLERY':
          pickerResult = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
          });
          break;
        default:
          throw new Error('Unexpected gallery action');
      }
    }
    if (!pickerResult?.cancelled && pickerResult?.uri) {
      return {
        uri: pickerResult.uri,
        type: 'image/jpeg',
        name: 'profilePicture.jpg',
      };
    }
  }

  return;
};
