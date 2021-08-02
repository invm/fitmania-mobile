import * as types from '../types/groups';
import IGroup from '../../interfaces/Group';
import Action from './Action';

export interface groupsInitialState {
  groups: IGroup[];
  groupsExhausted: boolean;
  groupsLoading: boolean;
  offset: number;
  singleGroup: IGroup;
  singleGroupId: string;
  singleGroupLoading: boolean;
}

export const initialState: groupsInitialState = {
  groups: [],
  groupsLoading: false,
  groupsExhausted: false,
  offset: 0,
  singleGroup: {} as IGroup,
  singleGroupId: '',
  singleGroupLoading: true,
};

export default function state(state = initialState, action: Action) {
  switch (action.type) {
    case types.RESET_GROUPS:
      return initialState;
    case types.RESET_SINGLE_GROUP:
      return {
        ...state,
        singleGroupId: '',
        singleGroup: {},
        singleGroupLoading: false,
      };
    case types.GET_GROUP_ATTEMPT:
      return {
        ...state,
        singleGroupLoading: true,
        singleGroupId: action.payload,
      };
    case types.GET_GROUP_SUCCESS:
      return {
        ...state,
        singleGroupLoading: false,
      };
    case types.GET_GROUP_FAIL:
      return {
        ...state,
        singleGroupLoading: false,
        singleGroup: action.payload,
      };
    case types.GET_GROUPS_ATTEMPT:
      return {
        ...state,
        groupsLoading: true,
      };
    case types.GET_GROUPS_SUCCESS:
      return {
        ...state,
        groupsLoading: false,
        groups: [...state.groups, ...action.payload.data],
        groupsExhausted: action.payload.groupsExhausted,
        offset: !action.payload.groupsExhausted ? state.offset + 1 : state.offset,
      };
    case types.GET_GROUPS_FAIL:
      return {
        ...state,
        groupsLoading: false,
      };
    default:
      return state;
  }
}
