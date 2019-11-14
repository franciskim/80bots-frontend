import {
  SUBSCRIBE_CHANNEL,
  UNSUBSCRIBE_CHANNEL,
  ADD_LISTENER,
  ADD_WHISPER_LISTENER,
  REMOVE_WHISPER_LISTENER,
  EMIT_MESSAGE,
  REMOVE_ALL_LISTENERS,
  REMOVE_LISTENER,
  GET_CHANNEL
} from './types';

export const subscribe = (channel, isPrivate = false) => ({
  type: SUBSCRIBE_CHANNEL,
  data: {
    channel,
    isPrivate
  }
});

export const unsubscribe = (channel) => ({
  type: UNSUBSCRIBE_CHANNEL,
  data: {
    channel
  }
});

export const stopListeningForWhisper = (channel, signal) => ({
  type: REMOVE_WHISPER_LISTENER,
  data: { channel, signal }
});

export const listenForWhisper = (channel, signal, callback) => ({
  type: ADD_WHISPER_LISTENER,
  data: { channel, signal, callback }
});

export const addListener = (room, eventName, handler) => ({
  type: ADD_LISTENER,
  data: { room, eventName, handler }
});

export const emitMessage = (eventName, message) => ({
  type: EMIT_MESSAGE,
  data: { eventName, message }
});

export const removeAllListeners = () => ({
  type: REMOVE_ALL_LISTENERS
});

export const removeListener = (eventName) => ({
  type: REMOVE_LISTENER,
  data: { eventName }
});

export const getChannel = (channel) => ({
  type: GET_CHANNEL,
  data: { channel }
});