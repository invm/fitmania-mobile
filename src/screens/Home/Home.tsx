import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { colors, PADDING, Text } from '../../components';
import { HomeRoutes, StackNavigationProps } from '../../navigation';
import { RootState } from '../../redux';
import { getPosts } from '../../redux/actions/posts';
import HomeHeaderButtons from './components/HomeHeaderButtons';

import Post from './components/Post';

export const TAB_BAR_HEIGHT = 50;

const Home = ({ navigation }: StackNavigationProps<HomeRoutes, 'Home'>) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { posts, postsLoading, postsExhausted, offset } = useSelector(
    (state: typeof RootState) => state.posts,
  );

  useEffect(() => {
    dispatch(getPosts({ offset }));
  }, []);

  const expandList = () => {
    !postsExhausted && getPosts({ offset });
  };

  return (
    <View style={styles.container}>
      {postsLoading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <>
          <FlatList
            data={posts}
            keyExtractor={({ _id }) => _id}
            renderItem={({ item: post }) => <Post {...{ post }} />}
            onEndReached={expandList}
            ListHeaderComponent={<HomeHeaderButtons {...{ navigation }} />}
            ListFooterComponent={<View style={{ height: 100 }} />}
          />
        </>
      )}
      {postsExhausted && (
        <Text variant="regular16">{t('home.no_more_posts')}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#eee',
    flex: 1,
  },

  loader: {
    padding: PADDING,
    justifyContent: 'center',
  },
});

export default Home;
