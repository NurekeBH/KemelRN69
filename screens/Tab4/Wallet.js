import axios from 'axios';
import React, { Component } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    StatusBar,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    TextInput,
    Alert,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {
    GetTime,
    ButtonClass,
    showToast,
    width,
} from '../../Component/Component';
import Header from '../../Component/Header2';
import {
    Bottom,
    penEdit,
    PenMini,
    Pluse,
    PluseBtn,
    PluseWallet,
    swipeDelete,
} from '../../Component/MyIcons';
import { strings } from '../../Localization/Localization';
import 'intl';
import 'intl/locale-data/jsonp/kk-KZ';
import Collapsible from 'react-native-collapsible';
import Swipeout from '../../Swipeout/index'
import Modal from 'react-native-modalbox';
import CurrencyInput from 'react-native-currency-input';

export default class Wallet extends Component {
    constructor(props) {
        super(props);
        this.state = {
            itemSource: props.route.params.item,
            expence: [],
            isLoading: true,
            item: this.props.route.params.item,
            type: this.props.route.params.type,
            response: null,
            total: 0,
            isOpen: false,
            modalType: 0,
            modalItem: '',
            modalValue: '',
            modalLabel: '',

            kiris: [],
            isLoadingKiris: true,
            isCollapsed: true,

            History: [],
            isLoadingHistory: true,

            History2: [],
            isLoadingHistory2: true,

            label: this.props.route.params.item.label,
        };
    }

    componentDidMount() {
        const { item, type } = this.state;

        this.getTypesStatistic();
        console.log('type', type)
        if (type) {
            this.getTypesHistory('transfer');
            this.getTypesHistory('replenishment');

        }
    }

    getTypesStatistic() {
        const { item, type } = this.state;
        let url = '';
        if (!type) {
            url = 'wallets/payment/types/' + item.id + '/statistics/';
        } else {
            url =
                'wallets/payment/' +
                item.id +
                '/statistics/?date=' +
                GetTime(new Date(), 'YYYY-MM-DD');
        }

        axios
            .get(url)
            .then(response => {
                console.log('RESPONSE statistics:', response);
                let result = 0;
                let expence = [];
                if (!type) {
                    expence = response.data.data.payments;
                    result = response.data.data.payments.reduce(
                        (total, currentValue) => (total = total + currentValue.value),
                        0,
                    );
                } else {
                    expence = response.data.payments;
                    result = response.data.payments.reduce(
                        (total, currentValue) => (total = total + currentValue.value),
                        0,
                    );
                }

                expence.sort((a, b) => b.id - a.id);

                console.log('RESPONSE expence:', expence);

                this.setState({
                    isOpen: false,
                    isLoading: false,
                    response: response.data,
                    expence: expence,
                    total: result,
                });
            })
            .catch(error => {
                this.setState({
                    isLoading: false,
                });
                console.log('RESPONSE statistics error:', error.response);
                if (error.response && error.response.status == 401) {
                    showToast('error', error.response.data.detail);
                }
            });

        if (type) {
            this.Getreplenishment();
        }
    }

    Getreplenishment() {
        axios
            .get(`wallets/replenishment/${this.state.item.id}/statistics/`)
            .then(response => {
                console.log('RESPONSE replenishment:', response);
                this.setState({
                    isLoadingKiris: false,
                    kiris: response.data.replenishments,
                });
            })
            .catch(error => {
                this.setState({
                    isLoadingKiris: false,
                });
                console.log('RESPONSE replenishment error:', error.response);
                if (error.response && error.response.status == 401) {
                    showToast('error', error.response.data.detail);
                }
            });
    }

    getTypesHistory(value) {



        axios
            .get(`wallets/transfer/${this.state.item.id}/statistics/?code=${value}`)
            .then(response => {
                console.log('RESPONSE History:', value, response);
                if (value == 'transfer') {
                    this.setState({
                        isLoadingHistory: false,
                        History: response.data.transfers,
                    });
                } else {
                    this.setState({
                        isLoadingHistory2: false,
                        History2: response.data.transfers,
                    });
                }

            })
            .catch(error => {

                console.log('RESPONSE replenishment error:', error.response);
                if (error.response && error.response.status == 401) {
                    showToast('error', error.response.data.detail);
                }
            });
    }

    onSaveChabge() {
        const { modalType, modalItem, modalValue, modalLabel } = this.state;
        let url =
            modalType == 1
                ? `wallets/payment/${modalItem.id}/update/`
                : `wallets/replenishment/${modalItem.id}/update/`;

        let params =
            modalType == 1
                ? {
                    desc: modalLabel,
                    value: modalValue,
                }
                : {
                    comment: modalLabel,
                    value: modalValue,
                };

        axios
            .put(url, params)
            .then(response => {
                console.log('RESPONSE onSaveChabge:', response);

                this.getTypesStatistic();
            })
            .catch(error => {
                console.log('RESPONSE onSaveChabge:', error.response);
                if (error.response && error.response.status == 401) {
                    showToast('error', error.response.data.detail);
                }
            });
    }

    onBackPress() {
        const { label, item, type } = this.state;

        if (label == item.label) this.props.navigation.goBack();
        else {
            let url = type
                ? `wallets/wallet/${item.id}/update/`
                : `wallets/payment/types/${item.id}/update/`;
            let params = type
                ? {
                    label: label,
                    icon_id: item.icon.id,
                    color_id: item.color.id,
                }
                : {
                    label: label,
                    icon_id: item.icon.id,
                    color_id: item.color.id,
                };

            axios
                .put(url, params)
                .then(response => {
                    console.log('RESPONSE onSaveChabge:', response);
                })
                .catch(error => {
                    console.log('RESPONSE onSaveChabge:', error.response);
                    if (error.response && error.response.status == 401) {
                        showToast('error', error.response.data.detail);
                    }
                })
                .finally(() => {
                    this.props.navigation.goBack();
                });
        }
    }

    onDeletePress() {
        const { label, item, type } = this.state;
        let url = type
            ? `wallets/wallet/${item.id}/`
            : `wallets/payment/types/${item.id}/`;

        Alert.alert('Әмиянды өшіресізбе? ', '', [
            {
                text: 'Жоқ',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },
            {
                text: 'Иә',
                onPress: () =>
                    axios
                        .delete(url)
                        .then(response => {
                            console.log('RESPONSE delete:', response);
                        })
                        .catch(error => {
                            console.log('RESPONSE delete:', error.response);
                            if (error.response?.data?.detail) {
                                showToast('error', error.response.data.detail);
                            }
                        })
                        .finally(() => {
                            this.props.navigation.goBack();
                        }),
            },
        ]);
    }

    render() {
        const {
            type,
            total,
            item,
            itemSource,
            expence,
            isLoading,
            kiris,
            isLoadingKiris,
            isCollapsed,
            isOpen,
            modalType,
            modalItem,
            modalValue,
            modalLabel,
            label,
            History,
            isLoadingHistory,
            History2,
        } = this.state;

        return (
            <View style={{ flex: 1, backgroundColor: '#fff' }}>
                <StatusBar backgroundColor={'#fff'} barStyle="dark-content" />
                <SafeAreaView style={{ flex: 1 }}>
                    <Header
                        onLeftPress={() => this.onBackPress()}
                        title={itemSource.name}
                        rightSvg={type}
                        right_icon={type ? Pluse : null}
                        onRightPress={() => {
                            this.props.navigation.navigate('Replenishment', {
                                item: item,
                            });
                        }}
                        right_icon2={swipeDelete}
                        onRightPress2={() => {
                            this.onDeletePress();
                        }}
                    />

                    <Modal
                        ref={ref => {
                            this.purposeMdl = ref;
                        }}
                        position="bottom"
                        backButtonClose
                        isOpen={isOpen}
                        onClosed={() => {
                            this.setState({
                                isOpen: false,
                            });
                        }}
                        style={{
                            height: 450,
                            borderTopRightRadius: 12,
                            borderTopLeftRadius: 12,
                        }}>
                        <View>
                            <Text
                                style={{
                                    color: 'black',
                                    padding: 16,
                                    textAlign: 'center',
                                    fontSize: 17,
                                    fontWeight: '600',
                                }}>
                                {strings.edeit}
                            </Text>
                            <View
                                style={{
                                    marginHorizontal: 16,
                                    backgroundColor: '#fff',
                                    paddingTop: 16,
                                    marginTop: 16,
                                    paddingBottom: 6,
                                    borderRadius: 16,
                                    alignItems: 'center',
                                }}>
                                <Text
                                    style={{
                                        textTransform: 'uppercase',
                                        fontSize: 13,
                                        fontWeight: '600',
                                        color: 'rgba(0,0,0,0.4)',
                                    }}>
                                    Сумма
                                </Text>
                                <CurrencyInput
                                    placeholder={'0'}
                                    suffix="₸"
                                    delimiter=" "
                                    separator=" "
                                    autoFocus
                                    precision={0}
                                    style={{ fontSize: 40 }}
                                    keyboardType="number-pad"
                                    maxLength={12}
                                    onChangeValue={modalValue => this.setState({ modalValue })}
                                    value={modalValue}
                                    onSubmitEditing={() => this.inpRef.focus()}
                                    returnKeyType="next"
                                />
                            </View>
                            <View style={[styles.inpStl]}>
                                <TextInput
                                    ref={e => (this.inpRef = e)}
                                    value={modalLabel}
                                    placeholderTextColor={'rgba(0,0,0,0.4)'}
                                    placeholder={'Комментарий'}
                                    onChangeText={modalLabel => this.setState({ modalLabel })}
                                    style={{ fontSize: 17, width: width - 58 }}
                                    returnKeyType={'done'}
                                />
                            </View>
                            <ButtonClass
                                style={{ marginHorizontal: 16, marginTop: 50 }}
                                title={strings.save}
                                onPress={() => this.onSaveChabge()}
                            />
                        </View>
                    </Modal>

                    <View style={{ flex: 1 }}>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <TouchableOpacity
                                onPress={() => this.props.navigation.navigate('ChooseIcons')}
                                activeOpacity={0.7}
                                style={{
                                    alignSelf: 'center',
                                    marginVertical: 24,
                                    borderRadius: 70,
                                }}>
                                <View
                                    style={{
                                        width: 120,
                                        height: 120,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginTop: 4,
                                        borderRadius: 100,
                                        backgroundColor: item.color.value,
                                        borderWidth: 0.5,
                                        borderColor: 'rgba(0,0,0,0.2)'
                                    }}>
                                    <FastImage
                                        source={{
                                            uri: item.icon.icon,
                                        }}
                                        style={{
                                            width: 50,
                                            height: 50,
                                        }}
                                    />
                                </View>
                                <View style={styles.vwStl}>{PenMini}</View>
                            </TouchableOpacity>
                            <View style={styles.vwStl2}>
                                <View style={{ alignItems: 'center' }}>
                                    <TextInput
                                        style={{
                                            backgroundColor: '#ececec',
                                            fontSize: 20,
                                            fontWeight: '500',
                                            paddingHorizontal: 16,
                                            paddingVertical: 12,
                                            borderRadius: 4,
                                        }}
                                        autoFocus={false}
                                        value={label}
                                        onChangeText={label => {
                                            this.setState({ label });
                                        }}
                                    />
                                    <Text style={styles.txtStl}>
                                        {isLoading
                                            ? '0'
                                            : Intl.NumberFormat('kz-KZ').format(item.value) + ' ₸'}
                                    </Text>
                                </View>
                            </View>






                            {type ? (
                                <View >
                                    <Text
                                        style={{
                                            color: 'black',
                                            fontSize: 22,
                                            fontWeight: '700',
                                            flex: 1,
                                            margin: 16,
                                        }}>
                                        {strings.stordo}
                                    </Text>
                                    {/* <TouchableOpacity
                                        activeOpacity={0.7}
                                        onPress={() => {
                                            this.setState({
                                                isCollapsed: !isCollapsed,
                                            });
                                        }}
                                        style={styles.www}>

                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            {Bottom}
                                        </View>
                                    </TouchableOpacity> */}

                                    {/* <Collapsible
                                        collapsed={isCollapsed}
                                        style={{ paddingBottom: 16 }}> */}
                                    {kiris.map((item1, index) => (
                                        <Swipeout
                                            autoClose={true}
                                            style={{
                                                backgroundColor: 'white',
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
                                                            <Text
                                                                style={{
                                                                    marginTop: 4,
                                                                    fontSize: 8,
                                                                    color: '#FF3B30',
                                                                }}>
                                                                {strings.delete}
                                                            </Text>
                                                        </View>
                                                    ),
                                                    onPress: () => {
                                                        axios
                                                            .delete(`wallets/replenishment/${item1.id}/`)
                                                            .then(response => {
                                                                console.log(
                                                                    'RESPONSE replenishment:',
                                                                    response,
                                                                );

                                                                this.Getreplenishment();
                                                            })
                                                            .catch(error => {
                                                                console.log(
                                                                    'RESPONSE replenishment:',
                                                                    error.response,
                                                                );
                                                                if (
                                                                    error.response &&
                                                                    error.response.status == 401
                                                                ) {
                                                                    showToast(
                                                                        'error',
                                                                        error.response.data.detail,
                                                                    );
                                                                }
                                                            });
                                                    },
                                                },
                                                {
                                                    component: (
                                                        <View
                                                            style={{
                                                                backgroundColor: '#3F49DC',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                flex: 1,
                                                                maxHeight: 200,
                                                            }}>
                                                            {penEdit}
                                                            <Text
                                                                style={{
                                                                    marginTop: 4,
                                                                    fontSize: 8,
                                                                    color: 'white',
                                                                }}>
                                                                изменить
                                                            </Text>
                                                        </View>
                                                    ),
                                                    onPress: () => {
                                                        this.setState({
                                                            modalType: 2,
                                                            modalItem: item1,
                                                            modalValue: item1.value,
                                                            modalLabel: item1.comment
                                                                ? item1.comment
                                                                : item.label,
                                                            isOpen: true,
                                                        });
                                                    },
                                                },
                                            ]}>
                                            <View style={styles.tableStl} key={index}>
                                                <View style={{ flex: 1 }}>
                                                    <Text style={{ color: 'black', fontSize: 17 }}>
                                                        {item1.comment ? item1.comment : item.label}
                                                    </Text>
                                                    <Text
                                                        style={{
                                                            fontSize: 12,
                                                            marginTop: 4,
                                                            color: '#8E8E93',
                                                        }}>
                                                        {GetTime(item1.updated_at, 'D MMM, h:mm')}
                                                    </Text>
                                                </View>
                                                <Text
                                                    style={{
                                                        color: 'black',
                                                        fontSize: 15,
                                                        textAlign: 'right',
                                                    }}>
                                                    +{' '}
                                                    {Intl.NumberFormat('kz-KZ').format(item1.value) +
                                                        ' ₸'}
                                                </Text>
                                            </View>
                                        </Swipeout>
                                    ))
                                    }

                                    {
                                        History2.map((item, index) => (
                                            <Swipeout
                                                autoClose={true}
                                                style={{
                                                    backgroundColor: 'white',
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
                                                                <Text
                                                                    style={{
                                                                        marginTop: 4,
                                                                        fontSize: 8,
                                                                        color: '#FF3B30',
                                                                    }}>
                                                                    {strings.delete}
                                                                </Text>
                                                            </View>
                                                        ),
                                                        onPress: () => {
                                                            axios
                                                                .delete(`wallets/transfer/${item.id}/`)
                                                                .then(response => {
                                                                    console.log('RESPONSE replenishment:', response);

                                                                    this.getTypesHistory('replenishment');
                                                                })
                                                                .catch(error => {
                                                                    console.log(
                                                                        'RESPONSE replenishment:',
                                                                        error.response,
                                                                    );
                                                                    if (
                                                                        error.response &&
                                                                        error.response.status == 401
                                                                    ) {
                                                                        showToast(
                                                                            'error',
                                                                            error.response.data.detail,
                                                                        );
                                                                    }
                                                                });
                                                        },
                                                    }
                                                ]}>
                                                <View style={styles.tableStl} key={index}>
                                                    <View style={{ flex: 1 }}>
                                                        <Text style={{ color: 'black', fontSize: 17 }}>
                                                            {item.wallet_from.label}
                                                        </Text>
                                                        <Text
                                                            style={{
                                                                fontSize: 12,
                                                                marginTop: 4,
                                                                color: '#8E8E93',
                                                            }}>
                                                            {GetTime(item.updated_at, 'D MMM, h:mm')}
                                                        </Text>
                                                    </View>
                                                    <View>
                                                        <Text
                                                            style={{
                                                                fontSize: 15,
                                                                color: '#000000',
                                                                textAlign: 'right',
                                                            }}>
                                                            +{' '}
                                                            {Intl.NumberFormat('kz-KZ').format(item.value) + ' ₸'}
                                                        </Text>
                                                        <Text
                                                            style={{
                                                                fontSize: 14,
                                                                color: '#000000',
                                                                textAlign: 'right',
                                                            }}>
                                                            {item.desc}
                                                        </Text>
                                                    </View>
                                                </View>
                                            </Swipeout>
                                        ))
                                    }

                                    {/* </Collapsible> */}
                                </View>
                            ) : null}




                            {/* /////******************************************************** */}

                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={() => {
                                    this.setState({
                                        isCollapsed: !isCollapsed,
                                    });
                                }}
                                style={styles.www}>
                                <Text
                                    style={{
                                        color: 'black',
                                        fontSize: 22,
                                        fontWeight: '700',
                                        flex: 1,
                                    }}>
                                    {strings.stor}
                                </Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    {Bottom}
                                </View>
                            </TouchableOpacity>


                            <Collapsible
                                collapsed={isCollapsed}
                                style={{ paddingBottom: 16 }}>

                                {expence.map((item1, index) => (
                                    <Swipeout
                                        autoClose={true}
                                        style={{
                                            backgroundColor: 'white',
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
                                                        <Text
                                                            style={{
                                                                marginTop: 4,
                                                                fontSize: 8,
                                                                color: '#FF3B30',
                                                            }}>
                                                            {strings.delete}
                                                        </Text>
                                                    </View>
                                                ),
                                                onPress: () => {
                                                    axios
                                                        .delete(`wallets/payment/${item1.id}/`)
                                                        .then(response => {
                                                            console.log('RESPONSE replenishment:', response);

                                                            this.getTypesStatistic();
                                                        })
                                                        .catch(error => {
                                                            console.log(
                                                                'RESPONSE replenishment:',
                                                                error.response,
                                                            );
                                                            if (
                                                                error.response &&
                                                                error.response.status == 401
                                                            ) {
                                                                showToast('error', error.response.data.detail);
                                                            }
                                                        });
                                                },
                                            },
                                            {
                                                component: (
                                                    <View
                                                        style={{
                                                            backgroundColor: '#3F49DC',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            flex: 1,
                                                            maxHeight: 200,
                                                        }}>
                                                        {penEdit}
                                                        <Text
                                                            style={{
                                                                marginTop: 4,
                                                                fontSize: 8,
                                                                color: 'white',
                                                            }}>
                                                            изменить
                                                        </Text>
                                                    </View>
                                                ),
                                                onPress: () => {
                                                    this.setState({
                                                        modalType: 1,
                                                        modalItem: item1,
                                                        modalValue: item1.value,
                                                        modalLabel: item1.desc
                                                            ? item1.desc
                                                            : item1.payment_type.label,
                                                        isOpen: true,
                                                    });
                                                },
                                            },
                                        ]}>
                                        <View style={styles.tableStl} key={index}>
                                            <View style={{ flex: 1 }}>
                                                <Text style={{ color: 'black', fontSize: 17 }}>
                                                    {item1.desc ? item1.desc : item1.payment_type.label}
                                                </Text>
                                                <Text
                                                    style={{
                                                        fontSize: 12,
                                                        marginTop: 4,
                                                        color: '#8E8E93',
                                                    }}>
                                                    {GetTime(item1.updated_at, 'D MMM, h:mm')}
                                                </Text>
                                            </View>
                                            <View>
                                                <Text
                                                    style={{
                                                        fontSize: 15,
                                                        color: '#FF3B30',
                                                        textAlign: 'right',
                                                    }}>
                                                    -{' '}
                                                    {Intl.NumberFormat('kz-KZ').format(item1.value) + ' ₸'}
                                                </Text>
                                                <Text
                                                    style={{
                                                        fontSize: 14,
                                                        color: '#FF3B30',
                                                        textAlign: 'right',
                                                    }}>
                                                    {item1.desc}
                                                </Text>
                                            </View>
                                        </View>
                                    </Swipeout>
                                ))}

                                {
                                    History.map((item, index) => (
                                        <Swipeout
                                            autoClose={true}
                                            style={{
                                                backgroundColor: 'white',
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
                                                            <Text
                                                                style={{
                                                                    marginTop: 4,
                                                                    fontSize: 8,
                                                                    color: '#FF3B30',
                                                                }}>
                                                                {strings.delete}
                                                            </Text>
                                                        </View>
                                                    ),
                                                    onPress: () => {
                                                        axios
                                                            .delete(`wallets/transfer/${item.id}/`)
                                                            .then(response => {
                                                                console.log('RESPONSE replenishment:', response);

                                                                this.getTypesHistory('transfer');
                                                            })
                                                            .catch(error => {
                                                                console.log(
                                                                    'RESPONSE replenishment:',
                                                                    error.response,
                                                                );
                                                                if (
                                                                    error.response &&
                                                                    error.response.status == 401
                                                                ) {
                                                                    showToast('error', error.response.data.detail);
                                                                }
                                                            });
                                                    },
                                                },

                                            ]}>
                                            <View style={styles.tableStl} key={index}>
                                                <View style={{ flex: 1 }}>
                                                    <Text style={{ color: 'black', fontSize: 17 }}>
                                                        {item.wallet_to.label}
                                                    </Text>
                                                    <Text
                                                        style={{
                                                            fontSize: 12,
                                                            marginTop: 4,
                                                            color: '#8E8E93',
                                                        }}>
                                                        {GetTime(item.updated_at, 'D MMM, h:mm')}
                                                    </Text>
                                                </View>
                                                <View>
                                                    <Text
                                                        style={{
                                                            fontSize: 15,
                                                            color: '#FF3B30',
                                                            textAlign: 'right',
                                                        }}>
                                                        -{' '}
                                                        {Intl.NumberFormat('kz-KZ').format(item.value) + ' ₸'}
                                                    </Text>
                                                    <Text
                                                        style={{
                                                            fontSize: 14,
                                                            color: '#FF3B30',
                                                            textAlign: 'right',
                                                        }}>
                                                        {item.desc}
                                                    </Text>
                                                </View>
                                            </View>
                                        </Swipeout>
                                    ))
                                }
                            </Collapsible>


                        </ScrollView>
                    </View>
                </SafeAreaView >
            </View >
        );
    }
}

const styles = StyleSheet.create({
    vwStl: {
        width: 34,
        aspectRatio: 1,
        borderWidth: 3,
        borderColor: '#fff',
        backgroundColor: '#3F49DC',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 30,
        position: 'absolute',
        right: 0,
        bottom: 0,
    },
    inpStl: {
        marginLeft: 16,
        width: width - 32,
        backgroundColor: '#F2F2F7',
        padding: 12,
        borderRadius: 8,
        marginTop: 16,
    },

    www: {
        padding: 10,
        marginTop: 16,
        borderRadius: 6,
        marginHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#E0E2FF',
    },
    txtStl: {
        marginTop: 20,
        textAlign: 'center',
        fontSize: 34,
    },
    vwStl2: {
        flexDirection: 'row',
        width: width - 32,
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
    },
    tableStl: {
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0, 0, 0, 0.2)',
    },
});
