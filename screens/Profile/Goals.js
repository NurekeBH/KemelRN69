import axios from 'axios';
import React, { Component } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Header from '../../Component/Header2';
import {
  Bottom,
  Check,
  Done,
  PluseBtn,
  statusIcon,
  swipeDelete,
  Up,
  WeekIcon,
} from '../../Component/MyIcons';
import { strings } from '../../Localization/Localization';

import { width } from '../../Component/Component';
import Collapsible from 'react-native-collapsible';
import Modal from 'react-native-modalbox';
import Swipeout from '../../Swipeout/index';

export default class Goals extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      goalCate: [],
      doneGoal: [],
      processGoal: [],

      allCount: 0,
      doneCount: 0,
      processCount: 0,
      notDoneCount: 0,

      isOpenGoal: false,
      isOpenDoneGoal: false,
      isOpenprocessGoal: false,

      openModal: false,
      modalItem: null,
    };
    this.category_id = props.route.params?.category_id;
    this.section_id = props.route.params?.section_id;
    this.label = props.route.params?.label;
  }

  componentDidMount() {
    this.GetGoal();
  }

  GetGoal() {
    axios
      .get(
        `goals/goal/?section_id=${this.section_id}&category_id=${this.category_id}`,
      )
      .then(response => {
        console.log('RESPONSE goals/goal:', response);

        let arrTasks = response.data;
        let DoneTasks = arrTasks.filter(item => item.status == 2);
        let processGoal = arrTasks.filter(item => item.status == 1);
        let NotDoneTasks = arrTasks.filter(item => item.status == null);

        this.setState({
          goalCate: NotDoneTasks,
          doneGoal: DoneTasks,
          processGoal: processGoal,

          isLoading: false,
          allCount: arrTasks.length,
          doneCount: DoneTasks.length,
          processCount: processGoal.length,
          notDoneCount: NotDoneTasks.length,

          openModal: false,
          modalItem: null,
        });
      })
      .catch(error => {
        console.log('RESPONSE  goals/goal333:', error.response);
        this.setState({
          isLoading: false,
        });
      });
  }

  renderItem(item, index) {
    return (
      <Swipeout
        autoClose={true}
        style={{
          borderRadius: 6,
          maxHeight: 200,
          marginTop: 4,
        }}
        right={[
          {
            component: (
              <View
                style={{
                  backgroundColor: '#f0dcda',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flex: 1,
                  maxHeight: 200,
                }}>
                {swipeDelete}
                <Text style={{ marginTop: 4, fontSize: 8, color: '#FF3B30' }}>
                  {strings.delete}
                </Text>
              </View>
            ),
            onPress: () => {
              axios
                .delete(`goals/goal/${item.id}/`)
                .then(response => {
                  console.log('RESPONSE goal:', response);

                  this.GetGoal();
                })
                .catch(error => {
                  console.log('RESPONSE goal:', error.response);
                  if (error.response && error.response.status == 401) {
                    showToast('error', error.response.data.detail);
                  }
                });
            },
          },
        ]}>
        <View key={index} style={styles.vwStl}>
          <TouchableOpacity
            onPress={() => {
              this.setState({
                modalItem: item,
                openModal: true,
              });
            }}
            activeOpacity={0.8}
            key={index}
            style={{ flexDirection: 'row', flex: 1 }}>
            {item.status == 2 ? (
              <View style={styles.doneStl}>{Done}</View>
            ) : (
              <View
                style={[
                  styles.doneStl2,
                  {
                    borderColor: item.status == 1 ? '#FF9500' : '#000000',
                  },
                ]}
              />
            )}
            <Text
              style={{
                marginLeft: 14,
                fontSize: 15,
                flex: 1,
                textDecorationLine: item.done ? 'line-through' : 'none',
                color: item.done ? '#8E8E93' : '#000',
              }}>
              {item.label}
            </Text>
          </TouchableOpacity>
        </View>
      </Swipeout>
    );
  }

  onDoneTasks(item, status) {
    console.log('item', item);
    console.log('status', status);
    axios
      .put(`goals/goal/${item.id}/`, {
        label: item.label,
        category: this.category_id,
        section: this.section_id,
        author: item.author,
        status: status,
      })
      .then(response => {
        console.log('RESPONSE put:', response);
        this.GetGoal();
      })
      .catch(error => {
        this.setState({
          isLoading: false,
          openModal: false,
          modalItem: null,
        });
        console.log('RESPONSE put:', error.response);
        if (error.response && error.response.status == 401) {
          showToast('error', error.response.data.detail);
        }
      });
  }

  updateData = () => {
    this.GetGoal();
  };

  render() {
    const {
      isLoading,
      goalCate,
      doneGoal,
      processGoal,
      allCount,
      doneCount,
      processCount,
      notDoneCount,
      openModal,
      modalItem,
    } = this.state;
    const procentDone = parseInt((doneCount * 100) / allCount);

    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
          <Header
            title={this.label}
            onLeftPress={() => this.props.navigation.goBack()}
          />
          {isLoading ? <ActivityIndicator color={'white'} /> : null}

          <ScrollView style={{ backgroundColor: 'white', flex: 1 }}>
            <View
              style={{
                paddingHorizontal: 16,
                paddingVertical: 10,
                borderRadius: 6,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: 'white',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontSize: 32,
                    fontWeight: '500',
                    color: '#272727',
                  }}>
                  {doneCount}
                </Text>
                <Text style={{ fontSize: 13, color: '#232857', marginLeft: 8 }}>
                  {strings.bugjet2}
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
                  <Text style={{ fontSize: 12, color: '#8A8FA0' }}>
                    {procentDone}%
                  </Text>
                  <Text style={{ fontSize: 12, color: '#8A8FA0' }}>
                    {doneCount}/{allCount}
                  </Text>
                </View>
                <View
                  style={{
                    backgroundColor: '#EBEBF0',
                    height: 8,
                    width: '100%',
                    borderRadius: 8,
                    marginTop: 5,
                  }}>
                  <View
                    style={{
                      width: procentDone + '%',
                      height: 8,
                      backgroundColor: '#6577F3',
                      borderRadius: 8,
                    }}
                  />
                </View>
              </View>
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingRight: 22,
              }}>
              <Text
                style={{
                  fontSize: 17,
                  color: '#232857',
                  fontWeight: '600',
                  marginHorizontal: 16,
                  marginTop: 16,
                  marginBottom: 8,
                  flex: 1,
                }}>
                {strings.mygoals}
              </Text>
              {/* <Text style={{color: '#8E8E93', fontSize: 15}}>
                {notDoneCount}
              </Text> */}
              {/* {this.state.isOpenGoal ? Bottom : Up} */}
            </View>

            {/* <Collapsible collapsed={this.state.isOpenGoal}> */}
            <View style={{ marginHorizontal: 16 }}>
              {goalCate.map((item, index) => {
                return this.renderItem(item, index);
              })}
            </View>
            {/* </Collapsible> */}

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingRight: 22,
              }}>
              <Text
                style={{
                  fontSize: 17,
                  color: '#232857',
                  fontWeight: '600',
                  marginHorizontal: 16,
                  marginTop: 16,
                  marginBottom: 8,
                  flex: 1,
                }}>
                {strings.process}
              </Text>
              {/* <Text style={{color: '#8E8E93', fontSize: 15}}>
                {processCount}
              </Text> */}
              {/* {this.state.isOpenprocessGoal ? Bottom : Up} */}
            </View>

            {/* <Collapsible collapsed={this.state.isOpenprocessGoal}> */}
            <View style={{ marginHorizontal: 16 }}>
              {processGoal.map((item, index) => {
                return this.renderItem(item, index);
              })}
            </View>
            {/* </Collapsible> */}

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingRight: 22,
              }}>
              <Text
                style={{
                  flex: 1,
                  fontSize: 17,
                  color: '#232857',
                  fontWeight: '600',
                  marginHorizontal: 16,
                  marginTop: 16,
                  marginBottom: 8,
                }}>
                {strings.done}
              </Text>
              {/* <Text style={{color: '#8E8E93', fontSize: 15}}>{doneCount}</Text> */}
              {/* {this.state.isOpenDoneGoal ? Bottom : Up} */}
            </View>

            {/* <Collapsible collapsed={this.state.isOpenDoneGoal}> */}
            <View style={{ marginHorizontal: 16 }}>
              {doneGoal.map((item, index) => {
                return this.renderItem(item, index);
              })}
            </View>
            {/* </Collapsible> */}
          </ScrollView>

          <TouchableOpacity
            onPress={() =>
              this.props.navigation.navigate('AddGoal', {
                category_id: this.category_id,
                section_id: this.section_id,
                label: this.label,
                updateData: this.updateData,
              })
            }
            activeOpacity={0.7}
            style={{
              margin: 16,
              alignSelf: 'flex-end',
              width: 56,
              aspectRatio: 1,
              borderRadius: 28,
              backgroundColor: '#9B8274',
              justifyContent: 'center',
              alignItems: 'center',

            }}>
            {PluseBtn}
          </TouchableOpacity>
        </SafeAreaView>
        <Modal
          position="bottom"
          backButtonClose
          isOpen={openModal}
          onClosed={() => {
            this.setState({
              modalItem: null,
              openModal: false,
            });
          }}
          style={{
            backgroundColor: 'white',
            borderTopRightRadius: 12,
            borderTopLeftRadius: 12,
            height: Dimensions.get('window').height / 2,
          }}>
          {modalItem ? (
            <View style={{ padding: 16 }}>
              <Text style={{ fontSize: 17, fontWeight: '500', color: 'black' }}>
                {modalItem.label}
              </Text>
              <Text style={{ marginTop: 16, fontSize: 14, color: '#8E8E93' }}>
                Изменить статус
              </Text>
              <TouchableOpacity
                onPress={() => {
                  if (modalItem.status != null) {
                    this.onDoneTasks(modalItem, null);
                  }
                }}
                style={{
                  marginVertical: 16,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                {modalItem.status == null ? (
                  Check
                ) : (
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 10,
                      borderColor: '#DADADA',
                      borderWidth: 1,
                    }}
                  />
                )}
                <Text style={{ marginLeft: 8, color: 'black', }}>Мақсаттарым</Text>
              </TouchableOpacity>
              <View
                style={{
                  width: '100%',
                  height: 0.5,
                  backgroundColor: '#DADADA',
                }}
              />
              <TouchableOpacity
                style={{
                  marginVertical: 16,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
                onPress={() => {
                  if (modalItem.status != 1) {
                    this.onDoneTasks(modalItem, 1);
                  }
                }}>
                {modalItem.status == 1 ? (
                  Check
                ) : (
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 10,
                      borderColor: '#DADADA',
                      borderWidth: 1,
                    }}
                  />
                )}
                <Text style={{ marginLeft: 8, color: 'black', }}>Орындалуда</Text>
              </TouchableOpacity>
              <View
                style={{
                  width: '100%',
                  height: 0.5,
                  backgroundColor: '#DADADA',
                }}
              />
              <TouchableOpacity
                style={{
                  marginVertical: 16,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
                onPress={() => {
                  if (modalItem.status != 2) {
                    this.onDoneTasks(modalItem, 2);
                  }
                }}>
                {modalItem.status == 2 ? (
                  Check
                ) : (
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 10,
                      borderColor: '#DADADA',
                      borderWidth: 1,
                    }}
                  />
                )}
                <Text style={{ color: 'black', marginLeft: 8 }}>Орындалды</Text>
              </TouchableOpacity>
              <View
                style={{
                  width: '100%',
                  height: 0.5,
                  backgroundColor: '#DADADA',
                }}
              />
            </View>
          ) : null}
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  vwStl: {
    paddingHorizontal: 14,
    borderRadius: 6,
    height: 55,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.3)'
  },
  doneStl: {
    width: 24,
    aspectRatio: 1,
    borderRadius: 12,
    backgroundColor: '#34C759',
    justifyContent: 'center',
    alignItems: 'center',
  },
  doneStl2: {
    width: 24,
    aspectRatio: 1,
    borderRadius: 12,
    borderWidth: 2,
  },
});
