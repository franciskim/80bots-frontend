import {
  GET_CREDIT_USAGE,
} from './types';

export const getCreditUsageHistory = (query = { page: 1, limit: 1 }) => {

  Object.keys(query).forEach((key) => (query[key] === '') && delete query[key]);

  return {
    type: GET_CREDIT_USAGE,
    request: {
      method: 'GET',
      url: '/history/credits',
      params: query
    },
    meta: {
      thunk: true
    }
  };
};

export const adminGetCreditUsageHistory = (query = { page: 1, limit: 1 }) => {

  Object.keys(query).forEach((key) => (query[key] === '') && delete query[key]);

  return {
    type: GET_CREDIT_USAGE,
    request: {
      method: 'GET',
      url: '/admin/history/credits',
      params: query
    },
    meta: {
      thunk: true
    }
  };
};
