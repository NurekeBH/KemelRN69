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
} from 'react-native';
import {
  ButtonClass,
  getLang,
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
} from '../../Component/MyIcons';
import { getStatusBarHeight } from '../../Component/getStatusBarHeight';
import { strings } from '../../Localization/Localization';
import Collapsible from 'react-native-collapsible';
import ModalBox from 'react-native-modalbox';
import { colorApp } from '../../theme/Colors';
import FastImage from 'react-native-fast-image';
import * as Animatable from 'react-native-animatable';
import axios from 'axios';
import moment from 'moment';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import ModalTasks from './ModalTasks';
import ModalHabits from './ModalHabits';
import Swipeout from '../../Swipeout/index'

import Pedometer from 'react-native-pedometer-ios-android';
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
      { borderBottomWidth: title == strings.month ? 0 : 1 },
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
    // this.getRandomizer();
    this.GetHistory();

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

  GetHistory() {
    axios
      .get('todos/statistics/')
      .then(response => {
        const x = response.data;
        var _marketData = {};
        console.log('RESPONSE _marketData1:', _marketData);

        Object.entries(x).map(
          ([key, val]) =>
          (_marketData[key] = {
            customStyles: {
              container: {
                borderRadius: 50,
                borderWidth: 2,
                borderColor: '#24B445',
                alignItems: 'center',
                justifyContent: 'center',
              },
            },
          }),
        );
        console.log('RESPONSE _marketData:', _marketData);

        this.setState({
          calendarData: _marketData,
          isLoadingcalendar: false,
        });
      })
      .catch(error => {
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
    const { open, now } = this.state;
    // let now = "2022-03-01"
    axios
      .get(`todos/tasks/?open=${open}&date=${now}`)
      .then(response => {
        console.log('RESPONSE getTodoList:', response);
        let result = [];
        let arrTasks = [];
        let arrHabits = [];
        if (open == 'week') {
          const x = response.data.todos;

          result = Object.entries(x).map(([key, val]) => ({
            ['date']: new Date(key),
            ['habits']: val['habits'] ? val['habits'] : [],
            ['tasks']: val['tasks'] ? val['tasks'] : [],
            ['isCollapsed']: 'false',
          }));

          result = result.sort((a, b) => a.date - b.date);
        } else {
          let arrHabitsHistory = response.data.todos.habit_histories;
          arrTasks = response.data.todos.tasks;
          arrHabits = response.data.todos.habits;

          for (let j = 0; j < arrHabits.length; j++) {
            arrHabits[j].done = false;
            for (let i = 0; i < arrHabitsHistory.length; i++) {
              if (arrHabitsHistory[i].habit === arrHabits[j].id) {
                arrHabits[j].done = true;
              }
            }
          }

          let DoneTasks = arrTasks.filter(item => item.done === true).length;
          let DoneHabits = arrHabits.filter(item => item.done === true).length;

          console.log('DoneTasks', DoneTasks);
          console.log('DoneTasks', DoneHabits);

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
              }, 10000);
            }}
            style={[
              styles.vwStl,
              {
                backgroundColor: this.state.isOpenHabits ? '#ffffff' : null,
                paddingVertical: 13,
                marginBottom: 0,
              },
            ]}>
            <Text style={{ fontSize: 17, fontWeight: '600' }}>Әдеттер</Text>
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
              keyExtractor={(item, index) => index.toString()}
              // renderItem={item1 => {
              //   let item2 = item.habits;
              //   this.renderItemHabits({item1, item2});
              // }}
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
            onLongPress={() => {
              this.state.open == 'day'
                ? this.setState({
                  indDrax: 1,
                  visible: true,
                })
                : null;
            }}
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
            onPress={() => {
              // item.done = !item.done;
              this.setState({
                modelItem: item,
              });

              // this.DoneTasks(item);
            }}
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
            <View style={{ marginLeft: 14 }}>
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
        </View>
      </Swipeout>
    );
  };

  DoneTasks(item) {
    console.log('item', item);
    let DateTime = GetTime(item.datetime, '').split('+')[0];
    console.log('DateTime', DateTime);

    axios
      .put(`todos/task/${item.id}/update/`, {
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
    // console.log('index', index);
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
                .delete(`todos/habit/${item.id}/`)
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
            onLongPress={() => {
              this.state.open == 'day'
                ? this.setState({
                  indDrax: 2,
                  visible: true,
                })
                : null;
            }}
            activeOpacity={0.8}
            onPress={() => {
              (item.done = !item.done), this.DoneHabits(item);
            }}>
            {item?.purpose ? (
              PurposeIcon
            ) : item?.priority ? (
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
            style={{ flex: 1, justifyContent: 'center' }}
            onPress={() => {
              // (item.done = !item.done), this.DoneHabits(item);
              this.setState({
                modelHabits: item,
              });
            }}
            key={index}>
            <Text
              style={{
                marginLeft: 14,
                fontSize: 15,
                textDecorationLine: item.done ? 'line-through' : 'none',
                color: item.done ? '#8E8E93' : '#000',
              }}>
              {item.label}
            </Text>
          </TouchableOpacity>
        </View>
      </Swipeout>
    );
  };

  DoneHabits(item) {
    console.log('item', item);

    if (!item.done) {
      console.log('week_day_ids:', item.week_day_ids);

      axios
        .put(`todos/habit/${item.id}/update/`, {
          label: item.label,
          time: item.time,
          week_day_ids: item.week_day_ids,
          is_purpose: item.is_purpose,
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
        date: GetTime(new Date(), 'YYYY-MM-DD'),
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
      const procentDone = parseInt(
        ((todos[0].doneTasksCount + todos[0].doneHabitsCount) * 100) /
        (todos[0].tasks.length + todos[0].habits.length),
      );
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
            markedDate={['2022-05-04']}
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
      now,
      visible,
      dataDrax,
      rContent,
      habbits,
      tasks,
    } = this.state;

    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#fff',
          paddingTop: getStatusBarHeight,
        }}>
        <StatusBar backgroundColor={'#fff'} barStyle="dark-content" />
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
                  firstDay={1}
                  theme={{
                    todayTextColor: '#FF3B30',
                  }}
                  markingType={'custom'}
                  // markedDates={this.state.calendarData}
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
            <FlatList
              data={todos}
              keyExtractor={(item, index) => index.toString()}
              renderItem={this.renderItem}
              showsVerticalScrollIndicator={false}
            />

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
              </View>
            </ModalBox>
            <TouchableOpacity
              onPress={() => this.mdlRef.open()}
              activeOpacity={0.7}
              style={styles.btnStl}>
              {PluseBtn}
            </TouchableOpacity>
          </View>
        </View>

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
    backgroundColor: '#9B8274',
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
