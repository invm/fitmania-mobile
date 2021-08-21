import INotification from '../../interfaces/Notification';
import * as types from '../types/notifications';
import Action from './Action';

export interface notificationsInitialState {
	count: number;
	notifications: INotification[];
	notificationsLoading: boolean;
	notificationsExhausted: boolean;
	offset: number;
}

export const initialState: notificationsInitialState = {
	count: 0,
	notifications: [],
	notificationsLoading: false,
	notificationsExhausted: false,
	offset: 0,
};

export default function state(state = initialState, action: Action) {
	switch (action.type) {
		case types.RESET_NOTIFICATIONS_COUNT:
			return {
				...state,
				count: 0,
			};
		case types.RESET_NOTIFICATIONS:
			return initialState;
		case types.GET_NOTIFICATIONS_COUNT:
			return {
				...state,
				count: action.payload,
			};
		case types.GET_NOTIFICATIONS_ATTEMPT:
			return {
				...state,
				notificationsLoading: true,
			};
		case types.GET_NOTIFICATIONS_SUCCESS:
			return {
				...state,
				notificationsLoading: false,
				notificationsExhausted: action.payload.notificationsExhausted,
				offset: action.payload.notificationsExhausted
					? state.offset
					: state.offset + 1,
				notifications: [...state.notifications, ...action.payload.data],
			};
		case types.GET_NOTIFICATIONS_FAIL:
			return {
				...state,
				notificationsLoading: false,
			};
		case types.DELETE_NOTIFICATION_ATTEMPT:
			return {
				...state,
			};
		case types.DELETE_NOTIFICATION_SUCCESS:
			return {
				...state,
				notifications: [
					...state.notifications.filter((item) => item._id !== action.payload),
				],
			};
		case types.DELETE_NOTIFICATION_FAIL:
			return {
				...state,
			};
		default:
			return state;
	}
}
