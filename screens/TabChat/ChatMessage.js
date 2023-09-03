import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, KeyboardAvoidingView, Platform, SafeAreaView, StatusBar, TextInput, TouchableOpacity } from 'react-native';
import { Text, View } from 'react-native';
import Header from '../../Component/Header2';
import { strings } from '../../Localization/Localization';
import ChatHeader from '../../Component/ChatHeader';
import FastImage from 'react-native-fast-image';
import { PluseBtn, chatBg1, chatBg2, chatCamera, chatFatIcon, chatSend, closeIcon, moreMenu, no_avatar, userSelected } from '../../Component/MyIcons';
import axios from 'axios';
import useWebSocket, { ReadyState } from 'react-native-use-websocket';
import { width } from '../../Component/Component';
import TimeAgo from '../../Component/TimeAgo';
import ImageCropPicker from 'react-native-image-crop-picker';
import { ImageDetail } from 'react-native-image-modal';
import TimeAgoDay from '../../Component/TimeAgoDay';


const ChatMessage = ({ navigation, route }) => {



    const myInfo = route.params.myInfo
    const item = route.params.item
    const group_id = item.id


    const getSocketUrl = useCallback(() => {
        return new Promise(resolve => {
            resolve(`wss://test.kemeladam.kz/ws/chat/group/${group_id}/?account_id=${myInfo.id}`);
        });
    }, []);



    const {
        sendJsonMessage,
        lastJsonMessage,
        readyState,
        getWebSocket
    } = useWebSocket(getSocketUrl, {
        onOpen: () => getData(),
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



    const [loadingMore, setLoadingMore] = useState(false)
    const [allLoaded, setAllLoaded] = useState(false)
    const [isLoading, setLoading] = useState(false)
    const [nextUrl, setNextUrl] = useState(null)
    const [dataArray, setDataArray] = useState([])

    const [message, setMessage] = useState(null)

    const [isVisible, setIsVisible] = useState(false)
    const [modalUrl, setModalUrl] = useState(null)

    const [path, setPath] = useState(null)
    const [mime, setMime] = useState(null)



    useEffect(() => {

        readyState == 1 && getData()

        console.log('lastJsonMessage', lastJsonMessage)

        let LastId = lastJsonMessage?.message?.sender.id

        if (LastId !== myInfo?.id) {


            const MMM = {

                channel: 'group.message.read',
                request: {
                    message_id: lastJsonMessage?.message?.id,
                    account_id: myInfo?.id,
                }
            }


            console.log('MMM', MMM)
            sendJsonMessage(MMM)
        }


    }, [lastJsonMessage]);




    const getData = () => {
        setLoading(true)
        axios.get(`https://test.kemeladam.kz/api/chat/group/${group_id}/messages/`)
            .then(response => {
                console.log("RESPONSE chat:", response);



                setDataArray(response?.data?.results)
                setLoading(false)
                setNextUrl(response?.data?.next)
            })
            .catch(error => {
                console.log("error habits:", error.response);
            })
    }



    const renderItem = ({ item, index }) => {
        let mine = item?.sender?.id == myInfo.id
        let is_bot = item?.is_bot
        return (
            is_bot ?
                <View style={{ alignItems: 'center', marginTop: 8 }}>
                    <TimeAgoDay style={{ fontWeight: '400', color: 'grey', fontSize: 10 }} language='kz' time={item?.created_at} />
                    <View style={{ alignItems: 'center', backgroundColor: item?.contexts?.background ? item?.contexts?.background : '#ECEEFF', marginVertical: 4, marginHorizontal: 16, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 30 }}>
                        <Text style={{ fontWeight: '400', color: 'rgba(0,0,0,0.8)', fontSize: 12 }}>{item?.message}</Text>
                    </View>
                </View>

                :
                <View style={{ flex: 1, alignItems: mine ? 'flex-end' : 'flex-start', paddingHorizontal: 16, paddingVertical: 4, }}>
                    <View style={{ flex: 1, flexDirection: 'row', }}>

                        {
                            mine ?
                                null :
                                item?.sender?.avatar ? (
                                    <FastImage
                                        style={{ marginRight: 4, width: 36, aspectRatio: 1, borderRadius: 20 }}
                                        source={{
                                            uri: item?.sender?.avatar,
                                        }}
                                    />
                                ) : (
                                    <View
                                        style={{
                                            width: 36,
                                            aspectRatio: 1,
                                            borderRadius: 44,
                                            borderColor: '#999999',
                                            borderWidth: 1,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}>
                                        {no_avatar(25)}
                                    </View>
                                )

                        }

                        <View style={{
                            minWidth: width / 2,
                            maxWidth: mine ? '85%' : "80%",
                            backgroundColor: mine ? '#CDFACD' : "white",
                            borderTopRightRadius: mine ? 0 : 12,
                            borderTopLeftRadius: mine ? 12 : 0,
                            borderBottomLeftRadius: 12,
                            borderBottomRightRadius: 12,
                            paddingHorizontal: 8,
                            paddingVertical: 6,
                        }}>
                            {mine ? null : <Text style={{ fontSize: 16, fontWeight: '700', color: 'black', marginBottom: 4 }}>{item?.sender?.fio}</Text>}


                            {
                                item?.medias.length > 0 ?
                                    <TouchableOpacity
                                        activeOpacity={0.7}
                                        onPress={() => {
                                            setModalUrl(item?.medias[0].file)
                                            setIsVisible(true)
                                        }}
                                    >
                                        <FastImage
                                            style={{
                                                minWidth: width / 2,
                                                maxWidth: mine ? '85%' : "80%",
                                                height: 120,
                                                borderRadius: 12,
                                            }}
                                            source={{ uri: item?.medias[0].file }}
                                        />
                                    </TouchableOpacity>
                                    :
                                    null
                            }


                            {
                                item?.message ? <Text style={{ fontWeight: '400', color: 'black' }}>{item?.message}</Text>
                                    :
                                    null
                            }

                            {/* <Text style={{ textAlign: 'right', color: 'grey', marginTop: 4 }}>{TimeAgo(item?.created_at)}</Text> */}
                            <TimeAgo style={{ textAlign: 'right', color: 'grey', marginTop: 4, fontSize: 12 }} language='kz' time={item?.created_at} />
                        </View>
                    </View>
                </View>
        )
    }








    const handleClickSendMessage = () => {



        if (path) {

            const formData = new FormData();

            formData.append('file', {
                uri: path,
                type: mime,
                name: 'filename.jpg',
            });

            axios
                .post(`https://test.kemeladam.kz/api/chat/group/${group_id}/media/`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                })
                .then(response => {
                    console.log('RESPONSE getMedia:', response);


                    const MMM = {
                        channel: 'group.message',
                        request: {
                            message: message,
                            sender: myInfo,
                            medias: response.data,
                            group: group_id,
                        }
                    }

                    console.log('MMM', MMM)

                    SendMessageToSocket(MMM)

                })
                .catch(error => {
                    console.log('RESPONSEgetMedia error:', error.response);

                })
        } else if (message) {
            console.log('MMM', 'Send')

            const MMM = {
                channel: 'group.message',
                request: {
                    message: message + ' ',
                    sender: myInfo,
                    medias: [],
                    group: group_id,
                }
            }
            console.log('MMM', MMM)
            SendMessageToSocket(MMM)
        }
    }

    const SendMessageToSocket = (Msg) => {
        sendJsonMessage(Msg)
        setMessage(null)
        setPath(null)
        setMime(null)
        getData()
    }


    const getMedia = () => {
        ImageCropPicker.openPicker({
            multiple: false,
            cropping: true,
            freeStyleCropEnabled: true,
            width: 750,
            height: 750,
            mediaType: 'photo',
        }).then(images => {
            const { path, mime } = images;

            setPath(path)
            setMime(mime)
            // const formData = new FormData();

            // formData.append('file', {
            //     uri: path,
            //     type: mime,
            //     name: 'filename.jpg',
            // });

            // axios
            //     .post(`https://test.kemeladam.kz/api/chat/group/${group_id}/media/`, formData, {
            //         headers: {
            //             'Content-Type': 'multipart/form-data',
            //         },
            //     })
            //     .then(response => {
            //         console.log('RESPONSE getMedia:', response);


            //         const MMM = {
            //             channel: 'group.message',
            //             request: {
            //                 message: message,
            //                 sender: myInfo,
            //                 medias: response.data,
            //                 group: group_id,
            //             }
            //         }

            //         console.log('MMM', MMM)

            //         SendMessageToSocket(MMM)

            //     })
            //     .catch(error => {
            //         console.log('RESPONSEgetMedia error:', error.response);

            //     })

        });
    }

    const handleLoadMore = (info) => {

        if (loadingMore || allLoaded || !nextUrl) return;
        setLoading(true)
        setLoadingMore(true)
        axios.get(nextUrl)
            .then(response => {
                console.log("handleLoadMore RESPONSE chat:", response);
                setNextUrl(response?.data?.next)
                setDataArray(response?.data?.results)
                setLoading(false)
                setLoadingMore(false)


            })
            .catch(error => {
                console.log(" handleLoadMore error habits:", error.response);
            })

    };

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
                            <View style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                                {
                                    readyState == 1 ?
                                        <Text style={{ fontSize: 12, color: '#8A8A8D', fontWeight: '400' }}>{strings.infogroup}</Text>
                                        :
                                        <ActivityIndicator size={"small"} />
                                }
                                <Text style={{ fontSize: 12, marginLeft: 4 }}>{connectionStatus}</Text>

                            </View>
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
                        onEndReachedThreshold={0.01}
                        onEndReached={(info) => {
                            handleLoadMore(info);
                        }}
                        data={dataArray}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={renderItem}
                        inverted={true}
                    />
                </View>
                <View>
                    {
                        path ?
                            <View
                                style={{ paddingTop: 8, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                <TouchableOpacity
                                    onPress={() => {
                                        setModalUrl(path)
                                        setIsVisible(true)
                                    }}>
                                    <FastImage
                                        style={{ width: 60, height: 60, }}
                                        source={{ uri: path }}
                                    />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => {
                                        setPath(null)
                                        setMime(null)
                                    }}
                                    style={{ width: 50, height: 50, alignItems: 'center', justifyContent: 'center', }}>
                                    {closeIcon}
                                </TouchableOpacity>
                            </View>
                            :
                            null
                    }

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
                            value={message}
                            placeholder='Сообщение...'
                            placeholderTextColor={'#6E8597'}
                            onChangeText={setMessage}
                        />

                        <TouchableOpacity
                            style={{
                                width: 45,
                                height: '100%',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                            onPress={getMedia}
                        >
                            {chatCamera}
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{
                                width: 45,
                                height: '100%',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                            onPress={handleClickSendMessage}

                        >
                            {chatSend}
                        </TouchableOpacity>


                    </View>

                </View>

            </KeyboardAvoidingView>


            <ImageDetail
                isOpen={isVisible}
                resizeMode="contain"
                backgroundColor="#000000"
                swipeToDismiss={true}
                source={{
                    uri: modalUrl,
                }}
                origin={{
                    x: -100,
                    y: -100,
                    width: 50,
                    height: 50,

                }}
                onClose={() => {
                    setIsVisible(false);
                    setModalUrl(null)

                }
                }
            />

        </SafeAreaView >
    )
}

export default ChatMessage;
