import axios from 'axios'

const getArrayBufferUsingUrl = (url, expectedType) =>
  new Promise((resolve, reject) => {
    const Http = new XMLHttpRequest()
    Http.open('GET', url)
    Http.send()
    Http.onload = (e) => {
      const blobObj = new Blob([Http.responseText], {
        type: expectedType,
      })
      return blobObj.arrayBuffer().then(resolve).catch(reject)
    }
  })

class EventEmitter {
  constructor() {
    this.events = []
  }

  on(type, callback) {
    this.events.push({ type, callback })
  }

  emit(type, data) {
    this.events.forEach((event) => {
      if (event.type === type) {
        event.callback(data)
      }
    })
  }

  removeListener(type) {
    const events = []
    this.events.forEach((event) => {
      if (event.type !== type) {
        events.push(event)
      }
    })
    this.events = events
  }

  removeAllListeners() {
    this.events = []
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
  OUTPUT_APPEND: 'output.append',
}

const MESSAGES = {
  GET_LOGS: 'get_logs',
  GET_SCREENSHOTS: 'get_screenshots',
  GET_SCREENSHOT_FOLDERS: 'get_folders',
  GET_AVAILABLE_TYPES: 'output.available',
  GET_OUTPUT_FOLDERS: 'output.folders',
  GET_OUTPUT: 'output.data',
  GET_OUTPUT_FULL: 'output.full',
}

const OBJECT_TYPES = {
  TYPE_SCREENSHOTS: 'screenshots',
  TYPE_IMAGES: 'images',
  TYPE_LOGS: 'logs',
  TYPE_JSON: 'json',
}

class SocketDataProvider extends EventEmitter {
  constructor(url, data) {
    super()
    this.baseURL = `${url}/instances`
    this.params = {
      instance_id: data.query.id,
      withTrashed: true,
    }
    this.connect().catch(console.error)
  }

  async connect() {
    const { baseURL, params } = this

    this.api = axios.create({ baseURL, params })
    this.api.interceptors.request.use((req) => {
      const token = localStorage.getItem('token')
      if (token) {
        // By jacky, need to remove
        token =
          'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiZTMzMGNiNjg1Y2JkNjI4Y2E5NDliNWFkZmZkZGQ0OWRhNTBiMGQyZDJhNDg4MDViOTMwYTkyYzAyYjFmZDE4MDA2MGVmYTM1YWRhNTc5ZmYiLCJpYXQiOjE2MjcyMDUxNDksIm5iZiI6MTYyNzIwNTE0OSwiZXhwIjoxNjU4NzQxMTQ5LCJzdWIiOiIxIiwic2NvcGVzIjpbXX0.qcqmvVLKBU00yZuVnNZ0Qlf837XLUjcyPLbUgStrNb-JzYoAjzC3hnA64B0s0IpTg2MyhqEqTwefkikyd1ogpkj4vTPB_aTz2atfRrOW6lUlDMnTRzqk_Jjs5Z42ar0u5KtVin9Kyw-_LztGtcliNjQDS0uyNl24YMQKZW4uCpFF5G0oWOevA1NOpktDCEvVbdREduikZQnPAPcQAtDfyDfj5z8GPNFNR5b2LyfVawU6qGkpSUFD7wZIgYPNFfDAFLKzXuG0eGR5pf_CgGKSMfcwPq84ycA_eShMtyvbwD90a6C8l8PJFknYwIH-mqG1TLj5YUsI5nZCcEHb_BlhRXlh3KTMjY1TXuvIqt3iEVrK4GKXzUdqFSBY31VjS3z7wwY98a8ik4kNeV8vzre2EOGCj6T9mddDAmvCATuHdPHZpo1d6lyQ8jo8n9M1Zp9jZz2NUnm6yDpKyV2KlLxYtkiOiqSTwUpg6u-PrfOMnnV8bX5N69NNpjw2U5gMa7hMXuBJ52yZQwlBEqjfgjjb_oe1MXOMILB7loWge3Rp-PZA7uzVHqIUvTBEPPRAJIlG0Vn2mSUVmguSPG_UoG49e1E7SoyvXwGJl1pzCh0EVh0SLvWmUTPLTWMz9tL3cRFR9LWHxv4hvDR-KO5Jj3PHSo2pMZS4Qs16WnK20luEKYc'
        req.headers.Authorization = 'Bearer ' + token
      }
      return req
    })
    // Emulate connection for correct work of the listeners
    setTimeout(() => {
      super.emit('connect', 'Successfully connected to API')
    }, 300)
  }

  emit(type, cfg) {
    return this.emitAccordingEvent(type, cfg)
  }

  emitAccordingEvent(type, options) {
    console.log(options)
    switch (type) {
      case MESSAGES.GET_LOGS: {
        return this.api('logs', {
          params: {
            ...this.params,
            type: options.init ? 'server_init' : 'script_work',
          },
        })
          .then(async ({ data }) => {
            const { data: files } = data
            const log = files[0]
            const url = log.link
            return getArrayBufferUsingUrl(url, 'text/plain')
          })
          .then((buffer) => {
            return super.emit(EVENTS.LOG, buffer)
          })
      }
      case MESSAGES.GET_SCREENSHOTS: {
        return this.api('').then((res) => {
          return super.emit(EVENTS.SCREENSHOTS, res)
        })
      }
      case MESSAGES.GET_SCREENSHOT_FOLDERS: {
        return this.api
          .get('dates', {
            params: {
              ...this.params,
              ...options,
            },
          })
          .then(({ data }) => {
            const { dates: folders } = data

            const transformedFolders = folders.map((folder) => {
              return {
                name: folder,
                date: folder,
                files: ['2019-10-17-12-02-12.jpg', '2019-10-17-12-02-17.jpg'],
                src: 'https://thumbs.dreamstime.com/t/example-rubber-stamp-grunge-design-dust-scratches-effects-can-be-easily-removed-clean-crisp-look-color-easily-84906823.jpg',
              }
            })
            return super.emit(EVENTS.SCREENSHOT_FOLDERS, transformedFolders)
          })
      }
      case MESSAGES.GET_AVAILABLE_TYPES: {
        return this.api('').then((res) => {
          return super.emit(EVENTS.AVAILABLE_TYPES, res)
        })
      }
      case MESSAGES.GET_OUTPUT_FOLDERS: {
        return this.api('').then((res) => {
          return super.emit(EVENTS.OUTPUT_FOLDERS, res)
        })
      }
      case MESSAGES.GET_OUTPUT: {
        return this.api('').then((res) => {
          return super.emit(EVENTS.OUTPUT, res)
        })
      }
      case MESSAGES.GET_OUTPUT_FULL: {
        return this.api('').then((res) => {
          return super.emit(EVENTS.OUTPUT_FULL, res)
        })
      }
      default: {
        throw new Error('Unknown message type')
      }
    }
  }

  async disconnect() {
    delete this.api
  }
}

export default SocketDataProvider
