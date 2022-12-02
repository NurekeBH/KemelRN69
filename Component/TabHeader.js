import * as React from 'react';
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Text,
  Image,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { strings } from '../Localization/Localization';
import { colorApp } from '../theme/Colors';
import { Left_icon, no_avatar } from './MyIcons';
import { StateContext } from '../ProviderApp';
import FastImage from 'react-native-fast-image';
import { HeaderStyle } from './Component';

export default function TabHeader({
  rightOnPress,
  rightIcon,
  navigation,
  title,
  rightIcon2,
  rightOnPress2,

  borderBottomBoll,
  ...props
}) {
  return (
    <StateContext.Consumer>
      {data => {
        return (
          <View
            style={[
              HeaderStyle,
              {
                borderBottomWidth: borderBottomBoll ? 1 : 0,
                borderBottomColor: 'rgba(0, 0, 0, 0.1)',
                justifyContent: 'space-between',
              },
            ]}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('ProfileStack', { screen: 'Profile' })
                }
                activeOpacity={0.7}>
                {data.avatar ? (
                  <FastImage
                    source={{
                      uri: data.avatar,
                    }}
                    style={{
                      width: 28,
                      aspectRatio: 1,
                      borderRadius: 14,
                      borderColor: '#999999',
                      borderWidth: 1,
                    }}
                  />
                ) : (
                  <View
                    style={{
                      width: 28,
                      aspectRatio: 1,
                      borderRadius: 14,
                      borderColor: '#999999',
                      borderWidth: 1,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    {no_avatar(24)}
                  </View>
                )}
              </TouchableOpacity>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: '600',
                  marginLeft: 15,
                  textTransform: 'capitalize',
                }}>
                {title}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                style={{
                  width: 50,
                  alignItems: 'center',
                }}
                activeOpacity={0.7}
                onPress={rightOnPress}>
                {rightIcon}
              </TouchableOpacity>

              {rightIcon2 ? (
                <TouchableOpacity
                  style={{ width: 40, alignItems: 'center' }}
                  activeOpacity={0.7}
                  onPress={rightOnPress2}>
                  {rightIcon2}
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
        );
      }}
    </StateContext.Consumer>
  );
}
