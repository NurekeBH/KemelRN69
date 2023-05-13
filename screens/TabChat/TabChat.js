import React, { useEffect, useState } from 'react';
import { FlatList, RefreshControl, SafeAreaView, TouchableOpacity } from 'react-native';
import { Text, View } from 'react-native';
import { PluseBtn, Search } from '../../Component/MyIcons';
import SimpleButton from '../../Component/SimpleButton';
import ItemGroups from './ItemGroups';
import { strings } from '../../Localization/Localization';
import axios from 'axios';




const TabChat = ({ navigation }) => {

    const [groups, setGroups] = useState([])
    const [isLoading, setLoading] = useState(true)


    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            console.log('focus')
            getData()
        });

        return unsubscribe;

    }, []);


    const getData = () => {
        axios.get('https://test.kemeladam.kz/api/chat/groups/')
            .then(response => {
                console.log("RESPONSE chat:", response);
                setGroups(response?.data?.results)
                setLoading(false)
            })
            .catch(error => {
                console.log("error chat:", error.response);

            })
    }

    const renderItem = ({ item, index }) => {
        return (
            <ItemGroups
                index={index}
                item={item}
                onPress={() => onItemPress(item)}
            />
        )
    }
    const onItemPress = (item) => {
        navigation.navigate('DetailChat', { item: item })
    }

    const listHeaderComponent = () => (
        <TouchableOpacity
            onPress={() => navigation.navigate('SearchNote')}
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
        <SafeAreaView style={{ flex: 1, }}>

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
