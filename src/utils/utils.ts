import Toast from 'react-native-toast-message';
import { Linking, Platform } from 'react-native';
import { IObject } from '../interfaces/Common';
import ImagePicker from 'expo-image-picker';
import i18n from '../i18n';

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

const buildFormData = (formData: FormData, data: any, parentKey?: string) => {
  if (data && typeof data === 'object' && data?.uri) {
    formData.append(parentKey ?? '', data);
  } else if (
    data &&
    typeof data === 'object' &&
    !(data instanceof Date) &&
    !(data instanceof File)
  ) {
    Object.keys(data).forEach(key => {
      buildFormData(
        formData,
        data[key],
        parentKey ? `${parentKey}[${key}]` : key,
      );
    });
  } else {
    const value = data == null ? '' : data;

    formData.append(parentKey ?? '', value);
  }
};

export const toFormData = (data: IObject) => {
  const formData = new FormData();

  buildFormData(formData, data);

  return formData;
};
