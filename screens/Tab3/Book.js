import React, {Component} from 'react';
import {View, Text, StatusBar, SafeAreaView, ScrollView} from 'react-native';
import FastImage from 'react-native-fast-image';
import {ButtonClass, height, width} from '../../Component/Component';
import Header from '../../Component/Header2';
import {strings} from '../../Localization/Localization';
import HTML from 'react-native-render-html';

export default class Book extends Component {
  constructor(props) {
    super(props);
    this.state = {
      item: this.props.route.params.item,
      type: this.props.route.params.type,
    };
  }

  render() {
    const {item, type} = this.state;
    console.log('item', item);
    return (
      <View style={{flex: 1, backgroundColor: '#fff'}}>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={{flex: 1}}>
          <Header
            title={strings.book}
            onLeftPress={() => this.props.navigation.goBack()}
          />
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{alignItems: 'center'}}>
              <FastImage
                source={{
                  uri: item.cover,
                }}
                style={{
                  width: width / 2,
                  height: height / 3,
                  marginTop: 16,
                  borderRadius: 6,
                }}
              />
              <Text style={{marginTop: 20, fontSize: 22, fontWeight: '700'}}>
                {item.label}
              </Text>
              <Text style={{marginTop: 8, fontSize: 16}}>{item.author}</Text>
            </View>
            <HTML
              source={{
                html: item.desc,
              }}
              contentWidth={width}
              baseStyle={{
                fontSize: 17,
                color: '#8E8E93',
                margin: 16,
              }}
            />
          </ScrollView>
          <View
            style={{
              paddingVertical: 8,
              backgroundColor: '#fff',
              paddingHorizontal: 20,
            }}>
            <ButtonClass
              onPress={() => {
                if (type == 'book') {
                  this.props.navigation.navigate('ReadBook', {item: item});
                }
              }}
              style={{
                width: width - 40,
                backgroundColor: false ? '#3F49DC' : '#9B8274',
                marginTop: 0,
                marginBottom: 16,
              }}
              title={false ? strings.kupp + ' ' + item.price : strings.oky}
            />
          </View>
        </SafeAreaView>
      </View>
    );
  }
}
