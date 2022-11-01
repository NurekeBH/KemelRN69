import React, { Component } from 'react';
import { View, Text, StatusBar, SafeAreaView, ScrollView } from 'react-native';
import Header from '../../Component/Header2';
import { ShareNote } from '../../Component/MyIcons';
import Share from 'react-native-share';
import HTML from 'react-native-render-html';
import { width } from '../../Component/Component';

export default class Note extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  share = () => {
    const shareOptions = {
      title: 'KemelAdam',
      message: 'KemelAdam',
      url: 'KemelAdam',
    };

    Share.open(shareOptions)
      .then(res => { })
      .catch(err => {
        err && console.log(err);
      });
  };

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <StatusBar backgroundColor={'#fff'} barStyle="dark-content" />
        <SafeAreaView style={{ flex: 1 }}>
          <Header
            onLeftPress={() => this.props.navigation.goBack()}
            rightSvg
            right_icon={ShareNote}
            onRightPress={() => this.share()}
          />
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{ padding: 16 }}>
              <HTML
                containerStyle={{ marginLeft: 10 }}
                source={{ html: 'Кездесудегі ойлар' }}
                contentWidth={width}
                baseStyle={{
                  fontSize: 34,
                  fontWeight: '700',
                }}
              />
              <HTML
                containerStyle={{ marginLeft: 10 }}
                source={{
                  html: `Әрбір үлкен жетістік бір кішкентай қакдамнан басталады. Әдеттер мен күнтізбе арқылы өз армандарыңа қол жеткіз`,
                }}
                contentWidth={width}
                baseStyle={{ fontSize: 17, marginTop: 8 }}
              />
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }
}
