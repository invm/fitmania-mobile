import { applyMiddleware, createStore, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';

import * as Reducers from './reducers';

const root = combineReducers({
  friends: Reducers.friends,
  groups: Reducers.groups,
  notifications: Reducers.notifications,
  search: Reducers.search,
  posts: Reducers.posts,
  user: Reducers.user,
});

export const RootState = {
  friends: Reducers.friendsInitialState,
  groups: Reducers.groupsInitialState,
  notifications: Reducers.notificationsInitialState,
  search: Reducers.searchInitialState,
  posts: Reducers.postsInitialState,
  user: Reducers.userInitialState,
};

const middleware = [thunk];

const store = createStore(
  root,
  RootState,
  composeWithDevTools(applyMiddleware(...middleware)),
);

export default store;
