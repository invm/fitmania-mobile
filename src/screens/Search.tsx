import React from 'react';
import { View, ScrollView, ActivityIndicator } from 'react-native';
import { HomeRoutes, StackNavigationProps } from '../navigation';
import { colors, PADDING } from '../components/Theme';
import { FocusAwareStatusBar } from '../components';
import { useSelector } from 'react-redux';
import { RootState } from '../redux';
import Friend from './Friends/components/Friend';
import GroupListItem from './Groups/components/GroupListItem';

const Search = ({}: StackNavigationProps<HomeRoutes, 'Search'>) => {
  const {
    user: { user },
    search: { usersLoading, users, groups, groupsLoading },
  } = useSelector((state: typeof RootState) => state);

  return (
    <ScrollView
      contentContainerStyle={{
        flex: 1,
        backgroundColor: colors.white,
      }}>
      <FocusAwareStatusBar
        backgroundColor={colors.white}
        barStyle="dark-content"
      />
      <View style={{ padding: PADDING }}>
        {usersLoading && (
          <View style={{ paddingTop: 50 }}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        )}
        {!usersLoading &&
          users.map(user => <Friend key={user._id} search {...{ user }} />)}
      </View>
      <View style={{ padding: PADDING }}>
        {!groupsLoading &&
          groups.map(group => {
            return <GroupListItem key={group._id} {...{ group, user }} />;
          })}
      </View>
    </ScrollView>
  );
};

export default Search;
