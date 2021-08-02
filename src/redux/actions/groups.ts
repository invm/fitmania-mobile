import { Methods, Request } from '../../utils/Wrapper';
import * as types from '../types/groups';
import i18n from '../../i18n';
import store, { RootState } from '..';
import { showMessage } from '../../utils/utils';

export const GROUPS_LIMIT = 10;

export const resetGroups = () => (dispatch: Function) => {
  dispatch({ type: types.RESET_GROUPS });
};

export const resetSingleGroup = () => (dispatch: Function) => {
  dispatch({ type: types.RESET_SINGLE_GROUP });
};

export const getGroups =
  (sports: string[] = []) =>
  async (dispatch: Function, getState: () => typeof RootState) => {
    dispatch({ type: types.GET_GROUPS_ATTEMPT });

    const { offset } = getState().groups;

    let requestParams = {
      method: Methods.GET,
      endpoint: `/groups?offset=${offset}&limit=${GROUPS_LIMIT}${sports
        .map(v => '&sports[]=' + v)
        .join('')}`,
    };

    try {
      let res = await Request(dispatch, requestParams);
      if (sports.length) await dispatch(resetGroups());
      dispatch({
        type: types.GET_GROUPS_SUCCESS,
        payload: {
          data: res.data.data,
          groupsExhausted: res.data.data.length < GROUPS_LIMIT,
        },
      });
    } catch (error) {
      dispatch({
        type: types.GET_GROUPS_FAIL,
      });
    }
  };

export const getGroup = async (_id: string) => {
  let requestParams = {
    method: Methods.GET,
    endpoint: `/groups/${_id}`,
  };
  try {
    let { response } = await Request(store.dispatch, requestParams);

    return response.data.data;
  } catch (error) {
    showMessage(i18n.t('common.error'), 'error', error?.message);
  }
};

export const createGroup = async ({
  title,
  sport,
}: {
  title: string;
  sport: string;
}) => {
  let requestParams = {
    method: Methods.POST,
    endpoint: `/groups`,
    body: { title, sport },
  };
  try {
    await Request(store.dispatch, requestParams);
  } catch (error) {
    showMessage(i18n.t('common.error'), 'error', error?.message);
  }
};

export const deleteGroup = async (id: string) => {
  let requestParams = {
    method: Methods.DELETE,
    endpoint: `/groups/${id}`,
  };
  await Request(store.dispatch, requestParams);
};

export const joinGroup = async (groupId: string) => {
  let requestParams = {
    method: Methods.POST,
    endpoint: `/groups/join/${groupId}`,
  };
  try {
    await Request(store.dispatch, requestParams);
  } catch (error) {
    showMessage(i18n.t('common.error'), 'error', error?.message);
  }
};

export const leaveGroup = async (groupId: string) => {
  let requestParams = {
    method: Methods.POST,
    endpoint: `/groups/leave/${groupId}`,
  };
  try {
    await Request(store.dispatch, requestParams);
  } catch (error) {
    showMessage(i18n.t('common.error'), 'error', error?.message);
  }
};
