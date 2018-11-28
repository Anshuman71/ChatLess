import React, { Component } from 'react';
import socketIOClient from 'socket.io-client';
import './App.css';
const endpoint = 'http://localhost:2017';

class App extends Component {
  constructor(props) {
    super(props);
    this.chatBox = React.createRef();
    this.io = socketIOClient(endpoint);
    this.state = {
      message: '',
      busy: '',
      open: false,
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
    this.io.on('typing', data => {
      this.setState({
        busy: data.typing.name,
      });
    });
  }
  componentWillUnmount() {
    clearTimeout(this.timeout);
  }
  sendMessage = () => {
    const { message } = this.state;
    this.io.emit('sendMessage', { message });
    this.setState({ message: '' });
  };
  changeMessage = event => {
    this.io.emit('isTyping', { name: 'Anshuman' });
    this.timeout = setTimeout(this.io.emit('isTyping', { name: '' }), 4000);
    this.setState({ message: event.target.value });
  };
  keyChange = event => {
    if (event.key === 'Enter') this.sendMessage();
  };
  open = () => {
    this.setState(prev => ({ open: !prev.open }));
  };
  render() {
    const { chatItems, open, busy } = this.state;
    return (
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
            ? chatItems.map((item, i) => <p key={i}>{item}</p>)
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
    );
  }
}

export default App;
