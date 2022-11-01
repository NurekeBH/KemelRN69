/* eslint-disable react-native/no-inline-styles */
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
    ScrollView,
} from 'react-native';
import {
    ButtonClass,
    Header2,
    HeaderStyle,
    width,
} from '../../Component/Component';
import {
    Alish,
    Bottom,
    Calendars,
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
} from '../../Component/MyIcons';
import LinearGradient from 'react-native-linear-gradient';
import { getStatusBarHeight } from '../../Component/getStatusBarHeight';
import { strings } from '../../Localization/Localization';
import Collapsible from 'react-native-collapsible';
import Modal from 'react-native-modalbox';
import { DraxProvider, DraxList, DraxView } from 'react-native-drax';
import { colorApp } from '../../theme/Colors';
import FastImage from 'react-native-fast-image';
import * as Animatable from 'react-native-animatable';
import axios from 'axios';

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
            modal: false,
            ind: 0,
            mdlActive: false, //Example
            priority: true,
            tasks: [],
            habits: [],
            todos: []
        };
    }

    componentDidMount() {
        this.getTodoList();
    }

    getTodoList() {
        axios
            .get('todos/tasks/?open=day&date=2022-01-31')
            .then(response => {
                console.log('RESPONSE getTodoList:', response);

                this.setState({
                    todos: response.data.todos,
                    tasks: response.data.todos.tasks,
                    habits: response.data.todos.habits,
                    isLoading: false,
                });
            })
            .catch(error => {
                this.setState({
                    isLoading: false,
                });
                console.log('RESPONSE error:', error.response);
                if (error.response && error.response.status == 401) {
                    showToast('error', error.response.data.detail);
                }
            });
    }

    renderItem1 = ({ item, index }) => (
        <View style={{ marginBottom: 30 }}>
            <Text
                style={{
                    fontSize: 17,
                    fontWeight: '600',
                    color: '#fff',
                    marginBottom: 11,
                }}>
                Бс, 28 Ақпан
            </Text>
            <View style={styles.vwStl}>
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}>
                    <Text style={{ fontSize: 32, fontWeight: '500', color: '#272727' }}>
                        {item.arr.length}
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
                        <Text style={{ fontSize: 12, color: '#8A8FA0' }}>72%</Text>
                        <Text style={{ fontSize: 12, color: '#8A8FA0' }}>5/12</Text>
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
                                width: '72%',
                                height: 8,
                                backgroundColor: '#232857',
                                borderRadius: 8,
                            }}
                        />
                    </View>
                </View>
            </View>
            {item.arr.map((item1, index1) => (
                <TouchableOpacity
                    onPress={() => {
                        (item1.active = !item1.active), this.setState({});
                    }}
                    activeOpacity={0.8}
                    key={index1}
                    style={[
                        styles.vwStl,
                        {
                            paddingVertical: 12,
                            backgroundColor:
                                index1 == 2 ? '#FF3B30' : item1.active ? '#F2F2F7' : '#fff',
                        },
                    ]}>
                    {item1.active ? (
                        <View style={styles.doneStl}>{Done}</View>
                    ) : (
                        <View
                            style={[
                                styles.doneStl2,
                                {
                                    borderColor: index1 == 2 ? '#fff' : '#DADADA',
                                },
                            ]}
                        />
                    )}
                    <Text
                        style={{
                            marginLeft: 14,
                            fontSize: 15,
                            flex: 1,
                            textDecorationLine: item1.active ? 'line-through' : 'none',
                            color: item1.active ? '#8E8E93' : index1 == 2 ? '#fff' : '#000',
                        }}>
                        Жобанын концепциясын
                    </Text>
                </TouchableOpacity>
            ))}
            <View
                style={{
                    backgroundColor: '#E2F6E7',
                    borderRadius: 8,
                }}>
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => {
                        (item.collap = !item.collap), this.setState({});
                    }}
                    style={[
                        styles.vwStl,
                        {
                            backgroundColor: '#E2F6E7',
                            paddingVertical: 13,
                            marginBottom: 0,
                        },
                    ]}>
                    <Text style={{ fontSize: 17, fontWeight: '600' }}>Әдеттер</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ fontSize: 12, color: '#8A8FA0', marginRight: 9 }}>
                            0/5
                        </Text>
                        {Bottom}
                    </View>
                </TouchableOpacity>
                <Collapsible
                    collapsed={item.collap}
                    style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
                    {item.collapArr.map((itemColl, indexColl) => (
                        <TouchableOpacity
                            onPress={() => {
                                itemColl?.purpose || itemColl.priority
                                    ? this.purposeMdl.open()
                                    : (itemColl.active = !itemColl.active),
                                    this.setState({ priority: itemColl?.priority });
                            }}
                            activeOpacity={0.8}
                            key={indexColl}
                            style={[
                                styles.vwStl,
                                {
                                    paddingVertical: 8,
                                    backgroundColor: itemColl.active ? '#F2F2F7' : '#fff',
                                },
                            ]}>
                            {itemColl?.purpose ? (
                                PurposeIcon
                            ) : itemColl?.priority ? (
                                Priority
                            ) : itemColl.active ? (
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
                                    fontSize: 15,
                                    flex: 1,
                                    textDecorationLine: itemColl.active ? 'line-through' : 'none',
                                    color: itemColl.active ? '#8E8E93' : '#000',
                                }}>
                                {indexColl == 1 ? 'Отжимание' : 'Жобанын концепциясын'}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </Collapsible>
            </View>
        </View>
    );

    renderItem = ({ item, index }) => (
        <View style={{}}>
            {/* <Text
        style={{
          fontSize: 17,
          fontWeight: '600',
          color: '#fff',
          marginBottom: 11,
        }}>
        Бс, 28 Ақпан
      </Text> */}
            {/* <View style={styles.vwStl}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Text style={{ fontSize: 32, fontWeight: '500', color: '#272727' }}>
            5
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
            <Text style={{ fontSize: 12, color: '#8A8FA0' }}>72%</Text>
            <Text style={{ fontSize: 12, color: '#8A8FA0' }}>5/12</Text>
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
                width: '72%',
                height: 8,
                backgroundColor: '#232857',
                borderRadius: 8,
              }}
            />
          </View>
        </View>
      </View> */}
            <TouchableOpacity
                onPress={() => {
                    (item.done = !item.done), this.setState({});
                }}
                activeOpacity={0.8}
                key={index}
                style={[
                    styles.vwStl,
                    {
                        paddingVertical: 12,
                        backgroundColor: '#fff',
                    },
                ]}>
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
                <Text
                    style={{
                        marginLeft: 14,
                        fontSize: 15,
                        flex: 1,
                        textDecorationLine: item.done ? 'line-through' : 'none',
                        color: item.done ? '#8E8E93' : '#000',
                    }}>
                    {item.label}
                </Text>
            </TouchableOpacity>

            {/* <View
        style={{
          backgroundColor: '#E2F6E7',
          borderRadius: 8,
        }}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            (item.collap = !item.collap), this.setState({});
          }}
          style={[
            styles.vwStl,
            {
              backgroundColor: '#E2F6E7',
              paddingVertical: 13,
              marginBottom: 0,
            },
          ]}>
          <Text style={{ fontSize: 17, fontWeight: '600' }}>Әдеттер</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontSize: 12, color: '#8A8FA0', marginRight: 9 }}>
              0/5
            </Text>
            {Bottom}
          </View>
        </TouchableOpacity>
        <Collapsible
          collapsed={item.collap}
          style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
          {item.collapArr.map((itemColl, indexColl) => (
            <TouchableOpacity
              onPress={() => {
                itemColl?.purpose || itemColl.priority
                  ? this.purposeMdl.open()
                  : (itemColl.active = !itemColl.active),
                  this.setState({ priority: itemColl?.priority });
              }}
              activeOpacity={0.8}
              key={indexColl}
              style={[
                styles.vwStl,
                {
                  paddingVertical: 8,
                  backgroundColor: itemColl.active ? '#F2F2F7' : '#fff',
                },
              ]}>
              {itemColl?.purpose ? (
                PurposeIcon
              ) : itemColl?.priority ? (
                Priority
              ) : itemColl.active ? (
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
                  fontSize: 15,
                  flex: 1,
                  textDecorationLine: itemColl.active ? 'line-through' : 'none',
                  color: itemColl.active ? '#8E8E93' : '#000',
                }}>
                {indexColl == 1 ? 'Отжимание' : 'Жобанын концепциясын'}
              </Text>
            </TouchableOpacity>
          ))}
        </Collapsible>
      </View> */}
        </View>
    );

    updateData = () => {
        console.log('aaa', 'updateData');
        this.getTodoList();
    };

    render() {
        const { tasks, modal, ind, mdlActive, priority, habits } = this.state;
        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: '#fff',
                    paddingTop: getStatusBarHeight,
                }}>
                <StatusBar backgroundColor={'#fff'} barStyle="dark-content" />
                <View style={{ flex: 1 }}>
                    <Header2
                        rightIcon={
                            <LeftIcon
                                stroke={!modal ? '#3F49DC' : '#fff'}
                                stroke2={modal ? '#3F49DC' : '#fff'}
                            />
                        }
                        rightOnPress={() => this.setState({ modal: !modal })}
                        title={'Ақпан'}
                        navigation={this.props.navigation}
                        borderBottomBoll={false}
                    />
                    <View
                        style={{
                            backgroundColor: '#fff',
                            paddingVertical: 12,
                            paddingHorizontal: 16,
                        }}>
                        <View
                            style={{
                                height: 48,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                            <Text style={{ fontSize: 15, textAlign: 'center' }}>
                                Абзал қасиеттің бірі - еркектің сергек болғаны,Ерте тұрған
                                адамның ырысы жоғары,
                            </Text>
                        </View>
                        {/* <Animatable.View style={styles.pushStl} animation={'fadeInDown'}>
              {CircleDone}
              <Text
                style={{
                  fontSize: 15,
                  color: '#fff',
                  marginLeft: 12,
                  flex: 1,
                }}>
                Бәрекелді! Тағы 3 тапсырма қалды
              </Text>
            </Animatable.View> */}
                    </View>

                    <LinearGradient
                        colors={['#3F49DC', '#5CE3D1']}
                        start={{ x: 0.5, y: 0.5 }}
                        end={{ x: 0, y: 0 }}
                        style={{ flex: 1 }}>
                        <FlatList
                            data={tasks}
                            style={{ padding: 16 }}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={this.renderItem}
                            showsVerticalScrollIndicator={false}
                        />

                        {/* <View
              style={{
                backgroundColor: '#E2F6E7',
                borderRadius: 8,
              }}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  this.setState({});
                }}
                style={[
                  styles.vwStl,
                  {
                    backgroundColor: '#E2F6E7',
                    paddingVertical: 13,
                    marginBottom: 0,
                  },
                ]}>
                <Text style={{ fontSize: 17, fontWeight: '600' }}>Әдеттер</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ fontSize: 12, color: '#8A8FA0', marginRight: 9 }}>
                    0/5
                  </Text>
                  {Bottom}
                </View>
              </TouchableOpacity>
              <Collapsible
                collapsed={false}
                style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
                 <FlatList
                  data={tasks}
                  style={{ padding: 16 }}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={this.renderItem}
                  showsVerticalScrollIndicator={false}
                /> 
              </Collapsible>
            </View> */}

                        <Modal
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
                                    title={strings.raspr}
                                    titleColor={'#000'}
                                    icon={<LeftIcon2 stroke={'#8E8E93'} stroke2={'#fff'} />}
                                />
                                <TopModalButtonStyle
                                    title={strings.week}
                                    titleColor={'#000'}
                                    icon={<WeekIcon stroke={'#3F49DC'} stroke2={'#fff'} />}
                                />
                                <TopModalButtonStyle
                                    title={strings.month}
                                    titleColor={'#000'}
                                    icon={<MonthIcon stroke={'#fff'} stroke2={'#8E8E93'} />}
                                />
                            </View>
                        </Modal>
                        <TouchableOpacity
                            onPress={() => this.mdlRef.open()}
                            activeOpacity={0.7}
                            style={styles.btnStl}>
                            {PluseBtn}
                        </TouchableOpacity>
                    </LinearGradient>
                </View>
                <Modal
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
                        <BottomModalButtonStyle
                            onPress={() => {
                                this.mdlRef.close(), this.props.navigation.navigate('NoteAdd');
                            }}
                            title={strings.zamk}
                            icon={Nodes}
                        />
                        <BottomModalButtonStyle
                            onPress={() => {
                                this.mdlRef.close(), this.props.navigation.navigate('HabitAdd', {
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
                </Modal>
                <Modal
                    ref={e => (this.purposeMdl = e)}
                    position="bottom"
                    backButtonClose
                    style={{
                        height: 400,
                        borderTopRightRadius: 12,
                        borderTopLeftRadius: 12,
                    }}>
                    <View
                        style={{
                            flex: 1,
                            padding: 16,
                        }}>
                        <TouchableOpacity
                            onPress={() => {
                                this.setState({ mdlActive: !mdlActive });
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
                            {mdlActive ? (
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
                                    textDecorationLine: mdlActive ? 'line-through' : 'none',
                                    color: mdlActive ? '#8E8E93' : '#000',
                                }}>
                                Отжимание
                            </Text>
                        </TouchableOpacity>
                        <View style={styles.mdlVwStl2}>
                            <Text style={{ fontSize: 17 }}>{strings.vremya}</Text>
                            <Text style={{ fontSize: 17, color: '#3F49DC' }}>09:00</Text>
                        </View>
                        <View
                            style={[
                                styles.mdlVwStl2,
                                { borderBottomColor: '#fff', marginTop: 0 },
                            ]}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                {priority ? Priority : PurposeIcon}
                                <Text style={{ fontSize: 17, marginLeft: 10 }}>
                                    {priority ? 'Приоритет' : strings.maks}
                                </Text>
                            </View>
                            <Switch />
                        </View>
                        {priority ? (
                            <View style={{ maxHeight: 120 }}>
                                <TextInput
                                    placeholder={strings.zamk}
                                    style={{ fontSize: 17 }}
                                    multiline
                                    placeholderTextColor={'#8E8E93'}
                                />
                            </View>
                        ) : (
                            <View style={styles.vwStl2}>
                                <Text style={{ fontSize: 17, opacity: 0.4 }}>Күніне </Text>
                                <Text style={{ fontSize: 17 }}>50 рет</Text>
                            </View>
                        )}
                        {priority ? null : (
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
                                    onPress={() => this.setState({ ind: ind - 1 })}
                                    style={styles.btnStl2}>
                                    {Minuse}
                                </TouchableOpacity>
                                <View style={{ width: 140, alignItems: 'center' }}>
                                    <Text style={{ fontSize: 28, fontWeight: '700' }}>
                                        {this.state.ind}
                                    </Text>
                                    <Text style={{ fontSize: 13, opacity: 0.4 }}>рет</Text>
                                </View>
                                <TouchableOpacity
                                    disabled={ind == 1000}
                                    activeOpacity={0.7}
                                    onPress={() => this.setState({ ind: ind + 1 })}
                                    style={styles.btnStl2}>
                                    {Plusee}
                                </TouchableOpacity>
                            </View>
                        )}
                        <ButtonClass
                            onPress={() => this.purposeMdl.close()}
                            title={strings.save}
                            style={{
                                marginTop: 30,
                                backgroundColor: '#fff',
                                position: 'absolute',
                                bottom: 15,
                                left: 15,
                            }}
                            titleStyle={{ color: '#3F49DC' }}
                        />
                    </View>
                </Modal>
            </View>
        );
    }
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
