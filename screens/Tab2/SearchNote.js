import axios from 'axios';
import React, { Component } from 'react';
import Header from '../../Component/Header';
import { Left_icon } from '../../Component/MyIcons';
import { strings } from '../../Localization/Localization';
/* eslint-disable react-native/no-inline-styles */
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
} from 'react-native';
import {
    ShareNote,
    swipeDelete,
} from '../../Component/MyIcons';
import { GetTime, Header2, showToast, width } from '../../Component/Component';
import { CollapsibleHeaderScrollView } from 'react-native-collapsible-header-views';
import HTML from 'react-native-render-html';
import Swipeout from '../../Swipeout/index'
import Share from 'react-native-share';

export default class SearchNote extends Component {
    constructor(props) {
        super(props);
        this.state = {
            search: null,
            notes: []
        };
    }

    onSearch() {
        const { search } = this.state
        axios.get('notes/?search=' + search)
            .then(response => {
                console.log('search', response)

                this.setState({
                    notes: response.data
                })

            })
            .catch(error => {
                console.log('errorerror', error.response)
            })

    }

    renderItem = ({ item, index }) => {
        const regex = /<[^>]*>/gim;
        const description = item.desc && item.desc.replace(regex, '');

        return (
            <Swipeout
                autoClose={true}
                style={{
                    borderRadius: 10,
                    backgroundColor: '#F2F2F7',
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
        const { notes } = this.state
        return (
            <View style={{ flex: 1, paddingTop: 44 }}>
                <View
                    style={{
                        flexDirection: 'row',
                    }}>
                    <TouchableOpacity
                        style={{
                            width: 45,
                            paddingLeft: 10,
                            height: '100%',
                            alignItems: 'center',
                            flexDirection: 'row',
                        }}
                        onPress={() => this.props.navigation.goBack()}
                    >
                        {Left_icon}
                    </TouchableOpacity>
                    <TextInput
                        style={{ backgroundColor: "rgba(142, 142, 147, 0.12)", flex: 1, marginRight: 16, height: 36, borderRadius: 10, paddingHorizontal: 8 }}
                        placeholder={strings.search}
                        onChangeText={(text) => {
                            this.setState({
                                search: text
                            })
                        }}
                        returnKeyType="search"
                        onSubmitEditing={() => {
                            this.onSearch()
                        }}

                    />
                </View>
                <View styl={{ padding: 16, flex: 1, backgroundColor: 'white', paddingHorizontal: 16, }}>
                    <FlatList
                        data={notes}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={this.renderItem}
                        showsVerticalScrollIndicator={false}


                    />

                </View>

            </View>
        );
    }
}
