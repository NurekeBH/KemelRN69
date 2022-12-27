import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { DraxProvider, DraxView } from 'react-native-drax';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default class TestApp extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <GestureHandlerRootView
                style={{ flex: 1 }}>
                <DraxProvider>
                    <View style={styles.container}>
                        <DraxView
                            style={styles.draggable}
                            onDragStart={() => {
                                console.log('start drag');
                            }}
                            payload="world"
                        />
                        <DraxView
                            style={styles.receiver}
                            onReceiveDragEnter={({ dragged: { payload } }) => {
                                console.log(`hello ${payload}`);
                            }}
                            onReceiveDragExit={({ dragged: { payload } }) => {
                                console.log(`goodbye ${payload}`);
                            }}
                            onReceiveDragDrop={({ dragged: { payload } }) => {
                                console.log(`received ${payload}`);
                            }}
                        />
                    </View>
                </DraxProvider>
            </GestureHandlerRootView>

        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    draggable: {
        width: 100,
        height: 100,
        backgroundColor: 'blue',
    },
    receiver: {
        width: 100,
        height: 100,
        backgroundColor: 'green',
    },
});