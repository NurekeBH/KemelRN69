import React, { Component } from 'react';
import { View, Text, StatusBar, Platform } from 'react-native';
import FastImage from 'react-native-fast-image';
import { ButtonClass, showToast } from '../../Component/Component';
import { strings } from '../../Localization/Localization';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { StateContext } from '../../ProviderApp';

import firebase from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';


export default class FirstScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.fcmToken = '';
  }
  static contextType = StateContext;

  componentDidMount() {
    AsyncStorage.getItem('Lang').then(value => {
      console.log('valuevaluevaluevaluevalue', value);
      if (value !== null) {
        strings.setLanguage(value);
      } else {
        AsyncStorage.setItem('Lang', 'kz');
        strings.setLanguage('kz');
      }
    });

    messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log('remoteMessage1', remoteMessage)

    });

    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        console.log('remoteMessage2', remoteMessage)

        if (remoteMessage) {



          setInitialRoute(remoteMessage.data.type); // e.g. "Settings"

        }
      });


    this.checkPermission();
    this.getData(false);





  }

  onNotif = noti => {
    console.log('spllllllllll', noti);
  };

  //1
  async checkPermission() {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      this.getToken();
    } else {
      this.requestPermission();
    }
  }

  async requestPermission() {
    try {
      await firebase.messaging().requestPermission();
      // User has authorised
      this.getToken();
    } catch (error) {
      // User has rejected permissions
      console.log('permission rejected');
    }
  }

  async getToken() {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    console.log('FCM ------ TOKEN', fcmToken);
    if (!fcmToken) {
      fcmToken = await firebase.messaging().getToken();
      if (fcmToken) {
        this.fcmToken = fcmToken;
        console.log('fcmToken', fcmToken);
        await AsyncStorage.setItem('fcmToken', fcmToken);
      }
    }
    console.log('fcmToken', fcmToken);
  }

  getData = async click => {
    try {
      const fcmToken = await AsyncStorage.getItem('fcmToken');
      const email = await AsyncStorage.getItem('email');
      const pwd = await AsyncStorage.getItem('pwd');
      const avatar = await AsyncStorage.getItem('avatar');
      if (avatar) this.globalState.setAvatar(avatar);
      if (email !== null && pwd !== null) {
        this.onLoginClick(email, pwd, fcmToken);
        // const AuthStr = 'Bearer '.concat(value);
        // Axios.defaults.headers.common['Authorization'] = AuthStr
        // this.props.navigation.replace('TabStack')
      } else if (click) {
        AsyncStorage.removeItem('token');
        delete axios.defaults.headers.common["Authorization"];
        AsyncStorage.clear();
        this.globalState.setAvatar(null);
        this.props.navigation.replace('Login');
      }
    } catch (e) {
      console.error(e);
    }
  };

  onLoginClick(email, pwd, fcmToken) {
    axios
      .post('login/', {
        email: email,
        password: pwd,
      })
      .then(response => {
        console.log('RESPONSE LOGIN:', response);

        const AuthStr = 'Bearer '.concat(response.data.access);
        axios.defaults.headers.common['Authorization'] = AuthStr;

        axios
          .post('accounts/firebase/', {
            type: Platform.OS,
            token: fcmToken,
          })
          .then(response => {
            console.log('RESPONSE firebase:', response);
          })
          .catch(error => {
            console.log('RESPONSE  firebaseerror:', error.response);
            if (error.response && error.response.status == 401) {
              showToast('error', error.response.data.detail);
            }
          })
          .finally(() => {
            this.props.navigation.replace('TabStack');
          });
      })
      .catch(error => {
        this.props.navigation.replace('Login');

      });
  }

  render() {
    this.globalState = this.context;
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#fff',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
        }}>
        <StatusBar barStyle={'dark-content'} backgroundColor={'#fff'} />
        <View />
        <View style={{ marginBottom: 60 }}>
          <FastImage
            source={require('../../assets/logo.png')}
            style={{ width: 80, aspectRatio: 1, marginBottom: 24 }}
          />
          <Text style={{ fontSize: 40, fontWeight: '700' }}>
            Көздеген мақсаттарың қол жеткіз
          </Text>
          <Text
            style={{
              fontSize: 17,
              fontWeight: '400',
              marginTop: 8,
            }}>
            Әрбір жетістік істі дұрыс жоспарлаудан, жақсы әдеттерді қалыптастырудан басталады.
          </Text>
          <Text
            style={{
              fontSize: 17,
              fontWeight: '400',
              marginBottom: 28,
            }}>{`Әрекетсіз жоспар – жай ғана қиял, ал жоспарсыз әрекет – былық.
- Жапон мақалы`}</Text>
          <ButtonClass
            title={"Бастау"}
            onPress={() => this.getData(true)}
          />
        </View>
      </View>
    );
  }
}
