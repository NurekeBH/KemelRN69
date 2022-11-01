import React, { Component } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  ScrollView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { GetDuration, GetTime, height, width } from '../../Component/Component';
import Header from '../../Component/Header2';
import { pauseIcon, PlayIcon } from '../../Component/MyIcons';
import Player from '../Player/Player';
import TrackPlayer from 'react-native-track-player';
import axios from 'axios';

export default class Category extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalBoll: false,
      audioList: [],
      isLoading: true,
      position: null,
      isPlaying: false,
    };
    this.item = this.props.route.params.item;
    this.bgColor = this.props.route.params?.bgColor;

  }

  componentDidMount() {
    axios.get(`meditations/category/${this.item.id}/`)
      .then(response => {

        this.setState({
          isLoading: false,
          audioList: response.data.audios,
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

  PlayTrack = async (item, index) => {
    const { position } = this.state;
    console.log('index - position', index + "-" + position);

    let state = await TrackPlayer.getState();
    console.log(' TrackPlayer.STATE_PLAYING', state);

    if (position == index) {
      if (state == TrackPlayer.STATE_PLAYING) {
        this.setState({
          isPlaying: false,
        });
        TrackPlayer.pause();
      } else {
        this.setState({
          isPlaying: true,
        });
        TrackPlayer.play();
      }
    } else {
      // console.log('item', item);
      // TrackPlayer.reset();
      // var track = {
      //   url: item.file,
      //   title: item.label,
      //   artist: 'deadmau5',
      // };
      // TrackPlayer.add(track);

      // this.setState({
      //   isPlaying: true,
      // });
      // TrackPlayer.play();
    }
  };

  ListHeaderComponent = () => (
    <View
      style={{
        height: 89,
        justifyContent: 'center',
        backgroundColor: this.bgColor,
      }}>
      <Text
        style={{
          fontSize: 34,
          fontWeight: '700',
          color: 'white',
          position: 'absolute',
          left: 16,
        }}>
        {this.item.label}
      </Text>
      <FastImage
        source={{
          uri: this.item.cover,
        }}
        style={{
          position: 'absolute',
          right: 16,
          width: 90,
          height: 80,
          borderRadius: 8,
        }}
      />
    </View>
  );

  renderItem = ({ item, index }) => (
    <TouchableOpacity
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
            this.PlayTrack(item, index);
            this.setState({
              modalBoll: true,
              position: index,
            });
          },
        );
      }}>
      {this.state.position == index && this.state.isPlaying
        ? pauseIcon
        : PlayIcon}
      <View style={{ marginLeft: 8 }}>
        <Text style={{ fontSize: 17, fontWeight: '600' }}>{item.label}</Text>
        <Text style={{ color: '#999999', marginTop: 2 }}>
          {GetDuration(item.duration)} • {GetTime(item.updated_at, 'DD MMMM')}
        </Text>
      </View>
    </TouchableOpacity>
  );

  render() {
    const { modalBoll, audioList, position } = this.state;
    const item = this.item
    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <StatusBar backgroundColor={'#fff'} barStyle="dark-content" />
        <SafeAreaView style={{ flex: 1 }}>
          <Header
            title={item.label}
            onLeftPress={() => this.props.navigation.goBack()}
          />
          <FlatList
            data={audioList}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={this.ListHeaderComponent}
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
