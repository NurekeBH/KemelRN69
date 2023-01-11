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
  TextInput,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Header from '../../Component/Header2';
import {
  Bottom,
  Check,
  closeIcon,
  Done,
  PluseBtn,
  statusIcon,
  swipeDelete,
  Up,
  WeekIcon,
} from '../../Component/MyIcons';
import { strings } from '../../Localization/Localization';

import { getLabelGoal, width } from '../../Component/Component';
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

      label: '',
      desc: '',
      fromDate: '',
      toDate: '',
      modalStatus: null
    };
    this.category_id = props.route.params?.category_id;
    this.section_id = props.route.params?.section_id;
    this.Title = props.route.params?.label;
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
          label: '',
          desc: '',
          fromDate: '',
          toDate: '',
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
        <View key={index} style={[styles.vwStl, { paddingVertical: 8 }]}>
          <TouchableOpacity
            onPress={() => {
              this.setState({
                modalItem: item,
                label: item.label,
                desc: item.desc,
                fromDate: item.date_from,
                toDate: item.date_to,
                modalStatus: item.status,
                openModal: true,
              });
            }}
            activeOpacity={0.8}
            key={index}
            style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
            {item.status == 2 ? (
              <View style={styles.doneStl}>{Done}</View>
            ) : (
              <View
                style={[
                  styles.doneStl2,
                  {
                    borderColor: item.status == 1 ? '#FF9500' : 'rgba(0,0,0,0.5)',
                  },
                ]}
              />
            )}
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text
                style={{
                  fontSize: 15,
                  textDecorationLine: item.status == 2 ? 'line-through' : 'none',
                  color: item.status == 2 ? '#8E8E93' : '#000',
                }}>
                {item.label}
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  marginTop: 2,
                  color: 'rgba(0,0,0,0.7)',
                }}>{item.date_from ? (item.date_from + ' - ' + item.date_to) : null}</Text>


            </View>

          </TouchableOpacity>
        </View>
      </Swipeout>
    );
  }

  onDoneTasks(item) {
    console.log(' MODAL item', item);

    axios
      .put(`goals/goal/${item.id}/`, {
        label: this.state.label,
        category: this.category_id,
        section: this.section_id,
        author: item.author,
        status: this.state.modalStatus,
        date_from: this.state.fromDate,
        date_to: this.state.toDate,
        desc: this.state.desc
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
          label: '',
          desc: '',
          fromDate: '',
          toDate: '',
          modalStatus: null,
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
      modalStatus
    } = this.state;
    const procentDone = parseInt((doneCount * 100) / allCount);

    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
          <Header
            title={getLabelGoal(this.Title)}
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
                label: this.Title,
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
              backgroundColor: '#3F49DC',
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
              label: '',
              desc: '',
              fromDate: '',
              toDate: '',
              modalStatus: null,
              openModal: false,
            });
          }}
          style={{
            backgroundColor: 'white',
            borderTopRightRadius: 12,
            borderTopLeftRadius: 12,
            height: Dimensions.get('window').height / 2,
          }}>
          <TouchableOpacity
            onPress={() => {
              this.onDoneTasks(modalItem);
            }}
            style={{ alignItems: 'flex-end', paddingRight: 16, paddingTop: 16 }}>
            <Text
              style={{ fontSize: 17, fontWeight: '600', color: '#3F49DC' }}>
              {strings.save}</Text>
          </TouchableOpacity>
          {modalItem ? (
            <View style={{ paddingHorizontal: 16 }}>

              <TextInput
                style={{
                  fontSize: 17, fontWeight: '500', color: 'black'
                }}
                placeholderTextColor="#D1D1D6"
                multiline
                placeholder={strings.goalTitle}
                onChangeText={label => {
                  this.setState({
                    label
                  })
                }}
                value={this.state.label}
                returnKeyType="next"
              />


              <TextInput
                style={{
                  fontSize: 14,
                  fontWeight: '400',
                  marginTop: 8
                }}
                placeholderTextColor="#D1D1D6"
                multiline
                placeholder={strings.goalDesc}
                onChangeText={desc => {
                  this.setState({
                    desc
                  })
                }}
                value={this.state.desc}
                returnKeyType="next"
              />

              <Text style={{ color: 'rgba(0,0,0,0.6)', marginHorizontal: 4, marginTop: 16 }}>{strings.goalDate}</Text>

              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 4 }}>
                <View
                  style={{ backgroundColor: '#F2F2F7', borderRadius: 8, }} >

                  <TextInput
                    style={{ fontSize: 16, color: 'black', textAlign: 'center', width: Dimensions.get('window').width / 2 - 20, paddingVertical: 4 }}
                    numberOfLines={1}
                    onChangeText={fromDate => {
                      this.setState({
                        fromDate
                      })
                    }}
                    value={this.state.fromDate}
                  />
                </View>
                <Text style={{ color: 'black', margin: 8 }}>-</Text>

                <View
                  style={{ backgroundColor: '#F2F2F7', borderRadius: 8, }} >
                  <TextInput
                    style={{ fontSize: 16, color: 'black', textAlign: 'center', width: Dimensions.get('window').width / 2 - 20, paddingVertical: 4 }}
                    numberOfLines={1}
                    onChangeText={toDate => {
                      this.setState({
                        toDate
                      })
                    }}
                    value={this.state.toDate}
                  />
                </View>
              </View>

              <Text style={{ marginTop: 16, fontSize: 14, color: '#8E8E93' }}>
                {strings.changeStatus}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  if (modalStatus != null) {
                    // this.onDoneTasks(modalItem, null);
                    this.setState({
                      modalStatus: null
                    })
                  }
                }}
                style={{
                  marginVertical: 16,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                {modalStatus == null ? (
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
                <Text style={{ marginLeft: 8, color: 'black', }}>{strings.mygoals}</Text>
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
                  if (modalStatus != 1) {
                    // this.onDoneTasks(modalItem, 1);
                    this.setState({
                      modalStatus: 1
                    })
                  }
                }}>
                {modalStatus == 1 ? (
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
                <Text style={{ marginLeft: 8, color: 'black', }}>{strings.process}</Text>
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
                  if (modalStatus != 2) {
                    // this.onDoneTasks(modalItem, 2);
                    this.setState({
                      modalStatus: 2
                    })
                  }
                }}>
                {modalStatus == 2 ? (
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
                <Text style={{ color: 'black', marginLeft: 8 }}>{strings.done}</Text>
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
