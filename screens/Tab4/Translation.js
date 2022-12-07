import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  StyleSheet,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { ButtonClass, showToast, width } from '../../Component/Component';
import Header from '../../Component/Header2';
import { TwoLeft } from '../../Component/MyIcons';
import CurrencyInput from 'react-native-currency-input';
import { strings } from '../../Localization/Localization';
import axios from 'axios';

export default class Translation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      payload: props.route.params.payload,
      item: props.route.params.item,
      type: props.route.params.type,
      price: '',
      title: '',
    };
  }

  componentDidMount() {
    console.log('this.state.type', this.state.type);
  }

  onChangeText = price => {
    price = parseInt(price.replace(/\.|,|RM/g, ' ')) / 3;
    console.log(price);
    this.setState({ price: price });
  };


  onTraslationClick() {
    const { payload, item, price, title, type } = this.state;
    if (payload && item && price) {
      if (payload.value < price) {
        showToast('error', 'Сумма жетпейді')
      } else {
        if (type) {
          let Params = {
            wallet_from: payload.id,
            wallet_to: item.id,
            value: price,
            desc: title
          }

          axios.post("wallets/transfer/", Params).then(response => {
            console.log('RESPONSE add:', response.data);
            this.props.route.params.updateData()
            this.props.navigation.goBack()
          })
            .catch(error => {
              console.log('RESPONSE error:', error.response);
              if (error.response && error.response.status == 401) {
                showToast('error', error.response.data.detail);
              }
            });


        } else {
          let Params = {
            wallet_id: payload.id,
            payment_type_id: item.id,
            value: price,
            desc: title
          }

          axios.post("wallets/payment/add/", Params).then(response => {
            console.log('RESPONSE add:', response.data);
            this.props.route.params.updateData()
            this.props.navigation.goBack()
          })
            .catch(error => {
              console.log('RESPONSE error:', error.response);
              if (error.response && error.response.status == 401) {
                showToast('error', error.response.data.detail);
              }
            });
        }
      }





    }
  }

  render() {
    const { payload, type, item, price, title } = this.state;
    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <SafeAreaView style={{ flex: 1 }}>
          <Header onLeftPress={() => this.props.navigation.goBack()} />
          <View style={{ backgroundColor: 'rgba(0, 0, 0, 0.02)', flex: 1 }}>
            <ScrollView>
              <View
                style={{
                  flexDirection: 'row',
                  paddingVertical: 16,
                  justifyContent: 'center',
                }}>
                <View style={{ alignItems: 'center', width: width / 3 }}>
                  <View
                    style={[styles.imgStl, { backgroundColor: payload.color.value }]}>
                    <FastImage
                      source={{
                        uri: payload.icon.icon,
                      }}
                      style={{
                        width: 26, height: 26
                      }}
                    />
                  </View>
                  <Text style={{ color: 'black', fontSize: 13, marginTop: 7 }}>
                    {payload.label} ({Intl.NumberFormat('kz-KZ').format(payload.value)} ₸)
                  </Text>

                </View>
                <View style={{ paddingTop: 20 }}>{TwoLeft}</View>
                <View style={{ alignItems: 'center', width: width / 3 }}>
                  <View
                    style={[styles.imgStl, { backgroundColor: item.color.value }]}>
                    <FastImage
                      source={{
                        uri: item.icon.icon,
                      }}
                      style={{
                        width: 26, height: 26
                      }}
                    />
                  </View>
                  <Text numberOfLines={1} style={{ color: 'black', fontSize: 13, marginTop: 7 }}>
                    {item.label}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  marginHorizontal: 16,
                  backgroundColor: '#fff',
                  paddingTop: 13,
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
                  onChangeValue={price => this.setState({ price })}
                  value={price}
                  onSubmitEditing={() => this.inpRef.focus()}
                  returnKeyType="next"
                />
              </View>

              <View style={[styles.inpStl]}>
                <TextInput
                  ref={e => (this.inpRef = e)}
                  value={title}
                  placeholderTextColor={'rgba(0,0,0,0.4)'}
                  placeholder={'Комментарий'}
                  onChangeText={title => this.setState({ title })}
                  style={{ fontSize: 17, width: width - 58 }}
                  returnKeyType={'done'}
                />
              </View>


              <ButtonClass
                onPress={() => this.onTraslationClick()}
                style={{ marginHorizontal: 16, marginTop: 60 }}
                title={strings.audar}
              />
            </ScrollView>
          </View>
        </SafeAreaView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  inpStl: {
    marginLeft: 16,
    width: width - 32,
    backgroundColor: '#F2F2F7',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  imgStl: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    borderRadius: 100,
  },
});
