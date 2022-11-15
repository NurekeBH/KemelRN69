import React, { Component, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Switch,
  ScrollView,
  TextInput,
  Dimensions,
  Platform,
} from 'react-native';
import { ButtonClass, GetTime, showToast } from '../../Component/Component';
import { Done, RightRed, ShareNote } from '../../Component/MyIcons';
import DatePicker from 'react-native-date-picker';
import { actions, RichEditor, RichToolbar } from '../../HtmlEditor';
import { strings } from '../../Localization/Localization';
import Modal from 'react-native-modalbox';
import Share from 'react-native-share';

const arrAction = [
  actions.setBold,
  actions.setItalic,
  actions.insertBulletsList,
  actions.insertOrderedList,
  actions.heading1,
  actions.checkboxList,
];
import axios from 'axios';
import KeyboardSpacer from '../../Component/KeyboardSpacer';

export default function ModalTasks({ isOpen, folderData, modelItemData, RefreshModal }) {
  const [modelItem, setmodelItem] = useState(modelItemData);
  const [zametka, setzametka] = useState(modelItemData.desc);
  const [open, setopen] = useState(false);
  const [done, setdone] = useState(modelItemData.done);
  const [label, setLabel] = useState(modelItemData.label);
  const [datetime, setdatetime] = useState(modelItemData.datetime);
  const [priority, setpriority] = useState(modelItemData.priority);
  const [address, setaddress] = useState(modelItemData.address);
  const [isSave, setisSave] = useState(false);
  const [isSaveZametka, setIsSaveZametka] = useState(false);
  const [toolbarKeyboard, settoolbarKeyboard] = useState(false);
  const richText = useRef();
  const purposeMdl = useRef();

  console.log('modelItemData', modelItemData);

  const getLang = () => {
    if (strings.getLanguage() == 'kz') {
      return 'kk';
    } else {
      return strings.getLanguage();
    }
  };

  const onSavePress = () => {
    if (zametka && isSaveZametka) {
      axios
        .post('notes/note/', {
          label: label,
          desc: zametka,
          parent: null,
          folder: folderData[0].id,
        })
        .then(response => {
          console.log('RESPONSE add:', response.data);
          modelItem.done = done;
          modelItem.label = label;
          modelItem.datetime = datetime;
          modelItem.priority = priority;
          modelItem.address = address;
          modelItem.desc = zametka;
          setmodelItem(modelItem);
          setisSave(true);
          purposeMdl.current.close();
        })
        .catch(error => {
          console.log('RESPONSE error:', error.response);
          if (error.response && error.response.status == 401) {
            showToast('error', error.response.data.detail);
          }
        });
    } else {
      modelItem.label = label;
      modelItem.done = done;
      modelItem.datetime = datetime;
      modelItem.priority = priority;
      modelItem.address = address;
      modelItem.desc = zametka;
      setmodelItem(modelItem);
      setisSave(true);
      console.log('RESPONSE save modelItem:', modelItem);

      purposeMdl.current.close();
    }
  };

  const share = () => {
    let hmtl = label + '\n' + address;
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
  };

  return (
    <Modal
      ref={purposeMdl}
      position="bottom"
      backButtonClose
      swipeArea={100}
      isOpen={isOpen}
      onClosed={() => {
        RefreshModal(modelItem, isSave, isSaveZametka, zametka);
      }}
      style={{
        height: Dimensions.get('screen').height - 200,
        borderTopRightRadius: 12,
        borderTopLeftRadius: 12,
      }}>
      {modelItem ? (
        <View
          style={{
            flex: 1,
            padding: 16,
            height: Dimensions.get('screen').height - 200,
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
            <TouchableOpacity
              onPress={() => {
                setdone(!done);
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
            </TouchableOpacity>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity style={{ marginRight: 16 }} onPress={share}>
                <View>{ShareNote}</View>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => onSavePress()}>
                <Text
                  style={{ fontSize: 17, fontWeight: '600', color: '#3F49DC' }}>
                  {strings.save}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View>
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
                  placeholder={strings.address}
                  value={label}
                  onChangeText={label => setLabel(label)}
                />
              </View>

              <View style={styles.mdlVwStl2}>
                <Text style={{ fontSize: 17 }}>{strings.vremya}</Text>
                <TouchableOpacity
                  onPress={() => {
                    setopen(!open);
                  }}>
                  <Text style={{ fontSize: 17, color: '#3F49DC' }}>
                    {' '}
                    {GetTime(datetime, 'DD MMM. YYYY, HH:mm')}
                  </Text>
                </TouchableOpacity>
              </View>

              <DatePicker
                modal
                open={open}
                mode="datetime"
                date={new Date(datetime)}
                is24hourSource="locale"
                title={null}
                confirmText={strings.save}
                locale={getLang()}
                onConfirm={date => {
                  console.log('datedate', date);
                  setdatetime(date);
                  setopen(false);
                }}
                onCancel={() => {
                  setopen(false);
                }}
                androidVariant="nativeAndroid"
              />
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingVertical: 9,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  {RightRed}
                  <Text style={{ fontSize: 17, marginLeft: 12 }}>Приоритет</Text>
                </View>
                <Switch
                  value={priority}
                  onValueChange={priority => {
                    setpriority(priority);
                  }}
                />
              </View>
              <View
                style={{
                  borderBottomWidth: 0.5,
                  borderBottomColor: '#C7C7CC',
                  width: '100%',
                }}
              />
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingVertical: 9,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Text style={{ fontSize: 17, marginLeft: 0 }}>
                    Заметкаға қосу
                  </Text>
                </View>
                <Switch
                  value={isSaveZametka}
                  onValueChange={isSaveZametka => {
                    setIsSaveZametka(isSaveZametka);
                  }}
                />
              </View>

              <View
                style={{
                  paddingVertical: 16,
                  borderBottomWidth: 1,
                  borderTopWidth: 1,
                  borderBottomColor: '#C7C7CC',
                  borderTopColor: '#C7C7CC',
                }}>
                <TextInput
                  placeholderTextColor={'#D1D1D6'}
                  style={{ color: '#000', fontSize: 17 }}
                  placeholder={strings.address}
                  value={address}
                  onChangeText={address => setaddress(address)}
                />
              </View>
              {!toolbarKeyboard ? null : (
                <RichToolbar
                  editor={richText}
                  value={zametka}
                  actions={arrAction}
                  selectedButtonStyle={{
                    backgroundColor: '#EFEBE9',
                    marginHorizontal: 1,
                    borderRadius: 4,
                  }}
                  unselectedButtonStyle={{
                    marginHorizontal: 1,
                  }}
                  style={styles.toolbarStl}
                  iconMap={{
                    [actions.heading1]: ({ tintColor }) => (
                      <Text style={[{ color: tintColor }]}>H1</Text>
                    ),
                    [actions.heading2]: ({ tintColor }) => (
                      <Text style={[{ color: tintColor }]}>H2</Text>
                    ),
                    [actions.heading3]: ({ tintColor }) => (
                      <Text style={[{ color: tintColor }]}>H3</Text>
                    ),
                  }}
                />
              )}

              <RichEditor
                style={{ minHeight: 100, marginHorizontal: -5 }}
                ref={richText}
                placeholder={strings.zamk}
                initialContentHTML={zametka}
                onChange={zametka => {
                  setzametka(zametka);
                }}
                onFocus={() => settoolbarKeyboard(true)}
                onBlur={() => settoolbarKeyboard(false)}
              />

              {Platform.OS == 'ios' ? <KeyboardSpacer /> : null}


            </View>
          </ScrollView>
        </View>
      ) : null}
    </Modal>
  );
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
    marginVertical: 10,
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
});
