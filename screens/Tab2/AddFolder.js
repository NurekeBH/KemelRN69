import React, { Component } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  StyleSheet,
  Keyboard,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../Component/Header2';
import {
  DoneModal,
  Pluse,
  Search,
  SearchX,
  ShareNote,
  folder,
  swipeDelete,
  addNode,
} from '../../Component/MyIcons';
import {
  GetTime,
  ButtonClass,
  showToast,
  width,
} from '../../Component/Component';
import { strings } from '../../Localization/Localization';
import { CollapsibleHeaderScrollView } from 'react-native-collapsible-header-views';
import HTML from 'react-native-render-html';
import axios from 'axios';
import Swipeout from '../../Swipeout/index'
import Share from 'react-native-share';
import Modal from 'react-native-modalbox';

export const BottomModalButtonStyle = ({ title, onPress, icon }) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.7}
    style={{
      flexDirection: 'row',
      padding: 16,
      alignItems: 'center',
      backgroundColor: '#fff',
      borderRadius: 14,
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(0, 0, 0, 0.2)',
    }}>
    {icon}
    <Text style={{ marginLeft: 8, fontSize: 20, color: '#232857' }}>{title}</Text>
  </TouchableOpacity>
);

export default class AddFolder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      dataNote: [],
      isLoading: true,
      isLoadingNote: true,
      folderName: '',
      parentId: this.props.route.params.id,
    };
  }

  componentDidMount() {
    const unsubscribe = this.props.navigation.addListener('focus', () => {
      this.getNoteList();
    });
    this.GetFolders();
  }

  getNoteList() {
    axios
      .get(`notes/folder/${this.state.parentId}/notes/`)
      .then(response => {
        console.log('RESPONSE notes:', response);

        this.setState({
          dataNote: response.data,
          isLoadingNote: false,
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

  GetFolders() {
    axios
      .get('notes/folder/?parent=' + this.state.parentId)
      .then(response => {
        console.log('RESPONSE folder:', response);

        this.setState({
          folderName: '',
          data: response.data,
          isLoading: false,
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

  saveFolder() {
    const { folderName } = this.state;
    if (folderName) {
      axios
        .post('notes/folder/', {
          parent: this.state.parentId,
          label: folderName,
        })
        .then(response => {
          console.log('RESPONSE create:', response);
          this.mdlRef.close();
          this.GetFolders();
        })
        .catch(error => {
          console.log('RESPONSE error:', error.response);
          if (error.response && error.response.status == 401) {
            showToast('error', error.response.data.detail);
          }
        });
    }
  }

  renderItem = ({ item, index }) => {
    return (
      <Swipeout
        autoClose={true}
        style={{
          backgroundColor: 'white',
        }}
        right={[
          {
            component: (
              <View
                style={{
                  backgroundColor: '#f0dcda',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flex: 1,
                  maxHeight: 200,
                }}>
                {swipeDelete}
                <Text
                  style={{
                    marginTop: 4,
                    fontSize: 8,
                    color: '#FF3B30',
                  }}>
                  {strings.delete}
                </Text>
              </View>
            ),
            onPress: () => {
              axios
                .delete(`notes/folder/${item.id}/`)
                .then(response => {
                  console.log('RESPONSE folder:', response);
                  this.GetFolders();
                })
                .catch(error => {
                  console.log('RESPONSE folder:', error.response);
                  if (error.response && error.response.status == 401) {
                    showToast('error', error.response.data.detail);
                  }
                });
            },
          },
        ]}>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginHorizontal: 16,
            borderBottomWidth: 0.5,
            borderBottomColor: 'rgba(0, 0, 0, 0.2)',
            paddingVertical: 12,
          }}
          onPress={() =>
            this.props.navigation.navigate('NotesList', {
              title: item.label,
              id: item.id,
            })
          }>
          {folder}
          <Text style={{ fontSize: 17, marginLeft: 12 }}>{item.label}</Text>
        </TouchableOpacity>
      </Swipeout>
    );
  };

  renderItemNote = ({ item, index }) => {
    const regex = /<[^>]*>/gim;
    const description = item.desc && item.desc.replace(regex, '');

    return (
      <Swipeout
        autoClose={true}
        style={{
          borderRadius: 10,
          backgroundColor: '#F2F2F7',
          marginHorizontal: 16,
          marginBottom: 8,
          maxHeight: 200,
        }}
        right={[
          {
            component: (
              <View
                style={{
                  backgroundColor: '#e0e2fd',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flex: 1,
                  maxHeight: 200,
                }}>
                {ShareNote}
                <Text style={{ marginTop: 4, fontSize: 8, color: '#3F49DC' }}>
                  поделиться
                </Text>
              </View>
            ),
            onPress: () => {
              this.share(item);
            },
          },
          {
            component: (
              <View
                style={{
                  backgroundColor: '#f0dcda',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flex: 1,
                  maxHeight: 200,
                }}>
                {swipeDelete}
                <Text style={{ marginTop: 4, fontSize: 8, color: '#FF3B30' }}>
                  {strings.delete}
                </Text>
              </View>
            ),
            onPress: () => {
              axios
                .delete(`notes/note/${item.id}/`)
                .then(response => {
                  console.log('RESPONSE notes:', response);

                  this.getNoteList();
                })
                .catch(error => {
                  console.log('RESPONSE error:', error.response);
                  if (error.response && error.response.status == 401) {
                    showToast('error', error.response.data.detail);
                  }
                });
            },
          },
        ]}>
        <TouchableOpacity
          onPress={() =>
            this.props.navigation.navigate('NoteAdd', {
              folderId: this.state.parentId,
              item: item,
            })
          }
          key={index}
          activeOpacity={0.7}
          style={{
            padding: 16,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                fontSize: 17,
                fontWeight: '600',
                flex: 1,
              }}
              numberOfLines={1}>
              {item.label}
            </Text>
            <Text style={{ fontSize: 15, color: 'rgba(0, 0, 0, 0.4)' }}>
              {GetTime(item.updated_at, 'D MMM, h:mm')}
            </Text>
          </View>
          {/* <HTML
            containerStyle={{marginLeft: 10}}
            source={{
              html: item.desc,
            }}
            contentWidth={width / 5}
            baseStyle={{fontSize: 17, marginTop: 8}}
          /> */}
          {description ? (
            <Text numberOfLines={1} style={{ marginTop: 8, fontSize: 17 }}>
              {description}
            </Text>
          ) : null}
        </TouchableOpacity>
      </Swipeout>
    );
  };

  render() {
    const { folderName, data, dataNote } = this.state;
    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
          <Header
            onLeftPress={() => this.props.navigation.goBack()}
            deleteBackText={true}
            title={this.props.route.params?.title}
            rightSvg
            right_icon={Pluse}
            onRightPress={() => this.mdlRef.open()}
            right_icon2={addNode}
            onRightPress2={() =>
              this.props.navigation.navigate('NoteAdd', {
                folderId: this.state.parentId,
              })
            }
          />
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('SearchNote')}
            activeOpacity={0.7} style={{ height: 36, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, borderRadius: 10, backgroundColor: 'rgba(142, 142, 147, 0.12)', marginHorizontal: 16, marginVertical: 4 }}>
            {Search}
            <Text style={{ marginLeft: 8, fontSize: 16, color: 'grey' }}>{strings.search}</Text>
          </TouchableOpacity>
          <FlatList
            data={data}
            keyExtractor={(item, index) => index.toString()}
            renderItem={this.renderItem}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={() => (
              <FlatList
                style={{ marginVertical: 16 }}
                data={dataNote}
                keyExtractor={(item, index) => index.toString()}
                renderItem={this.renderItemNote}
                showsVerticalScrollIndicator={false}
              />
            )}
          />
        </SafeAreaView>
        <Modal
          ref={e => (this.mdlRef = e)}
          backdropColor={'rgba(0,0,0,0.7)'}
          position="bottom"
          coverScreen
          style={{ height: 'auto', backgroundColor: 'transparent' }}>
          <View
            style={{
              backgroundColor: '#fff',
              width: width - 20,
              marginHorizontal: 10,
              borderRadius: 14,
            }}>
            <Text style={{ marginHorizontal: 16, marginTop: 24 }}>
              Папаканың атын енгізіңіз
            </Text>
            <TextInput
              placeholder={strings.papka}
              value={folderName}
              onChangeText={folderName => this.setState({ folderName })}
              style={{
                margin: 16,
                padding: 16,
                backgroundColor: '#EEEEEE',
                borderRadius: 12,
              }}
            />
          </View>
          <ButtonClass
            onPress={() => this.saveFolder()}
            title={strings.save}
            style={{
              backgroundColor: '#fff',
              width: width - 20,
              marginHorizontal: 10,
              marginTop: 4,
              borderBoRadius: 14,
            }}
            titleStyle={{
              fontSize: 20,
              fontWeight: '700',
              color: '#232857',
            }}
          />
          <ButtonClass
            onPress={() => this.mdlRef.close()}
            title={strings.bastar}
            style={{
              backgroundColor: '#fff',
              width: width - 20,
              marginHorizontal: 10,
              marginBottom: 30,
              borderRadius: 14,
            }}
            titleStyle={{
              fontSize: 20,
              fontWeight: '700',
              color: '#E64646',
            }}
          />
        </Modal>
      </View>
    );
  }
}
