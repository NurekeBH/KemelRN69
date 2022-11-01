/* eslint-disable react-native/no-inline-styles */
import axios from 'axios';
import React, { Component } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { ButtonClass, GetTime, height, showToast, width } from '../../Component/Component';
import Header from '../../Component/Header2';
import { strings } from '../../Localization/Localization';

export default class PushTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
    };
  }

  componentDidMount() {
    this.GetNotification()
  }

  GetNotification() {
    axios.get('todos/notifications/')
      .then(response => {
        console.log('RESPONSE notifications:', response);
        this.setState({
          data: response.data.results
        })
      })
      .catch(error => {
        console.log('RESPONSE error:', error.response);
        if (error.response && error.response.status == 401) {
          showToast('error', error.response.data.detail);
        }
      });
  }

  renderItem = ({ item, index }) => (
    <View style={{ marginBottom: 16 }}>
      <View
        style={{
          paddingHorizontal: 16,
          paddingVertical: 10,
          backgroundColor: '#F3F3F3',
          width: width / 1.5,
          borderRadius: 17,
        }}>
        <Text style={{ fontSize: 17 }}>{item.content}</Text>
        {/* <TouchableOpacity
          onPress={() => this.props.navigation.navigate('QuestHistory')}
          activeOpacity={0.7}
          style={{
            padding: 14,
            backgroundColor: '#fff',
            borderRadius: 14,
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 7,
          }}>
          <Text
            style={{
              fontSize: 15,
              color: '#3F49DC',
              fontWeight: '600',
              textAlign: 'center',
            }}>
            {strings.jab}
          </Text>
        </TouchableOpacity> */}
      </View>
      <Text style={{ marginTop: 10, color: 'rgba(0,0,0,0.4)', marginLeft: 11 }}>{GetTime(item.created_at, "D MMM YYYY,HH:mm")}</Text>
    </View>
  );
  render() {
    const { data } = this.state;
    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <StatusBar backgroundColor={'#fff'} barStyle="dark-content" />
        <SafeAreaView style={{ flex: 1 }}>
          <Header
            onLeftPress={() => this.props.navigation.goBack()}
            title={strings.uved}
          />
          <FlatList
            data={data}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            renderItem={this.renderItem}
            style={{ padding: 16 }}
            ListEmptyComponent={() => (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: height / 1.4,
                }}>
                <Text style={{ color: 'rgba(0, 0, 0, 0.4)' }}>
                  {strings.uvednot}
                </Text>
              </View>
            )}
            ListFooterComponent={() => <View style={{ height: 16 }} />}
          />
        </SafeAreaView>
      </View>
    );
  }
}
