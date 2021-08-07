import { applyMiddleware, createStore, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';

import * as Reducers from './reducers';

const root = combineReducers({
  friends: Reducers.friends,
  groups: Reducers.groups,
  user: Reducers.user,
  search: Reducers.search,
  posts: Reducers.posts,
});

export const RootState = {
  friends: Reducers.friendsInitialState,
  groups: Reducers.groupsInitialState,
  user: Reducers.userInitialState,
  search: Reducers.searchInitialState,
  posts: Reducers.postsInitialState,
};

const middleware = [thunk];

const store = createStore(
  root,
  RootState,
  composeWithDevTools(applyMiddleware(...middleware)),
);

export default store;
