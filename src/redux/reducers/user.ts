import IUser from '../../interfaces/User';
import * as types from '../types/user';
import Action from './Action';

interface userInitialState {
  verifyingSession: boolean;
  authenticated: boolean;
  loading: boolean;
  user: IUser & {
    profileCreated: boolean;
    profileLoaded: boolean;
  };
}

export const initialState: userInitialState = {
  verifyingSession: true,
  authenticated: true,
  loading: false,
  user: {
    profileLoaded: false,
    profileCreated: false,
    _id: '',
    name: '',
    lastname: '',
    email: '',
  },
};
export default function (state = initialState, action: Action) {
  switch (action.type) {
    case types.USER_LOADING:
      return {
        ...state,
        loading: true,
      };
    case types.GET_PROFILE:
      return {
        ...state,
        user: { ...state.user, ...action.payload },
        loading: false,
      };
    case types.LOGOUT:
      return { ...initialState, authenticated: false, verifyingSession: false };
    case types.AUTHENTICATE:
      return {
        ...state,
        authenticated: action.payload,
        verifyingSession: false,
      };
    default:
      return state;
  }
}
