import {
  GET_PLATFORMS, GET_INSTANCE_TYPES
} from '../platform/types';

export const getPlatforms = (query = { page: 1, limit: 1 }) => {
  Object.keys(query).forEach((key) => (query[key] === '') && delete query[key]);
  return {
    type: GET_PLATFORMS,
    request: {
      method: 'GET',
      url: '/platform',
      params: query
    },
    meta: {
      thunk: true,
    }
  };
};

export const getInstanceTypes = (query = { page: 1, limit: 1 }) => {
  Object.keys(query).forEach((key) => (query[key] === '') && delete query[key]);
  return {
    type: GET_INSTANCE_TYPES,
    request: {
      method: 'GET',
      url: '/platform/types',
      params: query
    },
    meta: {
      thunk: true,
    }
  };
};