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
  TextInput,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { getLang, getObject, storeObject } from '../../Component/Component';
import Header from '../../Component/Header2';
import { Left, Right, WeekIcon } from '../../Component/MyIcons';
import { strings } from '../../Localization/Localization';
import Modal from 'react-native-modalbox';


const getLabel = (label) => {
  switch (label) {
    case 'Руханият': return 'Духовный интеллект';
    case 'Интелектуалдық даму': return 'Интеллектуальный интеллект';
    case 'Отбасы': return 'Семья';
    case 'Қаржы тәуелсіздігі': return 'Финансовый независимость';
    case 'Денсаулық': return 'Здоровья';
    case 'Қарым-қатынас': return 'Отношение';
    case 'Қоғамдық жұмыс': return 'Общественные дела';
    case 'Хобби': return 'Хобби/Отдых';
    case '3 ай': return '3 месяц';
    case '6 ай': return '6 месяц';
    case '1 жыл': return '1 год';
    case '3 жыл': return '3 года';
    case '5 жыл': return '5 года';

    default: return '';
  }
}


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
      section_id: null,
      section: [],
      isLoadingS: true,
      inputArray: [],
      modalBoll: false,
      value1: null,
      value2: null,
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

    this.GetSection();
    this.GetCategory();


  }
  GetSection() {
    axios
      .get('goals/section/?sorting=sort')
      .then(response => {
        console.log('RESPONSE section:', response);

        let section = response.data.sort((a, b) => (a.sort > b.sort) ? 1 : -1)
        this.setState({
          section: section,
          section_id: section[0].id,
          isLoadingS: false,
        });
      })
      .catch(error => {
        this.setState({
          isLoading: false,
        });
      });
  }

  GetCategory() {
    axios
      .get('goals/category/?sorting=sort')
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
            section_id: item.id,
          });
        }}>
        <Text style={{ color: 'black', fontWeight: '600', fontSize: 13 }}>{getLang() == 'kk' ? item.label : getLabel(item.label)}</Text>
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
          marginHorizontal: 16,
          marginTop: 8,
          padding: 16,
          borderBottomColor: '#8E8E93',
          borderBottomWidth: 0.5,
        }}
        onPress={() => {
          this.props.navigation.navigate('Goals', {
            category_id: item.id,
            section_id: this.state.section_id,
            label: item.label,
          });
        }}>
        <Text style={{ color: 'black', flex: 1, fontSize: 17 }}>{getLang() == 'kk' ? item.label : getLabel(item.label)}</Text>
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
    const { goalCate, section, modalBoll, inputArray, selectedIndex, value1, value2 } = this.state;

    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <SafeAreaView style={{ flex: 1 }}>
          <Header
            title={strings.mygoals}
            onLeftPress={() => this.props.navigation.goBack()}
          />
          <View
            style={{
              backgroundColor: '#D8D8DC',
              marginHorizontal: 16,
              borderRadius: 8,
              padding: 2,
            }}>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={section}
              keyExtractor={(item, index) => index.toString()}
              renderItem={this.renderItemCat}
            />
          </View>

          <Text style={{ marginLeft: Dimensions.get('window').width / 7, marginTop: 8, color: 'rgba(0,0,0,0.6)' }}>мерзімі :</Text>
          <View style={{ marginVertical: 4, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <TouchableOpacity
              style={{ backgroundColor: '#F2F2F7', borderRadius: 8, }}
              onPress={() => {
                this.setState({
                  value1: inputArray[selectedIndex]?.key1,
                  value2: inputArray[selectedIndex]?.key2,
                  modalBoll: true
                })
              }}
            >
              <Text
                style={{ color: 'black', textAlign: 'center', width: Dimensions.get('window').width / 3, paddingVertical: 8 }}
                placeholder={"ай"}
                numberOfLines={1}
              >{inputArray[selectedIndex]?.key1}</Text>
            </TouchableOpacity>
            <Text style={{ color: 'black', margin: 8 }}>-</Text>
            <TouchableOpacity
              style={{ backgroundColor: '#F2F2F7', borderRadius: 8, }}
              onPress={() => {
                this.setState({
                  value1: inputArray[selectedIndex]?.key1,
                  value2: inputArray[selectedIndex]?.key2,
                  modalBoll: true
                })
              }}
            >
              <Text
                style={{ color: 'black', textAlign: 'center', width: Dimensions.get('window').width / 3, paddingVertical: 8 }}
                placeholder={"ай"}
                numberOfLines={1}
              >{inputArray[selectedIndex]?.key2}</Text>
            </TouchableOpacity>
          </View>

          <View style={{ flex: 1, backgroundColor: 'white' }}>
            <FlatList
              data={goalCate}
              keyExtractor={(item, index) => index.toString()}
              renderItem={this.renderItem}
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
        </SafeAreaView>
      </View>
    );
  }
}
