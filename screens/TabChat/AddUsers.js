import React, { useEffect, useState } from 'react';
import { FlatList, PermissionsAndroid, SafeAreaView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Header from '../../Component/Header2';
import { strings } from '../../Localization/Localization';
import { Search, userSelected } from '../../Component/MyIcons';
import FastImage from 'react-native-fast-image';
import ItemUsers from './ItemUsers';
import SimpleButton from '../../Component/SimpleButton';
import axios from 'axios';
import { checkPermission, getAll, getCount } from "react-native-contacts";
import { Platform } from 'react-native';




const AddUsers = ({ navigation, route }) => {


    const [users, setUsers] = useState([])
    const [usersG, setUsersG] = useState([])
    const [nexturl, setNextUrl] = useState(null)

    const group_id = route.params.group_id


    console.log('route.params.group_id', route.params.group_id)


    useEffect(() => {
        // getData('')

        if (Platform.OS === "android") {
            PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
                title: "Contacts",
                message: "This app would like to view your contacts."
            }).then(() => {
                loadContacts();
            });
        } else {
            loadContacts();
        }

    }, []);


    const loadContacts = () => {

        getAll()
            .then(contacts => {
                let newArr = []
                for (let i = 0; i < contacts.length; i++) {
                    let object = {}
                    const element = contacts[i];
                    let phones = element.phoneNumbers
                    for (let p = 0; p < phones.length; p++) {
                        const element1 = phones[p];
                        let po = element1.number
                        po = po.replace(/\D+/g, '').replace(/(\d{1})(\d{3})(\d{3})(\d{4})/, '7$2$3$4');
                        element1.number = po
                    }


                    object.recordID = element.recordID
                    object.phoneNumbers = phones
                    object.familyName = element.familyName
                    object.givenName = element.givenName
                    object.middleName = element.middleName
                    newArr.push(object)
                }
                let params = {}
                params.cards = newArr
                axios.post(`chat/phones/`, params,)
                    .then(response => {
                        console.log('aaaaaa', response)

                        setUsers(response?.data)
                        setUsersG(response?.data)
                    })
                    .catch(error => {
                        console.log("error phones:", error.response);

                    })


            })
            .catch(e => {
                console.log('EEEEE', e)
            });



        checkPermission();
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


        axios.post(`chat/group/${group_id}/accounts/`, params)
            .then(response => {
                console.log("RESPONSE groups:", response);
                navigation.pop(2)
            })
            .catch(error => {
                console.log("error groups:", error.response);

            })


    }

    const SearchFunction = (value) => {
        let searchData = usersG.filter(item => {
            return item.contact.toLowerCase().match(value.toLowerCase());
        });

        setUsers(searchData)
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
                            SearchFunction(text)
                        } else if (text.length == 0) {
                            setUsers(usersG)
                        }
                    }}
                />
            </View>

            <FlatList
                data={users}
                keyExtractor={(item, index) => index.toString()}
                showsVerticalScrollIndicator={false}
                renderItem={renderItemUser}
            // onEndReachedThreshold={0.01}
            // onEndReached={(info) => {
            //     handleLoadMore(info);
            // }}
            />

            <SimpleButton
                text={"Продолжить"}
                onPress={onNextClick}
            />

        </SafeAreaView>
    )
}

export default AddUsers;
