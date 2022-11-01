import React, {Component} from 'react';
import {View, Text, SafeAreaView, StatusBar, ScrollView} from 'react-native';
import FastImage from 'react-native-fast-image';
import Header from '../../Component/Header2';
import {strings} from '../../Localization/Localization';

export default class AboutUs extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#fff'}}>
        <StatusBar backgroundColor={'#fff'} barStyle="dark-content" />
        <SafeAreaView style={{flex: 1}}>
          <Header
            title={strings.onas}
            onLeftPress={() => this.props.navigation.goBack()}
          />
          <ScrollView
            contentContainerStyle={{padding: 16}}
            showsVerticalScrollIndicator={false}>
            <FastImage
              source={require('../../assets/logo.png')}
              style={{width: 80, aspectRatio: 1, marginBottom: 24}}
            />
            <Text style={{fontSize: 40, fontWeight: '700'}}>Kemel Adam</Text>
            <Text style={{fontSize: 17, marginTop: 16}}>
              Автор бұл кітабында жан-жақты жетілген идеалды адамның қасиеттері
              мен ерекшеліктерін түсіндіре отырып, оқырманын “кемел адам” болуға
              шақырады. Кітаптың бірінші бөлімінде кемелденудің психологиялық
              кедергілері түсіндіріліп, түйіні тарқатылса, екінші бөлімде тән
              сау- лығының маңыздылығы, денсаулықты күтудің жолдары мен
              жай-жапсары баяндалады. Үшінші бөлімде уақытты тиімді пайдалану
              және жоспарлау тәсілдері мен тетіктері берілген. Төртінші бөлімде
              қаржылық сауаттылық жайлы түсіндіріліп, тапқан табысты нәтижелі
              жұмсаудың бағыт-бағдары айтылады. Ал бесінші, алтыншы бөлімде
              эмоциялық зерде, яғни байсалдылық танытып, көңіл-күй,
              сезімдерімізді басқару тәсілдері мен қарым-қатынас қағидалары
              жан-жақты түсіндіріледі. Әр бөлім мысалдар және рухани ұстын,
              қағидалармен бекітіліп отырады. Кітапта айтылған тұлғалық дамуға
              қатысты ереже-тәсілдерді жүзеге асыруға көмекші құрал ретінде
              арнайы «Кемел адам күнделігі» қоса ұсынылып отыр.
            </Text>
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }
}
