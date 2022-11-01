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
import {strings} from '../Localization/Localization';
import {colorApp} from '../theme/Colors';
import {Left_icon} from './MyIcons';

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
  left_title,
  rightSvg,
  ...props
}) {
  // const headerStyle = props.headerStyle;
  // const title = props.title;
  // const titleStyle = props.titleStyle;
  // const onTitlePress = props.onTitlePress;
  // const title_icon = props.title_icon;

  // const left_icon = props.left_icon;
  // const onLeftPress = props.onLeftPress;
  // const leftButtonStyle = props.leftButtonStyle;
  // const left_iconStyle = props.left_iconStyle;
  // const left_tintColor = props.left_tintColor;

  // const right_icon = props.right_icon;
  // const onRightPress = props.onRightPress;
  // const rightButtonStyle = props.rightButtonStyle;
  // const right_iconStyle = props.right_iconStyle;
  // const right_tintColor = props.right_tintColor;

  return (
    <View style={[styles.header, headerStyle]}>
      <Text numberOfLines={1} style={[styles.title, titleStyle]}>
        {left_title}
      </Text>
      {title ? (
        <TouchableWithoutFeedback onPress={onTitlePress}>
          <View style={styles.titleView}>
            <Text numberOfLines={1} style={[styles.title, titleStyle]}>
              {title}
            </Text>
            {title_icon ? (
              <Image
                source={title_icon}
                style={{width: 16, height: 8, marginLeft: 8}}
                tintColor="#1D306D"
              />
            ) : null}
          </View>
        </TouchableWithoutFeedback>
      ) : childComponent ? (
        <View style={[styles.titleView]}>{childComponent}</View>
      ) : (
        <View style={{flex: 1, backgroundColor: 'red'}} />
      )}

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
    height: Platform.select({ios: 44, android: 56}),
    backgroundColor: 'white',
    paddingHorizontal: 16,
  },
  leftButtonStyle: {
    width: 60,
    height: '100%',
    justifyContent: 'center',
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
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
  },
  rightButtonStyle: {
    width: 60,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'flex-end',
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
