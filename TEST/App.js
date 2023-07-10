import * as React from "react";
import useWebSocket, { ReadyState } from 'react-native-use-websocket';
import { Button, Text, FlatList, View, SafeAreaView } from "react-native";

export default function App() {

    const [socketUrl] = React.useState("wss://test.kemeladam.kz/ws/chat/26/");

    const messageHistory = React.useRef([])

    const { sendMessage,
        sendJsonMessage,
        lastMessage,
        lastJsonMessage,
        readyState,
        getWebSocket } = useWebSocket(socketUrl, {
            onOpen: () => console.log('opened'),
            //Will attempt to reconnect on all close events, such as server shutting down
            shouldReconnect: (closeEvent) => true,
        });

    console.log('messageHistory', messageHistory)




    messageHistory.current = React.useMemo(
        () => messageHistory.current.concat(lastJsonMessage),
        [lastJsonMessage]
    );

    const MMM = {
        "message": "Nur",
        "medias": [],
        "sender": {
            "id": 1
        }
    }


    const sendM = () => sendJsonMessage(MMM);

    const handleClickSendMessage = React.useCallback(sendM, [sendM]);

    const connectionStatus = {
        [ReadyState.CONNECTING]: "Connecting",
        [ReadyState.OPEN]: "Open",
        [ReadyState.CLOSING]: "Closing",
        [ReadyState.CLOSED]: "Closed",
        [ReadyState.UNINSTANTIATED]: "Uninstantiated",
    }[readyState];



    return (
        <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Button
                onPress={handleClickSendMessage}
                disabled={readyState !== ReadyState.OPEN}
                title={"Click Me to send Text"}
            />
            <Text style={{ marginTop: 16 }}>The WebSocket is currently {connectionStatus}</Text>
            {lastJsonMessage ? <Text style={{ marginTop: 16 }}>Last message: {lastJsonMessage.message}</Text> : null}
            <FlatList
                keyExtractor={(item, i) => {
                    return i.toString();
                }}
                data={messageHistory?.current}
                renderItem={({ item }) =>
                    item && item.message && <Text>{item.message.data}</Text>
                }
            />
        </SafeAreaView>
    );
}