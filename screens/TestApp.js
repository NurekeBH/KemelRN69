import * as React from 'react';
import { Text, View, StyleSheet, TextInput, TouchableOpacity, findNodeHandle, UIManager } from 'react-native';

import { Alert, Platform, PermissionsAndroid } from "react-native";
import { WebView } from 'react-native-webview';

const scriptStr = `(function() {
    var ready = function ( fn ) {
        if ( typeof fn !== 'function' ) return;
        if ( document.readyState === 'complete'  ) {
            return fn();
        }
        
        document.addEventListener( 'interactive', fn, false );
    };
    ready(init);
    window.onload=function() {
        init();
    };
    function init() {
        document.body.style['-webkit-user-select'] = 'none';
        window.document.title += "-Long Press to save"
        html2canvas(document.getElementById('content'), {
            scale: 1.5,
        }).then(function(canvas) {
            var canvasData = canvas.toDataURL();
            document.body.innerHTML = '';
            var eg = new Image(); 
            eg.src = canvasData;
            eg.style.width = '100%';
            eg.style.display = 'block';
            eg.style['pointer-events'] = 'none';
            eg.style['-webkit-user-select'] = 'none';
            document.body.appendChild(eg);
            var timeOutEvent;
            document.body.addEventListener("touchstart", function (e) {
                clearTimeout(timeOutEvent);
                timeOutEvent = setTimeout(function () {
                    if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
                        window.ReactNativeWebView.postMessage(canvasData);
                    }
                }, 300);
            });
            document.body.addEventListener("touchmove", function (e) {
                clearTimeout(timeOutEvent);
                e.preventDefault()
            });
            document.body.addEventListener("touchend", function (e) {
                clearTimeout(timeOutEvent);
            })
        }).catch(function(e) {
            alert('error'+(e||''));
        });
    }
})()`;


const saveImg = async (base64Img, success, fail) => {

    const imageDatas = base64Img.split('data:image/png;base64,');
    const imageData = imageDatas[1];

    console.log('imageDatas: ', imageDatas);
    console.log('imageData: ', imageData);


}
const onWebviewMessage = (event) => {
    console.log('event: ', event);
    const url = event.nativeEvent.data;
    console.log('event url: ', url);

    Alert.alert(
        "Message",
        "Want to save images?",
        [
            {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
            },
            {
                text: "Confirm", onPress: () => {
                    console.log(url.slice(0, 100));
                    saveImg(url, () => Alert.alert('Success'), () => Alert.alert('Failed'));
                }
            }
        ]
    );
}

const layoutMeasure = (ref) => {
    return new Promise((resolve) => {
        UIManager.measure(findNodeHandle(ref), (x, y, width, height, pageX, pageY) => {
            resolve({
                x,
                y,
                width,
                height,
                pageX,
                pageY
            });
        });
    });
}

const TestApp = ({ route, navigation }) => {



    return (
        <View style={styles.webviewWrap} >

            <WebView
                source={{ uri: 'https://github.com/wxik/react-native-rich-editor' }}
                originWhitelist={["*"]}
                startInLoadingState={true}
                domStorageEnabled={true}
                javaScriptEnabled={true}
                injectedJavaScript={scriptStr}
                onMessage={onWebviewMessage}
                layoutMeasure={layoutMeasure}
            >
            </WebView>


        </View>
    );
}

const styles = StyleSheet.create({
    webviewWrap: {
        flex: 1,
        width: "100%",
        height: "100%",
        overflow: "hidden",
    }
});

export default TestApp;