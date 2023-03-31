import React from 'react';
import { SafeAreaView, TouchableOpacity } from 'react-native';
import { Text, View } from 'react-native';
import { PluseBtn } from '../../Component/MyIcons';
import SimpleButton from '../../Component/SimpleButton';


let group = [
    {}
]


const TabChat = ({ navigation }) => {

    return (
        <SafeAreaView style={{ flex: 1, }}>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>


                <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={() => {
                        navigation.navigate('NewGroup')
                    }}
                    style={{ position: 'absolute', right: 24, bottom: 24, alignItems: 'center', justifyContent: 'center', width: 64, height: 64, backgroundColor: '#3F49DC', borderRadius: 32 }}>
                    {PluseBtn}
                </TouchableOpacity>
            </View>

        </SafeAreaView>
    )
}

export default TabChat;
