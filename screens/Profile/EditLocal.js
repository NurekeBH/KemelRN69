import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackActions } from '@react-navigation/routers';
import React, { Component } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import Header from '../../Component/Header2';
import { Check } from '../../Component/MyIcons';
import { strings } from '../../Localization/Localization';

const navlang = ['kz', 'ru', 'en'];

export default class EditLocal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login: this.props.route?.params?.login
    };
  }

  componentDidMount() {
    this.getLang();
  }

  getLang = () => {
    if (strings.getLanguage() == 'kz') {
      return 1;
    } else if (strings.getLanguage() == 'ru') {
      return 2;
    } else {
      return 3;
    }
  };

  editLang = ind => {
    strings.setLanguage(navlang[ind]);
    AsyncStorage.setItem('Lang', navlang[ind]).finally(() => {
      this.setState({});
      this.getLang();
    });
  };

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <StatusBar backgroundColor={'#fff'} barStyle="dark-content" />
        <SafeAreaView style={{ flex: 1 }}>
          <Header
            onLeftPress={() => {
              if (this.state.login) {
                this.props.navigation.replace('AuthStack', {
                  screen: 'Login',
                })
              } else {
                this.props.navigation.replace('TabStack', {
                  screen: 'ProfileStack',
                })

              }
            }

            }
          />
          <View style={{ paddingHorizontal: 16 }}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => this.editLang(0)}
              style={{
                paddingVertical: 18,
                borderBottomWidth: 1,
                borderBottomColor: 'rgba(0, 0, 0, 0.2)',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexDirection: 'row',
              }}>
              <Text
                style={{
                  fontSize: 17,
                  color: this.getLang() == 1 ? '#3F49DC' : '#000',
                }}>
                {'Қазақша'}
              </Text>
              {this.getLang() == 1 ? Check : null}
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => this.editLang(1)}
              style={{
                paddingVertical: 18,
                borderBottomWidth: 1,
                borderBottomColor: 'rgba(0, 0, 0, 0.2)',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexDirection: 'row',
              }}>
              <Text
                style={{
                  fontSize: 17,
                  color: this.getLang() == 2 ? '#3F49DC' : '#000',
                }}>
                {'Русский'}
              </Text>
              {this.getLang() == 2 ? Check : null}
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => this.editLang(2)}
              style={{
                paddingVertical: 18,
                borderBottomWidth: 1,
                borderBottomColor: 'rgba(0, 0, 0, 0.2)',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexDirection: 'row',
              }}>
              <Text
                style={{
                  fontSize: 17,
                  color: this.getLang() == 3 ? '#3F49DC' : '#000',
                }}>
                {'English'}
              </Text>
              {this.getLang() == 3 ? Check : null}
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    );
  }
}
