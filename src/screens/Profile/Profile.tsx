import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import { MEDIA_URL } from '../../../env';
import {
  BlurredImage,
  BORDER_RADIUS,
  colors,
  FocusAwareStatusBar,
  PADDING,
  Text,
} from '../../components';
import IPost from '../../interfaces/Post';
import { RootState } from '../../redux';
import { getUsersPosts, POSTS_LIMIT } from '../../redux/actions';
import { DATE_FORMAT } from '../../utils/utils';
import Post from '../Home/components/Post';
import { sports } from '../Home/components/PostsFilters';

interface ProfileProps {}

const Profile = ({}: ProfileProps) => {
  const { t } = useTranslation();
  const { user } = useSelector((state: typeof RootState) => state.user);
  const [posts, setPosts] = useState<IPost[]>([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [exhausted, setExhausted] = useState(false);

  const fetchAndSetPosts = async (userId: string, offset: number) => {
    setPostsLoading(true);
    let { response } = await getUsersPosts(userId, offset);
    let _posts: IPost[] = response.data?.data;
    if (_posts.length < POSTS_LIMIT) {
      setExhausted(true);
    } else {
      setOffset(s => s + 1);
    }
    setPosts(s => [...s, ..._posts]);
    setPostsLoading(false);
  };

  useEffect(() => {
    if (user?._id) {
      (async () => {
        await fetchAndSetPosts(user._id, 0);
      })();
    }
  }, [user._id]);

  const expandList = () => {
    !exhausted && !postsLoading && fetchAndSetPosts(user._id, offset);
  };

  return (
    <View style={styles.container}>
      <FocusAwareStatusBar
        backgroundColor={colors.white}
        barStyle="dark-content"
      />
      <FlatList
        contentContainerStyle={{ paddingVertical: PADDING }}
        data={posts}
        keyExtractor={({ _id }) => _id}
        onEndReached={expandList}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          <View style={{ height: 100, paddingTop: PADDING }}>
            {postsLoading && (
              <ActivityIndicator size="large" color={colors.primary} />
            )}
          </View>
        }
        renderItem={({ item: post }) => (
          <Post {...{ post, userId: user._id }} listView={true} />
        )}
        ListHeaderComponent={() => {
          return (
            <>
              <View style={styles.imageContainer}>
                <View style={styles.image}>
                  <BlurredImage
                    width={150}
                    height={150}
                    uri={MEDIA_URL + user?.image}
                  />
                </View>
              </View>
              <View style={styles.row}>
                <Text variant="bold24" style={{ paddingHorizontal: 4 }}>
                  {user?.name}
                </Text>
                <Text variant="bold24" style={{ paddingHorizontal: 4 }}>
                  {user?.lastname}
                </Text>
              </View>
              {!!user?.email && (
                <View style={styles.row}>
                  <Text variant="semibold20" style={{ paddingHorizontal: 4 }}>
                    {user?.email}
                  </Text>
                </View>
              )}
              {!!user?.birthday && (
                <View style={styles.row}>
                  <Text variant="semibold20" style={{ paddingHorizontal: 4 }}>
                    {moment(user?.birthday).format(DATE_FORMAT)}
                  </Text>
                </View>
              )}
              {!!user?.location && (
                <View style={styles.row}>
                  <Text variant="semibold20" style={{ paddingHorizontal: 4 }}>
                    {user?.location}
                  </Text>
                </View>
              )}
              <View>
                {Object.entries(sports).filter(
                  item => !user.preferable?.includes(item[0]),
                ).length > 0 && (
                  <>
                    <Text variant="semibold20" align="center">
                      {t('profile.preferable')}
                    </Text>
                    <View style={styles.sports}>
                      {Object.entries(sports)
                        .filter(item => !user.undesirable.includes(item[0]))
                        .map(item => {
                          let color = user.preferable.includes(item[0])
                            ? colors.primary
                            : colors.grey;
                          return (
                            <View key={item[0]} style={styles.sport}>
                              <Icon name={item[1]} size={20} color={color} />
                              <Text variant="semibold16" color={color}>
                                {item[0]}
                              </Text>
                            </View>
                          );
                        })}
                    </View>
                  </>
                )}
                {Object.entries(sports).filter(
                  item => !user.undesirable.includes(item[0]),
                ).length > 0 && (
                  <>
                    <Text variant="semibold20" align="center">
                      {t('profile.undesirable')}
                    </Text>
                    <View style={styles.sports}>
                      {Object.entries(sports)
                        .filter(item => !user.preferable.includes(item[0]))
                        .map(item => {
                          let color = user.undesirable.includes(item[0])
                            ? colors.error
                            : colors.grey;
                          return (
                            <View key={item[0]} style={styles.sport}>
                              <Icon name={item[1]} size={20} color={color} />
                              <Text variant="semibold16" color={color}>
                                {item[0]}
                              </Text>
                            </View>
                          );
                        })}
                    </View>
                  </>
                )}
              </View>
            </>
          );
        }}
      />
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {},
  sports: {
    justifyContent: 'center',
    flexDirection: 'row',
    paddingVertical: 8,
    flexWrap: 'wrap',
  },
  sport: {
    flexDirection: 'row',
    padding: 8,
    marginEnd: 6,
    marginBottom: 4,
    borderRadius: BORDER_RADIUS.med,
  },
  row: { paddingVertical: 4, flexDirection: 'row', justifyContent: 'center' },
  imageContainer: { flex: 1, alignItems: 'center' },
  image: {
    width: 150,
    height: 150,
    borderRadius: 75,
    overflow: 'hidden',
  },
});
