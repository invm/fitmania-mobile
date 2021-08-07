import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '../../redux';
import { FlatList, View, StyleSheet, RefreshControl } from 'react-native';
import {
  getFriendsSuggestions,
  resetSuggestions,
} from '../../redux/actions/friends';
import { colors, FocusAwareStatusBar, ItemSeparatorComponent, PADDING } from '../../components';
import Friend from './components/Friend';

const FriendsSuggestions = () => {
  const dispatch = useDispatch();
  const { friendsSuggestions, friendsSuggestionsLoading } = useSelector(
    (state: typeof RootState) => state.friends,
  );
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    (async () => {
      if (!friendsSuggestions.length && !friendsSuggestionsLoading)
        await dispatch(getFriendsSuggestions());
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
        data={friendsSuggestions}
        contentContainerStyle={{ flex: 1 }}
        keyExtractor={({ _id }) => _id}
        ItemSeparatorComponent={ItemSeparatorComponent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={async () => {
              setRefreshing(true);
              await dispatch(resetSuggestions());
              await dispatch(getFriendsSuggestions());
              setRefreshing(false);
            }}
            colors={[colors.primary]}
          />
        }
        renderItem={({ item: user }) => <Friend {...{ user }} suggestion />}
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

export default FriendsSuggestions;
