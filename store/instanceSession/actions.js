import {
  GET_SESSIONS
} from './types';

export const getSessions = (query = { page: 1, limit: 1 }) => {
  Object.keys(query).forEach((key) => (query[key] === '') && delete query[key]);

  return {
    type: GET_SESSIONS,
    request: {
      method: 'GET',
      url: '/session',
      params: query
    },
    meta: {
      thunk: true
    }
  };
};