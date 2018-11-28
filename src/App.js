import React, { Component } from 'react';
import socketIOClient from 'socket.io-client';
import './App.css';
const endpoint = 'https://chat-less-backend.herokuapp.com';

let typing = false;
class App extends Component {
  constructor(props) {
    super(props);
    this.chatBox = React.createRef();
    this.io = socketIOClient(endpoint);
    this.username = window.localStorage.getItem('username');
    this.state = {
      message: '',
      busy: '',
      open: false,
      chatItems: [],
    };
  }
  componentDidMount() {
    this.io.on('newMessage', data => {
      this.setState(prev => ({
        chatItems: [...prev.chatItems, { ...data }],
      }));
    });
    this.io.on('typing', data => {
      this.setState({
        busy: data.typing.name !== this.username ? data.typing.name : '',
      });
    });
  }
  cancelTimeout = () => {
    typing = false;
    this.io.emit('isTyping', { name: '' });
  };
  sendMessage = () => {
    const { message } = this.state;
    if (message.trim() !== '') this.io.emit('sendMessage', { message });
    this.setState({ message: '' });
  };
  changeMessage = event => {
    if (typing === false) {
      typing = true;
      this.io.emit('isTyping', { name: this.username });
      this.timeout = setTimeout(this.cancelTimeout, 1000);
    } else {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(this.cancelTimeout, 1000);
    }
    this.setState({ message: event.target.value });
  };
  keyChange = event => {
    if (event.key === 'Enter') this.sendMessage();
  };
  getUsername = event => {
    this.username = event.target.value;
    window.localStorage.setItem('username', this.username);
  };
  open = () => {
    this.setState(prev => ({ open: !prev.open }));
  };
  render() {
    const { chatItems, open, busy } = this.state;
    return this.username ? (
      <div
        style={{
          display: 'flex',
          height: '100vh',
          flexDirection: 'column',
          alignItems: !open ? 'center' : 'flex-end',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            boxSizing: 'border-box',
            padding: '10px',
            height: '60px',
            display: 'flex',
            width: '100%',
            alignItems: 'center',
            background: '#490',
          }}
        >
          <img
            alt="menu"
            src={require('./images/hamburger.svg')}
            width="40px"
            style={{ cursor: 'pointer' }}
            onClick={this.open}
          />
          <h2 style={{ color: 'white', marginLeft: 100 }}>ChatLess</h2>
        </div>
        <div
          style={{
            boxSizing: 'border-box',
            position: 'absolute',
            top: '60px',
            left: -300,
            background: '#ffe',
            height: 'calc(100vh - 60px)',
            width: '300px',
            transform: open ? 'translateX(300px)' : 'translateX(0px)',
            transition: ' 0.6s transform',
            padding: 20,
          }}
        />
        <div
          ref={this.chatBox}
          style={{
            flexGrow: 1,
            width: !open ? '100vw' : 'calc(100% - 300px)',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            transitionProperty: 'width',
            transition: open && '0.6s all',
            overflowY: 'scroll',
            backgroundColor: '#f7f7f7',
          }}
          className={'chatBox'}
        >
          <p
            style={{
              marginTop: 0,
              height: 20,
              padding: 10,
              backgroundColor: '#145276',
              color: 'white',
            }}
          >
            {busy !== '' && busy + ' is typing...'}
          </p>
          {chatItems.length
            ? chatItems.map((item, i) => (
                <p
                  style={{
                    maxWidth: 200,
                    margin: 10,
                    padding: '5px 20px',
                    marginBottom: 0,
                    alignSelf:
                      this.io.id === item.message.id
                        ? 'flex-end'
                        : 'flex-start',
                    wordWrap: 'break-word',
                    background:
                      this.io.id === item.message.id ? '#cac' : '#cca',
                    borderRadius: 8,
                  }}
                  key={i}
                >
                  {item.message.data.message}
                </p>
              ))
            : 'No chat'}
        </div>
        <div
          style={{
            display: 'flex',
            width: !open ? '100vw' : 'calc(100% - 300px)',
            flexDirection: 'row',
            marginBottom: 5,
            transitionProperty: 'width',
            transition: open && '0.6s all',
            alignItems: 'center',
          }}
        >
          <input
            onChange={this.changeMessage}
            value={this.state.message}
            onKeyPress={event => event.key === 'Enter' && this.sendMessage()}
            style={{
              margin: '2px 10px',
              flexGrow: 1,
              color: '#445',
              fontSize: '14px',
              boxSizing: 'border-box',
              border: '2px solid #ccc',
              borderRadius: '5px',
              height: 40,
              padding: '5px 10px',
            }}
            type="text"
          />
          <button
            onClick={this.sendMessage}
            style={{
              border: 'none',
              fontSize: 18,
              marginRight: 10,
              height: 40,
              borderRadius: 5,
              width: 100,
            }}
          >
            Send
          </button>
        </div>
      </div>
    ) : (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: '200px',
          height: 200,
          justifyContent: 'space-evenly',
        }}
      >
        <h1>
          Welcome to <i style={{ color: '#490' }}>ChatLess</i>
        </h1>
        <input
          placeholder="Username"
          style={{
            margin: '2px 10px',
            color: '#445',
            flexGrow: 0,
            fontSize: '14px',
            boxSizing: 'border-box',
            border: '2px solid #ccc',
            borderRadius: '5px',
            height: 40,
            padding: '5px 10px',
          }}
          type="text"
          onChange={this.getUsername}
        />
        <button
          style={{
            border: 'none',
            fontSize: 18,
            marginRight: 10,
            height: 40,
            borderRadius: 5,
            width: 100,
          }}
          onClick={() => window.location.reload()}
        >
          {' '}
          Submit
        </button>
      </div>
    );
  }
}

export default App;
