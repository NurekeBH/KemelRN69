/* eslint-disable react-native/no-inline-styles */
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Modal from 'react-native-modalbox';
import { GetDuration, height, width } from '../../Component/Component';
import {
  BottomIcon,
  Left30Sec,
  LeftAudio,
  pauseIcon,
  PlayButton,
  PauseButton,
  PlayIcon,
  Right30Sec,
  RightAudio,
} from '../../Component/MyIcons';
const arr = [0.5, 1, 1.5, 2];
import TrackPlayer from 'react-native-track-player';
import ProgressBar from './ProgressBar';


let HEIGHT = 'auto';

export default class Play extends Component {
  constructor(props) {
    console.log('PROPS', props);
    super(props);
    this.state = {
      modalBoll: false,
      rateAudio: 1,
      audioList: this.props.audioList,
      position: this.props.position,
      Title: this.props.audioList[this.props.position].label,
      Duration: this.props.audioList[this.props.position].duration,
      isPlay: true,
    };
  }
  componentDidMount() {
    this.PlayTrack(this.state.audioList[this.state.position]);
  }

  PlayTrack(item) {

    TrackPlayer.reset();
    var track = {
      id: item.id,
      url: item.file,
      title: item.label,
      artist: 'deadmau5',
      duration: item.duration,
    };

    console.log('aaa track', track)
    TrackPlayer.add(track);

    TrackPlayer.play();
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
        this.setState({
          Title: item.label,
          Duration: item.duration,
          isPlay: true,
          position: index,
        });
        this.PlayTrack(item);
      }}>
      {this.state.isPlay && index == this.state.position ? pauseIcon : PlayIcon}

      <View style={{ marginLeft: 8 }}>
        <Text style={{ fontSize: 17, fontWeight: '600' }}>{item.label}</Text>
        <Text style={{ color: '#999999', marginTop: 2 }}>
          {' '}
          {GetDuration(item.duration)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  Next() {
    const { position, audioList } = this.state;
    console.log('position', position);
    let POS = position + 1;
    if (position == audioList.length - 1) {
      POS = 0;
    }
    console.log('POS', POS);

    this.setState({
      Title: audioList[POS].label,
      Duration: audioList[POS].duration,
      isPlay: true,
      position: POS,
    });
    this.PlayTrack(audioList[POS]);
  }

  Prev() {
    const { position, audioList } = this.state;
    console.log('position', position);
    let POS = position - 1;
    if (position == 0) {
      POS = audioList.length - 1;
    }
    console.log('POS', POS);

    this.setState({
      Title: audioList[POS].label,
      Duration: audioList[POS].duration,
      isPlay: true,
      position: POS,
    });
    this.PlayTrack(audioList[POS]);
  }

  SeekTo(sec) {
    TrackPlayer.getDuration().then(duration => {
      TrackPlayer.getPosition().then(
        position => {
          const finalPosition = position + sec;
          if (finalPosition <= 1) {
            TrackPlayer.seekTo(1);
          } else if (finalPosition >= duration) {
            TrackPlayer.seekTo(duration - 1);
          } else {
            TrackPlayer.seekTo(finalPosition);
          }
        },
        error => { },
      );
    });
  }

  render() {
    const { modalBoll, rateAudio, audioList, Title, Duration, isPlay } =
      this.state;


    const _height = Dimensions.get('screen').height;
    return (
      <View
        style={{
          justifyContent: 'flex-end',
          height: HEIGHT,
          position: 'absolute',
          bottom: 0,
        }}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            HEIGHT = _height;
            this.setState({ modalBoll: !modalBoll });
          }}
          style={{
            width: width,
            height: 83,
            backgroundColor: 'transparent',
          }}>
          <View
            style={{
              alignSelf: 'center',
              width: width / 10,
              height: 3,
              borderRadius: 50,
              backgroundColor: '#232857',
            }}
          />
          <View
            style={{
              flex: 1,
              backgroundColor: '#232857',
              marginTop: 6,
              borderTopRightRadius: 16,
              borderTopLeftRadius: 16,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingHorizontal: 16,
            }}>
            <View>
              <Text
                numberOfLines={1}
                style={{ fontSize: 17, color: '#fff', width: width - 110 }}>
                {Title}
              </Text>
              <Text style={{ fontSize: 12, color: '#A1A1A1', marginTop: 3 }}>
                {GetDuration(Duration)}
              </Text>
            </View>
            {/* <Progress.Circle size={44} indeterminate={true} animated={false} /> */}
            <TouchableOpacity
              onPress={() => {
                isPlay ? TrackPlayer.pause() : TrackPlayer.play();
                this.setState({
                  isPlay: !isPlay,
                });
              }}>
              {isPlay ? pauseIcon : PlayIcon}
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
        <Modal
          isOpen={modalBoll}
          position="bottom"
          onClosed={() => {
            HEIGHT = 'auto';
            this.setState({
              modalBoll: false,
            });
          }}
          style={{
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
            height: '85%',
            marginTop: 40,
          }}>
          <View
            style={{
              flex: 1,
              backgroundColor: '#fff',
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
              paddingVertical: 12,
              alignItems: 'center',
            }}>
            {BottomIcon}
            <ScrollView
              contentContainerStyle={{ alignItems: 'center' }}
              showsVerticalScrollIndicator={false}>

              <ProgressBar duration={Duration} />

              <Text
                style={{
                  textAlign: 'center',
                  marginHorizontal: 15,
                  fontWeight: '700',
                  fontSize: 22,
                  marginTop: 16,
                }}>
                {Title}
              </Text>
              <View
                style={{
                  width: width - 92,
                  justifyContent: 'space-around',
                  alignItems: 'center',
                  flexDirection: 'row',
                  marginTop: 24,
                }}>
                <TouchableOpacity
                  onPress={() => {
                    this.SeekTo(-30);
                  }}>
                  {Left30Sec}
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    this.Prev();
                  }}>
                  {LeftAudio}
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    isPlay ? TrackPlayer.pause() : TrackPlayer.play();
                    this.setState({
                      isPlay: !isPlay,
                    });
                  }}>
                  {isPlay ? PauseButton : PlayButton}
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    this.Next();
                  }}>
                  {RightAudio}
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    this.SeekTo(30);
                  }}>
                  {Right30Sec}
                </TouchableOpacity>
              </View>
              <View style={styles.speed}>
                {arr.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.btnAudioStl,
                      { backgroundColor: rateAudio == index ? '#fff' : null },
                    ]}
                    onPress={() => {
                      TrackPlayer.setRate(item);
                      this.setState({ rateAudio: index });
                    }}>
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: '700',
                        color: rateAudio == index ? '#3F49DC' : '#000',
                      }}>
                      {item}x
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity
                style={{
                  width: width,
                  borderTopWidth: 1,
                  borderTopColor: 'rgba(0, 0, 0, 0.2)',
                  marginTop: 24,
                }}>
                {audioList.map((item, index) => this.renderItem({ item, index }))}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  btnAudioStl: {
    height: 46,
    aspectRatio: 1,
    borderRadius: 100,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 0.84,

    elevation: 5,
  },
  speed: {
    flexDirection: 'row',
    width: 192,
    height: 48,
    alignItems: 'center',
    justifyContent: 'space-around',
    borderRadius: 100,
    backgroundColor: '#F2F2F7',
    padding: 1,
    marginTop: 40,
  },
});
