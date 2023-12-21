import React, { Component, createContext } from 'react';
import useWebSocket, { ReadyState } from 'react-native-use-websocket';
import notifee from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const StateContext = createContext();


// AsyncStorage.getItem('user_id').then(value => {
//   if (value !== null) {
//     const socket = new WebSocket(`wss://app.kemeladam.kz/ws/chat/user/${value}/`)

//     socket.onopen = function (e) {
//       socket.send(JSON.stringify({
//         'type': 'online',
//       }))

//       console.log('nnnnnnn onopen', e)

//     }
//     socket.onmessage = function (event) {
//       let data = JSON.parse(event.data)
//       console.log('nnnnnnn onmessage', data)
//       onDisplayNotification(data)



//     }
//     socket.onclose = function (event) {
//       console.log('nnnnnnn onclose', event)

//     }
//     socket.onerror = function (event) {
//       console.log('nnnnnnn onerror', event)

//     }

//   }
// });




class ProviderApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      avatar: null,
    };
  }

  setAvatar = avatar => {
    this.setState({ avatar });
  };



  render() {
    return (
      <StateContext.Provider
        value={{
          avatar: this.state.avatar,
          setAvatar: this.setAvatar,
        }}>
        {this.props.children}
      </StateContext.Provider>
    );
  }
}

export { ProviderApp, StateContext };
