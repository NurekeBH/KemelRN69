import React, {Component} from 'react';
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
import {ButtonClass, showToast, width} from '../../Component/Component';
import Header from '../../Component/Header2';
import {TwoLeft} from '../../Component/MyIcons';
import CurrencyInput from 'react-native-currency-input';
import {strings} from '../../Localization/Localization';
import axios from 'axios';

export default class Replenishment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      item: props.route.params.item,
      title: '',
      price: 0,
    };
  }

  componentDidMount() {
    console.log('this.state.payload', this.state.payload);
  }

  onChangeText = price => {
    price = parseInt(price.replace(/\.|,|RM/g, ' ')) / 3;
    console.log(price);
    this.setState({price: price});
  };

  onAddpress() {
    const {item, price, title} = this.state;
    if (price) {
      axios
        .post('wallets/replenishment/add/', {
          wallet_id: item.id,
          value: price,
          comment: title,
        })
        .then(response => {
          console.log('RESPONSE add:', response.data);
          this.props.navigation.pop(2);
        })
        .catch(error => {
          console.log('RESPONSE error:', error.response);
          if (error.response && error.response.status == 401) {
            showToast('error', error.response.data.detail);
          }
        });
    }
  }

  render() {
    const {item, price, title} = this.state;
    return (
      <View style={{flex: 1, backgroundColor: '#fff'}}>
        <SafeAreaView style={{flex: 1}}>
          <Header onLeftPress={() => this.props.navigation.goBack()} />
          <View style={{backgroundColor: 'rgba(0, 0, 0, 0.02)', flex: 1}}>
            <ScrollView>
              <View
                style={{
                  paddingVertical: 16,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 16,
                }}>
                <View
                  style={{
                    backgroundColor: item.color.value,
                    borderRadius: 100,
                    width: 60,
                    height: 60,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <FastImage
                    source={{
                      uri: item.icon.icon,
                    }}
                    style={{
                      width: 26,
                      height: 26,
                    }}
                  />
                </View>
                <Text numberOfLines={1} style={{fontSize: 13, marginTop: 7}}>
                  {item.label}
                </Text>
              </View>
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
                  style={{fontSize: 40}}
                  keyboardType="number-pad"
                  maxLength={12}
                  onChangeValue={price => this.setState({price})}
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
                  onChangeText={title => this.setState({title})}
                  style={{fontSize: 17, width: width - 58}}
                  returnKeyType={'done'}
                />
              </View>

              <ButtonClass
                style={{marginHorizontal: 16, marginTop: 50}}
                title={'Толықтыру'}
                onPress={() => this.onAddpress()}
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
});
