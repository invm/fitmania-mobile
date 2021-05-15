import { Methods, Request } from '../../utils/Wrapper';

import * as types from '../types/posts';

const POSTS_LIMIT = 10;

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
