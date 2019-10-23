import io from 'socket.io-client';

class SocketDataProvider {
  constructor(url, data) {
    this.url = url;
    this.data = data;
    this.connect();
  }

  on (type, callback) {
    this.socket.on(type, callback);
  }

  connect () {
    this.socket = io(this.url, this.data);
  }

  emit (type, data) {
    this.socket.emit(type, data);
  }

  removeListener (type) {
    this.socket.removeListener(type);
  }

  removeAllListeners () {
    this.socket.removeAllListeners();
  }
  disconnect () {
    this.socket.disconnect();
  }
}

export default SocketDataProvider;