import React, { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, SafeAreaView, ScrollView, StatusBar, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { getTemplateLabel, height, width } from '../../Component/Component';
import Header from '../../Component/Header2';
import { addHabitsIcon, addPhoto, Priority } from '../../Component/MyIcons';
import { strings } from '../../Localization/Localization';
import { colorApp } from '../../theme/Colors';
import ModalBox from 'react-native-modalbox';
import GroupHabitAdd from './GroupHabitAdd';
import axios from 'axios';

const NewGroup = ({ navigation }) => {

    const input1 = useRef();
    const input2 = useRef();
    const [label, setLabel] = useState(null)
    const [desc, setDesc] = useState(null)
    const [priority, setpriority] = useState(false)
    const [selected, setSelected] = useState(1)
    const [modalVisible, setModalVisible] = useState(false)

    const [targetArr, setTargetArr] = useState(true)


    useEffect(() => {
        getTarget()

    }, []);


    const getTarget = () => {
        axios.get('todos/target-templates/')
            .then((response) => {
                console.log('templates response', response)

                let Arra = response.data
                for (let index = 0; index < Arra.length; index++) {
                    const element = Arra[index];
                    element.template = getTemplateLabel(element.template)
                }

                console.log('ArraArra', Arra)


                setTargetArr(Arra)

            })
            .catch((error) => {

            })
    }



    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>


            <Header
                deleteBackText={true}
                title={strings.newGroup}
                onLeftPress={() => navigation.goBack()}
            />
            <KeyboardAvoidingView behavior={'padding'}>
                <ScrollView showsVerticalScrollIndicator={false}
                    style={{ minHeight: height, backgroundColor: '#F5F5F5' }}>
                    <View style={{ backgroundColor: 'white', paddingTop: 16, }}>
                        <TouchableOpacity
                            activeOpacity={0.5}
                        >
                            <View
                                style={{ alignSelf: 'center', alignItems: 'center', justifyContent: 'center', width: 132, height: 132, backgroundColor: '#E2E5FF', borderRadius: 66 }}>
                                {addPhoto}
                            </View>

                        </TouchableOpacity>
                    </View>

                    <View style={{ backgroundColor: 'white', paddingHorizontal: 16, paddingTop: 16 }}>

                        <View
                            style={{
                                backgroundColor: colorApp.fone,
                                padding: 12,
                                borderRadius: 8,
                                marginTop: 15,
                            }}>
                            <TextInput
                                ref={input1}
                                style={{ fontSize: 17, width: width - 60 }}
                                placeholder={strings.groupname}
                                placeholderTextColor={'rgba(0,0,0,0.4)'}
                                returnKeyType={'next'}
                                value={label}
                                autoCapitalize='none'
                                onChangeText={setLabel}
                                onSubmitEditing={() => {
                                    input2?.current.focus()

                                }}
                                blurOnSubmit={false}
                            />
                        </View>
                        <View
                            style={{
                                backgroundColor: colorApp.fone,
                                padding: 12,
                                borderRadius: 8,
                                marginTop: 15,
                                minHeight: 100,
                            }}>
                            <TextInput
                                ref={input2}
                                style={{ fontSize: 17, width: width - 60, }}
                                placeholder={strings.groupdesc}
                                placeholderTextColor={'rgba(0,0,0,0.4)'}
                                returnKeyType={'next'}
                                value={desc}
                                autoCapitalize='none'
                                onChangeText={setDesc}

                            // onSubmitEditing={() => {
                            //     input1?.current.focus()

                            // }}
                            // blurOnSubmit={false}
                            />
                        </View>


                        <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 16, }}>
                            {Priority}
                            <Text style={{ flex: 1, color: '#000000', fontSize: 17, marginLeft: 12 }}>{strings.shtraf}</Text>

                            <Switch
                                value={priority}
                                onValueChange={(value) => {
                                    setpriority(value)
                                    if (!value) {
                                        setSelected(1)
                                    }
                                }}
                            />
                        </View>
                        {
                            priority ?
                                <View style={{ marginHorizontal: 24, paddingVertical: 16 }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                                        <TouchableOpacity
                                            onPress={() => setSelected(1)}
                                            style={styles.buttoncontainer(selected == 1)}
                                        >
                                            <Text style={styles.buttontext}>100</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => setSelected(2)}
                                            style={styles.buttoncontainer(selected == 2)}
                                        >
                                            <Text style={styles.buttontext}>200</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => setSelected(3)}
                                            style={styles.buttoncontainer(selected == 3)}
                                        >
                                            <Text style={styles.buttontext}>500</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ marginTop: 16, flexDirection: 'row', justifyContent: 'space-around' }}>
                                        <TouchableOpacity
                                            onPress={() => setSelected(4)}
                                            style={styles.buttoncontainer(selected == 4)}
                                        >
                                            <Text style={styles.buttontext}>1000</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => setSelected(5)}
                                            style={styles.buttoncontainer(selected == 5)}
                                        >
                                            <Text style={styles.buttontext}>2000</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => setSelected(6)}
                                            style={styles.buttoncontainer(selected == 6)}
                                        >
                                            <Text style={styles.buttontext}>5000</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                :
                                null
                        }


                    </View>
                    <View style={{ width: '100%', backgroundColor: '#F5F5F5', padding: 16 }}>

                        <View
                            style={[
                                styles.vwStl,
                                {
                                    backgroundColor: '#ffffff',
                                    paddingVertical: 13,
                                    marginBottom: 0,
                                },
                            ]}>

                            <Text style={{ flex: 1, fontSize: 17, fontWeight: '600' }}>{strings.adets}</Text>
                            <TouchableOpacity
                                onPress={() => {
                                    setModalVisible(true)
                                }}
                                style={{ marginRight: 8, width: 30, height: 30, alignItems: 'center', justifyContent: 'center', borderRadius: 15, }}>
                                {addHabitsIcon}
                            </TouchableOpacity>
                        </View>
                    </View>

                    {
                        modalVisible ?
                            <GroupHabitAdd
                                visible={modalVisible}
                                setVisible={setModalVisible}
                                targetArr={targetArr}
                            />
                            :
                            null
                    }

                </ScrollView>
            </KeyboardAvoidingView>



        </SafeAreaView>

    )
}

export default NewGroup;

const styles = StyleSheet.create({
    buttoncontainer: (IsSelected) => (
        IsSelected ?
            {
                width: 90,
                alignItems: 'center',
                backgroundColor: 'white',
                paddingVertical: 4,
                borderRadius: 8,
                shadowColor: "#000",
                shadowOffset: {
                    width: 0,
                    height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,

            }
            :
            {
                width: 90,
                alignItems: 'center',
                backgroundColor: 'white',
                paddingVertical: 4,
                borderRadius: 8

            }),
    buttontext: {
        color: '#3F49DC',
        fontSize: 16
    },
    vwStl: {
        paddingHorizontal: 14,
        paddingVertical: 6,
        backgroundColor: '#FFFFFF',
        borderRadius: 6,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
})
