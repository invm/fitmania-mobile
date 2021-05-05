import { Methods, Request } from '../../utils/Wrapper';
import {
  RESULTS_LOADED,
  SEND_SEARCH,
  GETTING_TAGS,
  LOADED_TAGS,
  SET_QUERY
} from '../types/search';

const SEARCH_RESULTS_LIMIT = 10;

export const setQuery = (query: string) => async (dispatch: Function) =>
  dispatch({ type: SET_QUERY, payload: query });

export const searchBusinesses = (query: string, page: number) => async (
  dispatch: Function,
) => {
  dispatch({ type: SEND_SEARCH });
  let requestParams = {
    method: Methods.GET,
    endpoint: `/businesses/search?query=${query}&offset=${page}&limit=${SEARCH_RESULTS_LIMIT}`,
  };

  let res = await Request(dispatch, requestParams);

  dispatch({
    type: RESULTS_LOADED,
    payload: {
      data: res.data.data,
      searchExhausted: res.data.data.length < SEARCH_RESULTS_LIMIT,
    },
  });
};

export const getTags = () => async (dispatch: Function) => {
  dispatch({ type: GETTING_TAGS });

  let requestParams = {
    method: Methods.GET,
    endpoint: `/businesses/search-tags`,
  };

  let res = await Request(dispatch, requestParams);

  dispatch({
    type: LOADED_TAGS,
    payload: res.data.data,
  });
};
