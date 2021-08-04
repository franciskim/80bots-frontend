import axios from 'axios'
import { createRequestInstance, watchRequests } from 'redux-saga-requests'
import { createDriver } from 'redux-saga-requests-axios'

axios.defaults.timeout = 60000 // 1 minute timeout

export default function* rootSaga() {
  yield createRequestInstance({ driver: createDriver(axios) })
  yield watchRequests()
}

axios.interceptors.request.use((req) => {
  req.url = process.env.API_URL + req.url
  const token = localStorage.getItem('token')
  if (token) {
    req.headers.Authorization = 'Bearer ' + token
  }
  return req
})

axios.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    const { response } = error
    if (!response) {
      return Promise.reject(new Error('Could not communicate with server'))
    }
    const { status, data } = response
    if (status === 404 || status === 401 || status === 400) {
      return Promise.reject(new Error(data.message))
    }
    return Promise.reject(error)
  }
)
