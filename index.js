/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import messaging from '@react-native-firebase/messaging';
import 'react-native-gesture-handler';
import TrackPlayer from 'react-native-track-player';

TrackPlayer.setupPlayer();
TrackPlayer.registerPlaybackService(() => require('./service.js'));
TrackPlayer.updateOptions({
    stopWithApp: true
});

messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
});

AppRegistry.registerComponent(appName, () => App);
