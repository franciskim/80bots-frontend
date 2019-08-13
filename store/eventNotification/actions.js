import {
  ADD_LOW_CREDIT_NOTIFICATION, DELETE_LOW_CREDIT_NOTIFICATION, GET_LOW_CREDIT_NOTIFICATIONS
} from './types';

export const getLowCreditNotifications = (query = { page: 1, limit: 10 }) => {
  Object.keys(query).forEach((key) => (query[key] === '') && delete query[key]);

  return {
    type: GET_LOW_CREDIT_NOTIFICATIONS,
    request: {
      method: 'GET',
      url: '/admin/notification',
      params: query
    },
    meta: {
      thunk: true,
      admin: true
    }
  };
};

export const addLowCreditNotifications = (percentage) => ({
  type: ADD_LOW_CREDIT_NOTIFICATION,
  request: {
    method: 'POST',
    url: '/admin/notification',
    data: { percentage }
  },
  meta: {
    thunk: true,
    admin: true
  }
});

export const deleteLowCreditNotification = id => ({
  type: DELETE_LOW_CREDIT_NOTIFICATION,
  request: {
    method: 'DELETE',
    url: `/admin/notification/${id}`
  },
  meta: {
    thunk: true,
    admin: true
  }
});