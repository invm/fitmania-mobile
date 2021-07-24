import moment from 'moment';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, View, StyleSheet, Alert } from 'react-native';
import Collapsible from 'react-native-collapsible';
import Icon from 'react-native-vector-icons/Ionicons';
import { useDispatch } from 'react-redux';
import {
  colors,
  Input,
  PADDING,
  Text,
  Touchable,
} from '../../../../components';
import IPost from '../../../../interfaces/Post';
import {
  createComment,
  deleteComment,
  editComment,
} from '../../../../redux/actions/posts';
import { DATE_FORMAT } from '../../../../utils/utils';

interface PostItemProps {
  post: IPost;
  user: string;
  setCommentToggle: React.Dispatch<React.SetStateAction<boolean>>;
  commentToggle: boolean;
  expanded: boolean;
}

const PostCommentSection = ({
  post,
  user,
  commentToggle,
  setCommentToggle,
  expanded,
}: PostItemProps) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [commentText, setCommentText] = useState('');
  const [creatingComment, setCreatingComment] = useState(false);

  const handleCommentText = (e: string) => {
    setCommentText(e);
  };

  const handleCommentSend = async () => {
    setCreatingComment(true);
    await dispatch(createComment(post._id, commentText));
    setCommentText('');
    setCommentToggle(!commentToggle);
    setCreatingComment(false);
  };

  const handleCommentEdit = (commentId: string, text: string) => {
    setCommentEditMode({ id: commentId, editMode: true });
    setCommentEditText(text);
  };

  const handleCommentEditSend = async () => {
    setCreatingComment(true);
    await dispatch(editComment(post._id, commentEditMode.id, commentEditText));
    setCommentEditMode({ id: '', editMode: false });
    setCommentEditText('');
    setCreatingComment(false);
  };

  const handleCommentDelete = (commentId: string) => {
    Alert.alert(
      t('components.post.delete_comment_alert.title'),
      t('components.post.delete_comment_alert.subtitle'),
      [
        {
          onPress: async () => {
            setCreatingComment(true);
            await dispatch(deleteComment(post._id, commentId));
            setCreatingComment(false);
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

  const [commentEditMode, setCommentEditMode] = useState({
    id: '',
    editMode: false,
  });
  const [commentEditText, setCommentEditText] = useState('');

  return (
    <>
      <Collapsible collapsed={!commentToggle}>
        <View>
          <View style={{ flexDirection: 'row', marginBottom: 8 }}>
            <View style={{ flex: 1 }}>
              <Input
                style={{ height: 60 }}
                multiline
                onChangeText={handleCommentText}
                value={commentText}
              />
            </View>
            <View style={{ marginStart: PADDING, justifyContent: 'center' }}>
              {creatingComment ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <Touchable onPress={handleCommentSend}>
                  <Icon name="send-outline" size={22} color={colors.light} />
                </Touchable>
              )}
            </View>
          </View>
        </View>
      </Collapsible>
      <Collapsible collapsed={!expanded}>
        <View>
          {expanded &&
            post?.comments?.length > 0 &&
            post?.comments.map(comment => (
              <View key={comment._id}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text variant="semibold16" color={colors.primary}>
                    {comment.user?.name} {comment.user?.lastname}
                  </Text>
                  <Text variant="semibold14" color={colors.light}>
                    {moment(comment.created_at).format(DATE_FORMAT)}
                  </Text>
                </View>
                <View>
                  <View>
                    {commentEditMode.editMode &&
                    commentEditMode.id === comment._id ? (
                      <Input
                        multiline
                        style={{ height: 60 }}
                        onChangeText={e => setCommentEditText(e)}
                        value={commentEditText}
                      />
                    ) : (
                      <Text variant="regular16" lines={20}>
                        {comment.text}
                      </Text>
                    )}
                  </View>
                  {comment.user._id === user && (
                    <>
                      {creatingComment ? (
                        <ActivityIndicator
                          size="small"
                          color={colors.primary}
                        />
                      ) : (
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'flex-end',
                          }}>
                          <View style={{ flexDirection: 'row' }}>
                            {commentEditMode.editMode &&
                            commentEditMode.id === comment._id ? (
                              <View style={styles.actionButton}>
                                <Touchable onPress={handleCommentEditSend}>
                                  <Icon
                                    name="send-outline"
                                    size={25}
                                    color={colors.light}
                                  />
                                </Touchable>
                              </View>
                            ) : (
                              <View style={styles.actionButton}>
                                <Touchable
                                  onPress={() =>
                                    handleCommentEdit(comment._id, comment.text)
                                  }>
                                  <Icon
                                    name="pencil-outline"
                                    size={25}
                                    color={colors.light}
                                  />
                                </Touchable>
                              </View>
                            )}
                          </View>
                          <View style={styles.actionButton}>
                            <Touchable
                              onPress={() => handleCommentDelete(comment._id)}>
                              <Icon
                                name="trash-outline"
                                size={25}
                                color={colors.light}
                              />
                            </Touchable>
                          </View>
                        </View>
                      )}
                    </>
                  )}
                </View>
                <View>
                  <View
                    style={{
                      marginTop: 4,
                      marginBottom: 4,
                      height: 1,
                      backgroundColor: colors.darkGrey,
                      width: '100%',
                    }}
                  />
                </View>
              </View>
            ))}
        </View>
      </Collapsible>
    </>
  );
};

const styles = StyleSheet.create({
  actionButton: {
    padding: 8,
  },
});

export default PostCommentSection;
