import {
  GET_SCHEDULES,
  PUT_STATUS
} from './types';

export const getSchedules = (page) => {

  const url = page ? `/schedules?page=${page}` : '/schedules';

  return {
    type: GET_SCHEDULES,
    request: {
      method: 'GET',
      url: url,
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