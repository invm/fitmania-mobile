import { ParamListBase } from '@react-navigation/native';
import { Request, Methods } from '../../utils/Wrapper';
import * as types from '../types/user';
import { Dispatch, SetStateAction } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LogEvent, showMessage } from '../../utils/utils';
import i18n from '../../i18n';
import { API_URL, ENV } from './../../../env';
import store from '../index';
import axios from 'axios';
import messaging from '@react-native-firebase/messaging';
import IUser from '../../interfaces/User';

export const verifySession = () => async (dispatch: Function) => {
  try {
    // const token = await AsyncStorage.getItem('token');
    // if (token) {
    let requestParams = {
      method: Methods.POST,
      endpoint: `/verify-authentication`,
      // body: {
      //   token,
      // },
    };

    await Request(dispatch, requestParams);
    // let res = await Request(dispatch, requestParams);
    // res.data.token && storeData('token', res.data.token);
    dispatch({ type: types.AUTHENTICATE, payload: true });
    dispatch(getProfile());
    // }
    // dispatch({ type: types.AUTHENTICATE, payload: false });
  } catch (error) {
    dispatch({ type: types.AUTHENTICATE, payload: false });
  }
  const fcmToken = await messaging().getToken();
  await AsyncStorage.setItem('fcmToken', fcmToken);
  await updateFcmToken(fcmToken);
};

export const register = (email: string) => async (dispatch: Function) => {
  let requestParams = {
    method: Methods.POST,
    endpoint: `/register`,
    body: {
      phone: email,
    },
  };

  await Request(dispatch, requestParams);

  await LogEvent('register');
};

export const login = (email: string) => async (dispatch: Function) => {
  let requestParams = {
    method: Methods.POST,
    endpoint: `/login`,
    body: {
      phone: email,
    },
  };

  let res = await Request(dispatch, requestParams);

  return (ENV !== 'production' && res?.data?.data?.otp) ?? null;
};

export const verifyOTP = (email: string, OTP: string) => async (
  dispatch: Function,
) => {
  let requestParams = {
    method: Methods.POST,
    endpoint: `/login`,
    body: {
      phone: email,
      otp: OTP,
    },
  };

  await Request(dispatch, requestParams);
  dispatch(verifySession());
};

export const logout = () => async (dispatch: Function) => {
  let requestParams = {
    method: Methods.POST,
    endpoint: `/logout`,
  };
  dispatch({ type: types.LOGOUT });

  await Request(dispatch, requestParams);

  await AsyncStorage.removeItem('token');
};

export const deleteProfile = () => async (dispatch: Function) => {
  let requestParams = {
    method: Methods.DELETE,
    endpoint: `/profile`,
  };

  await Request(dispatch, requestParams);

  dispatch({ type: types.LOGOUT });
};

export const getProfile = () => async (dispatch: Function) => {
  dispatch({ type: types.USER_LOADING });
  let requestParams = {
    method: Methods.GET,
    endpoint: `/profile`,
  };

  try {
    let result = await Request(dispatch, requestParams);

    const loadedData: IUser = {
      ...result.data.data,
    };

    dispatch({
      type: types.GET_PROFILE,
      payload: {
        ...loadedData,
        profileLoaded: true,
      },
    });
  } catch (error) {
    if (error?.code === 'A34') {
      // in case the response is 'profile not created' navigate to onboarding screen, then he will be redirected to create profile screen, else navigate to home
      dispatch({
        type: types.GET_PROFILE,
        payload: {
          profileLoaded: true,
        },
      });
    }
  }
};

export const createProfile = ({
  firstName,
  lastName,
  email,
}: {
  firstName: string;
  lastName: string;
  email: string;
}) => async (dispatch: Function) => {
  let requestParams = {
    method: Methods.POST,
    endpoint: `/profile`,
    body: {
      firstName,
      lastName,
      email,
    },
  };

  await Request(dispatch, requestParams);

  await dispatch(getProfile());
};

export const updateProfile = (
  profileData: object,
  options: {
    deleteProfilePicture?: boolean;
    updateProfilePicture?: File;
  },
) => async (dispatch: Function) => {
  if (options?.deleteProfilePicture) {
    await dispatch(deleteProfilePicture());
  }

  if (options?.updateProfilePicture) {
    await dispatch(uploadProfilePicture(options.updateProfilePicture));
  }

  if (profileData) {
    let requestParams = {
      method: Methods.PATCH,
      endpoint: `/profile`,
      body: {
        ...profileData,
      },
    };

    await Request(dispatch, requestParams);
  }

  await dispatch(getProfile());
};

export const updateNotificationSettings = (enabled: boolean) => async (
  dispatch: Function,
) => {
  let requestParams = {
    method: Methods.PATCH,
    endpoint: `/notifications/settings`,
    body: {
      enabled,
    },
  };

  await Request(dispatch, requestParams);

  await dispatch(getProfile());
};

export const uploadProfilePicture = (file: File) => async (
  dispatch: Function,
) => {
  let formData = new FormData();

  formData.append('profilePicture', file);

  let requestParams = {
    method: Methods.PUT,
    endpoint: `/profile/picture`,
    body: formData,
  };

  await Request(dispatch, requestParams);
};

export const deleteProfilePicture = () => async (dispatch: Function) => {
  let requestParams = {
    method: Methods.DELETE,
    endpoint: `/profile/picture`,
  };

  await Request(dispatch, requestParams);
};

/**
 * This function sends an OTP to clients if a phone is provided, if an OTP is provided, it attempts to log them in.
 *
 * @param action - Expected to be either login or register. If OTP is provided, it is assumed to be login.
 * @param email - Client phone number
 * @param setLoading
 * @param activateModal
 * @param navigation
 * @param dispatch
 * @param OTP
 */
export const sendOTPorLogin = async ({
  sendPhone,
  sendCreds,
  email,
  setLoading,
  navigation,
  dispatch,
  OTP,
}: {
  sendPhone?: (email: string) => (dispatch: Function) => Promise<void>;
  sendCreds?: (
    email: string,
    OTP: string,
  ) => (dispatch: Function) => Promise<void>;
  email: string;
  setLoading: Dispatch<SetStateAction<boolean>>;
  navigation: StackNavigationProp<ParamListBase>;
  dispatch: Dispatch<any>;
  OTP?: string;
}) => {
  try {
    if (OTP && sendCreds) {
      await dispatch(sendCreds(email, OTP)); // Assumed to be login

      await dispatch(getProfile()); // Profile is fetched in order to check if the user already created a profile, if so, skip the onboarding and profile creation
    } else if (sendPhone) {
      let otp = await dispatch(sendPhone(email));
      setLoading(false);

      navigation.navigate('OtpConfirmation', { email, otp });
    }
  } catch (err) {
    // If connection has been aborted then there is no point in doing anything as the client is sent to the server dead screen
    if (!err.data?.connectionAborted) {
      if (err.display) {
        showMessage(
          i18n.t('common.error'),
          'error',
          err.message, // The message is expected to already be translated by this point
        );
      }
      setLoading(false);
    }

    return err;
  }
};
export const updateFcmToken = async (firebaseToken: string) => {
  store.getState().user.authenticated &&
    (await axios.patch(
      `${API_URL}/profile`,
      { firebaseToken },
      { withCredentials: true },
    ));
};
