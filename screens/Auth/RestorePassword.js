import React, { Component } from 'react';
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  TextInput,
  Modal,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ButtonClass, showToast, width } from '../../Component/Component';
import Header from '../../Component/Header2';
import { strings } from '../../Localization/Localization';
import { colorApp } from '../../theme/Colors';
import Toast from 'react-native-simple-toast';
import axios from 'axios';

export default class RestorePassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      visible: false,
      isSend: false,
    };
  }

  postEmail = () => {
    this.setState({ isSend: true }, () => {
      if (this.validate()) {
        // this.setState({ visible: true });


        axios
          .post('reset/', {
            email: this.state.email
          })
          .then(response => {
            console.log('RESPONSE reset:', response);
            this.setState({ visible: true });
          })
          .catch(error => {
            console.log('RESPONSE  reset error:', error.response);
            if (error.response && error.response.status == 401) {
              showToast('error', error.response.data.detail);
            }
          }).finally(() => {
            this.setState({ isSend: false })
          })

      } else {
        this.setState({ isSend: false })
        Toast.show(strings.neperr);
      }
    })

  };

  validate = () => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(this.state.email) === false) {
      return false;
    } else {
      return true;
    }
  };

  render() {
    const { email, visible } = this.state;
    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <StatusBar barStyle="dark-content" backgroundColor={'#fff'} />
        <SafeAreaView style={{ flex: 1 }}>
          <Header onLeftPress={() => this.props.navigation.goBack()} />
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{ paddingHorizontal: 20, paddingTop: 35 }}>
              <FastImage
                source={require('../../assets/logo.png')}
                style={{ width: 80, aspectRatio: 1, marginBottom: 24 }}
              />
              <Text style={{ fontWeight: '700', fontSize: 34 }}>
                {strings.umytt}
              </Text>
              <Text style={{ fontSize: 20, marginTop: 8 }}>{strings.umyttt}</Text>
              <View
                style={{
                  backgroundColor: colorApp.fone,
                  padding: 12,
                  borderRadius: 8,
                  marginTop: 15,
                }}>
                <TextInput
                  style={{ fontSize: 17, width: width - 65 }}
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
              <ButtonClass
                loader={this.state.isSend}
                title={strings.voss}
                onPress={() => this.postEmail()}
              />
            </View>
          </ScrollView>
          <Modal visible={visible} animationType="fade">
            <SafeAreaView style={{ flex: 1 }}>
              <Header
                onLeftPress={() =>
                  this.setState({ visible: false }, () =>
                    this.props.navigation.goBack(),
                  )
                }
              />
              <View
                style={{
                  flex: 1,
                  backgroundColor: '#fff',
                  justifyContent: 'center',
                  paddingHorizontal: 20,
                  marginBottom: 30,
                }}>
                <FastImage
                  source={require('../../assets/logo.png')}
                  style={{ width: 80, aspectRatio: 1, marginBottom: 24 }}
                />
                <Text style={{ fontWeight: '700', fontSize: 34 }}>
                  {strings.email}
                </Text>
                <Text style={{ fontSize: 20, marginTop: 8 }}>
                  {strings.pcht + email + strings.pcht2}
                </Text>
              </View>
            </SafeAreaView>
          </Modal>
        </SafeAreaView>
      </View>
    );
  }
}
