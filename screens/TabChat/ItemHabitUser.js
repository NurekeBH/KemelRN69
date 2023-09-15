import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import Collapsible from 'react-native-collapsible';
import { strings } from '../../Localization/Localization';
import FastImage from 'react-native-fast-image';
import { getTemplateLabel, height, width } from '../../Component/Component';
import { addHabitsIcon, addPhoto, Done, Bottom, swipeDelete, threeDot, no_avatar, number1, number2, number3 } from '../../Component/MyIcons';
import Swipeout from '../../Swipeout';
import axios from 'axios';
import moment from 'moment';
const today = moment().format('YYYY-MM-DD')


const ItemHabitUser = ({
    group_id,
    item,
    index,
    isSelected,
    donePress,
    menuPress,
    ...params
}) => {

    let itemUser = item
    const [selected, setSelected] = useState(true)
    const procentDone = itemUser.done_habits == 0 ? 0 : parseInt(itemUser.done_habits * 100 / itemUser.habits.length);


    const [done, setDone] = useState(false)



    const renderItemHabits = ({ item, index }) => {
        let isOwner = itemUser.owner
        return (
            <Swipeout
                disabled={!isOwner}
                autoClose={true}
                style={{
                    borderRadius: 10,
                    maxHeight: 200,
                    marginTop: 4,
                }}
                right={[
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

                        },
                    },
                ]}>
                <View
                    style={[
                        styles.vwStl,
                        {
                            minHeight: 55,
                            paddingVertical: 8,
                            backgroundColor: '#fff',
                        },
                    ]}>
                    <TouchableOpacity
                        style={{ height: 40, justifyContent: 'center', width: 40, }}
                        activeOpacity={0.8}
                        disabled={!isOwner}
                        onPress={() => {
                            donePress(item)
                        }}>
                        {item?.priority ? (
                            Priority
                        ) : item?.done ? (
                            <View style={styles.doneStl}>{Done}</View>
                        ) : (
                            <View
                                style={[
                                    styles.doneStl2,
                                    {
                                        borderColor: '#DADADA',
                                    },
                                ]}
                            />
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        onLongPress={() => {
                            this.state.open == 'day'
                                ? this.setState({
                                    indDrax: 2,
                                    visible: true,
                                })
                                : null;
                        }}
                        style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row' }}
                        activeOpacity={0.8}
                        key={index}>
                        <Text
                            style={{
                                fontSize: 15,
                                textDecorationLine: item?.done ? 'line-through' : 'none',
                                color: item?.done ? '#8E8E93' : '#000',
                            }}>
                            {item.label}
                        </Text>
                        {item?.purpose ? <Text style={{ color: '#2BA149', fontSize: 16 }}>{item?.target_value ? item?.target_value.value : 0} {item?.target_template ? getTemplateLabel(item?.target_template.template) : null}</Text>
                            :
                            null}
                    </TouchableOpacity>

                    <TouchableOpacity
                        disabled={!isOwner}
                        onPress={() => {
                            menuPress(item)
                        }}

                        style={{ height: 40, justifyContent: 'center', alignItems: 'flex-end', width: 40, }}
                    >
                        {threeDot}
                    </TouchableOpacity>

                </View>
            </Swipeout >
        )
    }




    return (
        <View
            style={{
                borderRadius: 8,
                marginTop: 8,
                marginHorizontal: 16,
                backgroundColor: '#ffffff',
            }}>
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                    setSelected(!selected)
                }}
                style={[
                    styles.vwStl,
                    {

                        paddingVertical: 13,
                        marginBottom: 0,
                        backgroundColor: item?.contexts?.background,
                    },
                ]}>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ marginRight: 8 }}>

                        {index == 0 ? number1 : index == 1 ? number2 : index == 2 ? number3 :
                            <View style={{ backgroundColor: 'rgba(0,0,0,0.11)', borderRadius: 50, width: 24, height: 24, alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ fontSize: 12, fontWeight: '400' }}>{index + 1}</Text>
                            </View>
                        }
                    </View>

                    {item?.avatar ? (
                        <FastImage
                            style={{ width: 40, aspectRatio: 1, borderRadius: 20 }}
                            source={{
                                uri: item.avatar,
                            }}
                        />
                    ) : (
                        <View
                            style={{
                                width: 40,
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

                    <Text numberOfLines={2} style={{ flex: 1, marginLeft: 8, fontSize: 16, fontWeight: '600' }}>{item?.fio}</Text>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View>

                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Text style={{ fontSize: 12, color: '#3F49DC' }}>
                                {parseInt(procentDone)}%
                            </Text>
                            <Text
                                style={{
                                    fontSize: 12,
                                    color: '#3F49DC',
                                }}>
                                {item.done_habits}/{item?.contexts?.total}
                            </Text>


                        </View>
                        <View
                            style={{
                                backgroundColor: '#BDBDBD',
                                height: 8,
                                width: 80,
                                borderRadius: 8,
                                marginTop: 5,
                            }}>
                            <View
                                style={{
                                    width: procentDone + '%',
                                    height: 8,
                                    backgroundColor: '#6577F3',
                                    borderRadius: 8,
                                }}
                            />
                        </View>
                    </View>


                    {Bottom}
                </View>
            </TouchableOpacity>
            <Collapsible
                collapsed={selected}
                style={{ padding: 16, backgroundColor: item?.contexts?.background, }}>
                <FlatList
                    listKey={(item, index) => 'B' + index.toString()}
                    data={item?.habits}
                    keyExtractor={(item, index) => index}
                    renderItem={renderItemHabits}
                    showsVerticalScrollIndicator={false}
                />
            </Collapsible>
        </View>

    )
}

export default ItemHabitUser;

const styles = StyleSheet.create({
    vwStl: {
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 6,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    doneStl: {
        width: 24,
        aspectRatio: 1,
        borderRadius: 12,
        backgroundColor: '#34C759',
        justifyContent: 'center',
        alignItems: 'center',
    },
    doneStl2: {
        width: 24,
        aspectRatio: 1,
        borderRadius: 12,
        borderWidth: 2,
    },
})