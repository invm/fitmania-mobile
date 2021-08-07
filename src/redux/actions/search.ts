import { RootState } from '..';
import { Methods, Request } from '../../utils/Wrapper';
import { RESULTS_LOADED, SEND_SEARCH, CLEAR_SEARCH } from '../types/search';

const SEARCH_RESULTS_LIMIT = 10;

export const clearSearch = () => async (dispatch: Function) =>
  dispatch({ type: CLEAR_SEARCH });

export const search =
  (query: string) =>
  async (dispatch: Function, getState: () => typeof RootState) => {
    dispatch({ type: SEND_SEARCH });

    const { groupsOffset, usersOffset } = getState().search;

    let requestParams = {
      method: Methods.GET,
      endpoint: `/friends/search?q=${query}&offset=${
        groupsOffset > usersOffset ? groupsOffset : usersOffset
      }&limit=${SEARCH_RESULTS_LIMIT}`,
    };

    let res = await Request(dispatch, requestParams);

    dispatch({
      type: RESULTS_LOADED,
      payload: {
        ...res.data.data,
        usersExhausted: res.data.data.users.length < SEARCH_RESULTS_LIMIT,
        groupsExhausted: res.data.data.groups.length < SEARCH_RESULTS_LIMIT,
      },
    });
  };
