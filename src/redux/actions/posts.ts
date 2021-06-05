import { toFormData } from './../../utils/utils';
import { Methods, Request } from '../../utils/Wrapper';

import * as types from '../types/posts';
import { IObject } from '../../interfaces/Common';

const POSTS_LIMIT = 10;

export const setOffset = (offset: number) => (dispatch: Function) => {
  dispatch({ type: types.SET_OFFSET, payload: offset });
};

export const getPosts =
  ({ offset }: { offset: number }) =>
  async (dispatch: Function) => {
    dispatch({ type: types.GET_POSTS_ATTEMPT });

    let requestParams = {
      method: Methods.GET,
      endpoint: `/posts?offset=${offset}&limit=${POSTS_LIMIT}`,
    };
    try {
      let res = await Request(dispatch, requestParams);

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

export const createPost =
  ({
    display,
    image,
    text,
    group,
  }: {
    text: string;
    image: any;
    display: 'all' | 'friends';
    group?: string;
  }) =>
  async (dispatch: Function) => {
    dispatch({ type: types.CREATE_POST_ATTEMPT });

    let obj: IObject = { display, postImage: image, text };

    if (group) obj['group'] = group;

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
      let res = await Request(dispatch, requestParams);

      dispatch({
        type: types.CREATE_POST_SUCCESS,
        payload: res.data.data,
      });
      return true;
    } catch (error) {
      dispatch({
        type: types.CREATE_POST_FAIL,
      });
      return false;
    }
  };

export const createEvent =
  ({
    display,
    image,
    text,
    group,
    event,
  }: {
    text: string;
    image?: any;
    display: 'all' | 'friends';
    group?: string;
    event: {
      eventType: string;
      location: { address: string; coordinates: number[] };
      startDate: Date;
      limitParticipants: number;
      pace: string;
    };
  }) =>
  async (dispatch: Function) => {
    dispatch({ type: types.CREATE_POST_ATTEMPT });

    let obj: IObject = { display, image, text, event };

    if (group) obj['group'] = group;

    const data = toFormData(obj);

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
