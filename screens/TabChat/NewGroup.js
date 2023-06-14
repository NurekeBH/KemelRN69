import React, { useEffect, useRef, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { getTemplateLabel, height, width } from '../../Component/Component';
import Header from '../../Component/Header2';
import { addHabitsIcon, addPhoto, Done, Priority, swipeDelete } from '../../Component/MyIcons';
import { strings } from '../../Localization/Localization';
import { colorApp } from '../../theme/Colors';
import ModalBox from 'react-native-modalbox';
import GroupHabitAdd from './GroupHabitAdd';
import axios from 'axios';
import Swipeout from '../../Swipeout';
import SimpleButton from '../../Component/SimpleButton';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import ImageCropPicker from 'react-native-image-crop-picker';
import FastImage from 'react-native-fast-image';


const NewGroup = ({ navigation }) => {

    const input1 = useRef();
    const input2 = useRef();
    const [label, setLabel] = useState(null)
    const [desc, setDesc] = useState(null)
    const [fine, setFine] = useState(false)
    const [finesArray, setFinesArray] = useState([])

    const [selected, setSelected] = useState(null)
    const [modalVisible, setModalVisible] = useState(false)

    const [targetArr, setTargetArr] = useState([])

    const [habitArr, setHabitArr] = useState([])

    const [avatar, setAvatar] = useState(null)
    const [path, setPath] = useState(null)
    const [mime, setMime] = useState(null)


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



        axios.get(`https://test.kemeladam.kz/api/chat/fines/`)
            .then((response) => {
                console.log('fines response', response)
                setFinesArray(response?.data)
            })
            .catch((error) => {
                console.log('fines error', error?.response)

            })

    }

    const addHabit = (habit) => {
        console.log('habithabit', habit);
        let arr = habitArr
        arr.push(habit)
        setHabitArr(arr)

        console.log('habitArr', habitArr);

    }

    const deleteHabit = (index) => {
        console.log('habithabit', index);
        let arr = habitArr
        arr.splice(index, 1);
        setHabitArr([...arr])

        console.log('habitArr', habitArr);

    }

    const onNextPress = () => {


        let params = {
            "label": label,
            "desc": desc,
            "habits": habitArr,

        }
        if (fine) {
            params.fine = finesArray[selected]?.id
        }

        // const formData = new FormData();

        // path &&
        //     mime &&
        //     formData.append('cover', {
        //         uri: path,
        //         type: mime,
        //         name: 'filename.jpg',
        //     });
        // label && formData.append('label', label);
        // desc && formData.append('desc', desc);
        // fine && formData.append('fine', finesArray[selected]?.id);
        // habitArr.forEach(tag => formData.append('habits', tag))
        // formData.append('habits', habitArr)




        // console.log('params', params)
        axios.post('https://test.kemeladam.kz/api/chat/groups/', params)
            .then(response => {
                console.log("RESPONSE groups:", response);
                if (response?.data?.id) {
                    navigation.navigate('AddUsers', { group_id: response?.data?.id })
                }
            })
            .catch(error => {
                console.log("error groups:", error.response);

            })

    }

    const renderFines = ({ item, index }) => (
        <TouchableOpacity
            onPress={() => setSelected(index)}
            style={styles.buttoncontainer(selected == index)}
        >
            <Text style={styles.buttontext}>{item?.value}</Text>
        </TouchableOpacity>
    )

    const AddAvatar = () => {
        ImageCropPicker.openPicker({
            multiple: false,
            cropping: true,
            mediaType: 'photo',
        }).then(images => {
            const { path, mime } = images;

            setAvatar(images.path)
            setPath(path)
            setMime(mime)
            console.log(images);
            // this.setState({
            //     avatar: images.path,
            //     path,
            //     mime,
            // });
        });
    }



    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>


            <Header
                deleteBackText={true}
                title={strings.newGroup}
                onLeftPress={() => navigation.goBack()}
            />
            <KeyboardAwareScrollView>
                <View style={{ flex: 1, minHeight: height - Platform.select({ ios: 44, android: 56 }) * 3, backgroundColor: '#F5F5F5' }}>
                    <View style={{ backgroundColor: 'white', paddingTop: 16, }}>
                        <TouchableOpacity
                            activeOpacity={0.5}
                            onPress={AddAvatar}
                        >


                            <View
                                style={{ alignSelf: 'center', alignItems: 'center', justifyContent: 'center', width: 132, height: 132, backgroundColor: '#E2E5FF', borderRadius: 66 }}>
                                {
                                    avatar ?
                                        <FastImage
                                            style={{ width: 132, aspectRatio: 1, borderRadius: 66 }}
                                            source={{
                                                uri: avatar,
                                            }}
                                        />
                                        :
                                        null}
                                <View style={{ position: 'absolute' }}>
                                    {addPhoto(avatar ? "white" : '#3F49DC')}
                                </View>
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
                                multiline={true}
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
                                value={fine}
                                onValueChange={(value) => {
                                    setFine(value)
                                    setSelected(value ? 0 : null)

                                }}
                            />
                        </View>
                        {
                            fine ?
                                <View style={{ marginHorizontal: 24, paddingVertical: 16 }}>
                                    <FlatList
                                        data={finesArray}
                                        keyExtractor={(item, index) => index.toString()}
                                        showsHorizontalScrollIndicator={false}
                                        renderItem={renderFines}
                                        numColumns={3}
                                    />

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
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}>
                                <Text style={{ flex: 1, fontSize: 17, fontWeight: '600' }}>{strings.adets}</Text>
                                <TouchableOpacity
                                    onPress={() => {
                                        setModalVisible(true)
                                    }}
                                    style={{ marginRight: 8, width: 30, height: 30, alignItems: 'center', justifyContent: 'center', borderRadius: 15, }}>
                                    {addHabitsIcon}
                                </TouchableOpacity>
                            </View>

                            {
                                habitArr.map((item, index) => {
                                    return (
                                        <Swipeout
                                            autoClose={true}
                                            style={{
                                                borderRadius: 10,
                                                maxHeight: 200,
                                                marginTop: 4,
                                                borderWidth: 0.5,
                                                borderColor: 'rgba(0,0,0,0.2)'
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
                                                        deleteHabit(index)
                                                    },
                                                },
                                            ]}>
                                            <View
                                                style={[
                                                    styles.vwStl,
                                                    {
                                                        flexDirection: 'row',
                                                        alignItems: 'center',
                                                        justifyContent: 'space-between',
                                                        minHeight: 55,
                                                        paddingVertical: 8,
                                                        backgroundColor: '#fff',
                                                    },
                                                ]}>
                                                <View style={{
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                }}>
                                                    <View
                                                        style={[
                                                            styles.doneStl2,
                                                            {
                                                                borderColor: '#DADADA',
                                                            },
                                                        ]}
                                                    />
                                                    <Text
                                                        style={{
                                                            fontSize: 15,
                                                            color: '#000',
                                                            marginLeft: 12
                                                        }}>
                                                        {item.label}
                                                    </Text>
                                                </View>


                                                {item.purpose ? <Text style={{ color: '#2BA149', fontSize: 16 }}>{item.target} {getTemplateLabel(item?.template?.template)}</Text>
                                                    :
                                                    null}


                                            </View>
                                        </Swipeout>
                                    )
                                })
                            }


                        </View>
                        <SimpleButton
                            style={{ marginTop: 24 }}
                            text={strings.save}
                            onPress={onNextPress}
                        //     () => {


                        // }}
                        />
                    </View>

                    {
                        modalVisible ?
                            <GroupHabitAdd
                                visible={modalVisible}
                                setVisible={setModalVisible}
                                targetArr={targetArr}
                                addHabit={addHabit}
                            />
                            :
                            null
                    }
                </View>
            </KeyboardAwareScrollView>


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
                margin: 4

            }
            :
            {
                width: 90,
                alignItems: 'center',
                backgroundColor: 'white',
                paddingVertical: 4,
                borderRadius: 8,
                margin: 4

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
