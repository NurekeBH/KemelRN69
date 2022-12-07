import React, { Component } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import Header from '../../Component/Header2';
import { BSoft, Instagram, Telega } from '../../Component/MyIcons';
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
                activeOpacity={0.7}
                style={{ marginTop: 24, marginRight: 16 }}>
                {Telega}
              </TouchableOpacity>
              <TouchableOpacity
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
