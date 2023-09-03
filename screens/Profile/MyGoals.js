import axios from 'axios';
import React, { Component } from 'react';
import {
  View,
  FlatList,
  Text,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TextInput,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { getLabelGoal, getLang, getObject, storeObject } from '../../Component/Component';
import Header from '../../Component/Header2';
import { Left, Right, WeekIcon } from '../../Component/MyIcons';
import { descHowGoal, omirTepe, strings } from '../../Localization/Localization';
import Modal from 'react-native-modalbox';
import FastImage from 'react-native-fast-image';




const InputArray = [
  {
    key1: '',
    key2: ''
  }, {
    key1: '',
    key2: ''
  }, {
    key1: '',
    key2: ''
  }, {
    key1: '',
    key2: ''
  },
]

export default class MyGoals extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      goalCate: [],
      selectedIndex: 0,
      section_id: 1,
      section: [],
      isLoadingS: true,
      inputArray: [],
      modalBoll: false,
      value1: null,
      value2: null,
      modalHow: false,
      modalHow2: false
    };
  }

  async componentDidMount() {
    let InputArr = await getObject('inputArr')
    if (InputArr) {
      this.setState({
        inputArray: InputArr
      })
    } else {
      await storeObject('inputArr', InputArray)
      this.setState({
        inputArray: InputArray
      })
    }
    console.log('InputArr', InputArr)

    // this.GetSection();
    this.GetCategory();


  }
  // GetSection() {
  //   axios
  //     .get('goals/section/?sorting=sort')
  //     .then(response => {
  //       console.log('RESPONSE section:', response);

  //       let section = response.data.sort((a, b) => (a.sort > b.sort) ? 1 : -1)
  //       this.setState({
  //         section: section,
  //         section_id: section[0].id,
  //         isLoadingS: false,
  //       });
  //     })
  //     .catch(error => {
  //       this.setState({
  //         isLoading: false,
  //       });
  //     });
  // }

  GetCategory() {
    axios
      .get('https://test.kemeladam.kz/api/goals/category/?sorting=sort')
      .then(response => {
        console.log('RESPONSE category:', response);
        let category = response.data.sort((a, b) => (a.sort > b.sort) ? 1 : -1)


        this.setState({
          goalCate: category,
          isLoading: false,
        });
      })
      .catch(error => {
        this.setState({
          isLoading: false,
        });
      });
  }

  renderItemCat = ({ item, index }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        style={{
          width: 85,
          height: 25,
          borderRadius: 8,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: this.state.selectedIndex == index ? 'white' : null,
        }}
        onPress={() => {
          this.setState({
            selectedIndex: index,
          });
        }}>
        <Text style={{ color: 'black', fontWeight: '600', fontSize: 13 }}>{getLabelGoal(item.label)}</Text>
      </TouchableOpacity>
    );
  };

  renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'white',
          borderRadius: 12,
          marginTop: 8,
          padding: 16,
          borderBottomColor: '#8E8E93',
          borderBottomWidth: 0.5,
          backgroundColor: item?.color
        }}
        onPress={() => {
          this.props.navigation.navigate('Goals', {
            category_id: item.id,
            section_id: this.state.section_id,
            label: item.label,
          });
        }}>
        <Text style={{ color: 'black', flex: 1, fontSize: 17 }}>{getLabelGoal(item.label)}</Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={{ fontSize: 17, color: 'grey', marginRight: 8 }}>
            {item.total_task}
          </Text>
          {Right}
        </View>
      </TouchableOpacity>
    );
  };


  async onSaveClick() {
    const { selectedIndex, value1, value2, inputArray } = this.state;
    let InputArrayy = inputArray

    if (value1 && value2) {
      InputArrayy[selectedIndex].key1 = value1
      InputArrayy[selectedIndex].key2 = value2

      await storeObject('inputArr', InputArrayy)
      this.setState({
        inputArray: InputArrayy,
        modalBoll: false,
        value1: null,
        value2: null
      })

    }


  }

  render() {
    const { goalCate, modalHow, modalHow2, section, modalBoll, inputArray, selectedIndex, value1, value2 } = this.state;

    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <SafeAreaView style={{ flex: 1 }}>
          <Header
            title={strings.mygoals}
            onLeftPress={() => this.props.navigation.goBack()}
          />


          <View style={{ flex: 1, backgroundColor: 'white' }}>
            <FlatList
              data={goalCate}
              keyExtractor={(item, index) => index.toString()}
              renderItem={this.renderItem}
              ListFooterComponent={() =>
              (
                <View>

                  <TouchableOpacity
                    style={{
                      padding: 16,
                      borderBottomColor: '#8E8E93',
                      borderBottomWidth: 0.5,
                    }}
                    onPress={() => {
                      this.setState({
                        modalHow: true
                      })
                    }}
                  >
                    <Text style={{ color: 'rgba(0,0,0,0.6)' }}>Мақсатты қалай қоямыз?</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{
                      padding: 16,
                      borderBottomColor: '#8E8E93',
                      borderBottomWidth: 0.5,
                    }}
                    onPress={() => {
                      this.setState({
                        modalHow2: true
                      })
                    }}
                  >
                    <Text style={{ color: 'rgba(0,0,0,0.6)' }}>Өмір тепе-теңдігі</Text>
                  </TouchableOpacity>



                </View>
              )
              }
            />
          </View>

          <Modal
            isOpen={modalBoll}
            position="bottom"
            onClosed={() => {
              this.setState({
                modalBoll: false,
              });
            }}
            style={{
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
              height: '30%',

            }}>
            <View style={{ alignItems: 'flex-end', padding: 16 }}>
              <TouchableOpacity onPress={() => this.onSaveClick()}>
                <Text style={{ fontSize: 17, fontWeight: '600', color: '#3F49DC' }}>
                  {strings.save}
                </Text>
              </TouchableOpacity>
            </View>


            <Text style={{ marginLeft: Dimensions.get('window').width / 7, marginVertical: 18, color: 'rgba(0,0,0,0.6)' }}>мерзімі :</Text>
            <View style={{ marginVertical: 4, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              <TextInput
                value={value1}
                onChangeText={(text) => {
                  this.setState({
                    value1: text
                  })
                }}
                style={{ textAlign: 'center', width: Dimensions.get('window').width / 3, backgroundColor: '#F2F2F7', borderRadius: 8, paddingVertical: 8 }}
                autoFocus={true}
                numberOfLines={1}
              />
              <Text style={{ color: 'black', margin: 8 }}>-</Text>
              <TextInput
                value={value2}
                onChangeText={(text) => {
                  this.setState({
                    value2: text
                  })
                }}
                style={{ textAlign: 'center', width: Dimensions.get('window').width / 3, backgroundColor: '#F2F2F7', borderRadius: 8, paddingVertical: 8 }}

                numberOfLines={1}
              />
            </View>

          </Modal>


          <Modal
            isOpen={modalHow}
            position="bottom"

            onClosed={() => {
              this.setState({
                modalHow: false,
              });
            }}
            style={{
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
              height: '70%',

            }}>
            <ScrollView >
              <TouchableWithoutFeedback style={{ paddingVertical: 30 }}>
                <View style={{
                  padding: 16,
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>

                  <Text style={{ color: '#000', fontSize: 16, fontWeight: '500', textAlign: 'center' }}>Мақсатты қалай қоямыз?</Text>


                  <Text style={{ color: '#000', fontSize: 15, marginTop: 10 }}>{descHowGoal}</Text>

                </View>
              </TouchableWithoutFeedback>
            </ScrollView>
          </Modal>


          <Modal
            isOpen={modalHow2}
            position="bottom"

            onClosed={() => {
              this.setState({
                modalHow2: false,
              });
            }}
            style={{
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
              height: '70%',

            }}>
            <ScrollView >
              <TouchableWithoutFeedback style={{ paddingVertical: 30 }}>
                <View style={{
                  padding: 16,
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>

                  <Text style={{ color: '#000', fontSize: 16, fontWeight: '500', textAlign: 'center' }}>Өмір тепе-теңдігі</Text>

                  <FastImage
                    source={require('../../assets/diagram.png')}
                    style={{
                      width: '80%',
                      height: 300,
                    }}
                    resizeMode={FastImage.resizeMode.contain}
                  />

                  <Text style={{ color: '#000', fontSize: 15, marginTop: 10 }}>{omirTepe}</Text>

                </View>
              </TouchableWithoutFeedback>
            </ScrollView>
          </Modal>
        </SafeAreaView>
      </View>
    );
  }
}
