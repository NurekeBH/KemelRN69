/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    StatusBar,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Alert,
    RefreshControl,
} from 'react-native';
import {
    Header2,
    HeaderStyle,
    showToast,
    width,
} from '../../Component/Component';
import { strings } from '../../Localization/Localization';
import 'intl';
import 'intl/locale-data/jsonp/kk-KZ';
import FastImage from 'react-native-fast-image';
import { DraxProvider, DraxView, DraxScrollView } from 'react-native-drax';
import { addWallet, Calendars } from '../../Component/MyIcons';
import axios from 'axios';
import TabHeader from '../../Component/TabHeader';

export const HeaderList = ({ title, price }) => (
    <View
        style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        }}>
        <Text style={{ color: 'black', fontSize: 17, fontWeight: '600' }}>{title}</Text>
        <Text style={{ color: 'black', fontSize: 17, fontWeight: '600' }}>
            {Intl.NumberFormat('kz-KZ').format(price)} ₸
        </Text>
    </View>
);
const ITEM_WIDTH = width / 5.1;

export default class Tab4 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            income: [],
            isLoading: true,
            incomeSum: 0,

            types: [],
            typesSum: 0,
        };
    }

    componentDidMount() {
        const unsubscribe = this.props.navigation.addListener('focus', () => {
            this.getWalletList();
            this.getTypesList();
        });
    }

    getWalletList() {
        axios
            .get('wallets/wallet/')
            .then(response => {

                console.log('wallet', response.data)
                let incomeSum = response.data.reduce((prev, current) => {
                    return prev + +current.value;
                }, 0);

                response.data.forEach((item, index) => {
                    item.type = 'income';
                });

                this.setState({
                    incomeSum: incomeSum,
                    income: response.data,
                    isLoading: false,
                });
            })
            .catch(error => {
                this.setState({
                    isLoading: false,
                });
                console.log('RESPONSE error:', error.response);
                if (error.response && error.response.status == 401) {
                    showToast('error', error.response.data.detail);
                }
            });
    }

    getTypesList() {
        axios
            .get('wallets/payment/types/statistics/')
            .then(response => {
                console.log('payment', response.data)

                let typesSum = response.data.data.reduce((prev, current) => {
                    return prev + +current.value;
                }, 0);

                response.data.data.forEach((item, index) => {
                    item.type = 'types';
                });

                this.setState({
                    typesSum: typesSum,
                    types: response.data.data,
                    isLoading: false,
                });
            })
            .catch(error => {
                this.setState({
                    isLoading: false,
                });
                console.log('RESPONSE error:', error.response);
                if (error.response && error.response.status == 401) {
                    showToast('error', error.response.data.detail);
                }
            });
    }

    gotranslation = (payload, item) => {
        console.log('payload', payload)
        console.log('item', item)
        this.props.navigation.navigate('Translation', {
            item: item,
            payload: payload,
            type: item.type == payload.type,
            updateData: this.updateData,
        });

    };

    updateData = () => {
        this.getWalletList();
        this.getTypesList();
    };

    render() {
        const { isLoading, income, types, incomeSum, typesSum } = this.state;
        return (
            <View style={{ flex: 1, backgroundColor: '#fff' }}>
                <StatusBar backgroundColor={'#fff'} barStyle="dark-content" />
                <SafeAreaView style={{ flex: 1 }}>
                    <TabHeader
                        rightIcon={Calendars}
                        rightOnPress={() => this.props.navigation.navigate('Statistics')}
                        borderBottomBoll
                        title={strings.tab4}
                        navigation={this.props.navigation}
                    />
                    <DraxProvider>
                        <DraxScrollView
                            refreshControl={
                                <RefreshControl
                                    refreshing={isLoading}
                                    onRefresh={() => {
                                        this.getWalletList();
                                    }}
                                />
                            }
                            showsVerticalScrollIndicator={false}>
                            <View style={{ flex: 1, padding: 16 }}>

                                {/* ///////INCOME//////// */}
                                <View>
                                    <HeaderList title={strings.kiris} price={incomeSum} />
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            flexWrap: 'wrap',
                                            marginTop: 3,
                                            alignItems: 'center',
                                        }}>
                                        {income.map((item, index) => (
                                            <DraxView
                                                onDragEnd={event => {
                                                    console.log('onDragEnd111', event);
                                                    if (
                                                        event.dragTranslation.x < 10 &&
                                                        event.dragTranslation.x > -10 &&
                                                        event.dragTranslation.y < 10 &&
                                                        event.dragTranslation.y > -10
                                                    ) {
                                                        this.props.navigation.navigate('Wallet', {
                                                            type: true,
                                                            item: item,
                                                        });
                                                    }
                                                }}
                                                onReceiveDragDrop={({ dragged: { payload } }) => {
                                                    console.log('onDragEnd3item', item);
                                                    console.log('onDragEnd3payload', payload);

                                                    this.gotranslation(payload, item);
                                                }}
                                                key={index}
                                                payload={item}
                                                style={{
                                                    alignItems: 'center',
                                                    marginTop: 8,
                                                    paddingRight: (index + 1) % 4 == 0 ? 0 : 16,
                                                    marginVertical: 8,
                                                }}>
                                                <Text
                                                    numberOfLines={1}
                                                    style={{ fontSize: 12, color: '#8E8E93' }}>
                                                    {item.label}
                                                </Text>
                                                <View
                                                    style={[
                                                        styles.imgStl,
                                                        {
                                                            backgroundColor: item.color.value,
                                                            borderWidth: 0.5,
                                                            borderColor: 'rgba(0,0,0,0.2)'
                                                        },
                                                    ]}>
                                                    <FastImage
                                                        source={{
                                                            uri: item.icon.icon,
                                                        }}
                                                        style={{
                                                            width: 32,
                                                            height: 32,
                                                        }}
                                                    />
                                                </View>

                                                <Text
                                                    style={{
                                                        color: 'black',
                                                        fontSize: 13,
                                                        marginTop: 8,
                                                    }}>
                                                    {Intl.NumberFormat('kz-KZ').format(item.value)} ₸
                                                </Text>
                                            </DraxView>
                                        ))}
                                        <TouchableOpacity
                                            onPress={() =>
                                                this.props.navigation.navigate('AddWallet', {
                                                    type: 1,
                                                    updateData: this.updateData,
                                                })
                                            }
                                            activeOpacity={0.7}
                                            style={styles.btnStl}>
                                            {addWallet}
                                        </TouchableOpacity>
                                    </View>

                                    {/* ///////WALLET//////// */}
                                    <View
                                        style={{ height: 1, backgroundColor: 'rgba(0, 0, 0, 0.2)' }}
                                    />
                                    <View style={{ marginTop: 15 }}>
                                        <HeaderList title={strings.ras} price={typesSum} />
                                        <View style={styles.receiver}>
                                            <View
                                                style={{
                                                    flexDirection: 'row',
                                                    flexWrap: 'wrap',
                                                    alignItems: 'center',
                                                    marginTop: 3,
                                                }}>
                                                {types.map((item, index) => (
                                                    <DraxView
                                                        key={index}
                                                        onDragEnd={event => {
                                                            console.log('onDragEnd222222', event);
                                                            if (
                                                                event.dragTranslation.x < 10 &&
                                                                event.dragTranslation.x > -10 &&
                                                                event.dragTranslation.y < 10 &&
                                                                event.dragTranslation.y > -10
                                                            ) {
                                                                this.props.navigation.navigate('Wallet', {
                                                                    type: false,
                                                                    item: item,
                                                                });
                                                            }
                                                        }}
                                                        payload={item}
                                                        onReceiveDragDrop={({ dragged: { payload } }) => {
                                                            console.log('onDragEnd33333', payload);

                                                            this.gotranslation(payload, item);
                                                        }}
                                                        style={{
                                                            alignItems: 'center',
                                                            marginTop: 8,
                                                            paddingRight: (index + 1) % 4 == 0 ? 0 : 16,
                                                            marginVertical: 8,
                                                        }}>
                                                        <Text style={{ fontSize: 12, color: '#8E8E93' }}>
                                                            {item.label}
                                                        </Text>
                                                        <View
                                                            style={[
                                                                styles.imgStl,
                                                                {
                                                                    backgroundColor: item.color.value,
                                                                    borderWidth: 0.5,
                                                                    borderColor: 'rgba(0,0,0,0.2)'
                                                                },
                                                            ]}>
                                                            <FastImage
                                                                source={{
                                                                    uri: item.icon.icon,
                                                                }}
                                                                style={{
                                                                    width: 32,
                                                                    height: 32,
                                                                }}
                                                            />
                                                        </View>

                                                        <Text style={{ color: 'black', fontSize: 13, marginTop: 8 }}>
                                                            {Intl.NumberFormat('kz-KZ').format(item.value)} ₸
                                                        </Text>
                                                    </DraxView>
                                                ))}
                                                <TouchableOpacity
                                                    onPress={() =>
                                                        this.props.navigation.navigate('AddWallet', {
                                                            type: 2,
                                                            updateData: this.updateData,
                                                        })
                                                    }
                                                    activeOpacity={0.7}
                                                    style={styles.btnStl}>
                                                    {addWallet}
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>

                                    {/* ///////EXPENSES//////// */}
                                </View>

                            </View>
                        </DraxScrollView>
                    </DraxProvider>
                </SafeAreaView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    imgStl: {
        width: 60,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 4,
        borderRadius: 100,
    },
    btnStl: {
        width: 60,
        height: 60,
        borderRadius: 100,
        backgroundColor: '#E0EFFF',
        marginTop: 8,
        marginBottom: 33,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
