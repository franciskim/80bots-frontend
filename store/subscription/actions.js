import {
  GET_SUBSCRIPTIONS
} from './types';

export const getSubscriptions = () => {
  return {
    type: GET_SUBSCRIPTIONS,
    request: {
      method: 'GET',
      url: '/subscriptions',
    },
    meta: {
      thunk: true
    }
  };
};
