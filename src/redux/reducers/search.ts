import {
  RESULTS_LOADED,
  SEND_SEARCH,
  SET_INPUT,
  CLEAR_SEARCH,
  SET_QUERY,
} from '../types/search';
import Action from './Action';

export const initialState = {
  loading: false,
  results: [],
  page: 0,
  searchExhausted: false,
  inputDirty: false,
  query: '',
};

export default function (state = initialState, action: Action) {
  switch (action.type) {
    case SET_QUERY:
      return {
        ...state,
        query: action.payload,
      };
    case CLEAR_SEARCH:
      return {
        ...state,
        inputDirty: false,
        results: [],
        loading: false,
        page: 0,
      };
    case SET_INPUT:
      return {
        ...state,
        inputDirty: action.payload,
      };
    case RESULTS_LOADED:
      return {
        ...state,
        results: action.payload.data,
        loading: false,
        searchExhausted: action.payload.searchExhausted,
        page: !action.payload.searchExhausted ? state.page + 1 : state.page,
      };
    case SEND_SEARCH:
      return {
        ...state,
        loading: true,
      };
    default:
      return state;
  }
}
