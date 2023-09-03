import React, { useEffect, useRef, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ChatHeader from '../../Component/ChatHeader';
import GeneralStatusBarColor from '../../Component/GeneralStatusBarColor';
import { strings } from '../../Localization/Localization';
import { Done, addHabitsIcon, swipeDelete, threeDot } from '../../Component/MyIcons';
import axios from 'axios';
import ItemHabitUser from './ItemHabitUser';
import Swipeout from '../../Swipeout';
import { getTemplateLabel, width } from '../../Component/Component';
import FastImage from 'react-native-fast-image';
import { ImageDetail } from 'react-native-image-modal';


const GroupMedia = ({ navigation, route }) => {
    const group_id = route.params.group_id


    const [medias, setMedias] = useState([])
    const [isLoading, setLoading] = useState(true)



    const [isVisible, setIsVisible] = useState(false)
    const [modalUrl, setModalUrl] = useState(null)

    useEffect(() => {
        getData()
    }, []);

    const getData = () => {
        axios.get(`https://test.kemeladam.kz/api/chat/group/${group_id}/medias/`)
            .then(response => {
                console.log("RESPONSE setMedias:", response);
                setMedias(response?.data.results)
                setLoading(false)
            })
            .catch(error => {
                console.log("error setMedias:", error.response);
            })
    }

    const itemsize = width / 3 - 15
    const renderItem = ({ item, index }) => {
        return (
            <TouchableOpacity
                style={{ width: itemsize, height: itemsize, margin: 2 }}
                onPress={() => {
                    setModalUrl(item.file)
                    setIsVisible(true)
                }}
            >
                <FastImage
                    source={{ uri: item.file }}
                    style={{ width: '100%', height: '100%' }}
                />
            </TouchableOpacity>
        )
    }


    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <GeneralStatusBarColor backgroundColor={"white"} />


            <ChatHeader
                onLeftPress={() => navigation.goBack()}
                childComponent={(
                    <View
                        style={{ flex: 1, alignItems: 'center', paddingRight: 40 }}>
                        <Text style={{ fontSize: 16, fontWeight: '600', color: '#000000' }}>Медиа</Text>
                    </View>
                )}

            />
            <FlatList
                style={{ marginHorizontal: 16, }}
                data={medias}
                numColumns={3}
                keyExtractor={(item, index) => index.toString()}
                showsVerticalScrollIndicator={false}
                renderItem={renderItem}
            />

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

        </View>
    )
}

export default GroupMedia;
