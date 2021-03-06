import React, { createRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import IPost from '../../../interfaces/Post';
import Icon from 'react-native-vector-icons/Ionicons';
import { formatLongDate } from '../../../utils/formatters';
import { MEDIA_URL } from '../../../../env';
import {
  BORDER_RADIUS,
  width,
  PADDING,
  colors,
} from '../../../components/Theme';
import { Text, BlurredImage, Touchable, Input } from '../../../components';
import LinearGradient from 'react-native-linear-gradient';
import { useTranslation } from 'react-i18next';
import { sports } from './SportFilters';
import moment from 'moment';
import { DATE_TIME_FORMAT, showMessage } from '../../../utils/utils';
import Collapsible from 'react-native-collapsible';
import { useNavigation } from '@react-navigation/native';
import ActionSheet from 'react-native-actions-sheet';
import {
  admitToEvent,
  askToJoinEvent,
  deletePost,
  dislikePost,
  joinEvent,
  leaveEvent,
  likePost,
  rejectJoinRequest,
  removeFromRejectedList,
  sharePost,
  unsharePost,
  updatePost,
} from '../../../redux/actions/posts';
import { useDispatch } from 'react-redux';
import PostCommentSection from './subcomponents/PostCommentSecion';
import SmallButton from '../../../components/SmallButton';
const actionSheetRef = createRef<ActionSheet>();

const POST_IMAGE_WIDTH = width - PADDING * 2;
const POST_IMAGE_HEIGHT = 250;

interface PostProps {
  post: IPost;
  userId: string;
  listView?: boolean; // controls what actions to show
}

const Post = ({ post, userId, listView }: PostProps) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const [commentToggle, setCommentToggle] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [eventLoading, setEventLoading] = useState(false);
  const [participantsCollapsed, setParticipantsCollapsed] = useState(true);
  const [awaitingApprovalCollapsed, setAwaitingApprovalCollapsed] =
    useState(true);
  const [rejectedCollapsed, setRejectedCollapsed] = useState(true);
  const navigation = useNavigation();
  const [editMode, setEditMode] = useState(false);
  const [likeShareLoading, setLikeShareLoading] = useState(false);
  const [editedPost, setEditedPost] = useState({
    _id: post._id ?? '',
    text: post.text ?? '',
    image: post.image ?? '',
  });
  const [prevPostDetails] = useState({
    _id: post._id ?? '',
    text: post.text ?? '',
    image: post.image ?? '',
  });
  const dispatch = useDispatch();

  const handleAskToJoinEvent = async () => {
    setEventLoading(true);
    await dispatch(askToJoinEvent(post._id));
    setEventLoading(false);
    setModalVisible(false);
  };

  const handlePostEdit = () => {
    if (editedPost.text.length) {
      dispatch(updatePost(editedPost));
      setEditMode(!editMode);
    } else {
      showMessage(t('common.error'), t('create_post.cant_create_empty_post'));
    }
  };

  const handlePostEditCancel = () => {
    setEditedPost(prevPostDetails);
    setEditMode(false);
  };

  const handleShare = async () => {
    setLikeShareLoading(true);
    if (post.sharedBy.includes(userId)) {
      await dispatch(unsharePost(post._id));
      setLikeShareLoading(false);
    } else {
      await dispatch(sharePost(post._id));
      setLikeShareLoading(false);
    }
  };

  const handleLike = async (_id: string) => {
    setLikeShareLoading(true);
    await dispatch(likePost(_id));
    setLikeShareLoading(false);
  };

  const handleDislike = async (_id: string) => {
    setLikeShareLoading(true);
    await dispatch(dislikePost(_id));
    setLikeShareLoading(false);
  };

  const handleAdmitToEvent = async (userId: string) => {
    setEventLoading(true);
    await dispatch(admitToEvent(post._id, userId));
    setEventLoading(false);
  };

  const handleRejectFromEvent = async (userId: string) => {
    setEventLoading(true);
    await dispatch(rejectJoinRequest(post._id, userId));
    setEventLoading(false);
  };

  const handleRemoveFromRejected = async (userId: string) => {
    setEventLoading(true);
    await dispatch(removeFromRejectedList(post._id, userId));
    setEventLoading(false);
  };

  const handleJoinEvent = async () => {
    setEventLoading(true);
    await dispatch(joinEvent(post._id));
    setEventLoading(false);
    setModalVisible(false);
  };

  const handleLeaveEvent = async () => {
    setEventLoading(true);
    await dispatch(leaveEvent(post._id));
    setEventLoading(false);
    setModalVisible(false);
  };

  const handlePostDelete = () => {
    Alert.alert(
      t('components.post.delete_alert.title'),
      t('components.post.delete_alert.subtitle'),
      [
        {
          onPress: async () => {
            await dispatch(deletePost(post._id));
            navigation.navigate('Home');
          },
          style: 'destructive',
          text: t('common.confirm'),
        },
        {
          style: 'cancel',
          text: t('common.cancel'),
        },
      ],
    );
  };

  return (
    <>
      {post.event?.limitParticipants && (
        <Modal animationType="fade" transparent={true} visible={modalVisible}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View style={[styles.row, { width: '100%' }]}>
                <Text variant="semibold20">{post.event?.eventType}</Text>
                <Touchable
                  onPress={() => {
                    setModalVisible(false);
                  }}>
                  <Icon
                    color={colors.black}
                    size={24}
                    name="close-circle-outline"
                  />
                </Touchable>
              </View>
              <View>
                <Text lines={4}>
                  A {post.event?.eventType} event is scheduled for the{' '}
                  {new Date(post.event.startDate)
                    .toLocaleString('en-GB')
                    .substr(0, 17)}
                  , looking for{' '}
                  {post.event?.limitParticipants -
                    post.event.participants.length}{' '}
                  more{' '}
                  {post.event.participants.length > 1
                    ? 'participants'
                    : 'participant'}{' '}
                  out of {post.event.limitParticipants} total invited.
                </Text>
              </View>
              <View style={{ padding: 8 }}>
                <SmallButton
                  onPress={() => setParticipantsCollapsed(e => !e)}
                  color="secondary"
                  title={t('components.post.participants')}
                />
              </View>
              <Collapsible collapsed={participantsCollapsed}>
                <FlatList
                  data={post.event.participants}
                  keyExtractor={item => item._id}
                  renderItem={({ item }) => (
                    <View>
                      <Text>{item.name}</Text>
                    </View>
                  )}
                />
              </Collapsible>
              {!!post.event.pendingApprovalParticipants.length && (
                <>
                  <View style={{ padding: 8 }}>
                    <SmallButton
                      onPress={() => setAwaitingApprovalCollapsed(e => !e)}
                      color="secondary"
                      title={t('components.post.awaiting_approval')}
                    />
                  </View>
                  <Collapsible collapsed={awaitingApprovalCollapsed}>
                    <FlatList
                      data={post.event.pendingApprovalParticipants}
                      keyExtractor={item => item._id}
                      renderItem={({ item }) => (
                        <View style={styles.userRow}>
                          <Text variant="semibold16" color={colors.primary}>
                            {item.name}
                          </Text>
                          <View style={{ display: 'flex' }}>
                            {!eventLoading ? (
                              <View style={styles.userRowButtons}>
                                <View style={{ marginEnd: 4 }}>
                                  <SmallButton
                                    title={t('components.post.admit')}
                                    onPress={() => handleAdmitToEvent(item._id)}
                                  />
                                </View>
                                <View>
                                  <SmallButton
                                    title={t('components.post.reject')}
                                    onPress={() =>
                                      handleRejectFromEvent(item._id)
                                    }
                                  />
                                </View>
                              </View>
                            ) : (
                              <ActivityIndicator
                                size="small"
                                color={colors.primary}
                              />
                            )}
                          </View>
                        </View>
                      )}
                    />
                  </Collapsible>
                </>
              )}
              {!!post.event.rejectedParticipants.length && (
                <>
                  <View style={{ padding: 8 }}>
                    <SmallButton
                      onPress={() => setRejectedCollapsed(e => !e)}
                      color="secondary"
                      title={t('components.post.rejected')}
                    />
                  </View>
                  <Collapsible collapsed={rejectedCollapsed}>
                    <FlatList
                      data={post.event.rejectedParticipants}
                      keyExtractor={item => item._id}
                      renderItem={({ item }) => (
                        <View style={styles.userRow}>
                          <Text>{item.name}</Text>
                          <View style={{ display: 'flex' }}>
                            {!eventLoading ? (
                              <>
                                <SmallButton
                                  title={t('components.post.remove')}
                                  onPress={() =>
                                    handleRemoveFromRejected(item._id)
                                  }
                                />
                              </>
                            ) : (
                              <ActivityIndicator
                                size="small"
                                color={colors.primary}
                              />
                            )}
                          </View>
                        </View>
                      )}
                    />
                  </Collapsible>
                </>
              )}
              <View>
                {new Date(post.event.startDate).getTime() -
                  new Date().getTime() >
                  0 &&
                  post.author._id !== userId && (
                    <>
                      {(post.event.openEvent &&
                        post.event.limitParticipants -
                          post.event.participants.length >
                          0 &&
                        post.event?.pendingApprovalParticipants?.findIndex(
                          item => item._id === userId,
                        ) === -1 &&
                        post.event.pendingApprovalParticipants.findIndex(
                          item => item._id === userId,
                        ) === -1 &&
                        post.event.participants.findIndex(
                          item => item._id === userId,
                        ) === -1) ||
                      (post.event.openEvent &&
                        post.event.limitParticipants -
                          post.event.participants.length >
                          0 &&
                        post.event.participants.findIndex(
                          item => item._id === userId,
                        ) === -1) ? (
                        <>
                          {!eventLoading ? (
                            <View style={{ padding: 8 }}>
                              <SmallButton
                                onPress={handleJoinEvent}
                                color="secondary"
                                title={t('components.post.join')}
                              />
                            </View>
                          ) : (
                            <ActivityIndicator
                              color={colors.primary}
                              size="small"
                            />
                          )}
                        </>
                      ) : null}
                      {post.event?.pendingApprovalParticipants?.findIndex(
                        item => item._id === userId,
                      ) > -1 && (
                        <Text>{t('components.post.asked_to_join')}</Text>
                      )}
                      {!post.event.openEvent &&
                        post.event.limitParticipants -
                          post.event.participants.length >
                          0 &&
                        post.event?.rejectedParticipants.findIndex(
                          item => item._id === userId,
                        ) === -1 &&
                        post.event.participants.findIndex(
                          item => item._id === userId,
                        ) === -1 &&
                        post.event.pendingApprovalParticipants.findIndex(
                          item => item._id === userId,
                        ) === -1 && (
                          <>
                            {!eventLoading ? (
                              <View style={{ padding: 8 }}>
                                <SmallButton
                                  onPress={handleAskToJoinEvent}
                                  color="secondary"
                                  title={t('components.post.ask_to_join')}
                                />
                              </View>
                            ) : (
                              <ActivityIndicator
                                color={colors.primary}
                                size="small"
                              />
                            )}
                          </>
                        )}
                      {post.event.participants.findIndex(
                        item => item._id === userId,
                      ) !== -1 &&
                        post.author._id !== userId && (
                          <>
                            {!eventLoading ? (
                              <SmallButton
                                onPress={handleLeaveEvent}
                                color="secondary"
                                title={t('components.post.leave_event')}
                              />
                            ) : (
                              <ActivityIndicator
                                color={colors.primary}
                                size="small"
                              />
                            )}
                          </>
                        )}
                    </>
                  )}
              </View>
            </View>
          </View>
        </Modal>
      )}
      <View key={post._id} style={styles.postContainer}>
        <View style={styles.postHeader}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('UserProfile', { userId: post.author._id });
            }}
            style={styles.postHeaderLeft}>
            <View style={styles.image}>
              <BlurredImage
                uri={MEDIA_URL + post.author.image}
                width={50}
                height={50}
              />
            </View>
            <View style={styles.headerText}>
              <Text variant="semibold16">
                {post.author.name} {post.author.lastname}
              </Text>
              <Text variant="medium12">{formatLongDate(post.created_at)}</Text>
            </View>
          </TouchableOpacity>
          {listView ? (
            <Touchable
              onPress={() => {
                navigation.navigate('PostScreen', { postId: post._id });
              }}
              style={styles.postHeaderRight}>
              <Icon size={24} name="information-circle-outline" />
            </Touchable>
          ) : (
            <>
              {post.author._id === userId && (
                <Touchable
                  onPress={() => {
                    actionSheetRef.current?.setModalVisible(true);
                  }}
                  style={styles.postHeaderRight}>
                  <Icon size={24} name="ellipsis-vertical" />
                </Touchable>
              )}
            </>
          )}
        </View>
        <View style={styles.postContent}>
          {post.event && (
            <LinearGradient
              colors={['#0066ff', '#00acff', '#3ec21d']}
              angle={90}
              useAngle
              style={styles.linearGradient}>
              <View style={styles.row}>
                <Text variant="medium14" color={colors.white}>
                  {moment(post.event.startDate).diff(moment.now()) > 0 ? (
                    <>
                      {post.event?.openEvent
                        ? t('components.post.open_event')
                        : t('components.post.private_event')}
                    </>
                  ) : (
                    <>{t('components.post.past_event')}</>
                  )}
                </Text>

                <View style={styles.row}>
                  <Icon
                    name={sports[post.event.eventType]}
                    size={22}
                    color={colors.white}
                    style={{ marginEnd: 4 }}
                  />
                  <Text variant="medium14" color={colors.white}>
                    {`${post.event.eventType} at ${post.event.pace} pace`}
                  </Text>
                </View>
              </View>
              <View style={styles.row}>
                <Text variant="medium14" color={colors.white}>
                  {post.event.participants.length}/
                  {post.event.limitParticipants} {t('components.post.joined')}
                </Text>
                <Text variant="medium14" color={colors.white}>
                  {moment(post.event.startDate).format(DATE_TIME_FORMAT)}
                </Text>
                <Touchable
                  onPress={() => {
                    setModalVisible(true);
                  }}>
                  <Icon
                    name={'information-circle-outline'}
                    size={30}
                    color={colors.white}
                  />
                </Touchable>
              </View>
            </LinearGradient>
          )}
          {!!post.image && (
            <View style={styles.postImage}>
              <BlurredImage
                width={POST_IMAGE_WIDTH}
                height={POST_IMAGE_HEIGHT}
                uri={MEDIA_URL + post.image}
              />
            </View>
          )}
          {editMode ? (
            <View>
              <Input
                multiline
                style={styles.input}
                value={editedPost.text}
                onChangeText={text => setEditedPost(s => ({ ...s, text }))}
              />
            </View>
          ) : (
            <Text variant="regular16" lines={5}>
              {post.text}
            </Text>
          )}
          {editMode && (
            <View style={styles.editModeActions}>
              <Touchable
                style={styles.editModeActionButton}
                onPress={handlePostEdit}>
                <Icon size={24} name="save-outline" color={colors.light} />
              </Touchable>
              <Touchable
                style={styles.editModeActionButton}
                onPress={handlePostEditCancel}>
                <Icon size={24} name="close" color={colors.light} />
              </Touchable>
            </View>
          )}
          {likeShareLoading ? (
            <View style={{ height: 40, paddingVertical: PADDING }}>
              <ActivityIndicator size="small" color={colors.primary} />
            </View>
          ) : (
            <View style={{ height: 40 }}>
              {!editMode && (
                <View style={styles.postActions}>
                  <View style={styles.postActions}>
                    {post.author._id !== userId && (
                      <>
                        <Touchable
                          style={styles.editModeActionButton}
                          onPress={() => {
                            console.log(post?.likes?.includes(userId));

                            post?.likes?.includes(userId)
                              ? handleDislike(post._id)
                              : handleLike(post._id);
                          }}>
                          <Icon
                            size={24}
                            name="thumbs-up"
                            color={
                              post?.likes?.includes(userId)
                                ? colors.light
                                : colors.darkGrey
                            }
                          />
                        </Touchable>
                        <Touchable
                          style={styles.editModeActionButton}
                          onPress={handleShare}>
                          <Icon
                            size={24}
                            name="share-social-outline"
                            color={
                              post?.sharedBy?.includes(userId)
                                ? colors.light
                                : colors.darkGrey
                            }
                          />
                        </Touchable>
                      </>
                    )}
                  </View>
                  <View style={styles.postActions}>
                    <Touchable
                      style={styles.editModeActionButton}
                      onPress={() => setCommentToggle(s => !s)}>
                      <Icon
                        size={24}
                        name="chatbubble-ellipses-outline"
                        color={colors.light}
                      />
                    </Touchable>
                    <Touchable
                      style={[
                        styles.editModeActionButton,
                        { flexDirection: 'row' },
                      ]}
                      onPress={() => setExpanded(s => !s)}>
                      {!!post.comments.length && (
                        <Text color={colors.light}>{post.comments.length}</Text>
                      )}
                      <Icon
                        size={24}
                        name="chatbubbles-outline"
                        color={colors.light}
                      />
                    </Touchable>
                  </View>
                </View>
              )}
            </View>
          )}
          <PostCommentSection
            {...{
              commentToggle,
              expanded,
              post,
              setCommentToggle,
              user: userId,
            }}
          />
        </View>
      </View>
      <ActionSheet
        containerStyle={{ backgroundColor: colors.white }}
        ref={actionSheetRef}>
        <View style={styles.actionSheetContent}>
          {post.author._id === userId && (
            <>
              <Touchable
                onPress={() => {
                  setEditMode(true);
                  actionSheetRef?.current?.hide();
                }}
                style={styles.actionSheetButton}>
                <View style={styles.button}>
                  <Text
                    align="center"
                    variant="bold18"
                    color={colors.secondary}>
                    {t('common.edit')}
                  </Text>
                </View>
              </Touchable>
              <Touchable
                onPress={handlePostDelete}
                style={styles.actionSheetButton}>
                <View style={styles.button}>
                  <Text
                    align="center"
                    variant="bold18"
                    color={colors.secondary}>
                    {t('common.delete')}
                  </Text>
                </View>
              </Touchable>
            </>
          )}
        </View>
      </ActionSheet>
    </>
  );
};

export default Post;

const styles = StyleSheet.create({
  userRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userRowButtons: {
    flexDirection: 'row',
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  input: {
    height: 100,
    borderColor: colors.primary,
    borderWidth: 1,
    padding: 4,
    borderRadius: 8,
  },
  editModeActions: {
    flexDirection: 'row',
    paddingVertical: PADDING,
  },
  editModeActionButton: {
    marginHorizontal: 8,
    borderRadius: 40,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    padding: 8,
    borderRadius: 8,
    borderColor: colors.secondary,
    borderWidth: 1,
    alignItems: 'center',
  },
  actionSheetContent: {
    alignItems: 'center',
    width: '100%',
    paddingVertical: PADDING,
  },
  actionSheetButton: {
    width: '95%',
    marginVertical: 8,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    width: '95%',
    borderRadius: 20,
    padding: PADDING,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  linearGradient: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5,
    marginBottom: 8,
  },
  postContainer: {
    padding: PADDING,
    marginBottom: 8,
    backgroundColor: colors.white,
    elevation: 2,
    shadowColor: colors.black,
  },
  postHeader: {
    flexDirection: 'row',
    height: 50,
  },
  postHeaderLeft: { width: '90%', flexDirection: 'row' },
  postHeaderRight: { width: '10%', alignItems: 'flex-end' },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    borderColor: colors.grey,
    borderWidth: 1,
  },
  headerText: { paddingLeft: PADDING / 2 },
  postContent: { paddingTop: PADDING / 2 },
  postImage: { borderRadius: BORDER_RADIUS.small, overflow: 'hidden' },
});
