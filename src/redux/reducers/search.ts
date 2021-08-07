import IGroup from '../../interfaces/Group';
import IUser from '../../interfaces/User';
import { RESULTS_LOADED, SEND_SEARCH, CLEAR_SEARCH } from '../types/search';
import Action from './Action';

export interface searchInitialState {
  users: IUser[];
  usersOffset: number;
  usersExhausted: boolean;
  usersLoading: boolean;
  groups: IGroup[];
  groupsOffset: number;
  groupsLoading: boolean;
  groupsExhausted: boolean;
}

export const initialState: searchInitialState = {
  users: [],
  usersOffset: 0,
  usersExhausted: false,
  usersLoading: false,
  groups: [],
  groupsOffset: 0,
  groupsLoading: false,
  groupsExhausted: false,
};

export default function state(state = initialState, action: Action) {
  switch (action.type) {
    case CLEAR_SEARCH:
      return initialState;
    case RESULTS_LOADED:
      return {
        ...state,
        usersLoading: false,
        groupsLoading: false,
        users: [...state.users, ...action.payload.users],
        groups: [...state.groups, ...action.payload.groups],
        usersOffset: !action.payload.usersExhausted
          ? state.usersOffset + 1
          : state.usersOffset,
        usersExhausted: action.payload.usersExhausted,
        groupsOffset: !action.payload.groupsExhausted
          ? state.groupsOffset + 1
          : state.groupsOffset,
        groupsExhausted: action.payload.groupsExhausted,
      };
    case SEND_SEARCH:
      return {
        ...state,
        groupsLoading: state.groupsExhausted ? false : true,
        usersLoading: state.usersExhausted ? false : true,
      };
    default:
      return state;
  }
}
