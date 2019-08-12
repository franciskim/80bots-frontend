import {
  GET_SCHEDULES
} from './types';

export const getSchedules = (page) => {
  return {
    type: GET_SCHEDULES,
    request: {
      method: 'GET',
      url: '/schedules',
    },
    meta: {
      thunk: true
    }
  };
};
