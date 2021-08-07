import IBefriendRequest from '../../interfaces/BefriendRequest';
import IUser from '../../interfaces/User';
import * as types from '../types/friends';
import Action from './Action';

export interface friendsInitialState {
  friends: IUser[];
  friendsExhausted: boolean;
  friendsLoading: boolean;
  offset: number;
  friendsSuggestions: IUser[];
  friendsSuggestionsLoading: boolean;
  requests: IBefriendRequest[];
  requestsOffset: number;
  requestsExhausted: boolean;
  requestsLoading: boolean;
}

export const initialState: friendsInitialState = {
  friends: [],
  friendsLoading: false,
  friendsExhausted: false,
  offset: 0,
  friendsSuggestions: [],
  friendsSuggestionsLoading: false,
  requests: [],
  requestsLoading: false,
  requestsOffset: 0,
  requestsExhausted: false,
};

export default function state(state = initialState, action: Action) {
  switch (action.type) {
    case types.RESET_FRIENDS_REQUESTS:
      return {
        ...state,
        requests: [],
        requestsLoading: false,
        requestsOffset: 0,
        requestsExhausted: false,
      };
    case types.RESET_FRIENDS_SUGGESTIONS:
      return {
        ...state,
        friendsSuggestions: [],
        friendsSuggestionsLoading: false,
      };
    case types.ADD_FRIEND_SUCCESS:
      return {
        ...state,
        friendsSuggestions: [
          ...state.friendsSuggestions.filter(v => v._id !== action.payload),
        ],
      };
    case types.REMOVE_FRIEND_SUCCESS:
      return {
        ...state,
        friends: [...state.friends.filter(v => v._id !== action.payload)],
      };
    case types.DECLINE_FRIEND_REQUEST_SUCCESS:
    case types.ACCEPT_FRIEND_REQUEST_SUCCESS:
      return {
        ...state,
        requests: [
          ...state.requests.filter(v => v.from._id !== action.payload),
        ],
      };
    case types.GET_FRIENDS_SUGGESTIONS_ATTEMPT:
      return {
        ...state,
        friendsSuggestionsLoading: true,
      };
    case types.GET_FRIENDS_SUGGESTIONS_FAIL:
      return {
        ...state,
        friendsSuggestionsLoading: false,
      };
    case types.GET_FRIENDS_SUGGESTIONS_SUCCESS:
      return {
        ...state,
        friendsSuggestionsLoading: false,
        friendsSuggestions: action.payload,
      };
    case types.RESET_FRIENDS:
      return {
        ...state,
        friends: [],
        friendsLoading: false,
        friendsExhausted: false,
        offset: 0,
      };
    case types.GET_FRIENDS_ATTEMPT:
      return {
        ...state,
        friendsLoading: true,
      };
    case types.GET_FRIENDS_SUCCESS:
      return {
        ...state,
        friendsLoading: false,
        friends: [...state.friends, ...action.payload.data],
        friendsExhausted: action.payload.friendsExhausted,
        offset: !action.payload.friendsExhausted
          ? state.offset + 1
          : state.offset,
      };
    case types.GET_FRIENDS_FAIL:
      return {
        ...state,
        friendsLoading: false,
      };
    case types.GET_FRIENDS_REQUESTS_ATTEMPT:
      return {
        ...state,
        requestsLoading: true,
      };
    case types.GET_FRIENDS_REQUESTS_SUCCESS:
      return {
        ...state,
        requestsLoading: false,
        requests: [...state.requests, ...action.payload.data],
        requestsExhausted: action.payload.requestsExhausted,
        requestsOffset: !action.payload.requestsExhausted
          ? state.requestsOffset + 1
          : state.requestsOffset,
      };
    case types.GET_FRIENDS_REQUESTS_FAIL:
      return {
        ...state,
        requestsLoading: false,
      };
    default:
      return state;
  }
}
