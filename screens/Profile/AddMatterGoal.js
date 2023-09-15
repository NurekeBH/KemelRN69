/* eslint-disable react-native/no-inline-styles */
import axios from 'axios';
import React, { Component, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  FlatList,
  Alert,
  Dimensions,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import {
  ButtonClass,
  getLang,
  HeaderStyle,
  showToast,
  width,
} from '../../Component/Component';
import { LeftIcon, Left_icon } from '../../Component/MyIcons';
import { strings } from '../../Localization/Localization';
import Modal from 'react-native-modalbox';
import moment from 'moment';



export default function AddMatterGoal({ route, navigation }) {
  const [label, setLabel] = useState('');
  const [desc, setDesc] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const [datetime, setdatetime] = useState(new Date());
  const [open, setOpen] = useState(false);

  const [datetime2, setdatetime2] = useState(new Date());
  const [open2, setOpen2] = useState(false);


  const [category_id, setCategory] = useState(route.params?.category_id);
  const [section_id, setSectionId] = useState(route.params?.section_id);

  const [isMatter, setIsMatter] = useState(route.params?.isMatter)

  const onSaveClick = () => {
    if (label) {
      axios
        .post('goals/goal/create/', {
          label: label,
          category: category_id,
          section: section_id,
          done: false,
          date_from: isMatter ? moment(new Date()).format('DD MMMM YYYY') : fromDate,
          date_to: isMatter ? moment(new Date()).format('DD MMMM YYYY') : toDate,
          desc: desc
        })
        .then(response => {
          console.log('RESPONSE add:', response);
          route.params.updateData();
          navigation.goBack();
        })
        .catch(error => {
          console.log('RESPONSE error:', error);
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
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}>
            {Left_icon}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => onSaveClick()}>
            <Text style={{ fontSize: 17, fontWeight: '600', color: '#3F49DC' }}>
              {strings.save}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1, paddingHorizontal: 6, backgroundColor: '#fff' }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={{ flex: 1 }}>
              <TextInput
                // placeholder={strings.tem}
                style={{
                  fontSize: 24,
                  fontWeight: '700',
                  marginHorizontal: 10,
                }}
                placeholderTextColor="#D1D1D6"
                autoFocus
                onChangeText={label => {
                  setLabel(label);
                }}
                value={label}
                returnKeyType="next"
                placeholder={strings.matter}
              />
              <View
                style={{
                  height: 0.5,
                  backgroundColor: 'rgba(0, 0, 0, 0.2)',
                  marginVertical: 10,
                  marginHorizontal: 10,
                }}
              />

              {
                isMatter ?
                  null :
                  <View style={{ paddig: 16 }}>
                    <Text style={{ color: 'rgba(0,0,0,0.6)', marginBottom: 4, marginLeft: 4 }}>{strings.goalDate}</Text>

                    <View style={{ marginVertical: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                      <TouchableOpacity
                        onPress={() => {
                          setOpen(true)
                        }}
                        style={{ backgroundColor: '#F2F2F7', borderRadius: 8, width: Dimensions.get('window').width / 2 - 20, paddingVertical: 8 }} >
                        {/* <TextInput
                      style={{ fontSize: 16, color: 'black', textAlign: 'center', width: Dimensions.get('window').width / 2 - 20, paddingVertical: 8 }}
                      numberOfLines={1}
                      onChangeText={fromDate => {
                        setFromDate(fromDate);
                      }}
                      value={fromDate}
                    /> */}
                        <Text style={{ fontSize: 16, color: 'black', textAlign: 'center', }}>
                          {fromDate}
                        </Text>
                      </TouchableOpacity>
                      <Text style={{ color: 'black', margin: 8 }}>-</Text>
                      <TouchableOpacity
                        onPress={() => {
                          setOpen2(true)
                        }}
                        style={{ backgroundColor: '#F2F2F7', borderRadius: 8, width: Dimensions.get('window').width / 2 - 20, paddingVertical: 8 }}

                      >

                        <Text style={{ fontSize: 16, color: 'black', textAlign: 'center', }}>
                          {toDate}
                        </Text>

                      </TouchableOpacity>
                    </View>
                  </View>
              }

              <View
                style={{
                  height: 0.5,
                  backgroundColor: isMatter ? null : 'rgba(0, 0, 0, 0.2)',
                  marginVertical: 10,
                  marginHorizontal: 10,
                }}
              />



              {/* <TextInput
                // placeholder={strings.tem}
                style={{
                  fontSize: 16,
                  fontWeight: '400',
                  marginHorizontal: 10,
                }}
                placeholderTextColor="#D1D1D6"
                multiline
                placeholder={strings.goalDesc}
                onChangeText={desc => {
                  setDesc(desc);
                }}
                value={desc}
                returnKeyType="next"
              /> */}


            </KeyboardAvoidingView>
          </ScrollView>

          <Modal
            position="bottom"
            backButtonClose
            isOpen={open}
            onClosed={() => {
              setOpen(false);
            }}
            style={{
              backgroundColor: '#F2F2F7',
              height: 'auto',
            }}
          >
            <View style={{ alignItems: 'center', justifyContent: 'flex-end', marginBottom: 40 }}>
              <DatePicker
                locale={getLang()}
                mode="date"
                textColor={"black"}
                theme={"light"}
                is24hourSource="locale"
                date={datetime}
                onDateChange={date => {
                  setdatetime(date);
                  setFromDate(moment(date).format('DD MMMM YYYY'))
                }}
              />
              <TouchableOpacity
                onPress={() => {
                  setFromDate(moment(datetime).format('DD MMMM YYYY'))
                  setOpen(false);
                }}
              >
                <Text style={{ color: '#3F49DC', fontSize: 16, textAlign: 'center', fontWeight: '600' }}>OK</Text>
              </TouchableOpacity>
            </View>

          </Modal>


          <Modal
            position="bottom"
            backButtonClose
            isOpen={open2}
            onClosed={() => {
              setOpen2(false);
            }}
            style={{
              backgroundColor: '#F2F2F7',
              height: 'auto',
            }}
          >
            <View style={{ alignItems: 'center', justifyContent: 'flex-end', marginBottom: 40 }}>
              <DatePicker
                locale={getLang()}
                mode="date"
                textColor={"black"}
                theme={"light"}
                is24hourSource="locale"
                date={datetime2}
                onDateChange={date => {
                  setdatetime2(date);
                  setToDate(moment(date).format('DD MMMM YYYY'))
                }}
              />
              <TouchableOpacity
                onPress={() => {
                  setToDate(moment(datetime2).format('DD MMMM YYYY'))
                  setOpen2(false);
                }}
              >
                <Text style={{ color: '#3F49DC', fontSize: 16, textAlign: 'center', fontWeight: '600' }}>OK</Text>
              </TouchableOpacity>
            </View>

          </Modal>

        </View>
      </SafeAreaView >
    </View >
  );
}

const styles = StyleSheet.create({
  toolbarStl: {
    borderRadius: 6,
    backgroundColor: '#fff',
    marginHorizontal: 10,
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
});
