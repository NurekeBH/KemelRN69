import React, { Component } from 'react';
import Header from '../../Component/Header2';
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  ScrollView,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { width, height, showToast, GetTime } from '../../Component/Component';
import { Left, RightGray } from '../../Component/MyIcons';
import FastImage from 'react-native-fast-image';
import axios from 'axios';

import PieChart from 'react-native-pie-chart';


export default class Statistics extends Component {
  constructor(props) {
    super(props);
    this.state = {

      indList: 0,
      costsList: [],
      isLoading: true,
      series: [],
      seriesColor: [],
    };
  }


  componentDidMount() {
    this.getStatistic();

  }

  getStatistic() {
    axios.get('wallets/payment/types/statistics/')
      .then(response => {
        console.log('RESPONSE statistics:', response);

        let Sum = response.data.data.reduce((a, v) => a = a + v.value, 0)
        var series = [];
        var seriesColor = [];
        for (var i = 0; i < response.data.data.length; i++) {
          series[i] = response.data.data[i].value ? response.data.data[i].value : 0;
          seriesColor[i] = response.data.data[i].color.value ? response.data.data[i].color.value : "#5856D6";
        }
        console.log('series', series)
        this.setState({
          isLoading: false,
          response: response.data,
          costsList: response.data.data,
          month: response.data.month,
          Sum: Sum,
          series: series,
          seriesColor: seriesColor
        });
      })
      .catch(error => {
        this.setState({
          isLoading: false,
        });
        console.log('RESPONSE error:', error.response);
        if (error.response && error.response.status == 401) {
          showToast('error', error.response.data.detail);
        }
      });
  }



  renderItem = () => {
    return (
      <View
        style={{
          width: width,
          aspectRatio: 1,
          alignItems: 'center',
          justifyContent: 'center'
        }}>
        <PieChart
          widthAndHeight={width - 40}
          series={this.state.series}
          sliceColor={this.state.seriesColor}
          doughnut={true}
          coverRadius={0.85}
          coverFill={'#FFF'}
        />
        <View style={{ position: 'absolute', alignItems: 'center' }}>
          <Text style={{ fontSize: 17, fontWeight: '600', color: '#000000' }}>Шығындар</Text>
          <Text style={{ fontSize: 34, fontWeight: '600', color: '#000000' }}>{this.state.Sum}₸</Text>
        </View>

      </View>
    );
  };

  render() {
    const { seriesColor, indList, costsList, month, isLoading } = this.state;
    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <StatusBar backgroundColor={'#fff'} barStyle="dark-content" />
        <SafeAreaView style={{ flex: 1 }}>
          <Header
            onLeftPress={() => this.props.navigation.goBack()}
            title={'Статистика'}
          />


          {isLoading ?
            <ActivityIndicator /> :
            <ScrollView showsVerticalScrollIndicator={false}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginHorizontal: 11,
                  alignItems: 'center',
                }}>
                <TouchableOpacity
                  disabled={indList == 0}
                  // onPress={() => {
                  //   this.setState({ indList: indList - 1 }, () =>
                  //     this.listRef.scrollToIndex({ index: indList - 1 }),
                  //   );
                  // }}
                  activeOpacity={0.7}
                  style={{ width: 40 }}>
                  {Left}
                </TouchableOpacity>
                <Text style={{ fontSize: 22, fontWeight: '700', textTransform: 'capitalize' }}>
                  {GetTime(month, "MMMM")}
                  <Text style={{ fontSize: 20, fontWeight: '400' }}> {GetTime(month, "YYYY")}</Text>
                </Text>
                <TouchableOpacity
                  // onPress={() => {
                  //   this.setState({ indList: indList + 1 }, () =>
                  //     this.listRef.scrollToIndex({ index: indList + 1 }),
                  //   );
                  // }}
                  activeOpacity={0.7}
                  style={{ width: 40, alignItems: 'flex-end' }}>
                  {RightGray}
                </TouchableOpacity>
              </View>
              {/* <FlatList
                ref={e => (this.listRef = e)}
                data={dataStaticList}
                horizontal
                onScroll={e => {
                  let offset = e.nativeEvent.contentOffset.x;
                  let index = offset / width;
                  if (index != indList && index % 1 == 0) {
                    this.setState({ indList: index });
                  }
                }}
                showsHorizontalScrollIndicator={false}
                pagingEnabled
                renderItem={this.renderItem}
              /> */}
              {this.renderItem()}
              {/* <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                {seriesColor.map((item, index) => (
                  <View
                    key={index}
                    style={[
                      {
                        backgroundColor: index == indList ? '#007AFF' : '#E5E5EA',
                      },
                      styles.circleStl,
                    ]}
                  />
                ))}
              </View> */}
              <View>
                <Text
                  style={{
                    fontWeight: '700',
                    fontSize: 22,
                    marginHorizontal: 16,
                    marginTop: 40,
                    marginBottom: 10,
                  }}>
                  Шығындар
                </Text>
                {costsList.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={{
                      paddingHorizontal: 16,
                      paddingVertical: 10,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      borderBottomWidth: 1,
                      borderBottomColor: 'rgba(0, 0, 0, 0.2)',
                      alignItems: 'center',
                      backgroundColor: '#fff',
                    }}
                    onPress={() => this.props.navigation.navigate('ChooseIcons')}

                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <View
                        style={{
                          width: 40,
                          height: 40,
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginTop: 4,
                          borderRadius: 10,
                          backgroundColor: item.color.value
                        }
                        }>
                        <FastImage
                          source={{
                            uri: item.icon.icon,
                          }}
                          style={{
                            width: 24,
                            height: 24,
                          }}
                        />
                      </View>
                      <Text
                        style={{
                          fontSize: 17,
                          fontWeight: '600',
                          marginLeft: 12,
                          width: width / 2,
                        }}>
                        {item.label}
                      </Text>
                    </View>
                    <Text style={{ fontSize: 17, color: '#3F49DC' }}>
                      - {item.value}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          }



        </SafeAreaView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  circleStl: {
    width: 8,
    aspectRatio: 1,
    marginHorizontal: 5,
    borderRadius: 10,
    marginTop: 10,
  },
});
