import {
  ADD_LISTENER, EMIT_MESSAGE, REMOVE_ALL_LISTENERS, REMOVE_LISTENER, ADD_EXTERNAL_LISTENER,
  REMOVE_ALL_EXTERNAL_LISTENERS, EMIT_EXTERNAL_MESSAGE
} from './types';

export const emitMessage = (eventName, message) => ({
  type: EMIT_MESSAGE,
  data: { eventName, message }
});

export const emitExternalMessage = (eventName, message, url) => ({
  type: EMIT_EXTERNAL_MESSAGE,
  data: { eventName, message, url }
});

export const removeAllListeners = () => ({
  type: REMOVE_ALL_LISTENERS
});

export const removeAllExternalListeners = () => ({
  type: REMOVE_ALL_EXTERNAL_LISTENERS
});

export const addListener = (room, eventName, handler) => ({
  type: ADD_LISTENER,
  data: { room, eventName, handler }
});

export const addExternalListener = (url, room, eventName, handler) => ({
  type: ADD_EXTERNAL_LISTENER,
  data: { url, room, eventName, handler }
});

export const removeListener = (eventName) => ({
  type: REMOVE_LISTENER,
  data: { eventName }
});
