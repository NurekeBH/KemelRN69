import React, { useState } from 'react';
import { Switch, TouchableOpacity } from 'react-native';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import Modal from 'react-native-modalbox';
import { getLang } from '../../Component/Component';
import { Flag } from '../../Component/MyIcons';
import SimpleButton from '../../Component/SimpleButton';
import { strings } from '../../Localization/Localization';
import { weekArray } from './weeks';


const GroupHabitAdd = ({
    visible,
    setVisible,
    targetArr
}) => {


    const bordercolor = 'rgba(0, 0, 0, 0.2)';
    const [label, setLabel] = useState(null)
    const [desc, setDesc] = useState(null)
    const [weekArr, setWeekArr] = useState(weekArray)
    const [ischange, setIsChange] = useState(true)

    const [week_day_ids, setWeek_day_ids] = useState([1, 2, 3, 4, 5, 6, 7])
    const [is_purpose, setIsPurpose] = useState(false)
    const [target, setTarget] = useState(null)
    const [selected_template, setSelected_template] = useState(null)


    return (
        <Modal
            isOpen={visible}
            backdropColor={'rgba(0,0,0,0.7)'}
            position="bottom"
            coverScreen
            onClosed={() => {
                setVisible(false)
            }}

            style={{ height: 'auto', backgroundColor: 'transparent' }}
        >
            <View style={{ paddingHorizontal: 16, backgroundColor: 'white', borderTopLeftRadius: 24, borderTopRightRadius: 24, }}>
                <View style={{ alignSelf: 'center', marginTop: 16, width: 46, height: 6, backgroundColor: '#DDE2E8', borderRadius: 100 }} />
                <Text style={{ alignSelf: 'center', marginTop: 14, color: '#000000', fontSize: 20, fontWeight: '600' }}>Әдет қосу</Text>
                <View
                    style={{
                        paddingVertical: 10,
                        borderBottomWidth: 1,
                        borderBottomColor: bordercolor,
                    }}>
                    <TextInput
                        autoFocus={true}
                        style={{ fontSize: 20, fontWeight: '700', marginHorizontal: 10 }}
                        placeholder={strings.adetk}
                        placeholderTextColor={'#D1D1D6'}
                        multiline
                        value={label}
                        onChangeText={setLabel}
                    />
                </View>

                <View>
                    <Text style={{ color: 'black', fontSize: 22, fontWeight: '700', marginTop: 16 }}>
                        {strings.kunder}
                    </Text>
                    <View style={styles.weekVwStl}>
                        {weekArr.map((item, index) => (
                            <TouchableOpacity
                                onPress={() => {
                                    item.acitve = !item.acitve;

                                    let arr = week_day_ids;

                                    if (!arr.includes(item.id)) {
                                        arr.push(item.id);
                                    } else {
                                        arr.splice(arr.indexOf(item.id), 1);
                                    }
                                    setWeek_day_ids(arr)
                                    setIsChange(!ischange)

                                }}
                                activeOpacity={0.7}
                                key={index}
                                style={[
                                    {
                                        shadowColor: item.acitve ? '#3F49DC' : '#000',
                                        backgroundColor: item.acitve ? '#3F49DC' : '#fff',
                                    },
                                    styles.weekItemStl,
                                ]}>
                                <Text
                                    style={{
                                        fontSize: 15,
                                        fontWeight: '600',
                                        color: item.acitve ? '#fff' : '#3F49DC',
                                    }}>
                                    {item.week}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View
                    style={{
                        marginTop: 10,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingVertical: 9,
                    }}>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}>
                        {Flag}
                        <Text style={{ color: 'black', fontSize: 17, marginLeft: 12 }}>
                            {strings.maks}
                        </Text>
                    </View>
                    <Switch
                        value={is_purpose}
                        onValueChange={setIsPurpose}
                    />
                </View>
                <View style={{ height: 50 }}>
                    {is_purpose ? (
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                borderRadius: 8,
                                paddingHorizontal: 12,
                                backgroundColor: '#F2F2F7',
                                marginTop: 4
                            }}>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}>
                                <Text style={{ fontSize: 17, color: 'grey' }}>{strings.perday}</Text>
                            </View>
                            <TextInput
                                style={{ color: '#000', paddingVertical: 2, fontSize: 16, borderRadius: 10, width: 100, textAlign: 'center', backgroundColor: 'rgba(0,0,0,0.1)' }}
                                placeholder="0"
                                placeholderTextColor={"#000"}
                                keyboardType="number-pad"
                                onChangeText={setTarget}
                            />
                            <Dropdown
                                placeholderStyle={{ textAlign: 'right' }}
                                selectedTextStyle={{ textAlign: 'right' }}
                                style={{ width: 100, }}
                                data={targetArr}
                                maxHeight={300}
                                labelField="template"
                                valueField="value"
                                placeholder={'Select item'}
                                onChange={item => {
                                    console.log('itemitem', item)

                                    setSelected_template(item.id)
                                }}
                            />

                        </View>
                    ) : null}
                </View>

                <SimpleButton
                    text={strings.save}
                    style={{ marginTop: 16 }}
                />

                <View style={{ height: 50, }} />
            </View>

        </Modal>
    )
}

export default GroupHabitAdd;

const styles = StyleSheet.create({
    weekItemStl: {
        width: 34,
        aspectRatio: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 30,
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.19,
        shadowRadius: 1.65,

        elevation: 7,
    },
    weekVwStl: {
        paddingVertical: 20,
        backgroundColor: '#F2F2F7',
        marginTop: 8,
        borderRadius: 8,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
});