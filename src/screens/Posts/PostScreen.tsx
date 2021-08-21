import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { colors, FocusAwareStatusBar, Header, PADDING } from '../../components';
import { HomeRoutes, StackNavigationProps } from '../../navigation';
import { RootState } from '../../redux';
import { getPost, resetSinglePost } from '../../redux/actions/posts';
import Post from '../Home/components/Post';

const PostScreen = ({
  navigation,
  route: {
    params: { postId },
  },
}: StackNavigationProps<HomeRoutes, 'PostScreen'>) => {
  const {
    user: { user },
    posts: { singlePost, singlePostLoading },
  } = useSelector((state: typeof RootState) => state);
  const dispatch = useDispatch();

  useEffect(() => {
    if (postId) {
      dispatch(getPost(postId));
    } else {
      navigation.navigate('Home');
    }
    return () => {
      dispatch(resetSinglePost());
    };
  }, [postId, dispatch]);

  useEffect(() => {
    if (singlePost?.author?.name)
      navigation.setOptions({
        headerShown: true,
        header: () => (
          <Header
					canGoBack
            title={`${singlePost.author.name} ${singlePost.author.lastname}`}
          />
        ),
      });
  }, [singlePost]);

  return (
    <View style={styles.container}>
      <FocusAwareStatusBar />
      {singlePostLoading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <>
          {!!singlePost?._id && (
            <View>
              <Post {...{ post: singlePost, userId: user._id }} />
            </View>
          )}
        </>
      )}
    </View>
  );
};

export default PostScreen;

const styles = StyleSheet.create({
  loader: {
    paddingVertical: PADDING,
  },
  container: {
    backgroundColor: colors.white,
    flex: 1,
  },
});
