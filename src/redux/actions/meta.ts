import ImagePicker from 'expo-image-picker';
import i18n from '../../i18n';
import AppError from '../../utils/AppError';
import { Request, Methods } from '../../utils/Wrapper';
import {
  ATTEMPTING_CONNECTION,
  CONNECTION_ERROR,
  CONNECTION_ESTABLISHED,
  LOCATION_SERVICE_UNAVAILABLE,
  OPEN_CAMERA,
  OPEN_GALLERY,
  UPDATE_IMAGE_PICKER_STATUS,
} from '../types/meta';

export const establishConnection = () => async (dispatch: Function) => {
  let requestParams = {
    method: Methods.GET,
    endpoint: '/',
  };

  dispatch({ type: ATTEMPTING_CONNECTION });

  try {
    await Request(dispatch, requestParams);
    dispatch({ type: CONNECTION_ESTABLISHED });
  } catch (err) {
    dispatch({ type: CONNECTION_ERROR });
  }
};

export const openImagePickerAsync = (
  action: 'OPEN_CAMERA' | 'OPEN_GALLERY' | undefined,
) => async () => {
  let pickerResult;

  switch (action) {
    case OPEN_CAMERA:
      const permissionResultCamera = await ImagePicker.requestCameraPermissionsAsync();

      if (permissionResultCamera.granted === false) {
        throw new AppError({
          message: i18n.t('errors.camera_permission_required'),
          display: true,
        });
      }

      pickerResult = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });
      break;
    case OPEN_GALLERY:
      const permissionResultCameraRoll = await ImagePicker.requestCameraRollPermissionsAsync();

      if (permissionResultCameraRoll.granted === false) {
        throw new AppError({
          message: i18n.t('errors.gallery_permission_required'),
          display: true,
        });
      }

      pickerResult = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });
      break;
    default:
      throw new Error('Unexpected gallery action');
  }

  if (pickerResult?.cancelled === true) {
    return;
  }

  return {
    uri: pickerResult.uri,
    type: 'image/jpeg',
    name: 'profilePicture.jpg',
  };
};

export const updateImagePickerStatus = (pickerAction: any) => {
  return { type: UPDATE_IMAGE_PICKER_STATUS, payload: pickerAction };
};

export const setLocationServiceUnavailable = () => {
  return { type: LOCATION_SERVICE_UNAVAILABLE };
};
