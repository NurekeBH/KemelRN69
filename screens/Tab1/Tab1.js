import React, { Component } from 'react';
import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Switch,
  TextInput,
  NativeModules,
  NativeEventEmitter,
  Modal,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import {
  ButtonClass,
  getLang,
  getTemplateLabel,
  GetTime,
  Header2,
  showToast,
  width,
} from '../../Component/Component';
import {
  Alish,
  Bottom,
  Done,
  DoneModal,
  LeftIcon,
  LeftIcon2,
  MonthIcon,
  Nodes,
  PluseBtn,
  WeekIcon,
  PurposeIcon,
  Minuse,
  Plusee,
  Priority,
  CircleDone,
  clock,
  swipeDelete,
  ShareNote,
  iconFile,
  closeIcon,
  PurposeIconGrey,
  FileIcon,
  threeDot,
  addHabitsIcon,
} from '../../Component/MyIcons';
import { getStatusBarHeight } from '../../Component/getStatusBarHeight';
import { strings } from '../../Localization/Localization';
import Collapsible from 'react-native-collapsible';
import ModalBox from 'react-native-modalbox';
import { colorApp } from '../../theme/Colors';
import axios from 'axios';
import moment from 'moment';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import ModalTasks from './ModalTasks';
import ModalHabits from './ModalHabits';
import Swipeout from '../../Swipeout/index';

import Share from 'react-native-share';
import ModalDrax from './ModalDrax';
import TabHeader from '../../Component/TabHeader';

import SoundPlayer from 'react-native-sound-player';
import CalendarStrip from '../../Component/CalendarStrip';

LocaleConfig.locales['kk'] = {
  monthNames: [
    'Қаңтар',
    'Ақпан',
    'Наурыз',
    'Сәуір',
    'Мамыр',
    'Маусым',
    'Шілде',
    'Тамыз',
    'Қыркүйек',
    'Қазан',
    'Қараша',
    'Желтоқсан',
  ],
  monthNamesShort: [
    'Қаңтар',
    'Ақпан',
    'Наурыз',
    'Сәуір',
    'Мамыр',
    'Маусым',
    'Шілде',
    'Тамыз',
    'Қыркүйек',
    'Қазан',
    'Қараша',
    'Желтоқсан',
  ],
  dayNames: [
    'Жексенбі',
    'Дүйсенбі',
    'Сейсенбі',
    'Сарсенбі',
    'Бейсенбі',
    'Жұма',
    'Сенбі',
  ],
  dayNamesShort: ['Же', 'Дү', 'Се', 'Сә', 'Бе', 'Жм', 'Сб'],
  today: 'Бүгін',
};

LocaleConfig.locales['ru'] = {
  monthNames: [
    'Январь',
    'Февраль',
    'Март',
    'Апрель',
    'Май',
    'Июнь',
    'Июль',
    'Август',
    'Сентябрь',
    'Октябрь',
    'Ноябрь',
    'Декабрь',
  ],
  monthNamesShort: [
    'Янв',
    'Фев',
    'Март',
    'Апр',
    'Май',
    'Июнь',
    'Июль',
    'Авг',
    'Сент',
    'Окт',
    'Нояб',
    'Декаб',
  ],
  dayNames: [
    'Воскресенье',
    'Понедельник',
    'Вторник',
    'Среда',
    'Четверг',
    'Пятница',
    'Суббота',
  ],
  dayNamesShort: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
  today: 'Сегодня',
};

export const TopModalButtonStyle = ({ icon, title, titleColor, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.7}
    style={[
      styles.mdlVwStl,
      { borderBottomWidth: title == strings.mygoals ? 0 : 1 },
    ]}>
    {icon}
    <Text style={{ marginLeft: 10, fontSize: 17, color: titleColor }}>
      {title}
    </Text>
  </TouchableOpacity>
);

export const BottomModalButtonStyle = ({ title, onPress, icon }) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.7}
    style={{
      flexDirection: 'row',
      padding: 16,
      alignItems: 'center',
      backgroundColor: '#fff',
      borderRadius: 14,
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(0, 0, 0, 0.2)',
    }}>
    {icon}
    <Text style={{ marginLeft: 8, fontSize: 20, color: '#232857' }}>{title}</Text>
  </TouchableOpacity>
);

export default class Tab1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: 'day',
      todos: '',
      isLoading: true,
      modelItem: null,
      modelHabits: null,
      bytype: 0,

      markedDates: [],

      issupport: false,
      steps: 0,

      rContent: '',
      isOpenHabits: true,

      tasks: [],
      habbits: [],
      isLoadingcalendar: true,
      visible: false,
      indDrax: 0,
      dataDrax: [],
      now: this.props.route.params?.date
        ? this.props.route.params.date
        : moment().format('YYYY-MM-DD'),
    };
  }

  componentDidMount() {
    if (getLang() == 'kk') {
      LocaleConfig.defaultLocale = 'kk';
    } else {
      LocaleConfig.defaultLocale = 'ru';
    }

    this.getTodoList();
    this.getNotes();



    _onFinishedPlayingSubscription = SoundPlayer.addEventListener(
      'FinishedPlaying',
      ({ success }) => {
        console.log('finished playing', success);
      },
    );
    _onFinishedLoadingSubscription = SoundPlayer.addEventListener(
      'FinishedLoading',
      ({ success }) => {
        console.log('finished loading', success);
      },
    );
    _onFinishedLoadingFileSubscription = SoundPlayer.addEventListener(
      'FinishedLoadingFile',
      ({ success, name, type }) => {
        console.log('finished loading file', success, name, type);
      },
    );
    _onFinishedLoadingURLSubscription = SoundPlayer.addEventListener(
      'FinishedLoadingURL',
      ({ success, url }) => {
        console.log('finished loading url', success, url);
      },
    );
  }

  PlaySound() {
    try {
      console.log('pppppppp');

      SoundPlayer.playSoundFile('sound', 'mp3');
    } catch (e) {
      console.log(`cannot play the sound file`, e);
    }
  }

  getNotes() {
    axios
      .get('notes/folder/?parent__isnull=True')
      .then(response => {

        this.setState({
          folderData: response.data,
        });
      })
      .catch(error => {

        console.log('RESPONSE error:', error.response);
        if (error.response && error.response.status == 401) {
          showToast('error', error.response.data.detail);
        }
      });
  }

  GetHistory() {
    console.log(' _marketData1:');

    axios
      .get('todos/future/')
      .then(response => {
        const x = response.data;
        var _marketData = {};
        console.log('RESPONSE _marketData1:', response);

        Object.entries(x).map(
          ([key, val]) =>
          (_marketData[val] = {
            marked: true,
            dotColor: '#FF3B30',
            // customStyles: {
            //   container: {
            //     borderRadius: 50,
            //     borderWidth: 2,
            //     borderColor: '#24B445',
            //     alignItems: 'center',
            //     justifyContent: 'center',
            //   },
            // },
          }),
        );
        console.log('RESPONSE _marketData:', _marketData);

        this.setState({
          calendarData: _marketData,
          markedDates: x,
          isLoadingcalendar: false,
        });
      })
      .catch(error => {
        console.log(' _marketData: err ', error.response);

        this.setState({
          isLoadingcalendar: false,
        });
      });
  }

  share(text) {
    const shareOptions = {
      title: 'Kemel Adam',
      message: text,
      url: 'https://kemeladam.kz/',
    };

    Share.open(shareOptions)
      .then(res => { })
      .catch(err => {
        err && console.log(err);
      });
  }

  getRandomizer() {
    axios
      .get(`todos/randomizer/generate/`)
      .then(response => {
        console.log('RESPONSE generate:', response);
        this.setState({
          rContent: response.data.content,
        });
      })
      .catch(error => {
        Alert.alert('error', error.response.data.substring(0, 200));
        console.log('RESPONSE error:', error.response);
        if (error.response && error.response.status == 401) {
          showToast('error', error.response.data.detail);
        }
      });
  }

  getTodoList() {
    this.GetHistory();
    const { open, now } = this.state;
    if (open == 'week') {
      var startOfWeek = moment().startOf('week').toDate();
      var endOfWeek = moment().endOf('week').toDate();
    }
    let URL = open == 'day' ? `todos/day/?date=${now}` : `todos/week/?start=${moment(startOfWeek).format('YYYY-MM-DD')}&end=${moment(endOfWeek).format('YYYY-MM-DD')}`

    axios
      .get(URL)
      .then(response => {
        console.log('RESPONSE getTodoList:', response.data);
        let result = [];
        let arrTasks = [];
        let arrHabits = [];

        if (open == 'week') {
          const x = response.data;

          result = Object.entries(x).map(([key, val]) => ({
            ['date']: new Date(key),
            ['habits']: val['habits'] ? val['habits'] : [],
            ['tasks']: val['tasks'] ? val['tasks'] : [],
            ['isCollapsed']: 'false',
            ['doneTasksCount']: val['tasks'].filter(item => item.done === true).length,
            ['doneHabitsCount']: val['habits'].filter(item => item.done === true).length,
          }));


          for (let r = 0; r < result.length; r++) {
            let arrHabits = result[r].habits
            for (let j = 0; j < arrHabits.length; j++) {
              let HAB = arrHabits[j]
              HAB.click_date = moment(result[r].date).format('YYYY-MM-DD')
              HAB.done = true;
              if (HAB.history && HAB.history.habit === HAB.id) {
                HAB.done = HAB.history.done;;
              } else {
                HAB.done = false;
              }
            }
            result[r].doneHabitsCount = arrHabits.filter(item => item.done === true).length

          }



          result = result.sort((a, b) => a.date - b.date);
        } else {
          arrTasks = response.data.tasks;
          arrHabits = response.data.habits;

          for (let j = 0; j < arrHabits.length; j++) {
            let HAB = arrHabits[j]
            HAB.done = false;
            HAB.click_date = now
            if (HAB.history && HAB.history.habit === HAB.id) {
              HAB.done = HAB.history.done;
            } else {
              HAB.done = false;
            }
          }

          let DoneTasks = arrTasks.filter(item => item.done === true).length;
          let DoneHabits = arrHabits.filter(item => item.done === true).length;


          result = [
            {
              date: now,
              habits: arrHabits,
              tasks: arrTasks,
              isCollapsed: false,
              doneTasksCount: DoneTasks,
              doneHabitsCount: DoneHabits,
            },
          ];


        }


        console.log('resultresult', result)
        this.setState({
          todos: result,
          tasks: arrTasks,
          habbits: arrHabits,
          isLoading: false,
        });
      })
      .catch(error => {
        Alert.alert('error', error.response.data.substring(0, 200));
        console.log('RESPONSE error:', error.response);
        if (error.response && error.response.status == 401) {
          showToast('error', error.response.data.detail);
        }
      });
  }

  renderItem = ({ item, index }) => {
    return (
      <View style={{ margin: 16 }}>
        <Text
          style={{
            fontSize: 17,
            fontWeight: '600',
            color: '#232857',
            marginBottom: 11,
            textTransform: 'capitalize',
          }}>
          {GetTime(item.date, 'ddd, D MMMM')}
        </Text>

        <FlatList
          listKey={(item, index) => 'A' + index.toString()}
          data={item.tasks}
          keyExtractor={(item, index) => index.toString()}
          renderItem={this.renderItemTodos}
          showsVerticalScrollIndicator={false}
        />

        <View
          style={{
            borderRadius: 8,
            marginTop: 4,
          }}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              if (this.state.open == 'week')
                item.isCollapsed = !item.isCollapsed;

              this.setState({
                isOpenHabits: !this.state.isOpenHabits,
              });
              setTimeout(() => {
                this.setState({
                  isOpenHabits: true,
                });
              }, 15000);
            }}
            style={[
              styles.vwStl,
              {
                backgroundColor: this.state.isOpenHabits ? '#ffffff' : null,
                paddingVertical: 13,
                marginBottom: 0,
              },
            ]}>
            <Text style={{ flex: 1, fontSize: 17, fontWeight: '600' }}>{strings.adets}</Text>
            {
              !this.state.isOpenHabits ?
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate('HabitAdd', {
                      updateData: this.updateData,
                    })
                  }}
                  style={{ marginRight: 8, width: 30, height: 30, alignItems: 'center', justifyContent: 'center', borderRadius: 15, }}>
                  {addHabitsIcon}
                </TouchableOpacity>
                :
                null
            }
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text
                style={{
                  fontSize: 12,
                  color: '#8A8FA0',
                  marginRight: 9,
                }}>
                {item.doneHabitsCount}/{item.habits.length}
              </Text>
              {Bottom}
            </View>
          </TouchableOpacity>
          <Collapsible
            collapsed={
              this.state.open == 'week'
                ? item.isCollapsed
                : this.state.isOpenHabits
            }
            style={{ paddingBottom: 16 }}>
            <FlatList
              listKey={(item, index) => 'B' + index.toString()}
              data={item.habits}
              keyExtractor={(item, index) => item.date}
              renderItem={this.renderItemHabits}
              showsVerticalScrollIndicator={false}
            />
          </Collapsible>
        </View>
      </View>
    );
  };

  renderItemTodos = ({ item, index }) => {
    return (
      <Swipeout
        autoClose={true}
        style={{
          borderRadius: 10,
          maxHeight: 200,
          marginTop: 4,
        }}
        right={[
          {
            component: (
              <View
                style={{
                  backgroundColor: '#bcc0f8',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flex: 1,
                  maxHeight: 200,
                }}>
                {ShareNote}
                <Text style={{ marginTop: 4, fontSize: 8, color: '#3F49DC' }}>
                  поделиться
                </Text>
              </View>
            ),
            onPress: () => {
              this.share(item.label);
            },
          },
          {
            component: (
              <View
                style={{
                  backgroundColor: '#f0dcda',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flex: 1,
                  maxHeight: 200,
                }}>
                {swipeDelete}
                <Text style={{ marginTop: 4, fontSize: 8, color: '#FF3B30' }}>
                  {strings.delete}
                </Text>
              </View>
            ),
            onPress: () => {
              axios
                .delete(`todos/task/${item.id}/`)
                .then(response => {
                  console.log('RESPONSE todos:', response);

                  this.getTodoList();
                })
                .catch(error => {
                  console.log('RESPONSE error:', error.response);
                  if (error.response && error.response.status == 401) {
                    showToast('error', error.response.data.detail);
                  }
                });
            },
          },
        ]}>
        <View
          style={[
            styles.vwStl,
            {
              minHeight: 55,
              paddingVertical: 6,
              backgroundColor: '#fff',
            },
          ]}>
          <TouchableOpacity
            onPress={() => {
              item.done = !item.done;
              this.DoneTasks(item);
              item.done && this.PlaySound();
            }}
            style={{ height: 40, justifyContent: 'center', width: 40 }}
            activeOpacity={0.8}>
            {item.done ? (
              <View style={styles.doneStl}>{Done}</View>
            ) : (
              <View
                style={[
                  styles.doneStl2,
                  {
                    borderColor: item.priority ? '#FF3B30' : '#DADADA',
                  },
                ]}
              />
            )}
          </TouchableOpacity>

          <TouchableOpacity

            onLongPress={() => {
              this.state.open == 'day'
                ? this.setState({
                  indDrax: 1,
                  visible: true,
                })
                : null;
            }}
            style={{ flex: 1 }}
            activeOpacity={0.8}>
            <View >
              <Text
                style={{
                  fontSize: 15,
                  textDecorationLine: item.done ? 'line-through' : 'none',
                  color: item.done ? '#8E8E93' : '#000',
                }}>
                {item.label}
              </Text>
              <View
                style={{
                  marginTop: 2,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                {clock}
                <Text
                  style={{
                    fontSize: 12,
                    color: '#8E8E93',
                    marginLeft: 4,
                    textTransform: 'capitalize',
                  }}>
                  {GetTime(item.datetime, 'DD MMM. YYYY, HH:mm')}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              // item.done = !item.done;
              this.setState({
                modelItem: item,
              });

              // this.DoneTasks(item);
            }}

            style={{ height: 40, justifyContent: 'center', alignItems: 'flex-end', width: 40, }}
          >
            {threeDot}
          </TouchableOpacity>
        </View>
      </Swipeout>
    );
  };

  DoneTasks(item) {
    console.log('item', item);
    let DateTime = GetTime(item.datetime, '').split('+')[0];
    console.log('DateTime', DateTime);

    axios
      .put(`todos/task/${item.id}/`, {
        label: item.label,
        desc: item.desc,
        address: item.address,
        priority: item.priority,
        done: item.done,
        sort: item.sort,
        datetime: DateTime,
      })
      .then(response => {
        console.log('RESPONSE put:', response);

        this.getTodoList();
      })
      .catch(error => {
        console.log('RESPONSE put:', error.response);
        if (error.response && error.response.status == 401) {
          showToast('error', error.response.data.detail);
        }
      });
  }

  renderItemHabits = ({ item, index }) => {
    // let item = item1.item;
    // let index = item1.index;
    console.log("HHHHHHHH", item)
    return (
      <Swipeout
        autoClose={true}
        style={{
          borderRadius: 10,
          maxHeight: 200,
          marginTop: 4,
        }}
        right={[
          {
            component: (
              <View
                style={{
                  backgroundColor: '#bcc0f8',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flex: 1,
                  maxHeight: 200,
                }}>
                {ShareNote}
                <Text style={{ marginTop: 4, fontSize: 8, color: '#3F49DC' }}>
                  поделиться
                </Text>
              </View>
            ),
            onPress: () => {
              this.share(item.label);
            },
          },
          {
            component: (
              <View
                style={{
                  backgroundColor: '#f0dcda',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flex: 1,
                  maxHeight: 200,
                }}>
                {swipeDelete}
                <Text style={{ marginTop: 4, fontSize: 8, color: '#FF3B30' }}>
                  {strings.delete}
                </Text>
              </View>
            ),
            onPress: () => {
              axios
                .delete(`todos/habit/${item.id}/destory/`)
                .then(response => {
                  console.log('RESPONSE todos:', response);

                  this.getTodoList();
                })
                .catch(error => {
                  console.log('RESPONSE error:', error.response);
                  if (error.response && error.response.status == 401) {
                    showToast('error', error.response.data.detail);
                  }
                });
            },
          },
        ]}>
        <View
          style={[
            styles.vwStl,
            {
              minHeight: 55,
              paddingVertical: 8,
              backgroundColor: '#fff',
            },
          ]}>
          <TouchableOpacity
            style={{ height: 40, justifyContent: 'center', width: 40, }}
            activeOpacity={0.8}
            onPress={() => {
              (item.done = !item.done), this.DoneHabits(item);
            }}>
            {item?.priority ? (
              Priority
            ) : item.done ? (
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

          <TouchableOpacity
            onLongPress={() => {
              this.state.open == 'day'
                ? this.setState({
                  indDrax: 2,
                  visible: true,
                })
                : null;
            }}
            style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row' }}
            activeOpacity={0.8}
            key={index}>
            <Text
              style={{
                fontSize: 15,
                textDecorationLine: item.done ? 'line-through' : 'none',
                color: item.done ? '#8E8E93' : '#000',
              }}>
              {item.label}
            </Text>
            {item.purpose ? <Text style={{ color: '#2BA149', fontSize: 16 }}>{item.target_value ? item.target_value.value : 0} {item.target_template ? getTemplateLabel(item.target_template.template) : null}</Text>
              :
              null}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              // (item.done = !item.done), this.DoneHabits(item);
              this.setState({
                modelHabits: item,
              });
            }}

            style={{ height: 40, justifyContent: 'center', alignItems: 'flex-end', width: 40, }}
          >
            {threeDot}
          </TouchableOpacity>

        </View>
      </Swipeout>
    );
  };

  DoneHabits(item) {
    console.log(' DoneHabits item', item);
    if (!item.done) {
      console.log('weeks:', item.weeks);

      axios
        .put(`todos/habit/${item.id}/update/`, {
          label: item.label,
          time: item.time,
          weeks: item.weeks,
          purpose: item.purpose,
          desc: item.desc,
          target: item.target,
          target_template: item.target_template.id,
        })
        .then(response => {
          console.log('RESPONSE update:', response);
          this.getTodoList();
        })
        .catch(error => {
          console.log('RESPONSE update:', error.response);
          if (error.response && error.response.status == 401) {
            showToast('error', error.response.data.detail);
          }
        });
    } else {
      this.PlaySound();
    }
    axios
      .post(`todos/habit/${item.id}/history/`, {
        done: item.done,
        date: item.click_date,
      })
      .then(response => {
        console.log('RESPONSE habit:', response);
        this.getTodoList();
      })
      .catch(error => {
        console.log('RESPONSE habit:', error.response);
        if (error.response && error.response.status == 401) {
          showToast('error', error.response.data.detail);
        }
      });

  }

  topModalButtonPress = ind => {
    this.setState(
      {
        open: ind == 1 ? 'week' : 'day',
        bytype: ind,
        modal: false,
        now: moment().format('YYYY-MM-DD'),
      },
      () => {
        this.getTodoList();
      },
    );
  };

  updateData = () => {
    console.log('aaa', 'updateData');
    this.getTodoList();
  };

  RefreshModal = (modelItem, isSave, isSaveZametka, zametka) => {
    if (isSave) {
      this.DoneTasks(modelItem);
    }
    this.setState({
      modelItem: null,
    });

    if (isSaveZametka) {
      this.props.navigation.navigate('Tab2');
    }
  };

  RefreshHabits = (ModalHabits, isSave) => {
    console.log('isSave', isSave);
    console.log('ModalHabits', ModalHabits);
    if (isSave) {
      this.DoneHabits(ModalHabits);
    }
    this.setState({
      modelHabits: null,
    });
  };

  _listHeaderComponent = () => {
    const { todos, isLoading } = this.state;

    if (isLoading) {
      return null;
    } else {
      const arrLen = todos[0].tasks.length + todos[0].habits.length

      let procentDone = parseInt((todos[0].doneTasksCount + todos[0].doneHabitsCount) * 100 / arrLen);
      if (arrLen == 0) { procentDone = 0 }
      return (
        <View>
          <View style={styles.vwStl}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: 32,
                  fontWeight: '500',
                  color: '#272727',
                }}>
                {todos[0].doneTasksCount}
              </Text>
              <Text style={{ fontSize: 13, color: '#232857', marginLeft: 8 }}>
                {strings.bugjet2}
              </Text>
            </View>
            <View
              style={{
                width: width / 2.4,
                marginBottom: 6,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <Text style={{ fontSize: 12, color: '#8A8FA0' }}>
                  {procentDone}%
                </Text>
                <Text style={{ fontSize: 12, color: '#8A8FA0' }}>
                  {todos[0].doneTasksCount + todos[0].doneHabitsCount}/
                  {todos[0].tasks.length + todos[0].habits.length}
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: '#fff',
                  height: 8,
                  width: '100%',
                  borderRadius: 8,
                  marginTop: 5,
                }}>
                <View
                  style={{
                    width: procentDone + '%',
                    height: 8,
                    backgroundColor: '#6577F3',
                    borderRadius: 8,
                  }}
                />
              </View>
            </View>
          </View>

          <CalendarStrip
            lang={getLang()}
            showWeekNumber
            startingDate={this.state.now}
            selectedDate={this.state.now}
            onPressDate={day => {
              this.setState(
                {
                  open: 'day',
                  now: GetTime(day, 'YYYY-MM-DD'),
                  bytype: 0,
                  modal: false,
                },
                () => {
                  this.getTodoList();
                },
              );
            }}
            onSwipeDown={() => {
              this.topModalButtonPress(2);
            }}
            markedDate={this.state.markedDates}
            weekStartsOn={1} // 0,1,2,3,4,5,6 for S M T W T F S, defaults to 0
          />
        </View>
      );
    }
  };

  onCloseModalDrax = bool => {
    this.getTodoList();
    this.GetHistory();
    this.setState({ visible: bool });
  };

  render() {
    const {
      todos,
      modal,
      ind,
      priority,
      modelItem,
      modelHabits,
      habits,
      isCollapsed,
      bytype,
      doneTasksCount,
      allTasksCount,
      doneHabitsCount,
      allHabitsCount,
      markedDates,
      now,
      visible,
      dataDrax,
      rContent,
      habbits,
      tasks,
      isLoading
    } = this.state;

    return (

      <View
        style={{
          flex: 1,
          backgroundColor: '#fff',
          paddingTop: getStatusBarHeight,
        }}>
        <StatusBar backgroundColor={'#fff'} barStyle="dark-content" />
        <SafeAreaView style={{ flex: 1 }}>

          <View style={{ flex: 1 }}>
            <TabHeader
              rightIcon={
                <LeftIcon
                  stroke={!modal ? '#3F49DC' : '#fff'}
                  stroke2={modal ? '#3F49DC' : '#fff'}
                />
              }
              rightOnPress={() =>
                this.setState({
                  bytype: null,
                  modal: !modal,
                })
              }
              title={GetTime(new Date(), 'MMMM')}
              navigation={this.props.navigation}
              borderBottomBoll={false}
            />

            <View style={{ flex: 1, backgroundColor: '#F2F2F7' }}>
              {bytype == 2 ? (
                <View>
                  <Calendar
                    enableSwipeMonths={true}
                    firstDay={1}
                    theme={{
                      todayTextColor: '#FF3B30',
                    }}
                    markingType={'custom'}
                    markedDates={this.state.calendarData}
                    onDayPress={day => {
                      console.log('day', day);
                      this.setState(
                        {
                          open: 'day',
                          now: day.dateString,
                          bytype: 0,
                          modal: false,
                        },
                        () => {
                          this.getTodoList();
                        },
                      );
                    }}
                  />
                  <TouchableOpacity
                    style={{
                      paddingVertical: 4,
                      alignItems: 'center',
                    }}
                    onPress={() => {
                      this.topModalButtonPress(0);
                    }}>
                    {closeIcon}
                  </TouchableOpacity>
                </View>
              ) : null}

              <View>{bytype != 2 ? this._listHeaderComponent() : null}</View>
              {isLoading ?
                <ActivityIndicator />
                :
                <FlatList
                  data={todos}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={this.renderItem}
                  showsVerticalScrollIndicator={false}
                />
              }


              <ModalBox
                isOpen={modal}
                backdropColor="rgba(0,0,0,0.7)"
                entry="top"
                position="top"
                onClosed={() => this.setState({ modal: false })}
                onOpened={() => this.setState({ modal: true })}
                style={{
                  height: 'auto',
                  borderBottomRightRadius: 12,
                  borderBottomLeftRadius: 12,
                }}
                backButtonClose>
                <View
                  style={{
                    width,
                    height: 'auto',
                  }}>
                  <TopModalButtonStyle
                    onPress={() => {
                      this.topModalButtonPress(0);
                    }}
                    title={strings.raspr}
                    titleColor={'#000'}
                    icon={
                      <LeftIcon2
                        stroke={bytype == 0 ? '#ffffff' : '#8E8E93'}
                        stroke2={bytype == 0 ? '#3F49DC' : '#ffffff'}
                        stroke3={bytype == 0 ? '#3F49DC' : '#8E8E93'}
                      />
                    }
                  />
                  <TopModalButtonStyle
                    onPress={() => {
                      this.topModalButtonPress(1);
                    }}
                    title={strings.week}
                    titleColor={'#000'}
                    icon={
                      <WeekIcon
                        stroke={bytype == 1 ? '#3F49DC' : '#ffffff'}
                        stroke2={bytype == 1 ? '#ffffff' : '#8E8E93'}
                        stroke3={bytype == 1 ? '#3F49DC' : '#8E8E93'}
                      />
                    }
                  />
                  <TopModalButtonStyle
                    onPress={() => {
                      this.topModalButtonPress(2);
                    }}
                    title={strings.month}
                    titleColor={'#000'}
                    icon={
                      <MonthIcon
                        stroke={bytype == 2 ? '#3F49DC' : '#8E8E93'}
                        stroke2={bytype == 2 ? '#fff' : '#8E8E93'}
                        stroke3={bytype == 2 ? '#3F49DC' : '#fff'}
                      />
                    }
                  />
                  <TopModalButtonStyle
                    onPress={() => {
                      this.props.navigation.navigate('MyGoals')
                      this.setState({ modal: false })
                    }}
                    title={strings.mygoals}
                    titleColor={'#000'}
                    icon={
                      PurposeIconGrey
                    }
                  />
                </View>
              </ModalBox>
              <TouchableOpacity
                onPress={() =>
                  // this.mdlRef.open()
                  this.props.navigation.navigate('TaskAdd', {
                    updateData: this.updateData,
                    now: now
                  })
                }
                activeOpacity={0.7}
                style={styles.btnStl}>
                {PluseBtn}
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>

        <ModalBox
          ref={e => (this.mdlRef = e)}
          backdropColor={'rgba(0,0,0,0.7)'}
          position="bottom"
          coverScreen
          style={{ height: 'auto', backgroundColor: 'transparent' }}>
          <View
            style={{
              width: width - 20,
              marginHorizontal: 10,
              borderRadius: 14,
              backgroundColor: '#fff',
            }}>
            <BottomModalButtonStyle
              onPress={() => {
                this.mdlRef.close(),
                  this.props.navigation.navigate('TaskAdd', {
                    updateData: this.updateData,
                    now: now
                  });
              }}
              title={strings.dobz}
              icon={DoneModal}
            />
            {/* <BottomModalButtonStyle
              onPress={() => {
                this.mdlRef.close(), this.props.navigation.navigate('NoteAdd');
              }}
              title={strings.zamk}
              icon={Nodes}
            /> */}
            <BottomModalButtonStyle
              onPress={() => {
                this.mdlRef.close(),
                  this.props.navigation.navigate('HabitAdd', {
                    updateData: this.updateData,
                  });
              }}
              title={strings.adetk}
              icon={Alish}
            />
          </View>
          <ButtonClass
            onPress={() => this.mdlRef.close()}
            title={strings.bastar}
            style={{
              backgroundColor: '#fff',
              width: width - 20,
              marginHorizontal: 10,
              marginBottom: 30,
              borderRadius: 14,
            }}
            titleStyle={{
              fontSize: 20,
              fontWeight: '700',
              color: '#232857',
            }}
          />
        </ModalBox>

        {modelItem ? (
          <ModalTasks
            isOpen={modelItem}
            folderData={this.state.folderData}
            modelItemData={modelItem}
            RefreshModal={this.RefreshModal}
          />
        ) : null}

        {modelHabits ? (
          <ModalHabits
            isOpen={modelHabits}
            modelItemData={modelHabits}
            RefreshModal={this.RefreshHabits}
          />
        ) : null}
        <Modal
          style={{ flex: 1 }}
          animationType="fade"
          transparent
          visible={visible}>
          <ModalDrax
            onClose={bool => this.onCloseModalDrax(bool)}
            ind={this.state.indDrax}
            dataDrax={this.state.indDrax == 2 ? habbits : tasks}
          />
        </Modal>
      </View>
    );
  }
}




const styles = StyleSheet.create({
  vwStl: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
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
    backgroundColor: '#3F49DC',
    position: 'absolute',
    right: 16,
    bottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  mdlVwStl: {
    flexDirection: 'row',
    paddingVertical: 15,
    marginHorizontal: 19,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
    alignItems: 'center',
  },
  mdlVwStl2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
    paddingVertical: 13,
    borderBottomWidth: 1,
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
  pushStl: {
    height: 48,
    backgroundColor: '#34C759',
    borderRadius: 8,
    alignItems: 'center',
    paddingHorizontal: 12,
    flexDirection: 'row',
    position: 'absolute',
    width: width - 40,
    marginHorizontal: 20,
    marginTop: 10,
  },
});
