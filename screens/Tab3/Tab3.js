import axios from 'axios';
import React, { Component } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { Header2, showToast } from '../../Component/Component';
import { PlayWhite } from '../../Component/MyIcons';
import TabHeader from '../../Component/TabHeader';
import { strings } from '../../Localization/Localization';
import Player from '../../screens/Player/Player';
export default class Tab3 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      books: [],
      isLoadingBook: true,
      audioBooks: [],
    };
  }

  componentDidMount() {
    this.getBookList();
    this.getAudioList();
  }
  getBookList() {
    axios
      .get('books/paper/')
      .then(response => {
        console.log('RESPONSE wallets:', response);
        this.setState({
          books: response.data.results,
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

  getAudioList() {
    axios
      .get('books/audio/')
      .then(response => {
        console.log('RESPONSE audio:', response);
        this.setState({
          audioBooks: response.data.results,
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

  renderBooks = ({ item, index }) => (
    <TouchableOpacity
      onPress={() =>
        this.props.navigation.navigate('Book', { item, type: 'book' })
      }
      activeOpacity={0.7}
      style={{
        width: 126,
        marginHorizontal: 10,
        marginRight: this.state.books.length - 1 == index ? 22 : 0,
        marginTop: 13,
      }}>
      <FastImage
        style={{ width: 126, height: 192, borderRadius: 4 }}
        source={{ uri: item.cover }}
      />
      <Text
        numberOfLines={2}
        style={{ color: 'black', marginTop: 8, fontSize: 15, fontWeight: '600' }}>
        {item.label}
      </Text>
      <Text style={{ marginTop: 4, color: '#8E8E93' }}>{item.author}</Text>
    </TouchableOpacity>
  );

  renderAudioBooks = ({ item, index }) => (
    <TouchableOpacity
      onPress={() =>
        this.props.navigation.navigate('Book', { item, type: 'audio' })
      }
      activeOpacity={0.7}
      style={{
        width: 130,
        marginHorizontal: 10,
        marginRight: this.state.books.length - 1 == index ? 22 : 0,
        marginTop: 13,
      }}>
      <FastImage
        style={{
          width: 130,
          aspectRatio: 1,
          borderRadius: 4,
          justifyContent: 'space-between',
          padding: 8,
        }}
        source={{
          uri: item.cover,
        }}>
        <View />
        {PlayWhite}
      </FastImage>
      <Text
        numberOfLines={2}
        style={{ color: 'black', marginTop: 8, fontSize: 15, fontWeight: '600' }}>
        {item.label}
      </Text>
      <Text style={{ marginTop: 4, color: '#8E8E93' }}>{item.author}</Text>
    </TouchableOpacity>
  );

  render() {
    const { books, audioBooks } = this.state;
    const _width = Dimensions.get('window').width;
    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <SafeAreaView style={{ flex: 1 }}>
          <TabHeader
            title={strings.books}
            borderBottomBoll
            navigation={this.props.navigation}
          />
          <ScrollView showsVerticalScrollIndicator={false}>
            <View
              style={{
                paddingVertical: 15,
                paddingBottom: 20,
                borderBottomWidth: 1,
                borderBottomColor: 'rgba(0, 0, 0, 0.1)',
              }}>
              <Text
                style={{ color: 'black', fontSize: 20, fontWeight: '600', marginHorizontal: 15 }}>
                {strings.books}
              </Text>
              <FlatList
                ListEmptyComponent={() => (
                  <View
                    style={{
                      width: _width,
                      height: 270,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <ActivityIndicator size={'large'} color={'#3F49DC'} />
                  </View>
                )}
                data={books}
                keyExtractor={(item, index) => index.toString()}
                showsHorizontalScrollIndicator={false}
                renderItem={this.renderBooks}
                horizontal
                contentContainerStyle={{ marginHorizontal: 4 }}
              />
            </View>
            {audioBooks.length == 0 ? null : (
              <View
                style={{
                  paddingVertical: 15,
                }}>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: '600',
                    color: 'black',
                    marginHorizontal: 15,
                  }}>
                  {strings.auidoBooks}
                </Text>
                <FlatList
                  data={audioBooks}
                  keyExtractor={(item, index) => index.toString()}
                  showsHorizontalScrollIndicator={false}
                  renderItem={this.renderAudioBooks}
                  horizontal
                  contentContainerStyle={{ marginHorizontal: 4 }}
                />
              </View>
            )}
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }
}
