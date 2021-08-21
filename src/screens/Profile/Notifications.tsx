import { useIsFocused } from '@react-navigation/native';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { FocusAwareStatusBar, Text, Touchable } from '../../components';
import { colors, PADDING } from '../../components/Theme';
import { StackNavigationProps, AppRoutes } from '../../navigation';
import { RootState } from '../../redux';
import {
  deleteNotification,
  getNotifications,
  resetNotifications,
} from '../../redux/actions/notifications';
import INotification from '../../interfaces/Notification';
import Icon from 'react-native-vector-icons/Ionicons';
import { StackNavigationProp } from '@react-navigation/stack';

const Notification = ({
  notification,
  navigation,
}: {
  notification: INotification;
  navigation: StackNavigationProp<AppRoutes, 'Notifications'>;
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    await dispatch(deleteNotification(notification._id));
  };

  return (
    <View style={styles.notificationContainer}>
      <FocusAwareStatusBar
        barStyle="dark-content"
        backgroundColor={colors.white}
      />
      <View style={styles.rightSideContainer}>
        <TouchableOpacity
          onPress={() => {
            Alert.alert(notification.title, notification.body, [
              {
                onPress: () => {
                  // navigate to resource
                  navigation.navigate(
                    notification.type === 'post' ? 'PostScreen' : 'Friends',
                    {
                      ...(notification.type === 'post'
                        ? { postId: notification.resource }
                        : { screen: 'FriendsRequests' }),
                    },
                  );
                },
                text: t('common.view'),
              },
              { onPress: () => {}, text: t('common.dismiss') },
            ]);
          }}>
          <View style={styles.text}>
            <View style={{ flexDirection: 'row', paddingBottom: 4 }}>
              <Text
                variant="semibold14"
                color={colors.black}
                style={{ maxWidth: '75%' }}>
                {notification.title}
              </Text>
              <Text
                color={colors.grey}
                variant="regular14"
                style={{ paddingStart: PADDING }}>
                {moment().from(notification.created_at)}
              </Text>
            </View>
            <Text
              color={colors.black}
              variant="regular14"
              lines={1}
              style={{ maxWidth: '95%' }}>
              {notification.body}
            </Text>
          </View>
        </TouchableOpacity>
        <View style={styles.actions}>
          {loading ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <Touchable
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 20,
              }}
              onPress={() => {
                Alert.alert(notification.title, notification.body, [
                  {
                    text: t('common.delete'),
                    onPress: handleDelete,
                    style: 'destructive',
                  },
                  {
                    text: t('common.dismiss'),
                    style: 'cancel',
                  },
                ]);
              }}>
              <Icon name="trash" size={20} color={colors.dark} />
            </Touchable>
          )}
        </View>
      </View>
    </View>
  );
};

const Notifications = ({
  navigation,
}: StackNavigationProps<AppRoutes, 'Notifications'>) => {
  const { t } = useTranslation();

  const {
    user: { authenticated },
    notifications: {
      notificationsExhausted,
      notificationsLoading,
      notifications,
    },
  } = useSelector((state: typeof RootState) => state);
  const isFocused = useIsFocused();
  const dispatch = useDispatch();

  useEffect(() => {
    expandList();
  }, [authenticated, isFocused]);

  const expandList = async () => {
    if (authenticated && !notificationsExhausted && !notificationsLoading) {
      dispatch(getNotifications());
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        ListEmptyComponent={() => (
          <View style={{ alignItems: 'center', paddingVertical: 10 }}>
            {!notificationsLoading && (
              <Text variant="medium16">{t('common.pull_down_to_refresh')}</Text>
            )}
          </View>
        )}
        contentContainerStyle={{ paddingHorizontal: PADDING }}
        keyExtractor={({ _id }) => _id}
        renderItem={({ item: notification }) => (
          <Notification {...{ notification, navigation }} />
        )}
        data={notifications}
        onEndReachedThreshold={0.1}
        onEndReached={() => expandList()}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={notificationsLoading}
            onRefresh={async () => {
              await dispatch(resetNotifications());
              await dispatch(getNotifications());
            }}
          />
        }
      />
    </View>
  );
};

export default Notifications;

const styles = StyleSheet.create({
  rightSideContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomColor: colors.darkGrey,
    borderBottomWidth: 1,
    paddingTop: PADDING / 2,
    paddingBottom: PADDING,
  },
  text: {
    width: '100%',
    justifyContent: 'center',
  },
  actions: {
    width: '8%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationContainer: {
    flexDirection: 'row',
    overflow: 'hidden',
    paddingVertical: 4,
  },
  inputContainer: {
    width: '100%',
  },
  scrollView: {
    paddingHorizontal: PADDING,
    paddingBottom: 100,
  },
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
});
