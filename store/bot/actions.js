import {
  GET_BOTS,
  GET_BOT,
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
  GET_TAGS, BOT_SETTINGS, UPDATE_BOT_SETTINGS, SYNC_BOT_INSTANCES, ADMIN_DELETE_BOT, AMIS, SYNC_BOTS, CLEAR_BOT,
  ADMIN_REGIONS, ADMIN_UPDATE_REGION, BOT_REPORT, REPORT_UPLOAD_PROGRESS, LIMIT_CHANGE
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

export const syncBotInstances = (id, data) => ({
  type: SYNC_BOT_INSTANCES,
  request: {
    method: 'GET',
    url: '/admin/instances/sync',
    data: { update: data }
  },
  meta: {
    thunk: true,
    admin: true
  }
});

export const adminDeleteBot = (id) => ({
  type: ADMIN_DELETE_BOT,
  request: {
    method: 'DELETE',
    url: `/admin/bots/${id}`
  },
  meta: {
    thunk: true,
    admin: true
  }
});

export const getAMIs = (params = { region: 2 }) => ({
  type: AMIS,
  request: {
    method: 'GET',
    url: '/admin/instances/amis',
    params: params
  },
  meta: {
    thunk: true,
    admin: true
  }
});

export const syncLocalBots = () => ({
  type: SYNC_BOTS,
  request: {
    method: 'GET',
    url: '/admin/bots/sync'
  },
  meta: {
    thunk: true,
    admin: true
  }
});

export const getBot = (id) => ({
  type: GET_BOT,
  request: {
    method: 'GET',
    url: `/instances/${id}`
  },
  meta: {
    thunk: true,
    admin: true
  }
});

export const adminGetBot = (id) => ({
  type: GET_BOT,
  request: {
    method: 'GET',
    url: `/admin/instances/${id}`
  },
  meta: {
    thunk: true,
    admin: true
  }
});

export const clearBot = () => ({
  type: CLEAR_BOT,
});

export const adminGetRegions = (query) => ({
  type: ADMIN_REGIONS,
  request: {
    method: 'GET',
    url: '/admin/instances/regions',
    params: query
  },
  meta: {
    thunk: true
  }
});

export const adminUpdateRegion = (id, data) => ({
  type: ADMIN_UPDATE_REGION,
  request: {
    method: 'PUT',
    url: `/admin/instances/regions/${id}`,
    data: { update: data }
  },
  meta: {
    thunk: true
  }
});

export const reportBot = (id, data) => dispatch => dispatch({
  type: BOT_REPORT,
  request: {
    method: 'POST',
    url: `/instances/${id}/report`,
    data,
    onUploadProgress: e => dispatch({
      type: REPORT_UPLOAD_PROGRESS, data: { progress: Math.round((e.loaded / e.total) * 100) }
    })
  },
  meta: {
    thunk: true
  }
});

export const setBotLimit = limit => ({
  type: LIMIT_CHANGE,
  data: limit
});
