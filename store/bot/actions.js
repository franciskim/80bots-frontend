import {
  GET_BOTS,
  ADD_BOT,
  GET_ADMIN_BOTS,
  GET_RUNNING_BOTS,
  GET_ADMIN_RUNNING_BOTS,
  POST_LAUNCH_INSTANCE,
  POST_ADMIN_LAUNCH_INSTANCE,
  UPDATE_RUNNING_BOT,
  UPDATE_ADMIN_BOT,
  UPDATE_ADMIN_RUNNING_BOT,
  GET_TAGS
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

export const getAdminBots = (query = { page: 1, limit: 1 }) => {
  Object.keys(query).forEach((key) => (query[key] === '') && delete query[key]);
  return {
    type: GET_ADMIN_BOTS,
    request: {
      method: 'GET',
      url: '/admin/bots',
      params: query
    },
    meta: {
      thunk: true,
      admin: true
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
      thunk: true,
    }
  };
};

export const updateAdminRunningBot = (id, updateData) => {
  return {
    type: UPDATE_ADMIN_RUNNING_BOT,
    request: {
      method: 'PUT',
      url: `/admin/instances/${id}`,
      data: { update: updateData }
    },
    meta: {
      thunk: true,
      admin: true
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

export const adminLaunchInstance = (id) => {
  return {
    type: POST_ADMIN_LAUNCH_INSTANCE,
    request: {
      method: 'POST',
      url: '/admin/instances/launch',
      data: { bot_id: id }
    },
    meta: {
      thunk: true
    }
  };
};

export const updateRunningBot = (id, updateData) => {
  return {
    type: UPDATE_RUNNING_BOT,
    request: {
      method: 'PUT',
      url: `/instances/${id}`,
      data: { update: updateData }
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

export const updateAdminBot = (id, updateData) => {
  return {
    type: UPDATE_ADMIN_BOT,
    request: {
      method: 'PUT',
      url: `/admin/bots/${id}`,
      data: { update: updateData }
    },
    meta: {
      thunk: true,
      admin: true
    }
  };
};

export const addBot = (data) => ({
  type: ADD_BOT,
  request: {
    method: 'POST',
    url: '/admin/bots',
    data
  },
  meta: {
    thunk: true,
    admin: true
  }
});

export const getTags = (query = { page: 1, limit: 1 }) => {
  Object.keys(query).forEach((key) => (query[key] === '') && delete query[key]);
  return {
    type: GET_TAGS,
    request: {
      method: 'GET',
      url: '/admin/bots/tags',
      params: query
    },
    meta: {
      thunk: true,
      admin: true
    }
  };
};