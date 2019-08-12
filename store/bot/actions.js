import {
  GET_BOTS,
  GET_RUNNING_BOTS
} from './types';

export const getBots = (page) => {
  return {
    type: GET_BOTS,
    request: {
      method: 'GET',
      url: '/bots',
    },
    meta: {
      thunk: true
    }
  };
};

export const getRunningBots = (page) => {
  return {
    type: GET_RUNNING_BOTS,
    request: {
      method: 'GET',
      url: '/bots/running',
    },
    meta: {
      thunk: true
    }
  };
};