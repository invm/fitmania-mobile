import IPost from '../../interfaces/Post';
import * as types from '../types/posts';
import Action from './Action';

export interface postsInitialState {
  posts: IPost[];
  postsExhausted: boolean;
  postsLoading: boolean;
  offset: number;
  singlePost: IPost;
  singlePostId: string;
  singlePostLoading: boolean;
}

export const initialState: postsInitialState = {
  posts: [],
  postsLoading: false,
  postsExhausted: false,
  offset: 0,
  singlePost: {} as IPost,
  singlePostId: '',
  singlePostLoading: true,
};

export default function state(state = initialState, action: Action) {
  switch (action.type) {
    case types.UPDATE_POST_ATTEMPT:
    case types.DELETE_POST_ATTEMPT:
      return {
        ...state,
        singlePostId: action.payload,
        singlePostLoading: true,
      };
    case types.DELETE_POST_FAIL:
    case types.UPDATE_POST_FAIL:
      return {
        ...state,
        singlePostId: '',
        singlePostLoading: true,
      };
    case types.DELETE_POST_SUCCESS:
      return {
        ...state,
        singlePostId: '',
        singlePostLoading: true,
        posts: [...state.posts.filter(v => v._id !== action.payload)],
      };
    case types.RESET_SINGLE_POST:
      return {
        ...state,
        singlePost: {} as IPost,
        singlePostId: '',
        singlePostLoading: true,
      };
    case types.GET_POST_ATTEMPT:
      return { ...state, singlePostLoading: true, singlePost: {} };
    case types.GET_POST_FAIL:
      return { ...state, singlePostLoading: false, singlePost: {} };
    case types.GET_POST_SUCCESS:
      return {
        ...state,
        singlePostLoading: false,
        singlePost: action.payload,
        posts: [
          ...state.posts.map(v => {
            if (v._id === action.payload._id) {
              v = action.payload;
            }
            return v;
          }),
        ],
      };
    case types.RESET_POSTS:
      return {
        ...state,
        offset: 0,
        posts: [],
        postsExhausted: false,
      };
    case types.GET_POSTS_ATTEMPT:
      return { ...state, postsLoading: true };
    case types.GET_POSTS_FAIL:
      return { ...state, postsLoading: false };
    case types.GET_POSTS_SUCCESS:
      return {
        ...state,
        posts: [...state.posts, ...action.payload.data],
        postsLoading: false,
        postsExhausted: action.payload.postsExhausted,
        offset: !action.payload.postsExhausted
          ? state.offset + 1
          : state.offset,
      };
    default:
      return state;
  }
}
