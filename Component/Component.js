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


export const dualist = [{
  title: 'Мінажат',
  desc: `“Ең көркем есімдер Аллаға тән. Ендеше, Оған сол есімдерімен үн қатып, дұға етіңдер”
  “Ағраф” сүресі, 180-аят. 
  • Уа, күллі тіршілік атаулының жалғыз  Жаратушысы, барлық көркем есімдер мен кемел сипаттардың шынайы иесі, кемшіліктен пәк ұлы Аллам;
  • Уа, бар жаратылысты мүлтіксіз жүйемен ұстап тұрған теңдессіз құдірет иесі Қаиюум Аллам;
  • Уа, шет-шегі жоқ ғаламзатты шексіз мейірімімен тербеткен аса рақымды Рахман Аллам;
  • Уа, жер мен көкті, бүкіл болмысты нұрға бөлеген Мунир Аллам;
  • Уа, теңі мен теңдесі жоқ, сипаты мен істерінде еш серігі жоқ, жалғыз – Әхад Аллам;
   • Уа, барлық жаратылыс Оған зәру, бірақ Өзі ешкімге мұқтаж емес Самад Аллам;
  • Уа, Күрсі мен Арштың, Қалам мен Ләухтың,  Қағба мен Құранның  иесі  ұлы Аллам;
  • Уа, жердің асты-үстіндегі тұтыс тіршілікті һәм аспандағы ұшқан құсты, су түбіндегі барша жаратылысты түрлі нығметімен рызықтандырушы Раззақ Аллам;
  • Уа, білімі күллі ғаламдағы жария-жасырын, үлкен-кіші көмескінің бәрін толық  қамтыған шексіз ілім иесі Алим Аллам;
  • Уа, бар болмысты көркем жаратып, әрбір жаратылысты әсем безендіруші Жәмил Аллам;
  • Уа, күнәһар пенделерін дереу жазаламай, оларға тәубе етуі үшін мұрсат беруші, сабырлы да, аса биязы Хәлим Аллам;
  • Уа, барлық істі аса даналықпен, терең хикметпен жасаушы  Хәким Аллам;
  • Уа, ізгі құлдарына молынан сый-сияпат беруші аса жомарт  – Кәрим Аллам;
  • Уа, барлық құлдарына, тіпті өзінен сырт айналып, адасқандарға да мейірбандық танытушы Хәннән Аллам;
  • Уа, барша ғаламға сансыз жақсылығы мен есепсіз игілігін тарту етуші Мәннән Аллам;
  • Уа, жасаған амалдарымыздың ешбірін  ескерусіз қалдырмай, сауабы мен қарымын толық беруші Дәййәән Аллам;
  • Уа, құлдарының күнәлары мен кемшілігін жасырып, оларды масқаралықтан сақтаушы Саттар Аллам;
  • Уа, барша ақиқаттың дәлелі Бұрһан Аллам;
  • Уа, шексіз салтанат пен шынайы биліктің  асқақ иесі, билеушілердің билеушісі, патшалардың патшасы Сұлтан Аллам;
  • Уа, барша дүние-мүліктің жалғыз қожайыны Мәлик Аллам;
  • Уа, кемшіліктен пәк, нұқсандық атаулыдан ада, еш мінсіз Субхан Аллам; 
  Уа, бар болуы мен жалғыз екендігі айқын-аян Заһир Аллам;
  •Уа, кемел сипаттарының сыры мен істерінің ақиқи хикметіне ақыл  жетпейтін Бәтин Аллам;
  • Уа, бүкіл тіршілік атаулы жәрдем тілеп, көмек сұрайтын жалғыз жәрдемші, аса қамқор Мүстағән Аллам;
  • Уа, бүкіл жаманшылықтан сақтап, түрлі пәлекет пен қауіп-қатерден қорғаушы Хафиз Аллам;
  • Уа, жан сырымыз бен көмескі құпиямызды білуші −  Хабир Аллам;
  • Уа, бүкіл жария-жасырын дұғаларымызды бір сәт шатастырмай анық естуші, тілегімізді беруші құдіретті Аллам;
  • Уа, тыңнан мүмкіндік сыйлаушы, жабық есіктерді айқара ашушы Фаттах Аллам;
  • Уа, барша науқастың жан-тәніне дауа дарытушы, шипасын беруші Шафи Аллам,
  • Уа, адасқандарды тура жолға салушы, шатасқандарды ақиқатқа жетелеуші Һәәди Аллам;
  • Уа, тарыққандарға пана, қиналғандарға қорған болушы Уәкил Аллам;
  • Уа, астамдық жасағандарға тосқауыл қоюшы, шектен шыққан залымдарға жазасын беріп, қаһарын көрсетуші Қаһһар да, Жаббар  Аллам;
  • Уа, күллі тіршілікті пәнилікке бас идірткен мәңгіліктің шын иесі Бақи Аллам;
  • Уа, бар жаратылысқа тіршілік сыйлап, өмір беретін һәм өлілерді қайта тірілтуші Мұхий Аллам;
  • Уа, қалаған пендесінің дәрежесін биіктетіп, қалағанының абыройын түсіруші құдіретті Аллам;
  • Уа, мына дүниеде жасаған әр ісіміздің есебін алып, қарымын беруші Хасиб Аллам;
  • Уа, барлық нәрсені толық көруші Басир Аллам;
  • Уа, бүкіл жаратылысты дамылсыз һәм мінсіз бақылаушы Рақиб Аллам;
  • Уа, біліп-білмей, жария-жасырын жасаған бар күнәмізді кешіре білуші Ғаффар Аллам;
  • Уа, жалғыз қалғанда тастап кетпейтін  сенімді Сүйенішім, жырақта жұбаныш табар Сырласым, қамыққанда медет берер Демеушім, мұқтаж сәтте көмек берер Жардемшім, қысылғанда бас сауғалайтын жалғыз Панам, бойдағы үрей-қорқынышымды сейілтер Қорғанышым, абыржып, сасқан сәтте жол көрсетер Жолбасшым!
  Уа, Мейірбан Аллам, осынау көркем есімдеріңді дәнекер етіп, ұлы сипаттарыңның ақы-құрметі үшін, бір Өзіңе сыйына отырып, жалғыз Өзіңнен жалбарына сұраймын:
  
  Бізді тура жолға сала гөр. Адасып, шатасудан сақта. Көкірiегімізді иманға, ізгілікке, нұрға, қанағат, мейірімге толтыр!
  Жаратылысымызды әдемі еткеніңдей, мінезімізді де көркем ет.
  Жүрегімізді күнәнің дағынан тазартып, тәкаппарлық, қызғаныш, өкпе-реніш, кектен, көзбояшылықтан, дүниеқоңыздықтан сақтай гөр!  
  Рахман ием, біздің жасаған күнәміз қанша көп болса да, Сенің кешірімің мен мейірімің одан да зор. Бар жасаған қателерімдізді  кешіре гөр!
  Уа, Раббым, бізді нәпсімізбен бір мезет жеке қалдыра көрме. Әрдайым өзің қолдап, қорға! Өзің жақсы көретін, риза болатын істерде бізді жетістікке жеткіз.
  Мейірбан Аллам, бізді тәрбиелеп өсірген ата-анамыздан риза болып, оларды рақымыңа бөле!
  Ұрпағымыздың санасына сәуле ұялатып, жүрегіне ынсап пен мейіріміңді төге гөр! Ізгі құлдарыңның қатарына қосып, Мұхаммед пайғамбарға (с.а.у.) лайықты үмбет еткейсің.
  Уа, мәңгі түгесілмейтін қазына иесі дархан Аллам, рызық-несібемізді адал һәм берекесімен бергейсің. Өзіңнен басқа ешкімге мұқтаж ете көрме!
  Шафи Аллам, дертімізге дауа дарытып, науқастарға шипаңды бере гөр! 
  Құдай тағалам, бізді ақырзаманның бүлігінен, қабірдің азабынан, тозақтың отынан сақта!
  Елімізді ішкі даудан, сыртқы жаудан сақта, елдігімізді баянды ет!
  Уа, Раббым, мына дүниеде ұялмайтындай ғұмыр сүруді, құзырыңа жарқын жүзбен баруды нәсіп ет!
  Фирдаус жәннатың мен Өзіңнің дидар-жүзіңді көру бақыты бұйырған салиқалы құлдарыңның  қатарына қоса көр!
  Әмин! Әмин! Әмин!
  
  #kemeladam `
}]




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