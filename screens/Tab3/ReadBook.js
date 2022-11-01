import React, { Component } from 'react';
import { View, Text, StatusBar, SafeAreaView } from 'react-native';
import TrackPlayer from 'react-native-track-player';
import WebView from 'react-native-webview';
import Header from '../../Component/Header2';

export default class ReadBook extends Component {
  constructor(props) {
    super(props);
    console.log(('PROPS', props));
    this.state = {
      item: this.props.route.params.item,
    };
  }


  render() {
    const { item } = this.state;
    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <StatusBar barStyle="dark-content" backgroundColor={'#ffff'} />
        <SafeAreaView style={{ flex: 1 }}>
          <Header
            title={item.label}
            onLeftPress={() => this.props.navigation.goBack()}
          />
          <WebView
            source={{
              uri: 'https://www.gutenberg.org/files/67347/67347-h/67347-h.htm',
            }}
          />
        </SafeAreaView>
      </View>
    );
  }
}
