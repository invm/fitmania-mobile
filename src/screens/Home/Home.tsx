import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { colors, PADDING, Text } from '../../components';
import { HomeRoutes, StackNavigationProps } from '../../navigation';
import { RootState } from '../../redux';
import { getPosts } from '../../redux/actions/posts';
import Icon from 'react-native-vector-icons/Ionicons';
import { formatLongDate } from '../../utils/formatters';
import BlurredImage from '../../components/BlurredImage';
import { MEDIA_URL } from '../../../env';
import { BORDER_RADIUS, width } from '../../components/Theme';

export const TAB_BAR_HEIGHT = 50;
const POST_IMAGE_WIDTH = width - PADDING * 2;
const POST_IMAGE_HEIGHT = 250;

const Home = ({}: StackNavigationProps<HomeRoutes, 'Home'>) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { posts, postsLoading, postsExhausted, offset } = useSelector(
    (state: typeof RootState) => state.posts,
  );

  useEffect(() => {
    dispatch(getPosts({ offset }));
  }, []);

  return (
    <View style={styles.container}>
      {postsLoading ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : (
        <FlatList
          bounces
          data={posts}
          keyExtractor={({ _id }) => _id}
          renderItem={({ item: post }) => {
            return (
              <View key={post._id} style={styles.postContainer}>
                <View style={styles.postHeader}>
                  <View style={styles.postHeaderLeft}>
                    <View style={styles.avatar}>
                      {console.log(MEDIA_URL + post.author.avatar)}
                      <BlurredImage
                        uri={MEDIA_URL + post.author.avatar}
                        width={50}
                        height={50}
                      />
                    </View>
                    <View style={styles.headerText}>
                      <Text variant="semibold16">
                        {post.author.name} {post.author.lastname}
                      </Text>
                      <Text variant="medium12">
                        {formatLongDate(post.created_at)}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.postHeaderRight}>
                    <Icon size={24} name="information-circle-outline" />
                  </View>
                </View>
                <View style={styles.postContent}>
                  {!!post.image && (
                    <View style={styles.postImage}>
                      <BlurredImage
                        width={POST_IMAGE_WIDTH}
                        height={POST_IMAGE_HEIGHT}
                        uri={MEDIA_URL + post.image}
                      />
                    </View>
                  )}
                  <Text variant="regular16" lines={5}>
                    {post.text}
                  </Text>
                </View>
              </View>
            );
          }}
        />
      )}
      {postsExhausted && (
        <Text variant="regular16">{t('home.no_more_posts')}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
  postContainer: {
    padding: PADDING,
    borderBottomColor: colors.grey,
    borderBottomWidth: 8,
  },
  postHeader: {
    flexDirection: 'row',
    height: 50,
  },
  postHeaderLeft: { width: '90%', flexDirection: 'row' },
  postHeaderRight: { width: '10%', alignItems: 'flex-end' },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    borderColor: colors.grey,
    borderWidth: 1,
  },
  headerText: { paddingLeft: PADDING / 2 },
  postContent: { paddingVertical: PADDING / 2 },
  postImage: { borderRadius: BORDER_RADIUS.small, overflow: 'hidden' },
});

export default Home;
