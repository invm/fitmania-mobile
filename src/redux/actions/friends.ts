import { RootState } from '..';
import { Methods, Request } from '../../utils/Wrapper';
import * as types from '../types/friends';

export const FRIENDS_LIMIT = 10;

export const resetSuggestions = () => (dispatch: Function) => {
  dispatch({ type: types.RESET_FRIENDS_SUGGESTIONS });
};

export const resetFriendRequests = () => (dispatch: Function) => {
  dispatch({ type: types.RESET_FRIENDS_REQUESTS });
};

export const resetFriends = () => (dispatch: Function) => {
  dispatch({ type: types.RESET_FRIENDS });
};

export const getFriends =
  () => async (dispatch: Function, getState: () => typeof RootState) => {
    dispatch({ type: types.GET_FRIENDS_ATTEMPT });

    const { offset } = getState().friends;

    let requestParams = {
      method: Methods.GET,
      endpoint: `/friends?offset=${offset}&limit=${FRIENDS_LIMIT}`,
    };

    try {
      let res = await Request(dispatch, requestParams);
      dispatch({
        type: types.GET_FRIENDS_SUCCESS,
        payload: {
          data: res.data.data,
          friendsExhausted: res.data.data.length < FRIENDS_LIMIT,
        },
      });
    } catch (error) {
      dispatch({
        type: types.GET_FRIENDS_FAIL,
      });
    }
  };

export const getFriendsSuggestions = () => async (dispatch: Function) => {
  dispatch({ type: types.GET_FRIENDS_SUGGESTIONS_ATTEMPT });

  let requestParams = {
    method: Methods.GET,
    endpoint: `/friends/suggestions`,
  };

  try {
    let res = await Request(dispatch, requestParams);
    dispatch({
      type: types.GET_FRIENDS_SUGGESTIONS_SUCCESS,
      payload: res.data.data,
    });
  } catch (error) {
    dispatch({
      type: types.GET_FRIENDS_SUGGESTIONS_FAIL,
    });
  }
};

export const getFriendRequests =
  () => async (dispatch: Function, getState: () => typeof RootState) => {
    dispatch({ type: types.GET_FRIENDS_REQUESTS_ATTEMPT });

    const { requestsOffset } = getState().friends;

    let requestParams = {
      method: Methods.GET,
      endpoint: `/friends/requests?offset=${requestsOffset}&limit=${FRIENDS_LIMIT}`,
    };

    try {
      let res = await Request(dispatch, requestParams);
      dispatch({
        type: types.GET_FRIENDS_REQUESTS_SUCCESS,
        payload: {
          data: res.data.data,
          requestsExhausted: res.data.data.length < FRIENDS_LIMIT,
        },
      });
    } catch (error) {
      dispatch({
        type: types.GET_FRIENDS_REQUESTS_FAIL,
      });
    }
  };

export const removeFriend = (userId: string) => async (dispatch: Function) => {
  dispatch({ type: types.REMOVE_FRIEND_ATTEMPT });

  let requestParams = {
    method: Methods.POST,
    endpoint: `/friends/remove/${userId}`,
  };

  try {
    await Request(dispatch, requestParams);
    dispatch({
      type: types.REMOVE_FRIEND_SUCCESS,
      payload: userId,
    });
  } catch (error) {
    dispatch({
      type: types.REMOVE_FRIEND_FAIL,
    });
  }
};

export const addFriend = (userId: string) => async (dispatch: Function) => {
  dispatch({ type: types.ADD_FRIEND_ATTEMPT });

  let requestParams = {
    method: Methods.POST,
    endpoint: `/friends/add/${userId}`,
  };

  try {
    await Request(dispatch, requestParams);
    dispatch({
      type: types.ADD_FRIEND_SUCCESS,
      payload: userId,
    });
    dispatch(resetFriends());
    dispatch(getFriends());
  } catch (error) {
    dispatch({
      type: types.ADD_FRIEND_FAIL,
    });
  }
};

export const acceptFriendRequest =
  (userId: string) => async (dispatch: Function) => {
    dispatch({ type: types.ACCEPT_FRIEND_REQUEST_ATTEMPT });

    let requestParams = {
      method: Methods.POST,
      endpoint: `/friends/accept/${userId}`,
    };

    try {
      await Request(dispatch, requestParams);
      dispatch({
        type: types.ACCEPT_FRIEND_REQUEST_SUCCESS,
        payload: userId,
      });
      dispatch(resetFriends());
      dispatch(getFriends());
    } catch (error) {
      dispatch({
        type: types.ACCEPT_FRIEND_REQUEST_FAIL,
      });
    }
  };

export const declineFriendRequest =
  (userId: string) => async (dispatch: Function) => {
    dispatch({ type: types.DECLINE_FRIEND_REQUEST_ATTEMPT });

    let requestParams = {
      method: Methods.POST,
      endpoint: `/friends/reject/${userId}`,
    };

    try {
      await Request(dispatch, requestParams);
      dispatch({
        type: types.DECLINE_FRIEND_REQUEST_SUCCESS,
        payload: userId,
      });
      dispatch(resetFriends());
      dispatch(getFriends());
    } catch (error) {
      dispatch({
        type: types.DECLINE_FRIEND_REQUEST_FAIL,
      });
    }
  };
