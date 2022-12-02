import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { Component } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, ActivityIndicator, FlatList, StyleSheet } from 'react-native';
import { GetTime, Header2, HeaderStyle, showToast, width } from '../Component/Component';
import { alarmIcon, clock, LeftIcon, Left_icon, swipeDelete, threeDot } from '../Component/MyIcons';
import moment from 'moment';
import Swipeout from '../Swipeout';
import { strings } from '../Localization/Localization';
import { colorApp } from '../theme/Colors';
import ModalTasks from './Tab1/ModalTasks';
import SoundPlayer from 'react-native-sound-player';
import * as Animatable from 'react-native-animatable';

export default class Unfulfilled_tasks extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tasks: [],
            isLoading: true,
            modelItem: null,
            date: this.props.route?.params?.date ? moment(this.props.route?.params?.date).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'),
            title: this.props.route?.params?.title,
            id: this.props.route?.params?.id,
            ReminderArr: [],
        };
        console.log('this.props.route?.params?.date', this.props.route?.params?.date)
    }

    componentDidMount() {


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

        this.GetReminder()
    }



    GetReminder() {
        axios
            .get(`todos/reminders/`)
            .then(response => {
                console.log('RESPONSE reminder:', response);
                this.setState({
                    isLoadingReminder: false,
                    ReminderArr: response.data
                })
            })
            .catch(error => {
                console.log('RESPONSE error:', error.response);
                if (error.response && error.response.status == 401) {
                    showToast('error', error.response.data.detail);
                }
            })
            .finally(() => {
                this.GetTasks()
            })
    }


    GetTasks() {
        axios.get('todos/tasks/?done=false&ordering=-datetime&datetime=' + this.state.date)
            .then(response => {
                console.log('RESPONSE todos:', response);

                let Arr = response.data
                let NewArr = []
                let k = 0
                console.log('this.state.id', this.state.id)
                if (this.state.id) {
                    Arr.forEach(element => {
                        if (element.id == this.state.id) {
                            NewArr[k] = element
                            k++
                        }
                    });

                } else {
                    NewArr = response.data
                }

                this.setState({
                    tasks: NewArr,
                    isLoading: false
                })

            })
            .catch(error => {
                this.setState({

                    isLoading: false
                })
            })

    }

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

                this.GetTasks();
            })
            .catch(error => {
                console.log('RESPONSE put:', error.response);
                if (error.response && error.response.status == 401) {
                    showToast('error', error.response.data.detail);
                }
            });
    }



    renderItem = ({ item, index }) => {
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

                                    this.GetTasks();
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
                    {
                        this.state.id ?
                            <Animatable.View animation="shake" >
                                {alarmIcon}
                            </Animatable.View>
                            :
                            null
                    }


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
        )
    }


    RefreshModal = (modelItem, isSave, isSaveZametka, zametka) => {
        if (isSave) {
            this.DoneTasks(modelItem);
        }
        this.setState({
            modelItem: null,
        });
    };
    PlaySound() {
        try {
            console.log('pppppppp');

            SoundPlayer.playSoundFile('sound', 'mp3');
        } catch (e) {
            console.log(`cannot play the sound file`, e);
        }
    }


    render() {
        const { isLoading, tasks, modelItem, title, ReminderArr } = this.state
        return (
            <View style={{ backgroundColor: 'white', flex: 1 }}>
                <SafeAreaView style={{ flex: 1 }}>
                    <View style={HeaderStyle}>
                        <TouchableOpacity
                            onPress={() => this.props.navigation.goBack()}
                            activeOpacity={0.7}>
                            {Left_icon}
                        </TouchableOpacity>
                        <Text style={{ flex: 1, textAlign: 'center', fontWeight: '500', fontSize: 16 }} numberOfLines={1}>{title}</Text>

                    </View>
                    <View style={{ flex: 1 }}>
                        {
                            isLoading ?
                                <ActivityIndicator />
                                :
                                <FlatList
                                    data={tasks}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={this.renderItem}
                                    showsVerticalScrollIndicator={false}
                                />
                        }
                    </View>

                </SafeAreaView>


                {modelItem ? (
                    <ModalTasks
                        isOpen={modelItem}
                        folderData={this.state.folderData}
                        modelItemData={modelItem}
                        RefreshModal={this.RefreshModal}
                        ReminderArr={ReminderArr}
                    />
                ) : null}


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