import React, { useEffect, useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { RightGray, addAdmin, addUser, backRound, closeIcon, exitGroup, habitsIcon, mediaIcon, moreMenu, no_avatar, penEdit, swipeDelete, threeDotWhite } from '../../Component/MyIcons';
import { StatusBarHeightPlatform } from '../../Component/GeneralStatusBarColor';
import FastImage from 'react-native-fast-image';
import Swipeout from '../../Swipeout';
import { strings } from '../../Localization/Localization';
import axios from 'axios';
import { showToast } from '../../Component/Component';


const GroupProfile = ({ navigation, route }) => {
    const group_id = route.params.group_id
    const group = route.params.group



    const [groupInfo, setGroupInfo] = useState(null)
    const [isLoading, setLoading] = useState(true)

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {

            getData()
        });

        return unsubscribe;


    }, []);

    const getData = () => {
        axios.get(`chat/group/${group_id}/`)
            .then(response => {
                console.log("RESPONSE group:", response);
                setGroupInfo(response?.data)
                setLoading(false)
            })
            .catch(error => {
                console.log("error group:", error.response);
            })
    }


    const makeAdmin = (id, admin) => {
        axios.post(`chat/group/${group_id}/account/${id}/admin/`,
            {
                admin: admin
            })
            .then(response => {
                console.log("RESPONSE admin:", response);
                getData()
            })
            .catch(error => {
                console.log("error admin:", error.response);
                showToast('error', error?.response?.data?.detail)
            })
    }

    const deleteUser = (id) => {
        axios.post(`chat/group/${group_id}/account/${id}/leave/`)
            .then(response => {
                console.log("RESPONSE admin:", response);
                getData()
            })
            .catch(error => {
                console.log("error admin:", error.response);
            })
    }




    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <View style={{ height: 256, width: '100%' }}>
                <FastImage
                    style={{ width: '100%', height: '100%' }}
                    source={{ uri: group?.cover }}
                >
                    <View style={{ position: 'absolute', width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.3)' }} />

                    <View style={{ marginHorizontal: 16, marginTop: StatusBarHeightPlatform, flexDirection: 'row', justifyContent: 'space-between' }}>
                        <TouchableOpacity
                            onPress={() => { navigation.goBack() }}
                            style={{ alignItems: 'center', justifyContent: 'center', width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.64)' }}
                        >
                            {backRound}
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => {
                                navigation.navigate('ChangeGroupProfile', { groupInfo: groupInfo, getData: getData })
                            }}
                            style={{ alignItems: 'center', justifyContent: 'center', width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.64)' }}
                        >
                            {penEdit()}
                        </TouchableOpacity>
                    </View>
                    <View style={{ position: 'absolute', bottom: 24, left: 24 }}>
                        <Text style={{ fontSize: 28, fontWeight: '700', color: '#FFFFFF' }}>{group?.label}</Text>
                    </View>
                </FastImage>



            </View>
            <View style={{ margin: 16 }}>
                <Text>{groupInfo?.desc}</Text>
            </View>

            <View style={{ height: 8, backgroundColor: '#EAEEF2', width: '100%' }} />

            <TouchableOpacity
                onPress={() => {
                    navigation.navigate('GroupHabits', { group_id: groupInfo?.id })
                }}
                style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 }}>
                {habitsIcon}
                <Text style={{ flex: 1, marginLeft: 12, fontSize: 17, color: '#000000' }}>{strings.adets}</Text>
                {RightGray}
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => {
                    navigation.navigate('GroupMedia', { group_id: groupInfo?.id })
                }}
                style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 }}>
                {mediaIcon}
                <Text style={{ flex: 1, marginLeft: 12, fontSize: 17, color: '#000000' }}>Медиа</Text>
                {RightGray}
            </TouchableOpacity>

            <View style={{ height: 8, backgroundColor: '#EAEEF2', width: '100%' }} />

            <View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 }}>
                    <Text style={{ flex: 1, fontSize: 17, color: '#000000' }}>{groupInfo?.accounts.length} {strings.members}</Text>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate('AddUsers', { group_id: groupInfo?.id })
                        }}
                    >
                        {addUser}
                    </TouchableOpacity>

                </View>
                {
                    groupInfo?.accounts.map((item, index) => (
                        <Swipeout
                            key={index}
                            autoClose={true}
                            style={{
                                maxHeight: 200,
                                marginTop: 8,
                            }}
                            right={[
                                {

                                    component: (
                                        item.role != 'admin' ?
                                            <View
                                                style={{
                                                    backgroundColor: '#B8B8D2',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    flex: 1,
                                                    maxHeight: 200,
                                                }}>
                                                {addAdmin}
                                                <Text style={{ marginTop: 4, fontSize: 8, color: 'white' }}>
                                                    {strings.admin}
                                                </Text>
                                            </View>
                                            :
                                            <View
                                                style={{
                                                    backgroundColor: '#B8B8D2',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    flex: 1,
                                                    maxHeight: 200,
                                                }}>
                                                {closeIcon}
                                                <Text style={{ marginTop: 4, fontSize: 8, color: 'white' }}>
                                                    delete
                                                </Text>
                                            </View>
                                    ),
                                    onPress: () => {
                                        if (item.role != 'admin') {
                                            makeAdmin(item.id, true)
                                        } else {
                                            makeAdmin(item.id, false)
                                        }
                                    },
                                },
                                {
                                    component: (
                                        <View
                                            style={{
                                                backgroundColor: '#f0dcda',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                flex: 1,
                                                maxHeight: 200,
                                            }}>
                                            {swipeDelete}
                                            <Text style={{ marginTop: 4, fontSize: 8, color: '#FF3B30' }}>
                                                {strings.delete}
                                            </Text>
                                        </View>
                                    ),
                                    onPress: () => {
                                        console.log('aaaaaa', item)
                                        deleteUser(item.id)
                                    },
                                }
                            ]}>
                            <View style={{ backgroundColor: 'white', paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center' }}>

                                {item?.avatar ? (
                                    <FastImage
                                        style={{ width: 50, aspectRatio: 1, borderRadius: 25 }}
                                        source={{
                                            uri: item.avatar,
                                        }}
                                    />
                                ) : (
                                    <View
                                        style={{
                                            width: 50,
                                            aspectRatio: 1,
                                            borderRadius: 44,
                                            borderColor: '#999999',
                                            borderWidth: 1,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}>
                                        {no_avatar(30)}
                                    </View>
                                )}

                                <View style={{ flex: 1, marginLeft: 16 }}>
                                    <Text style={{ fontSize: 16, fontWeight: '600', color: '#000000', }}>{item?.fio}</Text>
                                    <Text style={{ fontSize: 14, fontWeight: '400', color: '#000000', }}>{item?.email}</Text>
                                </View>
                                <Text style={{ fontSize: 13, fontWeight: '400', color: '#6E8597', }}>{item?.role == 'admin' ? 'Админ' : null}</Text>

                            </View>
                        </Swipeout>


                    ))
                }



                <TouchableOpacity
                    onPress={() => {
                        Alert.alert('Выйти из группы?', '', [
                            {
                                text: 'Нет',
                                onPress: () => console.log('Cancel Pressed'),
                                style: 'cancel',
                            },
                            { text: 'Да', onPress: () => console.log('OK Pressed') },
                        ]);
                    }}
                    style={{ marginTop: 32, backgroundColor: 'white', paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center' }}>
                    {exitGroup}
                    <Text style={{ fontSize: 16, fontWeight: '600', color: '#FF3B30', marginLeft: 16 }}>Выйти из группы</Text>
                </TouchableOpacity>
            </View>

        </View>
    )
}

export default GroupProfile;
