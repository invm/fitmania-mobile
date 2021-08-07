import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useDispatch } from 'react-redux';
import { MEDIA_URL } from '../../../../env';
import { BlurredImage, colors, PADDING, Text } from '../../../components';
import IBefriendRequest from '../../../interfaces/BefriendRequest';
import {
  acceptFriendRequest,
  declineFriendRequest,
} from '../../../redux/actions/friends';

const FriendRequest = ({ request }: { request: IBefriendRequest }) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const handleAccept = async () => {
    setLoading(true);
    await dispatch(acceptFriendRequest(request.from._id));
  };

  const handleDecline = async () => {
    setLoading(true);
    await dispatch(declineFriendRequest(request.from._id));
  };

  return (
    <View style={styles.post}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('UserProfile', { userId: request.from._id });
          }}
          style={styles.postHeaderLeft}>
          <View style={styles.image}>
            <BlurredImage
              uri={MEDIA_URL + request.from.image}
              width={50}
              height={50}
            />
          </View>
          <View style={styles.headerText}>
            <Text variant="semibold16">
              {request.from.name} {request.from.lastname}
            </Text>
            <Text variant="regular16">{request.from.location}</Text>
          </View>
        </TouchableOpacity>
        {loading ? (
          <ActivityIndicator size="small" color={colors.primary} />
        ) : (
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity
              onPress={handleAccept}
              style={styles.postHeaderIcon}>
              <Icon name="person-add-outline" color={colors.white} size={25} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleDecline}
              style={styles.postHeaderIcon}>
              <Icon
                name="person-remove-outline"
                color={colors.white}
                size={25}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View>
        {!!request.from?.preferable?.length && (
          <Text>Likes: {request.from?.preferable?.join(', ')}</Text>
        )}
        {!!request.from?.undesirable?.length && (
          <Text>Dislikes: {request.from?.undesirable?.join(', ')}</Text>
        )}
      </View>
    </View>
    // <Card variant="outlined">
    // 	<CardContent>
    // 		<CardHeader
    // 			className={classes.cardHeader}
    // 			avatar={
    // 				<Link to={`/user/${request.from._id}`}>
    // 					<Avatar
    // 						src={`${process.env.REACT_APP_MEDIA}${request.from?.image}`}
    // 						className={classes.avatar}
    // 					>
    // 						{request.from?.name?.[0].toUpperCase()}
    // 					</Avatar>
    // 				</Link>
    // 			}
    // 			title={
    // 				<Link to={`/user/${request.from._id}`}>
    // 					<b style={{ fontSize: 16 }}>
    // 						{request.from?.name} {request.from?.lastname}
    // 					</b>
    // 				</Link>
    // 			}
    // 			action={
    // 				<div style={{ display: 'flex', padding: '8px 8px 0 0' }}>
    // 					{loading ? (
    // 						<Spinner size={0.3} />
    // 					) : (
    // 						<>
    // 							<Button
    // 								variant="contained"
    // 								color="primary"
    // 								onClick={handleAccept}
    // 								style={{ marginRight: 10 }}
    // 							>
    // 								Accept
    // 							</Button>
    // 							<Button variant="outlined" onClick={handleDecline}>
    // 								Decline
    // 							</Button>
    // 						</>
    // 					)}
    // 				</div>
    // 			}
    // 			subheader={<b style={{ fontSize: 14 }}>{request?.from?.location}</b>}
    // 		/>
    // 		{request?.from?.preferable?.length > 0 && (
    // 			<div>Likes: {request?.from?.preferable.join(', ')}</div>
    // 		)}
    // 		{request?.from?.undesirable?.length > 0 && (
    // 			<div>Dislikes: {request?.from?.undesirable.join(', ')}</div>
    // 		)}
    // 	</CardContent>
    // </Card>
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
  postHeaderIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
    backgroundColor: colors.light,
    borderRadius: 40,
    width: 40,
    height: 40,
  },
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

export default FriendRequest;
