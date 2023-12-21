import React, { Component } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Platform,
  Switch,
  StyleSheet,
  TextInput,
} from 'react-native';
import {
  ButtonClass,
  getLang,
  getTemplateLabel,
  HeaderStyle,
  showToast,
  width,
} from '../../Component/Component';
import { strings } from '../../Localization/Localization';
import DatePicker from 'react-native-date-picker';
import { Flag, Left_icon, Right30Sec } from '../../Component/MyIcons';
import axios from 'axios';

import { Dropdown } from 'react-native-element-dropdown';
const bordercolor = 'rgba(0, 0, 0, 0.2)';

export default class HabitAdd extends Component {
  constructor(props) {
    super(props);
    this.state = {

      targetArr: [],
      isLoadingTarget: true,
      selected_template: 1,

      isSend: false,
      is_purpose: false,
      target: 1,
      label: '',
      time: new Date(),
      dateTime:
        ('0' + new Date().getHours()).slice(-2) +
        ':' +
        ('0' + new Date().getMinutes()).slice(-2),
      week_day_ids: [1, 2, 3, 4, 5, 6, 7],
      weekArr:
        getLang() == 'kk'
          ? [
            { id: 1, week: 'Дс', acitve: true },
            { id: 2, week: 'Cс', acitve: true },
            { id: 3, week: 'Cс', acitve: true },
            { id: 4, week: 'Бс', acitve: true },
            { id: 5, week: 'Жм', acitve: true },
            { id: 6, week: 'Cб', acitve: true },
            { id: 7, week: 'Жс', acitve: true },
          ]
          : getLang() == 'en'
            ? [
              { id: 1, week: 'Mon', acitve: true },
              { id: 2, week: 'Tue', acitve: true },
              { id: 3, week: 'Wed', acitve: true },
              { id: 4, week: 'Thu', acitve: true },
              { id: 5, week: 'Fri', acitve: true },
              { id: 6, week: 'Sat', acitve: true },
              { id: 7, week: 'Sun', acitve: true },
            ]
            : [
              { id: 1, week: 'Пн', acitve: true },
              { id: 2, week: 'Вт', acitve: true },
              { id: 3, week: 'Cр', acitve: true },
              { id: 4, week: 'Чт', acitve: true },
              { id: 5, week: 'Пт', acitve: true },
              { id: 6, week: 'Cб', acitve: true },
              { id: 7, week: 'Вс', acitve: true },
            ],
    };
  }

  componentDidMount() {

    // axios.get('todos/weeks/')
    //   .then((response) => {
    //     console.log('weeks weeks', response)
    //   })
    //   .catch((error) => {

    //     console.log(' error', error)
    //   })



    axios.get('todos/target-templates/')
      .then((response) => {
        console.log('templates response', response)

        let Arra = response.data
        for (let index = 0; index < Arra.length; index++) {
          const element = Arra[index];
          element.template = getTemplateLabel(element.template)
        }

        console.log('ArraArra', Arra)


        this.setState({
          targetArr: response.data,
          isLoadingTarget: false,
          selected_template: response.data[0].id
        })
      })
      .catch((error) => {

      })

  }



  AddHabit = () => {
    const { is_purpose, label, dateTime, week_day_ids, target, selected_template } =
      this.state;
    console.log('week_day_ids', week_day_ids);
    if (label && week_day_ids.length > 0) {
      this.setState({ isSend: true }, () => {
        axios
          .post('todos/habit/', {
            label: label,
            time: dateTime,
            weeks: week_day_ids,
            purpose: is_purpose,
            desc: '',
            target: target,
            target_template: selected_template,
          })
          .then(response => {
            console.log('RESPONSE habits add:', response);
            this.props.route.params.updateData();
            this.props.navigation.goBack();
          })
          .catch(error => {
            console.log('RESPONSE habits error:', error.response);
            if (error.response && error.response.status == 401) {
              showToast('error', error.response.data.detail);
            }
          });
      });
    }
  };

  render() {
    const { targetArr, isSend, is_purpose, label, time, dateTime, weekArr, week_day_ids, target } =
      this.state;
    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <StatusBar backgroundColor={'#fff'} barStyle="dark-content" />
        <SafeAreaView style={{ flex: 1 }}>
          <View style={HeaderStyle}>
            <TouchableOpacity
              style={{ width: 56 }}
              onPress={() => this.props.navigation.goBack()}
              activeOpacity={0.7}>
              {Left_icon}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.AddHabit()}>
              <Text style={{ fontSize: 17, fontWeight: '600', color: '#3F49DC' }}>
                {strings.save}
              </Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={{ paddingHorizontal: 16 }}>
            <View
              style={{
                paddingVertical: 10,
                borderBottomWidth: 1,
                borderBottomColor: bordercolor,
              }}>
              <TextInput
                autoFocus={true}
                style={{ fontSize: 20, fontWeight: '700', marginHorizontal: 10 }}
                placeholder={strings.adetk}
                placeholderTextColor={'#D1D1D6'}
                multiline
                value={label}
                onChangeText={e => this.setState({ label: e })}
              />
            </View>
            <View>
              <Text style={{ color: 'black', fontSize: 22, fontWeight: '700', marginTop: 16 }}>
                {strings.kunder}
              </Text>
              <View style={styles.weekVwStl}>
                {weekArr.map((item, index) => (
                  <TouchableOpacity
                    onPress={() => {
                      item.acitve = !item.acitve;
                      let arr = week_day_ids;

                      if (!arr.includes(item.id)) {
                        arr.push(item.id);
                      } else {
                        arr.splice(arr.indexOf(item.id), 1);
                      }

                      this.setState({
                        week_day_ids: arr,
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
                      {item.week}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <View
              style={{
                marginTop: 10,
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
                {Flag}
                <Text style={{ color: 'black', fontSize: 17, marginLeft: 12 }}>
                  {strings.maks}
                </Text>
              </View>
              <Switch
                value={is_purpose}
                onValueChange={e => this.setState({ is_purpose: e })}
              />
            </View>
            {is_purpose ? (
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
                  <Text style={{ fontSize: 17, color: 'grey' }}>{strings.perday}</Text>
                </View>
                <TextInput
                  style={{ color: '#000', paddingVertical: 2, fontSize: 16, borderRadius: 10, width: 100, textAlign: 'center', backgroundColor: 'rgba(0,0,0,0.1)' }}
                  placeholder="0"
                  keyboardType="number-pad"
                  placeholderTextColor={"#000"}
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
            ) : null}
            {/* <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingVertical: 16,
              }}>
              <Text style={{ fontSize: 17 }}>{strings.vremya}</Text>
              <Text style={{ fontSize: 17, color: '#3F49DC' }}>{dateTime}</Text>
            </View> */}
            {/* <View
              style={{
                alignItems: 'center',
                borderBottomColor: 'rgba(0, 0, 0, 0.2)',
                borderBottomWidth: 1,
              }}>
              <DatePicker
                mode="time"
                open={true}
                date={time}
                style={{ width: width }}
                is24hourSource="locale"
                locale={getLang()}
                onDateChange={time =>
                  this.setState({
                    time,
                    dateTime:
                      ('0' + time.getHours()).slice(-2) +
                      ':' +
                      ('0' + time.getMinutes()).slice(-2),
                  })
                }
              />
            </View> */}
          </ScrollView>





        </SafeAreaView>
      </View >
    );
  }
}

const styles = StyleSheet.create({
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
    paddingVertical: 20,
    backgroundColor: '#F2F2F7',
    marginTop: 8,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
});
