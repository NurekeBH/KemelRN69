import axios from 'axios';
import React, { Component } from 'react';
import {
    View,
    Text,
    StatusBar,
    SafeAreaView,
    FlatList,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import FastImage from 'react-native-fast-image';

import { pauseIcon, PlayIcon, Right } from '../../Component/MyIcons';
import { strings } from '../../Localization/Localization';
import Player from '../Player/Player';
import TabHeader from '../../Component/TabHeader';
import { dualist } from '../../Component/DataDua';

const itemColors = ['#5BC571', '#4191FF', '#3D3D3D', '#9B8274'];

export default class DuaList extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    componentDidMount() {

    }


    renderItem = ({ item, index }) => (
        <TouchableOpacity
            key={index}
            activeOpacity={0.7}
            style={{
                flexDirection: 'row',
                paddingHorizontal: 20,
                paddingVertical: 14,
                borderBottomWidth: 1,
                borderBottomColor: 'rgba(0, 0, 0, 0.2)',
                alignItems: 'center',
            }}
            onPress={() => {
                this.props.navigation.navigate('SingleDua', { item: item })
            }}>

            <Text style={{ color: 'black', flex: 1, fontSize: 17, fontWeight: '400' }}>{item.title}</Text>
            {Right}
        </TouchableOpacity>
    );

    render() {

        return (
            <View style={{ flex: 1, backgroundColor: '#fff' }}>
                <StatusBar backgroundColor={'#fff'} barStyle="dark-content" />
                <SafeAreaView style={{ flex: 1 }}>
                    <TabHeader
                        rightIcon={null}
                        rightOnPress={null}
                        title={strings.dua}
                        navigation={this.props.navigation}
                        borderBottomBoll={false}
                    />
                    <FlatList
                        data={dualist}
                        keyExtractor={(item, index) => index.toString()}
                        showsVerticalScrollIndicator={false}
                        renderItem={this.renderItem}
                    />

                </SafeAreaView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    vwStl: {
        paddingVertical: 14,
        backgroundColor: '#F2F2F7',
        borderTopWidth: 1,
        borderTopColor: 'rgba(0, 0, 0, 0.08)',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0, 0, 0, 0.08)',
    },
    txStl: {
        fontSize: 13,
        color: '#1C1C1E',
        fontWeight: '600',
        letterSpacing: 0.2,
        marginHorizontal: 16,
    },
    vwStl2: {
        flex: 1,
        padding: 8,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
});
