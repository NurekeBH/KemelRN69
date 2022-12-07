import React, { Component } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Header from '../../Component/Header2';
import { PlayWhite } from '../../Component/MyIcons';
import { strings } from '../../Localization/Localization';

export default class MyBooks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      books: [0, 1, 2, 3, 4],
      audioBooks: [0, 1, 2, 3, 4],
    };
  }

  renderBooks = ({ item, index }) => (
    <TouchableOpacity
      onPress={() => this.props.navigation.navigate('Book')}
      activeOpacity={0.7}
      style={{
        width: 126,
        marginHorizontal: 10,
        marginRight: this.state.books.length - 1 == index ? 22 : 0,
        marginTop: 13,
      }}>
      <FastImage
        style={{ width: 126, height: 192, borderRadius: 4 }}
        source={{
          uri: 'https://images.unsplash.com/photo-1508921912186-1d1a45ebb3c1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cGhvdG98ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60',
        }}
      />
      <Text
        numberOfLines={2}
        style={{ color: 'black', marginTop: 8, fontSize: 15, fontWeight: '600' }}>
        Абай. 37 стихотворений
      </Text>
      <Text style={{ marginTop: 4, color: '#8E8E93' }}>Марат Адибаев</Text>
    </TouchableOpacity>
  );

  renderAudioBooks = ({ item, index }) => (
    <TouchableOpacity
      onPress={() => this.props.navigation.navigate('Book')}
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
          uri: 'https://images.unsplash.com/photo-1531804055935-76f44d7c3621?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cGhvdG98ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60',
        }}>
        <View />
        {PlayWhite}
      </FastImage>
      <Text
        numberOfLines={2}
        style={{ color: 'black', marginTop: 8, fontSize: 15, fontWeight: '600' }}>
        Абай. 37 стихотворений
      </Text>
      <Text style={{ marginTop: 4, color: '#8E8E93' }}>Марат Адибаев</Text>
    </TouchableOpacity>
  );

  render() {
    const { books, audioBooks } = this.state;
    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <SafeAreaView style={{ flex: 1 }}>
          <Header
            title={strings.mybooks}
            onLeftPress={() => this.props.navigation.goBack()}
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
                    color: 'black',
                    fontSize: 20,
                    fontWeight: '600',
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
