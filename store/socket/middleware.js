import io from 'socket.io-client';
import Echo from 'laravel-echo';
import { success, error } from 'redux-saga-requests';
import {
  ADD_LISTENER,
  REMOVE_LISTENER,
  REMOVE_ALL_LISTENERS,
  EMIT_MESSAGE,
  SUBSCRIBE_CHANNEL,
  UNSUBSCRIBE_CHANNEL,
  ADD_WHISPER_LISTENER,
  REMOVE_WHISPER_LISTENER,
  GET_CHANNEL
} from './types';
import {
  AUTH_CHECK,
  LOGIN,
  REGISTER
} from '../auth/types';
export default function createWebSocketMiddleware() {
  return (store) => {
    const { dispatch } = store;
    let socket;
    let rooms = {};

    const connect = () => {
      return socket = new Echo({
        broadcaster: 'socket.io',
        authEndpoint: process.env.SOCKET_AUTH_URL,
        host: process.env.SOCKET_URL,
        client: io,
        auth: {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          }
        },
        transports: ['websocket', 'polling', 'flashsocket']
      });
    };
    return next => action => {
      switch (action.type) {
        case success(REGISTER):
        case success(LOGIN):
        case success(AUTH_CHECK): {
          socket = connect();
          return next(action);
        }
        case error(REGISTER):
        case error(LOGIN):
        case error(AUTH_CHECK): {
          socket = null;
          return next(action);
        }
        case GET_CHANNEL: {
          const { channel } = action.data;
          return rooms[channel];
        }
        case SUBSCRIBE_CHANNEL: {
          const { channel, isPrivate } = action.data;
          if(!socket) {
            socket = connect();
          }
          rooms[channel] = isPrivate ? socket.private(channel) : socket.channel(channel);
          return next(action);
        }
        case UNSUBSCRIBE_CHANNEL: {
          const { channel } = action.data;
          rooms[channel]?.unsubscribe();
          return next(action);
        }
        case ADD_LISTENER: {
          if(socket && !rooms[action.data.room]) rooms[action.data.room] = socket.channel(action.data.room);
          return rooms[action.data.room]?.listen(action.data.eventName, action.data.handler);
        }
        case ADD_WHISPER_LISTENER: {
          const { channel, signal, callback } = action.data;
          rooms[channel]?.listenForWhisper(signal, callback);
          return next(action);
        }
        case REMOVE_WHISPER_LISTENER: {
          const { channel, signal } = action.data;
          rooms[channel]?.stopListeningForWhisper(signal);
          return next(action);
        }
        case REMOVE_LISTENER:
          return rooms[action.data.room] && rooms[action.data.room].stopListening(action.data.eventName);
        case REMOVE_ALL_LISTENERS: {
          for(let key in rooms) {
            if (rooms.hasOwnProperty(key)) {
              socket.leave(key);
            }
          }
          rooms = {};
          break;
        }
        case EMIT_MESSAGE:
          return socket.emit(action.data.eventName, action.data.message);

        default: return next(action);
      }
    };
  };
}
