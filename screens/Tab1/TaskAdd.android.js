import React, { Component, useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Platform,
  Switch,
  TextInput,
  Dimensions,
  StyleSheet,
} from 'react-native';
import {
  ButtonClass,
  HeaderStyle,
  showToast,
  width,
} from '../../Component/Component';
import { strings } from '../../Localization/Localization';
import DatePicker from 'react-native-date-picker';
import { Left_icon, RightRed } from '../../Component/MyIcons';
import Moment from 'moment';
import 'moment/locale/kk';
import 'moment/locale/ru';
import 'moment/locale/en-au';
import axios from 'axios';
import Modal from 'react-native-modalbox';
import { actions, RichEditor, RichToolbar } from '../../HtmlEditor';

const bordercolor = 'rgba(0, 0, 0, 0.2)';
const arrAction = [
  actions.setBold,
  actions.setItalic,
  actions.insertBulletsList,
  actions.insertOrderedList,
  actions.heading1,
];


export default function TaskAdd({ route, navigation }) {
  const [priority, setpriority] = useState(false);
  const [Arrreminder, setArrreminder] = useState(route.params.ReminderArr ? route.params.ReminderArr : []);
  const [theme, settheme] = useState('');
  const [address, setaddress] = useState('');
  const [zametka, setzametka] = useState();
  const [datetime, setdatetime] = useState(new Date(route.params.now));
  const [open, setOpen] = useState(false);
  const [isSend, setisSend] = useState(false);
  const [openModal, setopenModal] = useState(false);
  const [isSaveZametka, setIsSaveZametka] = useState(false);
  const [modalValue, setmodalValue] = useState({
    id: null,
    label: 'Нет',
  });
  const [toolbarKeyboard, settoolbarKeyboard] = useState(false);
  const richText = useRef();
  useEffect(() => {
    Moment.locale(getLang());

  }, []);




  const getLang = () => {
    if (strings.getLanguage() == 'kz') {
      return 'kk';
    } else {
      return strings.getLanguage();
    }
  };


  const onAddPress = () => {
    let Datetime = Moment(datetime).format('YYYY-MM-DD HH:mm:ss');

    if (theme && Datetime) {
      setisSend(true);
      axios
        .post('todos/task/', {
          label: theme,
          datetime: Datetime,
          priority: priority,
          address: address,
          desc: '',
          reminder: modalValue.id
        })
        .then(response => {
          console.log('RESPONSE add:', response.data);
          route.params.updateData();
          navigation.goBack();

        })
        .catch(error => {
          console.log('RESPONSE error:', error.response);
          if (error.response && error.response.status == 401) {
            showToast('error', error.response.data.detail);
          }
        });
    }
  };


  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBar backgroundColor={'#fff'} barStyle="dark-content" />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={HeaderStyle}>
          <TouchableOpacity
            style={{ width: 56 }}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}>
            {Left_icon}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onAddPress()}>
            <Text style={{ fontSize: 17, fontWeight: '600', color: '#3F49DC' }}>
              {strings.save}
            </Text>
          </TouchableOpacity>
        </View>
        <ScrollView style={{ paddingHorizontal: 16, minHeight: 400 }}>
          <View style={{ flex: 1 }}>
            <View
              style={{
                paddingVertical: 10,
                borderBottomWidth: 1,
                borderBottomColor: bordercolor,
              }}>
              <TextInput
                placeholderTextColor={'#D1D1D6'}
                style={{ fontSize: 20, fontWeight: '700', marginHorizontal: 10 }}
                placeholder={strings.dobz}
                value={theme}
                autoFocus={true}
                onChangeText={theme => settheme(theme)}
              />
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingVertical: 16,
              }}>
              <Text style={{ fontSize: 17 }}>{strings.vremya}</Text>
              <TouchableOpacity
                onPress={() => {
                  setOpen(true);
                }}>
                <Text style={{ fontSize: 17, color: '#3F49DC' }}>
                  {Moment(datetime).format('lll')}
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                alignItems: 'center',
                borderBottomColor: 'rgba(0, 0, 0, 0.2)',
                borderBottomWidth: 1,
              }}>
              <DatePicker
                modal
                locale={getLang()}
                is24hourSource="locale"
                confirmText={strings.save}
                cancelText={strings.close}
                title={null}
                open={open}
                date={datetime}

                onConfirm={date => {
                  setOpen(false);
                  setdatetime(date);
                }}
                onCancel={() => {
                  setOpen(false);
                }}
              />


            </View>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingVertical: 16,
                borderBottomWidth: 1,
                borderBottomColor: bordercolor,
              }}
              onPress={() => {
                setopenModal(true);
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text style={{ color: 'black', fontSize: 17, }}>{strings.reminder}</Text>
              </View>
              <Text style={{ fontSize: 17, color: '#3F49DC' }}>
                {modalValue.label}
              </Text>
            </TouchableOpacity>

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
                <Text style={{ color: 'black', fontSize: 17, marginLeft: 12 }}>Приоритет</Text>
              </View>
              <Switch
                value={priority}
                onValueChange={priority => setpriority(priority)}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingVertical: 9,
                borderTopWidth: 1,
                borderTopColor: '#D1D1D6',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text style={{ color: 'black', fontSize: 17, marginLeft: 0 }}>
                  {strings.addzamk}
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
                paddingVertical: 2,
                borderBottomWidth: 1,
                borderTopWidth: 1,
                borderBottomColor: bordercolor,
                borderTopColor: bordercolor,
              }}>
              <TextInput
                placeholderTextColor={'#D1D1D6'}
                style={{ color: '#000', fontSize: 17 }}
                placeholder={strings.address}
                value={address}
                onChangeText={address => setaddress(address)}
              />
            </View>
            {/* {!toolbarKeyboard ? null : (
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
            )}  */}

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

            <RichEditor
              style={{
                minHeight: 100,
                marginHorizontal: -5,
              }}
              ref={richText}
              androidHardwareAccelerationDisabled={true}
              placeholder={strings.zamk}
              initialContentHTML={zametka}
              onChange={zametka => {
                setzametka(zametka);
              }}
              onFocus={() => settoolbarKeyboard(true)}
              onBlur={() => settoolbarKeyboard(false)}
            />
          </View>
          <View
            style={{
              height: toolbarKeyboard ? 300 : 0,
            }}
          />
        </ScrollView>


        <Modal
          position="bottom"
          backButtonClose
          isOpen={openModal}
          onClosed={() => {
            setopenModal(false);
          }}
          style={{
            backgroundColor: '#F2F2F7',
            height: Dimensions.get('screen').height / 3 * 2,
            borderTopRightRadius: 12,
            borderTopLeftRadius: 12,
          }}>
          <View>
            <TouchableOpacity
              style={[styles.inpStl, { marginVertical: 16 }]}
              onPress={() => {
                setopenModal(false);
                setmodalValue({
                  id: null,
                  label: 'Нет',
                });
              }}>
              <Text styl={{ fontSize: 17, fontWeight: '500', color: '#000000' }}>
                Нет
              </Text>
            </TouchableOpacity>

            {Arrreminder.map((item1, index) => (
              <TouchableOpacity
                key={index}
                style={styles.inpStl}
                onPress={() => {
                  setopenModal(false);
                  setmodalValue(item1);
                }}>
                <Text
                  styl={{ fontSize: 17, fontWeight: '500', color: '#000000' }}>
                  {item1.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Modal>


      </SafeAreaView>
    </View>
  );
}
const styles = StyleSheet.create({
  inpStl: {
    marginLeft: 16,
    width: width - 32,
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    marginVertical: 1,
  },
  toolbarStl: {
    borderRadius: 6,
    backgroundColor: '#fff',
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
});
