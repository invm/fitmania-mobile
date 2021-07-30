import { ParamListBase } from '@react-navigation/native';
import { Request, Methods } from '../../utils/Wrapper';
import * as types from '../types/user';
import { Dispatch, SetStateAction } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showMessage, toFormData } from '../../utils/utils';
import i18n from '../../i18n';
import { API_URL, ENV } from './../../../env';
import store from '../index';
import axios from 'axios';
import messaging from '@react-native-firebase/messaging';
import IUser from '../../interfaces/User';
import { API_KEY } from '../../../sensitive';

export const POSTS_LIMIT = 10;

export const verifySession = () => async (dispatch: Function) => {
  try {
    let requestParams = {
      method: Methods.GET,
      endpoint: `/auth/`,
    };

    await Request(dispatch, requestParams);
    dispatch({ type: types.AUTHENTICATE, payload: true });
    dispatch(getProfile());
  } catch (error) {
    dispatch({ type: types.AUTHENTICATE, payload: false });
  }
  const fcmToken = await messaging().getToken();
  await AsyncStorage.setItem('fcmToken', fcmToken);
  await updateFcmToken(fcmToken);
};

export const register =
  ({
    email,
    name,
    lastname,
  }: {
    email: string;
    name?: string | undefined;
    lastname?: string | undefined;
  }) =>
  async (dispatch: Function) => {
    let requestParams = {
      method: Methods.POST,
      endpoint: `/auth/register`,
      body: {
        email,
        name,
        lastname,
      },
    };

    await Request(dispatch, requestParams);
  };

export const login =
  ({ email }: { email: string }) =>
  async (dispatch: Function) => {
    let requestParams = {
      method: Methods.POST,
      endpoint: `/auth/otp`,
      body: {
        email: email,
      },
    };

    let res = await Request(dispatch, requestParams);

    return (ENV !== 'production' && res?.data?.data?.otp) ?? null;
  };

export const verifyOTP =
  (email: string, otp: string) => async (dispatch: Function) => {
    let requestParams = {
      method: Methods.POST,
      endpoint: `/auth/login`,
      body: {
        email,
        otp,
      },
    };

    try {
      await Request(dispatch, requestParams);
      dispatch(verifySession());
    } catch (error) {
      showMessage(
        i18n.t('common.error'),
        'error',
        error.message, // The message is expected to already be translated by this point
      );
    }
  };

export const logout = () => async (dispatch: Function) => {
  let requestParams = {
    method: Methods.POST,
    endpoint: `/auth/logout`,
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
    endpoint: `/user/`,
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

export const createProfile =
  ({ name, lastname }: { name: string; lastname: string }) =>
  async (dispatch: Function) => {
    let requestParams = {
      method: Methods.PATCH,
      endpoint: `/user`,
      body: {
        name,
        lastname,
      },
    };

    await Request(dispatch, requestParams);

    await dispatch(getProfile());
  };

export const updateProfile =
  (profileData: object) => async (dispatch: Function) => {
    let body = toFormData(profileData);

    let requestParams = {
      method: Methods.PATCH,
      endpoint: `/user`,
      body,
    };
    try {
      await Request(dispatch, requestParams);
      await dispatch(getProfile());
    } catch (error) {
      showMessage(i18n.t('common.error'), error?.message, 'error');
    }
  };

export const uploadProfilePicture =
  (file: File) => async (dispatch: Function) => {
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
 * This function sends an OTP to clients if a email is provided, if an OTP is provided, it attempts to log them in.
 *
 * @param action - Expected to be either login or register. If OTP is provided, it is assumed to be login.
 * @param email - Client email number
 * @param setLoading
 * @param activateModal
 * @param navigation
 * @param dispatch
 * @param OTP
 */
export const sendOTPorLogin = async ({
  sendEmail,
  sendCreds,
  data,
  setLoading,
  navigation,
  dispatch,
  OTP,
}: {
  sendEmail?: ({
    email,
    name,
    lastname,
  }: {
    email: string;
    name?: string;
    lastname?: string;
  }) => (dispatch: Function) => Promise<void>;
  sendCreds?: (
    email: string,
    OTP: string,
  ) => (dispatch: Function) => Promise<void>;
  data: { email: string; name?: string; lastname?: string };
  setLoading: Dispatch<SetStateAction<boolean>>;
  navigation: StackNavigationProp<ParamListBase>;
  dispatch: Dispatch<any>;
  OTP?: string;
}) => {
  try {
    if (OTP && sendCreds) {
      await dispatch(sendCreds(data.email, OTP)); // Assumed to be login

      await dispatch(getProfile()); // Profile is fetched in order to check if the user already created a profile, if so, skip the onboarding and profile creation
    } else if (sendEmail) {
      let otp = await dispatch(sendEmail(data));
      setLoading(false);

      navigation.navigate('OtpConfirmation', { email: data.email, otp });
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
export const updateFcmToken = async (fcmToken: string) => {
  let cookie = await AsyncStorage.getItem('cookie');

  cookie &&
    store.getState().user.authenticated &&
    (await axios.patch(
      `${API_URL}/user`,
      { fcmToken },
      {
        withCredentials: true,
        headers: {
          'API-KEY': API_KEY,
          cookie,
        },
      },
    ));
};

export const getUser = async (id: string) => {
  let requestParams = {
    method: Methods.GET,
    endpoint: `/user/${id}`,
  };

  return await Request(store.dispatch, requestParams);
};

export const getUsersPosts = async (id: string, offset: number) => {
  let requestParams = {
    method: Methods.GET,
    endpoint: `/posts?offset=${offset}&limit=${POSTS_LIMIT}&userId=${id}`,
  };

  return await Request(store.dispatch, requestParams);
};
