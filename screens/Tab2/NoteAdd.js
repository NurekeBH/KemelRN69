/* eslint-disable react-native/no-inline-styles */
import axios from 'axios';
import React, { useCallback, Component, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  StyleSheet,
  Alert,
  Dimensions,
  Linking,
  ActivityIndicator,
} from 'react-native';
import {
  DomainUrl,
  showToast,
} from '../../Component/Component';
import { strings } from '../../Localization/Localization';
import { actions, RichEditor, RichToolbar } from '../../HtmlEditor';
import { editorFile, FileIcon, iconFile, Left30Sec, PluseFile, ShareNote } from '../../Component/MyIcons';
import ImageCropPicker from 'react-native-image-crop-picker';
import converter from '../../markdown/index'


const arrAction = [
  actions.insertImage,
  actions.setBold,
  actions.setItalic,
  actions.insertBulletsList,
  actions.insertOrderedList,
  actions.heading1,
];

import Header from '../../Component/Header2';
import Share from 'react-native-share';


import DocumentPicker, {
  types,
} from 'react-native-document-picker'





export default function NoteAdd({ route, navigation }) {

  console.log('routeroute', route.params?.item)
  const [theme, setTheme] = useState(
    route.params?.item ? route.params.item.label : '',
  );
  const [text, setText] = useState(
    route.params?.item ? route.params.item.desc : '',
  );
  const [noteId, setNoteId] = useState(
    route.params?.item ? route.params.item.id : '',
  );
  const [toolbar, setTollbar] = useState(false);
  const [isSend, setIsSend] = useState(false);
  const [arrFiles, setArrFiles] = useState(
    route.params?.item ? route.params.item.children : [],
  );


  const [isLoading, setIsLoading] = useState(route.params?.item)


  const [folderId, setFolderID] = useState(
    route.params?.folderId ? route.params.folderId : null,
  );

  const [richDisable, setRichDisable] = useState(true)

  const [ind, setInd] = useState(1);

  const [files, setFiles] = useState([]);

  const richText = useRef();

  useEffect(() => {
    setTimeout(() => {
      richText.current?.setContentHTML(text)
      setIsLoading(false)
    }, 2000)
  }, []);


  const share = () => {
    let hmtl = theme + '\n' + text;


    console.log('hmtl', hmtl)

    var markdown = converter.convert(hmtl);

    console.log('sharehmtl', markdown)

    // const regex = /(<([^>]+)>)/ig;
    // const result = hmtl.replace(regex, '');
    // console.log('sharehmtl', descriptionText)
    // console.log('sharehmtl', hmtl)
    // console.log('sharehmtlresult', result)
    // const shareOptions = {
    //   title: 'Kemel Adam',
    //   message: result,
    //   url: 'https://kemeladam.kz/',
    // };

    // Share.open(shareOptions)
    //   .then(res => { })
    //   .catch(err => {
    //     err && console.log(err);
    //   });
  };

  const onSaveClick = () => {
    console.log('noteId', noteId)
    console.log('folderId', folderId)
    if (noteId) {
      setIsSend(true);
      axios
        .put('notes/note/' + noteId + '/', {
          label: theme,
          desc: text,
          // children: arrFiles,
          parent: null,
          folder: folderId,
        })
        .then(response => {
          console.log('response', response);

          navigation.goBack();
        })
        .catch(error => {
          if (error.response && error.response.status == 401) {
            showToast('error', error.response.data.detail);
          }
        });
    } else {
      if (!theme && !text) {
        navigation.goBack();
      } else {
        setIsSend(true);
        axios
          .post('notes/note/', {
            label: theme,
            desc: text,
            // children: arrFiles,
            parent: null,
            folder: folderId,
          })
          .then(response => {
            console.log('RESPONSE add:', response.data);
            navigation.goBack();
          })
          .catch(error => {
            console.log('RESPONSE error:', error.response);
            if (error.response && error.response.status == 401) {
              showToast('error', error.response.data.detail);
            }
          });
      }
    }
  };


  const handleCustomAction = () => {
    setIsLoading(true)
    DocumentPicker.pick({
      type: [types.pdf, types.docx, types.plainText, types.pptx, types.xlsx, types.zip],
    })
      .then((result) => {
        console.log('result', result)
        if (result.length > 0) {

          const formData = new FormData();
          formData.append('file', {
            uri: result[0].uri,
            type: result[0].type,
            name: result[0].name,
          });

          console.log('formData', formData)


          axios
            .post('notes/note/share/upload/', formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            })
            .then(response => {
              console.log('file  -', response);
              richText.current.insertLink(result[0].name, DomainUrl + response.data.path);
              richText.current.insertHTML('<div><br></div>');
              setIsLoading(false)
            })
            .catch(error => {
              console.log('file error -', error.response);

              // Alert.alert(error.response);
            });




        }
      })
      .catch((e) => {
        console.log('result', result)
      })
  }


  const getPhoto = () => {
    ImageCropPicker.openPicker({
      multiple: false,
      width: Dimensions.get('screen').width,
      height: Dimensions.get('screen').width,
      cropping: true,
      mediaType: 'photo',
      freeStyleCropEnabled: true,
    }).then(images => {
      console.log('images', images)
      const { path, mime, width, height } = images;


      const formData = new FormData();
      formData.append('file', {
        uri: path,
        type: mime,
        name: 'filename.jpg',
      });

      SendImage(formData, width, height);
    });
  };

  const SendImage = (formData, width, height) => {
    console.log('aa', formData);
    console.log('aa', width);
    console.log('aa', height);

    axios
      .post('notes/note/share/upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(response => {
        console.log('AddPhoto -', response);

        richText.current.insertImage(response.data.path, `width:${width}px;height:${height}px;`);



      })
      .catch(error => {
        console.log('AddPhoto error -', error.response);

        // Alert.alert(error.response);
      });
  };

  const addPage = () => {
    navigation.navigate('NoteAddChild', {
      theme: '',
      AddChild: AddChild,
    });
  };

  const AddChild = (data, Index) => {
    console.log('Index', Index);
    console.log('data', data);

    if (noteId) {
      data.parent_id = noteId;
    }
    let arrr = arrFiles;
    console.log('arrr', arrr);

    if (Index != null) {
      arrr[Index] = { ...data };
      console.log('arrr111', arrr);
    } else {
      arrr.push(data);
      console.log('arrr22222', arrr);
    }
    console.log('arrrarrrarrr', arrr);

    setArrFiles(arrr);
    setInd(ind + 1);
  };

  const deletePage = (item, index) => {
    Alert.alert(strings.vnim, strings.filed, [
      {
        text: strings.otm,
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () => {
          let arrr = arrFiles;
          arrr.splice(index, 1);
          setArrFiles(arrr);
          setInd(ind + 1);
          console.log('arrFiles', arrFiles);
        },
      },
    ]);
  };



  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="height">
        <StatusBar backgroundColor={'#fff'} barStyle="dark-content" />
        <SafeAreaView style={{ flex: 1 }}>
          <Header
            onLeftPress={() => navigation.goBack()}
            deleteBackText={true}
            rightSvg
            right_icon={ShareNote}
            onRightPress={share}
            right_text2={strings.save}
            onRightPress3={() => onSaveClick()}
          />
          {/* <View style={HeaderStyle}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}>
            <Text style={{ fontSize: 17, color: '#3F49DC' }}>
              {strings.bastar}
            </Text>
          </TouchableOpacity>
        </View> */}
          <View
            style={{ flex: 1, paddingHorizontal: 0, backgroundColor: '#fff' }}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View
                style={{ marginBottom: 16 }}>
                <RichToolbar
                  editor={richText}
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

                    customAction: ({ tintColor }) => (
                      editorFile
                    ),
                  }}
                  customAction={handleCustomAction}
                />
                {/* <Animated.View style={{height: useKeyboardHeight}} /> */}
              </View>
              <TextInput
                placeholder={strings.tem}
                style={{
                  fontSize: 20,
                  fontWeight: '700',
                  marginHorizontal: 10,
                  marginBottom: 16,
                }}
                placeholderTextColor="#D1D1D6"
                autoFocus={true}
                onChangeText={theme => {
                  setTheme(theme);
                }}
                value={theme}
                returnKeyType="next"
                onSubmitEditing={() => {
                  setRichDisable(false)
                  richText.current?.focusContentEditor();
                }}
                onBlur={() => {
                  setRichDisable(false)
                }}
                blurOnSubmit={false}
              />

              <View
                style={{
                  height: 1,
                  marginHorizontal: 10,
                }}
              />

              {
                isLoading ?
                  <View style={{ margin: 16 }}>
                    <ActivityIndicator />
                  </View>
                  :
                  null
              }

              <RichEditor
                initialFocus={!richDisable}
                disabled={richDisable}
                style={{ minHeight: 100, }}
                ref={richText}
                androidHardwareAccelerationDisabled={true}
                placeholder={strings.zamk}
                initialContentHTML={text}
                onChange={descriptionText => {
                  setText(descriptionText);
                }}

                onFocus={() => setTollbar(true)}
                onBlur={() => setTollbar(false)}

              // onMessage={(event) => {
              //   console.log('event', event)

              //   let url = event?.data
              //   let type = event?.type
              //   type == 'link' && Linking.canOpenURL(url).then(supported => {
              //     if (supported) {
              //       Linking.openURL(url);
              //     } else {
              //       console.log('Don\'t know how to open URI: ' + url);
              //     }
              //   });
              // }}
              // onLayout={({ nativeEvent }) => {
              //   setTimeout(() => {
              //     richText.current?.setContentHTML(text)
              //   }, 200)
              // }}
              />

            </ScrollView>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
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
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 1,
    elevation: 3,
    marginVertical: 1,
  },
});
