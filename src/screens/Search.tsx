import React from 'react';
import {
  View,
  I18nManager,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { HomeRoutes, StackNavigationProps } from '../navigation';
import { BORDER_RADIUS, colors, PADDING } from '../components/Theme';
import { FocusAwareStatusBar } from '../components';
import { useSelector } from 'react-redux';
import { RootState } from '../redux';
import Friend from './Friends/components/Friend';
import GroupListItem from './Groups/components/GroupListItem';

const IMAGE_HEIGHT = 90;

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
        {/* {!usersLoading && !users.length && !groups.length && (
          <View style={{ paddingTop: 50, textAlign: 'center' }}>
            <h3>No result found</h3>
          </View>
        )} */}
        {!usersLoading && users.map((user, key) => <Friend {...{ user }} />)}
      </View>
      <View style={{ padding: PADDING }}>
        {!groupsLoading &&
          groups.map((group, key) => {
            return <GroupListItem key={key} {...{ group, user }} />;
          })}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tags: {
    marginHorizontal: PADDING,
    paddingVertical: PADDING,
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    paddingHorizontal: 10,
    marginHorizontal: 5,
    marginVertical: 5,
    paddingVertical: 5,
  },
  emptyList: {
    paddingHorizontal: PADDING,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    height: IMAGE_HEIGHT,
    padding: 0,
    marginVertical: 10,
  },
  container: {
    overflow: 'hidden',
    borderTopLeftRadius: BORDER_RADIUS.small,
    borderBottomLeftRadius: BORDER_RADIUS.small,
  },
  name: {
    flex: 1,
    paddingHorizontal: 10,
    alignItems: 'flex-start',
  },
  tagline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  subtext: {
    paddingVertical: 10,
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
    alignItems: 'center',
  },
});

export default Search;
