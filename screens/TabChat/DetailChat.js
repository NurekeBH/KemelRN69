import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, FlatList, SafeAreaView, StatusBar, TouchableOpacity } from 'react-native';
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
import { headerArr } from './ConstantChat';
import ModalHabits from '../Tab1/ModalHabits';

const DetailChat = ({ navigation, route }) => {




    const [dataArray, setDataArray] = useState([])
    const [response, setResponse] = useState(null)
    const [myInfo, setMyInfo] = useState(null)
    const [isLoading, setLoading] = useState(true)
    const [selected, setSelected] = useState(0)
    const [modelHabits, setModalHabits] = useState(null)


    const [isDone, setISDone] = useState(true)
    const today = moment().format('YYYY-MM-DD')

    const item = route.params.item

    const group_id = item.id



    useEffect(() => {


        const unsubscribe = navigation.addListener('focus', () => {


            setDataArray(headerArr)

            getData(today)
        });

        return unsubscribe;




    }, []);

    const getData = (date) => {

        setLoading(true)

        axios.get(`chat/group/${group_id}/user-habits/?date=${date}`)
            .then(response => {
                console.log("RESPONSE habits:", response);
                setResponse([])
                for (let i = 0; i < response.data.length; i++) {
                    let user = response.data[i]
                    let arrHabits = user.habits;
                    for (let j = 0; j < arrHabits.length; j++) {
                        let HAB = arrHabits[j]

                        HAB.done = false;
                        if (HAB.history && HAB.history.date === date) {
                            HAB.done = HAB.history.done
                        } else {
                            HAB.done = false;
                        }
                    }

                    if (user.owner) {
                        let info = {}
                        info.id = user.id
                        info.email = user.email
                        info.fio = user.fio
                        setMyInfo(info)
                    }
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
        let DONE = item.done
        if (selected == 0) {
            console.log('item done', item)
            let params = {
                // "date": "2023-05-13",
                "date": today,
                "done": !DONE
            }
            axios.post(`chat/group/${group_id}/habit/${item.id}/history/`,
                params)
                .then(response => {
                    console.log("RESPONSE done:", response);
                    if (response.status == 200 || response.status == 201) {
                        item.done = !DONE
                        console.log("RESPONSE done: ", !DONE);
                        getData(today)
                    }
                })
                .catch(error => {
                    console.log("error done:", error.response);
                })
        }

    }

    const renderItemHabits = ({ item, index }) => {
        return (
            <View >
                <ItemHabitUser
                    index={index}
                    group_id={group_id}
                    item={item}
                    isSelected={false}
                    dataArray={dataArray}
                    donePress={donePress}
                    menuPress={menuPress}
                />
            </View>
        )
    }

    const menuPress = (item) => {
        console.log('item', item);
        setModalHabits(item)

    }


    const RefreshHabits = (ModalHabits, isSave) => {
        console.log('isSave', isSave);
        console.log('ModalHabits', ModalHabits);
        // if (isSave) {
        //   this.DoneHabits(ModalHabits);
        // }

        setModalHabits(null)
    };


    return (
        <View style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
            <GeneralStatusBarColor backgroundColor={"white"} />


            <ChatHeader
                onLeftPress={() => navigation.goBack()}
                childComponent={(
                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate('GroupProfile', { group_id: group_id, group: item })
                        }}
                        style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <FastImage
                            style={{
                                width: 30,
                                height: 30,
                                borderRadius: 15
                            }}
                            source={item?.cover ? { uri: item?.cover } : require('../../assets/logo.png')}
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
                    navigation.navigate('GroupProfile', { group_id: group_id, group: item })
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

                        <View style={{ marginTop: 16, backgroundColor: 'white', position: 'absolute', width: '100%', top: 45, zIndex: 100 }}>

                            <ActivityIndicator color={'#3F49DC'} />
                        </View>
                        :

                        null
                }
                <View style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        data={response}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={renderItemHabits}
                    />
                </View>


            </View>

            {modelHabits ? (
                <ModalHabits
                    isOpen={modelHabits}
                    modelItemData={modelHabits}
                    RefreshModal={RefreshHabits}
                />
            ) : null}



            <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => {
                    navigation.navigate('ChatMessage', { item: item, myInfo: myInfo })
                }}
                style={{ position: 'absolute', right: 24, bottom: 40, alignItems: 'center', justifyContent: 'center', width: 64, height: 64, backgroundColor: '#3F49DC', borderRadius: 32 }}>
                {
                    item.unread_msg > 0 ?
                        <View style={{ position: 'absolute', top: 0, right: 0, marginHorizontal: 2, backgroundColor: '#FF6C6C', width: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ fontSize: 13, color: 'white' }}>{item.unread_msg}</Text>
                        </View>
                        :
                        null
                }
                {chatFatIcon}
            </TouchableOpacity>


        </View>
    )
}

export default DetailChat;
