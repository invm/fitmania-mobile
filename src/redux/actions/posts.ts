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

export const resetSinglePost = () => (dispatch: Function) => {
  dispatch({ type: types.RESET_SINGLE_POST });
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
    let { response } = await Request(dispatch, requestParams);

    dispatch({
      type: types.GET_POST_SUCCESS,
      payload: response.data.data,
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
    dispatch({ type: types.UPDATE_POST_ATTEMPT, payload: _id });

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
  dispatch({ type: types.DELETE_POST_ATTEMPT, payload: _id });

  let requestParams = {
    method: Methods.DELETE,
    endpoint: `/posts/${_id}`,
  };
  try {
    await Request(dispatch, requestParams);

    dispatch({
      type: types.DELETE_POST_SUCCESS,
      payload: _id,
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

export const sharePost = (postId: string) => async (dispatch: Function) => {
  let requestParams = {
    method: Methods.GET,
    endpoint: `/posts/${postId}/share`,
  };

  try {
    await Request(dispatch, requestParams);

    dispatch({
      type: types.SHARE_POST_SUCCESS,
    });
    dispatch(getPost(postId));
  } catch (error) {
    showMessage(i18n.t('common.error'), error?.message, 'error');
    dispatch({
      type: types.SHARE_POST_FAIL,
    });
  }
};

export const unsharePost = (postId: string) => async (dispatch: Function) => {
  let requestParams = {
    method: Methods.GET,
    endpoint: `/posts/${postId}/unshare`,
  };

  try {
    await Request(dispatch, requestParams);

    dispatch({
      type: types.UNSHARE_POST_SUCCESS,
    });
    dispatch(getPost(postId));
  } catch (error) {
    showMessage(i18n.t('common.error'), error?.message, 'error');
    dispatch({
      type: types.UNSHARE_POST_FAIL,
    });
  }
};

export const likePost = (postId: string) => async (dispatch: Function) => {
  let requestParams = {
    method: Methods.GET,
    endpoint: `/posts/${postId}/like`,
  };

  try {
    await Request(dispatch, requestParams);

    dispatch({
      type: types.LIKE_POST_SUCCESS,
    });
    dispatch(getPost(postId));
  } catch (error) {
    showMessage(i18n.t('common.error'), error?.message, 'error');
    dispatch({
      type: types.LIKE_POST_FAIL,
    });
  }
};

export const dislikePost = (postId: string) => async (dispatch: Function) => {
  let requestParams = {
    method: Methods.GET,
    endpoint: `/posts/${postId}/dislike`,
  };

  try {
    await Request(dispatch, requestParams);

    dispatch({
      type: types.DISLIKE_POST_SUCCESS,
    });
    dispatch(getPost(postId));
  } catch (error) {
    showMessage(i18n.t('common.error'), error?.message, 'error');
    dispatch({
      type: types.DISLIKE_POST_FAIL,
    });
  }
};

export const createComment =
  (postId: string, text: string) => async (dispatch: Function) => {
    let requestParams = {
      method: Methods.POST,
      endpoint: `/posts/${postId}/comments`,
      body: { text },
    };

    try {
      await Request(dispatch, requestParams);

      dispatch({
        type: types.CREATE_COMMENT_SUCCESS,
      });
      dispatch(getPost(postId));
    } catch (error) {
      showMessage(i18n.t('common.error'), error?.message, 'error');
      dispatch({
        type: types.CREATE_COMMENT_FAIL,
      });
    }
  };

export const editComment =
  (postId: string, commentId: string, text: string) =>
  async (dispatch: Function) => {
    let requestParams = {
      method: Methods.PATCH,
      endpoint: `/posts/${postId}/comments/${commentId}`,
      body: { text },
    };

    try {
      await Request(dispatch, requestParams);

      dispatch({
        type: types.UPDATE_COMMENT_SUCCESS,
      });
      dispatch(getPost(postId));
    } catch (error) {
      showMessage(i18n.t('common.error'), error?.message, 'error');
      dispatch({
        type: types.UPDATE_COMMENT_FAIL,
      });
    }
  };

export const deleteComment =
  (postId: string, commentId: string) => async (dispatch: Function) => {
    let requestParams = {
      method: Methods.DELETE,
      endpoint: `/posts/${postId}/comments/${commentId}`,
    };

    try {
      await Request(dispatch, requestParams);

      dispatch({
        type: types.DELETE_COMMENT_SUCCESS,
      });
      dispatch(getPost(postId));
    } catch (error) {
      showMessage(i18n.t('common.error'), error?.message, 'error');
      dispatch({
        type: types.DELETE_COMMENT_FAIL,
      });
    }
  };

export const joinEvent = (postId: string) => async (dispatch: Function) => {
  let requestParams = {
    method: Methods.GET,
    endpoint: `/posts/${postId}/event/join/`,
  };

  try {
    await Request(dispatch, requestParams);

    dispatch({
      type: types.JOIN_EVENT_SUCCESS,
    });
    dispatch(getPost(postId));
  } catch (error) {
    showMessage(i18n.t('common.error'), error?.message, 'error');
    dispatch({
      type: types.JOIN_EVENT_FAIL,
    });
  }
};

export const leaveEvent = (postId: string) => async (dispatch: Function) => {
  let requestParams = {
    method: Methods.GET,
    endpoint: `/posts/${postId}/event/leave/`,
  };

  try {
    await Request(dispatch, requestParams);

    dispatch({
      type: types.LEAVE_EVENT_SUCCESS,
    });
    dispatch(getPost(postId));
  } catch (error) {
    showMessage(i18n.t('common.error'), error?.message, 'error');
    dispatch({
      type: types.LEAVE_EVENT_FAIL,
    });
  }
};

export const askToJoinEvent =
  (postId: string) => async (dispatch: Function) => {
    let requestParams = {
      method: Methods.GET,
      endpoint: `/posts/${postId}/event/ask-to-join`,
    };

    try {
      await Request(dispatch, requestParams);

      dispatch({
        type: types.ASKED_TO_JOIN_EVENT_SUCCESS,
      });
      dispatch(getPost(postId));
    } catch (error) {
      showMessage(i18n.t('common.error'), error?.message, 'error');
      dispatch({
        type: types.ASKED_TO_JOIN_EVENT_FAIL,
      });
    }
  };

export const admitToEvent =
  (postId: string, userId: string) => async (dispatch: Function) => {
    let requestParams = {
      method: Methods.GET,
      endpoint: `/posts/${postId}/event/allow/${userId}`,
    };

    try {
      await Request(dispatch, requestParams);

      dispatch({
        type: types.ASKED_TO_JOIN_EVENT_SUCCESS,
      });
      dispatch(getPost(postId));
    } catch (error) {
      showMessage(i18n.t('common.error'), error?.message, 'error');
      dispatch({
        type: types.ASKED_TO_JOIN_EVENT_FAIL,
      });
    }
  };

export const rejectJoinRequest =
  (postId: string, userId: string) => async (dispatch: Function) => {
    let requestParams = {
      method: Methods.GET,
      endpoint: `/posts/${postId}/event/reject/${userId}`,
    };

    try {
      await Request(dispatch, requestParams);

      dispatch({
        type: types.REJECT_FROM_EVENT_SUCCESS,
      });
      dispatch(getPost(postId));
    } catch (error) {
      showMessage(i18n.t('common.error'), error?.message, 'error');
      dispatch({
        type: types.REJECT_FROM_EVENT_FAIL,
      });
    }
  };

export const removeFromRejectedList =
  (postId: string, userId: string) => async (dispatch: Function) => {
    let requestParams = {
      method: Methods.GET,
      endpoint: `/posts/${postId}/event/remove-from-rejected/${userId}`,
    };

    try {
      await Request(dispatch, requestParams);

      dispatch({
        type: types.REMOVE_FROM_REJECTED_SUCCESS,
      });
      dispatch(getPost(postId));
    } catch (error) {
      showMessage(i18n.t('common.error'), error?.message, 'error');
      dispatch({
        type: types.REMOVE_FROM_REJECTED_FAIL,
      });
    }
  };
