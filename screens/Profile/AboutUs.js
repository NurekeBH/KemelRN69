import React, { Component } from 'react';
import { View, Text, SafeAreaView, StatusBar, ScrollView } from 'react-native';
import FastImage from 'react-native-fast-image';
import { getLang } from '../../Component/Component';
import Header from '../../Component/Header2';
import { strings } from '../../Localization/Localization';

let aboutAppRu = 'Это мобильное приложение – специальный дополнительный инструмент на основе книги «Кемел адам», помогающий эффективно использовать время и правильно планировать работу. Если поставленные цели не будут специально распланированы и расписаны, то они с большой вероятностью могут остаться лишь желаниями и фантазиями. И если вы не определите несколько самых важных дел из тех, что вы выполняете ежедневно и не дадите им приоритетное значение, то поток срочной, но порой бессмысленной рутины может отдалять вас от ваших целей, не давая вам возможности реализоваться. Благодаря этому мобильному приложению вы сможете правильно ставить цели и результативно планировать ваши задачи. А заодно вы сформируете необходимые для жизни навыки. Желаем Вам успехов!'
let aboutAppKz = `Бұл мобильдік қосымша – «Кемел адам» кітабының негізінде уақытты тиімді пайдалану мен жұмысты дұрыс жоспарлауға көмектесетін арнайы қосымша құрал.
Алға қойған мақсат алдын ала арнайы жоспарланып, жазылмаса, арман-қиял күйінде қалып қояды. Күнделікті   атқарылатын істеріңіздің ең маңызды бірнешеуін анықтап, соған басымдық бермесеңіз алдыңыздан шыға беретін шұғыл шаруалар ниеттенген маңызды істеріңізді  кейінге ысырып тастап, сізді мақсатыңыздан алыстатады. 
Енді қолыңыздағы осы мобильдік қосымша арқылы мақсаттарыңызды дұрыс қойып, жұмыстарыңызды тиімді жоспарлай аласыз. Сонда-ақ, бойыңызға жақсы дағдыларды қалыптастырасыз.`
let aboutAppEn = `This mobile application is a special additional tool based on the Kemel Adam book, which helps to use time efficiently and plan work properly. If the goals set are not specially planned and scheduled, then with a high probability they can remain only desires and fantasies. And if you don't identify a few of the most important things you do on a daily basis and give them priority, then the flow of urgent, but sometimes meaningless routine can take you away from your goals, not giving you the opportunity to realize yourself. Thanks to this mobile application, you will be able to set goals correctly and effectively plan your tasks. And at the same time, you will form the skills necessary for life. We wish you success!`

export default class AboutUs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      aboutText: getLang() == 'kk' ? aboutAppKz : getLang() == 'ru' ? aboutAppRu : aboutAppEn
    };
  }

  render() {
    const { aboutText } = this.state
    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <StatusBar backgroundColor={'#fff'} barStyle="dark-content" />
        <SafeAreaView style={{ flex: 1 }}>
          <Header
            title={strings.onas}
            onLeftPress={() => this.props.navigation.goBack()}
          />
          <ScrollView
            contentContainerStyle={{ padding: 16 }}
            showsVerticalScrollIndicator={false}>
            <FastImage
              source={require('../../assets/logo.png')}
              style={{ width: 80, aspectRatio: 1, marginBottom: 24 }}
            />
            <Text style={{ color: 'black', fontSize: 40, fontWeight: '700' }}>Kemel Adam</Text>
            <Text style={{ color: 'black', fontSize: 17, marginTop: 16 }}>{aboutText}</Text>
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }
}
