/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  StyleSheet,
  Keyboard,
  Modal,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../Component/Header2';
import {
  addNode,
  Pluse,
  Search,
  SearchX,
  ShareNote,
  swipeDelete,
} from '../../Component/MyIcons';
import { GetTime, Header2, showToast, width } from '../../Component/Component';
import { strings } from '../../Localization/Localization';
import { CollapsibleHeaderScrollView } from 'react-native-collapsible-header-views';
import HTML from 'react-native-render-html';
import axios from 'axios';
import Swipeout from '../../Swipeout/index'
import Share from 'react-native-share';
import { GetNotesByID, InsertQueryNotes } from '../../database/KemelSQLite';
import NetInfo from "@react-native-community/netinfo";


export default class NotesList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      searchData: [],
      searchText: '',
      visible: false,
      isLoading: true,
      folderId: this.props.route.params.id,
    };
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {

      this.unsubscribeNet = NetInfo.addEventListener(async state => {
        if (state.isConnected) {
          this.getNoteList();
        } else {
          let notes = await GetNotesByID(this.state.parentId)


          this.setState({
            data: notes._array,
            searchData: notes._array,
            isLoading: false,
          });

        }
      })

    });

  }

  getNoteList() {
    axios
      .get(`notes/folder/${this.state.folderId}/notes/`)
      .then(response => {
        console.log('RESPONSE notes:', response);

        let result = response.data
        for (let r = 0; r < result.length; r++) {
          let element = result[r]
          element.dessc = element.desc
        }
        this.setState({
          data: result,
          searchData: result,
          isLoading: false,
        }, () => {
          InsertQueryNotes(result)
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

  CollapsibleHeaderComponent = () => (
    <TouchableOpacity
      onPress={() => this.setState({ visible: true })}
      activeOpacity={0.7}
      style={styles.vwStl}>
      {Search}
      <Text
        style={{
          marginLeft: 8,
          fontSize: 17,
          color: 'rgba(0, 0, 0, 0.4)',
        }}>
        {strings.search}
      </Text>
    </TouchableOpacity>
  );

  share(item) {
    let hmtl = item.label + '\n' + item.desc;
    const shareOptions = {
      title: 'Kemel Adam',
      message: hmtl,
      url: 'https://kemeladam.kz/',
    };

    Share.open(shareOptions)
      .then(res => { })
      .catch(err => {
        err && console.log(err);
      });
  }

  renderItem = ({ item, index }) => {
    const regex = /<[^>]*>/gim;
    let description = item.desc && item.desc.replace(regex, '');
    description = description.replaceAll('&nbsp;', '');

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
              folderId: this.state.folderId,
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
                color: 'black',
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
            <Text numberOfLines={1} style={{ color: 'black', marginTop: 8, fontSize: 17 }}>
              {description}
            </Text>
          ) : null}
        </TouchableOpacity>
      </Swipeout>
    );
  };

  SearchFunction(value) {
    let searchData = this.state.searchData.filter(item => {
      return item.label.toLowerCase().match(value.toLowerCase());
    });


    console.log('searchData', searchData);
    this.setState({
      searchText: value,
      searchData: searchData,
    });
  }

  render() {
    const { data, isLoading, visible, searchText, searchData, folderId } = this.state;
    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
          <Header
            onLeftPress={() => this.props.navigation.goBack()}
            deleteBackText={true}
            title={this.props.route.params?.title}
            rightSvg
            right_icon={addNode}
            onRightPress={() =>
              this.props.navigation.navigate('NoteAdd', { folderId: folderId })
            }
          />


          <View style={{ flex: 1, paddingHorizontal: 16, marginTop: 10 }}>
            {isLoading ?
              <View style={{ padding: 16 }}>
                <ActivityIndicator color={'#3F49DC'} />
              </View>
              :
              (
                <CollapsibleHeaderScrollView
                  CollapsibleHeaderComponent={this.CollapsibleHeaderComponent}
                  headerHeight={55}
                  clipHeader
                  onScroll={() => Keyboard.dismiss()}
                  showsVerticalScrollIndicator={false}>
                  {data.map((item, index) => this.renderItem({ item, index }))}
                </CollapsibleHeaderScrollView>
              )}
          </View>
        </SafeAreaView>

        {/* //////SEARCH MODAL////// */}
        <Modal visible={visible} animationType={'fade'}>
          <SafeAreaView style={{ flex: 1 }}>
            <View
              style={{ paddingHorizontal: 16, backgroundColor: '#fff', flex: 1 }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 10,
                  paddingBottom: 10,
                }}>
                <View style={[styles.vwStl, { marginTop: 0, flex: 1 }]}>
                  {Search}
                  <TextInput
                    placeholder={strings.search}
                    placeholderTextColor={'rgba(0, 0, 0, 0.4)'}
                    onChangeText={searchText => {
                      if (searchText.length == 0) {
                        this.setState({ searchText: '', searchData: data });
                      } else {
                        this.SearchFunction(searchText);
                      }
                    }}
                    returnKeyType="search"
                    autoFocus
                    value={this.state.searchText}
                    style={{
                      marginHorizontal: 8,
                      fontSize: 17,
                      width: width / 1.7,
                    }}
                  />
                  {searchText.length == 0 ? null : (
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() =>
                        this.setState({ searchText: '', searchData: data })
                      }>
                      {SearchX}
                    </TouchableOpacity>
                  )}
                </View>
                <TouchableOpacity
                  onPress={() => this.setState({ visible: false })}
                  activeOpacity={0.7}
                  style={{ marginLeft: 12 }}>
                  <Text style={{ fontSize: 17, color: '#3F49DC' }}>
                    {strings.otm}
                  </Text>
                </TouchableOpacity>
              </View>


              <ScrollView
                showsVerticalScrollIndicator={false}
                style={{ paddingTop: 5 }}>
                {searchData.map((item, index) =>
                  this.renderItem({ item, index }),
                )}
              </ScrollView>
            </View>
          </SafeAreaView>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  vwStl: {
    paddingVertical: 7,
    backgroundColor: 'rgba(142, 142, 147, 0.12)',
    flexDirection: 'row',
    paddingHorizontal: 10,
    borderRadius: 10,
    marginTop: 1,
    alignItems: 'center',
  },
});
