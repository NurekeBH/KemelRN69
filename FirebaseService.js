import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';
import { navigate } from './Navigation/RootNavigation';
// import {ROUTE_NAMES} from '../components/navigation/routes';
// import {NOTIFICATION_TYPE, STORAGE} from '../constans/constants';
// import {getString, storeObject, storeString} from '../storage/AsyncStorage';
// import {MobileSettingsService} from './API';
// import {LocalNotificationService} from './LocalNotificationService';

class FirebaseService {
  async register() {
    await messaging().requestPermission({
      alert: true,
      announcement: false,
      badge: true,
      carPlay: false,
      provisional: false,
      sound: true
    })
    this.checkPermission();
    this.createNoitificationListeners();
  }

  async registerAppWithFCM() {
    if (Platform.OS === 'ios') {
      // await messaging().registerDeviceForRemoteMessages()
      await messaging().setAutoInitEnabled(true);
    }
  }

  // async setFCMToken(fcmToken, bearerToken) {
  //   await MobileSettingsService.setFCMToken(fcmToken, bearerToken);
  // }

  async onRegister(token) {
    // const string = await getString(STORAGE.userToken);
    // if (string) {
    //   this.setFCMToken(token, string);
    // }
  }

  async requestUserPermission() {

    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
      // (async () => storeObject(STORAGE.pushEnabled, true))();
      this.getToken();
    } else {
      console.log('Requested permission rejected!');
    }
  }

  async checkPermission() {

    const isAllowed = await messaging().hasPermission();


    if (isAllowed) {

      // if (Platform.OS == 'android') {
      //   (async () => storeObject(STORAGE.pushEnabled, true))();
      // }
      this.getToken();
    } else {
      this.requestUserPermission();
    }
  }

  async getToken() {
    const token = await messaging().getToken();

    console.log('getToken:ffffff', token);

    if (token) {
      // await storeString(STORAGE.firebaseToken, token);
      this.onRegister(token);
    } else {
      console.log('User does not have a device token.');
    }
  }

  createNoitificationListeners() {

    this.unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('onMessage: ', remoteMessage);
      // LocalNotificationService.onDisplayNotification(remoteMessage);
    });


    messaging()
      .subscribeToTopic('phrase')
      .then(() => console.log('Subscribed to topic!'));

    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('onNotificationOpenedApp : ', remoteMessage);
      const notificationData = remoteMessage?.data;
      navigate('PushTable', { fromPush: true });
      // if (notificationData?.code === 'unfulfilled_tasks') {
      //   navigate('Unfulfilled_tasks');
      // }

      //   if (global.setIsRead) {
      //     global.setIsRead(false);
      //   }
      //   navigate(ROUTE_NAMES.bottomTab, {onNotification: true});
      // }
    });

    messaging().onTokenRefresh(fcmToken => {
      console.log('messaging().onTokenRefresh', fcmToken);
      this.onRegister(fcmToken);
    });
  }

  async getInitialNotification() {
    const initialNotification = await messaging().getInitialNotification();
    return initialNotification;
  }

  async deleteToken() {
    await messaging().deleteToken();
  }

  async unsubscribe() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }
}

export const firebaseService = new FirebaseService();
