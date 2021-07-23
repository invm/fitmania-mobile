import React, { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  StyleSheet,
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
import { Text, BlurredImage, Touchable } from '../../../components';
import LinearGradient from 'react-native-linear-gradient';
import { useTranslation } from 'react-i18next';
import { sports } from './PostsFilters';
import moment from 'moment';
import { DATE_FORMAT } from '../../../utils/utils';
import Collapsible from 'react-native-collapsible';

const POST_IMAGE_WIDTH = width - PADDING * 2;
const POST_IMAGE_HEIGHT = 250;

interface PostProps {
  post: IPost;
  userId: string;
}

const Post = ({ post, userId }: PostProps) => {
  const { t } = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);
  const [eventLoading, setEventLoading] = useState(false);
  const [participantsCollapsed, setParticipantsCollapsed] = useState(true);

  const handleAskToJoinEvent = async () => {
    setEventLoading(true);
    // dispatch(askToJoinEvent(post._id));
    setEventLoading(false);
  };

  // const handleAdmitToEvent = async (userId: string) => {
  //   setEventLoading(true);
  //   await dispatch(admitToEvent(post._id, userId));
  //   setEventLoading(false);
  // };

  // const handleRejectFromEvent = async (userId: string) => {
  //   setEventLoading(true);
  //   await dispatch(rejectJoinRequest(post._id, userId));
  //   setEventLoading(false);
  // };

  // const handleRemoveFromRejected = async (userId: string) => {
  //   setEventLoading(true);
  //   await dispatch(removeFromRejectedList(post._id, userId));
  //   setEventLoading(false);
  // };

  const handleJoinEvent = async () => {
    setEventLoading(true);
    // await dispatch(joinEvent(post._id));
    setEventLoading(false);
  };

  const handleLeaveEvent = async () => {
    setEventLoading(true);
    // await dispatch(leaveEvent(post._id));
    setEventLoading(false);
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
                  <Icon size={24} name="close-circle-outline" />
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
              <Touchable onPress={() => setParticipantsCollapsed(e => !e)}>
                <Text>Participants</Text>
              </Touchable>
              <Collapsible collapsed={participantsCollapsed}>
                <FlatList
                  data={[{ _id: '1' }]}
                  keyExtractor={item => item._id}
                  renderItem={({ item }) => (
                    <View>
                      <Text>{item._id}</Text>
                    </View>
                  )}
                />
              </Collapsible>
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
                            <Touchable onPress={handleJoinEvent}>
                              <Text>{t('components.post.join')}</Text>
                            </Touchable>
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
                              <Touchable onPress={handleAskToJoinEvent}>
                                <Text>{t('components.post.ask_to_join')}</Text>
                              </Touchable>
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
                              <Touchable onPress={handleLeaveEvent}>
                                <Text>{t('components.post.leave_event')}</Text>
                              </Touchable>
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
          <View style={styles.postHeaderLeft}>
            <View style={styles.avatar}>
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
              <Text variant="medium12">{formatLongDate(post.created_at)}</Text>
            </View>
          </View>
          <View style={styles.postHeaderRight}>
            <Icon size={24} name="information-circle-outline" />
          </View>
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
                  {post.event?.openEvent
                    ? t('components.post.open_event')
                    : t('components.post.private_event')}
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
                  {moment(post.event.startDate).format(DATE_FORMAT)}
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
          <Text variant="regular16" lines={5}>
            {post.text}
          </Text>
        </View>
      </View>
    </>
  );
};

export default Post;

const styles = StyleSheet.create({
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
    alignItems: 'center',
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
