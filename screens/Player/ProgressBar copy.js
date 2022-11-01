



import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import TrackPlayer, { ProgressComponent } from 'react-native-track-player';
import { GetDuration, height, width } from '../../Component/Component';
import Slider from '@react-native-community/slider';

function secondsToHms(d) {
  d = Number(d);
  var m = Math.floor((d % 3600) / 60);
  var s = Math.floor((d % 3600) % 60);

  var mDisplay;
  if (m > 0) {
    if (m < 10) {
      mDisplay = '0' + m;
    } else {
      mDisplay = m;
    }
  } else {
    mDisplay = '00';
  }
  var sDisplay;
  if (s > 0) {
    if (s < 10) {
      sDisplay = '0' + s;
    } else {
      sDisplay = s;
    }
  } else {
    sDisplay = '00';
  }
  return mDisplay + ':' + sDisplay;
}

class ProgressBar extends ProgressComponent {
  render() {
    const position = Math.floor(this.state.position);
    const duration = Math.floor(this.state.duration);


    return (
      <View
        style={{
          width: '100%',
          height: 80,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Slider
          value={position}
          style={{ width: width - 67, height: 40 }}
          minimumValue={0}
          onValueChange={val => {
            TrackPlayer.seekTo(val);
          }}
          maximumValue={duration}
          tapToSeek={true}
          thumbImage={require('../../assets/oval.png')}
          minimumTrackTintColor="#8F8E94"
          maximumTrackTintColor="#DDDDDD"
        />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: width - 67,
            top: -10,
          }}>
          <Text style={{ fontSize: 13, color: '#8C8C8C' }}>
            {secondsToHms(position)}
          </Text>
          <Text style={{ fontSize: 13, color: '#8C8C8C' }}>
            {secondsToHms(duration)}
          </Text>
        </View>
      </View>
    );
  }
}

module.exports = ProgressBar;




