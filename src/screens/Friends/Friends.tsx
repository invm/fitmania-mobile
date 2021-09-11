import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux';
import { FlatList, View, StyleSheet, RefreshControl } from 'react-native';
import { resetFriends, getFriends } from '../../redux/actions/friends';
import { colors, FocusAwareStatusBar, ItemSeparatorComponent, PADDING } from '../../components';
import Friend from './components/Friend';

const Friends = () => {
  const dispatch = useDispatch();
  const { friends, friendsExhausted, friendsLoading } = useSelector(
    (state: typeof RootState) => state.friends,
  );
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    (async () => {
      if (!friendsExhausted && !friendsLoading) {
        await dispatch(resetFriends());
        await dispatch(getFriends());
      }
    })();
    // eslint-disable-next-line
  }, []);

  return (
    <View style={styles.container}>
      <FocusAwareStatusBar
        backgroundColor={colors.white}
        barStyle="dark-content"
      />
      <FlatList
        data={friends}
        ItemSeparatorComponent={ItemSeparatorComponent}
        keyExtractor={({ _id }) => _id}
				showsVerticalScrollIndicator={false}
				ListFooterComponent={<View style={{ height: 200 }}/>}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={async () => {
              setRefreshing(true);
              await dispatch(resetFriends());
              await dispatch(getFriends());
              setRefreshing(false);
            }}
            colors={[colors.primary]}
          />
        }
        renderItem={({ item: user }) => <Friend {...{ user }} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
		flex: 1,
    padding: PADDING,
  },
});

export default Friends;
