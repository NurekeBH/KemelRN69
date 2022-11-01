import axios from 'axios';
import React, { Component } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { ButtonClass, showToast, width } from '../../Component/Component';
import Header from '../../Component/Header2';
import { PenMini } from '../../Component/MyIcons';
import { strings } from '../../Localization/Localization';

export default class AddWallet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nameWall: '',
      price: '0',
      iconItem: '',
      colorItem: '',
      type: this.props.route.params.type,
    };
  }

  getIcon = (selectedColor, selectedIcon) => {
    console.log('selectedIcon', selectedIcon);
    console.log('selectedColor', selectedColor);
    this.setState({
      iconItem: selectedIcon,
      colorItem: selectedColor,
      nameWall: selectedIcon.label,
    });
  };

  onSaveClick() {
    const { nameWall, type, iconItem, colorItem } = this.state;
    let URL = '';
    let Params;
    if (type == 1) {
      URL = 'wallets/wallet/add/';
      Params = {
        icon_id: iconItem.id,
        color_id: colorItem.id,
        label: nameWall,
      };
    } else {
      URL = 'wallets/payment/types/add/';
      Params = {
        icon_id: iconItem.id,
        color_id: colorItem.id,
        label: nameWall,
      };
    }
    if (nameWall && iconItem && colorItem) {
      axios
        .post(URL, Params)
        .then(response => {
          console.log('RESPONSE add:', response.data);
        })
        .catch(error => {
          console.log('RESPONSE error:', error.response);
          if (error.response && error.response.status == 401) {
            showToast('error', error.response.data.detail);
          }
        })
        .finally(() => {
          this.props.route.params.updateData();
          this.props.navigation.goBack();
        });
    }
  }

  render() {
    const { nameWall, price, iconItem, colorItem } = this.state;
    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <StatusBar backgroundColor={'#fff'} barStyle="dark-content" />
        <SafeAreaView style={{ flex: 1 }}>
          <Header
            onLeftPress={() => this.props.navigation.goBack()}
            title={strings.addw}
          />
          <ScrollView showsVerticalScrollIndicator={false}>
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate('ChooseIcons', {
                  getIcon: this.getIcon,
                })
              }
              activeOpacity={0.7}
              style={{ alignSelf: 'center', marginVertical: 24 }}>
              <FastImage
                source={
                  colorItem ? { uri: '' } : require('../../assets/icon.png')
                }
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 120,
                  borderRadius: 60,
                  aspectRatio: 1,
                  backgroundColor: colorItem ? colorItem.value : null,
                }}>
                <FastImage
                  source={iconItem ? { uri: iconItem.icon } : null}
                  style={{ width: 60, aspectRatio: 1 }}
                />
              </FastImage>

              <View style={styles.vwStl}>{PenMini}</View>
            </TouchableOpacity>
            <View style={styles.inpStl}>
              <TextInput
                value={nameWall}
                placeholderTextColor={'rgba(0,0,0,0.4)'}
                placeholder={strings.nameW}
                onChangeText={nameWall => this.setState({ nameWall })}
                style={{ fontSize: 17, width: width - 58 }}
                returnKeyType={'next'}
                textContentType="name"
                onSubmitEditing={() => this.inpRef.focus()}
              />
            </View>
            {/* <View style={[styles.inpStl]}>
              <TextInput
                ref={e => (this.inpRef = e)}
                value={price}
                placeholderTextColor={'rgba(0,0,0,0.4)'}
                placeholder={'Сумма'}
                onChangeText={price => {
                  this.setState({ price })
                }}
                style={{ fontSize: 17, width: width - 58 }}
                returnKeyType={'done'}
                keyboardType="number-pad"
              />
            </View> */}

            <ButtonClass
              onPress={() => this.onSaveClick()}
              title={strings.save}
              style={{ marginHorizontal: 16, marginTop: 50 }}
            />
          </ScrollView>
        </SafeAreaView>
      </View>
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
    marginBottom: 8,
  },
});
