import React, { Component } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Linking,
} from 'react-native';
import Header from '../../Component/Header2';
import { BSoft, Instagram, Site, Telega } from '../../Component/MyIcons';
import { strings } from '../../Localization/Localization';

export default class AboutProgram extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <StatusBar backgroundColor={'#fff'} barStyle="dark-content" />
        <SafeAreaView style={{ flex: 1 }}>
          <Header
            title={strings.oprog}
            onLeftPress={() => this.props.navigation.goBack()}
          />
          <View style={{ padding: 24 }}>
            <Text style={{ color: 'black', fontSize: 17, fontWeight: '600', marginBottom: 8 }}>
              {strings.bs}
            </Text>
            {BSoft}
            <Text style={{ fontSize: 16, marginTop: 16 }}>Версия: 2.1</Text>
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity
                onPress={() => {
                  let url = 'https://buginholding.com/'
                  Linking.canOpenURL(url).then(supported => {
                    if (supported) {
                      Linking.openURL(url);
                    } else {
                      console.log("Don't know how to open URI: " + url);
                    }
                  })
                }}
                activeOpacity={0.7}
                style={{ marginTop: 24, marginRight: 16 }}>
                {Site}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  let url = 'https://www.instagram.com/buginsoft/'
                  Linking.canOpenURL(url).then(supported => {
                    if (supported) {
                      Linking.openURL(url);
                    } else {
                      console.log("Don't know how to open URI: " + url);
                    }
                  })
                }}
                activeOpacity={0.7}
                style={{ marginTop: 24, marginRight: 16 }}>
                {Instagram}
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </View>
    );
  }
}
