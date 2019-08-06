import axios from 'axios';
import { createRequestInstance, watchRequests } from 'redux-saga-requests';
import { createDriver } from 'redux-saga-requests-axios';


export default function* rootSaga() {
  yield createRequestInstance({ driver: createDriver(axios) });
  yield watchRequests();
}

axios.interceptors.request.use(req => {
  req.url = process.env.API_URL + req.url;
  const token = localStorage.getItem('token');
  if(token) {
    req.headers.Authorization = 'Bearer ' + token;
  }
  return req;
});