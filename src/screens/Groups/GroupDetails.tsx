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
import { ActivityIndicator, Alert, View } from 'react-native';
import {
  Card,
  colors,
  Header,
  Text,
  FocusAwareStatusBar,
  PADDING,
} from '../../components';
import SmallButton from '../../components/SmallButton';

const GroupDetails = ({
  navigation,
  route: { params },
}: StackNavigationProps<HomeRoutes, 'GroupDetails'>) => {
  const [loading, setLoading] = useState(false);
  const [group, setGroup] = useState({} as IGroup);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  // TODO: pull user from redux and redirect to own profile in case the user is listed

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
              {/* <View>
                {group.users.map(user => (
                  <View key={user._id} >
                    <Card >
                      <View
                        avatar={
                          <Link to={`/user/${user._id}`}>
                            <Avatar
                              src={`${process.env.MEDIA}${user?.avatar}`}
                              aria-label="user initials"
                              className={classes.avatar}>
                              {user?.name?.[0].toUpperCase()}
                            </Avatar>
                          </Link>
                        }
                        title={
                          <Link to={`/user/${user._id}`}>
                            {user.name} {user.lastname}
                          </Link>
                        }
                        subheader={
                          group?.admin._id === user._id ? 'Group admin' : ''
                        }
												>

												</View>
                    </Card>
                  </View>
                ))}
              </View> */}

              {/* TODO: move to i18n */}
              <Text variant="semibold16" color={colors.darkGrey}>
                Group posts
              </Text>
              {/* <View >
                <View>
                  {groupPostsLoading && <Spinner />}
                  {!groupPostsLoading &&
                    groupPosts.length > 0 &&
                    groupPosts.map((post) => <PostItem key={post._id} postItem={post} />)}
                </View>
              </View> */}
            </View>
          </>
        )}
      </View>
    </View>
  );
};

export default GroupDetails;
