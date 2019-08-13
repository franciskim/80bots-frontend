import {
  GET_BOTS,
  GET_RUNNING_BOTS,
  GET_ADMIN_RUNNING_BOTS,
  POST_LAUNCH_INSTANCE,
  PUT_STATUS,
  PUT_ADMIN_STATUS
} from './types';

export const getBots = (query = { page: 1, limit: 1 }) => {
  Object.keys(query).forEach((key) => (query[key] === '') && delete query[key]);

  return {
    type: GET_BOTS,
    request: {
      method: 'GET',
      url: '/bots',
      params: query
    },
    meta: {
      thunk: true
    }
  };
};

export const getRunningBots = (query = { page: 1, limit: 1 }) => {

  Object.keys(query).forEach((key) => (query[key] === '') && delete query[key]);

  return {
    type: GET_RUNNING_BOTS,
    request: {
      method: 'GET',
      url: '/bots/running',
      params: query
    },
    meta: {
      thunk: true
    }
  };
};

export const launchInstance = (id) => {
  return {
    type: POST_LAUNCH_INSTANCE,
    request: {
      method: 'POST',
      url: '/instances/launch',
      data: { bot_id: id }
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
      url: '/bots/running/status',
      data: { id, status }
    },
    meta: {
      thunk: true
    }
  };
};

export const getAdminRunningBots = (query = { page: 1, limit: 1 }) => {

  Object.keys(query).forEach((key) => (query[key] === '') && delete query[key]);

  return {
    type: GET_ADMIN_RUNNING_BOTS,
    request: {
      method: 'GET',
      url: '/admin/bots/running',
      params: query
    },
    meta: {
      thunk: true,
      admin: true
    }
  };
};

export const changeAdminStatus = (id, status) => {
  return {
    type: PUT_ADMIN_STATUS,
    request: {
      method: 'PUT',
      url: '/admin/bots/running/status',
      data: { id, status }
    },
    meta: {
      thunk: true,
      admin: true
    }
  };
};