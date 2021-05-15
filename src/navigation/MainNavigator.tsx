import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux';

import AuthNavigator from './AuthNavigator';
import HomeNavigator from './HomeNavigator';

const MainNavigator = () => {
  const user = useSelector((state: typeof RootState) => state.user);

  return (
    <>
      {!!user.authenticated &&
      !!user.user?.profileLoaded &&
      !!user.user?.name ? (
        <HomeNavigator />
      ) : (
        <AuthNavigator />
      )}
    </>
  );
};

export default MainNavigator;
