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
import { Left_icon } from './MyIcons';
import FastImage from 'react-native-fast-image';

export default function Header({
  headerStyle,
  childComponent,
  title,
  titleStyle,
  onTitlePress,
  title_icon,
  left_icon,
  onLeftPress,
  leftButtonStyle,
  left_iconStyle,
  left_tintColor,
  right_icon,
  onRightPress,
  rightButtonStyle,
  right_iconStyle,
  right_tintColor,
  leftSvg,
  rightSvg,
  deleteBackText,
  right_icon2,
  onRightPress2,
  right_text2,
  onRightPress3,
  ...props
}) {
  return (
    <View style={[styles.header, headerStyle]}>
      <TouchableOpacity activeOpacity={0.7} onPress={onLeftPress}>
        <View
          style={[
            styles.leftButtonStyle,
            leftButtonStyle,
            { paddingLeft: deleteBackText ? 10 : 0 },
          ]}>
          {Left_icon}

          {deleteBackText ? null : (
            <Text numberOfLines={1} style={{ fontSize: 17, color: '#3F49DC', marginLeft: 6 }}>
              {strings.nazad}
            </Text>
          )}
        </View>
      </TouchableOpacity>
      {title ? (
        <TouchableWithoutFeedback onPress={onTitlePress}>
          <View style={styles.titleView}>
            <Text numberOfLines={1} style={[styles.title, titleStyle]}>
              {title}
            </Text>
            {title_icon ? (
              <Image
                source={title_icon}
                style={{ width: 16, height: 8, marginLeft: 8 }}
                tintColor="#1D306D"
              />
            ) : null}
          </View>
        </TouchableWithoutFeedback>
      ) : childComponent ? (
        <View style={[styles.titleView]}>{childComponent}</View>
      ) : (
        <View style={{ flex: 1, backgroundColor: 'red' }} />
      )}

      {right_icon2 ? (
        <TouchableWithoutFeedback onPress={onRightPress2}>
          <View style={[styles.rightButtonStyle, rightButtonStyle]}>
            {right_icon2}
          </View>
        </TouchableWithoutFeedback>
      ) : null}
      {right_text2 ? (
        <TouchableWithoutFeedback onPress={onRightPress3}>
          <View>
            <Text style={{ color: '#3F49DC', fontWeight: '600', fontSize: 15 }}>
              {right_text2}
            </Text>
          </View>
        </TouchableWithoutFeedback>
      ) : null}
      {right_icon ? (
        <TouchableWithoutFeedback onPress={onRightPress}>
          <View style={[styles.rightButtonStyle, rightButtonStyle]}>
            {rightSvg ? (
              right_icon
            ) : (
              <Image
                source={right_icon}
                style={[styles.rightIcon, right_iconStyle]}
                tintColor={right_tintColor}
              />
            )}
          </View>
        </TouchableWithoutFeedback>
      ) : (
        <View style={[styles.rightButtonStyle, rightButtonStyle]} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: Platform.select({ ios: 44, android: 56 }),
    backgroundColor: 'white',
    paddingHorizontal: 9,
  },
  leftButtonStyle: {
    width: 80,

    height: '100%',
    alignItems: 'center',
    flexDirection: 'row',
  },
  leftIcon: {
    width: 30,
    height: 30,
  },
  titleView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000',
  },
  rightButtonStyle: {
    width: 50,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightIcon: {
    width: 30,
    height: 30,
  },
  title_iconStyle: {
    width: 12,
    height: 6,
  },
});
