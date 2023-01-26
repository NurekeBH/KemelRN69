import React, { useEffect } from 'react';
import { strings } from './Localization/Localization';
import Index from './Navigation/index';
import Toast, { ErrorToast } from 'react-native-toast-message';
import axios from 'axios';

// import TrackPlayer from 'react-native-track-player';
import { DomainUrl } from './Component/Component';
import { ProviderApp } from './ProviderApp';
import codePush from "react-native-code-push";
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Alert, Text, View } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { firebaseService } from './FirebaseService';
import TestApp from './screens/TestApp'


const codePushOptions = {
  installMode: codePush.InstallMode.ON_NEXT_RESUME,
  checkFrequency: codePush.CheckFrequency.ON_APP_START,
};

const toastConfig = {
  error: props => <ErrorToast {...props} text1NumberOfLines={3} />,
};


const App: () => React$Node = () => {

  axios.defaults.baseURL = DomainUrl + '/api/';


  // TrackPlayer.updateOptions({
  //   stopWithApp: true,
  //   capabilities: [
  //     TrackPlayer.CAPABILITY_PLAY,
  //     TrackPlayer.CAPABILITY_PAUSE,
  //     TrackPlayer.CAPABILITY_STOP,
  //   ],
  //   compactCapabilities: [
  //     TrackPlayer.CAPABILITY_PLAY,
  //     TrackPlayer.CAPABILITY_PAUSE,
  //     TrackPlayer.CAPABILITY_STOP,
  //   ],
  // });

  AsyncStorage.getItem('Lang').then(value => {
    if (value !== null) {
      console.log('aaaaaa', value)
      strings.setLanguage(value);
    } else {
      AsyncStorage.setItem('Lang', 'kz');
      strings.setLanguage('kz');
    }
  });



  useEffect(() => {


    firebaseService.register();

    return () => {
      firebaseService.unsubscribe()
    }
  }, []);


  return (

    <ProviderApp>

      {/* <Index /> */}
      <TestApp />
      <Toast config={toastConfig} />
    </ProviderApp>
  )
}

// export default App;
export default codePush(codePushOptions)(App);


// appcenter codepush release-react -a KemelAdam/Kemel-ios -d Staging

// appcenter codepush release-react -a KemelAdam/Kemel-and -d Staging