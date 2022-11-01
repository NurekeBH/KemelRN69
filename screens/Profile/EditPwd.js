import Axios from 'axios';
import React, { Component } from 'react';
import {
  View,
  Text,
  StatusBar,
  SafeAreaView,
  TextInput,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { ButtonClass, showToast, width } from '../../Component/Component';
import Header from '../../Component/Header2';
import { strings } from '../../Localization/Localization';

export default class EditPwd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pwd: '',
      pwd2: '',
      oldpwd: ''
    };
  }

  SavePass = () => {
    const { pwd, pwd2, oldpwd } = this.state;
    if (oldpwd && pwd && pwd2 && (pwd === pwd2)) {
      Axios.put('accounts/change-password/', {
        old_password: oldpwd,
        new_password: pwd2,
      })
        .then(response => {
          console.log('RESPONSE LOGIN:', response);
        })
        .catch(error => {
          console.log('RESPONSE error:', error.response);
          if (error.response && error.response.status == 401) {
            showToast('error', error.response.data.detail);
          }
        });
    }
  }

  render() {
    const { pwd, pwd2, oldpwd } = this.state;
    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <StatusBar backgroundColor={'#fff'} barStyle="dark-content" />
        <SafeAreaView style={{ flex: 1 }}>
          <Header
            onLeftPress={() => this.props.navigation.goBack()}
            title={strings.edPwd}
          />
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ padding: 16 }}>
            <Text style={{ fontSize: 17, fontWeight: '600', marginTop: 16, marginBottom: 8 }}>{strings.newpwd}</Text>
            <View style={styles.pwdStl}>
              <TextInput
                placeholder={strings.oldpwd}
                placeholderTextColor={'rgba(0,0,0,0.4)'}
                value={oldpwd}
                onChangeText={oldpwd => this.setState({ oldpwd })}
                style={{ fontSize: 17 }}
                returnKeyType={'done'}
                textContentType="name"
                secureTextEntry
              />
            </View>
            <Text style={{ fontSize: 17, fontWeight: '600', marginTop: 16, marginBottom: 8 }}>{strings.newpwd}</Text>
            <View style={styles.pwdStl}>
              <TextInput
                placeholder={strings.newpwd}
                placeholderTextColor={'rgba(0,0,0,0.4)'}
                value={pwd}
                onChangeText={pwd => this.setState({ pwd })}
                style={{ fontSize: 17 }}
                returnKeyType={'done'}
                textContentType="name"
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
            onPress={this.SavePass}
            title={strings.save}
            style={{ bottom: 16, position: 'absolute', margin: 16 }}
          />
        </SafeAreaView>
      </View>
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
    marginBottom: 22,
  },
  pwdStl: {
    width: width - 32,
    backgroundColor: '#F2F2F7',
    padding: 12,
    borderRadius: 8,
  },
});
