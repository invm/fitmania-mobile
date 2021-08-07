import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  TouchableOpacity,
  View,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useDispatch } from 'react-redux';
import { MEDIA_URL } from '../../../../env';
import { BlurredImage, colors, PADDING, Text } from '../../../components';
import IUser from '../../../interfaces/User';
import { addFriend, removeFriend } from '../../../redux/actions/friends';

const Friend = ({
  user,
  suggestion = false,
}: {
  user: IUser;
  suggestion?: boolean;
}) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const handleAddFriend = async () => {
    setLoading(true);
    await dispatch(addFriend(user._id));
    setLoading(false);
  };

  const handleRemoveFriend = async () => {
    Alert.alert(
      'Please confim',
      `Are you sure you want to stop being friends with ${user?.name} ${user?.lastname}`,
      [
        {
          onPress: async () => {
            setLoading(true);
            await dispatch(removeFriend(user._id));
            setLoading(false);
          },
          style: 'destructive',
          text: 'yes',
        },
        {
          text: 'no',
          style: 'default',
        },
      ],
    );
  };

	// TODO: adjust ui for search view

  return (
    <View style={styles.post}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('UserProfile', { userId: user._id });
          }}
          style={styles.postHeaderLeft}>
          <View style={styles.image}>
            <BlurredImage uri={MEDIA_URL + user.image} width={50} height={50} />
          </View>
          <View style={styles.headerText}>
            <Text variant="semibold16">
              {user.name} {user.lastname}
            </Text>
            <Text variant="regular16">{user.location}</Text>
          </View>
        </TouchableOpacity>
        {loading ? (
          <ActivityIndicator size="small" color={colors.primary} />
        ) : suggestion ? (
          <TouchableOpacity
            onPress={handleAddFriend}
            style={styles.postHeaderRight}>
            <Icon name="person-add-outline" color={colors.black} size={25} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={handleRemoveFriend}
            style={styles.postHeaderRight}>
            <Icon name="person-remove-outline" color={colors.black} size={25} />
          </TouchableOpacity>
        )}
      </View>

      <View>
        {!!user?.preferable?.length && (
          <Text>Likes: {user?.preferable?.join(', ')}</Text>
        )}
        {!!user?.undesirable?.length && (
          <Text>Dislikes: {user?.undesirable?.join(', ')}</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  post: {},
  postHeaderLeft: { flexDirection: 'row' },
  postHeaderRight: { alignItems: 'flex-end' },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    borderColor: colors.grey,
    borderWidth: 1,
  },
  headerText: { paddingLeft: PADDING / 2 },
});

export default Friend;
