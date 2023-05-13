import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, SafeAreaView, StatusBar, TouchableOpacity } from 'react-native';
import { Text, View } from 'react-native';
import Header from '../../Component/Header2';
import { strings } from '../../Localization/Localization';
import ChatHeader from '../../Component/ChatHeader';
import FastImage from 'react-native-fast-image';
import { PluseBtn, chatFatIcon, moreMenu, userSelected } from '../../Component/MyIcons';
import ItemHabitUser from './ItemHabitUser';
import GeneralStatusBarColor from '../../Component/GeneralStatusBarColor';
import axios from 'axios';
import moment from 'moment';

const DetailChat = ({ navigation, route }) => {




    const [dataArray, setDataArray] = useState([])
    const [response, setResponse] = useState(null)
    const [isLoading, setLoading] = useState(true)
    const [selected, setSelected] = useState(0)
    const today = moment().format('YYYY-MM-DD')

    const item = route.params.item

    const group_id = item.id

    useEffect(() => {

        const Arr = [
            {
                'name': 'Бүгін',
                'day': 0
            },
            {
                'name': 'Кеше',
                'day': 1
            },
            {
                'name': 'Апта',
                'day': 7
            },
            {
                'name': '40 күн',
                'day': 40
            },
            {
                'name': '6 ай',
                'day': 180
            },
            {
                'name': '1 жыл',
                'day': 365
            }
        ]

        setDataArray(Arr)

        getData(today)



    }, []);

    const getData = (date) => {
        setLoading(true)

        axios.get(`https://test.kemeladam.kz/api/chat/group/${group_id}/user-habits/?=`, {
            date: date
        })
            .then(response => {
                console.log("RESPONSE habits:", response);

                for (let i = 0; i < response.data.length; i++) {
                    let user = response.data[i]
                    let arrHabits = user.habits;
                    for (let j = 0; j < arrHabits.length; j++) {
                        let HAB = arrHabits[j]

                        HAB.done = false;
                        if (HAB.history && HAB.history.date === date) {
                            HAB.done = HAB.history.done;
                        } else {
                            HAB.done = false;
                        }
                    }
                    let DoneHabits = arrHabits.filter(item => item.done === true).length;
                    user.doneHabitsCount = DoneHabits
                }



                setLoading(false)
                setResponse(response.data)




            })
            .catch(error => {
                console.log("error habits:", error.response);
            })



    }


    const renderItem = ({ item, index }) => {
        return (
            <TouchableOpacity
                onPress={() => {
                    console.log('dddd', item.day)
                    console.log(moment().subtract(item.day, 'd').format('YYYY-MM-DD'))
                    setSelected(index)
                    getData(moment().subtract(item.day, 'd').format('YYYY-MM-DD'))
                }}
                style={[{
                    paddingHorizontal: 16,
                    paddingVertical: 6,
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: selected == index ? 'white' : null,
                    borderRadius: selected == index ? 8 : 0
                },
                selected == index ?
                    {
                        shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: 0,
                        },
                        shadowOpacity: 0.25,
                        shadowRadius: 1.84,
                        elevation: 3,
                    } : null
                ]}>
                <View style={{}}>
                    <Text style={{ color: '#000', fontSize: 15 }}>{item.name}</Text>
                </View>
            </TouchableOpacity>
        )
    }


    const donePress = (item) => {
        console.log('item done', item)
        let params = {
            "date": today,
            "done": true
        }
        axios.post(`https://test.kemeladam.kz/api/chat/group/${group_id}/habit/${item.id}/history/`,
            params)
            .then(response => {
                console.log("RESPONSE done:", response);
                getData(today)
            })
            .catch(error => {
                console.log("error done:", error.response);
            })
    }

    const renderItemHabits = ({ item, index }) => {
        return (
            <View>
                <ItemHabitUser
                    item={item}
                    isSelected={item?.selected}
                    dataArray={dataArray}
                    donePress={donePress}
                />
            </View>
        )
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
            <GeneralStatusBarColor backgroundColor={"white"} />


            <ChatHeader
                onLeftPress={() => navigation.goBack()}
                childComponent={(
                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate('GroupProfile', { group_id: group_id })
                        }}
                        style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <FastImage
                            style={{
                                width: 30,
                                height: 30,
                                borderRadius: 15
                            }}
                            source={response?.cover ? { uri: response?.cover } : require('../../assets/logo.png')}
                        />
                        <View style={{ marginLeft: 8 }}>
                            <Text style={{ fontSize: 16, fontWeight: '600', color: '#000000' }}>{item?.label}</Text>
                            <Text style={{ fontSize: 12, color: '#8A8A8D', fontWeight: '400' }}>{strings.infogroup}</Text>
                        </View>
                    </TouchableOpacity>
                )}
                right_icon={moreMenu}
                rightSvg
                onRightPress={() => {
                    navigation.navigate('GroupProfile', { group_id: group_id })
                }}
            />

            <View style={{ flex: 1 }}>
                <View style={{ backgroundColor: 'white', padding: 15 }}>
                    <View
                        style={{
                            backgroundColor: '#F2F2F7',
                            borderRadius: 8,
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: 2
                        }}
                    >
                        <FlatList
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            data={dataArray}
                            keyExtractor={(item, index) => index.toString()}
                            showsVerticalScrollIndicator={false}
                            renderItem={renderItem}
                        />
                    </View>
                </View>

                {
                    isLoading ?
                        <View style={{ margin: 24 }}>

                            <ActivityIndicator color={'#3F49DC'} />
                        </View>
                        :
                        <View style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
                            <FlatList
                                showsVerticalScrollIndicator={false}
                                data={response}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={renderItemHabits}
                            />
                        </View>

                }


            </View>



            <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => {
                    navigation.navigate('ChatMessage')
                }}
                style={{ position: 'absolute', right: 24, bottom: 40, alignItems: 'center', justifyContent: 'center', width: 64, height: 64, backgroundColor: '#3F49DC', borderRadius: 32 }}>
                {chatFatIcon}
            </TouchableOpacity>


        </View>
    )
}

export default DetailChat;
