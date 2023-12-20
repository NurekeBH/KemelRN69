import axios from 'axios';
import React, { Component } from 'react';
import {
    View,
    FlatList,
    StyleSheet,
    Text,
    SafeAreaView,
    ScrollView,
    ActivityIndicator,
    TouchableOpacity,
    Dimensions,
    TextInput,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Header from '../../Component/Header2';
import DatePicker from 'react-native-date-picker';

import {
    Bottom,
    Check,
    closeIcon,
    Done,
    PluseBtn,
    statusIcon,
    swipeDelete,
    Up,
    WeekIcon,
} from '../../Component/MyIcons';
import { strings } from '../../Localization/Localization';

import { getLabelGoal, getLang, width } from '../../Component/Component';
import Collapsible from 'react-native-collapsible';
import Modal from 'react-native-modalbox';
import Swipeout from '../../Swipeout/index';
import moment from 'moment';
import { GetGoalById, InsertQueryGoals } from '../../database/KemelSQLite';
import NetInfo from "@react-native-community/netinfo";
import { replaceNullWithSpace } from '../../Component/NullWithSpace';

export default class MattersGoals extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            goalCate: [],
            doneGoal: [],
            processGoal: [],

            allCount: 0,
            doneCount: 0,
            processCount: 0,
            notDoneCount: 0,

            isOpenGoal: false,
            isOpenDoneGoal: false,
            isOpenprocessGoal: false,

            openModal: false,
            modalItem: null,

            label: '',
            desc: '',
            fromDate: '',
            toDate: '',
            modalStatus: null,

            datetime: new Date(),
            open: false,

            datetime2: new Date(),
            open2: false

        };
        this.category_id = props.route.params?.category_id;
        this.section_id = props.route.params?.section_id;
        this.Title = props.route.params?.label;
    }

    componentDidMount() {
        this.unsubscribeNet = NetInfo.addEventListener(async state => {
            console.log('state state state', state)

            if (state.isConnected) {
                this.GetGoal();
            } else {
                let goals = await GetGoalById(this.category_id)

                console.log('goalCate', goals)



                let arrTasks = replaceNullWithSpace(goals._array);

                console.log('arrTasks', arrTasks)

                let DoneTasks = arrTasks.filter(item => item.status == 2);
                let processGoal = arrTasks.filter(item => item.status == 1);
                let NotDoneTasks = arrTasks.filter(item => item.status == null);

                this.setState({
                    goalCate: NotDoneTasks,
                    doneGoal: DoneTasks,
                    processGoal: processGoal,

                    isLoading: false,
                    allCount: arrTasks.length,
                    doneCount: DoneTasks.length,
                    processCount: processGoal.length,
                    notDoneCount: NotDoneTasks.length,

                    openModal: false,
                    modalItem: null,
                    label: '',
                    desc: '',
                    fromDate: '',
                    toDate: '',
                });

            }
        })

    }

    GetGoal() {
        axios
            .get(
                `goals/goal/?section_id=${this.section_id}&category_id=${this.category_id}`,
            )
            .then(response => {
                console.log('RESPONSE goals/goal:', response);

                let arrTasks = response.data;


                arrTasks.forEach(element => {
                    element.dessc = element.desc
                    element.category_id = element.category
                    element.statuss = element.status
                });


                InsertQueryGoals(arrTasks)



                let DoneTasks = arrTasks.filter(item => item.status == 2);
                let processGoal = arrTasks.filter(item => item.status == 1);
                let NotDoneTasks = arrTasks.filter(item => item.status == null);

                this.setState({
                    goalCate: arrTasks,
                    doneGoal: DoneTasks,
                    processGoal: processGoal,

                    isLoading: false,
                    allCount: arrTasks.length,
                    doneCount: DoneTasks.length,
                    processCount: processGoal.length,
                    notDoneCount: NotDoneTasks.length,

                    openModal: false,
                    modalItem: null,
                    label: '',
                    desc: '',
                    fromDate: '',
                    toDate: '',
                });
            })
            .catch(error => {
                console.log('RESPONSE  goals/goal333:', error.response);
                this.setState({
                    isLoading: false,
                });
            });
    }

    renderItem(item, index) {
        return (
            <Swipeout
                key={item + index}
                autoClose={true}
                style={{
                    borderRadius: 6,
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
                                .delete(`goals/goal/${item.id}/`)
                                .then(response => {
                                    console.log('RESPONSE goal:', response);

                                    this.GetGoal();
                                })
                                .catch(error => {
                                    console.log('RESPONSE goal:', error.response);
                                    if (error.response && error.response.status == 401) {
                                        showToast('error', error.response.data.detail);
                                    }
                                });
                        },
                    },
                ]}>
                <View key={index} style={[styles.vwStl, { paddingVertical: 8 }]}>
                    <TouchableOpacity
                        onPress={() => {
                            this.setState({
                                modalItem: item,
                                label: item.label,
                                desc: item.dessc,
                                fromDate: item.date_from,
                                toDate: item.date_to,
                            });

                            let doneiItem = item
                            if (item.status === 2) {
                                doneiItem.status = 1
                            } else {
                                doneiItem.status = 2
                            }
                            this.onDoneTasks(doneiItem)

                        }}
                        activeOpacity={0.8}
                        key={index}
                        style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
                        {item.status == 2 ? (
                            <View style={styles.doneStl}>{Done}</View>
                        ) : (
                            <View
                                style={[
                                    styles.doneStl2,
                                    {
                                        borderColor: 'rgba(0,0,0,0.5)',
                                    },
                                ]}
                            />
                        )}
                        <View style={{ flex: 1, marginLeft: 14 }}>
                            <Text
                                style={{
                                    fontSize: 15,
                                    textDecorationLine: item.status == 2 ? 'line-through' : 'none',
                                    color: item.status == 2 ? '#8E8E93' : '#000',
                                }}>
                                {item.label}
                            </Text>
                            {/* <Text
                                style={{
                                    fontSize: 13,
                                    marginTop: 2,
                                    color: 'rgba(0,0,0,0.7)',
                                }}>{item.date_from ? (item.date_from + ' - ' + item.date_to) : null}</Text> */}


                        </View>

                    </TouchableOpacity>
                </View>
            </Swipeout>
        );
    }

    onDoneTasks(item) {
        console.log(' MODAL item', item);

        axios
            .put(`goals/goal/${item.id}/`, {
                label: item.label,
                category: item.category,
                section: item.section,
                author: item.author,
                status: item.status,
                date_from: item.date_from,
                date_to: item.date_to,
                desc: item.dessc,
            })
            .then(response => {
                console.log('RESPONSE put:', response);
                this.GetGoal();
            })
            .catch(error => {
                this.setState({
                    isLoading: false,
                    openModal: false,
                    modalItem: null,
                    label: '',
                    desc: '',
                    fromDate: '',
                    toDate: '',
                    modalStatus: null,
                });
                console.log('RESPONSE put:', error.response);
                if (error.response && error.response.status == 401) {
                    showToast('error', error.response.data.detail);
                }
            });
    }

    updateData = () => {
        this.GetGoal();
    };

    render() {
        const {
            isLoading,
            goalCate,
            doneGoal,
            processGoal,
            allCount,
            doneCount,
            processCount,
            notDoneCount,
            openModal,
            modalItem,
            modalStatus,
            open,
            open2,
            datetime,
            datetime2,
            fromDate,
            toDate,
        } = this.state;
        const procentDone = allCount == 0 ? 0 : parseInt((doneCount * 100) / allCount);


        return (
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
                    <Header
                        title={getLabelGoal(this.Title)}
                        onLeftPress={() => this.props.navigation.goBack()}
                    />
                    {isLoading ? <ActivityIndicator color={'white'} /> : null}

                    <ScrollView style={{ backgroundColor: 'white', flex: 1 }}>
                        {/* <View
                            style={{
                                paddingHorizontal: 16,
                                paddingVertical: 10,
                                borderRadius: 6,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                backgroundColor: 'white',
                            }}>
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
                                    {doneCount}
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
                                        {doneCount}/{allCount}
                                    </Text>
                                </View>
                                <View
                                    style={{
                                        backgroundColor: '#EBEBF0',
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
                        </View> */}

                        {/* <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                paddingRight: 22,
                            }}>
                            <Text
                                style={{
                                    fontSize: 17,
                                    color: '#232857',
                                    fontWeight: '600',
                                    marginHorizontal: 16,
                                    marginTop: 16,
                                    marginBottom: 8,
                                    flex: 1,
                                }}>
                                {strings.mygoals}
                            </Text>
                        </View> */}

                        <View style={{ marginHorizontal: 16 }}>
                            {goalCate.map((item, index) => {
                                return this.renderItem(item, index);
                            })}
                        </View>


                        {/* <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                paddingRight: 22,
                            }}>
                            <Text
                                style={{
                                    fontSize: 17,
                                    color: '#232857',
                                    fontWeight: '600',
                                    marginHorizontal: 16,
                                    marginTop: 16,
                                    marginBottom: 8,
                                    flex: 1,
                                }}>
                                {strings.process}
                            </Text>
                            </View>

                       <View style={{ marginHorizontal: 16 }}>
                            {processGoal.map((item, index) => {
                                return this.renderItem(item, index);
                            })}
                        </View>
                      
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                paddingRight: 22,
                            }}>
                            <Text
                                style={{
                                    flex: 1,
                                    fontSize: 17,
                                    color: '#232857',
                                    fontWeight: '600',
                                    marginHorizontal: 16,
                                    marginTop: 16,
                                    marginBottom: 8,
                                }}>
                                {strings.done}
                            </Text>
                         </View>

                        <View style={{ marginHorizontal: 16 }}>
                            {doneGoal.map((item, index) => {
                                return this.renderItem(item, index);
                            })}
                        </View> */}

                    </ScrollView>

                    <TouchableOpacity
                        onPress={() =>
                            this.props.navigation.navigate('AddMatterGoal', {
                                category_id: this.category_id,
                                section_id: this.section_id,
                                label: this.Title,
                                updateData: this.updateData,
                                isMatter: true
                            })
                        }
                        activeOpacity={0.7}
                        style={{
                            margin: 16,
                            alignSelf: 'flex-end',
                            width: 56,
                            aspectRatio: 1,
                            borderRadius: 28,
                            backgroundColor: '#3F49DC',
                            justifyContent: 'center',
                            alignItems: 'center',

                        }}>
                        {PluseBtn}
                    </TouchableOpacity>
                </SafeAreaView>




                <Modal
                    position="bottom"
                    backButtonClose
                    isOpen={openModal}
                    onClosed={() => {
                        this.setState({
                            modalItem: null,
                            label: '',
                            desc: '',
                            fromDate: '',
                            toDate: '',
                            modalStatus: null,
                            openModal: false,
                        });
                    }}
                    style={{
                        backgroundColor: 'white',
                        borderTopRightRadius: 12,
                        borderTopLeftRadius: 12,
                        height: Dimensions.get('window').height / 2,
                    }}>
                    <TouchableOpacity
                        onPress={() => {
                            this.onDoneTasks(modalItem);
                        }}
                        style={{ alignItems: 'flex-end', paddingRight: 16, paddingTop: 16 }}>
                        <Text
                            style={{ fontSize: 17, fontWeight: '600', color: '#3F49DC' }}>
                            {strings.save}</Text>
                    </TouchableOpacity>
                    {modalItem ? (
                        <View style={{ paddingHorizontal: 16 }}>

                            <TextInput
                                style={{
                                    fontSize: 17, fontWeight: '500', color: 'black'
                                }}
                                placeholderTextColor="#D1D1D6"
                                multiline
                                placeholder={strings.goalTitle}
                                onChangeText={label => {
                                    this.setState({
                                        label
                                    })
                                }}
                                value={this.state.label}
                                returnKeyType="next"
                            />


                            <TextInput
                                style={{
                                    fontSize: 14,
                                    fontWeight: '400',
                                    marginTop: 8
                                }}
                                placeholderTextColor="#D1D1D6"
                                multiline
                                placeholder={strings.goalDesc}
                                onChangeText={desc => {
                                    this.setState({
                                        desc
                                    })
                                }}
                                value={this.state.desc}
                                returnKeyType="next"
                            />


                            <Text style={{ marginTop: 16, fontSize: 14, color: '#8E8E93' }}>
                                {strings.changeStatus}
                            </Text>
                            {/* <TouchableOpacity
                                onPress={() => {
                                    if (modalStatus != null) {
                                        // this.onDoneTasks(modalItem, null);
                                        this.setState({
                                            modalStatus: null
                                        })
                                    }
                                }}
                                style={{
                                    marginVertical: 16,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}>
                                {modalStatus == null ? (
                                    Check
                                ) : (
                                    <View
                                        style={{
                                            width: 20,
                                            height: 20,
                                            borderRadius: 10,
                                            borderColor: '#DADADA',
                                            borderWidth: 1,
                                        }}
                                    />
                                )}
                                <Text style={{ marginLeft: 8, color: 'black', }}>{strings.mygoals}</Text>
                            </TouchableOpacity> */}
                            <View
                                style={{
                                    width: '100%',
                                    height: 0.5,
                                    backgroundColor: '#DADADA',
                                }}
                            />
                            <TouchableOpacity
                                style={{
                                    marginVertical: 16,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}
                                onPress={() => {
                                    if (modalStatus != 1) {
                                        // this.onDoneTasks(modalItem, 1);
                                        this.setState({
                                            modalStatus: 1
                                        })
                                    }
                                }}>
                                {modalStatus == 1 ? (
                                    Check
                                ) : (
                                    <View
                                        style={{
                                            width: 20,
                                            height: 20,
                                            borderRadius: 10,
                                            borderColor: '#DADADA',
                                            borderWidth: 1,
                                        }}
                                    />
                                )}
                                <Text style={{ marginLeft: 8, color: 'black', }}>{strings.process}</Text>
                            </TouchableOpacity>

                            <View
                                style={{
                                    width: '100%',
                                    height: 0.5,
                                    backgroundColor: '#DADADA',
                                }}
                            />
                            <TouchableOpacity
                                style={{
                                    marginVertical: 16,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}
                                onPress={() => {
                                    if (modalStatus != 2) {
                                        // this.onDoneTasks(modalItem, 2);
                                        this.setState({
                                            modalStatus: 2
                                        })
                                    }
                                }}>
                                {modalStatus == 2 ? (
                                    Check
                                ) : (
                                    <View
                                        style={{
                                            width: 20,
                                            height: 20,
                                            borderRadius: 10,
                                            borderColor: '#DADADA',
                                            borderWidth: 1,
                                        }}
                                    />
                                )}
                                <Text style={{ color: 'black', marginLeft: 8 }}>{strings.done}</Text>
                            </TouchableOpacity>
                            <View
                                style={{
                                    width: '100%',
                                    height: 0.5,
                                    backgroundColor: '#DADADA',
                                }}
                            />
                        </View>
                    ) : null}
                </Modal>






                <Modal
                    position="bottom"
                    backButtonClose
                    isOpen={open}
                    onClosed={() => {
                        this.setState({
                            open: false
                        })
                    }}
                    style={{
                        backgroundColor: '#F2F2F7',
                        height: 'auto',
                    }}
                >
                    <View style={{ alignItems: 'center', justifyContent: 'flex-end', marginBottom: 40 }}>
                        <DatePicker
                            locale={getLang()}
                            mode="date"
                            textColor={"black"}
                            theme={"light"}
                            is24hourSource="locale"
                            date={datetime}
                            onDateChange={date => {
                                this.setState({
                                    datetime: date,
                                    fromDate: moment(date).format('DD.MM.YYYY')
                                })

                            }}
                        />
                        <TouchableOpacity
                            onPress={() => {
                                this.setState({
                                    open: false,
                                    fromDate: moment(datetime).format('DD.MM.YYYY')
                                })


                            }}
                        >
                            <Text style={{ color: '#3F49DC', fontSize: 16, textAlign: 'center', fontWeight: '600' }}>OK</Text>
                        </TouchableOpacity>
                    </View>

                </Modal>


                <Modal
                    position="bottom"
                    backButtonClose
                    isOpen={open2}
                    onClosed={() => {
                        this.setState({
                            open2: false,
                        })
                    }}
                    style={{
                        backgroundColor: '#F2F2F7',
                        height: 'auto',
                    }}
                >
                    <View style={{ alignItems: 'center', justifyContent: 'flex-end', marginBottom: 40 }}>
                        <DatePicker
                            locale={getLang()}
                            mode="date"
                            textColor={"black"}
                            theme={"light"}
                            is24hourSource="locale"
                            date={datetime2}
                            onDateChange={date => {
                                this.setState({
                                    open2: false,
                                    toDate: moment(date).format('DD.MM.YYYY'),
                                })

                            }}
                        />
                        <TouchableOpacity
                            onPress={() => {
                                this.setState({
                                    open2: false,
                                    toDate: moment(datetime2).format('DD.MM.YYYY'),
                                })


                            }}
                        >
                            <Text style={{ color: '#3F49DC', fontSize: 16, textAlign: 'center', fontWeight: '600' }}>OK</Text>
                        </TouchableOpacity>
                    </View>

                </Modal>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    vwStl: {
        paddingHorizontal: 14,
        borderRadius: 6,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'white',
        borderBottomWidth: 0.5,
        borderBottomColor: 'rgba(0,0,0,0.2)',

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
});
