import React, { Component } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Toast from 'react-native-toast-message';

import Moment from 'moment';
import 'moment/locale/kk';
import 'moment/locale/ru';
import 'moment/locale/en-au';
import { strings } from '../Localization/Localization';
import { no_avatar } from './MyIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const { width, height } = Dimensions.get('window');


export const DomainUrl = 'https://app.kemeladam.kz';

export const getLang = () => {
  Moment.locale(strings.getLanguage() == 'kz' ? 'kk' : strings.getLanguage());
  return strings.getLanguage() == 'kz' ? 'kk' : strings.getLanguage()

};


export const GetTime = (date, format) => {
  Moment.locale(strings.getLanguage() == 'kz' ? 'kk' : strings.getLanguage());
  return Moment(date).format(format);
}

export const GetDuration = sec => {
  var hours = Math.floor(sec / 3600);
  var minutes =
    Math.floor(sec / 60) < 10
      ? '0' + Math.floor(sec / 60)
      : Math.floor(sec / 60);
  var seconds =
    sec - minutes * 60 < 10 ? '0' + (sec - minutes * 60) : sec - minutes * 60;

  return minutes + ':' + seconds;
};

export const addDomain = source => {
  return source.startsWith('http://') ? source : 'http://' + source;
};

export const ButtonClass = ({
  style,
  onPress,
  title,
  titleStyle,
  disabled,
  loader,
}) => (
  <TouchableOpacity
    onPress={onPress}
    disabled={loader || disabled}
    activeOpacity={0.5}
    style={[
      {
        width: width - 30,
        marginTop: 15,
        borderRadius: 10,
        alignItems: 'center',
        height: 50,
        justifyContent: 'center',
        backgroundColor: '#3D3D3D',
      },
      style,
    ]}>
    {loader ? (
      <ActivityIndicator color={'#fff'} />
    ) : (
      <Text
        style={[{ color: '#fff', fontSize: 17, fontWeight: '600' }, titleStyle]}>
        {title}
      </Text>
    )}
  </TouchableOpacity>
);

export const HeaderStyle = {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  height: Platform.select({ ios: 44, android: 56 }),
  backgroundColor: 'white',
  paddingHorizontal: 16,
};

export const arrMonths = [
  'Қаң.',
  'Ақп.',
  'Нау.',
  'Сәу.',
  'Мам.',
  'Мау.',
  'Шіл.',
  'Там.',
  'Қыр.',
  'Қаз.',
  'Қар.',
  'Жел.',
];

export const showToast = (type, text) => {
  Toast.show({
    type: type,
    text1: text,
    position: 'bottom',
    visibilityTime: 2500,
  });
};

export const Header2 = ({
  rightOnPress,
  rightIcon,
  navigation,
  title,
  borderBottomBoll,
}) => (
  <View
    style={[
      HeaderStyle,
      {
        justifyContent: 'space-between',
        borderBottomWidth: borderBottomBoll ? 1 : 0,
        borderBottomColor: 'rgba(0, 0, 0, 0.1)',
      },
    ]}>
    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
      <TouchableOpacity
        onPress={() => navigation.navigate('ProfileStack', { screen: 'Profile' })}
        activeOpacity={0.7}>
        {/* <FastImage
          source={{
            uri: 'https://media.istockphoto.com/photos/millennial-male-team-leader-organize-virtual-workshop-with-employees-picture-id1300972574?b=1&k=20&m=1300972574&s=170667a&w=0&h=2nBGC7tr0kWIU8zRQ3dMg-C5JLo9H2sNUuDjQ5mlYfo=',
          }}
          style={{ width: 28, aspectRatio: 1, borderRadius: 14 }}
        /> */}
        <View
          style={{
            width: 28,
            aspectRatio: 1,
            borderRadius: 14,
            borderColor: '#999999',
            borderWidth: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          {no_avatar(24)}
        </View>
      </TouchableOpacity>
      <Text style={{ color: 'black', fontSize: 24, fontWeight: '700', marginLeft: 15 }}>
        {title}
      </Text>
    </View>
    <TouchableOpacity activeOpacity={0.7} onPress={rightOnPress}>
      {rightIcon}
    </TouchableOpacity>
  </View>
);



export const getTemplateLabel = (label) => {
  switch (label) {
    case 'бет': return getLang() == 'kk' ? label : 'страница';
    case 'литр': return getLang() == 'kk' ? label : 'литр';
    case 'қадам': return getLang() == 'kk' ? label : 'шаг';
    case 'минут': return getLang() == 'kk' ? label : 'минут';
    case 'рет': return getLang() == 'kk' ? label : 'раз';
    default: return label;
  }
}


export const storeObject = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    console.log(e);
  }
};

export const getObject = async key => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.log('error reading object value');
  }
};


export const getTemplateReminder = (label) => {
  switch (label) {
    case 'В момент события': return getLang() == 'kk' ? 'Тапсырма кезінде' : getLang() == 'en' ? "At time of event" : label;
    case 'За 30 минут': return getLang() == 'kk' ? '30 минут бұрын' : getLang() == 'en' ? "30 minutes before" : label;
    case 'За 1 час': return getLang() == 'kk' ? '1 сағат бұрын' : getLang() == 'en' ? "1 hour before" : label;
    case 'За 2 часа': return getLang() == 'kk' ? '2 сағат бұрын' : getLang() == 'en' ? "2 houres before" : label;
    case 'За 3 часа': return getLang() == 'kk' ? '3 сағат бұрын' : getLang() == 'en' ? "3 houres before" : label;
    case 'За 1 день': return getLang() == 'kk' ? '1 күн бұрын' : getLang() == 'en' ? "1 day before" : label;
    case 'за 3 дня': return getLang() == 'kk' ? '3 күн бұрын' : getLang() == 'en' ? "3 days before" : label;
    case '1 неделя': return getLang() == 'kk' ? '1 апта бұрын' : getLang() == 'en' ? "1 week before" : label;

    default: return label;
  }
}



export const getLabelGoal = (label) => {
  switch (label) {
    case 'Руханият': return getLang() == 'ru' ? 'Духовный интеллект' : getLang() == 'en' ? "Spirituality" : label;
    case 'Интелектуалдық даму': return getLang() == 'ru' ? 'Интеллектуальной развитие' : getLang() == 'en' ? "Intellectual development" : label
    case 'Отбасы': return getLang() == 'ru' ? 'Семья' : getLang() == 'en' ? "Family" : label
    case 'Қаржы тәуелсіздігі': return getLang() == 'ru' ? 'Финансовый независимость' : getLang() == 'en' ? "Financial independence" : label
    case 'Денсаулық': return getLang() == 'ru' ? 'Здоровья' : getLang() == 'en' ? "Health" : label
    case 'Қарым-қатынас': return getLang() == 'ru' ? 'Отношение' : getLang() == 'en' ? "Attitude" : label
    case 'Қоғамдық жұмыс': return getLang() == 'ru' ? 'Общественные дела' : getLang() == 'en' ? "Public affairs" : label
    case 'Хобби / Демалыс': return getLang() == 'ru' ? 'Хобби / Отдых' : getLang() == 'en' ? "Hobby / Leisure" : label
    case '3 ай': return '3 месяц';
    case '6 ай': return '6 месяц';
    case '1 жыл': return '1 год';
    case '3 жыл': return '3 года';
    case '5 жыл': return '5 года';

    default: return '';
  }
}