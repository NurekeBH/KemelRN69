import axios from 'axios';
import React, { Component } from 'react';
import {
  View,
  Text,
  StatusBar,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import ImageCropPicker from 'react-native-image-crop-picker';
import { ButtonClass, showToast, width } from '../../Component/Component';
import Header from '../../Component/Header2';
import { no_avatar } from '../../Component/MyIcons';
import { strings } from '../../Localization/Localization';
import { colorApp } from '../../theme/Colors';
import { TextInputMask } from 'react-native-masked-text';


export default class EditProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.route.params.data.fio,
      phone: this.props.route.params.data.phone,
      pwd: '',
      pwd2: '',
      avatar: this.props.route.params.data.avatar,
      path: null,
      mime: null,
    };
  }

  getAvatar = () => {
    ImageCropPicker.openPicker({
      multiple: false,
      cropping: true,
      mediaType: 'photo',
    }).then(images => {
      const { path, mime } = images;

      console.log(images);
      this.setState({
        avatar: images.path,
        path,
        mime,
      });
    });
  };

  SaveProfile = () => {
    const { phone, name, pwd, pwd2, path, mime } = this.state;

    const formData = new FormData();

    path &&
      mime &&
      formData.append('avatar', {
        uri: path,
        type: mime,
        name: 'filename.jpg',
      });
    name && formData.append('fio', name);

    let PHONE = phone.replace('+', '')
    PHONE = PHONE.replaceAll(' ', '')
    phone && formData.append('phone', PHONE);



    pwd && formData.append('old_password', pwd);
    pwd2 && formData.append('new_password', pwd2);

    axios
      .post('https://test.kemeladam.kz/api/accounts/profile/change/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(response => {
        console.log('RESPONSE change:', response);
        this.props.navigation.goBack();
      })
      .catch(error => {
        console.log('RESPONSE error:', error.response);
        if (error.response && error.response.status == 401) {
          showToast('error', error.response.data.detail);
        }
        if (error.response && error.response.status == 400) {
          error.response.data.avatar &&
            showToast('error', error.response.data.avatar);
          error.response.data.old_password &&
            showToast('error', error.response.data.old_password);
        }
      });
  };

  render() {
    const { name, phone, pwd, pwd2, avatar } = this.state;
    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <StatusBar backgroundColor={'#fff'} barStyle="dark-content" />
        <SafeAreaView style={{ flex: 1 }}>
          <Header
            onLeftPress={() => this.props.navigation.goBack()}
            title={strings.redPr}
          />
          <ScrollView
            style={{ padding: 16 }}
            showsVerticalScrollIndicator={false}>
            <View style={styles.vwStl}>
              <View style={{ alignItems: 'center' }}>
                {avatar ? (
                  <FastImage
                    style={{ width: 88, aspectRatio: 1, borderRadius: 44 }}
                    source={{
                      uri: avatar,
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
                <TouchableOpacity
                  onPress={() => this.getAvatar()}
                  activeOpacity={0.7}
                  style={{ paddingVertical: 8 }}>
                  <Text style={{ fontSize: 15, color: '#3F49DC' }}>
                    {strings.edeit}
                  </Text>
                </TouchableOpacity>
              </View>
              <View>
                <View style={styles.inpStl}>
                  <TextInput
                    value={name}
                    placeholder={strings.fio}
                    onChangeText={name => this.setState({ name })}
                    style={{ fontSize: 17, width: width / 1.8 }}
                    returnKeyType={'done'}
                  />
                </View>
                <View style={styles.inpStl}>
                  <TextInputMask
                    type={'custom'}
                    options={{
                      mask: '+7 999 999 99 99'
                    }}
                    style={{ fontSize: 17, width: width / 1.8 }}
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
              </View>
            </View>

            <Text style={{ color: 'black', marginTop: 30, fontSize: 22, fontWeight: '700' }}>
              {strings.edPwd}
            </Text>
            <View style={[styles.pwdStl, { marginTop: 20 }]}>
              <TextInput
                placeholder={strings.newpwd}
                placeholderTextColor={'rgba(0,0,0,0.4)'}
                value={pwd}
                onChangeText={pwd => this.setState({ pwd })}
                style={{ fontSize: 17 }}
                returnKeyType={'done'}
                secureTextEntry
              />
            </View>


            <View style={[styles.pwdStl, { marginTop: 8 }]}>
              <TextInput
                placeholder={strings.newpwd2}
                placeholderTextColor={'rgba(0,0,0,0.4)'}
                value={pwd2}
                onChangeText={pwd2 => this.setState({ pwd2 })}
                style={{ fontSize: 17 }}
                returnKeyType={'done'}
                textContentType="name"
                secureTextEntry
              />
            </View>
          </ScrollView>
          <ButtonClass
            onPress={this.SaveProfile}
            title={strings.save}
            style={{ bottom: 16, marginHorizontal: 16 }}
          />
        </SafeAreaView>
      </View >
    );
  }
}

const styles = StyleSheet.create({
  inpStl: {
    marginLeft: 16,
    width: width / 1.6,
    backgroundColor: '#F2F2F7',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  pwdStl: {
    width: width - 32,
    backgroundColor: '#F2F2F7',
    padding: 12,
    borderRadius: 8,
  },
  vwStl: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: 'rgba(0, 0, 0, 0.2)',
    borderBottomWidth: 1,
  },
});
