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
      fromPush: this.props.rote?.params?.fromPush,
      data: [],
    };
  }

  componentDidMount() {
    this.GetNotification()
  }

  GetNotification() {
    axios.get('notifications/firebase/')
      .then(response => {
        console.log('RESPONSE notifications:', response);
        this.setState({
          data: response.data.results
        })
      })
      .catch(error => {
        console.log('RESPONSE notifications error:', error.response);
        if (error.response && error.response.status == 401) {
          showToast('error', error.response.data.detail);
        }
      });
  }

  whatTopic(item) {
    if (item.topic) {
      if (item.topic?.code == 'phrase') return 1
    } else {
      if (item.data?.code == "unfulfilled_tasks") return 2
      if (item.data?.code == "reminder_tasks") return 3
      return 0
    }

  }
  // 0 - undefine push
  // 1 - phrase
  // 2 - unfulfilled_tasks
  // 3 - reminder_tasks

  renderItem = ({ item, index }) => {
    let type = this.whatTopic(item)
    let leftBC = type == 1 ? '#69C779' : type == 2 ? '#FE6301' : '#87CEFA'

    return (
      <View style={{ marginTop: 32 }}>
        <View
          style={{
            paddingHorizontal: 16,
            paddingVertical: 10,
            backgroundColor: 'white',
            width: width / 1.3,
            borderRadius: 8,
            flexDirection: 'row',
            borderLeftColor: leftBC,
            borderLeftWidth: 3.5
          }}>
          <View>
            <Text style={{ fontSize: 17, lineHeight: 22 }}>{item.body}</Text>
            {
              type == 2 || type == 3 ?
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate('Unfulfilled_tasks', { date: item.created_at, title: item.title, id: item.data?.id })

                  }}
                  activeOpacity={0.7}
                  style={{
                    padding: 10,
                    backgroundColor: '#fff',
                    borderColor: leftBC,
                    borderWidth: 1,
                    borderRadius: 8,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: 8,
                  }}>
                  <Text
                    style={{
                      fontSize: 15,
                      color: leftBC,
                      fontWeight: '600',
                      textAlign: 'center',
                    }}>
                    {strings.jab}
                  </Text>
                </TouchableOpacity>
                :
                null

            }
          </View>

        </View>
        <Text style={{ marginTop: 4, color: 'rgba(0,0,0,0.4)', marginLeft: 11 }}>{GetTime(item.created_at, "D MMM YYYY,HH:mm")}</Text>
      </View>
    )
  };
  render() {
    const { data, fromPush } = this.state;
    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <StatusBar backgroundColor={'#fff'} barStyle="dark-content" />
        <SafeAreaView style={{ flex: 1, }}>
          <Header
            onLeftPress={() => {
              if (fromPush) {
                this.props.navigation.replace('TabStack')
              } else {
                this.props.navigation.goBack()
              }
            }}
            title={strings.uved}
          />
          <FlatList
            data={data}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            renderItem={this.renderItem}
            style={{ padding: 16, backgroundColor: '#F3F3F3' }}
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
