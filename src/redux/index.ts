import { applyMiddleware, createStore, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';

import * as Reducers from './reducers';

const root = combineReducers({
  user: Reducers.user,
});

export const RootState = {
  user: Reducers.userInitialState,
};

const middleware = [thunk];

const store = createStore(
  root,
  RootState,
  composeWithDevTools(applyMiddleware(...middleware)),
);

export default store;