import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, SafeAreaView, TouchableOpacity } from 'react-native';
import { Text, View } from 'react-native';
import { PluseBtn, Search } from '../../Component/MyIcons';
import SimpleButton from '../../Component/SimpleButton';
import ItemGroups from './ItemGroups';
import { strings } from '../../Localization/Localization';
import axios from 'axios';
// import useWebSocket, { ReadyState } from 'react-native-use-websocket';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ButtonClass, HeaderStyle, showToast, width } from '../../Component/Component';

import Modal from 'react-native-modalbox';
import { TextInputMask } from 'react-native-masked-text';
import { colorApp } from '../../theme/Colors';




const TabChat = ({ navigation }) => {

    const [groups, setGroups] = useState(null)
    const [isLoading, setLoading] = useState(true)
    const [userId, setUserId] = useState(null)

    const [phone, setPhone] = useState(null)
    const [data, setData] = useState(null)

    const mdlRef = useRef()


    const [readyState, setReadyState] = useState(0)
    const [connectionStatus, setConnectionStatus] = useState(strings.connecting)



    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            getData()

            AsyncStorage.getItem('user_id').then(value => {
                console.log('valuevaluevalue', value)
                if (value !== null) {
                    setUserId(value)
                    onConnect(value)

                }
            });

        });

        return () => {
            unsubscribe;
        }
    }, []);


    const onConnect = (value) => {
        let socket = new WebSocket(`wss://app.kemeladam.kz/ws/chat/user/${value}/groups/`)

        socket.onopen = function (e) {

            setReadyState(1)
            setConnectionStatus('')
            console.log('TabChatSocket onopen', e)

        }
        socket.onmessage = function (event) {
            let data = JSON.parse(event.data)
            console.log('TabChatSocket onmessage', data)
            if (data.channel === 'group.list') {
                setGroups(data?.groups)
                setLoading(false)
            }


        }
        socket.onclose = function (event) {
            setReadyState(2)
            setConnectionStatus(strings.notconnecting)
            setTimeout(function () {
                onConnect(value);
            }, 1000);
            console.log('TabChatSocket onclose', event)

        }
        socket.onerror = function (event) {
            setReadyState(2)
            setConnectionStatus(strings.notconnecting)
            console.log('TabChatSocket onerror', event)

        }
    }





    const getData = () => {
        axios.get('accounts/profile/')
            .then(response => {
                console.log('RESPONSE profile:', response);
                setLoading(false)
                setData(response.data)
                AsyncStorage.setItem('user_id', response.data.id + '')
                if (!response.data?.phone) {
                    mdlRef?.current?.open()
                }

            })
            .catch(error => {
                console.log('RESPONSE error:', error.response);
                if (error.response && error.response.status == 401) {
                    showToast('error', error.response.data.detail);
                }
            });
    }

    const renderItem = ({ item, index }) => {
        return (
            <ItemGroups
                index={index}
                item={item}
                onPress={() => onItemPress(item)}
                deleteGroup={() => deleteGroup(item)}
            />
        )
    }


    const deleteGroup = (item) => {
        console.log('delete', item)
        axios.delete(`chat/group/${item.id}/`)
            .then((response) => {
                console.log('delete', response)
                getData()
            })
            .catch((error) => {
                showToast('error', error?.response?.data?.detail)
                console.log('delete error', error)

            })
    }


    const onItemPress = (item) => {
        navigation.navigate('DetailChat', { item: item, userId: userId })
    }

    const listHeaderComponent = () => (
        <TouchableOpacity
            // onPress={() => navigation.navigate('SearchNote')}
            activeOpacity={0.5}
            style={{
                height: 36,
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 8,
                borderRadius: 10,
                backgroundColor: 'rgba(142, 142, 147, 0.12)',
                marginHorizontal: 16,
                marginVertical: 16
            }}>
            {Search}
            <Text style={{ marginLeft: 8, fontSize: 16, color: 'grey' }}>{strings.search}</Text>
        </TouchableOpacity>
    )


    const savePhone = () => {
        const formData = new FormData();
        let PHONE = phone.replace('+', '')
        PHONE = PHONE.replaceAll(' ', '')
        phone && formData.append('phone', PHONE);
        data?.fio && formData.append('fio', data.fio);

        axios
            .post('accounts/profile/change/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            .then(response => {
                console.log('RESPONSE change:', response);
                mdlRef?.current?.close()
            })
            .catch(error => {
                console.log('RESPONSE error:', error.response);

            });
    }


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <View style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                {
                    readyState == 1 ? null : <ActivityIndicator size={"small"} />
                }
                <Text style={{ fontSize: 12, marginLeft: 4 }}>{connectionStatus}</Text>

            </View>

            <FlatList
                data={groups}
                ListHeaderComponent={listHeaderComponent}
                keyExtractor={(item, index) => index.toString()}
                showsVerticalScrollIndicator={false}
                renderItem={renderItem}
                ListEmptyComponent={() => (
                    groups && !isLoading && readyState == 1 ?
                        < View
                            style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                            <Text>{strings.noGroup}</Text>
                            <SimpleButton
                                style={{ marginTop: 16 }}
                                text={strings.newGroup}
                                onPress={() => {
                                    navigation.navigate('NewGroup')
                                }}
                            />
                        </View>
                        :
                        null
                )}
                onRefresh={() => {

                    getData()
                }}
                refreshing={isLoading}

            />



            <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => {
                    navigation.navigate('NewGroup')
                }}
                style={{ position: 'absolute', right: 24, bottom: 24, alignItems: 'center', justifyContent: 'center', width: 64, height: 64, backgroundColor: '#3F49DC', borderRadius: 32 }}>
                {PluseBtn}
            </TouchableOpacity>




            <Modal
                ref={mdlRef}
                backdropColor={'rgba(0,0,0,0.7)'}
                coverScreen
                style={{ height: 'auto', backgroundColor: 'transparent' }}>
                <View
                    style={{
                        backgroundColor: '#fff',
                        width: width - 20,
                        marginHorizontal: 10,
                        borderRadius: 14,
                        padding: 16
                    }}>

                    <Text>{strings.addPhone}</Text>


                    <View style={{
                        backgroundColor: colorApp.fone,
                        padding: 12,
                        borderRadius: 8,
                        marginTop: 15,
                    }}>
                        <TextInputMask
                            type={'custom'}
                            options={{
                                mask: '+7 999 999 99 99'
                            }}
                            style={{ fontSize: 17, width: width - 60 }}
                            placeholder={strings.phone}
                            placeholderTextColor={'rgba(0,0,0,0.4)'}
                            keyboardType={'phone-pad'}
                            returnKeyType={'done'}
                            textContentType="nameSuffix"
                            value={phone}
                            autoCapitalize='none'
                            onChangeText={setPhone}
                        />
                    </View>

                </View>


                <ButtonClass
                    onPress={savePhone}
                    title={strings.save}
                    style={{
                        backgroundColor: '#fff',
                        width: width - 20,
                        marginHorizontal: 10,
                        marginTop: 4,
                        borderBoRadius: 14,
                    }}
                    titleStyle={{
                        fontSize: 20,
                        fontWeight: '700',
                        color: '#232857',
                    }}
                />

                <ButtonClass
                    onPress={() => mdlRef?.current?.close()}
                    title={strings.bastar}
                    style={{
                        backgroundColor: '#fff',
                        width: width - 20,
                        marginHorizontal: 10,
                        borderRadius: 14,
                    }}
                    titleStyle={{
                        fontSize: 20,
                        fontWeight: '700',
                        color: '#E64646',
                    }}
                />
            </Modal>

        </SafeAreaView>
    )
}

export default TabChat;
