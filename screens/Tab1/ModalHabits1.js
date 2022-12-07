import React, { Component, useEffect, useRef, useState } from 'react';
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
} from '../../Component/MyIcons';
import DatePicker from 'react-native-date-picker';
import { strings } from '../../Localization/Localization';
import Modal from 'react-native-modalbox';

import axios from 'axios';
import { colorApp } from '../../theme/Colors';
import { Dropdown } from 'react-native-element-dropdown';


let weekArr =
  getLang() == 'kk'
    ? [
      { id: 1, week: 'Дс', acitve: false },
      { id: 2, week: 'Cс', acitve: false },
      { id: 3, week: 'Cс', acitve: false },
      { id: 4, week: 'Бс', acitve: false },
      { id: 5, week: 'Жм', acitve: false },
      { id: 6, week: 'Cб', acitve: false },
      { id: 7, week: 'Жс', acitve: false },
    ]
    : getLang() == 'en'
      ? [
        { id: 1, week: 'Mon', acitve: false },
        { id: 2, week: 'Tue', acitve: false },
        { id: 3, week: 'Wed', acitve: false },
        { id: 4, week: 'Thu', acitve: false },
        { id: 5, week: 'Fri', acitve: false },
        { id: 6, week: 'Sat', acitve: false },
        { id: 7, week: 'Sun', acitve: false },
      ]
      : [
        { id: 1, week: 'Пн', acitve: false },
        { id: 2, week: 'Вт', acitve: false },
        { id: 3, week: 'Cр', acitve: false },
        { id: 4, week: 'Чт', acitve: false },
        { id: 5, week: 'Пт', acitve: false },
        { id: 6, week: 'Cб', acitve: false },
        { id: 7, week: 'Вс', acitve: false },
      ];

export default function ModalHabits({ isOpen, modelItemData, RefreshModal }) {
  const [modelItem, setmodelItem] = useState(modelItemData);
  const [open, setopen] = useState(false);
  const [done, setdone] = useState(modelItemData.done);
  const [label, setLabel] = useState(modelItemData.label);
  const [datetime, setdatetime] = useState(modelItemData.updated_at);
  const [is_purpose, setPurpose] = useState(modelItemData.is_purpose);
  const [ind, setInd] = useState(0);
  const [isSave, setisSave] = useState(false);

  const [weeksss, setWeeks] = useState([]);
  const richText = useRef();
  const purposeMdl = useRef();

  const [targetArr, setTrgetArr] = useState([]);
  const [selected_template, setSelectedTar] = useState(modelItemData?.target_template?.id)



  useEffect(() => {
    let week_days = modelItemData.week_days;
    let WEEK = weekArr;
    console.log('week_days', week_days);
    let k = 0;
    for (let j = 0; j < WEEK.length; j++) {
      WEEK[j].acitve = false;
      for (let i = 0; i < week_days.length; i++) {
        if (week_days[i].id === WEEK[j].id) {
          WEEK[j].acitve = true;
        }
      }
    }
    setWeeks(WEEK);

    axios.get('todos/target-templates/')
      .then((response) => {
        console.log('templates response', response)
        setTrgetArr(response.data)
        this.setState({
          targetArr: response.data,
          isLoadingTarget: false,
          selected_template: response.data[0].id
        })
      })
      .catch((error) => {

      })

  }, []);

  const onSavePress = () => {
    modelItem.done = done;
    modelItem.datetime = datetime;
    modelItem.is_purpose = is_purpose;
    setmodelItem(modelItem);
    setisSave(true);
    purposeMdl.current.close();
  };

  return (
    <Modal
      ref={purposeMdl}
      position="bottom"
      backButtonClose
      isOpen={isOpen}
      onClosed={() => {
        RefreshModal(modelItem, isSave);
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
          <TouchableOpacity
            onPress={() => {
              setdone(!done);
            }}
            activeOpacity={0.8}
            style={[
              styles.vwStl,
              {
                backgroundColor: '#fff',
                marginBottom: 0,
                paddingHorizontal: 0,
              },
            ]}>
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
            <Text
              style={{
                marginLeft: 14,
                fontSize: 17,
                fontWeight: '600',
                flex: 1,
                textDecorationLine: done ? 'line-through' : 'none',
                color: done ? '#8E8E93' : '#000',
              }}>
              {label}
            </Text>

            <TouchableOpacity onPress={() => onSavePress()}>
              <Text style={{ fontSize: 17, fontWeight: '600', color: '#3F49DC' }}>
                {strings.save}
              </Text>
            </TouchableOpacity>
          </TouchableOpacity>
          <View style={styles.weekVwStl}>
            {weeksss.map((item, index) => (
              <TouchableOpacity
                onPress={() => {
                  weeksss[index].acitve = !item.acitve;
                  setWeeks(weeksss);
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
                  {item.week}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.mdlVwStl2}>
            <Text style={{ color: 'black', fontSize: 17 }}>{strings.vremya}</Text>
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
              setdatetime(date);
              setopen(false);
            }}
            onCancel={() => {
              setopen(false);
            }}
            androidVariant="nativeAndroid"
          />
          <View
            style={[
              styles.mdlVwStl2,
              { borderBottomColor: '#fff', marginTop: 0 },
            ]}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {PurposeIcon}
              <Text style={{ color: 'black', fontSize: 17, marginLeft: 10 }}>{strings.maks}</Text>
            </View>
            <Switch
              value={is_purpose}
              onValueChange={purpose => {
                setPurpose(purpose);
              }}
            />
          </View>

          {!is_purpose ? null : (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderRadius: 8,
                paddingHorizontal: 12,
                backgroundColor: '#F2F2F7',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text style={{ fontSize: 17, color: 'grey' }}>күніне</Text>
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
              <Dropdown
                placeholderStyle={{ textAlign: 'right' }}
                selectedTextStyle={{ textAlign: 'right' }}
                style={{ width: 100, }}
                data={targetArr}
                maxHeight={300}
                labelField="template"
                valueField="value"
                placeholder={'Select item'}
                onChange={item => {
                  console.log('itemitem', item)
                  this.setState({
                    selected_template: item.id
                  })
                }}
              />

            </View>
          )}
          {!is_purpose ? null : (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 30,
              }}>
              <TouchableOpacity
                disabled={ind == 0}
                activeOpacity={0.7}
                onPress={() => setInd(ind - 1)}
                style={styles.btnStl2}>
                {Minuse}
              </TouchableOpacity>
              <View style={{ width: 140, alignItems: 'center' }}>
                <Text style={{ color: 'black', fontSize: 28, fontWeight: '700' }}>{ind}</Text>
                <Text style={{ color: 'black', fontSize: 13, opacity: 0.4 }}>рет</Text>
              </View>
              <TouchableOpacity
                disabled={ind == 1000}
                activeOpacity={0.7}
                onPress={() => setInd(ind + 1)}
                style={styles.btnStl2}>
                {Plusee}
              </TouchableOpacity>
            </View>
          )}
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
