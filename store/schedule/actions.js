import {
  GET_SCHEDULES,
  PUT_STATUS
} from './types';

export const getSchedules = (query = { page: 1, limit: 1 }) => {

  Object.keys(query).forEach((key) => (query[key] === '') && delete query[key]);

  return {
    type: GET_SCHEDULES,
    request: {
      method: 'GET',
      url: '/schedules',
      params: query
    },
    meta: {
      thunk: true
    }
  };
};

export const changeStatus = (id, status) => {
  return {
    type: PUT_STATUS,
    request: {
      method: 'PUT',
      url: '/schedules/status',
      data: {
        id: id,
        status: status
      }
    },
    meta: {
      thunk: true
    }
  };
};