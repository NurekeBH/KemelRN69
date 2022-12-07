import axios from 'axios';
import React, { Component } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { showToast, width } from '../../Component/Component';
import Header from '../../Component/Header2';
import { Done, DoneMini, DoneModal, Home } from '../../Component/MyIcons';
import { strings } from '../../Localization/Localization';
import { SvgUri } from 'react-native-svg';

export default class ChooseIcons extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataIcons: [],
      colors: [],
      isLoading: true,
      selectedIcon: '',
      selectedColor: '',
    };
  }

  componentDidMount() {
    this.getColorList();
    this.getIconList();
  }
  getIconList() {
    axios
      .get('wallets/icons/')
      .then(response => {
        console.log('RESPONSE wallets:', response.data);

        let ICONS = response.data.map(item => ({
          active: false,
          id: item.id,
          icon: item.icon,
          label: item.label,
        }));

        this.setState({
          isLoading: false,
          dataIcons: ICONS,
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

  getColorList() {
    axios
      .get('wallets/colors/')
      .then(response => {
        console.log('RESPONSE colors:', response.data);

        let COLORS = response.data.map(item => ({
          active: false,
          id: item.id,
          value: item.value,
        }));
        console.log('RESPONSE ICONS:', COLORS);

        this.setState({
          colors: COLORS,
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

  activeColor = index => {
    const { colors } = this.state;
    for (let i = 0; i < colors.length; i++) {
      colors[i].active = false;
    }
    colors[index].active = true;
    let selectedColor = colors[index];
    this.setState({
      selectedColor,
    });
  };

  activeIcon = index => {
    const { dataIcons } = this.state;
    for (let i = 0; i < dataIcons.length; i++) {
      dataIcons[i].active = false;
    }
    dataIcons[index].active = true;
    let selectedIcon = dataIcons[index];
    this.setState({
      selectedIcon,
    });
  };

  render() {
    const { dataIcons, isLoading, colors, selectedColor, selectedIcon } =
      this.state;
    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <SafeAreaView style={{ flex: 1 }}>
          <Header
            title={strings.iconch}
            onLeftPress={() => this.props.navigation.goBack()}
            right_icon={DoneModal}
            rightSvg={true}
            onRightPress={() => {
              if (selectedColor && selectedIcon) {
                this.props.route.params.getIcon(selectedColor, selectedIcon);
                this.props.navigation.goBack();
              } else {
                showToast('info', 'Выберите цвет и иконка');
              }
            }}
          />
          {isLoading ? (
            <ActivityIndicator />
          ) : (
            <ScrollView>
              <Text style={{ color: 'black', fontSize: 17, fontWeight: '600', margin: 15 }}>
                {strings.fon}
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ paddingHorizontal: 16 }}>
                {colors.map((item, index) => (
                  <TouchableOpacity
                    onPress={() => this.activeColor(index)}
                    activeOpacity={0.7}
                    key={index}
                    style={[
                      {
                        marginRight: index == colors.length - 1 ? 32 : 16,
                        backgroundColor: item.value,
                        borderColor: "#000000",
                        borderWidth: 0.2,
                      },
                      styles.foneStl,
                    ]}>
                    {item.active ? Done : null}
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <Text
                style={{ color: 'black', fontSize: 17, fontWeight: '600', margin: 15, top: 15 }}>
                {strings.icons}
              </Text>
              <View
                style={{
                  flexWrap: 'wrap',
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: 12,
                  marginTop: 11,
                }}>
                {dataIcons.map((item, index) => (
                  <View key={index}>
                    <TouchableOpacity
                      onPress={() => this.activeIcon(index)}
                      activeOpacity={0.7}
                      style={styles.icnStl}>
                      <FastImage
                        source={{ uri: item.icon }}
                        style={{ width: 32, height: 32 }}
                      />
                    </TouchableOpacity>
                    {item.active ? (
                      <View style={styles.doneStl}>{DoneMini}</View>
                    ) : null}
                  </View>
                ))}
              </View>
            </ScrollView>
          )}
        </SafeAreaView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  foneStl: {
    width: 40,
    aspectRatio: 1,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icnStl: {
    width: width / 6,
    aspectRatio: 1,
    borderRadius: 40,
    marginHorizontal: 12,
    marginBottom: 12,
    backgroundColor: 'rgba(63, 73, 220, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  doneStl: {
    width: 27,
    aspectRatio: 1,
    borderRadius: 13,
    borderWidth: 3,
    borderColor: '#fff',
    backgroundColor: '#3F49DC',
    position: 'absolute',
    zIndex: 10,
    right: 5,
    bottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
