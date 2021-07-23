import Toast from 'react-native-toast-message';
import { Linking, Platform } from 'react-native';
import { IObject } from '../interfaces/Common';

export const DATE_FORMAT = 'DD/MM/YYYY HH:mm';

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
    if (key === 'postImage') {
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
