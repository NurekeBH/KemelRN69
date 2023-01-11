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
import {
  ButtonClass,
  HeaderStyle,
  showToast,
  width,
} from '../../Component/Component';
import { LeftIcon, Left_icon } from '../../Component/MyIcons';
import { strings } from '../../Localization/Localization';

export default function AddGoal({ route, navigation }) {
  const [label, setLabel] = useState('');
  const [desc, setDesc] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');


  const [category_id, setCategory] = useState(route.params?.category_id);
  const [section_id, setSectionId] = useState(route.params?.section_id);

  const onSaveClick = () => {
    if (label) {
      axios
        .post('goals/goal/create/', {
          label: label,
          category: category_id,
          section: section_id,
          done: false,
          date_from: fromDate,
          date_to: toDate,
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
                placeholder={strings.goalTitle}
              />
              <View
                style={{
                  height: 0.5,
                  backgroundColor: 'rgba(0, 0, 0, 0.2)',
                  marginVertical: 10,
                  marginHorizontal: 10,
                }}
              />

              <View style={{ paddig: 16 }}>
                <Text style={{ color: 'rgba(0,0,0,0.6)', marginBottom: 4, marginLeft: 4 }}>{strings.goalDate}</Text>

                <View style={{ marginVertical: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                  <View
                    style={{ backgroundColor: '#F2F2F7', borderRadius: 8, }} >
                    <TextInput
                      style={{ fontSize: 16, color: 'black', textAlign: 'center', width: Dimensions.get('window').width / 2 - 20, paddingVertical: 8 }}
                      numberOfLines={1}
                      onChangeText={fromDate => {
                        setFromDate(fromDate);
                      }}
                      value={fromDate}
                    />
                  </View>
                  <Text style={{ color: 'black', margin: 8 }}>-</Text>
                  <View
                    style={{ backgroundColor: '#F2F2F7', borderRadius: 8, }}

                  >
                    <TextInput
                      style={{ fontSize: 16, color: 'black', textAlign: 'center', width: Dimensions.get('window').width / 2 - 20, paddingVertical: 8 }}
                      numberOfLines={1}
                      onChangeText={toDate => {
                        setToDate(toDate);
                      }}
                      value={toDate}
                    />
                  </View>
                </View>
              </View>
              <View
                style={{
                  height: 0.5,
                  backgroundColor: 'rgba(0, 0, 0, 0.2)',
                  marginVertical: 10,
                  marginHorizontal: 10,
                }}
              />



              <TextInput
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
              />
            </KeyboardAvoidingView>
          </ScrollView>
        </View>
      </SafeAreaView>
    </View>
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
