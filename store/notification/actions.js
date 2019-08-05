import { ADD_NOTIFICATION, REMOVE_NOTIFICATION, HIDE_NOTIFICATION } from './types';

/**
 *
 * @param {Object} payload Notification object
 * @param {String} payload.type Type of notification [info, help, error, success]
 * @param {String} payload.message Notification message
 * @param {Number=} payload.hideDelay Notification hide delay
 *
 */

export const addNotification = (payload) => {
  return {
    type: ADD_NOTIFICATION,
    data: { ...payload }
  };
};

export const hideNotification = () => {
  return {
    type: HIDE_NOTIFICATION
  };
};

export const removeLastNotification = () => {
  return {
    type: REMOVE_NOTIFICATION
  };
};