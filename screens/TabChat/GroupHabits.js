import React, { useEffect, useRef, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ChatHeader from '../../Component/ChatHeader';
import GeneralStatusBarColor from '../../Component/GeneralStatusBarColor';
import { strings } from '../../Localization/Localization';
import { Done, addHabitsIcon, swipeDelete, threeDot } from '../../Component/MyIcons';
import axios from 'axios';
import ItemHabitUser from './ItemHabitUser';
import Swipeout from '../../Swipeout';
import { getTemplateLabel } from '../../Component/Component';
import GroupHabitAdd from './GroupHabitAdd';

const GroupHabits = ({ navigation, route }) => {

    const group_id = route.params.group_id


    const [response, setResponse] = useState(null)
    const [isLoading, setLoading] = useState(true)
    const [addVisible, setAddVisible] = useState(false)
    const [targetArr, setTargetArr] = useState([])



    const input1 = useRef();
    const input2 = useRef();
    const [label, setLabel] = useState(null)
    const [desc, setDesc] = useState(null)
    const [fine, setFine] = useState(false)
    const [finesArray, setFinesArray] = useState([])


    useEffect(() => {
        getData()
        getTarget()
    }, []);


    const addHabit = (habit) => {
        console.log('habithabit', habit);


        axios.post(`https://test.kemeladam.kz/api/chat/group/${group_id}/habits/`, habit)
            .then((response) => {
                console.log('habithabit response', response)
                getData()
            })
            .catch((error) => {
                console.log('habithabit error', error)

            })

    }


    const getTarget = () => {
        axios.get('todos/target-templates/')
            .then((response) => {
                console.log('templates response', response)

                let Arra = response.data
                for (let index = 0; index < Arra.length; index++) {
                    const element = Arra[index];
                    element.template = getTemplateLabel(element.template)
                }

                console.log('ArraArra', Arra)


                setTargetArr(Arra)

            })
            .catch((error) => {

            })



        axios.get(`https://test.kemeladam.kz/api/chat/fines/`)
            .then((response) => {
                console.log('fines response', response)
                setFinesArray(response?.data)
            })
            .catch((error) => {
                console.log('fines error', error?.response)

            })

    }


    const getData = (date) => {
        setLoading(true)

        axios.get(`https://test.kemeladam.kz/api/chat/group/${group_id}/habits/`)
            .then(response => {
                console.log("RESPONSE habits:", response);
                setResponse(response.data.results)
                setLoading(false)

            })
            .catch(error => {
                console.log("error habits:", error.response);
            })

    }


    const renderItemHabits = ({ item, index }) => {
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
                    >
                        {item?.priority ? (
                            Priority
                        ) : item?.done ? (
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
                                textDecorationLine: item?.done ? 'line-through' : 'none',
                                color: item?.done ? '#8E8E93' : '#000',
                            }}>
                            {item.label}
                        </Text>
                        {item?.purpose ? <Text style={{ color: '#2BA149', fontSize: 16 }}>{item?.target_value ? item?.target_value.value : 0} {item?.target_template ? getTemplateLabel(item?.target_template.template) : null}</Text>
                            :
                            null}
                    </TouchableOpacity>
                    {/* 
                    <TouchableOpacity
                        onPress={() => {

                        }}

                        style={{ height: 40, justifyContent: 'center', alignItems: 'flex-end', width: 40, }}
                    >
                        {threeDot}
                    </TouchableOpacity> */}

                </View>
            </Swipeout>
        )
    }



    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <GeneralStatusBarColor backgroundColor={"white"} />


            <ChatHeader
                onLeftPress={() => navigation.goBack()}
                childComponent={(
                    <View
                        style={{ flex: 1, alignItems: 'center' }}>
                        <Text style={{ fontSize: 16, fontWeight: '600', color: '#000000' }}>Өзгерту</Text>
                    </View>
                )}
                rightSvg
                right_icon={addHabitsIcon}
                onRightPress={() => {
                    setAddVisible(true)
                }}

            />

            <View style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={response}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderItemHabits}
                />
            </View>




            {
                addVisible ?
                    <GroupHabitAdd
                        visible={addVisible}
                        setVisible={setAddVisible}
                        targetArr={targetArr}
                        addHabit={addHabit}
                    />
                    :
                    null
            }

        </View>
    )
}

export default GroupHabits;


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
})