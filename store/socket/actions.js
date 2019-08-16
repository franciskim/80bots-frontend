import { ADD_LISTENER, EMIT_MESSAGE, REMOVE_ALL_LISTENERS, REMOVE_LISTENER } from './types';

export const emitMessage = (eventName, message) => ({
  type: EMIT_MESSAGE,
  data: { eventName, message }
});

export const removeAllListeners = () => ({
  type: REMOVE_ALL_LISTENERS
});

export const addListener = (room, eventName, handler) => ({
  type: ADD_LISTENER,
  data: { room, eventName, handler }
});

export const removeListener = (eventName) => ({
  type: REMOVE_LISTENER,
  data: { eventName }
});
