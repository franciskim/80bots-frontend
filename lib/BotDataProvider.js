import SocketProvider from '/lib/SocketDataProvider';
import ApiProvider from '/lib/ApiDataProvider';

class BotDataProvider {
  constructor(config) {
    const { provider, url, data } = config;
    this.url = url;
    this.data = data;
    this._setupProvider(provider);
  }

  _setupProvider (providerType) {
    let providerClass;
    switch (providerType) {
      case 'sockets': {
        providerClass = SocketProvider;
        break;
      }
      case 'api': {
        providerClass = ApiProvider;
        break;
      }
      default: {
        throw new Error('Unknown data provider: ' + providerType);
      }
    }
    this.provider = new providerClass(this.url, this.data);
  }

  on (type, callback) {
    this.provider.on(type, callback);
  }

  emit (type, data) {
    this.provider.emit(type, data);
  }

  removeListener (type) {
    this.provider.removeListener(type);
  }

  removeAllListeners () {
    this.provider.removeAllListeners();
  }

  disconnect() {
    this.provider.disconnect();
  }

  connect () {
    this.provider.connect();
  }
}

export default BotDataProvider;
