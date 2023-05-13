import React, { useEffect, useState } from 'react';
import { FlatList, SafeAreaView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Header from '../../Component/Header2';
import { strings } from '../../Localization/Localization';
import { Search, userSelected } from '../../Component/MyIcons';
import FastImage from 'react-native-fast-image';
import ItemUsers from './ItemUsers';
import SimpleButton from '../../Component/SimpleButton';
import axios from 'axios';





const AddUsers = ({ navigation, route }) => {


    const [users, setUsers] = useState([])

    const group_id = route.params.group_id




    useEffect(() => {
        getData('')

    }, []);

    const getData = (search) => {
        axios.get(`https://test.kemeladam.kz/api/chat/group/${group_id}/account/autocomplete/?limit=20&offset=0&search=${search}`)
            .then(response => {
                console.log("RESPONSE chat:", response);
                setUsers(response?.data?.results)
            })
            .catch(error => {
                console.log("error chat:", error.response);

            })
    }

    const renderItemUser = ({ item, index }) => {
        return (
            <ItemUsers
                item={item}
                isSelected={item?.selected}
            />
        )
    }

    const onNextClick = () => {
        console.log('users', users)
        const result = users.filter(user => user.selected).map(user => user.id);
        console.log('result', result)


        let params = {
            "accounts": result
        }


        axios.post(`https://test.kemeladam.kz/api/chat/group/${group_id}/accounts/`, params)
            .then(response => {
                console.log("RESPONSE groups:", response);
                navigation.pop(2)
            })
            .catch(error => {
                console.log("error groups:", error.response);

            })


    }
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>


            <Header
                deleteBackText={true}
                title={strings.addUsers}
                onLeftPress={() => navigation.goBack()}
            />
            <View
                style={{ marginVertical: 8, height: 36, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, borderRadius: 10, backgroundColor: 'rgba(142, 142, 147, 0.12)', marginHorizontal: 16, }}>
                {Search}
                <TextInput
                    style={{ flex: 1, marginLeft: 8, fontSize: 16, color: 'black' }}
                    placeholder={strings.search}
                    placeholderTextColor={'grey'}
                    onChangeText={(text) => {
                        if (text.length > 2) {
                            getData(text)
                        } else if (text.length == 0) {
                            getData('')
                        }
                    }}

                />
            </View>

            <FlatList
                data={users}
                keyExtractor={(item, index) => index.toString()}
                showsVerticalScrollIndicator={false}
                renderItem={renderItemUser}
            />

            <SimpleButton
                text={"Продолжить"}
                onPress={onNextClick}
            />

        </SafeAreaView>
    )
}

export default AddUsers;
