import React, { Component } from 'react';
import { View, Text, StatusBar, Platform, Alert } from 'react-native';
import FastImage from 'react-native-fast-image';
import { ButtonClass, showToast } from '../Component/Component';
import { strings } from '../Localization/Localization';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { StateContext } from '../ProviderApp';

import firebase from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';
import NetInfo from "@react-native-community/netinfo";


export default class Splash extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fromPush: false
        };
        this.fcmToken = '';
    }
    static contextType = StateContext;

    componentDidMount() {
        AsyncStorage.getItem('Lang').then(value => {
            console.log('valuevaluevaluevaluevalue', value);
            if (value !== null) {
                AsyncStorage.setItem('Lang', value);
                strings.setLanguage(value);
            } else {
                AsyncStorage.setItem('Lang', 'kz');
                strings.setLanguage('kz');
            }
        });


        console.log('fromPush1')

        messaging().onNotificationOpenedApp((remoteMessage) => {
            console.log('fromPush2')

            this.setState({
                fromPush: true
            })
        });

        messaging()
            .getInitialNotification()
            .then((remoteMessage) => {
                console.log('fromPush3')

                if (remoteMessage) {
                    console.log('fromPush4')

                    this.setState({
                        fromPush: true
                    })

                    setInitialRoute(remoteMessage.data.type); // e.g. "Settings"
                    console.log('fromPush5')

                    this.setState({
                        fromPush: true
                    })
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
        let fcmToken = await firebase.messaging().getToken();
        if (fcmToken) {
            this.fcmToken = fcmToken;
            console.log('fcmToken async', fcmToken);
            await AsyncStorage.setItem('fcmToken', fcmToken);
            console.log('fcmToken async', fcmToken);

        }

        console.log('fcmToken', fcmToken);
    }

    getData = async click => {
        try {
            const fcmToken = await AsyncStorage.getItem('fcmToken');
            const token = await AsyncStorage.getItem('token');
            const email = await AsyncStorage.getItem('email');
            const pwd = await AsyncStorage.getItem('pwd');
            const avatar = await AsyncStorage.getItem('avatar');

            if (token !== null) {
                console.log('YES')

                NetInfo.fetch().then(state => {
                    if (state.isConnected) {
                        console.log('YES1')

                        this.onLoginClick(email, pwd, fcmToken);
                    } else {
                        console.log('YES2')

                        const AuthStr = 'Bearer '.concat(token);
                        axios.defaults.headers.common['Authorization'] = AuthStr;

                        if (this.state.fromPush) {
                            console.log('fromPush7')

                            console.log('cccccccc')
                            this.props.navigation.replace('PushTable', { fromPush: true });

                        } else {
                            console.log('fromPush8')

                            this.props.navigation.replace('TabStack');
                        }

                    }
                });



            } else {
                console.log('No')

                AsyncStorage.removeItem('token');
                delete axios.defaults.headers.common["Authorization"];
                AsyncStorage.clear();
                this.globalState.setAvatar(null);
                this.props.navigation.replace('AuthStack');
            }
            if (avatar) this.globalState.setAvatar(avatar);
        } catch (e) {
            console.error(e);
        }
    };

    onLoginClick(email, pwd, fcmToken) {
        axios
            .post('https://test.kemeladam.kz/api/login/', {
                email: email,
                password: pwd,
            })
            .then(response => {
                console.log('RESPONSE LOGIN:', response);

                AsyncStorage.setItem('token', response.data.access);
                const AuthStr = 'Bearer '.concat(response.data.access);
                axios.defaults.headers.common['Authorization'] = AuthStr;


                axios
                    .post('https://test.kemeladam.kz/api/accounts/firebase/', {
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
                        console.log('cccccccc1', this.state.fromPush)

                        if (this.state.fromPush) {
                            console.log('fromPush7')

                            console.log('cccccccc')
                            this.props.navigation.replace('PushTable', { fromPush: true });

                        } else {
                            console.log('fromPush8')

                            this.props.navigation.replace('TabStack');
                        }
                    });
            })
            .catch(error => {
                console.log('error', error)

                this.props.navigation.replace('AuthStack');

            });
    }

    render() {
        this.globalState = this.context;
        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: '#fff',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                <StatusBar barStyle={'dark-content'} backgroundColor={'#fff'} />

                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <FastImage
                        source={require('../assets/logo.png')}
                        style={{ width: 150, aspectRatio: 1, marginBottom: 16 }}
                    />
                    <Text style={{ fontSize: 24, fontWeight: '700', color: 'black', }}>
                        KEMEL ADAM
                    </Text>

                </View>
            </View>
        );
    }
}
