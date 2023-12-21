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
import { ButtonClass, height, showToast } from '../../Component/Component';
import { strings } from '../../Localization/Localization';
import { colorApp } from '../../theme/Colors';
import { width } from '../../Component/Component';
import { Eye, FaceBook, AppleIcon } from '../../Component/MyIcons';
import axios, { Axios } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firebase from '@react-native-firebase/app';
import { TextInputMask } from 'react-native-masked-text'


export default class Registr extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      pwd: '',
      name: '',
      phone: '',
      eye: true,
      loader: false
    };
  }

  registerClick() {

    const { email, pwd, name, phone } = this.state;
    if (email && pwd && name && phone) {
      let Phone = phone.replace('+', '')
      Phone = Phone.replaceAll(' ', '')

      console.log('aaaaa', Phone)
      this.setState({ loader: true });
      axios.post('register/', {
        email: email,
        password: pwd,
        password2: pwd,
        fio: name,
        phone: Phone
      })
        .then(response => {
          console.log("RESPONSE register:", response);

          if (response.status == 201) {
            axios
              .post('login/', {
                email: email,
                password: pwd,

              })
              .then(response => {

                const AuthStr = 'Bearer '.concat(response.data.access);
                axios.defaults.headers.common['Authorization'] = AuthStr;
                this.getProfile(response.data)

                console.log('RESPONSE LOGIN:', response);

              })
              .catch(error => {
                this.setState({ is_send: false });
                console.log('RESPONSE error:', error);
                if (error.response && error.response.status == 401) {
                  showToast('error', error.response.data.detail);
                }
              });
          }

        })
        .catch(error => {
          this.setState({ loader: false });
          console.log("RESPONSE error:", error);
          if (error.response && error.response.status == 400) {
            if (error.response.data.password) {
              showToast('error', error.response.data.password[0])
            }
            if (error.response.data.errors.email) {
              showToast('error', error.response.data.errors.email[0])
            }
          } else if (error.response && error.response.status == 401) {
            showToast('error', error.response.data.detail)
          }
        });
    }
  }

  getProfile(data) {

    axios.get('accounts/profile/')
      .then(response => {
        console.log('RESPONSE profile:', response);
        this.setState({ is_send: false });
        this.storeData(response.data, data);

      })
      .catch(error => {
        console.log('RESPONSE error:', error.response);
        if (error.response && error.response.status == 401) {
          showToast('error', error.response.data.detail);
        }
      });
  }



  storeData = async (user, data) => {
    const { email, pwd } = this.state;


    try {
      await AsyncStorage.setItem('token', data.access);
      await AsyncStorage.setItem('email', email);
      await AsyncStorage.setItem('pwd', pwd);
      await AsyncStorage.setItem('user_id', user.id + '');

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
    const { email, pwd, name, eye, phone } = this.state;
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
              onPress={() => this.props.navigation.goBack()}
              activeOpacity={0.7}>
              <View style={styles.btnStl}>
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: '600',
                    color: '#fff',
                    textTransform: 'uppercase',
                  }}>
                  {strings.kiru}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <KeyboardAvoidingView behavior={'padding'} style={{ flex: 1 }}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View>
                <Text
                  style={{
                    fontSize: 34,
                    fontWeight: '700',
                    marginTop: 24,
                  }}>
                  Жетістіктермен прогрессті жеке кабинетіңде қадағала
                </Text>
                <Text style={{ fontSize: 20, color: '#000', marginTop: 8 }}>
                  Армандар мен мақсаттарыңды, әдеттер мен күнделікті
                  жоспарларыңды қадағалап отыр
                </Text>
                <View style={styles.inpVwStl}>
                  <TextInput
                    style={{ fontSize: 17, width: width - 60 }}
                    placeholder={strings.imya}
                    placeholderTextColor={'rgba(0,0,0,0.4)'}
                    returnKeyType={'done'}
                    textContentType="name"
                    value={name}
                    onChangeText={name => this.setState({ name })}
                  />
                </View>
                <View style={styles.inpVwStl}>
                  <TextInputMask
                    type={'custom'}
                    options={{
                      mask: '+7 999 999 99 99'
                    }}
                    style={{ fontSize: 17, width: width - 60 }}
                    placeholder={strings.phone}
                    placeholderTextColor={'rgba(0,0,0,0.4)'}
                    keyboardType={'phone-pad'}
                    returnKeyType={'done'}
                    textContentType="nameSuffix"
                    value={phone}
                    autoCapitalize='none'
                    onChangeText={phone => this.setState({ phone })}
                  />
                </View>
                <View style={styles.inpVwStl}>
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
                <ButtonClass
                  loader={this.state.loader}
                  title={strings.tirk}
                  onPress={() => {
                    this.registerClick()
                  }}
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
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 10,
                  }}>
                  <TouchableOpacity style={styles.btnStl2}>
                    {FaceBook}
                    <Text
                      style={{
                        fontSize: 17,
                        color: '#395185',
                        marginLeft: 7,
                      }}>
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
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
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
  inpVwStl: {
    backgroundColor: colorApp.fone,
    padding: 12,
    borderRadius: 8,
    marginTop: 15,
  },
});
