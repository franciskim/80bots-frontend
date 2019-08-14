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

export const getUsers = (query = { page: 1, limit: 1 }) => ({
  type: USERS,
  request: {
    method: 'GET',
    url: '/admin/user',
    params: query
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