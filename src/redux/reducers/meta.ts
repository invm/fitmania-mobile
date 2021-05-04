import {
  CONNECTION_LOST,
  CONNECTION_ESTABLISHED,
  ATTEMPTING_CONNECTION,
  UPDATE_IMAGE_PICKER_STATUS,
  LOCATION_SERVICE_UNAVAILABLE,
  CONNECTION_ERROR,
} from '../types/meta';
import Action from './Action';

const initialState = {
  connectionEstablished: false,
  attemptingConnection: true,
  imagePickerAction: null,
  imagePickerActionHandled: true,
  locationPermissionProvided: false,
  locationServiceUnavailable: false,
};

export default (state = initialState, action: Action) => {
  switch (action.type) {
    case ATTEMPTING_CONNECTION:
      return {
        ...state,
        attemptingConnection: true,
      };
    case CONNECTION_ESTABLISHED:
      return {
        ...state,
        connectionEstablished: true,
        attemptingConnection: false,
      };
    case CONNECTION_ERROR:
      return {
        ...state,
        connectionEstablished: false,
        attemptingConnection: false,
      };
    case CONNECTION_LOST:
      return {
        ...state,
        connectionEstablished: false,
        attemptingConnection: false,
      };
    case UPDATE_IMAGE_PICKER_STATUS:
      return {
        ...state,
        imagePickerAction: action.payload ? action.payload : null,
        imagePickerActionHandled: !action.payload,
      };
    case LOCATION_SERVICE_UNAVAILABLE:
      return {
        ...state,
        locationServiceUnavailable: true,
      };
    default:
      return state;
  }
};
