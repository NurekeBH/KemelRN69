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
import {
  GetDuration,
  Header2,
  HeaderStyle,
  width,
} from '../../Component/Component';
import { pauseIcon, PlayIcon } from '../../Component/MyIcons';
import { strings } from '../../Localization/Localization';
import Player from '../Player/Player';
import TrackPlayer from 'react-native-track-player';
import TabHeader from '../../Component/TabHeader';

const itemColors = ['#5BC571', '#4191FF', '#3D3D3D', '#9B8274'];

export default class Tab5 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoadingCategory: true,
      category: [],
      data: [],
      modalBoll: false,
      indAudio: 1,
      position: null,
      audioList: [],
    };
  }

  componentDidMount() {
    this.getCategory();
  }

  getCategory() {
    axios
      .get('meditations/category/')
      .then(response => {
        console.log('RESPONSE category:', response);

        this.setState({
          isLoadingCategory: false,
          category: response.data.results,
          data: response.data.results[0].audios,
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

  ListHeaderComponent = () => (
    <View>
      <View style={styles.vwStl}>
        <Text style={styles.txStl}>{strings.cat}</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 8, paddingTop: 8 }}>
          {this.state.category.map((item, index) => (
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate('Category', {
                  item: item,
                  bgColor: itemColors[index],
                })
              }
              activeOpacity={0.7}
              key={index}
              style={{ marginRight: 8, marginLeft: index == 0 ? 8 : 0 }}>
              <FastImage
                source={{
                  uri: item.cover,
                }}
                style={{
                  backgroundColor: itemColors[index],
                  width: 90,
                  height: 80,
                  borderRadius: 8,
                }}>
                <View style={styles.vwStl2}>
                  <View />
                  <Text
                    style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>
                    {item.label}
                  </Text>
                </View>
              </FastImage>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <Text
        style={{
          padding: 16,
          paddingBottom: 0,
          fontSize: 17,
          fontWeight: '600',
        }}>
        {strings.rek}
      </Text>
    </View>
  );

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
        this.setState(
          {
            modalBoll: false,
          },
          () => {
            this.PlayTrack();
            this.setState({
              modalBoll: true,
              position: index,
              audioList: this.state.data,
            });
          },
        );
      }}>
      {this.state.position == index ? pauseIcon : PlayIcon}
      <View style={{ marginLeft: 8 }}>
        <Text style={{ fontSize: 17, fontWeight: '600' }}>{item.label}</Text>
        <Text style={{ color: '#999999', marginTop: 2 }}>
          {GetDuration(item.duration)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  PlayTrack = async () => {

    const audioList = this.state.data
    let Arrtrack = []
    for (let i = 0; i < audioList.length; i++) {
      let item = audioList[i]
      var track = {
        url: item.file,
        title: item.label,
        artist: 'deadmau5',
        album: 'while(1<2)',
        genre: 'Progressive House, Electro House',
        duration: item.duration,
      };
      Arrtrack.push(track)

    }
    await TrackPlayer.add(Arrtrack);


    console.log('aaa', '11')

    console.log('aaa', '22')

    await TrackPlayer.play();
    console.log('aaa', '33')
    TrackPlayer.pause()
    TrackPlayer.play()
  }

  render() {
    const { data, modalBoll, audioList, position } = this.state;
    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <StatusBar backgroundColor={'#fff'} barStyle="dark-content" />
        <SafeAreaView style={{ flex: 1 }}>
          <TabHeader
            rightIcon={null}
            rightOnPress={null}
            title={strings.tab3}
            navigation={this.props.navigation}
            borderBottomBoll={false}
          />
          <FlatList
            data={data}
            keyExtractor={(item, index) => index.toString()}
            ListHeaderComponent={this.ListHeaderComponent}
            showsVerticalScrollIndicator={false}
            renderItem={this.renderItem}
          />
          {modalBoll ? (
            <Player audioList={audioList} position={position} />
          ) : null}
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
