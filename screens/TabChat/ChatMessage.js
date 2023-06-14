import React, { useEffect, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, SafeAreaView, StatusBar, TextInput, TouchableOpacity } from 'react-native';
import { Text, View } from 'react-native';
import Header from '../../Component/Header2';
import { strings } from '../../Localization/Localization';
import ChatHeader from '../../Component/ChatHeader';
import FastImage from 'react-native-fast-image';
import { PluseBtn, chatBg1, chatBg2, chatCamera, chatFatIcon, chatSend, moreMenu, userSelected } from '../../Component/MyIcons';
import ItemHabitUser from './ItemHabitUser';
import GeneralStatusBarColor from '../../Component/GeneralStatusBarColor';
import { headerArr } from './ConstantChat';

const ChatMessage = ({ navigation, route }) => {



    const item = route.params.item
    const group_id = item.id


    const [dataArray, setDataArray] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    const [selected, setSelected] = useState(0)


    useEffect(() => {




    }, []);


    const renderItem = ({ item, index }) => {
        let mine = index % 2 == 0
        return (
            <View style={{ flex: 1, alignItems: mine ? 'flex-end' : 'flex-start', padding: 16 }}>
                <View style={{ flex: 1, flexDirection: 'row', }}>

                    {
                        mine ?
                            null :
                            <FastImage
                                style={{
                                    width: 38,
                                    height: 38,
                                    backgroundColor: 'grey',
                                    borderRadius: 19,
                                    marginRight: 10
                                }}
                            />
                    }

                    <View style={{

                        maxWidth: mine ? '85%' : "80%",
                        backgroundColor: mine ? '#CDFACD' : "white",
                        borderTopRightRadius: mine ? 0 : 12,
                        borderTopLeftRadius: mine ? 12 : 0,
                        borderBottomLeftRadius: 12,
                        borderBottomRightRadius: 12,
                        paddingHorizontal: 8,
                        paddingVertical: 12,
                    }}>
                        {mine ? null : <Text style={{ fontSize: 16, fontWeight: '700', color: 'black', marginBottom: 4 }}>Мақсат</Text>}

                        <Text style={{ fontWeight: '400', color: 'black' }}>I’m really ecited to see the new design!</Text>

                        <Text style={{ textAlign: 'right', color: 'grey', marginTop: 4 }}>19:40</Text>



                    </View>
                </View>

            </View>
        )
    }




    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>

            <ChatHeader
                title={strings.addUsers}
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
                }}
            />

            <KeyboardAvoidingView style={{ flex: 1, }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>



                <View style={{ flex: 1, backgroundColor: '#F6F6F6' }}>
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        data={dataArray}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={renderItem}
                    />
                </View>

                <View style={{ flexDirection: 'row', backgroundColor: 'white', height: 40, width: '100%', paddingHorizontal: 12, marginVertical: 6 }}>
                    <TextInput
                        style={{
                            flex: 1,
                            borderWidth: 0.5,
                            minHeight: 40,
                            borderRadius: 16,
                            borderColor: '#8E8E93',
                            color: '#000000',
                            paddingHorizontal: 6
                        }}
                        placeholder='Сообщение...'
                        placeholderTextColor={'#6E8597'}
                    />

                    <TouchableOpacity
                        style={{
                            width: 45,
                            height: '100%',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        {chatCamera}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={{
                            width: 45,
                            height: '100%',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        {chatSend}
                    </TouchableOpacity>


                </View>
            </KeyboardAvoidingView>
        </SafeAreaView >
    )
}

export default ChatMessage;
