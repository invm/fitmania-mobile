import React from 'react';
import { StyleSheet, View } from 'react-native';
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
import { Text, BlurredImage } from '../../../components';

const POST_IMAGE_WIDTH = width - PADDING * 2;
const POST_IMAGE_HEIGHT = 250;

interface PostProps {
  post: IPost;
}

const Post = ({ post }: PostProps) => {
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
            <Text variant="medium12">{formatLongDate(post.created_at)}</Text>
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
};

export default Post;

const styles = StyleSheet.create({
  postContainer: {
    padding: PADDING,
    marginBottom: 8,
    backgroundColor: colors.white,
    elevation: 2,
    shadowColor: colors.black
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
