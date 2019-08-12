import {
  GET_BOTS,
  GET_RUNNING_BOTS,
  POST_LAUNCH_INSTANCE
} from './types';

export const getBots = (page) => {

  const url = page ? `/bots?page=${page}` : '/bots';

  return {
    type: GET_BOTS,
    request: {
      method: 'GET',
      url: url,
    },
    meta: {
      thunk: true
    }
  };
};

export const getRunningBots = (page) => {

  const url = page ? `/bots/running?page=${page}` : '/bots/running';

  return {
    type: GET_RUNNING_BOTS,
    request: {
      method: 'GET',
      url: url,
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