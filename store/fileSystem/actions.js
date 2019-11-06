import {
  GET_FILES,
  SET_ITEMS,
} from './types';

export const flushItems = () => {
  return {
    type: SET_ITEMS,
    data: {
      items: []
    }
  };
};

export const getItems = (query = { page: 1, limit: 10 }) => {
  Object.keys(query).forEach((key) => (query[key] === '') && delete query[key]);
  return {
    type: GET_FILES,
    request: {
      method: 'GET',
      url: `/instances/${query.instance_id}/objects`,
      params: {...query}
    },
    meta: {
      thunk: true
    }
  };
};