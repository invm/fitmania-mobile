import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '../../redux';
import { FlatList, View, StyleSheet, RefreshControl } from 'react-native';
import {
  getFriendRequests,
  resetFriendRequests,
} from '../../redux/actions/friends';
import { colors, FocusAwareStatusBar, ItemSeparatorComponent, PADDING } from '../../components';
import FriendRequest from './components/FriendRequest';

const Friends = () => {
  const dispatch = useDispatch();
  const { requests, requestsExhausted, requestsLoading } = useSelector(
    (state: typeof RootState) => state.friends,
  );
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    (async () => {
      if (!requestsExhausted && !requestsLoading) {
        await dispatch(getFriendRequests());
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
        data={requests}
        keyExtractor={({ _id }) => _id}
        ItemSeparatorComponent={ItemSeparatorComponent}
				showsVerticalScrollIndicator={false}
				ListFooterComponent={<View style={{ height: 200 }}/>}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={async () => {
              setRefreshing(true);
              await dispatch(resetFriendRequests());
              await dispatch(getFriendRequests());
              setRefreshing(false);
            }}
            colors={[colors.primary]}
          />
        }
        renderItem={({ item: request }) => <FriendRequest {...{ request }} />}
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
