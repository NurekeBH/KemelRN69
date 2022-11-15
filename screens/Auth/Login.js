/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ButtonClass, showToast } from '../../Component/Component';
import { strings } from '../../Localization/Localization';
import { colorApp } from '../../theme/Colors';
import { width } from '../../Component/Component';
import { AppleIcon, FaceBook, Eye, iconFile, Right } from '../../Component/MyIcons';
import axios from 'axios';
import firebase from '@react-native-firebase/app';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      pwd: '',
      loader: false,
      eye: true
    };
  }

  onLoginClick() {



    const { email, pwd } = this.state;
    if (email && pwd) {
      this.setState({ loader: true });
      axios
        .post('login/', {
          email: email,
          password: pwd,
        })
        .then(response => {
          console.log('RESPONSE LOGIN:', response);
          this.storeData(response.data);

        })
        .catch(error => {
          this.setState({ loader: false });
          console.log('RESPONSE error:', error.response);
          if (error.response && error.response.status == 401) {
            showToast('error', error.response.data.detail);
          }
        });
    }

  }

  getLang = () => {
    if (strings.getLanguage() == 'kz') {
      return 'Қазақша';
    } else if (strings.getLanguage() == 'ru') {
      return 'Русский';
    } else {
      return 'English';
    }
  };



  storeData = async data => {
    const { email, pwd } = this.state;
    try {
      await AsyncStorage.setItem('token', data.access);
      await AsyncStorage.setItem('email', email);
      await AsyncStorage.setItem('pwd', pwd);
      const AuthStr = 'Bearer '.concat(data.access);
      axios.defaults.headers.common['Authorization'] = AuthStr;


      let fcmToken = await firebase.messaging().getToken();
      this.setState({ loader: false });
      if (fcmToken) {
        console.log('RESPONSE fcmToken:', fcmToken);

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
      } else {
        this.props.navigation.replace('TabStack');

      }

    } catch (e) {
      console.error(e);
    }
  };

  render() {
    const { email, pwd, loader, eye } = this.state;
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#fff',
          paddingHorizontal: 16,
        }}>
        <StatusBar barStyle={'dark-content'} backgroundColor={'#fff'} />
        <SafeAreaView style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 15,
              justifyContent: 'flex-end',
              alignItems: 'center',
              backgroundColor: '#fff',
            }}>
            <Text
              style={{
                fontSize: 13,
                color: colorApp.blueDark,
                marginBottom: 5,
              }}>
              {strings.log}
            </Text>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('Registration')}
              activeOpacity={0.7}>
              <View style={styles.btnStl}>
                <Text style={{ fontSize: 15, fontWeight: '600', color: '#fff' }}>
                  {strings.tirk}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <KeyboardAvoidingView behavior={'padding'}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <FastImage
                source={require('../../assets/logo.png')}
                style={{
                  width: 80,
                  aspectRatio: 1,
                  marginBottom: 24,
                  marginTop: 30,
                }}
              />
              <Text
                style={{
                  fontSize: 34,
                  fontWeight: '700',
                  marginTop: 24,
                }}>
                Өз уақытың мен өз өміріңді қолға ал!
              </Text>
              <Text style={{ fontSize: 20, color: '#000', marginTop: 8 }}>
                Әрбір жетістік істі дұрыс жоспарлаудан, жақсы әдеттерді қалыптастырудан басталады.
              </Text>
              <View
                style={{
                  backgroundColor: colorApp.fone,
                  padding: 12,
                  borderRadius: 8,
                  marginTop: 15,
                }}>
                <TextInput
                  style={{ fontSize: 17, width: width - 60 }}
                  placeholder={'Email'}
                  placeholderTextColor={'rgba(0,0,0,0.4)'}
                  keyboardType={'email-address'}
                  returnKeyType={'done'}
                  textContentType="emailAddress"
                  value={email}
                  autoCapitalize='none'
                  onChangeText={email => this.setState({ email })}
                />
              </View>
              <View
                style={{
                  backgroundColor: colorApp.fone,
                  padding: 12,
                  borderRadius: 8,
                  marginTop: 8,
                }}>
                <View
                  style={[
                    styles.inpVwStl,
                    { justifyContent: 'space-between', flexDirection: 'row' },
                  ]}>
                  <TextInput
                    style={{ fontSize: 17, width: width - 90 }}
                    placeholder={strings.pwd}
                    placeholderTextColor={'rgba(0,0,0,0.4)'}
                    returnKeyType={'done'}
                    value={pwd}
                    autoCapitalize='none'
                    secureTextEntry={eye}
                    onChangeText={pwd => this.setState({ pwd })}
                  />
                  <TouchableOpacity
                    onPress={() => this.setState({ eye: !eye })}
                    activeOpacity={0.7}>
                    <Eye stroke={!eye ? colorApp.blueDark : '#DADADA'} />
                  </TouchableOpacity>
                </View>
              </View>
              <ButtonClass
                disabled={loader}
                loader={loader}
                onPress={() => this.onLoginClick()}
                title={strings.kiru}
              />
              <ButtonClass
                onPress={() =>
                  this.props.navigation.navigate('RestorePassword')
                }
                style={{ backgroundColor: '#fff', marginTop: 8 }}
                titleStyle={{ color: '#007AFF', fontWeight: '400' }}
                title={strings.zab}
              />
              {/* <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: 30,
                }}>
                <View style={styles.vwStl} />
                <Text
                  style={{
                    color: '#8E8E93',
                    fontSize: 13,
                    marginHorizontal: 12,
                  }}>
                  {strings.neme}
                </Text>
                <View style={styles.vwStl} />
              </View> */}
              {/* <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 10,
                }}>
                <TouchableOpacity style={styles.btnStl2}>
                  {FaceBook}
                  <Text style={{ fontSize: 17, color: '#395185', marginLeft: 7 }}>
                    Facebook
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnStl2}>
                  {AppleIcon}
                  <Text style={{ fontSize: 17, color: '#000', marginLeft: 7 }}>
                    Apple ID
                  </Text>
                </TouchableOpacity>
              </View> */}
            </ScrollView>
          </KeyboardAvoidingView>
          <View style={{ position: 'absolute', bottom: 40, flexDirection: 'row' }}>
            <Text style={{ color: 'grey' }}>{strings.lang} : </Text>
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.replace('EditLocal', {
                  login: true,
                  lg: this.getLang(),
                })
              }
              style={{ flexDirection: 'row', alignItems: 'center' }}
            >
              <Text style={{ marginHorizontal: 8 }}>{this.getLang()}</Text>
              {Right}
            </TouchableOpacity>

          </View>
        </SafeAreaView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  btnStl: {
    marginBottom: 5,
    marginLeft: 16,
    paddingVertical: 4,
    paddingHorizontal: 12,
    backgroundColor: colorApp.blueDark,
    borderRadius: 20,
  },
  vwStl: {
    flex: 1,
    height: 1,
    backgroundColor: '#EBEBF0',
  },
  btnStl2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    width: width / 2 - 19.5,
    backgroundColor: '#F2F2F7',
    borderRadius: 10,
  },
});
