/* eslint-disable @typescript-eslint/explicit-function-return-type */
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { Platform } from 'react-native';
import PushNotification from 'react-native-push-notification';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { androidNotificationsChannelId } from '../../app.json';
import { updateFcmToken } from '../redux/actions';
import store from '../redux';

// Must be outside of any component LifeCycle (such as `componentDidMount`).
PushNotification.configure({
  // (optional) Called when Token is generated (iOS and Android)
  onRegister: function (_) {}, // can access token inside this function

  // (required) Called when a remote is received or opened, or local notification is opened
  onNotification: function (notification) {
    // process the notification

    // (required) Called when a remote is received or opened, or local notification is opened
    notification.finish(PushNotificationIOS.FetchResult.NoData);
  },

  // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
  onAction: function (_) {
    // can access notification inside this function
    // process the action
  },

  // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
  onRegistrationError: (_) => {}, // can access registration error inside this function

  // IOS ONLY (optional): default: all - Permissions to register.
  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },

  // Should the initial notification be popped automatically
  // default: true
  popInitialNotification: true,

  /**
   * (optional) default: true
   * - Specified if permissions (ios) and token (android and ios) will requested or not,
   * - if not, you must call PushNotificationsHandler.requestPermissions() later
   * - if you are not using remote notification or do not have Firebase installed, use this:
   *     requestPermissions: Platform.OS === 'ios'
   */
  requestPermissions: true,
});

// If initialized on android, need to create channel for notifications or use existing.
Platform.OS === 'android' &&
  PushNotification.channelExists(androidNotificationsChannelId, (exists) => {
    if (!exists) {
      PushNotification.createChannel(
        {
          channelId: androidNotificationsChannelId, // (required)
          channelName: androidNotificationsChannelId, // (required)
        },
        () => {}, // (optional) callback returns whether the channel was created, false means it already existed.
      );
    }
  });

async function initFirebase() {
  try {
    const isPermissionsGranted = await messaging().hasPermission();
    if (messaging.AuthorizationStatus.AUTHORIZED === isPermissionsGranted) {
      const fcmToken = await messaging().getToken();
      console.log('fcmToken', fcmToken);
      await AsyncStorage.setItem('fcmToken', fcmToken);
      store.getState().user?.authenticated &&
        store.getState().user?.user?._id &&
        (await updateFcmToken(fcmToken));
      messaging().setBackgroundMessageHandler(async (remoteMessage) => {
        const { notification } = remoteMessage;
        // fire action based on notification code
        // let code = remoteMessage?.data?.code;
        // if (code && ['N0'].includes(code)) {store.dispatch(action())}
        PushNotification.cancelAllLocalNotifications();
        PushNotification.localNotification({
          channelId: androidNotificationsChannelId,
          title: notification?.title, // (optional)
          message: notification?.body || '', // (required)
          playSound: true,
          soundName: 'default',
        });
      });
      messaging().onMessage(async (message) => {
        const { notification } = message;
        // fire action based on notification code
        // let code = message?.data?.code;
        // if (code && ['N0'].includes(code)) {store.dispatch(action())}
        if (notification) {
          PushNotification.cancelAllLocalNotifications();
          PushNotification.localNotification({
            channelId: androidNotificationsChannelId,
            title: notification.title, // (optional)
            message: notification?.body || '', // (required)
            playSound: true,
            soundName: 'default',
          });
        }
        // }
      });
    } else {
      const authStatus = await messaging().requestPermission({
        sound: false,
        announcement: true,
      });
      const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED;
      if (enabled) {
        const fcmToken = await messaging().getToken();
        console.log('fcmToken', fcmToken);
        store.getState().user?.authenticated &&
          store.getState().user?.user?._id &&
          (await updateFcmToken(fcmToken));
        await AsyncStorage.setItem('fcmToken', fcmToken);
      }
    }
  } catch (e) {
    console.log('[INIT FIREBASE ERROR]', e);
  }
}

initFirebase();

// To delete previous notifications from notification center
// if (Platform.OS === 'ios') {
//   PushNotificationIOS.removeAllDeliveredNotifications();
// } else {
//   PushNotification.cancelAllLocalNotifications();
// }

// PushNotification.localNotification({
//   message: 'this is the message',
//   title: 'this is the title',
// });
// PushNotificationIOS.presentLocalNotification({
//   alertBody: 'sadasda',
//   alertTitle: 'dsada',
// });
// .presentLocalNotification({
//   message: 'This is a test',
//   title: 'Haha!',
// });

// REFERENCE

/**
PushNotification.cancelAllLocalNotifications()

Cancels all scheduled notifications AND clears the notifications alerts that are in the notification centre.
 */

/**
 PushNotification.setApplicationIconBadgeNumber(number: number)
 Sets the badge number for the app icon on the home screen
 */

/**
  PushNotification.localNotification({
  Android Only Properties
  channelId: "your-channel-id", // (required) channelId, if the channel doesn't exist, it will be created with options passed above (importance, vibration, sound). Once the channel is created, the channel will not be update. Make sure your channelId is different if you change these options. If you have created a custom channel, it will apply options of the channel.
  ticker: "My Notification Ticker", // (optional)
  showWhen: true, // (optional) default: true
  autoCancel: true, // (optional) default: true
  largeIcon: "ic_launcher", // (optional) default: "ic_launcher". Use "" for no large icon.
  largeIconUrl: "https://www.example.tld/picture.jpg", // (optional) default: undefined
  smallIcon: "ic_notification", // (optional) default: "ic_notification" with fallback for "ic_launcher". Use "" for default small icon.
  bigText: "My big text that will be shown when notification is expanded", // (optional) default: "message" prop
  subText: "This is a subText", // (optional) default: none
  bigPictureUrl: "https://www.example.tld/picture.jpg", // (optional) default: undefined
  color: "red", // (optional) default: system default
  vibrate: true, // (optional) default: true
  vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
  tag: "some_tag", // (optional) add tag to message
  group: "group", // (optional) add group to message
  groupSummary: false, // (optional) set this notification to be the group summary for a group of notifications, default: false
  ongoing: false, // (optional) set whether this is an "ongoing" notification
  priority: "high", // (optional) set notification priority, default: high
  visibility: "private", // (optional) set notification visibility, default: private
  ignoreInForeground: false, // (optional) if true, the notification will not be visible when the app is in the foreground (useful for parity with how iOS notifications appear)
  shortcutId: "shortcut-id", // (optional) If this notification is duplicative of a Launcher shortcut, sets the id of the shortcut, in case the Launcher wants to hide the shortcut, default undefined
  onlyAlertOnce: false, // (optional) alert will open only once with sound and notify, default: false
  
  when: null, // (optionnal) Add a timestamp pertaining to the notification (usually the time the event occurred). For apps targeting Build.VERSION_CODES.N and above, this time is not shown anymore by default and must be opted into by using `showWhen`, default: null.
  usesChronometer: false, // (optional) Show the `when` field as a stopwatch. Instead of presenting `when` as a timestamp, the notification will show an automatically updating display of the minutes and seconds since when. Useful when showing an elapsed time (like an ongoing phone call), default: false.
  timeoutAfter: null, // (optional) Specifies a duration in milliseconds after which this notification should be canceled, if it is not already canceled, default: null

  messageId: "google:message_id", // (optional) added as `message_id` to intent extras so opening push notification can find data stored by @react-native-firebase/messaging module. 

  actions: ["Yes", "No"], // (Android only) See the doc for notification actions to know more
  invokeApp: true, // (optional) This enable click on actions to bring back the application to foreground or stay in background, default: true

  iOS only properties
  alertAction: "view", // (optional) default: view
  category: "", // (optional) default: empty string

  iOS and Android properties
  id: 0, // (optional) Valid unique 32 bit integer specified as string. default: Autogenerated Unique ID
  title: "My Notification Title", // (optional)
  message: "My Notification Message", // (required)
  userInfo: {}, // (optional) default: {} (using null throws a JSON value '<null>' error)
  playSound: false, // (optional) default: true
  soundName: "default", // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
  number: 10, // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
  repeatType: "day", // (optional) Repeating interval. Check 'Repeating Notifications' section for more info.
});
 */
