import {
  BOT_SETTINGS,
  UPDATE_BOT_SETTINGS,
  GET_BOTS,
  UPDATE_BOT,
  UPDATE_STATUS,
  ADD_BOT,
  GET_TAGS,
  DELETE_BOT,
  SYNC_BOTS,
  GET_FOLDERS,
  GET_SCREENSHOTS,
  GET_RUNNING_BOTS,
  UPDATE_RUNNING_BOT,
  POST_LAUNCH_INSTANCE,
  GET_BOT,
  COPY_INSTANCE,
  RESTORE_INSTANCE,
  DOWNLOAD_INSTANCE_PEM_FILE,
  SYNC_BOT_INSTANCES,
  CLEAR_BOT,
  REGIONS,
  UPDATE_REGION,
  BOT_REPORT,
  LIMIT_CHANGE
} from "./types";
import { success } from "redux-saga-requests";

export const getBotSettings = () => ({
  type: BOT_SETTINGS,
  request: {
    method: "GET",
    url: "/aws"
  },
  meta: {
    thunk: true,
  }
});

export const updateBotSettings = (id, data) => ({
  type: UPDATE_BOT_SETTINGS,
  request: {
    method: "PUT",
    url: `/aws/${id}`,
    data: { update: data }
  },
  meta: {
    thunk: true,
  }
});

export const getBots = (query = { page: 1, limit: 1 }) => {
  Object.keys(query).forEach(key => query[key] === "" && delete query[key]);

  return {
    type: GET_BOTS,
    request: {
      method: "GET",
      url: "/bots",
      params: query
    },
    meta: {
      thunk: true,
    }
  };
};

export const updateBot = (id, updateData) => {
  return {
    type: UPDATE_BOT,
    request: {
      method: "PUT",
      url: `/bots/${id}`,
      data: { update: updateData }
    },
    meta: {
      thunk: true,
    }
  };
};

export const updateStatusBot = (id, updateStatus) => {
  return {
    type: UPDATE_STATUS,
    request: {
      method: "PUT",
      url: `/bots/status/${id}`,
      data: { update: updateStatus }
    },
    meta: {
      thunk: true,
    }
  };
};

export const addBot = data => ({
  type: ADD_BOT,
  request: {
    method: "POST",
    url: "/bots",
    data
  },
  meta: {
    thunk: true,
  }
});

export const deleteBot = id => ({
  type: DELETE_BOT,
  request: {
    method: "DELETE",
    url: `/bots/${id}`
  },
  meta: {
    thunk: true,
  }
});

export const getTags = (query = { page: 1, limit: 1 }) => {
  Object.keys(query).forEach(key => query[key] === "" && delete query[key]);
  return {
    type: GET_TAGS,
    request: {
      method: "GET",
      url: "/bots/tags",
      params: query
    },
    meta: {
      thunk: true,
    }
  };
};

export const syncLocalBots = () => ({
  type: SYNC_BOTS,
  request: {
    method: "GET",
    url: "/bots/sync"
  },
  meta: {
    thunk: true,
  }
});

export const getFolders = (query = { page: 1, limit: 1 }) => {
  Object.keys(query).forEach(key => query[key] === "" && delete query[key]);
  return {
    type: GET_FOLDERS,
    request: {
      method: "GET",
      url: `/instances/${query.instance_id}/objects`,
      params: query
    },
    meta: {
      thunk: true
    }
  };
};

export const getScreenshots = (query = { page: 1, limit: 1 }) => {
  Object.keys(query).forEach(key => query[key] === "" && delete query[key]);
  return {
    type: GET_SCREENSHOTS,
    request: {
      method: "GET",
      url: `/instances/${query.instance_id}/objects`,
      params: { ...query, type: "screenshots" }
    },
    meta: {
      thunk: true
    }
  };
};

export const getRunningBots = (query = { page: 1, limit: 1 }) => {
  Object.keys(query).forEach(key => query[key] === "" && delete query[key]);
  return {
    type: GET_RUNNING_BOTS,
    request: {
      method: "GET",
      url: "/instances",
      params: query
    },
    meta: {
      thunk: true,
    }
  };
};

export const updateRunningBot = (id, updateData) => {
  return {
    type: UPDATE_RUNNING_BOT,
    request: {
      method: "PUT",
      url: `/instances/${id}`,
      data: { update: updateData }
    },
    meta: {
      thunk: true,
    }
  };
};

export const launchInstance = (id, params) => {
  return {
    type: POST_LAUNCH_INSTANCE,
    request: {
      method: "POST",
      url: "/instances/launch",
      data: { bot_id: id, params }
    },
    meta: {
      thunk: true
    }
  };
};

export const botInstanceUpdated = botInstance => ({
  type: success(UPDATE_RUNNING_BOT),
  data: botInstance
});

export const getBot = id => ({
  type: GET_BOT,
  request: {
    method: "GET",
    url: `/instances/${id}`
  },
  meta: {
    thunk: true,
  }
});

export const clearBot = () => ({
  type: CLEAR_BOT
});

export const reportBot = (id, data) => dispatch =>
  dispatch({
    type: BOT_REPORT,
    request: {
      method: "POST",
      url: `/instances/${id}/report`,
      data
    },
    meta: {
      thunk: true
    }
  });

export const setBotLimit = limit => ({
  type: LIMIT_CHANGE,
  data: limit
});

export const copyInstance = id => {
  return {
    type: COPY_INSTANCE,
    request: {
      method: "POST",
      url: "/instances/copy",
      data: { instance_id: id }
    },
    meta: {
      thunk: true
    }
  };
};

export const restoreBot = id => {
  return {
    type: RESTORE_INSTANCE,
    request: {
      method: "POST",
      url: "/instances/restore",
      data: { instance_id: id }
    },
    meta: {
      thunk: true
    }
  };
};

export const downloadInstancePemFile = id => {
  return {
    type: DOWNLOAD_INSTANCE_PEM_FILE,
    request: {
      method: "GET",
      url: "/bots/instances/pem",
      params: { instance: id }
    },
    meta: {
      thunk: true,
    }
  };
};

export const syncBotInstances = (id, data) => ({
  type: SYNC_BOT_INSTANCES,
  request: {
    method: "GET",
    url: "/bots/instances/sync",
    data: { update: data }
  },
  meta: {
    thunk: true,
  }
});

export const getRegions = query => ({
  type: REGIONS,
  request: {
    method: "GET",
    url: "/bots/instances/regions",
    params: query
  },
  meta: {
    thunk: true
  }
});

export const updateRegion = (id, data) => ({
  type: UPDATE_REGION,
  request: {
    method: "PUT",
    url: `/bots/instances/regions/${id}`,
    data: { update: data }
  },
  meta: {
    thunk: true
  }
});

