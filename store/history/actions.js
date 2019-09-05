import {
  GET_CREDIT_USAGE,
} from './types';

export const getCreditUsageHistory = (query = { page: 1, limit: 1 }) => {

  Object.keys(query).forEach((key) => (query[key] === '') && delete query[key]);

  return {
    type: GET_CREDIT_USAGE,
    request: {
      method: 'GET',
      url: '/schedule',
      params: query
    },
    meta: {
      thunk: true
    }
  };
};
