import {
  GET_FILES
} from './types';

export const getItems = (query = { page: 1, limit: 1 }) => {
  Object.keys(query).forEach((key) => (query[key] === '') && delete query[key]);
  return {
    type: GET_FILES,
    request: {
      method: 'GET',
      url: `/instances/${query.instance_id}/objects`,
      params: {...query, type: 'screenshots'}
    },
    meta: {
      thunk: true
    }
  };
};