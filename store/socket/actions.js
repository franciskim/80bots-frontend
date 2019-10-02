import {
  ADD_LISTENER,
  EMIT_MESSAGE,
  REMOVE_ALL_LISTENERS,
  REMOVE_LISTENER,
  ADD_EXTERNAL_LISTENER,
  REMOVE_ALL_EXTERNAL_LISTENERS,
  EMIT_EXTERNAL_MESSAGE,
  REMOVE_EXTERNAL_LISTENER,
  INIT_EXTERNAL_CONNECTION,
  CLOSE_EXTERNAL_CONNECTION
} from './types';

export const emitMessage = (eventName, message) => ({
  type: EMIT_MESSAGE,
  data: { eventName, message }
});

export const emitExternalMessage = (eventName, message, url, handshake) => ({
  type: EMIT_EXTERNAL_MESSAGE,
  data: { eventName, message, url, payload: handshake }
});

export const removeAllListeners = () => ({
  type: REMOVE_ALL_LISTENERS
});

export const initExternalConnection = (url, handshake) => ({
  type: INIT_EXTERNAL_CONNECTION,
  data: { url, handshake }
});

export const closeExternalConnection = () => ({
  type: CLOSE_EXTERNAL_CONNECTION
});

export const removeAllExternalListeners = () => ({
  type: REMOVE_ALL_EXTERNAL_LISTENERS
});

export const addListener = (room, eventName, handler) => ({
  type: ADD_LISTENER,
  data: { room, eventName, handler }
});

//TODO: add ability to init multiple external connections
export const addExternalListener = (eventName, handler) => ({
  type: ADD_EXTERNAL_LISTENER,
  data: { eventName, handler }
});

export const removeListener = (eventName) => ({
  type: REMOVE_LISTENER,
  data: { eventName }
});

export const removeExternalListener = (eventName) => ({
  type: REMOVE_EXTERNAL_LISTENER,
  data: { eventName }
});
