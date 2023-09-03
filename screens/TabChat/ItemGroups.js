import React, { useEffect, useState } from 'react';
import { Alert, TouchableOpacity } from 'react-native';
import { Text, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { billIcon, muteIcon, swipeDelete, userSelected } from '../../Component/MyIcons';
import Swipeout from '../../Swipeout';
import { strings } from '../../Localization/Localization';
import axios from 'axios';

const ItemGroups = ({
    item,
    index,
    onPress,
    deleteGroup,
    ...params
}) => {



    // useEffect(() => {
    //     item.selected = !item.selected
    // }, [selected]);

    return (
        <Swipeout
            autoClose={true}
            style={{
                backgroundColor: 'white',
                borderRadius: 10,
            }}
            right={[
                {
                    component: (
                        <View
                            style={{
                                backgroundColor: '#E8A13A',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flex: 1,
                            }}>
                            {muteIcon('white')}
                            <Text style={{ marginTop: 4, fontSize: 12, color: 'white' }}>
                                {strings.mute}
                            </Text>
                        </View>
                    ),
                    onPress: () => {

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
                            }}>
                            {swipeDelete}
                            <Text style={{ marginTop: 4, fontSize: 12, color: '#FF3B30' }}>
                                {strings.delete}
                            </Text>
                        </View>
                    ),
                    onPress: () => {
                        Alert.alert(strings.vnim, strings.deletegroup, [
                            {
                                text: strings.otm,
                                onPress: () => console.log('Cancel Pressed'),
                                style: 'cancel',
                            },
                            {
                                text: 'OK',
                                onPress: deleteGroup,
                            },
                        ]);
                    },
                },
            ]}>
            <TouchableOpacity
                onPress={onPress}
                activeOpacity={0.5}
                style={{
                    flex: 1,
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                <FastImage
                    style={{
                        width: 50,
                        height: 50,
                        borderRadius: 25,
                        backgroundColor: '#909090'
                    }}
                    source={{ uri: item?.cover }}
                />
                <View style={{ flex: 1, marginLeft: 16, }}>


                    <View style={{ flex: 1, flexDirection: 'row', }}>
                        <View style={{ flex: 1, }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text numberOfLines={1} style={{ color: '#000', fontSize: 16, fontWeight: '600' }}>{item?.label}</Text>
                                {
                                    item?.fine ?
                                        billIcon
                                        :
                                        null
                                }
                            </View>

                            <Text numberOfLines={2} style={{ color: '#8A8A8D', fontSize: 13, fontWeight: '400', }}>{item?.last_msg}</Text>
                        </View>
                        <View style={{ alignItems: 'flex-end' }}>
                            {/* <Text style={{ color: '#8A8A8D', fontSize: 13, fontWeight: '400', marginBottom: 4 }}>14:19</Text> */}
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                {
                                    item.unread_msg > 0 ?
                                        <View style={{ marginHorizontal: 2, backgroundColor: '#3F49DC', width: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}>
                                            <Text style={{ fontSize: 13, color: 'white' }}>{item.unread_msg}</Text>
                                        </View>
                                        :
                                        null
                                }

                                {
                                    item.mute ?
                                        muteIcon('#6E8597')
                                        :
                                        null
                                }
                            </View>


                        </View>
                    </View>

                </View>

            </TouchableOpacity>
            <View style={{ width: '80%', alignSelf: 'flex-end', height: 0.5, backgroundColor: 'rgba(0,0,0,0.2)', }} />

        </Swipeout>

    )
}

export default ItemGroups;
