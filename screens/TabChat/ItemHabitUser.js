import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import Collapsible from 'react-native-collapsible';
import { strings } from '../../Localization/Localization';
import FastImage from 'react-native-fast-image';
import { getTemplateLabel, height, width } from '../../Component/Component';
import { addHabitsIcon, addPhoto, Done, Bottom, swipeDelete, threeDot } from '../../Component/MyIcons';
import Swipeout from '../../Swipeout';
import axios from 'axios';
import moment from 'moment';
const today = moment().format('YYYY-MM-DD')


const ItemHabitUser = ({
    group_id,
    item,
    isSelected,
    donePress,
    menuPress,
    ...params
}) => {

    let itemUser = item
    const [selected, setSelected] = useState(isSelected)


    const [done, setDone] = useState(false)
    const procentDone = itemUser.doneHabitsCount == 0 ? 0 : parseInt(itemUser.doneHabitsCount * 100 / itemUser.habits.length);


    const DonePress = (item) => {
        console.log('item done', item)
        let params = {
            // "date": "2023-05-13",
            "date": today,
            "done": !item.done
        }
        axios.post(`https://test.kemeladam.kz/api/chat/group/${group_id}/habit/${item.id}/history/`,
            params)
            .then(response => {
                console.log("RESPONSE done:", response);
                if (response.status == 200 || response.status == 201) {
                    item.done = !item.done
                    itemUser.doneHabitsCount = !item.done ? itemUser.doneHabitsCount - 1 : itemUser.doneHabitsCount + 1
                    setDone(!done)
                    console.log("RESPONSE done: TRUE");

                }
            })
            .catch(error => {
                console.log("error done:", error.response);
            })
    }


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
                            DonePress(item)
                            // donePress(item)
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
                marginTop: 16,
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
                    },
                ]}>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                    <FastImage
                        style={{
                            width: 40,
                            height: 40,
                            borderRadius: 20
                        }}
                        source={require('../../assets/logo.png')}
                    />
                    <Text numberOfLines={2} style={{ flex: 1, marginLeft: 8, fontSize: 16, fontWeight: '600' }}>{item?.fio}</Text>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View>

                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Text style={{ fontSize: 12, color: '#3F49DC' }}>
                                {procentDone}%
                            </Text>
                            <Text
                                style={{
                                    fontSize: 12,
                                    color: '#3F49DC',
                                }}>
                                {item.doneHabitsCount}/{item.habits.length}
                            </Text>


                        </View>
                        <View
                            style={{
                                backgroundColor: '#BDBDBD',
                                height: 8,
                                width: 120,
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
                style={{ padding: 16, backgroundColor: 'white' }}>
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
        backgroundColor: '#FFFFFF',
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