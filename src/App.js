import React, { Component } from 'react';
import socketIOClient from 'socket.io-client';

const endpoint = 'http://localhost:2017';

class App extends Component {
  constructor(props) {
    super(props);
    this.chatBox = React.createRef();
    this.io = socketIOClient(endpoint);
    this.state = {
      message: '',
      chatItems: [],
    };
  }
  componentDidMount() {
    this.io.on('newMessage', data => {
      console.log({ data });
      this.setState(prev => ({
        chatItems: [...prev.chatItems, data.message.message],
      }));
    });
  }
  sendMessage = () => {
    const { message } = this.state;
    this.io.emit('sendMessage', { message });
    this.setState({ message: '' });
  };
  changeMessage = event => {
    this.setState({ message: event.target.value });
  };
  keyChange = event => {
    if (event.key === 'Enter') this.sendMessage();
  };
  render() {
    const { chatItems } = this.state;
    return (
      <div
        style={{
          display: 'flex',
          height: '100vh',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div
          ref={this.chatBox}
          style={{
            height: 400,
            width: 350,
            border: '2px solid #ccc',
            backgroundColor: '#f7f7f7',
          }}
        >
          {chatItems.length
            ? chatItems.map((item, i) => <p key={i}>{item}</p>)
            : 'No chat'}
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', width: 350 }}>
          <input
            onChange={this.changeMessage}
            value={this.state.message}
            onKeyPress={this.keyChange}
            style={{ flexGrow: 1 }}
            type="text"
          />
          <button
            onClick={this.sendMessage}
            style={{
              flexGrow: 1,
              border: 'none',
              fontSize: 18,
              height: 30,
              width: 80,
            }}
          >
            Send
          </button>
        </div>
      </div>
    );
  }
}

export default App;
