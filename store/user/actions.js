import {
  TIMEZONES
} from './types';

export const getTimeZones = () => ({
  type: TIMEZONES,
  request: {
    method: 'GET',
    url: '/user/timezone'
  },
  meta: {
    thunk: true
  }
});