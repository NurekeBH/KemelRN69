import React, { useRef, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import ChatHeader from '../../Component/ChatHeader';
import GeneralStatusBarColor from '../../Component/GeneralStatusBarColor';
import FastImage from 'react-native-fast-image';
import { penEdit } from '../../Component/MyIcons';
import { colorApp } from '../../theme/Colors';
import { width } from '../../Component/Component';
import { strings } from '../../Localization/Localization';
import axios from 'axios';

const ChangeGroupProfile = ({ navigation, route }) => {

    const groupInfo = route.params.groupInfo
    const inputRef = useRef()

    const [label, setLabel] = useState(groupInfo?.label)
    const [desc, setDesc] = useState(groupInfo?.desc)


    console.log('groupInfo', groupInfo)




    const onSavePress = () => {
        console.log('aaaaaa')
        axios.put(`https://test.kemeladam.kz/api/chat/group/${groupInfo.id}/`,
            {
                label: label,
                desc: desc,
            })
            .then(response => {
                console.log('RESPONSE LOGIN:', response);
                route.params?.getData()
                navigation.goBack()
            })
            .catch(error => {
                console.log('RESPONSE error:', error.response);
                if (error.response && error.response.status == 401) {
                    showToast('error', error.response.data.detail);
                }
            });
    }




    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <GeneralStatusBarColor backgroundColor={"white"} />


            <ChatHeader
                onLeftPress={() => navigation.goBack()}
                childComponent={(
                    <View
                        style={{ flex: 1, alignItems: 'center' }}>
                        <Text style={{ fontSize: 16, fontWeight: '600', color: '#000000' }}>Өзгерту</Text>
                    </View>
                )}
                right_text2={strings.save}
                onRightPress3={onSavePress}
            />

            <View style={{ margin: 16, alignItems: 'center', justifyContent: 'center' }}>

                <FastImage
                    style={{ width: 132, height: 132, backgroundColor: 'rgba(61, 61, 61, 0.4)', borderRadius: 66 }}
                    source={{ uri: groupInfo?.cover }}
                />
                <TouchableOpacity
                    activeOpacity={0.8}
                    style={{ alignItems: 'center', justifyContent: 'center', position: 'absolute', backgroundColor: 'white', borderRadius: 20, width: 40, height: 40 }}
                >
                    {penEdit('#007AFF')}
                </TouchableOpacity>
            </View>

            <View style={{ margin: 16 }}>
                <Text style={{ color: '#1F3C51', fontSize: 13 }}>Название</Text>
                <View
                    style={{
                        backgroundColor: colorApp.fone,
                        padding: 12,
                        borderRadius: 8,
                        marginTop: 8

                    }}>
                    <TextInput
                        style={{ fontSize: 17, width: width - 60 }}
                        returnKeyType={'next'}
                        value={label}
                        onSubmitEditing={() => {
                            inputRef.current.focus()
                        }}
                        onChangeText={setLabel}
                    />
                </View>

                <Text style={{ color: '#1F3C51', fontSize: 13, marginTop: 24 }}>Описание</Text>
                <View
                    style={{
                        backgroundColor: colorApp.fone,
                        padding: 12,
                        borderRadius: 8,
                        marginTop: 8

                    }}>
                    <TextInput
                        ref={inputRef}
                        value={desc}
                        style={{ fontSize: 17, width: width - 60 }}
                        onChangeText={setDesc}
                        multiline={true}
                    />
                </View>
            </View>


        </View>
    )
}

export default ChangeGroupProfile;
