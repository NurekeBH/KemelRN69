import React, { Component } from 'react';
import { View, Text, SafeAreaView, StatusBar, TouchableOpacity, ScrollView } from 'react-native';
import { HeaderStyle } from '../../Component/Component';
import { Left_icon } from '../../Component/MyIcons';

export default class SingleDua extends Component {
    constructor(props) {
        super(props);
        this.state = {
            item: this.props.route.params?.item
        };
    }

    render() {
        const { item } = this.state
        return (
            <View style={{ backgroundColor: 'white', flex: 1 }}>
                <StatusBar backgroundColor={'#fff'} barStyle="dark-content" />
                <SafeAreaView style={{ flex: 1, }}>
                    <View style={HeaderStyle}>
                        <TouchableOpacity
                            onPress={() => this.props.navigation.goBack()}
                            activeOpacity={0.7}>
                            {Left_icon}
                        </TouchableOpacity>

                    </View>
                    <ScrollView style={{ flex: 1, }}>
                        <View style={{ flex: 1, backgroundColor: 'white', padding: 16 }}>
                            <Text style={{ flxe: 1, fontSize: 20, color: '#000000', fontWeight: '600' }}> {item.title} </Text>
                            <Text style={{ marginTop: 16, fontSize: 16, color: '#000000', }}> {item.desc} </Text>
                        </View>
                    </ScrollView>

                </SafeAreaView>
            </View>
        );
    }
}
