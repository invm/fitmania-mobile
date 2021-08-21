import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import IGroup from '../../interfaces/Group';
import { RootState } from '../../redux';
import {
  deleteGroup,
  getGroup,
  joinGroup,
  leaveGroup,
  resetGroups,
} from '../../redux/actions/groups';
import { HomeRoutes, StackNavigationProps } from '../../navigation';
import { showMessage } from '../../utils/utils';
import {
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import {
  colors,
  Header,
  Text,
  FocusAwareStatusBar,
  PADDING,
  BlurredImage,
} from '../../components';
import SmallButton from '../../components/SmallButton';
import { MEDIA_URL } from '../../../env';
import { getGroupPosts } from '../../redux/actions';
import IPost from '../../interfaces/Post';
import Post from '../Home/components/Post';

const GroupDetails = ({
  navigation,
  route: { params },
}: StackNavigationProps<HomeRoutes, 'GroupDetails'>) => {
  const [loading, setLoading] = useState(false);
  const [group, setGroup] = useState({} as IGroup);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [offset, setOffset] = useState(0);
  const [groupPosts, setGroupPosts] = useState<IPost[]>([]);
  const [exhausted, setExhausted] = useState(false);
  const [groupPostsLoading, setGroupPostsLoading] = useState(false);

  const handleJoinGroup = async (groupId: string) => {
    setLoading(true);
    await joinGroup(groupId);
    await fetchAndSetGroup(groupId);
    setLoading(false);
  };

  const handleLeaveGroup = async (groupId: string) => {
    setLoading(true);
    await leaveGroup(groupId);
    await fetchAndSetGroup(groupId);
    setLoading(false);
  };
  const { user } = useSelector((state: typeof RootState) => state.user);

  const fetchAndSetGroup = async (id: string) => {
    setLoading(true);
    let _group = await getGroup(id);
    if (_group) setGroup(_group);
    setGroupPostsLoading(true);
    let _posts = await getGroupPosts(id, 0);
    setGroupPosts(_posts.data);
    setExhausted(_posts.postsExhausted);
    if (!_posts.postsExhausted) setOffset(s => s++);
    setGroupPostsLoading(false);
    setLoading(false);
  };

  useEffect(() => {
    (async () => {
      params?.groupId && (await fetchAndSetGroup(params.groupId));
    })();
  }, [params?.groupId]);

  const handleDeleteGroup = async () => {
    // TODO: add texts
    Alert.alert('title', 'subtitle', [
      {
        style: 'destructive',
        text: 'yes',
        onPress: async () => {
          await deleteGroup(group._id);
          navigation.replace('Groups');
          await dispatch(resetGroups());
        },
      },
      {
        style: 'default',
        text: 'no',
      },
    ]);
    try {
    } catch (error) {
      showMessage(t('common.error'), 'error', error?.message);
    }
  };

  useEffect(() => {
    group?.title &&
      navigation.setOptions({
        headerShown: true,
        header: () => <Header canGoBack title={group.title} />,
      });
  }, [group?.title]);

  const expandList = async () => {
    if (!exhausted) {
      setGroupPostsLoading(true);
      let _posts = await getGroupPosts(group._id, offset);
      setGroupPosts([...groupPosts, ..._posts.data]);
      setExhausted(_posts.postsExhausted);
      if (!_posts.postsExhausted) setOffset(s => s++);
      setGroupPostsLoading(false);
    }
  };

  return (
    <View>
      <FocusAwareStatusBar
        barStyle="dark-content"
        backgroundColor={colors.white}
      />
      <View style={{ paddingBottom: 50 }}>
        {loading ? (
          <ActivityIndicator size="small" />
        ) : !group?._id ? (
          <Text>Group not found</Text>
        ) : (
          <>
            <View style={{ padding: PADDING }}>
              <View>
                {loading ? (
                  <ActivityIndicator size="small" />
                ) : (
                  <>
                    <View style={{ alignItems: 'flex-end' }}>
                      {group?.admin?._id === user?._id && (
                        <SmallButton
                          title="Delete group"
                          style={{ flexGrow: 0 }}
                          onPress={handleDeleteGroup}
                        />
                      )}
                    </View>

                    {group?.admin?._id !== user?._id && (
                      <View>
                        {group?.users
                          ?.map(({ _id }) => _id)
                          .includes(user?._id) ? (
                          <View style={{ alignItems: 'flex-end' }}>
                            <SmallButton
                              title="Leave group"
                              style={{ flexGrow: 0 }}
                              onPress={() => handleLeaveGroup(group._id)}
                            />
                          </View>
                        ) : (
                          <SmallButton
                            title="Join group"
                            style={{ flexGrow: 0 }}
                            onPress={() => handleJoinGroup(group._id)}
                          />
                        )}
                      </View>
                    )}
                  </>
                )}
              </View>

              <Text variant="semibold16" color={colors.darkGrey}>
                Group athletes
              </Text>
              <View>
                {group.users.map(_user => (
                  <View key={_user._id} style={styles.user}>
                    <TouchableOpacity
                      onPress={() => {
                        if (user._id !== _user._id)
                          navigation.navigate('UserProfile', {
                            userId: _user._id,
                          });
                        navigation.navigate('Profile');
                      }}
                      style={styles.postHeaderLeft}>
                      <View style={styles.image}>
                        <BlurredImage
                          uri={MEDIA_URL + _user.image}
                          width={50}
                          height={50}
                        />
                      </View>
                      <View style={styles.headerText}>
                        <Text variant="bold18">
                          {_user.name} {_user.lastname}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
              {/* TODO: move to i18n */}
              <Text variant="semibold16" color={colors.darkGrey}>
                Group posts
              </Text>
              <View>
                <View>
                  {groupPostsLoading && <ActivityIndicator />}
                  {!groupPostsLoading &&
                    groupPosts.length > 0 &&
                    groupPosts.map(post => (
                      <Post key={post._id} {...{ post, userId: user._id }} />
                    ))}
                </View>
              </View>
            </View>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  user: {
    padding: 4,
    marginVertical: 8,
  },
  postHeaderLeft: { flexDirection: 'row' },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    borderColor: colors.grey,
    borderWidth: 1,
  },
  headerText: { paddingLeft: PADDING / 2, justifyContent: 'center' },
});

export default GroupDetails;
