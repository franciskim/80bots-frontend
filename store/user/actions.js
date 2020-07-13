import {
  TIMEZONES, USERS, UPDATE_USER, REGIONS
} from './types';

export const getTimezones = () => ({
  type: TIMEZONES,
  request: {
    method: 'GET',
    url: '/user/timezone'
  },
  meta: {
    thunk: true
  }
});

export const getRegions = () => ({
  type: REGIONS,
  request: {
    method: 'GET',
    url: '/instances/regions'
  },
  meta: {
    thunk: true
  }
});

export const getUsers = (query = { page: 1, limit: 1 }) => ({
  type: USERS,
  request: {
    method: 'GET',
    url: '/user',
    params: query
  },
  meta: {
    thunk: true,
  }
});

export const updateUser = (id, updateData) => ({
  type: UPDATE_USER,
  request: {
    method: 'PUT',
    url: `/user/${id}`,
    data: {
      update: updateData
    }
  },
  meta: {
    thunk: true,
  }
});

export const updateStatus = (id, updateData) => ({
  type: UPDATE_USER,
  request: {
    method: 'PUT',
    url: `/user/status/${id}`,
    data: {
      update: updateData
    }
  },
  meta: {
    thunk: true,
  }
});