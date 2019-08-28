import {
  GET_BOTS,
  ADMIN_GET_BOTS,
  ADD_BOT,
  GET_RUNNING_BOTS,
  ADMIN_GET_RUNNING_BOTS,
  POST_LAUNCH_INSTANCE,
  ADMIN_POST_LAUNCH_INSTANCE,
  UPDATE_RUNNING_BOT,
  ADMIN_UPDATE_BOT,
  ADMIN_UPDATE_RUNNING_BOT,
  DOWNLOAD_INSTANCE_PEM_FILE,
  GET_TAGS, BOT_SETTINGS, UPDATE_BOT_SETTINGS
} from './types';
import { success } from 'redux-saga-requests';

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
      thunk: true,
    }
  };
};

export const updateAdminRunningBot = (id, updateData) => {
  return {
    type: ADMIN_UPDATE_RUNNING_BOT,
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

export const launchInstance = (id, params) => {
  return {
    type: POST_LAUNCH_INSTANCE,
    request: {
      method: 'POST',
      url: '/instances/launch',
      data: { bot_id: id, params }
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

export const adminLaunchInstance = (id, params) => {
  return {
    type: ADMIN_POST_LAUNCH_INSTANCE,
    request: {
      method: 'POST',
      url: '/admin/instances/launch',
      data: { bot_id: id, params }
    },
    meta: {
      thunk: true
    }
  };
};

export const adminGetRunningBots = (query = { page: 1, limit: 1 }) => {
  Object.keys(query).forEach((key) => (query[key] === '') && delete query[key]);
  return {
    type: ADMIN_GET_RUNNING_BOTS,
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

export const adminUpdateBot = (id, updateData) => {
  return {
    type: ADMIN_UPDATE_BOT,
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

export const adminGetBots = (query = { page: 1, limit: 1 }) => {

  Object.keys(query).forEach((key) => (query[key] === '') && delete query[key]);

  return {
    type: ADMIN_GET_BOTS,
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

export const downloadInstancePemFile = id => {
  return {
    type: DOWNLOAD_INSTANCE_PEM_FILE,
    request: {
      method: 'GET',
      url: '/admin/instances/pem',
      params: { instance: id }
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

export const botInstanceUpdated = botInstance => ({
  type: success(UPDATE_RUNNING_BOT),
  data: botInstance
});

export const getBotSettings = () => ({
  type: BOT_SETTINGS,
  request: {
    method: 'GET',
    url: '/admin/aws'
  },
  meta: {
    thunk: true,
    admin: true
  }
});

export const updateBotSettings = (id, data) => ({
  type: UPDATE_BOT_SETTINGS,
  request: {
    method: 'PUT',
    url: `/admin/aws/${id}`,
    data: { update: data }
  },
  meta: {
    thunk: true,
    admin: true
  }
});
