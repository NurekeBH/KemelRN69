import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, SafeAreaView, TouchableOpacity } from 'react-native';
import { Text, View } from 'react-native';
import { PluseBtn, Search } from '../../Component/MyIcons';
import SimpleButton from '../../Component/SimpleButton';
import ItemGroups from './ItemGroups';
import { strings } from '../../Localization/Localization';
import axios from 'axios';
import useWebSocket, { ReadyState } from 'react-native-use-websocket';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showToast } from '../../Component/Component';




const TabChat = ({ navigation }) => {

    const [groups, setGroups] = useState([])
    const [isLoading, setLoading] = useState(true)
    const [userId, setUserId] = useState(null)





    const getSocketUrl = useCallback(() => {
        return new Promise(resolve => {
            AsyncStorage.getItem('user_id').then(value => {
                setUserId(value)
                resolve(`wss://test.kemeladam.kz/ws/chat/user/${value}/groups/`);
            });
        });
    }, []);



    const {
        sendJsonMessage,
        lastJsonMessage,
        readyState,
        getWebSocket
    } = useWebSocket(getSocketUrl, {
        onOpen: () => console.log('opened'),
        //Will attempt to reconnect on all close events, such as server shutting down
        shouldReconnect: (closeEvent) => true,
    });



    const connectionStatus = {
        [ReadyState.CONNECTING]: strings.connecting,
        [ReadyState.OPEN]: "",
        [ReadyState.CLOSING]: strings.notconnecting,
        [ReadyState.CLOSED]: strings.notconnecting,
        [ReadyState.UNINSTANTIATED]: strings.notconnecting,
    }[readyState];





    useEffect(() => {

        console.log('lastJsonMessage', lastJsonMessage)
        if (lastJsonMessage?.type == 'group.list') {
            setGroups(lastJsonMessage?.groups)
            setLoading(false)
        }
        // getData()
    }, [lastJsonMessage]);



    const getData = () => {
        setLoading(false)
        // axios.get('https://test.kemeladam.kz/api/chat/groups/')
        //     .then(response => {
        //         console.log("RESPONSE chat:", response);
        //         setGroups(response?.data?.results)
        //         setLoading(false)
        //     })
        //     .catch(error => {
        //         console.log("error chat:", error.response);
        //         setLoading(false)
        //     })
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
        axios.delete(`https://test.kemeladam.kz/api/chat/group/${item.id}/`)
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
                onRefresh={() => {
                    setLoading(true)
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


        </SafeAreaView>
    )
}

export default TabChat;
