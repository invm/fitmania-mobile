import { showMessage, toFormData } from './../../utils/utils';
import { Methods, Request } from '../../utils/Wrapper';

import * as types from '../types/posts';
import { IObject } from '../../interfaces/Common';
import store, { RootState } from '..';
import i18n from '../../i18n';

const POSTS_LIMIT = 5;

export const resetPosts = () => (dispatch: Function) => {
  dispatch({ type: types.RESET_POSTS });
};

export const getPosts =
  (sports: string[] = []) =>
  async (dispatch: Function, getState: () => typeof RootState) => {
    dispatch({ type: types.GET_POSTS_ATTEMPT });

    const { offset } = getState().posts;

    let requestParams = {
      method: Methods.GET,
      endpoint: `/posts?offset=${offset}&limit=${POSTS_LIMIT}${sports
        .map(v => '&sports[]=' + v)
        .join('')}`,
    };

    try {
      let res = await Request(dispatch, requestParams);
      if (sports.length) await dispatch(resetPosts());
      dispatch({
        type: types.GET_POSTS_SUCCESS,
        payload: {
          data: res.data.data,
          postsExhausted: res.data.data.length < POSTS_LIMIT,
        },
      });
    } catch (error) {
      dispatch({
        type: types.GET_POSTS_FAIL,
      });
    }
  };

export const getPost = (_id: string) => async (dispatch: Function) => {
  dispatch({ type: types.GET_POST_ATTEMPT });

  let requestParams = {
    method: Methods.GET,
    endpoint: `/posts/${_id}`,
  };
  try {
    let res = await Request(dispatch, requestParams);

    dispatch({
      type: types.GET_POST_SUCCESS,
      payload: {
        data: res.data.data,
      },
    });
  } catch (error) {
    dispatch({
      type: types.GET_POST_FAIL,
    });
  }
};

export const updatePost =
  ({ _id, text }: { _id: string; text: string }) =>
  async (dispatch: Function) => {
    dispatch({ type: types.UPDATE_POST_ATTEMPT });

    let requestParams = {
      method: Methods.PATCH,
      endpoint: `/posts/${_id}`,
      body: { text },
    };
    try {
      await Request(dispatch, requestParams);

      dispatch({
        type: types.UPDATE_POST_SUCCESS,
      });
      dispatch(getPost(_id));
    } catch (error) {
      dispatch({
        type: types.UPDATE_POST_FAIL,
      });
    }
  };

export const deletePost = (_id: string) => async (dispatch: Function) => {
  dispatch({ type: types.DELETE_POST_ATTEMPT });

  let requestParams = {
    method: Methods.DELETE,
    endpoint: `/posts/${_id}`,
  };
  try {
    let res = await Request(dispatch, requestParams);

    dispatch({
      type: types.DELETE_POST_SUCCESS,
      payload: {
        data: res.data.data,
      },
    });
  } catch (error) {
    dispatch({
      type: types.DELETE_POST_FAIL,
    });
  }
};

export interface CreatePostFunctionProps {
  text: string;
  image?: any;
  display: string;
  group?: string;
  eventType?: string;
  pace?: string;
  startDate?: Date;
  openEvent?: boolean;
  limitParticipants?: number;
  address?: string;
  coordinates?: number[];
}

export const createPost = async ({
  display,
  text,
  image,
  eventType,
  limitParticipants,
  openEvent,
  pace,
  startDate,
  group,
  coordinates,
  address,
}: CreatePostFunctionProps) => {
  let obj: IObject = {
    display,
    text,
    ...(image && { postImage: image }),
    ...(eventType && { eventType }),
    ...(limitParticipants && { limitParticipants }),
    ...(openEvent !== undefined && { openEvent }),
    ...(pace && { pace }),
    ...(startDate && { startDate }),
    ...(group && { group }),
    ...(coordinates && { coordinates }),
    ...(address && { address }),
  };

  const data = toFormData(obj);

  let requestParams = {
    method: Methods.POST,
    endpoint: `/posts/`,
    body: data,
    headers: {
      'Content-Type': 'multipart/form-data; ',
    },
  };

  try {
    await Request(store.dispatch, requestParams);
  } catch (error) {
    throw new Error(error?.message);
  }
};

export const createEvent =
  (event: {
    [key: string]: any;
    text: string;
    image?: any;
    display: 'all' | 'friends';
    group?: string;
    event: {
      [key: string]: any;
      eventType: string;
      address: string;
      coordinates: number[];
      startDate: Date;
      limitParticipants: number;
      pace: string;
    };
  }) =>
  async (dispatch: Function) => {
    dispatch({ type: types.CREATE_POST_ATTEMPT });

    const data = new FormData();

    for (let dataKey in event) {
      if (dataKey === 'event') {
        // append nested object
        for (let key in event[dataKey]) {
          if (key === 'coordinates') {
            event['event']['coordinates'].forEach((coord, i) => {
              data.append(`event[location][coordinates][${i}]`, `${coord}`);
            });
          }
          data.append(`event[${key}]`, event[dataKey][key]);
        }
      } else {
        data.append(dataKey, event[dataKey]);
      }
    }

    let requestParams = {
      method: Methods.POST,
      endpoint: `/posts/`,
      body: data,
    };
    try {
      let res = await Request(dispatch, requestParams);

      dispatch({
        type: types.CREATE_POST_SUCCESS,
        payload: {
          data: res.data.data,
        },
      });
    } catch (error) {
      dispatch({
        type: types.CREATE_POST_FAIL,
      });
    }
  };
