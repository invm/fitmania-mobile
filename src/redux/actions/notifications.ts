import * as types from '../types/notifications';
import { Methods, Request } from '../../utils/Wrapper';
import i18n from '../../i18n';
import { RootState } from '..';
import { showMessage } from '../../utils/utils';

const NOTIFICATIONS_LIMIT = 10;

export const resetNotifications = () => (dispatch: Function) => {
	dispatch({ type: types.RESET_NOTIFICATIONS });
};

export const resetNotificationsCount = () => (dispatch: Function) => {
	dispatch({ type: types.RESET_NOTIFICATIONS_COUNT });
};

export const getNotificationsCount = () => async (dispatch: Function) => {
	let requestParams = {
		method: Methods.GET,
		endpoint: `/notifications/count`,
	};

	try {
		let res = await Request(dispatch, requestParams);

		dispatch({
			type: types.GET_NOTIFICATIONS_COUNT,
			payload: res.data.data.count,
		});
	} catch (error) {
		dispatch({
			type: types.GET_NOTIFICATIONS_COUNT,
			payload: 0,
		});
	}
};

export const getNotifications =
	() => async (dispatch: Function, getState: () => typeof RootState) => {
		dispatch({ type: types.GET_NOTIFICATIONS_ATTEMPT });

		const { offset } = getState().notifications;

		let requestParams = {
			method: Methods.GET,
			endpoint: `/notifications?offset=${offset}&limit=${NOTIFICATIONS_LIMIT}`,
		};
		try {
			let res = await Request(dispatch, requestParams);

			dispatch({
				type: types.GET_NOTIFICATIONS_SUCCESS,
				payload: {
					data: res.data.data,
					notificationsExhausted: res.data.data.length < NOTIFICATIONS_LIMIT,
				},
			});
		} catch (error) {
			dispatch({
				type: types.GET_NOTIFICATIONS_FAIL,
			});
		}
	};

export const deleteNotification =
	(id: string) => async (dispatch: Function) => {
		dispatch({ type: types.DELETE_NOTIFICATION_ATTEMPT, payload: id });

		let requestParams = {
			method: Methods.DELETE,
			endpoint: `/notifications/${id}`,
		};

		try {
			await Request(dispatch, requestParams);

			dispatch({
				type: types.DELETE_NOTIFICATION_SUCCESS,
				payload: id,
			});
		} catch (error) {
			showMessage(i18n.t('common.error'), error?.message, 'error');
			dispatch({
				type: types.DELETE_NOTIFICATION_FAIL,
			});
		}
	};
