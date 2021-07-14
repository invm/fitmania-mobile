import IPost from '../../interfaces/Post';
import * as types from '../types/posts';
import Action from './Action';

export interface postsInitialState {
  posts: IPost[];
  postsExhausted: boolean;
  postsLoading: boolean;
  offset: number;
  singlePostId: string;
  singlePostLoading: boolean;
}

export const initialState: postsInitialState = {
  posts: [],
  postsLoading: false,
  postsExhausted: false,
  offset: 0,
  singlePostId: '',
  singlePostLoading: false,
};

export default function state(state = initialState, action: Action) {
  switch (action.type) {
    case types.RESET_POSTS:
      return {
        ...state,
        offset: 0,
        posts: [],
        postsExhausted: false,
      };
    case types.CREATE_POST_SUCCESS:
      return { ...state, posts: [...state.posts, action.payload] };
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
        offset: !action.payload.postsExhausted ? state.offset + 1 : state.offset,
      };
    default:
      return state;
  }
}
