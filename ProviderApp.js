import React, { Component, createContext } from 'react';

const StateContext = createContext();

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
