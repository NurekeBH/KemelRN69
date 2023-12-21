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
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../Component/Header';
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
  Header2,
  showToast,
  width,
} from '../../Component/Component';
import { strings } from '../../Localization/Localization';
import axios from 'axios';
import Swipeout from '../../Swipeout/index'
import Modal from 'react-native-modalbox';
import TabHeader from '../../Component/TabHeader';
import { GetRootFolder, InsertQueryFolder } from '../../database/KemelSQLite';
import NetInfo from "@react-native-community/netinfo";


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

export default class Tab2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      isLoading: true,
      folderName: '',
    };
  }

  componentDidMount() {
    this.unsubscribe = NetInfo.addEventListener(async state => {

      if (state.isConnected) {
        this.GetFolders();
      } else {
        let rows = await GetRootFolder()
        console.log('rows', rows._array)

        this.setState({
          folderName: '',
          data: rows._array,
          isLoading: false,
        });

      }

    });
  }


  GetFolders() {
    axios
      .get('notes/folder/?parent__isnull=True')
      .then(response => {
        console.log('RESPONSE folder:', response);

        this.setState({
          folderName: '',
          data: response.data,
          isLoading: false,
        });

        InsertQueryFolder(response.data, false)
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
        .post('notes/folder/', { label: folderName })
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
        {this.renderItem2(item, index)}
      </Swipeout>
    );
  };
  renderItem2 = (item, index) => {
    return (
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
          this.props.navigation.navigate('AddFolder', {
            title: item.label == 'Заметки' ? strings.zam : item.label,
            id: item.id,
          })
        }>
        {folder}
        <Text style={{ color: 'black', fontSize: 17, marginLeft: 12 }}>{item.label == 'Заметки' ? strings.zam : item.label}</Text>
      </TouchableOpacity>
    );
  };



  render() {
    const { folderName, data, isLoading } = this.state;
    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
          <TabHeader
            rightIcon={addNode}
            rightOnPress2={() => this.mdlRef.open()}
            borderBottomBoll={false}
            title={strings.papka}
            navigation={this.props.navigation}
            rightIcon2={Pluse}
            rightOnPress={() =>
              this.props.navigation.navigate('NoteAdd', { folderId: data[0].id })
            }
          />
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('SearchNote')}
            activeOpacity={0.7} style={{ height: 36, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, borderRadius: 10, backgroundColor: 'rgba(142, 142, 147, 0.12)', marginHorizontal: 16, marginVertical: 4 }}>
            {Search}
            <Text style={{ marginLeft: 8, fontSize: 16, color: 'grey' }}>{strings.search}</Text>
          </TouchableOpacity>
          {isLoading ?
            <View style={{ padding: 16 }}>
              <ActivityIndicator color={'#3F49DC'} />
            </View>
            :
            null
          }
          <FlatList
            data={data}
            keyExtractor={(item, index) => index.toString()}
            renderItem={this.renderItem}
            showsVerticalScrollIndicator={false}
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
            <Text style={{ color: 'black', marginHorizontal: 16, marginTop: 24 }}>
              {strings.nameFolder}
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
