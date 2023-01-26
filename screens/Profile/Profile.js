import React, { Component } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { HeaderStyle, showToast, width } from '../../Component/Component';
import { Left_icon, no_avatar, Right } from '../../Component/MyIcons';
import { strings } from '../../Localization/Localization';
import { getStatusBarHeight } from '../../Component/getStatusBarHeight';
import Header from '../../Component/Header2';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { StateContext } from '../../ProviderApp';

export const ButtonProfile = ({ onPress, title, push, language, exit }) => (
  <TouchableOpacity
    activeOpacity={0.7}
    onPress={onPress}
    style={{
      paddingVertical: 18,
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(0, 0, 0, 0.2)',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexDirection: 'row',
    }}>
    <Text style={{ fontSize: 17, color: exit ? '#FF3B30' : '#000' }}>
      {title}
    </Text>
    <View style={styles.pushStl}>
      {push ? (
        <View
          style={[
            styles.pushStl,
            {
              backgroundColor: '#FF3B30',
              marginRight: 7,
              paddingVertical: 2.5,
              paddingHorizontal: 6.5,
              borderRadius: 30,
            },
          ]}>
          <Text style={{ fontSize: 11, color: '#fff' }}>{push}</Text>
        </View>
      ) : language ? (
        <Text
          style={{
            color: 'rgba(0, 0, 0, 0.4)',

            marginRight: 7,
          }}>
          {language}
        </Text>
      ) : null}
      {exit ? null : Right}
    </View>
  </TouchableOpacity>
);

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: '',
    };
  }
  static contextType = StateContext;

  componentDidMount() {
    const unsubscribe = this.props.navigation.addListener('focus', () => {
      this.getLang();
      this.getProfile();
    });
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

  getProfile() {
    axios
      .get('accounts/profile/')
      .then(response => {
        console.log('RESPONSE profile:', response);
        this.setState({
          data: response.data,
        });
        this.storeData(response.data);
      })
      .catch(error => {
        console.log('RESPONSE error:', error.response);
        if (error.response && error.response.status == 401) {
          showToast('error', error.response.data.detail);
        }
      });
  }

  storeData = async data => {
    try {
      if (data.avatar) {
        this.globalState.setAvatar(data.avatar);
        await AsyncStorage.setItem('avatar', data.avatar + '');
      }
    } catch (e) {
      console.error(e);
    }
  };

  exitPrf = () => {
    Alert.alert(strings.vnim, strings.vyi, [
      {
        text: strings.otm,
        onPress: () => { },
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () => {
          delete axios.defaults.headers.common["Authorization"];
          AsyncStorage.removeItem('token');
          AsyncStorage.clear();
          this.props.navigation.replace('AuthStack');
        },
      },
    ]);
  };

  deleteAccount = () => {
    Alert.alert(
      "Вы уверены, что хотите удалить аккаунт?",
      "",
      [
        {
          text: strings.no,
          style: "cancel",
        },
        {
          text: "Да",
          onPress: () => {
            axios.post('accounts/profile/destroy')
              .then((response) => {
                console.log('RESPONSE destroy:', response);

                delete axios.defaults.headers.common["Authorization"];
                AsyncStorage.removeItem('token');
                AsyncStorage.clear();
                this.props.navigation.replace('AuthStack');
              })
              .catch((error) => {
                console.log('error destroy:', error.response);

              });
          },
          style: "ok",
        },
      ],
      {
        cancelable: true,
        onDismiss: () => { }
      }
    );
  };



  render() {
    this.globalState = this.context;
    const { data } = this.state;
    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <StatusBar backgroundColor={'#fff'} barStyle="dark-content" />
        <SafeAreaView style={{ flex: 1 }}>
          <Header
            title={strings.tab5}
            onLeftPress={() => this.props.navigation.goBack()}
          />

          <ScrollView
            contentContainerStyle={{ padding: 16, }}
            showsVerticalScrollIndicator={false}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {data.avatar ? (
                <FastImage
                  style={{ width: 88, aspectRatio: 1, borderRadius: 44 }}
                  source={{
                    uri: data.avatar,
                  }}
                />
              ) : (
                <View
                  style={{
                    width: 88,
                    aspectRatio: 1,
                    borderRadius: 44,
                    borderColor: '#999999',
                    borderWidth: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  {no_avatar(66)}
                </View>
              )}

              <View style={{ marginLeft: 16 }}>
                <Text
                  style={{
                    fontSize: 22,
                    fontWeight: '700',
                    width: width / 1.6,
                    color: data.fio ? '#000000' : '#cccccc',
                  }}>
                  {data.fio ? data.fio : strings.fio}
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate('EditProfile', { data })
                  }
                  activeOpacity={0.7}
                  style={{ paddingVertical: 8 }}>
                  <Text style={{ color: '#3F49DC', fontSize: 17 }}>
                    {strings.redPr}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={{ marginTop: 20 }}>
              {/* <ButtonProfile
                title={strings.mygoals}
                onPress={() => this.props.navigation.navigate('MyGoals')}
              /> */}
              {/* <ButtonProfile
                title={strings.mybooks}
                onPress={() => this.props.navigation.navigate('MyBooks')}
              /> */}
              <ButtonProfile
                title={strings.istr}
                onPress={() => this.props.navigation.navigate('QuestHistory')}
              />
              <ButtonProfile
                onPress={() => this.props.navigation.navigate('PushTable')}
                title={strings.uved}
              // push={1}
              />
              <ButtonProfile
                onPress={() =>
                  this.props.navigation.replace('EditLocal', {
                    lg: this.getLang(),
                  })
                }
                title={strings.lang}
                language={this.getLang()}
              />
              <ButtonProfile
                onPress={() => this.props.navigation.navigate('EditPwd')}
                title={strings.edPwd}
              />
              <ButtonProfile
                onPress={() => this.props.navigation.navigate('AboutUs')}
                title={strings.onas}
              />
              <ButtonProfile
                onPress={() => this.props.navigation.navigate('AboutProgram')}
                title={strings.oprog}
              />
              <ButtonProfile
                onPress={() => this.exitPrf()}
                title={strings.exit}
                exit
              />
            </View>
          </ScrollView>
          <View style={{
            padding: 16,
            flexDirection: 'row'
          }}>
            <Text style={{
              fontSize: 11,
              color: 'grey'
            }}>
              {strings.deleteaccount}
            </Text>
            <TouchableOpacity onPress={() => this.deleteAccount()}>
              <Text style={{
                color: '#00A7E5',
                marginLeft: 4,
                fontSize: 11
              }}>{strings.here} </Text>

            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  pushStl: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
