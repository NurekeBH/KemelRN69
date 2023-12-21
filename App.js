import React, { useCallback, useEffect, useRef, useState } from 'react';
import { strings } from './Localization/Localization';
import Index from './Navigation/index';
import Toast, { ErrorToast } from 'react-native-toast-message';
import axios from 'axios';
import notifee from '@notifee/react-native';

// import TrackPlayer from 'react-native-track-player';
import { DomainUrl } from './Component/Component';
import { ProviderApp } from './ProviderApp';
import codePush from "react-native-code-push";
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Alert, AppState, Text, View } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { firebaseService } from './FirebaseService';
import { CreateBD } from './database/KemelSQLite';

const codePushOptions = {
  installMode: codePush.InstallMode.ON_NEXT_RESUME,
  checkFrequency: codePush.CheckFrequency.ON_APP_START,
};

const toastConfig = {
  error: props => <ErrorToast {...props} text1NumberOfLines={3} />,
};


const App: () => React$Node = () => {

  axios.defaults.baseURL = DomainUrl + '/api/';
  CreateBD()


  let socket = { OPEN: 0 }
  let user_id = null

  const appState = useRef(AppState.currentState);


  AsyncStorage.getItem('Lang').then(value => {
    if (value !== null) {
      console.log('aaaaaa', value)
      strings.setLanguage(value);
    } else {
      AsyncStorage.setItem('Lang', 'kz');
      strings.setLanguage('kz');
    }
  });


  React.useEffect(() => {



    AsyncStorage.getItem('user_id').then(value => {
      if (value !== null) {
        user_id = value
        socket = new WebSocket(`wss://app.kemeladam.kz/ws/chat/user/${value}/`)

        socket.onopen = function (e) {
          socket.send(JSON.stringify({
            'type': 'online',
          }))
          console.log('nnnnnnn onopen', e)

        }
        socket.onmessage = function (event) {
          let data = JSON.parse(event.data)
          console.log('nnnnnnn onmessage', data)
          onDisplayNotification(data)



        }
        socket.onclose = function (event) {

          console.log('nnnnnnn onclose', event)
        }
        socket.onerror = function (event) {
          console.log('nnnnnnn onerror', event)

        }



      }
    })

    const subscription = AppState.addEventListener('change', nextAppState => {

      appState.current = nextAppState;

      if (user_id && socket?.readyState == 1 && appState.current.match(/active/)) {
        console.log('APP STATE', appState.current)
        socket.send(JSON.stringify({
          'type': 'online',
        }))
      } else if (user_id && appState.current.match(/inactive|background/)) {
        console.log('APP STATE', appState.current)


        socket.send(JSON.stringify({
          'type': 'offline',
        }))
      }

    });




    return () => {
      subscription.remove();
      socket.close()
      console.log('nnnnnnn close')

    }
  }, [])


  async function onDisplayNotification(data) {
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
    });


    await notifee.requestPermission();

    const notificationId = await notifee.displayNotification({
      id: '123',
      title: data.sender,
      body: data.message,

      android: {
        channelId,
      },
    });


  }


  useEffect(() => {

    firebaseService.register();

    return () => {
      firebaseService.unsubscribe()
    }
  }, []);



  return (

    <ProviderApp>

      <Index />
      {/* <TestApp /> */}
      <Toast config={toastConfig} />
    </ProviderApp>
  )
}

// export default App;
export default codePush(codePushOptions)(App);


// appcenter codepush release-react -a KemelAdam/Kemel-ios -d Staging

// appcenter codepush release-react -a KemelAdam/Kemel-and -d Staging