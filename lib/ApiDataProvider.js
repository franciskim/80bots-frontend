import axios from 'axios';

const getArrayBufferUsingUrl = (url) => new Promise((resolve, reject) => {
  const Http = new XMLHttpRequest();
  Http.open('GET', url);
  Http.send();
  Http.onload = (e) => {
    const blobObj = new Blob([Http.responseText], {
      type: 'text/plain'
    });
    return blobObj.arrayBuffer()
      .then(resolve)
      .catch(reject);
  };
});

class EventEmitter {

  constructor() {
    this.events = [];
  }

  on (type, callback) {
    this.events.push({type, callback});
  }

  emit (type, data) {
    this.events.forEach(event => {
      if(event.type === type) {
        event.callback(data);
      }
    });
  }

  removeListener (type) {
    const events = [];
    this.events.forEach(event => {
      if(event.type !== type) {
        events.push(event);
      }
    });
    this.events = events;
  }

  removeAllListeners () {
    this.events = [];
  }
}

const EVENTS = {
  LOG: 'log',
  SCREENSHOT_FOLDERS: 'folders',
  SCREENSHOTS: 'screenshots',
  AVAILABLE_TYPES: 'output.available',
  OUTPUT_FOLDERS: 'output.folders',
  OUTPUT: 'output.data',
  OUTPUT_FULL: 'output.full',

  SCREENSHOT: 'screenshot',
  OUTPUT_APPEND: 'output.append'
};

const MESSAGES = {
  GET_LOGS: 'get_logs',
  GET_SCREENSHOTS: 'get_screenshots',
  GET_SCREENSHOT_FOLDERS: 'get_folders',
  GET_AVAILABLE_TYPES: 'output.available',
  GET_OUTPUT_FOLDERS: 'output.folders',
  GET_OUTPUT: 'output.data',
  GET_OUTPUT_FULL: 'output.full'
};

const OBJECT_TYPES = {
  TYPE_SCREENSHOTS: 'screenshots',
  TYPE_IMAGES: 'images',
  TYPE_LOGS: 'logs',
  TYPE_JSON: 'json',
};

class SocketDataProvider extends EventEmitter {
  constructor(url, data) {
    super();
    this.baseURL = `${url}/instances`;
    this.params = {
      instance_id: data.query.id,
      withTrashed: true
    };
    this.connect()
      .catch(console.error);
  }

  async connect () {
    const {baseURL, params} = this;
    this.api = axios.create({baseURL, params});
    this.api.interceptors.request.use(req => {
      const token = localStorage.getItem('token');
      if(token) {
        req.headers.Authorization = 'Bearer ' + token;
      }
      return req;
    });
    // Emulate connection for correct work of the listeners
    setTimeout(() => {
      super.emit('connect', 'Successfully connected to API');
    }, 300);
  }

  emit(type, cfg) {
    return this.emitAccordingEvent(type, cfg);
  }

  emitAccordingEvent (type, options) {
    console.log(options)
    switch (type) {
      case MESSAGES.GET_LOGS: {
        return this.api('logs', {
          params: {
            ...this.params,
            type: options.init ? 'server_init' : 'script_work'
          }
        })
          .then(async ({data}) => {
            const {data: files} = data;
            const log = files[0];
            const url = log.link;
            return getArrayBufferUsingUrl(url);
          })
          .then((buffer) => {
            return super.emit(EVENTS.LOG, buffer);
          });
      }
      case MESSAGES.GET_SCREENSHOTS: {
        return this.api('')
          .then((res) => {
            return super.emit(EVENTS.SCREENSHOTS, res);
          });
      }
      case MESSAGES.GET_SCREENSHOT_FOLDERS: {
        return this.api.get('dates', {
          params: {
            ...this.params,
            ...options
          }
        })
          .then(({data}) => {
            const { dates: folders } = data;
            return super.emit(EVENTS.SCREENSHOT_FOLDERS, folders);
          });
      }
      case MESSAGES.GET_AVAILABLE_TYPES: {
        return this.api('')
          .then((res) => {
            return super.emit(EVENTS.AVAILABLE_TYPES, res);
          });
      }
      case MESSAGES.GET_OUTPUT_FOLDERS: {
        return this.api('')
          .then((res) => {
            return super.emit(EVENTS.OUTPUT_FOLDERS, res);
          });
      }
      case MESSAGES.GET_OUTPUT: {
        return this.api('')
          .then((res) => {
            return super.emit(EVENTS.OUTPUT, res);
          });
      }
      case MESSAGES.GET_OUTPUT_FULL: {
        return this.api('')
          .then((res) => {
            return super.emit(EVENTS.OUTPUT_FULL, res);
          });
      }
      default: {
        throw new Error('Unknown message type');
      }
    }
  }

  async disconnect () {
    delete this.api;
  }
}

export default SocketDataProvider;