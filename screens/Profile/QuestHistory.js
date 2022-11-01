/* eslint-disable react-native/no-inline-styles */
import axios from 'axios';
import React, { Component } from 'react';
import { View, Text, StatusBar, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import { GetTime, width } from '../../Component/Component';
import Header from '../../Component/Header2';
import { strings } from '../../Localization/Localization';
import { CommonActions } from '@react-navigation/native';


export default class QuestHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      isLoading: true
    };
  }

  componentDidMount() {
    axios.get('todos/statistics/')
      .then(response => {
        console.log('RESPONSE statistics:', response);
        let result = [];
        const x = response.data;
        console.log('RESPONSE x:', x);

        result = Object.entries(x).map(([key, val]) => (
          {
            ['date']: key,
            ['total']: val.total,
            ['done']: val.done
          }
        ));
        console.log('RESPONSE result:', result);

        this.setState({
          data: result,
          isLoading: false,
        });
      })
      .catch(error => {
        this.setState({
          isLoading: false,
        });
      })
  }

  renderItem = ({ item, index }) => (
    <TouchableOpacity
      onPress={() => {

        this.props.navigation.dispatch(
          CommonActions.reset({
            index: 1,
            routes: [
              {
                name: 'Tab1',
                params: { date: item.date },
              },
            ],
          })
        );

        // this.props.navigation.pop('Tab1', { date: item.date })
      }}
      style={{ marginBottom: 16 }}>
      <Text style={{ textTransform: 'capitalize', fontSize: 17, fontWeight: '600' }}>{GetTime(item.date, "ddd, DD MMMM")}</Text>
      <View
        style={{
          marginTop: 11,
          backgroundColor: '#ECEDFB',
          borderRadius: 8,
          padding: 16,
        }}>
        <Text style={{ fontSize: 15, color: '#8A8FA0' }}>{strings.bugjet}</Text>
        <View
          style={{
            flexDirection: 'row',
            marginTop: 3,
            justifyContent: 'space-between',
            alignItems: 'flex-end',
          }}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
            <Text style={{ fontSize: 37, color: '#272727' }}>{item.total - item.done}</Text>
            <Text
              style={{
                fontSize: 14,
                color: '#8A8FA0',
                marginLeft: 8,
                marginBottom: 5,
              }}>
              {strings.kaldy}
            </Text>
          </View>
          <View
            style={{
              width: width / 2.4,
              marginBottom: 6,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text style={{ fontSize: 12, color: '#8A8FA0' }}>{item.done * 100 / item.total}%</Text>
              <Text style={{ fontSize: 12, color: '#8A8FA0' }}>{item.done}/{item.total}</Text>
            </View>
            <View
              style={{
                backgroundColor: '#A2C4F5',
                height: 8,
                width: '100%',
                borderRadius: 8,
                marginTop: 5,
              }}>
              <View
                style={{
                  width: item.done * 100 / item.total + '%',
                  height: 8,
                  backgroundColor: '#232857',
                  borderRadius: 8,
                }}
              />
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  render() {
    const { data } = this.state;
    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <StatusBar backgroundColor={'#fff'} barStyle="dark-content" />
        <SafeAreaView style={{ flex: 1 }}>
          <Header
            onLeftPress={() => this.props.navigation.goBack()}
            title={strings.ques}
          />
          <FlatList
            data={data}
            keyExtractor={(item, index) => index.toString()}
            renderItem={this.renderItem}
            style={{ padding: 16 }}
            showsVerticalScrollIndicator={false}
          />
        </SafeAreaView>
      </View>
    );
  }
}
