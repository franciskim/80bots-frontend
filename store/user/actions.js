import {
  TIMEZONES, USERS, UPDATE_USER
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

export const getUsers = () => ({
  type: USERS,
  request: {
    method: 'GET',
    url: '/admin/user'
  },
  meta: {
    thunk: true,
    admin: true
  }
});

export const updateUser = (id, updateData) => ({
  type: UPDATE_USER,
  request: {
    method: 'PUT',
    url: `/admin/user/${id}`,
    data: {
      update: updateData
    }
  },
  meta: {
    thunk: true,
    admin: true
  }
});