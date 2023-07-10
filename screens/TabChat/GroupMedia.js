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
const GroupMedia = ({ navigation, route }) => {
    const group_id = route.params.group_id


    const [medias, setMedias] = useState([])
    const [isLoading, setLoading] = useState(true)

    useEffect(() => {
        getData()
    }, []);

    const getData = () => {
        axios.get(`https://test.kemeladam.kz/api/chat/group/${group_id}/medias/`)
            .then(response => {
                console.log("RESPONSE setMedias:", response);
                setMedias(response?.data)
                setLoading(false)
            })
            .catch(error => {
                console.log("error setMedias:", error.response);
            })
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
            <Text>GroupMedia{group_id}</Text>
        </View>
    )
}

export default GroupMedia;
