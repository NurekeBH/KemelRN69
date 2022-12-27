/* eslint-disable react-native/no-inline-styles */
import axios from 'axios';
import React, { Component, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { ButtonClass, HeaderStyle, showToast } from '../../Component/Component';
import { strings } from '../../Localization/Localization';
import { actions, RichEditor, RichToolbar } from '../../HtmlEditor';
import ImageCropPicker from 'react-native-image-crop-picker';
const arrAction = [
  actions.insertImage,
  actions.setBold,
  actions.setItalic,
  actions.insertBulletsList,
  actions.insertOrderedList,
  actions.heading1,
];

export default function NoteAddChild({ route, navigation }) {
  const [theme, setTheme] = useState(route.params?.theme);
  const [text, setText] = useState(route.params?.text);
  const Index = route.params ? route.params.index : null;
  const [toolbar, setTollbar] = useState(false);
  const richText = useRef();

  console.log('Index1', route.params.index);

  useEffect(() => {
    richText.current.insertHTML('<div</div>');
  }, []);

  const onSaveClick = () => {
    if (!theme && !text) {
      navigation.goBack();
    } else {
      let object = {};
      object.label = theme;
      object.desc = text;
      console.log('Index', Index);
      route.params.AddChild(object, Index);
      navigation.goBack();
    }
  };

  const getPhoto = () => {
    ImageCropPicker.openPicker({
      multiple: false,
      cropping: true,
      mediaType: 'photo',
    }).then(images => {
      console.log('iamges', images);
      let photo = {
        url: 'https://images.unsplash.com/photo-1508921912186-1d1a45ebb3c1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cGhvdG98ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60',
      };
      richText.current.insertImage(
        'https://images.unsplash.com/photo-1508921912186-1d1a45ebb3c1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cGhvdG98ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60',
      );
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBar backgroundColor={'#fff'} barStyle="dark-content" />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={HeaderStyle}>
          <TouchableOpacity onPress={onSaveClick} activeOpacity={0.7}>
            <Text style={{ fontSize: 17, color: '#3F49DC' }}>
              {strings.bastar}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1, paddingHorizontal: 6, backgroundColor: '#fff' }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={{ flex: 1 }}>
              <TextInput
                placeholder={strings.tem}
                style={{
                  fontSize: 24,
                  fontWeight: '700',
                  marginHorizontal: 10,
                }}
                placeholderTextColor="#D1D1D6"
                multiline
                autoFocus
                onChangeText={theme => {
                  setTheme(theme);
                }}
                value={theme}
                returnKeyType="next"
              />
              <View
                style={{
                  height: 1,
                  backgroundColor: 'rgba(0, 0, 0, 0.2)',
                  marginVertical: 10,
                  marginHorizontal: 10,
                }}
              />
              <RichEditor
                ref={richText}
                placeholder=""
                androidHardwareAccelerationDisabled={true}
                initialContentHTML={text}
                onChange={descriptionText => {
                  setText(descriptionText), console.log(descriptionText);
                }}
                onFocus={() => setTollbar(true)}
                onBlur={() => setTollbar(false)}
              />
            </KeyboardAvoidingView>
          </ScrollView>
          {!toolbar ? null : (
            <RichToolbar
              editor={richText}
              value={text}
              actions={arrAction}
              onPressAddImage={() => getPhoto()}
              selectedButtonStyle={{
                backgroundColor: '#EFEBE9',
                marginHorizontal: 1,
                borderRadius: 4,
              }}
              unselectedButtonStyle={{
                marginHorizontal: 1,
              }}
              style={styles.toolbarStl}
              iconMap={{
                [actions.heading1]: ({ tintColor }) => (
                  <Text style={[{ color: tintColor }]}>H1</Text>
                ),
                [actions.heading2]: ({ tintColor }) => (
                  <Text style={[{ color: tintColor }]}>H2</Text>
                ),
                [actions.heading3]: ({ tintColor }) => (
                  <Text style={[{ color: tintColor }]}>H3</Text>
                ),
              }}
            />
          )}
          {/* {editTheme == theme &&
            editText == text &&
            editText &&
            editTheme ? null : (
            <ButtonClass
              onPress={() => onSaveClick()}
              title={strings.save}
              style={{ margin: 10 }}
            />
          )} */}
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  toolbarStl: {
    borderRadius: 6,
    backgroundColor: '#fff',
    marginHorizontal: 10,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 2.84,
    elevation: 5,
    marginBottom: 200,
    marginTop: 10,
  },
});
