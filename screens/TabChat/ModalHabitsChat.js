import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Switch,
  ScrollView,
  TextInput,
  Dimensions,
  FlatList,
} from 'react-native';
import {
  ButtonClass,
  getLang,
  getTemplateLabel,
  GetTime,
  showToast,
} from '../../Component/Component';
import {
  Done,
  Minuse,
  Pluse,
  Plusee,
  PurposeIcon,
  RightRed,
  ShareNote,
  users,
} from '../../Component/MyIcons';
import DatePicker from 'react-native-date-picker';
import { strings } from '../../Localization/Localization';
import Modal from 'react-native-modalbox';
import Share from 'react-native-share';

import axios from 'axios';
import { colorApp } from '../../theme/Colors';

let weekArrKz = [
  { id: 1, label: 'Дс', acitve: false },
  { id: 2, label: 'Cс', acitve: false },
  { id: 3, label: 'Cр', acitve: false },
  { id: 4, label: 'Бс', acitve: false },
  { id: 5, label: 'Жм', acitve: false },
  { id: 6, label: 'Cб', acitve: false },
  { id: 7, label: 'Жс', acitve: false },
]
let weekArrEn = [
  { id: 1, label: 'Mon', acitve: false },
  { id: 2, label: 'Tue', acitve: false },
  { id: 3, label: 'Wed', acitve: false },
  { id: 4, label: 'Thu', acitve: false },
  { id: 5, label: 'Fri', acitve: false },
  { id: 6, label: 'Sat', acitve: false },
  { id: 7, label: 'Sun', acitve: false },
]
let weekArrRu = [
  { id: 1, label: 'Пн', acitve: false },
  { id: 2, label: 'Вт', acitve: false },
  { id: 3, label: 'Cр', acitve: false },
  { id: 4, label: 'Чт', acitve: false },
  { id: 5, label: 'Пт', acitve: false },
  { id: 6, label: 'Cб', acitve: false },
  { id: 7, label: 'Вс', acitve: false },
];




export default class ModalHabitsChat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      navigation: props.navigation,
      modelItem: props.modelItemData,
      isOpen: props.isOpen ? true : false,
      isSave: false,
      open: false,
      done: props.modelItemData.done,
      label: props.modelItemData.label,
      datetime: props.modelItemData.updated_at,
      purpose: props.modelItemData.purpose,
      isChange: false,
      weeks: [],
      week_day_ids: [],
      target_today: props.modelItemData.target_value && props.modelItemData.target_value.date == props.modelItemData.click_date ?
        props.modelItemData.target_value.value
        : 0,

      selected_template: props.modelItemData?.target_template,
      target: props.modelItemData?.target,

    };
  }

  componentDidMount() {

    let LANG = getLang()
    let weekArr = LANG == 'kk' ? weekArrKz : LANG == 'ru' ? weekArrRu : weekArrEn
    let arr = [];

    let weeks = this.state.modelItem.weeks;
    console.log('weeks', weeks);
    for (let j = 0; j < weekArr.length; j++) {
      weekArr[j].acitve = false;
      for (let i = 0; i < weeks.length; i++) {
        if (weeks[i].id === weekArr[j].id) {
          arr.push(weekArr[j].id);
          weekArr[j].acitve = true;
        }
      }
    }
    this.setState({
      weeks: weekArr,
      week_day_ids: arr,
    });



  }

  onSavePress() {
    let _modelItem = this.state.modelItem;
    _modelItem.label = this.state.label;
    _modelItem.done = this.state.done;
    _modelItem.datetime = this.state.datetime;
    _modelItem.purpose = this.state.purpose;
    _modelItem.target = this.state.target;
    _modelItem.weeks = this.state.week_day_ids;
    _modelItem.weeks = this.state.week_day_ids;


    const { target_today } = this.state;

    console.log('enumerate_object', _modelItem);

    if (target_today && target_today != _modelItem.target_value) {
      axios
        .post('todos/habit/' + _modelItem.id + '/target/', {
          value: target_today,
          date: _modelItem.click_date
        })
        .then(response => {
          console.log('RESPONSE enumerate:', response);
        })
        .catch(error => {
          console.log('RESPONSE enumerate err:', error.response);
        })
        .finally(() => {
          this.setState({
            modelItem: _modelItem,
            isSave: true,
          });
          this.purposeMdl.close();
        });
    } else {
      this.setState({
        modelItem: _modelItem,
        isSave: true,
      });
      this.purposeMdl.close();
    }


  }

  share() {
    let hmtl = this.state.label + '\n' + this.state.datetime;
    const shareOptions = {
      title: 'Kemel Adam',
      message: hmtl,
      url: 'https://kemeladam.kz/',
    };

    Share.open(shareOptions)
      .then(res => { })
      .catch(err => {
        err && console.log(err);
      });
  }

  render() {
    const {
      isOpen,
      modelItem,
      isSave,
      done,
      label,
      datetime,
      purpose,
      open,
      target_today,
      target,
      weeks,
      selected_template
    } = this.state;
    return (
      <Modal
        // this.myModal.toggleModal();
        ref={ref => {
          this.purposeMdl = ref;
        }}
        position="bottom"
        backButtonClose
        isOpen={isOpen}
        onClosed={() => {
          this.props.RefreshModal(modelItem, isSave);
        }}
        style={{
          height: 450,
          borderTopRightRadius: 12,
          borderTopLeftRadius: 12,
        }}>
        {modelItem ? (
          <View
            style={{
              padding: 16,
            }}>
            <View
              style={[
                styles.vwStl,
                {
                  backgroundColor: '#fff',
                  marginBottom: 0,
                  paddingHorizontal: 0,
                },
              ]}>
              <View
                style={[
                  styles.doneStl2,
                  {
                    borderColor: '#DADADA',
                  },
                ]}
              />
              {/* <TouchableOpacity
                onPress={() => {
                  this.setState({
                    done: !done,
                  });
                }}
                activeOpacity={0.8}>
                {done ? (
                  <View style={styles.doneStl}>{Done}</View>
                ) : (
                  <View
                    style={[
                      styles.doneStl2,
                      {
                        borderColor: '#DADADA',
                      },
                    ]}
                  />
                )}
              </TouchableOpacity> */}
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity
                  style={{ marginRight: 16 }}
                  onPress={() => this.share()}>
                  <View>{ShareNote}</View>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => this.onSavePress()}>
                  <Text
                    style={{ fontSize: 17, fontWeight: '600', color: '#3F49DC' }}>
                    {strings.save}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {
              modelItem?.group ?
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate('DetailChat', { item: modelItem?.group, userId: 10 })
                  }}
                  style={{ marginTop: 8, flexDirection: 'row', alignItems: 'center' }}>
                  {users}
                  <Text style={{ marginLeft: 4, fontSize: 16, fontWeight: '500' }}>{modelItem?.group?.label}</Text>
                </TouchableOpacity>
                :
                null
            }
            <View
              style={{
                paddingVertical: 16,
                borderBottomWidth: 1,
                borderBottomColor: '#C7C7CC',
              }}>
              <TextInput
                editable={!done}
                placeholderTextColor={'#D1D1D6'}
                style={{
                  color: '#000',
                  fontSize: 17,
                  fontWeight: '600',
                  textDecorationLine: done ? 'line-through' : 'none',
                  color: done ? '#8E8E93' : '#000',
                }}
                value={label}
                onChangeText={label => this.setState({ label })}
              />
            </View>

            <View style={styles.weekVwStl}>
              {weeks.map((item, index) => (
                <TouchableOpacity
                  onPress={() => {
                    let arr = this.state.week_day_ids;

                    if (!arr.includes(item.id)) {
                      arr.push(item.id);
                    } else {
                      arr.splice(arr.indexOf(item.id), 1);
                    }

                    weeks[index].acitve = !item.acitve;

                    this.setState({
                      week_day_ids: arr,
                      isChange: true,
                    });
                  }}
                  activeOpacity={0.7}
                  key={index}
                  style={[
                    {
                      shadowColor: item.acitve ? '#3F49DC' : '#000',
                      backgroundColor: item.acitve ? '#3F49DC' : '#fff',
                    },
                    styles.weekItemStl,
                  ]}>
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: '600',
                      color: item.acitve ? '#fff' : '#3F49DC',
                    }}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {/* <View style={styles.mdlVwStl2}> */}
            {/* <Text style={{ fontSize: 17 }}>{strings.vremya}</Text>
              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    open: true,
                  });
                }}>
                <Text style={{ fontSize: 17, color: '#3F49DC' }}>
                  {' '}
                  {GetTime(datetime, 'DD MMM. YYYY, HH:mm')}
                </Text>
              </TouchableOpacity> */}
            {/* </View> */}

            {/* <DatePicker
              modal
              open={open}
              mode="datetime"
              date={new Date(datetime)}
              is24hourSource="locale"
              title={null}
              confirmText={strings.save}
              locale={getLang()}
              onConfirm={date => {
                this.setState({
                  datetime: date,
                  open: false,
                });
              }}
              onCancel={() => {
                this.setState({
                  open: false,
                });
              }}
              androidVariant="nativeAndroid"
            /> */}
            <View
              style={[
                styles.mdlVwStl2,
                { borderBottomColor: '#fff', marginTop: 15 },
              ]}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {PurposeIcon}
                <Text style={{ color: 'black', fontSize: 17, marginLeft: 10 }}>
                  {strings.maks}
                </Text>
              </View>
              <Switch
                value={purpose}
                onValueChange={purpose => {
                  this.setState({
                    purpose: purpose,
                  });
                }}
              />
            </View>

            {!purpose ? null : (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  paddingVertical: 4,
                  backgroundColor: '#F2F2F7',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Text style={{ fontSize: 17, color: 'grey' }}>{strings.perday}</Text>
                </View>
                <TextInput
                  style={{ paddingVertical: 2, fontSize: 16, borderRadius: 10, width: 100, textAlign: 'center', backgroundColor: 'rgba(0,0,0,0.1)' }}
                  value={target + ''}
                  keyboardType="number-pad"
                  onChangeText={target =>
                    this.setState({
                      target,
                    })
                  }
                />
                <Text style={{ color: 'black', }}>
                  {getTemplateLabel(selected_template.template)}
                </Text>


              </View>
            )}
            {!purpose ? null : (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: 30,
                }}>

                <Text style={{ color: 'black', fontSize: 14, marginRight: 10 }}>{strings.bugjet2}</Text>
                <TouchableOpacity
                  disabled={target_today == 0}
                  activeOpacity={0.7}
                  onPress={() =>
                    this.setState({
                      target_today: parseInt(target_today) - 1,
                    })
                  }
                  style={styles.btnStl2}>
                  {Minuse}
                </TouchableOpacity>
                <View style={{ flex: 1, alignItems: 'center' }}>
                  <TextInput
                    style={{ textAlign: 'center', width: '100%', fontSize: 28, fontWeight: '700', backgroundColor: '#F2F2F7' }}
                    value={target_today + ''}
                    keyboardType="number-pad"
                    onChangeText={target_today =>
                      this.setState({
                        target_today: target_today
                      })
                    }
                  />
                  {/* <Text style={{ fontSize: 28, fontWeight: '700' }}>
                    {target_today}
                  </Text> */}
                </View>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() =>
                    this.setState({
                      target_today: parseInt(target_today) + 1,
                    })
                  }
                  style={styles.btnStl2}>
                  {Plusee}
                </TouchableOpacity>
              </View>
            )}
          </View>
        ) : null
        }
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  vwStl: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: '#E0E2FF',
    borderRadius: 6,
    marginBottom: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  btnStl: {
    width: 56,
    aspectRatio: 1,
    borderRadius: 28,
    backgroundColor: '#9B8274',
    position: 'absolute',
    right: 16,
    bottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },

  toolbarStl: {
    borderRadius: 6,
    backgroundColor: '#fff',
    marginHorizontal: 3,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 2.84,
    elevation: 5,
    marginBottom: 200,
    marginTop: 10,
  },

  mdlVwStl2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
    paddingVertical: 13,
    borderBottomWidth: 0.5,
    borderBottomColor: '#C7C7CC',
  },
  vwStl2: {
    padding: 12,
    backgroundColor: '#F2F2F7',
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 8,
  },
  btnStl2: {
    width: 40,
    aspectRatio: 1,
    borderRadius: 20,
    backgroundColor: colorApp.blueDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  weekItemStl: {
    width: 34,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.19,
    shadowRadius: 1.65,

    elevation: 7,
  },
  weekVwStl: {
    paddingVertical: 14,
    backgroundColor: '#F2F2F7',
    marginTop: 10,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
});
