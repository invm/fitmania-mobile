import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  colors,
  FocusAwareStatusBar,
  Header,
  PADDING,
  Text,
} from '../../components';
import { HomeRoutes, StackNavigationProps } from '../../navigation';
import { RootState } from '../../redux';
import { getPosts, resetPosts } from '../../redux/actions/posts';
import HomeHeaderButtons from './components/HomeHeaderButtons';
import Collapsible from 'react-native-collapsible';

import Post from './components/Post';
import SportFilters from './components/SportFilters';

export const TAB_BAR_HEIGHT = 50;

const Home = ({ navigation }: StackNavigationProps<HomeRoutes, 'Home'>) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const {
    user: { user },
    posts: { posts, postsLoading, postsExhausted },
  } = useSelector((state: typeof RootState) => state);
  const [buttonsCollapsed, setButtonsCollapsed] = useState(true);
  const [filtersCollapsed, setFiltersCollapsed] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [sportsFilter, setSportsFilter] = useState<string[]>([]);

  useEffect(() => {
    if (sportsFilter.length && !postsLoading) {
      dispatch(resetPosts());
      dispatch(getPosts(sportsFilter));
    } else if (!postsLoading) {
      dispatch(resetPosts());
      dispatch(getPosts());
    }
  }, [dispatch, sportsFilter]);

  const expandList = () => {
    !postsExhausted && !postsLoading && dispatch(getPosts(sportsFilter));
  };

  const toggleFilters = () => {
    !buttonsCollapsed && setButtonsCollapsed(true);
    setFiltersCollapsed(s => !s);
  };
  const toggleButtons = () => {
    !filtersCollapsed && setFiltersCollapsed(true);
    setButtonsCollapsed(s => !s);
  };

  const handleSportPress = (sport: string) => {
    if (sportsFilter.includes(sport)) {
      setSportsFilter(sportsFilter.filter(item => item !== sport));
    } else {
      setSportsFilter([...sportsFilter, sport]);
    }
  };

  useEffect(() => {
    let index = Math.ceil(Math.random() * 3);
    navigation.setOptions({
      headerShown: true,
      header: () => (
        <Header
          rightIcons={[
            {
              icon: 'notifications',
              action: () => navigation.navigate('Notifications'),
            },
            { icon: 'options-outline', action: () => toggleFilters() },
            { icon: 'paper-plane-outline', action: () => toggleButtons() },
          ]}
          title={t(`common.hello${index}`) + user.name}
        />
      ),
    });
  }, []);

  return (
    <View style={styles.container}>
      <FocusAwareStatusBar
        barStyle="dark-content"
        backgroundColor={colors.white}
      />
      <>
        <Collapsible collapsed={buttonsCollapsed}>
          <HomeHeaderButtons {...{ navigation }} />
        </Collapsible>
        <Collapsible collapsed={filtersCollapsed}>
          <SportFilters {...{ sportsFilter, handleSportPress }} />
        </Collapsible>
        <FlatList
          data={posts}
          keyExtractor={({ _id }) => _id}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={async () => {
                setRefreshing(true);
                dispatch(resetPosts());
                dispatch(getPosts(sportsFilter));
                setRefreshing(false);
              }}
              colors={[colors.primary]}
            />
          }
          renderItem={({ item: post }) => (
            <Post {...{ post, userId: user._id }} listView={true} />
          )}
					showsVerticalScrollIndicator={false}
          onEndReached={expandList}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            <View style={{ height: 100, paddingTop: PADDING }}>
              {postsLoading && !refreshing && (
                <ActivityIndicator size="large" color={colors.primary} />
              )}
            </View>
          }
        />
      </>
      {postsExhausted && !postsLoading && (
        <View style={{ paddingHorizontal: PADDING }}>
          <Text variant="regular16">{t('home.no_more_posts')}</Text>
        </View>
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
